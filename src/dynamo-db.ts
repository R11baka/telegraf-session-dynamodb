import { SessionStore } from "telegraf";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ReturnValue,
} from "@aws-sdk/client-dynamodb";

interface NewPoolOpts {
  table?: string;
  region: string;
}

export function DynamoDbStore<Session>(opts: NewPoolOpts): SessionStore<Session> {
  if (!opts.region) {
    throw new Error("Please specify region for dynamodb session table. For example:us-west-1");
  }
  const client = new DynamoDBClient({ region: opts.region });
  const table = opts.table ?? "telegraf-sessions";

  return {
    async get(key) {
      const command = new GetItemCommand({
        TableName: table,
        Key: {
          key: {
            S: key,
          },
        },
      });

      const response = await client.send(command);
      if (response.Item?.session?.["S"]) {
        return JSON.parse(response.Item?.session["S"]) as Session;
      }
    },
    async set(key: string, val: Session) {
      const input = {
        Key: {
          key: {
            S: key,
          },
        },
        ReturnValues: ReturnValue.ALL_NEW,
        TableName: table,
        UpdateExpression: "SET #session = :s",
        ExpressionAttributeNames: {
          "#session": "session",
        },
        ExpressionAttributeValues: {
          ":s": {
            S: JSON.stringify(val),
          },
        },
      };
      const command = new UpdateItemCommand(input);
      await client.send(command);
    },
    async delete(key: string) {
      const command = new DeleteItemCommand({
        TableName: table,
        Key: {
          key: { S: key },
        },
      });
      await client.send(command);
    },
  };
}

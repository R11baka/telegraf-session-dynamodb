# DynamoDB session for [Telegraf](https://github.com/telegraf/telegraf)

Session store in DynamoDB for telegraf bot framework

## Installation

Install my-project with npm

```bash
  npm install telegraf-session-dynamodb
```

## Prerequites
1. Installed @aws-sdk/client-dynamodb
2. Table for storing sessions

## How to use ?
You have to pass in DynamoDb store 2 parameters. region where you created table and name of the table. 
in example below ```region: "us-east-1"``` and table name ```table: "telegraf-sessions"```

```javascript
import { Telegraf, Markup } from "telegraf";

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!');
const bot = new Telegraf(BOT_TOKEN);

const store = DynamoDbStore<{}>({
  region: "us-east-1",
  table: "telegraf-sessions"
});
bot.use(session(
  {store: store}
));

const keyboard = Markup.inlineKeyboard([
  Markup.button.url("❤️", "http://telegraf.js.org"),
  Markup.button.callback("Delete", "delete"),
]);

bot.start(ctx => ctx.reply("Hello"));
bot.help(ctx => ctx.reply("Help message"));
bot.on("message", ctx => ctx.copyMessage(ctx.message.chat.id, keyboard));
bot.action("delete", ctx => ctx.deleteMessage());

bot.launch();
```

```javascript


```




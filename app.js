const parseModule = require("./parse");

const TelegramBot = require("node-telegram-bot-api");
const token = "";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/curse/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Выберите какой курс вас интересует", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Покупка - ↓",
            callback_data: "S"
          },
          {
            text: "Продажа - ↑",
            callback_data: "B"
          },
          {
            text: "⚙",
            callback_data: "Settings"
          }
        ]
      ]
    }
  });

  bot.on("callback_query", query => {
    const id = query.message.chat.id;
    if (query.data === "S") {
      bot.sendMessage(id, "Выберите валюту", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "€ - EUR",
                callback_data: "EUR"
              },
              {
                text: "$ - USD",
                callback_data: "USD"
              },
              {
                text: "₽ - RUB",
                callback_data: "RUB"
              }
            ]
          ]
        }
      });
    } else if (query.data === "B") {
      bot.sendMessage(id, "Выберите валюту", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "€ - EUR",
                callback_data: "EURb"
              },
              {
                text: "$ - USD",
                callback_data: "USDb"
              },
              {
                text: "₽ - RUB",
                callback_data: "RUBb"
              }
            ]
          ]
        }
      });
    }
    else if (query.data === "Settings") {
      bot.sendMessage(id, "Выберите валюту", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Уведомления - 🔔",
                callback_data: "Message"
              },
              {
                text: "Настройки валют - 💲",
                callback_data: "Valuta"
              }
            ]
          ]
        }
      });
    }
    query.data = "";
  });
});

bot.on("callback_query", query => {
  const id = query.message.chat.id;
  var currency = query.data;
  if (currency.length === 3 || currency.length === 4) {
    switch (currency) {
      case "EUR":
        url = "https://finance.i.ua/market/kiev/eur/?type=1";
        break;
      case "USD":
        url = "https://finance.i.ua/market/kiev/usd/?type=1";
        break;
      case "RUB":
        url = "https://finance.i.ua/market/kiev/rub/?type=1";;
        break;
      case "USDb":
        url = "https://finance.i.ua/market/kiev/usd/?type=2";
        break;
      case "EURb":
        url = "https://finance.i.ua/market/kiev/eur/?type=2";
        break;
      case "RUBb":
        url = "https://finance.i.ua/market/kiev/rub/?type=2";
        break;
    }
    parseModule.parseSite(url, bot, id, currency);
  }
});

bot.on("callback_query", query => {
  const chatId = query.message.chat.id;
  //console.log(query.data);
  if (query.data === "Message")


    bot.sendMessage(chatId, "Тут будут настройки уведомлений");
  if (query.data === "Valuta")
    bot.sendMessage(chatId, "Тут будут настройки валют");
});

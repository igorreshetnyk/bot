const needle = require("needle");
const cheerio = require("cheerio");
const fs = require("fs");

var parseSite = function (url, bot, id, currency) {
  needle.get(url, function (err, res) {
    if (err) throw err;
    var $ = cheerio.load(res.body), rows = $("tr");
    rows.splice(0, 1);
    resultArray = [];

    rows.each(function (j, cell) {
      isExpired = $(cell).attr("class");

      if (!isExpired && $(cell).attr("data-amount")) {
        count = $(cell).attr("data-amount");
        ratio = $(cell).attr("data-ratio");
        time = $(cell).find("time").text().trim();
        v = "⏰" + time + "  💱" + (ratio * 1).toFixed(2) + "  💰" + count.slice(0, -2);
        resultArray.push(v);
      }
    });

    resultArray = resultArray.sort().reverse().slice(0, 10);

    if (currency.length === 4) {
      var resultString =
        "Курс продажи 🇺🇦 ➜ " + valute(currency.slice(0, -1)) +
        "\n\n" + resultArray.join("\n");
    } else if (currency.length === 3) {
      var resultString = "Курс покупки " + valute(currency) + " ➜ 🇺🇦" +
        "\n\n" + resultArray.join("\n");
    } else {
      resultString = "Сейчас нет данных для: " + currency;
    }
    bot.sendMessage(id, resultString);
  });
};

function valute(val) {
  switch (val) {
    case "USD":
      val = "🇺🇸";
      break;
    case "EUR":
      val = "🇪🇺";
      break;
    case "RUB":
      val = "🇷🇺";
      break;
  }
  return val;
}

module.exports.parseSite = parseSite;

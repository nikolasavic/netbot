var request = require('request'),
    storedData;

  if(process.env.ENVIRONMENT == 'development') {
    storedData = require('../dev/cardData.json');
  }

function fetchCardData(controller, bot) {
  var url = process.env.MONGODB_URI,
      data;

  if(process.env.ENVIRONMENT == 'development') {
    // Development
    data = {id: 'all_cards', data: storedData.data};
    controller.storage.teams.save(data);
    bot.botkit.log('Developement: Card data saved from storedData');
    bot.botkit.log('data.data[0]: ', data.data[0]);
  } else {
   // Production
    request('http://netrunnerdb.com/api/2.0/public/cards', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        data = {id: 'all_cards', data: JSON.parse(body).data}
        controller.storage.teams.save(data);
        bot.botkit.log('Production: Card data saved from api request');
        bot.botkit.log('data.data[0]: ', data.data[0]);
      };
    });
  };
};

module.exports = fetchCardData;

if (!process.env.TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit'),
    os = require('os'),
    mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGODB_URI }),
    fetchCardData = require('./lib/fetchCardData.js'),
    search = require('./lib/search.js');

var controller = Botkit.slackbot({
  storage: mongoStorage,
});

var bot = controller.spawn({
  token: process.env.TOKEN
}).startRTM();

// On startup fetch and store card data frm api
fetchCardData(controller, bot);

controller.hears(['{{(.*)}}'],'direct_message,direct_mention,mention,ambient', function(bot, message){
  var url,
      title;

  title = message.match[1];
  controller.storage.teams.get('all_cards', function(err, data) {
    url = search(data.data, title)
    bot.reply(message, url);
  });

});

controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
                 'direct_message,direct_mention,mention,ambient', function(bot, message) {

  var hostname = os.hostname(),
      uptime = formatUptime(process.uptime());

  bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
            '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
  var unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit + 's';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}

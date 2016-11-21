if (!process.env.TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
      debug: true,
});

var bot = controller.spawn({
  token: process.env.TOKEN
}).startRTM();

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

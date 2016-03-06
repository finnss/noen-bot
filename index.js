var Botkit = require('botkit');
var os = require('os');
var request = require('request');

var users;
var exclude = []
if (process.env.EXCLUDE) {
    var raw = process.env.EXCLUDE;
    exclude = raw.trim().split(',');
}
const prefixes = [
    'Time to shine', "The work doesn't do itself", 'Get going', 'lol rekt',
    'About time you got picked', 'RIP', 'Move it'
];

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.TOKEN
}).startRTM(function(err, bot, payload) {
    if (err) {
        console.log(err)
    }
    this.users = payload.users.filter(user =>
        !user.deleted &&
        !user.is_bot &&
        user.id != 'USLACKBOT' &&
        exclude.indexOf(user.name) == -1
    );
});

// For mentions of the bot with it's own username
controller.on('mention,direct_mention',function(bot,message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        controller.storage.users.save(user,function(err, id) {
            const rekt = this.users[Math.floor(Math.random() * this.users.length)];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            bot.reply(message,{
              text: prefix + ', ' + '<@' + rekt.id + '>!',
              username: "noen",
              icon_url: rekt.profile.image_48,
            });
        });
    });

});

// For mentions of @noen in the creator's Slack team where the name @noen was taken
// Uneccesary if your bot has the name you want it to
// ID of deleted bot 'noen': U0PJQJ0R4
controller.hears(['@noen', '<@U0PJQJ0R4>'],'ambient,message_recieved',function(bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        controller.storage.users.save(user,function(err, id) {
            const rekt = this.users[Math.floor(Math.random() * this.users.length)];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            bot.reply(message,{
              text: prefix + ', ' + '<@' + rekt.id + '>!',
              username: "noen",
              icon_url: rekt.profile.image_48,
            });
        });
    });

});

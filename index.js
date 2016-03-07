var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var global_users;
var channels;
var current_channel;
var channel_users;

var bot = controller.spawn({
    token: process.env.TOKEN
}).startRTM(function(err, bot, payload) {
    if (err) {
        console.log(err)
    } else {
        // This callback is where we get all the data. We save the parts we want:
        global_users = payload.users.filter(user =>
            !user.deleted &&
            !user.is_bot &&
            user.id != 'USLACKBOT' &&
            exclude.indexOf(user.name) == -1
        );
        channels = payload.channels;
    }
});

var exclude = []
if (process.env.EXCLUDE) {
    var raw = process.env.EXCLUDE;
    exclude = raw.trim().split(',');
}

const prefixes = [
    'Time to shine', "The work doesn't do itself", 'Get going', 'lol rekt',
    'About time you got picked', 'RIP', 'Move it'
];

// For mentions of the bot with its' own username
controller.on('mention,direct_mention',function(bot,message) {

    // Find which users are in the current channel
    current_channel = channels.filter(channel => channel.id == message.channel)[0];
    channel_users = global_users.filter(user => current_channel.members.indexOf(user.id) != -1);

    // Emoji reaction
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });

    // Actual reply
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        controller.storage.users.save(user, function(err, id) {
            const rekt = channel_users[Math.floor(Math.random() * channel_users.length)];
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

    // Find which users are in the current channel
    var channels_the_bot_is_in = channels.filter(channel => channel.is_member);
    // Each channel has a 'latest' field, which tells us how recently someone
    // has posted there. The most recent one is our current channel, because the
    // callback we get our data from is triggered by a message in that channel:
    current_channel = channels_the_bot_is_in.sort(function(channel1, channel2) {
        var channel1int = parseInt(channel1.latest.split('.')[0]);
        var channel2int = parseInt(channel2.latest.split('.')[0]);
        return(channel2int - channel1int);
    })[0];
    channel_users = global_users.filter(user => current_channel.members.indexOf(user.id) != -1);

    // Emoji reaction
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });

    // Actual reply
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        controller.storage.users.save(user, function(err, id) {
            const rekt = channel_users[Math.floor(Math.random() * channel_users.length)];
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            bot.reply(message,{
              text: prefix + ', ' + '<@' + rekt.id + '>!',
              username: "noen",
              icon_url: rekt.profile.image_48,
            });
        });
    });

});

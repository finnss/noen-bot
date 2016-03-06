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
        exclude.indexOf(user.name) == -1
    );
    console.log(this.users);
});
/*
var call_api = function(command, cb) {
    request.post('https://slack.com/api/' + command, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            if (json.ok) {
                if (cb) cb(null, json);
            } else {
                if (cb) cb(json.error, json);
            }
        } else {
            if (cb) cb(error);
        }
    }).form({token: process.env.TOKEN});
};

call_api('users.list', function(err, identity) {
    console.log('id: ' + JSON.stringify(identity, null, 2));
});

console.log('\n*************\n');

call_api('users.list', function(err, identity) {
    console.log('id: ' + JSON.stringify(identity.members.filter(user => user.deleted === true), null, 2));
});
*/
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

// Deleted bot 'noen' id: U0PJQJ0R4
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

var Botkit = require('botkit');
var os = require('os');

var users;
var rekables = [
    'tmsolber','kotlarz','finn','edvardvb','eirsyl','ek',
    'hww','martinhath','orhan','tib','hanse','arve','kristine',
    'nicholat','tjelsa','xmaz'
];
const prefixes = [
    'Time to shine', "The work doesn't do itself", 'Get going', 'lol rekt',
    'About time you got picked', 'Oh shit, you actually have to do something',
    'I guess this one didn\t matter anyway', 'RIP', ':rekt:'
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
    this.users = payload.users.filter(user => rekables.indexOf(user.name) != -1);
});


controller.hears(['@noen', 'noen'],'ambient,message_recieved,direct_message,direct_mention,mention',function(bot, message) {
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

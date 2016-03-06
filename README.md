# noen-bot
Simple bot for Slack. 

### Usage

This bot reacts whenever anyone says "@noen" or whatever you decide to name your bot. It responds by tagging a random user from your team, together with a randomly selected phrase from a predetermined list.

### Setup
```bash
git clone git@github.com:webkom/noen-bot
cd noen-bot
npm install
```
This will set up and install the required files on your computer. However, to start the bot, you need to create a new bot on your Slack.
1. https://<YOURTEAMNAME>.slack.com/apps/manage/A0F7YS25R-bots
2. Add configuration
3. Give your bot a name (Standard 'noen', but anything works)
4. Copy the the API Token, you will need this for later.
5. Invite your bot to the channels you want it to function in by typing ```bash /invite @<BOTNAME> ``` in the respective channels.

Now that you have your API Token, we can run the bot. Navigate to the folder from earlier, and type
```bash
TOKEN=<YOURTOKENHERE> node index.js
````
And that's it! Tagging @noen (or whatever you chose) should trigger a response that tags a random user in your team.

### Options
You also have the option to exclude any number of members from the bot's user list. When running the bot, simply include a list of the usernames you would like to exclude as such:
```bash
TOKEN=<YOURTOKENHERE> EXCLUDE=user1,user2,user3 node index.js
````
Note that there can be no whitespaces in between the usernames.

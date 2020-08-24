const Discord = require('discord.js')

const Google = require('./commands/Google')
const Ping = require('./commands/ping')
const YouTube = require('./commands/youtube')

const client = new Discord.Client();
const config = require('./config.json');

const Say = require('./commands/say');

const bot = new Discord.Client()

client.config = config;

bot.on('ready', function () {
    console.log('Bot started with success')
    // bot.user.setAvatar('./bot.png').catch(console.error)
    bot.user.setActivity('Bot !').catch(console.error)
})

bot.on('guildMemberAdd', function (member) {
    member.createDM().then(function (channel) {
        return channel.send('Bienvenue sur le serveur de test ! ' + member.displayName)
    }).catch(console.error)
})

bot.on('message', function (message) {
    let commandUsed = Ping.parse(message) || YouTube.parse(message) || Say.parse(message) || Google.parse(message)
})
                                                                       
bot.login(config.token)
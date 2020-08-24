const Discord = require('discord.js')

// Fun
const Ping = require('./commands/ping')

// Faire des recherches
const Google = require('./commands/Google')
const YouTube = require('./commands/youtube')
const Doc = require('./commands/doc')

// Dire un message depuis le bot
const Say = require('./commands/say');

const client = new Discord.Client();
const config = require('./config.json');

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
    let commandUsed = Ping.parse(message) || YouTube.parse(message) || Doc.parse(message) || Say.parse(message) || Google.parse(message)
})
                                                                       
bot.login(config.token)
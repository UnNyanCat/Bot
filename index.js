const Discord = require('discord.js')

const fs = require('fs')

// Fun
const Ping = require('./commands/ping')

// Faire des recherches
const Google = require('./commands/Google')
const YouTube = require('./commands/youtube')
const Doc = require('./commands/doc')

// Dire un message depuis le bot
const Say = require('./commands/say');

const client = new Discord.Client();

const token = require('./token.json')
const config = require('./config.json');

// DataBase
const bdd = require('./bdd.json')

// Permissions
const permission = require('permission.json')

const bot = new Discord.Client()

client.config = config;

bot.on('ready', async () => {
    console.log('Bot started with success')
    // bot.user.setAvatar('./bot.png').catch(console.error)
    bot.user.setStatus('dnd')
    setTimeout(() => {
        bot.user.setActivity('Bot !', {type: 'LISTENING'} ).catch(console.error)
    }, 100)
})

bot.on('guildMemberAdd', member => {
    bot.channels.cache.get('747133988333944913').send(`Bienvenue sur le serveur ${member} !`)
    member.roles.add('747451039363629076')
})

bot.on('message', message => {

    if(message.content.startsWith(`${config.prefix}clear`)){
        message.delete()
        if(message.member.hasPermission(permission.message)){

            let args = message.content.trim().split(/ +/g);

            if(args[1]){
                if(!isNaN(args[1] && args[1] >= 1 && args[1] <= 99)) {

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Vous avez bien supprimé ${args[1]} messages !`)
                } else {
                    message.channel.send('Vous devez indiquer une valeur entre 1 et 99')
                }
            } else {
                message.channel.send('Veuillez utiliser la commande comme ceci :\n\n!clear (valeur)')
            }
        } else {
            message.channel.send('Vous devez avoir la permission : MANAGE_MESSAGES')
        }
    }

    if(message.content.startsWith(`${config.prefix}welcome`)){
        message.delete()
        if(message.member.hasPermission(permission.message)){
            if(message.content.length > 9){
                message_bienvenue = message.content.slice(9)
                bdd['message-bienvenue'] = message_bienvenue
                saveBdd()
            } else {
                welcome = '!welcome'
                message.channel.send(`Vous devez mettre un message après ${welcome} !`)
            }
        } else {
            message.channel.send(`Vous n'avez pas la permission : `)
        }
    }

    let commandUsed = Ping.parse(message) || YouTube.parse(message) || Doc.parse(message) || Say.parse(message) || Google.parse(message)
})

function saveBdd() {
    fs.writeFile('./bdd.json', JSON.stringify(bdd, null, 4), (error) => {
        if (error) message.channel.send('Une erreur est survenue');
    });
}

bot.login(token.token)
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

const token = require('./token.json')
const prefix = require('./prefix.json');

// DataBase
const bdd = require('./bdd.json')

// Permissions
const permission = require('./permission.json')

const bot = new Discord.Client()

bot.on('ready', async () => {
    console.log('Bot started with success')
    // bot.user.setAvatar('./bot.png').catch(console.error)
    bot.user.setStatus('dnd')
    setTimeout(() => {
        bot.user.setActivity('Bot !', {type: 'LISTENING'} ).catch(console.error)
    }, 100)
})

bot.on('guildMemberAdd', member => {
    if(bdd["message-bienvenue"]){
        bot.channels.cache.get('747133988333944913').send(bdd["message-bienvenue"])
    } else {
        bot.channels.cache.get('747133988333944913').send("Bienvenue sur le serveur")
    }
    member.roles.add(bdd["role"])
})

bot.on('message', message => {

    if(message.content.startsWith(`${prefix.prefix}clear`)){
        message.delete()
        if(message.member.hasPermission(`${permission.message}`)){

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
            message.channel.send(`${permission.no_perm}`)
        }
    }

    if(message.content.startsWith(`${prefix.prefix}welcome`)){
        message.delete()
        if(message.member.hasPermission(`${permission.message}`)){
            if(message.content.length > 9){
                message_bienvenue = message.content.slice(9)
                bdd['message-bienvenue'] = message_bienvenue
                saveBdd()
            } else {
                welcome = '!welcome'
                message.channel.send(`Vous devez mettre un message après ${welcome} !`)
            }
        } else {
            message.channel.send(`${permission.no_perm}`)
        }
    }

    if(message.content.startsWith(`${prefix.prefix}warn`)){
        message.delete()
        if (message.member.hasPermission('BAN_MEMBERS')) {

            if(!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if(bdd["warn"][utilisateur] === 2){

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
                message.channel.send(`User a été ban du serveur car il à eu 3 warns !`)
            } else {
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1
                    saveBdd();
                    message.channel.send(`User à maintenant : ` + bdd["warn"][utilisateur] + " avertissement(s)");
                } else {
                    bdd["warn"][utilisateur]++
                    saveBdd();
                    message.channel.send(`User à maintenant : ` + bdd["warn"][utilisateur] + " avertissement(s)");
                }
            }
        } else {
            message.channel.send(`${permission.no_perm}`)
        }
    }

    if(message.content.startsWith(`${prefix.prefix}stats`)){
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
    }

    let commandUsed = Ping.parse(message) || YouTube.parse(message) || Doc.parse(message) || Say.parse(message) || Google.parse(message)
})

function saveBdd() {
    fs.writeFile('./bdd.json', JSON.stringify(bdd, null, 4), (error) => {
        if (error) message.channel.send('Une erreur est survenue');
    });
}

bot.login(token.token)
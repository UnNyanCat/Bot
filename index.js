const Discord = require('discord.js')

const fs = require('fs')

// Fun
const Ping = require('./commands/ping')

// Faire des recherches
const Google = require('./commands/Google')
const YouTube = require('./commands/youtube')
const Doc = require('./commands/doc')

// Code du bot
const Code = require('./commands/code')

// Dire un message depuis le bot
const Say = require('./commands/say');

// Token du bot
const token = require('./token.json')

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
    member.roles.add(bdd["rank-bienvenue"])
})

bot.on('message', message => {

    if (message.author.bot) return;

    if(message.content.startsWith(`${bdd.prefix}clear`)){
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

    if(message.content.startsWith(`${bdd.prefix}rank`)){
        message.delete()
        if(message.member.hasPermission(`${permission.message}`)){
            if(message.content.length > 5){
                rank_bienvenue = message.content.slice(6)
                bdd["rank-bienvenue"] = rank_bienvenue
                saveBdd()
            } else {
                rank = '!rank'
                message.channel.send(`Vous devez mettre un message après ${rank} !`)
            }
        } else {
        message.channel.send(`${permission.no_perm}`)
        }
    }

    if(message.content.startsWith(`${bdd.prefix}welcome`)){
        message.delete()
        if(message.member.hasPermission(`${permission.message}`)){
            if(message.content.length > 9){
                message_bienvenue = message.content.slice(9)
                bdd["message-bienvenue"] = message_bienvenue
                saveBdd()
            } else {
                welcome = '!welcome'
                message.channel.send(`Vous devez mettre un message après ${welcome} !`)
            }
        } else {
            message.channel.send(`${permission.no_perm}`)
        }
    }

    if(message.content.startsWith(`${bdd.prefix}warn`)){
        message.delete()
        if (message.member.hasPermission('BAN_MEMBERS')) {

            args = message.content.slice(5)
            if(!message.mentions.users.first()) return;
            utilisateur = message.mentions.users.first().id

            if(bdd["warn"][utilisateur] === 2){

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
                message.channel.send(`${message.member} a été ban du serveur car il à eu 3 warns !`)
            } else {
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1
                    saveBdd();
                    message.channel.send(`${message.member} à maintenant : ` + bdd["warn"][utilisateur] + " avertissement(s)");
                } else {
                    bdd["warn"][utilisateur]++
                    saveBdd();
                    message.channel.send(`${message.member} à maintenant : ` + bdd["warn"][utilisateur] + " avertissement(s)");
                }
            }
        } else {
            message.channel.send(`${permission.no_perm}`)
        }
    }

    if(message.content.startsWith(`${bdd.prefix}stats`)){
        let onlines = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;

        const myEmbed = new Discord.MessageEmbed()
            .setColor('#4788c9')
            .setTitle('Statistiques')
            .setURL('https://discord.gg/xp8HcdE')
            .setAuthor('Bot Test')
            .setDescription('Stats')
            .addFields(
                { name: 'Onlines', value: `${onlines}` },
                { name: '\u200B', value: '\u200B' },
                { name: 'Total Members', value: `${totalmembers}`, inline: true },
                { name: 'Total Servers', value: `${totalservers}`, inline: true },
            )
            .addField('Bots', `${totalbots}`, true)
            .setTimestamp()
            .setFooter('Stats');

        message.channel.send(myEmbed);
    }

    if(message.content.startsWith(`${bdd.prefix}lvl`)){
        if (bdd["statut-level"] === true) {
            bdd["statut-level"] = false
            saveBdd();
            return message.channel.send('Vous venez d\'arreter le système de level !')
        } else {
            bdd["statut-level"] = true
            saveBdd();
            return message.channel.send('Vous venez d\'allumer le système de level !')
        }
    }
    if (bdd["statut-level"] === true) {
        if (message.content.startsWith(`${bdd.prefix}level`)) {
            if (!bdd["coins-utilisateurs"][message.member.id]) {
                return message.channel.send('Vous n\'avez pas encore posté de message !')
            } else {
                return message.channel.send(`Vous avez ${bdd["coins-utilisateurs"][message.member.id]} points !\nEt vous êtes au level ${bdd["level-utilisateurs"][message.member.id]}`)
            }
        } else {
            addRandomInt(message.member);
            if (!bdd["coins-utilisateurs"][message.member.id]) {
                bdd["coins-utilisateurs"][message.member.id] = Math.floor(Math.random() * (4 - 1) + 1);
                bdd["level-utilisateurs"][message.member.id] = 0
                saveBdd();
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 100 && bdd["coins-utilisateurs"][message.member.id] < 250) {
                if (bdd["level-utilisateurs"][message.member.id] === 0) {
                    bdd["level-utilisateurs"][message.member.id] = 1;
                saveBdd();
                return message.channel.send(`Bravo ${message.author} tu es passé niveau ${bdd["level-utilisateurs"][message.member.id]} !`)
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 250 && bdd["coins-utilisateurs"][message.member.id] < 500) {
                if (bdd["level-utilisateurs"][message.member.id] === 1) {
                    bdd["level-utilisateurs"][message.member.id] = 2;
                saveBdd();
                return message.channel.send(`Bravo ${message.author} tu es passé niveau ${bdd["level-utilisateurs"][message.member.id]} !`)
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 500 && bdd["coins-utilisateurs"][message.member.id] < 1000) {
                if (bdd["level-utilisateurs"][message.member.id] === 2) {
                    bdd["level-utilisateurs"][message.member.id] = 3;
                saveBdd();
                return message.channel.send(`Bravo ${message.author} tu es passé niveau ${bdd["level-utilisateurs"][message.member.id]} !`)
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 1000 && bdd["coins-utilisateurs"][message.member.id] < 1500) {
                if (bdd["level-utilisateurs"][message.member.id] === 3) {
                    bdd["level-utilisateurs"][message.member.id] = 4;
                saveBdd();
                return message.channel.send(`Bravo ${message.author} tu es passé niveau ${bdd["level-utilisateurs"][message.member.id]} !`)
                }
            }
            else if (bdd["coins-utilisateurs"][message.member.id] > 1500 && bdd["coins-utilisateurs"][message.member.id] < 3000) {
                if (bdd["level-utilisateurs"][message.member.id] === 4) {
                    bdd["level-utilisateurs"][message.member.id] = 5;
                saveBdd();
                return message.channel.send(`Bravo ${message.author} tu es passé niveau ${bdd["level-utilisateurs"][message.member.id]} !`)
                }
            }
        }
    }
    else {
        message.channel.send('La commande est à : ' + bdd["statut-level"])
    }

    let commandUsed = Ping.parse(message) || YouTube.parse(message) || Doc.parse(message) || Code.parse(message) || Say.parse(message) || Google.parse(message)
})

function addRandomInt(member) {
    bdd["coins-utilisateurs"][member.id] = bdd["coins-utilisateurs"][member.id] + Math.floor(Math.random() * (4 - 1) + 1);
    saveBdd();
}

function saveBdd() {
    fs.writeFile('./bdd.json', JSON.stringify(bdd, null, 4), (error) => {
        if (error) message.channel.send('Une erreur est survenue');
    });
}

bot.login(token.token)
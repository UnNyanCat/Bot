const Command = require('./command')

module.exports = class Doc extends Command {

    static match (message) {
        return message.content.startsWith('!doc')
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        message.delete()
        message.reply('\nVoici le lien de la doc avec votre recherche\nhttps://discord.js.org/#/docs/main/stable/search?q=' + args.join('%20'))
    }
}
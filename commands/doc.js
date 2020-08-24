const Command = require('./command')
const shortcut = require('./shortcut.json')

module.exports = class Doc extends Command {

    static match (message) {
        return message.content.startsWith(`${shortcut.doc}`)
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        message.delete()
        if(args < 1){
            message.reply('Il manque une recherche')
        } else {
            message.reply('\nVoici le lien de la doc avec votre recherche\nhttps://discord.js.org/#/docs/main/stable/search?q=' + args.join('%20'))
        }
    }
}
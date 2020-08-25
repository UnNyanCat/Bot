const Command = require('./command')
const shortcut = require('./shortcut.json')

module.exports = class Code extends Command {

    static match (message) {
        return message.content.startsWith(`${shortcut.code}`)
    }

    static action (message) {
        message.delete()
        message.channel.send('Tu veux voir le code qui me fait vivre ? alors regarde la bas :\nhttps://github.com/UnNyanCat/Bot')
    }
}
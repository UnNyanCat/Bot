const Command = require('./command')
const shortcut = require('./shortcut.json')

module.exports = class Ping extends Command {

    static match (message) {
        return message.content.startsWith(`${shortcut.ping}`)
    }

    static action (message) {
        message.delete()
        message.reply('pong')
    }
}
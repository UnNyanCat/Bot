const Command = require('./command')
const shortcut = require('./shortcut.json')

module.exports = class Google extends Command {

    static match (message) {
        return message.content.startsWith(`${shortcut.google}`)
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        message.delete()
        message.reply('https://www.google.fr/#q=' + args.join('%20'))
    }
}
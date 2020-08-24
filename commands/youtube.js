const Command = require('./command')
const shortcut = require('./shortcut.json')

module.exports = class YouTube extends Command {

    static match (message) {
        return message.content.startsWith(`${shortcut.youtube}`)
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        message.delete()
        message.reply('https://www.youtube.com/results?search_query=' + args.join('%20'))
    }
}
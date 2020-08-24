const Command = require('./command')
const shortcut = require('./shortcut.json')

module.exports = class Say extends Command {
    
    static match (message) {
        return message.content.startsWith(`${shortcut.say}`)
    }

    static action (message) {
        let args = message.content.split(' ')
        args.shift()
        message.delete()
        message.channel.send('**Say**\n\n' + args.join(' '))
    }
}
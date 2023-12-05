const { Events } = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(MessageEvent) {
        if (MessageEvent.content.toLowerCase().includes("renata") && !MessageEvent.author.bot) {
            let channel = MessageEvent.channel
            channel.send("Actually, Amumu is better here")
        }
    }
}
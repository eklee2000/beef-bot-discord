const { Events } = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(MessageEvent) {
        if (MessageEvent.content.toLowerCase().includes("amumu") && !MessageEvent.author.bot) {
            channel = MessageEvent.channel
            channel.send("Actually, Renata is better here")
        }
    }
}
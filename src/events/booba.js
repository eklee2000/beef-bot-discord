const { Events } = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(MessageEvent) {
        if (MessageEvent.content.toLowerCase().includes("booba") && !MessageEvent.author.bot) {
            channel = MessageEvent.channel
            channel.send("(.)(.)")
        }
    }
}
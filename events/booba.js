const { Events } = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(MessageEvent) {
        if (MessageEvent.content.toLowerCase().includes("booba")) {
            channel = MessageEvent.channel
            channel.send("(.)(.)")
        }
    }
}
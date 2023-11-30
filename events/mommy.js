const { Events } = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(MessageEvent) {
        if (MessageEvent.content.toLowerCase().includes("mommy")) {
            channel = MessageEvent.channel
            channel.send("milky")
        }
    }
}
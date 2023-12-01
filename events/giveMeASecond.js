const { Events } = require('discord.js')

const secArray = ["gimme a sec",
 "give me a second",
"give me a sec",
"gimmie a sec",
"one sec"]

const oneImagePath = './images/bugs-bunny-one.png'

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(MessageEvent) {
        if (secArray.some(substring => MessageEvent.content.toLowerCase().includes(substring)) && !MessageEvent.author.bot) {
            channel = MessageEvent.channel
            channel.send({ files: [oneImagePath]})
        }
    }
}
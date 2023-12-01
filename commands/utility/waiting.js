const { SlashCommandBuilder } = require('discord.js');

const waitingImagePath = './resources/waiting.gif'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waiting')
        .setDescription('waiting gif'),
    async execute(interaction) {
        await interaction.reply({ files: [waitingImagePath]});
    },
};
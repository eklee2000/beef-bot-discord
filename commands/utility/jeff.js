const { SlashCommandBuilder } = require('discord.js');

const jeffImagePath = './images/jeff-mock-spongebob.png'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jeff')
        .setDescription('jeff will be back on time :)'),
    async execute(interaction) {
        await interaction.reply({ files: [jeffImagePath]});
    },
};
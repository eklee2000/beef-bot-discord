const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path')

const resourcePath = path.join(__dirname, '../../resources/jeff-mock-spongebob.png')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jeff')
        .setDescription('jeff will be back on time :)'),
    async execute(interaction) {
        await interaction.reply({ files: [resourcePath]});
    },
};
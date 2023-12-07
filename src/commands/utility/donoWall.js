const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path')

const resourcePath = path.join(__dirname, '../../resources/dono-wall.gif')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donowall')
        .setDescription('donowalled'),
    async execute(interaction) {
        await interaction.reply({ files: [resourcePath]});
    },
};
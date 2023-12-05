const { SlashCommandBuilder } = require('discord.js');

const donoWallImagePath = './resources/dono-wall.gif'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donowall')
        .setDescription('donowalled'),
    async execute(interaction) {
        await interaction.reply({ files: [donoWallImagePath]});
    },
};
const { SlashCommandBuilder } = require('discord.js');

const pogArr = ['<:1_:475181449105113098>',
'<:2_:475181455354494986>',
'<:3_:475181460924661760>',
'<:4_:475181470294474762>',
'<:5_:475181475851927571>',
'<:6_:475181481338077185>',
'<:7_:475181486878752768>',
'<:8_:475181492163706881>',
'<:9_:475181497905577984>']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pog')
        .setDescription('Sends big pog emote'),
    async execute(interaction) {
        await interaction.reply(`${pogArr[0]}${pogArr[1]}${pogArr[2]}\n${pogArr[3]}${pogArr[4]}${pogArr[5]}\n${pogArr[6]}${pogArr[7]}${pogArr[8]}\n`);
    },
};
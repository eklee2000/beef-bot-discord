const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('node:path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pizzapie')
        .setDescription('🎵 When the moon hits your eye 🎵'),
    async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;
        if (voiceChannel == null) {
            await interaction.reply({content: 'You need to be in a voice channel first', ephemeral: true})
            return
        } else {
            const resourcePath = path.join(__dirname, '../../resources/audio/pizzaPie.mp3')

            const pizzaPieAudio = createAudioResource(resourcePath)
            const player = createAudioPlayer();            

            const voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            const connection = getVoiceConnection(interaction.guildId)

            try {
                await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
                console.log("Connected: " + voiceChannel.guild.name);

            } catch (error) {
                console.log("Voice Connection not ready within 5s.", error);
                return null;
            }
      
            pizzaPieAudio.audio = 0.5;
            player.play(pizzaPieAudio);
            connection.subscribe(player);

            await interaction.reply({content: 'playing...', ephemeral: true})
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy()
            });
        }
    },
};

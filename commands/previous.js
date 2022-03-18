const Discord = require('discord.js')
const config = require("../config.js")
const { 
  joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
  getVoiceConnection
} = require('@discordjs/voice');
const Voice = require('@discordjs/voice');
const player = createAudioPlayer()

exports.run = async (bot, message, args, command, db) => {

  const serverQueue = bot.songQueue.get(message.guild.id);
  
        if (message.member.voice.channel !== undefined) {
            if (!message.guild.me.voice.channel) {
                message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
                return;
            }
            if (serverQueue.songs.length > 0) {
                serverQueue.previousSongIndex = serverQueue.currentSongIndex;
                var amount = Number.parseInt(args[0]);
                if (Number.isInteger(amount)) {
                    serverQueue.currentSongIndex -= amount;
                } else {
                    serverQueue.currentSongIndex--;
                }
                if (serverQueue.currentSongIndex < 0) {
                    serverQueue.currentSongIndex = 0;
                }
                serverQueue.reason = "prev";
                serverQueue.player.stop()
                //await bot.trigger(message, "prev");
                //serverQueue.connection.dispatcher.end("prev");
            } else {
                message.channel.send({content:"There are no more songs :sob:"}, { reply: message });
            }
        } else {
            message.channel.send({content:"You can't prev music if you're not in a voice channel :cry:"}, { reply: message });
        }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['prev'],
	permLevel: 'No permission need',
  manu: false
};

exports.help = {
	name: 'previous',
	category: 'music',
	description: 'for play previos song',
	usage: '$previous'
}
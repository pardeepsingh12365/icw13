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
  getVoiceConnection,
  Voice
} = require('@discordjs/voice');

exports.run = async (bot, message, args, command, db) => {

  const serverQueue = bot.songQueue.get(message.guild.id);
  const connection = getVoiceConnection(message.guild.id)
        if (message.member.voice.channel !== undefined) {
            if (!message.guild.me.voice.channel) {
                message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
                return;
            }
            if (serverQueue.songs.length > 0) {
                serverQueue.previousSongIndex = serverQueue.currentSongIndex;
                var amount = Number.parseInt(args[0]);
                if (Number.isInteger(amount)) {
                    serverQueue.currentSongIndex += amount;
                } else {
                    serverQueue.currentSongIndex++;
                  if (serverQueue) {
                        if (serverQueue.player) {
                          serverQueue.reason = "next";
                          serverQueue.player.stop()
                            //serverQueue.player.play(serverQueue.currentSongIndex++)
                        }
                  }
                }
                if (serverQueue.currentSongIndex > serverQueue.songs.length - 1) {
                    if (serverQueue) {
                      if (serverQueue.player) {
                        serverQueue.reason = "stopping";
                        serverQueue.player.stop();
                      }
                      bot.songQueue.delete(message.guild.id)
                    }
        
                    connection.destroy()
                    var finishembed = new Discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setAuthor("Finished playing because no more song in the queue", `${config.icwflashlogo}`)
                        .setDescription("please add more song if you like 🎧")
                        .setFooter("Developed by: PK#1650 ", `${config.pkflashlogo}`)
                        .setImage(config.icwflahimg)
                        .setTimestamp();
                    message.channel.send({ embeds: [finishembed] });
              
                }
            } else {
                message.channel.send({content:"There are no more songs :sob:"}, { reply: message });
            }
        } else {
            message.channel.send({content:"You can't hear my music if you're not in a voice channel :cry:"}, { reply: message });
        }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['next', 's'],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'skip',
	category: 'music',
	description: 'for skip the current song',
	usage: '$skip'
}
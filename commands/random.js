const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {

  const serverQueue = bot.songQueue.get(message.guild.id);

        if (message.member.voice.channel !== undefined) {
            if (!message.guild.me.voice.channel) {
                message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
                return;
            }
            if (serverQueue.songs.length > 0) {
                serverQueue.currentSongIndex = Math.floor(Math.random() * serverQueue.songs.length);
                serverQueue.reason = "random";
                serverQueue.connection.dispatcher.end("random");
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
	aliases: ['rand'],
	permLevel: 'No permission need',
  manu: false
};

exports.help = {
	name: 'random',
	category: 'music',
	description: 'for playing song randomly',
	usage: '$random'
}
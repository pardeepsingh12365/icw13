const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {

  const serverQueue = bot.songQueue.get(message.guild.id);
  
        if (message.member.voice.channel !== undefined) {
            if (!message.guild.me.voice.channel) {
                message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
                return;
            }
          if  (!serverQueue) return message.channel.send({content:"i have no song in queue"});
            if (serverQueue.songs.length > 0) {
                let arg = args.join("").substring(command.length);
                var index = Number.parseInt(arg);
                if (Number.isInteger(index)) {
                    serverQueue.previousSongIndex = serverQueue.currentSongIndex;
                    serverQueue.currentSongIndex = index - 1;
                    if (serverQueue.currentSongIndex < 0) {
                        serverQueue.currentSongIndex = 0;
                    } else if (serverQueue.currentSongIndex > serverQueue.length - 1) {
                        serverQueue.currentSongIndex = serverQueue.length - 1;
                    }
                    serverQueue.reason = "goto";
                    serverQueue.connection.dispatcher.end("goto");
                } else {
                    message.channel.send({content:`\`${arg}\` is an invalid index`}, { reply: message });
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
	aliases: ['go-to'],
	permLevel: 'No permission need',
  manu: false
};

exports.help = {
	name: 'goto',
	category: 'music',
	description: 'for playing direct song from queue',
	usage: '$goto <song number>'
}
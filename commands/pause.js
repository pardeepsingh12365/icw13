const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {

  let guildQueue = bot.player.getQueue(message.guild.id);
  
        if (message.member.voice.channel !== undefined) {
            if (!message.guild.me.voice.channel) {
                message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
                return;
            }
            if (guildQueue && !guildQueue.paused) {
                if (guildQueue.player) {
                   guildQueue.setPaused(true)
                   return message.channel.send({content:`${config.p} ${config.a} ${config.u} ${config.s} ${config.e} ${config.d}\n⏸ Paused the music for you!`});
                }
            }
            return message.channel.send({content:'There is nothing playing.'});
        } else {
            message.channel.send({content:"You can't pause music if you're not in a voice channel :cry:"}, { reply: message });
        }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['pau'],
	permLevel: 'No perm`ission need',
  manu: false
};

exports.help = {
	name: 'pause',
	category: 'music',
	description: 'for pause the music player',
	usage: '$pause'
}
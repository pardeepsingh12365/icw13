const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {

  let guildQueue = bot.player.getQueue(message.guild.id);
  
        if (message.member.voice.channel !== undefined) {
            if (!message.guild.me.voice.channel) {
                message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
                return;
            }
            if (guildQueue) {
              if (!guildQueue.paused)
                return message.channel.send({content: "Already playing"})
              if (guildQueue.player) {
                  guildQueue.setPaused(false);
                  return message.channel.send({content:`${config.r} ${config.e} ${config.s} ${config.u} ${config.m} ${config.e} ${config.d}\n▶ Resumed the music for you!`});
              }
            }
            return message.channel.send({content:'There is nothing playing.'});
        } else {
            message.channel.send({content:"You can't resume music if you're not in a voice channel :cry:"}, { reply: message });
        }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['res'],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'resume',
	category: 'music',
	description: 'for resume the music player',
	usage: '$resume'
}
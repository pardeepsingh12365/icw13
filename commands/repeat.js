const Discord = require('discord.js')
const config = require("../config.js")
const { RepeatMode } = require('discord-music-player');

exports.run = async (bot, message, args, command, db) => {
  let arg = args.join().substring(command.length);
  let ar = arg.slice().trim().split(/ +/g);
  let c = ar.shift().toLowerCase();

  let guildQueue = bot.player.getQueue(message.guild.id);
  if (message.member.voice.channel !== undefined) {
    if (guildQueue) {
      if (c === "one") {
        guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
        message.channel.send({content:"Now repeating \`\`one song\`\`"}, {reply: message});
      } else if (c === "all" || c === "queue" || c === "playlist" || c === "list") {
        guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
        message.channel.send({content:"Now repeating \`\`all song(queue)\`\`"}, {reply: message});
      } else if (c === "off" || c === "disable") {
        guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
        message.channel.send({content:"Repeat is \`\`off\`\`"}, {reply: message});
      } else {
        if (guildQueue.repeatMode === 0){
			    guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
			    message.channel.send({content:"Now repeating \`\`one song\`\`"}, {reply: message});
		    } else if (guildQueue.repeatMode === 1) {
			    guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
			    message.channel.send({content:"Now repeating \`\`all queue(queue)\`\`"}, {reply: message});
		    } else if (guildQueue.repeatMode === 2) {
          guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
          message.channel.send({content:"Repeat is \`\`off\`\`"}, {reply: message});
        }
      }
    }
  } else {
    message.channel.send({content:"You can't hear my music if you're not in a voice channel :cry:"}, { reply: message });
  }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['loop'],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'repeat',
	category: 'music',
	description: 'for repeat song automatically',
	usage: '$repeat'
}
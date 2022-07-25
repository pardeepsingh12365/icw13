const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {

  let guildQueue = bot.player.getQueue(message.guild.id);
  if (message.member.voice.channel !== undefined) {
    if (guildQueue) {
      guildQueue.shuffle();
      message.channel.send({content:"Queue shuffled successfully 🔀"});
      /*if(serverQueue.shuffle){
			  serverQueue.shuffle = false;
			  message.channel.send({content:"Shuffle is now disabled"}, {reply: message});
		  } else{
			  serverQueue.shuffle = true;
			  message.channel.send({content:"Shuffle is now enabled"}, {reply: message});
		  }*/
    }
  } else {
    message.channel.send({content:"You can't hear my music if you're not in a voice channel :cry:"}, { reply: message });
  }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'shuffle',
	category: 'music',
	description: 'for playing random song automatically',
	usage: '$shuffle'
}
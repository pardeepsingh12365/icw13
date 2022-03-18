const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {
  let arg = args.join().substring(command.length);
  let ar = arg.slice().trim().split(/ +/g);
  let c = ar.shift().toLowerCase();

  const serverQueue = bot.songQueue.get(message.guild.id);
  if (message.member.voice.channel !== undefined) {
    if (serverQueue) {
      if (c === "one") {
        serverQueue.repeat = "one";
        message.channel.send({content:"Now repeating \`\`one song\`\`"}, {reply: message});
      } else if (c === "all" || c === "queue" || c === "playlist" || c === "list") {
        serverQueue.repeat = "all";
        message.channel.send({content:"Now repeating \`\`all song(queue)\`\`"}, {reply: message});
      } else if (c === "off" || c === "disable") {
        serverQueue.repeat = false;
        message.channel.send({content:"Repeat is \`\`off\`\`"}, {reply: message});
      } else {
        if (!serverQueue.repeat){
			    serverQueue.repeat = "one";
			    message.channel.send({content:"Now repeating \`\`one song\`\`"}, {reply: message});
		    } else if (serverQueue.repeat === "one") {
			    serverQueue.repeat = "all";
			    message.channel.send({content:"Now repeating \`\`all queue(queue)\`\`"}, {reply: message});
		    } else if (serverQueue.repeat === "all" ) {
          serverQueue.repeat = false
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
const Discord = require('discord.js')
const config = require("../config.js")
exports.run = async (bot, message, args, command, db) => {
  if (message.author.id !== config.botowner) {
        message.channel.send({content:'this command is only for bot owner!!!'});
        return undefined;
  }
  message.channel.send({content:"bot restarting"});
  setTimeout(() => {
    process.exit()
  }, 2000 )
}

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['rest'],
	permLevel: 'bot owner only',
  manu: false
};

exports.help = {
	name: 'restart',
	category: 'owner-only',
	description: 'for restart the bot',
	usage: '$restart'
};
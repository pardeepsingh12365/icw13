const Discord = require('discord.js')
const config = require("../config.js")
const solenolyrics= require("solenolyrics");
exports.run = async (bot, message, args, command, db) => {
  const serverQueue = bot.songQueue.get(message.guild.id);
  let args2 = args.join('').substring(command.length);
  
  /*var args2
  if (serverQueue) {
    var currentSong = serverQueue.songs[serverQueue.currentSongIndex];
    if (!args1 && currentSong.url.startsWith(`https://www.youtube.com`)) {
      args2 = currentSong.title.slice(0, 35)
    } else {
      args2 = args1
    }
  }*/
  //console.log(args2)
  
  if (!args2[0]) return message.channel.send({content:`please add song name after command like \`\`${config.prefix}lyrics songname\`\``})
  var lyrics = await solenolyrics.requestLyricsFor(args2);
  var title = await solenolyrics.requestTitleFor(args2)
  var author = await solenolyrics. requestAuthorFor(args2)
  if (!lyrics) return message.channel.send({content:`did not find anything`})
  //console.log(lyrics)
  //console.log(lyrics.length)
  if (lyrics.length < 1950) {
      message.channel.send({content:`\`\`\`${title}\nBy:- ${author}\n\n${lyrics}\n\`\`\``});
  } else {
      message.channel.send({content:`${title}\nBy:- ${author}\n\n${lyrics}`}, { split: "\n", code: "js" });
  }
}

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['lyric'],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'lyrics',
	category: 'music',
	description: 'getting lyrics for any song',
	usage: '$lyrics songname'
};
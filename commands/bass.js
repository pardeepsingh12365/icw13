const Discord = require('discord.js')
const config = require("../config.js")
//const ytdl = require("discord-ytdl-core");
exports.run = async (bot, message, args, command, db) => {
  if (message.author.id !== config.botowner) {
        message.reply('this command is only for bot owner!!!');
        return undefined;
  }
  
  
  
  const serverQueue = bot.songQueue.get(message.guild.id);
  let arg = args.join().substring(command.length);
  let ar = arg.slice().trim().split(/ +/g);
  let c = ar.shift().toLowerCase();
  var mbassboost
  /*const transcoder = new prism.FFmpeg({
    args: [
      '-analyzeduration', '0',
      '-loglevel', '0',
      '-f', 's16le',
      '-ar', '48000',
      '-ac', '2',
      // Add your -af equalizer here
    ],
  });*/
  if (c === "set") {
    mbassboost = ar
    db.ref('servers/'+ message.guild.id).update({
      mbass: `${ar}`
    }).catch(function (err) {
      message.channel.send({content:err + "\n\n\n"});
    })
    message.channel.send({content:`bass is ${ar}`})
  } else if (c === "low" || c === "l") {
    mbassboost = 10
    db.ref('servers/' + message.guild.id).update({
      mbass: "10"
    }).catch(function(err) {
      message.channel.send({content:err + "\n\n\n"});
    });
    message.channel.send({content:`bass booster set **low** for ${message.guild.name} server`})
  } else if (c === "med" ||c === "mid" || c === "medium" || c === "m") {
    mbassboost = 20
    db.ref('servers/' + message.guild.id).update({
      mbass: "20"
    }).catch(function(err) {
      message.channel.send({content:err + "\n\n\n"});
    });
    message.channel.send({content:`bass booster set **medium** for ${message.guild.name} server`})
  } else if (c === "high" || c === "h") {
    mbassboost = 30
    db.ref('servers/' + message.guild.id).update({
      mbass: "30"
    }).catch(function(err) {
      message.channel.send({content:err + "\n\n\n"});
    });
    message.channel.send({content:`bass booster set **high** for ${message.guild.name} server`})
  } else if (c === "off" || c === "o") {
    mbassboost = 0
    db.ref('servers/' + message.guild.id).update({
      mbass: "0"
    }).catch(function(err) {
      message.channel.send({content:err + "\n\n\n"});
    });
    message.channel.send({content:`bass booster set **off** for ${message.guild.name} server`})
  } else { 
    var embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor("ICW MUSIC CONTROL", `${config.icwflashlogo}`)
      .setDescription(`thats the advance feature of this bot here you can change \nBass frequencies of music player \nyou can set on **off**, **low**, **medium**, **high**\nall changes apply after next song or restart the player`)
      .setImage(config.icwflahimg)
      .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
      .setTimestamp()

    message.channel.send({embeds: [embed]})
  }
  var st = serverQueue.connection.dispatcher.streamTime
  const gmbass = (await db.ref(`servers/${message.guild.id}`).child("mbass").once("value")).val();
  const aquality = (await db.ref(`bot/`).child("aquality").once("value")).val();
  var currentSong = serverQueue.songs[serverQueue.currentSongIndex];
  var stream = ytdl(currentSong.url, {
    seek: st / 1000 + 30,
    /*filter: "audioonly",
    quality: aquality,
    highWaterMark: 600,
    encoderArgs: ['-af',
                  'equalizer=f=40:width_type=h:width=50:g='+mbassboost
                 ]*/
    /*1 << 20*/
  }); //.pipe(transcoder);
  await serverQueue.connection.play(stream, {type: "opus",/*type: "converted",*/ bitrate: 192000,volume: bot.guildVolume.get(message.guild.id).volume / 80});
    
  
}

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: ['b', 'bassbooster', 'bassboost'],
	permLevel: 'bot owner only',
  manu: false
};

exports.help = {
	name: 'bass',
	category: 'owner-only',
	description: 'for changing bass of music player to low, mid or high',
	usage: '$bass off/low/mid/high'
}
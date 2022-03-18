const Discord = require('discord.js')
const config = require("../config.js")
exports.run = async (bot, message, args, command, db) => {
  const serverQueue = bot.songQueue.get(message.guild.id);
var video = bot.radio.get("radio")

  let arg = args.join().substring(command.length);
  let ar = arg.slice().trim().split(/ +/g);
  let c = ar.shift().toLowerCase();

  if (video.find(d => d.name === c || d.aliases === c)){
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send({content:"You are not in a voice channel please join a channel and use this command again"});
    let matched = video.find(v => v.name === c || v.aliases === c)

    let video2 = {
      name: matched.name,
      id: matched.id,
      title: matched.title,
      url: matched.url,
      thumbnail: matched.thumbnail,
      duration: '0:0:0'//matched.duration
    }
    await bot.addSong(message, video2, voiceChannel, true, command);
    if (serverQueue) {
      if (serverQueue.songs.length > 0) {
        var index = Number.parseInt(serverQueue.songs.length);
        if (Number.isInteger(index)) {
          serverQueue.previousSongIndex = serverQueue.currentSongIndex;
          serverQueue.currentSongIndex = index - 1;
          if (serverQueue.currentSongIndex < 0) {
              serverQueue.currentSongIndex = 0;
          } else if (serverQueue.currentSongIndex > serverQueue.length - 1) {
              serverQueue.currentSongIndex = serverQueue.length - 1;
          } 
            if (serverQueue.connection) {
              if (serverQueue.connection.dispatcher) {
                serverQueue.reason = "goto";
                serverQueue.connection.dispatcher.end("goto");
              }
            }
          }
      }
    }
  } else {
    let radioembed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    ///.setAuthor("ICW RADIO", `${config.icwflashlogo}`)
    .setThumbnail("https://cdn.discordapp.com/attachments/640098613665726464/648130054345195520/download_1.jpg")
    .setDescription(`${config.r} ${config.a} ${config.d} ${config.i} ${config.o}

this is the **real radio stream**\nin hindi, english, punjabi or more lang.
**stations list:-**
capital \`\`(enghlish)\`\`
977 \`\`(english)\`\`
heart \`\`(english)\`\`
dnbradio \`\`(english)\`\`
mirchi \`\`(hindi)\`\`
redfm \`\`(hindi)\`\`
big \`\`(hindi)\`\`
city \`\`(hindi)\`\`
aajtak \`\`(hindi)\`\`
akashvani \`\`(hindi)\`\`
dhakad \`\`(haryanvi)\`\`
khas \`\`(haryanvi)\`\`
hungama \`\`(punjabi)\`\`
punjabins \`\`(punjabi)\`\`
dhol \`\`(punjabi)\`\`
virsa \`\`(punjabi)\`\`
era \`\`(malaysia)\`\`

usase **${config.prefix}radio <station>** \`\`like:- ${config.prefix}radio capital\`\`
\`\`some station buffering slowly(max 10sec) so be patient\`\`
\`\`note: you can request for add a radio station on\`\` [support](https://discord.gg/zFDvBay) \`\`server.\`\`
`)
    .setImage(config.icwflahimg)
    .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
    .setTimestamp()

    message.channel.send({embeds: [radioembed]})
  }
}
async function addSong(message, video, voiceChannel, playlist = true) {
  console.log("play addsong function msg: " + message)
	  const songQueue = new Map()
	  const serverQueue = songQueue.get(message.guild.id);
	  const song = {
		    id: video.id,
        title: /*Util.escapeMarkdown(*/ video.title,
        url: `${video.id}`,
        duration: `${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}`,
        thumbnail: video.thumbnails.high.url,
        author: video.author = message.author,
        user: message.author.username,
        usravatar: message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024})
	  };
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['fm'],
	permLevel: 'No permission need',
  manu: false
};

exports.help = {
	name: 'radio',
	category: 'music',
	description: 'for playing radio on music player',
	usage: '$radio'
}
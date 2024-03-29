const Discord = require('discord.js')
const config = require("../config.js")

exports.run = async (bot, message, args, command, db) => {

  let guildQueue = bot.player.getQueue(message.guild.id);

        if (!message.guild.me.voice.channel) {
            message.channel.send({content:"bot is not in voice channel and nothing to play"}, { reply: message });
            return;
        }
        if (guildQueue.songs.length > 0) {
          /*for (var i = 0; i < serverQueue.songs.length; i++) {
            for
          }*/
          
            var songList = "";
            for (var i = 0; i < guildQueue.songs.length; i++) {
                if (i === guildQueue.data.currentSongIndex) {
                    songList += `__**\`${i + 1}. ${guildQueue.songs[i].name}\`**__\n`;
                } else {
                    songList += `\`${i + 1}. ${guildQueue.songs[i].name}\`\n`;
                }
            }
          //message.channel.send({content:songList})
            if (songList.length < 1950) {
                var queueembed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor("The song queue of " + message.guild.name + " currently has:", message.guild.iconURL({ format: 'png', dynamic: true, size: 1024}) == null ? "https://images-ext-1.discordapp.net/external/v1EV83IWPZ5tg7b5NJwfZO_drseYr7lSlVjCJ_-PncM/https/cdn.discordapp.com/icons/268683615632621568/168a880bdbc1cb0b0858f969b2247aa3.jpg?width=80&height=80" : message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
                    .setDescription(`${config.p} ${config.l} ${config.a} ${config.y} ${config.l} ${config.i} ${config.s} ${config.t}\n
${songList.split("\n").slice(guildQueue.data.currentSongIndex >= 1 ? guildQueue.data.currentSongIndex-1 : guildQueue.data.currentSongIndex, guildQueue.data.currentSongIndex+5).join("\n")}
total **${guildQueue.songs.length}** songs.`)
                    .setFooter("Developed by: PK#1650 ", `${config.pkflashlogo}`)
                    .setImage(config.icwflahimg)
                    .setTimestamp();
                message.channel.send({ embeds: [queueembed] });
            } else {
                message.channel.send(`${songList.split("\n").slice(guildQueue.data.currentSongIndex, guildQueue.data.currentSongIndex+5).join("\n")}`, { split: "\n" });
            }
        } else {
            message.channel.send({content:"No song is in the queue"}, { reply: message });
        }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['q', 'playlist'],
	permLevel: 'No permission need',
  manu: false
};

exports.help = {
	name: 'queue',
	category: 'music',
	description: 'for check playlist',
	usage: '$queue'
}
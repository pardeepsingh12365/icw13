const Discord = require("discord.js");
const config = require("../config.js");

exports.run = async (bot, message, args, command, db, hasvoted) => {
  let guildQueue = bot.player.getQueue(message.guild.id);

  if (message.member.voice.channel !== undefined) {
    if (!message.guild.me.voice.channel) {
      message.channel.send({content:"bot is not in voice channel"}, { reply: message });
      return;
    }
    /*if (!hasvoted || message.author.id !== config.botowner) {
      let voteembed = new Discord.MessageEmbed()
      .setDescription(`${config.v} ${config.o} ${config.t} ${config.e}
we decided to make this command only for voters
you can use this command 12hours after give a vote throw dbl
click on [DBL](https://top.gg/bot/376292306233458688/vote) for open this command for 12hours`)
      .setColor("RANDOM")
      //.setFooter()
      .setTimestamp()
      message.channel.send({embed: voteembed})
    } else {*/
    let args2 = args.join("").substring(command.length);
    if (args2) {
      if (args2 > 100) {
        message.channel.send({content:"Invalid Volume! Please provide a volume from 1 to 100."});
        return;
      }
      if (args2 < 1) {
        message.channel.send({content:"Invalid Volume! Please provide a volume from 1 to 100."});
        return;
      }
      if (isNaN(args2)) {
        //message.channel.send(args2);
        message.channel.send({content:`please provide a valid input. example \`${config.prefix}volume 100\``},{ reply: message });
        return;
      }
      if (guildQueue) {
         guildQueue.setVolume(parseInt(args2));
      }
    }
    const voll = guildQueue.volume;
    var setvolembed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`${config.v} ${config.o} ${config.l} ${config.u} ${config.m} ${config.e}
volume set ${voll}%`)
      .addField("usage",`${config.prefix}volume <1/100> or use reaction buttion`)
      .setThumbnail("https://images-ext-1.discordapp.net/external/v1EV83IWPZ5tg7b5NJwfZO_drseYr7lSlVjCJ_-PncM/https/cdn.discordapp.com/icons/268683615632621568/168a880bdbc1cb0b0858f969b2247aa3.jpg?width=80&height=80")
      .setFooter("Changed by: " + message.author.username.toString(),message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
      .setImage(config.icwflahimg)
      .setTimestamp();
    message.channel.send({ embeds: [setvolembed] }).then(async msg => {
      (await msg.react("650661307988705281")) &&
        (await msg.react("650661356931907614").then(r => {
          const upFilter = (reaction, user) => reaction.emoji.id === "650661307988705281";// && user.id === message.author.id;
          const downFilter = (reaction, user) => reaction.emoji.id === "650661356931907614";// && user.id === message.author.id;

          const up = msg.createReactionCollector( upFilter /*, { time: 60000 }*/ );
          const down = msg.createReactionCollector( downFilter /*, { time: 60000 }*/ );

          up.on("collect", r => {
            let ru = r.users.cache.map(u => u.id).slice(-1);
            if (ru[0] === bot.user.id) return;
            if (message.guild.member(ru[0]).voice.channel !== message.guild.me.voice.channel) return undefined;
            if (msg.channel.lastMessage.embeds[0]) {
              if (msg.channel.lastMessage.embeds[0].description.startsWith(`<:\emoji_v:683576180082999374> <:\emoji_o:683575791229075510>`)) {
                if (r.users.cache.map(u => u === message.member.voice.channel)) {
                  let m = msg.channel.lastMessage.embeds[0].description;
                  let slicevol = m.substring(11 + 179, m.length - 1);
                  var vol;
                  if (slicevol < 100) {
                    vol = parseInt(slicevol) + 10;
                  } else {
                    vol = 0;
                  }
                  if (guildQueue) {
                    guildQueue.setVolume(parseInt(vol / 80));
                  }
                  const volumeConstruct = {
                    volume: vol
                  };
                  bot.guildVolume.set(message.guild.id, volumeConstruct);

                  var editvolembed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(`${config.v} ${config.o} ${config.l} ${config.u} ${config.m} ${config.e}
volume set ${vol}%`)
                    .addField("usage",`${config.prefix}volume <1/100> or use reaction buttion`)
                    .setThumbnail("https://images-ext-1.discordapp.net/external/v1EV83IWPZ5tg7b5NJwfZO_drseYr7lSlVjCJ_-PncM/https/cdn.discordapp.com/icons/268683615632621568/168a880bdbc1cb0b0858f969b2247aa3.jpg?width=80&height=80")
                    .setFooter("Changed by: " + message.author.username.toString(),message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
                    .setImage(config.icwflahimg)
                    .setTimestamp();
                  msg.edit({embeds: [editvolembed]});

                  if (message.guild.member(bot.user).permissions.has("MANAGE_MESSAGES")) {
                    r.users.remove(ru[0]);
                  }
                }
              }
            }
          });

          down.on("collect", r => {
            let ru = r.users.cache.map(u => u.id).slice(-1);
            if (ru[0] === bot.user.id) return;
            if (message.guild.member(ru[0]).voice.channel !== message.guild.me.voice.channel) return undefined;
            if (msg.channel.lastMessage.embeds[0]) {
              if (msg.channel.lastMessage.embeds[0].description.startsWith(`<:\emoji_v:683576180082999374> <:\emoji_o:683575791229075510>`)) {
                let m = msg.channel.lastMessage.embeds[0].description;
                let slicevol = m.substring(11+179, m.length - 1);
                var vol;
                if (slicevol > 0) {
                  vol = parseInt(slicevol) - 10;
                } else {
                  vol = 100;
                }
                if (guildQueue) {
                  guildQueue.setVolume(parseInt(vol / 80));
                }
                const volumeConstruct = {
                  volume: vol
                };
                bot.guildVolume.set(message.guild.id, volumeConstruct);

                var editvolembed = new Discord.MessageEmbed()
                  .setColor("RANDOM")
                  .setDescription(`${config.v} ${config.o} ${config.l} ${config.u} ${config.m} ${config.e}
volume set ${vol}%`)
                  .addField("usage",`${config.prefix}volume <1/100> or use reaction buttion`)
                  .setThumbnail("https://images-ext-1.discordapp.net/external/v1EV83IWPZ5tg7b5NJwfZO_drseYr7lSlVjCJ_-PncM/https/cdn.discordapp.com/icons/268683615632621568/168a880bdbc1cb0b0858f969b2247aa3.jpg?width=80&height=80")
                  .setFooter("Changed by: " + message.author.username.toString(),message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
                  .setImage(config.icwflahimg)
                  .setTimestamp();
                msg.edit({embeds: [editvolembed]});

                if (message.guild.member(bot.user).permissions.has("MANAGE_MESSAGES")) {
                  r.users.remove(ru[0]);
                }
              }
            }
          });
        }));
    });
    //}
  } else {
    message.channel.send({content:"you cant change volume if you are not in voice channel"},{ reply: message });
  }
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["v", "sv", "setvolume", "set-volume"],
  permLevel: 'no permission need',
  manu: false
};

exports.help = {
  name: "volume",
  category: "music",
  description: "for changing volume of music player",
  usage: "$volume or $volume <1/100>"
};

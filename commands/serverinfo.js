const Discord = require('discord.js')
const config = require("../config.js")
exports.run = async (bot, message, args, command, db) => {
  let g = message.guild;
  let guildTchannels = g.channels.cache.filter(e => e.type !== 'voice').size;
  let guildVchannels = g.channels.cache.filter(e => e.type === 'voice').size;
  let serveronlinemembers = g.members.cache.filter(m => m.presence?.status !== "offline").size;
  let serveroflinemembers = g.members.cache.filter(m => m.user.presence?.status === "offline").size;

  let sicon = g.iconURL() == null ? "https://images-ext-1.discordapp.net/external/v1EV83IWPZ5tg7b5NJwfZO_drseYr7lSlVjCJ_-PncM/https/cdn.discordapp.com/icons/268683615632621568/168a880bdbc1cb0b0858f969b2247aa3.jpg?width=80&height=80" : message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

  let online = g.members.cache.filter(m => m.presence?.status === "online").size
  let idle = g.members.cache.filter(m => m.presence?.status === "idle").size
  let dnd = g.members.cache.filter(m => m.presence?.status === "dnd").size
  let offline = g.members.cache.filter(m => m.presence?.status === "offline").size
  
  var serverinfoembed = new Discord.MessageEmbed()
  .setAuthor(g.name + "info", sicon)
  .setColor("RANDOM")
  .setDescription(`${config.s} ${config.e} ${config.r} ${config.v} ${config.e} ${config.r} ${config.i} ${config.n} ${config.f} ${config.o}\n
${g.description ? `${g.description}\n` : ""}
Since: ${g.createdAt}`)
  .addField("Server Owner:", `<@${g.ownerId}>`, true)
  .addField("Owner id:", `${g.ownerId ? g.ownerId : null}`, true)
  .addField("Total Roles:", `${g.roles.cache.size}`, true)
  .addField("Text channel:", `${guildTchannels}`, true)
  .addField("Voice channels:", `${guildVchannels}`, true)
  .addField("Splash",g.splashURL() ? `[link](${g.splashURL({ format: 'png', dynamic: true, size: 256})})` : "No splash", true)
  .addField("Banner",g.bannerURL() ? `[link](${g.bannerURL({ format: 'png', dynamic: true, size: 256})})` : "No banner", true)
  .addField("Server Region:", `${g.region}`, true)
  .addField("Verification Level",`${g.verificationLevel}`, true)
  .addField("MFA Level",`${g.mfaLevel === 1 ? `ELEVATED` : "NONE"}`, true)
  .addField("Premium Tier", g.premiumTier ? g.premiumTier : null, true)
  .addField("Premium Subscribers", g.premiumSubscriptionCount ? g.premiumSubscriptionCount : "null", true)
  .addField("Server id",`${message.guild.id}`)
  .addField("Members:", `${message.guild.memberCount} (:green_circle:${online} :yellow_circle:${idle} :red_circle:${dnd} :black_circle:${offline})`)
  .addField("Features",`${message.guild.features.length !== 0 ? `:white_check_mark: ${message.guild.features.join('\n:white_check_mark: ')}` : "null"}`)
  .setThumbnail(sicon)
  .setFooter("Bot Developed by: PK#1650 ", `${config.pkflashlogo}`)
  .setImage(config.icwflahimg)
  .setTimestamp();
  message.channel.send({ embeds: [serverinfoembed] });
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['guildinfo','guild-info', 'server-info','sinfo'],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'serverinfo',
	category: 'useful',
	description: 'info about server',
	usage: '$serverinfo'
};
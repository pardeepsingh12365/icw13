const Discord = require('discord.js')
const config = require("../config.js")
exports.run = async (bot, message, args, command, db) => {
  let arg = args.join().substring(command.length);
  let ar = arg.slice().trim().split(/ +/g);
  let args3 = ar.shift().toLowerCase();
  let muser = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase() === args3.toLowerCase() || m.user.tag === args3 || m.user.id ===  args3) || message.guild.members.cache.get(message.author.id);
  if (!muser) return message.channel.send({content:"user is undefined"})
  const userStats = {
   'online': ':green_circle: Online',
   'idle': ':yellow_circle: idle',
   'dnd': ':red_circle: dnd',
   'offline': ':black_circle: offline',
   'streaming': ':purple_circle: streaming'
  }[muser.guild.members.cache.get(muser.id).presence.status];
  const cstats = muser.guild.members.cache.get(muser.id).presence.clientStatus
  const ccheck = muser.guild.members.cache.get(muser.id).presence.status !== 'offline'//cstats.mobile || cstats.desktop || cstats.web //hasOwnProperty("desktop")
  //console.log(muser)
  var flg = muser.user.flags ? muser.user.flags.toArray().join('\n')
  .replace('DISCORD_EMPLOYEE',`${bot.emojis.cache.get('718689246759878676')} DISCORD STAFF`)
  .replace('DISCORD_PARTNER', `${bot.emojis.cache.get('718689584837558344')} DISCORD PARTNER`)
  .replace('HYPESQUAD_EVENTS', `${bot.emojis.cache.get('718689653284143144')} HYPESQUAD EVENTS`)
  .replace('BUGHUNTER_LEVEL_1', `${bot.emojis.cache.get('718689140790788136')} BUGHUNTER LEVEL_1`)
  .replace('BUGHUNTER_LEVEL_2', `${bot.emojis.cache.get('718689140790788136')} BUGHUNTER LEVEL_2`)
  .replace('HOUSE_BRAVERY', `${bot.emojis.cache.get('722074707515539486')} HOUSE BRAVERY`)
  .replace('HOUSE_BRILLIANCE', `${bot.emojis.cache.get('722074666692378675')} HOUSE BRILLIANC`)
  .replace('HOUSE_BALANCE', `${bot.emojis.cache.get('722074740659060747')} HOUSE BALANCE`)
  .replace('EARLY_SUPPORTER', `${bot.emojis.cache.get('718689401806258237')} EARLY SUPPORTER`)
  .replace('TEAM_USER', `TEAM USER`)
  .replace('SYSTEM', `${bot.emojis.cache.get('722278484436582420')} SYSTEM.`)
  .replace('VERIFIED_BOT', `${bot.emojis.cache.get('722273106906972191')} VERIFIED BOT`)
  .replace('VERIFIED_DEVELOPER', `${bot.emojis.cache.get('722082277495930960')} VERIFIED DEVELOPER`) : ""
  
  flg += muser.user.displayAvatarURL({dynamic: true}).slice(-4) === ".gif" ? `\n${bot.emojis.cache.get('722085099516198993')} NITRO`: ""
  flg += muser.premiumSince !== null  ? `\n${bot.emojis.cache.get('722317190430195793')} GUILD BOOSTER` :  ""
  
  let embed = new Discord.MessageEmbed()
  .setAuthor(muser.user.tag, muser.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
  .setColor("RANDOM")
  .setDescription(`${config.u} ${config.s} ${config.e} ${config.r} ${config.i} ${config.n} ${config.f} ${config.o}

username: **${muser.user.username}#${muser.user.discriminator}**
id: ${muser.user.id}
nickname: ${muser.nickname ? muser.nickname : 'No Nickname'}
avatar: [link](${muser.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024})})
is bot: ${muser.user.bot ? 'Yes its a bot' : 'No it\'s a human'}
status: ${userStats}${ccheck ? muser.guild.members.cache.get(muser.id).presence.activities.length > 0 ? `(${muser.guild.members.cache.get(muser.id).presence.activities})` : '(Not playing anything)' : ""}
joined server on: ${muser.joinedAt.toString().slice(muser.joinedAt.length,24)}
joined discord on: ${muser.user.createdAt.toString().slice(muser.user.createdAt.length,24)}
`)
  .addField(`roles:`,`${muser.roles.cache.size > 0 ? muser.roles.cache.map(d => d).join(', ') : 'None'}`)
  .addField("plateforms", ccheck /*!== null */? /*`${cstats ? */`${cstats.mobile ? `📱 mobile(${cstats.mobile})` : ""} ${cstats.desktop ? `🖥 desktop(${cstats.desktop})` : ""} ${cstats.web ? `💻 web(${cstats.web})`: ""}` /*: "offline"}`*/ : "offline")
  .addField("flags",`${flg.length > 0/*.toArray().length !== 0*/ ? `${flg}` : "no flags"}`)
  .setThumbnail(muser.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
  .setImage(config.icwflahimg)
  .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
  .setTimestamp()

 message.channel.send({embeds: [embed]});
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ui','user-info', 'memberinfo','user','whois','who-is'],
	permLevel: 'no permission need',
  manu: false
};

exports.help = {
	name: 'userinfo',
	category: 'useful',
	description: 'for information about users',
	usage: '$userinfo / $userinfo @user'
};
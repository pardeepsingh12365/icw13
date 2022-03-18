const Discord = require('discord.js')
const config = require("../config.js")
exports.run = async (bot, message, args, command, db) => {
  let arg = args.join().substring(command.length);
  let args3 = args.join("").substring(command.length).split(" ");
  if (!message.guild.member(bot.user).permissions.has("MANAGE_ROLES")) return message.channel.send({content:`I don't have permission to do that`});
  if (message.author.id !== config.botowner && !message.member.permissions.has("MANAGE_ROLES")) return message.channel.send({content:`U don't have permission to do that`});
  let muser = message.mentions.members.first() || message.guild.members.find(m => m.user.username === args3[0] || m.user.usertag === args3[0]);
  if (!muser) return message.channel.send({content:`Specify a user to unmute`});
  let mrole = message.guild.roles.cache.find(e => e.name === 'mute' || e.name === 'muted' || e.name === 'MUTE' || e.name === 'MUTED' || e.name === 'Mute' || e.name === 'Muted');
  if (!mrole) return message.channel.send({content:"i dident find any role with name of mute"});
  let botRolePosition = message.guild.member(bot.user).roles.highest.position;
  let rolePosition = mrole.position;
  if (botRolePosition <= rolePosition) return message.channel.send({content:`<@${message.author.id}> The mute role is equal or higher than my role`})
  if (!muser.roles.cache.has(mrole.id)) return message.channel.send({content:'user is already unmuted'})
  let arg3 = arg.split(`<@${muser.user.id}>`).join().substring(2);
  
  var removeembed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("Action by : " + message.author.tag.toString(), message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
    .setDescription(`${config.u} ${config.n} ${config.m} ${config.u} ${config.t} ${config.e}
**Action**: Unmute \n**Mamber**: ${muser.user.tag} (${muser.id}) \n**Reason**: ${args3[1] ? args3[1] : "No reason"}`)
    .setImage(config.icwflahimg)
    .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
    .setTimestamp();
    muser.roles.remove(mrole).then(() => message.channel.send({ embeds: [removeembed] }).catch((err) => {
    return message.channel.send({content:`I failed to unmute the user... Reason: ${err}`})}))
    const logswitch = (await db.ref(`servers/${message.guild.id}`).child('logswitch').once('value')).val();
    const logchannelid = (await db.ref(`servers/${message.guild.id}`).child('logchannelid').once('value')).val();
    if (logswitch) {
      let logch = message.guild.channels.cache.get(logchannelid);
      if (!logch) {
        return undefined;
      } else {
        logch.send({ embeds: [removeembed] })
      }
      
    }
  
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 'MANAGE_GUILD,\nMANAGE_ROLES',
  manu: false
};

exports.help = {
	name: 'unmute',
	category: 'modration',
	description: 'for unmute someone(its now without timing ill add time soon)\nworking with mute role',
	usage: '$unmute @user reason'
}
const Discord = require('discord.js')
const config = require("../config.js")
exports.run = async (bot, message, args, command, db) => {
  let arg = args.join("").substring(command.length);
  let args3 = args.join("").substring(command.length).split(" ");
  if (!message.guild.member(bot.user).permissions.has("MANAGE_ROLES")) return message.channel.send({content:`I don't have permission to do that`});
  if (message.author.id !== config.botowner && !message.member.permissions.has("MANAGE_ROLES")) return message.channel.send({content:`U don't have permission to do that`});
  let muser = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username === args3[0] || m.user.usertag === args3[0]);
  if (!muser) return message.channel.send({content:`Specify a user to mute`});
  let mrole = message.guild.roles.cache.find(e => e.name === 'mute' || e.name === 'muted' || e.name === 'MUTE' || e.name === 'MUTED' || e.name === 'Mute' || e.name === 'Muted');
  if (!mrole) return message.channel.send({content:"i dident find any role with name of mute!"});
  let botRolePosition = message.guild.member(bot.user).roles.highest.position;
  let rolePosition = mrole.position;
  if (botRolePosition <= rolePosition) return message.channel.send({content:`<@${message.author.id}> The mute role is equal or higher than my role`})
  if (muser.roles.cache.has(mrole.id)) return message.channel.send({content:'user is already muted'})

  let arg3 = arg.split(`<@${muser.user.id}>`).join().substring(2);
  /*let t = parseInt(arg3)
  let tt = arg3.substring(t.toString().length + 1)
  if (isNaN(t) || !t || !tt || !arg3) return message.channel.send(`:warning: You must specify a number as time, like \`\`${config.prefix}mute @mention 7hour\`\``);
  var finaltime;
  if (tt === "seconds" || tt === "sec" || tt === "s") {
    finaltime = t * 1000;
  }
  if (tt === "minutes" || tt === "min" || tt === "m") {
    finaltime = t * 60000;
  }
  if (tt === "hours" || tt === "hour" || tt === "h") {
    finaltime = t * 3600000;
  }
  if (tt === "days" || tt === "day" || tt === "d") {
    finaltime = t * 86400000;
  }

  db.ref('muted/' + muser.user.id).update({
    mtime: `${message.createdTimestamp + finaltime}`,
    musergid: message.guild.id
  }).catch(function(err) {
    message.channel.send(err + "\n\n\n");
  });*/
  var addembed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("Action by : " + message.author.tag.toString(), message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024}))
    .setDescription(`${config.m} ${config.u} ${config.t} ${config.e} ${config.d}\n
**Action**: Mute \n**Mamber**: ${muser.user.tag} (${muser.id}) \n**Reason**: ${args3[1] ? args3[1] : "No reason"}`) 
    .setImage(config.icwflahimg)
    .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
    .setTimestamp();
    muser.roles.add(mrole).then(() => message.channel.send({ embeds: [addembed] }).catch((err) => {
    return message.channel.send({content:`I failed to mute the user... Reason: ${err}`})}))
    const logswitch = (await db.ref(`servers/${message.guild.id}`).child('logswitch').once('value')).val();
    const logchannelid = (await db.ref(`servers/${message.guild.id}`).child('logchannelid').once('value')).val();
    if (logswitch) {
      let logch = message.guild.channels.cache.get(logchannelid);
      if (!logch) {
        return undefined;
      } else {
        logch.send({ embeds: [addembed] })
      }
      
    }
    muser.send({content:`**You has been Muted from** ${message.guild}. \n**Reason**: ${arg3 ? arg3 : "No reason"}`}).catch(err => {})
  
}

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [],
	permLevel: 'MANAGE_GUILD',
  manu: false
};

exports.help = {
	name: 'mute',
	category: 'modration',
	description: 'for mute someone(its now without timing ill add time soon)\nonly working with mute role',
	usage: '$mute @user reason'
} 
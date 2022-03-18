const Discord = require('discord.js');
const config = require("../config.js");
const yts = require("yt-search");
const ytpl = require("ytpl");

module.exports = async (bot, db, oldState, newState) => {
  const newUserChannel = newState.channel;
  const oldUserChannel = oldState.channel;
  const newChID = newState.channelID;
  const oldChID = oldState.channelID;
  const newStateM = newState.member;
  const oldStateM = oldState.member;
  const serverQueue = bot.songQueue.get(newStateM.guild.id);

  const logswitch = (await db.ref(`servers/${newStateM.guild.id}`).child('logswitch').once('value')).val();
  const logchannelid = (await db.ref(`servers/${newStateM.guild.id}`).child('logchannelid').once('value')).val();
  const autoleave = (await db.ref(`servers/${newStateM.guild.id}`).child('autoleave').once('value')).val();
  const autojoin = (await db.ref(`servers/${newStateM.guild.id}`).child('autojoin').once('value')).val();
  const altime = (await db.ref(`servers/${newStateM.guild.id}`).child('altime').once('value')).val();
  
  const autoplay = (await db.ref(`users/${newStateM.user.id}`).child('autoplay').once('value')).val();
  const apch = (await db.ref(`users/${newStateM.user.id}`).child('apch0').once('value')).val();
  const apch2 = (await db.ref(`users/${newStateM.user.id}/apch`).child('apch2').once('value')).val();
  const apsong = (await db.ref(`users/${newStateM.user.id}`).child('apsong').once('value')).val();

  var video = bot.radio.get("radio")
  //JOIN
  if (!oldChID && newChID) {
    let chnl = await apch//.split(" ");
    if (autoplay === true && chnl.includes(newChID)) {
      const permission = newUserChannel.permissionsFor(bot.user)
      if (!permission.has("CONNECT") || !permission.has("SPEAK")) return
      let searchString = apsong.slice();
      const url = apsong ? apsong.replace(/<(.+)>/g, '$1') : '';

    if (video.find(d => d.name === apsong || d.aliases === apsong)){
      let matched = video.find(v => v.name === apsong || v.aliases === apsong)

      let video2 = {
      name: matched.name,
      id: matched.id,
      title: matched.title,
      url: matched.url,
      thumbnail: matched.thumbnail,
      duration: matched.duration
    }
      await bot.addSong(newStateM, video2, newUserChannel, true, "radio");
    } else if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const listid = url.split("list=")[1]
          const playlist = await ytpl(listid)//({ listId: listid})
          if (!playlist) return //message.channel.send("This playlist is either invalid or private, please try again.")
          //message.channel.send(`✅ Playlist: **${playlist.title}** has been added  to the queue!`)
          const videos = playlist.items;
          //console.log(playlist)
          for (const video of Object.values(videos)){
            //const v2 = await yts({videoId: video.videoId})
            await bot.addSong(newStateM, video, newUserChannel, true)
          }
    } else {
      try {
        setTimeout(function() {
          yts(url, async function ( err, r ) {
            if ( err ) return console.log(err)
            const videos = await r.videos
            var video2 = await videos[0]
            
            await bot.addSong(newStateM, video2, newUserChannel);
          })
        }, 200)
      } catch (err) {
        bot.channels.cache.get(config.boterrorchannel).send({content:`${newStateM.user.tag} from ${newStateM.guild.name} using auto-play but i got a error ${err}`})
        console.log('🆘 I could not obtain any search results.');
      }
          
    }
  }
    if (autojoin) {
      const permission = newUserChannel.permissionFor(bot.user)
      if (!permission.has("CONNECT")) return
      if (!permission.has("SPEAK")) return
      newUserChannel.join()
    }
    if (logswitch) {
      let logch = newStateM.guild.channels.cache.get(logchannelid);
      if (!logch) {
        return undefined;
      } else {
        let addembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Joined Voice " + newStateM.user.tag.toString(), newStateM.user.displayAvatarURL)
        .setDescription(`**Member**: <@${newStateM.user.id}> (${newStateM.user.id})\n**Voice Channel Joined**: ${newUserChannel.name}`)
        .setThumbnail(newStateM.user.displayAvatarURL)
        .setImage(config.icwflahimg)
        .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
        .setTimestamp();
        logch.send({ embeds: [addembed] })
      }
    }
//LEAVE
  } else if (!newChID && oldChID) {
    //console.log(oldUserChannel.members.has(bot.user.id))
    if (autoleave !== false && oldUserChannel.members.size === 1 && oldUserChannel.members.has(bot.user.id)) {
      if (serverQueue) {
        if (!serverQueue.textChannel) {
          setTimeout(async function() {
            if (oldUserChannel.members.size > 1) return;
            if (serverQueue.connection) {
                if (serverQueue.connection.dispatcher) {
                  await serverQueue.connection.dispatcher.end("stopping");
                }
            }
            oldUserChannel.leave()
            await bot.songQueue.delete(oldUserChannel.guild.id)
          }, altime ? altime : 120000)
        } else {
          let autoleave = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setAuthor("anyone not in voice channel",`${config.icwflashlogo}`)
          .setDescription(`im leaving now 🎧\nyou can disable autoleave with command\n\`\`$autoleave\`\``)
          .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
          .setImage(config.icwflahimg)
          .setTimestamp();
          setTimeout(async function() {
            if (oldUserChannel.members.size > 1) return undefined;
            serverQueue.textChannel.send({embeds: [autoleave]})
            if (serverQueue.connection) {
                if (serverQueue.connection.dispatcher) {
                  await serverQueue.connection.dispatcher.end("stopping");
                }
            }
            oldUserChannel.leave()
            await bot.songQueue.delete(oldUserChannel.guild.id)
          }, altime ? altime : 120000)
        }
      } else if (!serverQueue) {
        setTimeout(function() {
          if (oldUserChannel.members.size > 1) return undefined;
          oldUserChannel.leave()
        }, altime ? altime : 120000)
      }
    } else {}
    if (logswitch) {
      let logch = newStateM.guild.channels.cache.get(logchannelid);
      if (!logch) {
        return undefined;
      } else {
        let addembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Left Voice" + newStateM.user.tag.toString(), newStateM.user.displayAvatarURL)
        .setDescription(`**Member**: <@${newStateM.user.id}> (${newStateM.user.id})\n**Voice Channel Left**: ${oldUserChannel.name}`)
        .setThumbnail(newStateM.user.displayAvatarURL)
        .setImage(config.icwflahimg)
        .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
        .setTimestamp();
        logch.send({ embeds: [addembed] })
      }
    }
// SWITCH
  } else if (oldChID && newChID) {
    if (logswitch) {
      let logch = newStateM.guild.channels.cache.get(logchannelid);
      if (!logch) {
        return undefined;
      } else {
        let addembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Switch Voice " + newStateM.user.tag.toString(), newStateM.user.displayAvatarURL)
        .setDescription(`**Member**: <@${newStateM.user.id}> (${newStateM.user.id})\n**Old Channel**: ${oldUserChannel.name}\n**New Channel**: ${newUserChannel.name}`)
        .setThumbnail(newStateM.user.displayAvatarURL)
        .setImage(config.icwflahimg)
        .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
        .setTimestamp();
        logch.send({ embeds: [addembed] })
      }
    }

  } else {
    return;
  }
};
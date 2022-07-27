const Discord = require("discord.js");

const config = require("../config.js");

//const ytdl = require("ytdl-core");

const yts = require("yt-search");

//const ytpl = require("ytpl");

const nsfwword = require("../nsfwword")

exports.run = async (bot, message, args, command, db) => {

  //const serverQueue = bot.songQueue.get(message.guild.id);

  const songselection = (await db.ref(`servers/${message.guild.id}`).child("songselection").once("value")).val();

  const songlistlimit = (await db.ref(`servers/${message.guild.id}`).child("songlistlimit").once("value")).val();

  const sselect = songlistlimit ? songlistlimit : 5;

  const voiceChannel = message.member.voice.channel;

  let args0 = args.join("").substring(command.length);

  let searchString = args0.slice();

  const url = args0 ? args0.replace(/<(.+)>/g, "$1") : "";

  if (!voiceChannel)

    return message.channel.send({content:"You are not in a voice channel please join a channel and use this command again"});

  if (!url)

    return message.channel.send({content:`❌ input a song name, song link or playlist link after command`});

  

  let c = url.split(" ").filter

  (e => nsfwword.adultsword.includes(e))

  if (c.length > 0)

    return message.channel.send(" >>> dont use bad word please")

  

  const permissions = voiceChannel.permissionsFor(message.client.user);

  if (!permissions.has("CONNECT"))

    return message.channel.send({content:"I do not have the permissions to join that voice channel please give me permissions to join"});

  if (!permissions.has("SPEAK"))

    return message.channel.send({content:"I do not have the permissions to speak in that voice channel please give me permissions to speak"});

  

  

        let guildQueue = bot.player.getQueue(message.guild.id);

        let queue = bot.player.createQueue(message.guild.id);

        await queue.join(message.member.voice.channel);

        /*let song = await queue.play(args.join(' ')).then(

          queue.setData({

            message: message,

            currentSongIndex: 0,

            previousSongIndex: 0

          })

        ).catch(err => {

            console.log(err);

            if(!guildQueue)

                queue.stop();

        });

        song.setData({

          

        })*/

  

  

  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

    let song = await queue.playlist(args.join(' ')).then(

      queue.setData({

        message: message,

        currentSongIndex: 0,

        previousSongIndex: 0

      })

    ).catch(err => {

        console.log(err);

    if(!guildQueue)

        queue.stop();

    });

    

    //if (!playlist) return message.channel.send({content:"This playlist is either invalid or private, please try again."});

    //message.channel.send({content:`Playlist: **${playlist.title}** has been added  to the queue!`});

    //const videos = playlist.items;

  } else {

    setTimeout(function() {

      yts(url, async function(err, r) {

        if (err) return message.channel.send({content:err});

        const videos = await r.videos;

        //console.log("videos :- " + videos)

        if (songselection === true) {

          const videos2 = await r.videos.slice(0, sselect);

          //videos.forEach( async function (v) {

          //const views = String(v.views).padStart(10, ' ' )

          //console.log(`${views} | ${v.title} (${v.timestamp}) | ${v.author.name}`)

          let index = 0;

          if (videos.length === 0) return message.channel.send({content:`videos undefined. please try again`})

          var embed = new Discord.MessageEmbed()

            .setAuthor("ICW BOT", `${config.icwflashlogo}`)

            .setDescription(`__**Song selection:**__

${videos2.map(video2 =>`**${++index} - **[${video2.title}](https://www.youtube.com/watch?v=${video2.videoId})`).join("\n")}

Please provide a value to select one of the search results ranging from 1-${sselect - 1}.

\`\`you can turn on/off song selection with command ${config.prefix}songselect\`\``)

            .setImage(config.icwflahimg)

            .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `,`${config.pkflashlogo}`)

            .setColor("RANDOM")

            .setTimestamp();

          message.channel.send({ embeds: [embed] });
          const filter = (message2) => message2.content > 0 && message2.content < sselect 

          try {

            var response = await message.channel.awaitMessageComponent(

              

              { filter,

               // max: 1,

                time: 20000,

            //    errors: ["time"]

              }

            );

          } catch (err) {

            return message.channel.send({content:"No or invalid value entered, cancelling video selection."});

          }

          const videoIndex = parseInt(response.first().content);

          const video3 = videos[videoIndex - 1];

          //console.log(video3)

          let song = await queue.play(video3.url).then(

              queue.setData({

                message: message,

                currentSongIndex: 0,

                previousSongIndex: 0

              })

            ).catch(err => {

            console.log(err);

            if(!guildQueue)

                queue.stop();

          });

        } else {

          let song = await queue.play(url).then(

            queue.setData({

              message: message,

              currentSongIndex: 0,

              previousSongIndex: 0

            })

          ).catch(err => {

            console.log(err);

            if(!guildQueue)

                queue.stop();

            });

        }

      });

    }, 200);

  }

};

async function addSong(message, video, voiceChannel, playlist = false) {

  const songQueue = new Map();

  const serverQueue = songQueue.get(message.guild.id);

  const song = {

    id: video.id,

    title: /*Util.escapeMarkdown(*/ video.title,

    url: `https://www.youtube.com/watch?v=${video.id}`,

    duration: `${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}`,

    thumbnail: video.thumbnails ? video.thumbnails.high.url : video.thumbnail,

    author: (video.author = message.author),

    user: message.author.username,

    usravatar: message.author.displayAvatarURL({

      format: "png",

      dynamic: true,

      size: 1024

    })

  };

}

exports.conf = {

  enabled: true,

  guildOnly: true,

  aliases: ["p", "yt"],

  permLevel: "No permission need",

  manu: false

};

exports.help = {

  name: "play",

  category: "music",

  description: "for playing music",

  usage: "$pp songname"

};


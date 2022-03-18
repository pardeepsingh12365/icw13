
const request = require("request");
const Discord = require("discord.js");

//const ytdl = require("ytdl-core");
//const ytdl = require("discord-ytdl-core")
const playdl = require('play-dl')
//const FFmpeg = require("ffmpeg");
const prism = require("prism-media");
const fs = require("fs");

const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const bot = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      Intents.FLAGS.GUILD_INTEGRATIONS,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_INVITES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      Intents.FLAGS.GUILD_SCHEDULED_EVENTS
    ]
});

const {
  joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
  getVoiceConnection
} = require('@discordjs/voice');
const Voice = require('@discordjs/voice');
//const player = createAudioPlayer()
//module.exports = player;
//bot.player = player


const config = require("./config.js");
const owmkey = process.env.KEY_WEATHER;

const { inspect } = require("util");
const cheerio = require("cheerio");
const nodefetch = require("node-fetch");
const googleit = require("google-it-safesearch");
const querystring = require("querystring");
const firebase = require("firebase");
const Jimp = require("jimp");
const Enmap = require("enmap");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

bot.commands = new Enmap();
bot.aliases = new Enmap();

bot.songQueue = new Map();
bot.guildVolume = new Map();
bot.radio = new Map();
//bot.youtube = new YouTube(process.env.GOOGLEAPIKEY);
//bot.ytdl = ytdl;
bot.config = require("./config.js");

firebase.initializeApp({
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID
});
firebase.auth().signInWithEmailAndPassword(process.env.FB_EMAIL, process.env.FB_PASSWORD);
const db = firebase.database();
bot.db = db;
//require('./modules/starboard.js')(bot);

//----------------------------------------------------

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    //console.log(`Attempting to load command ${commandName}`);
    bot.commands.set(commandName, props);
  });
});

const init = async () => {
  const cmdFiles = await readdir("./commands/");
  bot.commandsNumber = cmdFiles.length;
  console.log(`total ${bot.commandsNumber} commands loaded`);
  cmdFiles.forEach(f => {
    try {
      const props = require(`./commands/${f}`);
      if (f.split(".").slice(-1)[0] !== "js") return;
      bot.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        bot.aliases.set(alias, props.help.name);
      });
    } catch (e) {
      console.log(`found a error when loading command ${f} error is: ${e}`);
    }
  });

  const evtFiles = await readdir("./events/");
  console.log(`total ${evtFiles.length} events loaded.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    bot.on(eventName, event.bind(null, bot, db));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
};

init();

//---------------------------------------------------------------

bot.on("error", function(err) {
  bot.channels.cache.get(config.boterrorchannel).send({content:err});
});
bot.on("disconnect", function() {
  console.log("Bot disconnected");
  //bot.channels.cache.get(config.botlogchannel).send("bot disconnected");
  process.exit(1);
});

bot.login(process.env.BOTTOKEN).then(function() {
    console.log("Bot logged in");
}).catch(console.log);

/*---------------------------------------------------------------------------------------------------------------
            DM CHANNEL
---------------------------------------------------------------------------------------------------------------*/

bot.on("messageCreate", async message => {
  if (message.author.bot) return undefined;
  //const hasvoted = await dbl.hasVoted(message.author.id);
  if (message.channel.type == "dm" || message.channel.type == "group") {
    if (config.blacklist.users.includes(message.author.id)) return;
    //if (!message.channel.type == "dm" || !message.channel.type == "group") return undefined;
    //if (message.guild) return undefined;
    var args;
    var comarg;
    args = message.content.substring(config.prefix.length + 1).split();
    comarg = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = comarg.shift().toLowerCase();
    if (!command) return;
    const cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
    if (!cmd) return;
    if (cmd.conf.guildOnly) {
      return message.channel.send({content:"cant run this command in dm channel"});
    } else {
      if (cmd.conf.enabled === false) return message.channel.send({content:"this command is disable because its under construction"});
      cmd.run(bot, message, args, command, db, /*hasvoted*/);
    }
  } else {
    //if (!message.channel.type == "dm" || !message.channel.type == "group") {
    //});

    /*-----------------------------------------------------------------------------------------------------------------------
                SERVERS COMMANDS
-------------------------------------------------------------------------------------------------------------------------*/
    //bot.on("message", async message => {
    //const sstatus = (await db.ref(`bot/`).child("sstatus").once("value")).val();
    //bot.user.setPresence({status: `streaming`,activity: {name: `${sstatus}`,type: `STREAMING`,url: `https://www.twitch.tv/pardeepsingh12365`} });

    //------------------------------------------------------------

    //if (message.author.bot) return undefined;

    //if (message.channel.type == "dm" || message.channel.type == "group") return;
    if (config.blacklist.users.includes(message.author.id) ||config.blacklist.guilds.includes(message.guild.id))return;
    if (message.content.startsWith(`<@${bot.user.id}>`) ||message.content.startsWith(`<@!${bot.user.id}>`)) {
      /*message.channel.send(cbot.ask(message.content)).catch((e) => {
            message.channel.send("-> " + e);
        });
        return
        }*/
      if (message.content.startsWith(`<@${bot.user.id}>`)) {
        args = message.content.substring(`<@${bot.user.id}>`.length + 1).split().join("");
      } else {
        args = message.content.substring(`<@!${bot.user.id}>`.length + 1).split().join("");
      }
      if (!args || args === "prefix" || args === "what is your prefix" || args === "what is prefix") {
        const gprefix = (await db.ref(`servers/${message.guild.id}`).child("guildprefix").once("value")).val();
        message.channel.send({content:`The current prefix is \`\`${gprefix ? gprefix : `${config.prefix}`}\`\` for ${message.guild.name}`});
      } else {
        var letterNumber = /^[0-9a-zA-Z .?!@#$%^&*)(_+=-|]*$/gm;
        //if(!args.match(letterNumber)) return message.channel.send(`Error:- ERR_UNESCAPED_CHARACTERS`)
        await message.channel.sendTyping();
        try {
          
          fetch( config.apilinks.snowflake + "/api/chatbot?message=" + args + "[&name=icwbot&gender=female]?user="+message.author.id, {
            headers: {
              "Authorization": process.env.snowflake
            }
          }
            //"https://some-random-api.ml/chatbot?message=" + args
            //"https://icw-api.glitch.me/clv?message=" + args
            //"https://some-random-api.ml/chatbot?message=" + args
          )
          .then(res => res.json())
          .then(data => {
            //console.log(data)
            if(data.error) {
              return message.channel.send({content:`Error: ${data.error}`});
              return undefined
          
            } else if (data.message) {
              message.channel.send({content:data.message});
              return undefined;
            } else {
              message.channel.send({content:"api is down"});
              return undefined
            }
          })
          .catch(error => {
            if (error === "TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters") {
              message.channel.send({content:"x chatbot error: TypeError [ERR_UNESCAPED_CHARACTERS]: Request path contains unescaped characters"})
              
            } else {
              message.channel.send({content:`❌ Error: api is down`});
              bot.channels.cache.get(config.boterrorchannel).send({content:`❌ chatbot error: ${error}`})
              
            }
          })
        } catch (error) {
          message.channel.send({content:"somthing wrong"})//(`❌ ${err}`);
          
        }
      }
    }
    //----------------------------------------------------------
    /*  let ttt = message.createdTimestamp
  var mtime;
  var musergid
  var muserid
  db.ref('muted').orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
      muserid = data.key
      mtime = data.val().mtime
      musergid = data.val().musergid
    });
  });
  console.log(`compare ${parseInt(mtime)} and ${ttt}`)
  if (parseInt(mtime) < ttt) {
    let g = bot.guilds.get(musergid);
    let m = g.members.get(muserid)
    let mrole = g.roles.find(e => e.name === 'mute')
    m.removeRole(mrole)
  }*/
    //----------------------------------------------------------
    const mentionuser = message.mentions.members.first();
    if (mentionuser) {
      const brbstatus = (await db.ref(`users/${mentionuser.user.id}`).child("brbmessage").once("value")).val();
      if (brbstatus !== null || brbstatus) {
        //if (mentionuser.presence.status === "offline") {
          message.channel.send({content:`hey <@${message.author.id}>, ${mentionuser.user.username} is ${brbstatus}`});
        //} else {
          //return undefined;
        //}
      }
    }
    
    
    /*const brbstatus2 = (await db.ref(`users/${message.author.id}`).child("brbmessage").once("value")).val();
    if (brbstatus2 !== null || brbstatus2) {
      db.ref('users/' + message.author.id).child('brbmessage').remove().catch(function(err) { bot.channles.cache.get(config.boterrorchannel).send({content:err + "\n\n\n"}); });
      message.channel.send({content:`hey <@${message.author.id}> you are back so your afk status is cleared`})
    }*/

    //------------------------------------------------------------
    var cprefix;
    //var args;
    //var comarg;
    const gprefix = (await db.ref(`servers/${message.guild.id}`).child("guildprefix").once("value")).val();
    if (!gprefix || gprefix === null) {
      cprefix = config.prefix;
    } else {
      cprefix = gprefix;
    }

    if (!message.content.startsWith(cprefix)) return undefined;
    //if (message.content.startsWith(cprefix)) {
    var args = message.content.substring(cprefix.length + 1).split();
    var comarg = message.content.slice(cprefix.length).trim().split(/ +/g);
    /*} else {
    args = message.content.substring(config.prefix.length + 1).split();
    comarg = message.content.slice(config.prefix.length).trim().split(/ +/g);
  }*/
    const command = comarg.shift().toLowerCase();

    /*----------------------------------------------------------------------------------------------------------------------------------------------------------*/
    if (!command) return;
    const cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
    if (!cmd) {
      return;
    } else {
      if (cmd.conf.enabled === false && message.author.id !== config.botowner) return message.channel.send({content:"this command is disable because its under construction"});
      try {
        cmd.run(bot, message, args, command, db, /*hasvoted*/);
      } catch (error){
        message.channel.send({content:'an error occurred:\n'+error})
      }
    }
  }
});

bot.addSong = async (message,video,voiceChannel,playlist = false,command) => {
  if (!video) {
    if (message.channel) {
      return message.channel.send({content:"video undefined. try again"});
    } else {
      return;
    }
  }
  const defvolume = (await db.ref(`servers/${message.guild.id}`).child("defvolume").once("value")).val();
  //console.log(video)
  //console.log(Voice)

  var url;
  if (command === "radio" || command === "fm") {
    url = `${video.url}`;
  } else {
    url = `https://www.youtube.com/watch?v=${video.videoId === undefined ? video.id : video.videoId}`;
  }
  const serverQueue = bot.songQueue.get(message.guild.id);
  
  let connection = getVoiceConnection(message.guild.id);
  const player = createAudioPlayer()
  
  const song = {
    id: video.videoId === undefined ? video.id : video.videoId,
    title: /*Util.escapeMarkdown(*/ video.title,
    url: url,
    duration: /*video.duration.hours !== undefined ? `${video.duration.hours}:${video.duration.minutes}:${video.duration.seconds}` : `${*/video.timestamp ? video.timestamp : video.duration,
    thumbnail: video.thumbnail === undefined ? video.bestThumbnail.url : video.thumbnail,
    author: (video.author = message.author),
    user: message.author ? message.author.username : message.user.username,
    usravatar: message.author ? message.author.displayAvatarURL({format: "png",dynamic: true,size: 256 }) : message.user.displayAvatarURL({format: "png",dynamic: true,size: 256 })
  };
  if (!serverQueue) {
    var queueConstruct = {
      player: player,
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: [],
      playing: true,
      currentSongIndex: 0,
      previousSongIndex: 0,
      shuffle: false,
      repeat: false,
      autoremove: false,
      reason: null,
      lnpmid: null
    };
    
    bot.songQueue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);
    const volumeConstruct = {
      volume: defvolume ? defvolume : 80
    };
    bot.guildVolume.set(message.guild.id, volumeConstruct);

    try {
    if (!message.guild.me.voice.channel && message.guild.me.voice.channel !== message.member.voice.channel ) {
      console.log("1")
      if (!connection) {
        console.log("connection not found 1")
			  const connection = joinVoiceChannel({
          channelId: message.member.voice.channel.id,
          guildId: message.member.voice.channel.guild.id,
          adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
        }).subscribe(player)
        connection
		  }
      queueConstruct.connection = connection;
      playSong(message, connection);
    } else {
      console.log("2")
      /*if (!connection) {
        console.log("connection not found 2")
        const connection = joinVoiceChannel({
          channelId: message.member.voice.channel.id,
          guildId: message.member.voice.channel.guild.id,
          adapterCreator: message.member.voice.channel.guild.voiceAdapterCreator,
        }).subscribe(player)
        connection
      }*/
      
      queueConstruct.connection = connection;
      playSong(message, connection);
            
    }
    } catch (err) {
      bot.songQueue.delete(message.guild.id);
      if (message.channel) {
        message.channel.send({content:"error: " + err});
      }
    }
  } else {
    serverQueue.songs.push(song);
    serverQueue.player = player
    if (playlist) {
      console.log("3")
      if (!connection) {
        console.log("connection not found 3")
			connection = joinVoiceChannel({
				'adapterCreator': message.guild.voiceAdapterCreator,
				'channelId': message.channel.id,
				'guildId': message.guild.id,
				'selfDeaf': true,
			}).subscribe(player)
          //message.guild.me.voice.setRequestToSpeak(true);
      queueConstruct.connection = connection;
		}
      playSong(message, connection);
      return;
    } else {
      if (message.channel) {
        let embed = new Discord.MessageEmbed()
        //.setAuthor(`I have added \`${song.title}\` to the song queue!`,`${config.icwflashlogo}`)
        .setDescription(`${config.s} ${config.o} ${config.n} ${config.g} ${config.a} ${config.d} ${config.d} ${config.e} ${config.d}
${bot.emojis.cache.get('717950015724716153')} [${song.title}](${song.url})
length: ${song.duration}`
        )
        .setColor("RANDOM")
        .setThumbnail(song.thumbnail)
        .setFooter("Added by: " + message.author.username.toString(),message.author.displayAvatarURL)
        .setImage(config.icwflahimg)
        .setTimestamp();
        message.channel.send({ embeds: [embed] });
      }
    }
  }
};

var playSong = async function(message) {
  console.log("playSong fired ---------------------------------------------")
  const gmbass = (await db.ref(`servers/${message.guild.id}`).child("mbass").once("value")).val();
  const aquality = (await db.ref(`bot/`).child("aquality").once("value")).val();
  const npmsg = (await db.ref(`servers/${message.guild.id}`).child("npmsg").once("value")).val();
  const npmsgch = (await db.ref(`servers/${message.guild.id}`).child("npmsgch").once("value")).val();
  const connection = getVoiceConnection(message.guild.id)
  const serverQueue = bot.songQueue.get(message.guild.id);
  if (serverQueue.shuffle) {
    do {
        serverQueue.currentSongIndex = Math.floor(
        Math.random() * serverQueue.songs.length
      );
    } while (serverQueue.currentSongIndex === serverQueue.previousSongIndex);
  }

  var currentSong = serverQueue.songs[serverQueue.currentSongIndex];
  if (currentSong) {
    const transcoder = new prism.FFmpeg({
      args: [
        "-analyzeduration","0","-loglevel","0","-f","s16le","-ar","48000","-ac","2"
        //'-af', `equalizer=f=400:width_type=h:width=2:g=0,bass=g=${gmbass},treble=g=0`,
        //'-af', `superequalizer=1b=5:2b=1:3b=1:4b=1:5b=1:6b=1:7b=1:8b=1:9b=1:10b=1:11b=1:12b=1:13b=1:14b=1:15b=1:16b=1:17b=1:18b=1`,
        //'-filter:a', "volume=80 / 80",
        //'-af', "firequalizer=gain_entry='entry(0,24);entry(250,12);entry(1000,0);entry(4000,0);entry(16000,0)'"
      ]
    });
    const opus = new prism.opus.Encoder({
      rate: 48000,channels: 2,frameSize: 960
    });
    //const stream =ytdl(currentSong.url,{filter: "audioonly",quality: aquality,highWaterMark: 1 << 2}).pipe(opus).pipe(transcoder)
    /*var dispatcher = serverQueue.connection.playOpusStream(stream, {type: "opus", volume: bot.guildVolume.get(message.guild.id).volume / 80 })*/

    var stream;
    var slink;
    
    if (currentSong.url.startsWith(`https://www.youtube.com`)) {
      let stm = await playdl.stream(currentSong.url, { discordPlayerCompatibility : true })
      stream = stm.stream
        //stream = ytdl(currentSong.url, {/*type: 'opus', */filter: "audioonly"/*,quality: aquality,highWaterMark: 600 *//*1 << 20*/}); //.pipe(transcoder);
      slink = currentSong.url;
    } else {
      stream = currentSong.url;
      slink = config.serverinvite;
    }
    //var player = createAudioPlayer();//await serverQueue.connection.play(stream, {/*type: "converted",*/ bitrate: 192000,volume: bot.guildVolume.get(message.guild.id).volume / 80});
    const resource = createAudioResource(stream, { inlineVolume: true });
    //module.exports = resource
		serverQueue.player.play(resource);
    if (npmsg === false) {
    } else {
      var nowplayembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: ``, iconURL: `${config.icwflashlogo}`})
        .setDescription(`${config.n} ${config.o} ${config.w} ${config.p} ${config.l} ${config.a} ${config.y} ${config.i} ${config.n} ${config.g}
${bot.emojis.cache.get('943100451904192522')} [${currentSong.title}](${slink})
length: ${currentSong.duration}`)
        .setThumbnail(`${currentSong.thumbnail}`)
        .setFooter({text: "Requested by: " + `${currentSong.user}`, iconURL: currentSong.usravatar})
        .setImage(config.icwflahimg)
        .setTimestamp();
      message.channel.send({ embeds: [nowplayembed] })
      /*if (message.channel) {
        if (message.channel.lastMessage.embeds.length > 0 && message.channel.lastMessage.author.id === bot.user.id) {
          if (message.channel.lastMessage.embeds[0].fields[3] !== undefined) {
            if (message.channel.lastMessage.embeds[0].fields[3].name.startsWith("volume") && message.channel.lastMessage.embeds[0].fields[3].value.endsWith("%")) {
              const voll = bot.guildVolume.get(message.guild.id);
              var songembed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`The current song is \`${serverQueue.songs[serverQueue.currentSongIndex].title}\` ${bot.emojis.cache.get('717950015724716153')}`)
                .setDescription(`next song-\n\`\`${serverQueue.songs[serverQueue.currentSongIndex + 1] ? serverQueue.songs[serverQueue.currentSongIndex + 1].title : "no more song"}\`\`\n----------------------------------------------------`)
                .addField("song link", `[click me](${slink})`, true)
                .addField("song length",serverQueue.songs[serverQueue.currentSongIndex].duration,true)
                .addField("suggestion",`[click me](https://discord.gg/zFDvBay)`,true)
                .addField("volume", `${voll.volume}%`, true)
                .addField("repeat",serverQueue.repeat ? serverQueue.repeat : "off",true)
                .addField("shuffle", serverQueue.shuffle ? "on" : "off", true)
                .setThumbnail(`${serverQueue.songs[serverQueue.currentSongIndex].thumbnail}`)
                .setFooter(`Added by ${serverQueue.songs[serverQueue.currentSongIndex].user}`,serverQueue.songs[serverQueue.currentSongIndex].usravatar)
                .setImage(config.icwflahimg)
                .setTimestamp();
              message.channel.lastMessage.edit({ embed: songembed });
            }
          } else if (message.channel.lastMessage.embeds[0].description.startsWith(`<\:emoji_n:683575712204193813> <\:emoji_o:683575791229075510>`)) {
            message.channel.lastMessage.edit({ embed: nowplayembed });
          } else {
            if (!npmsgch) {
              message.channel.send({ embeds: [nowplayembed] }).then(m => {
                serverQueue.lnpmid = m.id;
              })
              if (serverQueue.lnpmid) {
                message.channel.messages.cache.get(serverQueue.lnpmid).delete();
              }
            }
          }
        } else {
          if (!npmsgch) {
            message.channel.send({ embeds: [nowplayembed] }).then(m => {
              serverQueue.lnpmid = m.id;
            })
            if (serverQueue.lnpmid) {
              message.channel.messages.cache.get(serverQueue.lnpmid).delete();
            }
          } else {
            message.guild.channels.cache.get(npmsgch).send({ embeds: [nowplayembed] });
          }
        }
      }*/
    }
    bot.channels.cache.get(config.botmlogchannel).send({content:`**${message.author ? message.author.tag : message.user.tag}**` +` playing ` +`\`\`${currentSong.title}\`\`` +` in ` +`**${message.guild.name}**` +` server`});
    //serverQueue.connection.dispatcher.player.on("warn", console.warn);
    //serverQueue.connection.dispatcher.on("warn", console.warn);
    //serverQueue.connection.dispatcher.on("error", console.error);
    serverQueue.player.on("error", error => {
      console.log("player error :- "+ error)
      message.channel.send({content:`En error occurred: ${error}`})
      serverQueue.currentSongIndex++;
      playSong(message);
      //console.log("Error while playing: " + error);
    });
    serverQueue.player.on(AudioPlayerStatus.Playing, () => {
      serverQueue.reason = null;
    });
      serverQueue.player.on(AudioPlayerStatus.Idle, () => {
      console.log("player idle fired :---------------------------------")
      var reason = serverQueue.reason;
      //console.log(`Reason: ${reason}`)
      if (reason === "prev" || reason === "next" || reason === "goto" || reason === "random" || reason === "stream") {
        //console.log("p1")
        playSong(message);
      } else {
        //console.log("p2")
        if (serverQueue.autoremove) {
          //console.log("p3")
          serverQueue.splice(serverQueue.currentSongIndex, 1);
          if (serverQueue.songs.length === 0) {
            message.member.voiceChannel.leave();
          } else {
            playSong(message);
          }
        } else if (serverQueue.repeat === "one") {
          //console.log("p4 r1")
          serverQueue.currentSongIndex;
          playSong(message);
        } else if (serverQueue.repeat === "all" && serverQueue.currentSongIndex >= serverQueue.songs.length - 1) {
          //console.log("p5")
          serverQueue.previousSongIndex = serverQueue.songs.length - 1;
          serverQueue.currentSongIndex = 0;
          playSong(message);
        } else {
          //console.log("p6")
          serverQueue.currentSongIndex++;
          if (serverQueue.currentSongIndex >= serverQueue.songs.length && !serverQueue.shuffle) {
            //console.log("p6")
            bot.songQueue.delete(message.guild.id);
            connection.destroy()
            var finishembed = new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setAuthor("Finished playing because no more song in the queue",`${config.icwflashlogo}`)
              .setDescription("please add more song if you like 🎧")
              .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `,`${config.pkflashlogo}`)
              .setImage(config.icwflahimg)
              .setTimestamp();
            message.channel.send({ embeds: [finishembed] });
          } else {
            //console.log("p7")
            playSong(message);
          }
        }
      }
    });
  }
};
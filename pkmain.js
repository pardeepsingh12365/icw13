
const request = require("request");
const Discord = require("discord.js");

//const ytdl = require("ytdl-core");
//const ytdl = require("discord-ytdl-core")
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
const { Player } = require("discord-music-player");

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

const player = new Player(bot, {
    leaveOnEmpty: false, // This options are optional.
});
// You can define the Player as *client.player* to easily access it.
bot.player = player;

bot.commands = new Enmap();
bot.aliases = new Enmap();

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

// Init the event listener only once (at the top of your code).
bot.player
// Emitted when channel was empty.
  .on('channelEmpty',  (queue) =>
      console.log(`Everyone left the Voice Channel, queue ended.`))

// Emitted when a song was added to the queue.
  .on('songAdd',  (queue, song) => {
    if (song.isFirst) return undefined;
    let embed = new Discord.MessageEmbed()
      //.setAuthor(`I have added \`${song.title}\` to the song queue!`,`${config.icwflashlogo}`)
      .setDescription(`${config.s} ${config.o} ${config.n} ${config.g} ${config.a} ${config.d} ${config.d} ${config.e} ${config.d}
${"🎧"} [${song.name}](${song.url})
length: ${song.duration}`
      )
      .setColor("RANDOM")
      .setThumbnail(song.thumbnail)
      .setFooter("Added by: " + queue.data.message.author.username.toString(),queue.data.message.author.displayAvatarURL)
      .setImage(config.icwflahimg)
      .setTimestamp();
      queue.data.message.channel.send({ embeds: [embed] });
      console.log(`Song ${song} was added to the queue.`)
    })

    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (queue, playlist) =>
        console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
    // Emitted when there was no more music to play.
    .on('queueDestroyed',  (queue) => {
        console.log(`The queue was destroyed.`)
    })
    // Emitted when the queue was destroyed (either by ending or stopping).    
    .on('queueEnd',  (queue) => {
      var finishembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Finished playing because no more song in the queue",`${config.icwflashlogo}`)
        .setDescription("please add more song if you like 🎧")
        .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `,`${config.pkflashlogo}`)
        .setImage(config.icwflahimg)
        .setTimestamp();
      queue.data.message.channel.send({ embeds: [finishembed] });
      console.log(`The queue has ended.`)
    })

    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) => {
       queue.currentSongIndex++;
       var slink;
       if (newSong.url.startsWith(`https://www.youtube.com`)) {
          //stream = ytdl(currentSong.url, {/*type: 'opus', */filter: "audioonly"/*,quality: aquality,highWaterMark: 600 *//*1 << 20*/}); //.pipe(transcoder);
         slink = newSong.url;
       } else {
         slink = config.serverinvite;
       }
  
        var nowplayembed = new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setAuthor({name: ``, iconURL: `${config.icwflashlogo}`})
          .setDescription(`${config.n} ${config.o} ${config.w} ${config.p} ${config.l} ${config.a} ${config.y} ${config.i} ${config.n} ${config.g}
${bot.emojis.cache.get('943100451904192522')} [${newSong.name}](${slink})
length: ${newSong.duration}`)
          .setThumbnail(`${newSong.thumbnail}`)
          .setFooter({text: "Requested by: " + `${newSong.user}`, iconURL: newSong.usravatar})
          .setImage(config.icwflahimg)
          .setTimestamp();
        queue.data.message.channel.send({ embeds: [nowplayembed] })
        console.log(`${newSong} is now playing.`)
    })

    // Emitted when a first song in the queue started playing.
    .on('songFirst',  (queue, song) => {
       var slink;
    
    if (song.url.startsWith(`https://www.youtube.com`)) {
      slink = song.url;
    } else {
      slink = config.serverinvite;
    }
    
      var nowplayembed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: ``, iconURL: `${config.icwflashlogo}`})
        .setDescription(`${config.n} ${config.o} ${config.w} ${config.p} ${config.l} ${config.a} ${config.y} ${config.i} ${config.n} ${config.g}
${bot.emojis.cache.get('943100451904192522')} [${song.name}](${slink})
length: ${song.duration}`)
        .setThumbnail(`${song.thumbnail}`)
        .setFooter({text: "Requested by: " + `${song.user}`, iconURL: song.usravatar})
        .setImage(config.icwflahimg)
        .setTimestamp();
      queue.data.message.channel.send({ embeds: [nowplayembed] })
      console.log(`Started playing ${song}.`)
    })
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        console.log(`I was kicked from the Voice Channel, queue ended.`))
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        console.log(`I got undefeanded.`))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        console.log(`Error: ${error} in ${queue.guild.name}`);
    });
const Discord = require('discord.js')
const { Util: { splitMessage }} = require(`discord.js`);
const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const { inspect } = require("util");
const request = require('request');
const ytdl = require("ytdl-core");
//const opus = require("node-opus");
//const prism = require("prism-media");
const fs = require("fs");
const nodefetch = require('node-fetch');
const googleit = require('google-it-safesearch');
const querystring = require('querystring');
const firebase = require("firebase");
const Jimp = require("jimp");
const Enmap = require("enmap");
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const http = require('http');
const config = require("../config.js");
const translate = require('@vitalets/google-translate-api');
var googleTTS = require('google-tts-api');
//const DBL = require("dblapi.js");
const pm2  = require("pm2");
//const playdl = require('play-dl')
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
const player = createAudioPlayer()

exports.run = async (bot, message, args, command, db) => {
 // const dbl = new DBL(process.env.DBL_KEY, bot)
    if (message.author.id !== config.botowner) {return message.reply({content:'this command is only for bot owner!!!'});}
            if (/bot.token/.exec(message.content.split(" ").slice(1).join(" "))) return message.channel.send({content:"I think im not idiot"});
            const code = args.join(" ").substring(command.length);
            const token = bot.token.split("").join("[^]{0,2}");
            const rev = bot.token.split("").reverse().join("[^]{0,2}");
            const filter = new RegExp(`${token}|${rev}`, "g");
            try {
                let output = eval(code);
                if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
                output = inspect(output, { depth: 0, maxArrayLength: null });
                output = output.replace(filter, "[TOKEN]");
                output = clean(output);
                if (output.length < 1950) {
                    message.channel.send({content:`\`\`\`js\n${output}\n\`\`\``});
                } else {
                  const output2 = splitMessage(output, {
                    maxLength: 2040,
                    char: `\n`,
                    prepend: ``,
                    append: ``
                  });
                  message.channel.send({content:`${output2}`}, { code: "js" });
                }
            } catch (error) {
                message.channel.send({content:`The following error occured \`\`\`js\n${error}\`\`\``});
            }

        

        function clean(text) {
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        }
}

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['e','evoluation'],
	permLevel: 'bot owner only',
  manu: false
};

exports.help = {
	name: 'eval',
	category: 'owner-only',
	description: 'evolution',
	usage: '$eval code'
};

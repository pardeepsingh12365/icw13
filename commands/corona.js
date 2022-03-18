const Discord = require('discord.js')
const config = require("../config.js")
const request = require("request");
exports.run = async (bot, message, args, command, db) => {
  const serverQueue = bot.songQueue.get(message.guild.id);
var video = bot.radio.get("radio")

  let arg = args.join("").substring(command.length);
  let ar = arg.slice().trim().split(/ +/g).join(" ")

  let letterNumber = /^[0-9a-zA-Z ]*$/gm;
  if (!ar.match(letterNumber)) return message.channel.send({content:`Error:- ERR_UNESCAPED_CHARACTERS`})
  if (ar) {
    var http = require("http");
      request(
        {
          url: "https://corona.lmao.ninja/v2/countries/" + ar//"https://icw-corona-api.herokuapp.com/countries/" + c "https://covid19-scrapper.herokuapp.com/countries/" + c "https://icwcorona.glitch.me/countries/" + c
        },
        (error, response, body) => {
          if (error) return;
          var data = JSON.parse(body);
if(data.message === "Country not found or doesn't have any cases"/*data.error*/) { return message.channel.send({content: data.message}); }
          //console.log(data)
          let coronaembed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("ICW CORONA UPDATE", `${config.icwflashlogo}`)
    //.setThumbnail("https://cdn.discordapp.com/attachments/640098613665726464/648130054345195520/download_1.jpg")
    .setDescription(`${config.c} ${config.o} ${config.r} ${config.o} ${config.n} ${config.a}\n
Country ${data.country}`)

    .addField(`:microbe: Infected`, `${data.cases/* ? data.cases : "2nd api error"*/}`, true)
    .addField(`:white_check_mark: Recovered`, `${data.recovered/* ? data.recovered : "2nd api error"*/} (${Math.floor(data.recovered*100/data.cases).toFixed(1)}%)`, true)
    .addField(`:coffin: Deaths`, `${data.deaths/* ? data.deaths : "2nd api error"*/} (${Math.floor(data.deaths*100/data.cases).toFixed(1)}%)`, true)
    .addField(`:hospital: Active`, `${data.active/* ? data.active : "2nd api error"*/}`, true)
    .addField(`:warning: Critical`, `${data.critical/* ? data.critical : "2nd api error"*/}`, true)
    .addField(`:clock: Infected today`, `${data.todayCases/*newCases ? data.newCases : "2nd api error"*/}`, true)
    .addField(`:clock: Deaths today`, `${data.todayDeaths/*newDeaths ? data.newDeaths : "2nd api error"*/}`, true)
    .setImage(config.icwflahimg)
    .setThumbnail(`${data.countryInfo.flag !== undefined ? data.countryInfo.flag : "https://cdn.discordapp.com/attachments/640098613665726464/693788167530348584/2019-coronavirus.png"}?size=500px`)
    .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
    .setTimestamp()

message.channel.send({embeds: [coronaembed]})
          
        }
      );
  } else {
    var http = require("http");
      request(
        {
          url: "https://corona.lmao.ninja/v2/all"//"https://covid19-scrapper.herokuapp.com/all" "https://icwcorona.glitch.me/all" || "https://corona.lmao.ninja/all"
        },
        (error, response, body) => {
          if (error) return;
          var data = JSON.parse(body);
          //if (data.cod != "200") {message.channel.send('I can\'t find this country');return undefined;}
          if(data.error) { return message.channel.send({content: data.message}); }
          let coronaembed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("ICW CORONA UPDATE", `${config.icwflashlogo}`)
    //.setThumbnail("https://cdn.discordapp.com/attachments/640098613665726464/648130054345195520/download_1.jpg")
    .setDescription(`${config.c} ${config.o} ${config.r} ${config.o} ${config.n} ${config.a}\n
:globe_with_meridians:Total cases`)

    .addField(`:microbe: Infected`, `${data.cases/* ? data.cases : "2nd api error"*/}`, true)
    .addField(`:white_check_mark: Recovered`, `${data.recovered/* ? data.recovered : "2nd api error"*/} (${Math.floor(data.recovered*100/data.cases).toFixed(1)}%)`, true)
    .addField(`:coffin: Deaths`, `${data.deaths/* ? data.deaths : "2nd api error"*/} (${Math.floor(data.deaths*100/data.cases).toFixed(1)}%)`, true)
    .addField(`:hospital: Active`, `${data.active/* ? data.active : "2nd api error"*/}`, true)
    .addField(`:warning: Critical`, `${data.critical/* ? data.critical : "2nd api error"*/}`, true)
    .addField(`:clock: Infected today`, `${data.todayCases/* ? data.newCases : "2nd api error"*/}`, true)
    .addField(`:clock: Deaths today`, `${data.todayDeaths/* ? data.newDeaths : "2nd api error"*/}`, true)
    .setImage(config.icwflahimg)
    .setThumbnail("https://cdn.discordapp.com/attachments/640098613665726464/693788167530348584/2019-coronavirus.png")
    .setFooter(`${bot.user.username}™ | Developed by: PK#1650 `, `${config.pkflashlogo}`)
    .setTimestamp()

    message.channel.send({embeds: [coronaembed]})
          
        }
      );

  }
}

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['covid19'],
	permLevel: 'No permission need',
  manu: false
};

exports.help = {
	name: 'corona',
	category: 'useful',
	description: 'for getting corona update',
  usage: '$corona\n$corona <country name>'
}
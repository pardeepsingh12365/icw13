const Discord = require("discord.js");
const config = require("../config.js")
const request = require("request")
exports.run = async (bot, message, args, command, db) => {
    const http = require("http")
    
    try {
      request(
      {
        url: "https://some-random-api.ml/animal/cat"
      },(error, response, body) => {
        if (error) return message.channel.send({content:error})
        var data = JSON.parse(body);
        let hugEmbed = new Discord.MessageEmbed()
          .setDescription(`[${data.fact}](https://icwbot.glitch.me)`)
          .setImage(data.image)
          .setURL("https://icwbot.glitch.me")
          .setColor("RANDOM")
          message.channel.send({embeds: [hugEmbed]})
        })
    } catch (err) {
      message.channel.send({content:`❌ ${err}`})
    }

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'No permission need',
    manu: false
};

exports.help = {
    name: 'cat',
    category: 'images',
    description: 'get random cats images with facts',
    usage: '$cat'
};
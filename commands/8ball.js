const Discord = require("discord.js");
const config = require("../config.js");
exports.run = async (bot, message, args, command, db) => {
  var question = args.join("").substring(command.length);
  var answers = config.eightBall;
  if (!question) return message.reply("no question in input").then(msg => setTimeout(() => msg.delete(), 5000));
  var a = Math.floor(Math.random() * answers.length);

  let ballembed = new Discord.MessageEmbed()
    .setAuthor(
      message.author.username.toString(),
      message.author.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 256
      })
    )
    .setColor("RANDOM")
    .addField(":question: Question", question)
    .addField(":8ball: 8ball", answers[a])
    .setImage(config.icwflahimg)
    .setFooter(
      `${bot.user.username}™ | Developed by: PK#1650 `,
      `${config.pkflashlogo}`
    )
    .setTimestamp();

  message.channel.send({embeds: [ballembed]});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["8-ball"],
  permLevel: "No permission need",
  manu: false
};

exports.help = {
  name: "8ball",
  category: "fun",
  description: "ask it a question",
  usage: "$8ball <your question>"
};

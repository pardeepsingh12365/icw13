const Discord = require('discord.js')
const config = require("../config.js")
//const GBL = require('gblapi.js');
 
module.exports = async (bot, db) => {
  const sstatus = (await db.ref(`bot/`).child("sstatus").once("value")).val();
  bot.user.setPresence({status: `streaming`, activities:[{ name: `${sstatus}`,type: `STREAMING`, url: `https://www.twitch.tv/pardeepsingh12365`}] });
  console.log("Bot ready");
  bot.channels.cache.get(config.botlogchannel).send({content:"bot ready\nbot logged "});
  
  //const Glenn = new GBL(bot.user.id, 'XA-fb198b2b0b04434482b685cc3232f889'); // Use your bot's user id and GBL Auth Token
  //Glenn.updateStats(bot.guilds.cache.size);
  const http = require("http");
  setInterval(() => {
    http.get(`http://icwmain.glitch.me/`);
    //console.log("ping sended")
  }, 25000);
var stations = [{
    name: 'mirchi',
    aliases: 'mirchifm',
    lang: 'hindi',
    id: 'radiomirchiindia',
    title: 'Radio Mirchi (hindi)',
    url: `${( await db.ref(`bot/radiolinks`).child('mirchi').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648191950381645865/radio-mirchi11111.jpg',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'capital',
    aliases: 'capitalfm',
    lang: 'english',
    id: 'CapitalUKMP3',
    title: 'Capital FM (english)',
    url: `${( await db.ref(`bot/radiolinks`).child('capitalfm').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648197427278643201/capital-fm.jpg',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'heart',
    aliases: 'heartfm',
    lang: 'english',
    id: 'HeartUKMP3',
    title: 'Heart FM (english)',
    url: `${( await db.ref(`bot/radiolinks`).child('heartfm').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648373549060325386/herat-radio.png',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name:'dnbradio',
    aliases: 'dnb',
    lang: 'english',
    id: 'durmandbassradio',
    title: 'Drum N Bass FM',
    url: `${( await db.ref(`bot/radiolinks`).child('dnbradio').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648373913017122836/dnb-radio.png',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'punjabins',
    aliases: 'ns',
    lang: 'punjabi',
    id: 'punjabinonstop',
    title: 'Non Stop Punjabi Radio (punjabi)',
    url: `${( await db.ref(`bot/radiolinks`).child('punjabins').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648373122235498497/nonstoppunjabilogo.png',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'hungama',
    aliases: 'hungamafm',
    lang: 'punjabi',
    id: 'punjabihungama',
    title: 'Radio Hungama Punjabi Hits (punjabi)',
    url: `${( await db.ref(`bot/radiolinks`).child('punjabihungama').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648372672664698881/hot-now-punjabi.jpg',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'dhakad',
    aliases: 'dhakadfm',
    lang: 'haryanvi',
    id: 'dhakadradio',
    title: 'Dhakad Radio - Haryanvi hits',
    url: `${( await db.ref(`bot/radiolinks`).child('dhakad').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/648406669872857089/dhakad-radio.png',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'redfm',
    aliases: 'red',
    lang: 'hindi',
    id: 'redfmindiahindi',
    title: 'Red FM India (hindi)',
    url: `${( await db.ref(`bot/radiolinks`).child('redfm').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/651739325385539595/redfm.jpg',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'era',
    aliases: 'erafm',
    lang: 'other',
    id: 'erafmmalaysia',
    title: 'Era FM Malaysia',
    url: `${( await db.ref(`bot/radiolinks`).child('era').once('value')).val()}`,
    thumbnail:'https://cdn.discordapp.com/attachments/640098613665726464/652553374600003589/erafm.png',
    duration: { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'big',
    aliases: 'bigfm',
    lang: 'hindi',
    id: 'bigfmhindiindia',
    title: 'Big-FM india(hindi)',
    url: `${( await db.ref(`bot/radiolinks`).child('big').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/701753908711653446/220px-BIGFM_NEW_LOGO_2019.png',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'city',
    aliases: 'radiocity',
    lang: 'hindi',
    id: 'radiocityindia',
    title: 'Radio City india(hindi)',
    url: `${(await db.ref(`bot/radiolinks`).child('city').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/701754282965467147/images_6.jpeg',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'aajtak',
    aliases: 'aajtakradio',
    lang: 'hindi',
    id: 'aajtakindia',
    title: 'Aaj tak india(hindi)',
    url: `${(await db.ref(`bot/radiolinks`).child('aajtak').once('value')).val()}`,
    thumbnail: 'https://media.discordapp.net/attachments/640098613665726464/710419967321047080/Aaj_tak_logo.png?width=605&height=454',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'akashvani',
    aliases: 'av',
    lang: 'hindi',
    id: 'akashvaniindia',
    title: 'Akash-Vani news india(hindi)',
    url: `${(await db.ref(`bot/radiolinks`).child('akashvani').once('value')).val()}`,
    thumbnail: 'https://media.discordapp.net/attachments/640098613665726464/710480862226939954/akashvani.png?width=180&height=180',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'dhol',
    aliases: 'dholradio',
    lang: 'punjabi',
    id: 'dholradioindia',
    title: 'Dhol Radio india(punjabi)',
    url: `${(await db.ref(`bot/radiolinks`).child('dhol').once('value')).val()}`,
    thumbnail: 'https://media.discordapp.net/attachments/640098613665726464/710526264041013310/dholradio.png?width=202&height=202',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'virsa',
    aliases: 'virsaradio',
    lang: 'punjabi',
    id: 'virsaindia',
    title: 'Virsa india(punjabi)',
    url: `${(await db.ref(`bot/radiolinks`).child('virsa').once('value')).val()}`,
    thumbnail: 'https://media.discordapp.net/attachments/640098613665726464/710526355238027306/virsa.webp?width=454&height=454',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: 'khas',
    aliases: 'khasharyanvi',
    lang: 'haryanvi',
    id: 'khasindia',
    title: 'Khas Haryanvi india(haryanvi)',
    url: `${(await db.ref(`bot/radiolinks`).child('khas').once('value')).val()}`,
    thumbnail: 'https://media.discordapp.net/attachments/640098613665726464/710526435382526052/khas_haryanvi.png?width=290&height=141',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  },
  {
    name: '977',
    aliases: '977music',
    lang: 'english',
    id: '977music',
    title: '977 music (english)',
    url: `${(await db.ref(`bot/radiolinks`).child('977').once('value')).val()}`,
    thumbnail: 'https://cdn.discordapp.com/attachments/640098613665726464/710681819586101279/977.jpg',
    duration: {months: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
  }
]
bot.radio.set("radio",stations)

}
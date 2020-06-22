const Discord = require('discord.js'); 
condt renkler = require('../EK/renkler.json");

module.exports.run = async(client, message, args) => {
 

  const Shuka = new Discord.MessageEmbed()
    .setDescription(`${client.ws.ping} ms.`) 
    .setColor(renk.turuncu)
  message.channel.send(Shuka)
 
}

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

module.exports.help = {
  name: 'ping'
};

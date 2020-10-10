const Discord = require('discord.js'),
client = new Discord.Client();
process.setMaxListeners(0); 
client.config = require("./config.js");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

require('child_process').execFile('find', [ 'komutlar/' ], function(err, stdout, stderr) {
  var files = stdout.split('\n');
  if (err) {
    if (err.message === "...") {
      return console.error(`Komut Dizini Bulunamadı!`);
    } else {
      return console.error(`Hata: ${err}`);
    };
  };

  
  console.log(`_________________________________${jsfile.length} komut yüklenecek_________________________________

`);
  jsfile.forEach((f, i) => {
  
    try {
      let props = require(`./${f}`);
      if (!props.run) return console.error(`Hata: module.exports.run yada exports.run bulunamadı: ${f}`);
      console.log(`_________________________________
Yükleniyor: ${props.help.name}.`);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (err) {
      if (err.message === "Cannot read property 'aliases' of undefined") {
        return console.error(`Hata: module.exports.help yada exports.help bulunamadı : ${f}`);
     } else if (err.message === "Cannot read property 'aliases' of undefined") {
        return console.error(`Hata: module.exports.conf yada exports.conf bulunamadı : ${f}`);
      } else {
        return console.error(`Hata: ${f}: ${err}`);
      };
    };
  });
  console.log(`${client.commands.array().length} / ${jsfile.length} komut yüklendi!`)});

client.on("message", async message => {

  require("./modules/functions.js")(client, message);
  if (message.author.bot) return;
  
  let command = message.content.split(" ")[0];
  let args = message.content.split(" ").slice(1);
  let prefix = client.config.prefix;
  
  if (0 !== message.content.indexOf(prefix)) return;
    
  let cmd = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));

    try {
      cmd.run(client, message, args);
    } catch (err) {
      
   const embed = new Discord.MessageEmbed()
   .setDescription(`Hata \`\`${cmd.help.name}\`\`: \`\`\`js\n${err.message}\n\`\`\``)
   .setColor("RED");
   message.channel.send(embed);
      
    
    };
    
});

client.on("ready", () => {
  client.user.setStatus("idle");
  /*client.user.setActivity("on", {
    type: "WATCHING"
   });*/
  console.log(`${client.user.username} aktif edildi!`);
  console.log(`${client.guilds.cache.size} sunucu ${client.users.cache.size} kullanıcı ${client.channels.cache.size} kanal ${client.emojis.cache.size} emoji`
  );
});
///

const DBL = require("dblapi.js");
const dbl = new DBL('Yoh sana token', client);


dbl.on('posted', () => {
  console.log('Sunucu bilgisi dbl ye atıldı!');
})

dbl.on('error', e => {
 console.log(`Hata ${e}`);
})
client.login(client.config.token)

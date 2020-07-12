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

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) return console.error(`I didn't found any command. 🙇`);
  
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
        return console.error(`Hata: module.exports.help or exports.help : ${f}`);
     } else if (err.message === "Cannot read property 'aliases' of undefined") {
        return console.error(`Hata: module.exports.conf or exports.conf : ${f}`);
      } else {
        return console.error(`Hata: ${f}: ${err}`);
      };
    };
  });
  console.log(`_________________________________
${client.commands.array().length} / ${jsfile.length} komut yüklendi!`)
  

});

client.on("message", async message => {

  require("./modules/functions.js")(client, message);
  if (message.author.bot) return;
  
  let command = message.content.split(" ")[0];
  let args = message.content.split(" ").slice(1);
  let prefix = client.config.prefix;
  
  if (0 !== message.content.indexOf(prefix)) return;
    
  let cmd = client.commands.get(command.slice(prefix.length)) || client.commands.get(client.aliases.get(command.slice(prefix.length)));
  if (cmd) {
    if (!message.guild && cmd.conf.guildOnly) return client.embed(message.channel, "Bu Komutu Özel Mesajlarda Kullanamzsın");
    const conf = client.config.defaultSettings;
    if (cmd.conf.botPermNeeded && cmd.conf.botPermNeeded.length >= 1) {
      for (var i in cmd.conf.botPermNeeded) {
        if (typeof cmd.conf.botPermNeeded[i] !== "string") continue;
        if (!message.guild.me.hasPermission(cmd.conf.botPermNeeded[i])) {
          client.embed(message.channel, client.config.botPermNeededMessage.replace(/<\/author\/>/g, message.author).replace(/<\/perm\/>/g, (client.lang && client.lang["PERMISSIONS_" + cmd.conf.botPermNeeded[i]]) ? client.lang["PERMISSIONS_" + cmd.conf.botPermNeeded[i]] : cmd.conf.botPermNeeded[i]));
          return;
        };
      };
    };
    if (cmd.conf.memberPermNeeded && cmd.conf.memberPermNeeded.length >= 1) {
      for (var i in cmd.conf.memberPermNeeded) {
        if (typeof cmd.conf.memberPermNeeded[i] !== "string") continue;
        if (!message.member.hasPermission(cmd.conf.memberPermNeeded[i])) {
          client.embed(message.channel, client.config.memberPermNeededMessage.replace(/<\/author\/>/g, message.author).replace(/<\/perm\/>/g, (client.lang && client.lang["PERMISSIONS_" + cmd.conf.memberPermNeeded[i]]) ? client.lang["PERMISSIONS_" + cmd.conf.memberPermNeeded[i]] : cmd.conf.memberPermNeeded[i]));
          return;
        };
      };
    };
    
    try {
      cmd.run(client, message, args);
    } catch (err) {
      if (client.config.errors.warn_user === true) {
        const embed = new Discord.MessageEmbed().setDescription(`Hata \`\`${cmd.help.name}\`\`: \`\`\`xlsx\n${err.message}\n\`\`\``).setColor("RANDOM");
        message.channel.send(embed);
      };
      if (client.config.errors.log_channel !== "0") {
        const _embed_error = new Discord.MessageEmbed().setTitle(`Komut çalıştırılırken hata oluştu: *${cmd.help.name}*.`).addField(err.name, `\`\`\`xlsx\n${err.message}\n\`\`\``).addBlankField(true).setColor('RANDOM').setTimestamp();
        client.channels.get(client.config.errors.log_channel).send(_embed_error);
      };
      if (client.config.errors.warn_console === true) {
        console.error(err);
      };
    };
    
    let k = `Kullanan: ${message.author.tag}\nID: ${message.author.id}\nKullanılan Komut: ${cmd.help.name}`;
    message.guild && (k += `\nServer: ${message.guild.name}\nKanal: ${message.channel.name}`), console.log(`\n${k}\n`);
  };
});

client.login(client.config.token)

//-
client.on("ready", () => {
  client.user.setStatus("idle");
  //client.user.setActivity("on", {
   // type: "WATCHING"
  //  });
  console.log(`${client.user.username} aktif edildi!`);
  console.log(
    `${client.guilds.cache.size} sunucu ${client.users.cache.size} kullanıcı ${client.channels.cache.size} kanal ${client.emojis.cache.size} emoji`
  );
});
///

const DBL = require("dblapi.js");
const dbl = new DBL('Yoh sana token', client);

// Optional events
dbl.on('posted', () => {
  console.log('Sunucu bilgisi dbl ye atıldı!');
})

dbl.on('error', e => {
 console.log(`Hata ${e}`);
})

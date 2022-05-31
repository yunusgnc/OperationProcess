const { channel } = require("diagnostics_channel");
const Discord = require("discord.js");
var weather = require("weather-js");
const file = "./src/words.txt";
const fs = require("fs");
const { time } = require("console");
const allIntents = new Discord.Intents(32767);
const client = new Discord.Client({ intents: allIntents });
const { MessageActionRow, MessageSelectMenu,MessageEmbed } = require('discord.js');
const Database = require("@replit/database");
const db = new Database();
const mySecret = process.env['TOKEN']
var stringSimilarity = require("string-similarity");
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var mybox = [];

//Kullanıcı Katıldığında
client.on("guildMemberAdd", (member) => {
  const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('bolum')
					.setPlaceholder('Seçenekleri görmek için Tıkla!')
					.addOptions([
						{
							label: 'Bilgisayar Programcılığı',
							description: '',
							value: 'bilPrg',
						},
						{
							label: 'Mimarlık',
							description: '',
							value: 'mimar',
						},
					]),
			);  
		member.send({ content: 'Okuduğunuz Bölümü Seçiniz.', components: [row] });
});

client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;
  if(interaction.customId=="bolum"){
    var box = {'bolum':interaction.values[0]};
    const msg_filter = (m) => m.author.id === interaction.user.id;
  console.log(interaction);
  interaction.message.channel.send("Adınızı ve Soyadınızı Giriniz")
    .then(() => {interaction.message.channel.awaitMessages({
           filter: msg_filter,
          max: 1,
          time: 30000,
          errors: ['time']
        })
    .then((collected)=>{
      console.log(collected.first().content)
    })
});
  }
});

client.on("message", (msg) => {
  ReadBadwordsFile(mybox);
  //Küfür kullananları uyarma.
  mybox.forEach((item) => {
    if (msg.content.toLocaleLowerCase() == item.toLocaleLowerCase()) {
      msg.channel.send(msg.author.username + ", Rica ediyorum küfür etme.");
    }
  });

  //İlk mesaj için kullanıcı yönlendirme.
  let firstMsg = "mrb,selam,merhaba,slm,günaydın,iyi akşamalar";
  var word = firstMsg.split(",");
  word.forEach((item) => {
    if (msg.content.toLocaleLowerCase() === item) {
      msg.channel.send(
        msg.author.username +
          " , Merhaba ne tür konuda yardım istiyordunuz ? yardım için '!help' menüsünden yardım alıabilirsiniz."
      );
    }
  });

  //Profil resmi gösterme.
  if (msg.content == "resim") {
    msg.reply(msg.author.displayAvatarURL());
  }

  //Bot yardım özlellikleri
  if (msg.content == "!help") {
    helpForUser(msg.channel);
  }

  //Bot yardım özlellikleri
  if (msg.content == "!sss") {
    sSSForUser(msg.channel);
  }

  //Sıkça Sorulan Sorular
  readJsonFile(msg);

  //Hava Durumu.
  if (msg.content == "hava?") {
    weather.find(
      { search: "Iğdır, TR", degreeType: "F" },
      function (err, result) {
        if (err) console.log(err);
        result.map((item) => {
          msg.channel.send(
            item.current.observationpoint + "-" + item.current.skytext
          );
        });
      }
    );
  }
});

// Küfürlü kelime dosyasını okuma.
function ReadBadwordsFile(mybox) {
  let badwords;
  try {
    badwords = fs.readFileSync(file, "utf8");
    badwords.split(",").forEach((item) => {
      mybox.push(item);
    });
  } catch (err) {
    console.error(err);
  }
}

function readJsonFile(msg) {
  const jsonData = require("./sss.json");
  jsonData.sss.forEach((item) => {
    if (msg.content == "sss1") {
      msg.channel.send(item.sss1);
    }
    if (msg.content == "sss2") {
      msg.channel.send(item.sss2);
    }

    if (msg.content == "sss3") {
      msg.channel.send(item.sss3);
    }
    if (msg.content == "sss4") {
      msg.channel.send(item.sss4);
    }
    if (msg.content == "sss5") {
      msg.channel.send(item.sss5);
    }
    if (msg.content == "sss6") {
      msg.channel.send(item.sss6);
    }
    if (msg.content == "sss7") {
      msg.channel.send(item.sss7);
    }
    if (msg.content == "sss8") {
      msg.channel.send(item.sss8);
    }
  });
}

//help menu ;
function helpForUser(channel) {
  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Commands : ")
    .addFields(
      { name: "Hava durumu : ", value: "hava?" },
      { name: "Profil resimi için :", value: "resim" },
      { name: "Sıkça Sorulan Sorular :", value: "!sss" }
    )
    .setTimestamp()
    .setFooter({
      text: "Aubamyng_17 : ",
      iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  channel.send({ embeds: [exampleEmbed] });
}

client.login(mySecret);
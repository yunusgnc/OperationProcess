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

//kullanıcı katıldığında sorulacak sorular
client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;
  if(interaction.customId=="bolum"){
    var box = {'bolum':interaction.values[0]};
    const msg_filter = (m) => m.author.id === interaction.user.id;
  interaction.message.channel.send("Adınızı ve Soyadınızı Giriniz")
    .then(() => {interaction.message.channel.awaitMessages({
           filter: msg_filter,
          max: 1,
          time: 30000,
          errors: ['time']
        })
    .then((collected)=>{
      box["isim"] = collected.first().content
      interaction.message.channel.send("Numaranızı Giriniz")
      .then(()=>{interaction.message.channel.awaitMessages({
        filter: msg_filter,
        max:1,
        time:30000,
        error: ['time']
      })
      .then(collected=>{
        collected.first().content  
      db.set(collected.first().content.toString(),box).then(() => {
        interaction.message.channel.send("Başarıyla Kaydoldunuz.")
      });
      })
    })
      
    })
});
  }
});

client.on("message", (msg) => {
  ReadBadwordsFile(mybox);
  kufur = 0;

  if (msg.content.toLocaleLowerCase().includes("soru") && kufur==0){
    readQuestionFile(msg);
    kufur=1;
  }

  console.log(msg.content);
  
  //Küfür kullananları uyarma.
  mybox.forEach((item) => {
    if (msg.content.toLocaleLowerCase() == item.toLocaleLowerCase() && kufur == 0){
      msg.channel.send(msg.author.username + ", Rica ediyorum küfür etme.");
      kufur = 1
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

  //Eğer bot cevaplayamazsa yöneticiye gönder mesajı
  else if (msg.content == "datalist" && msg.author.id== 798598304023707679){
    db.list().then(keys => {
      keys.forEach(key =>{
        var current_key = key
        db.get(key).then(value=>{
        msg.author.send(`${current_key} : ${value["isim"]} | ${value["bolum"]}\n`)
        })
      })
    
      
    });
    
  }

  //Bot yardım özlellikleri
  else if (msg.content == "!help") {
    helpForUser(msg.channel,client);
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
function readQuestionFile(msg){
  const jsonData = require("./sorular.json");
  a = Object.keys(jsonData)
  var s = 0;
  a.forEach(item=>{
    var percentage=stringSimilarity.compareTwoStrings(item,msg.content.toString().slice(5))
    console.log(percentage)
      if (percentage>= 0.56){
        msg.channel.send(jsonData[item])
        s = 1
      }
  })
  if (s == 0){
    client.users.fetch('798598304023707679').then((user) => {
      user.send(`${msg.author.id} = ${msg.author} sorusu: ${msg.content}`)
}).catch(console.error);
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
function helpForUser(channel,client) {
  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Commands :")
    .addFields(
      { name: "Hava durumu : ", value: "hava?" },
      { name: "Profil resimi için :", value: "resim" },
      { name: "Sıkça Sorulan Sorular :", value: "!sss" },
      { name: "Soru sormak için :", value: "soru yazıp boşluk bıraktıktan sonra sorunuzu sorabilirsiniz. \n  Örnek : soru Ben kaç yaşındayım." },
    )
    .setTimestamp()
    .setFooter({
      text: client.user.username.toString(),
      iconURL: "https://oyuncularsehri.com/data/avatars/o/7/7327.jpg?1587578231",
    });

  channel.send({ embeds: [exampleEmbed] });
}
function sSSForUser(channel) {
  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Başlıkların altıntaki mesajı yazarak sonuca ulaşabilirsiniz.")
    .addFields(
      {
        name: "Her yıl programlara yeni kayıt yaptıracak öğrencileri kim belirliyor?  ",
        value: "sss1",
      },
      { name: "Üniversitemize kayıt nasıl yapılır?", value: "sss2" },
      {
        name: "Üniversiteye yeni kaydımı süresi içinde yaptıramazsam ne olur?",
        value: "sss3",
      },
      {
        name: "Danışmanım kimdir? Nasıl öğrenebilirim? Görevi nedir? ",
        value: "sss4",
      },
      {
        name: "Yeni kayıt işlemlerini şahsen yapmak zorunda mıyım?",
        value: "sss5",
      },
      {
        name: "Yeni kayıtta, ÖSYS Kılavuzunda istenen belgelerden başka belge istenir mi?",
        value: "sss6",
      },
      {
        name: "Üniversiteye yeni kayıt yaptırdıktan sonra başka işlem yapmam gerekiyor mu?",
        value: "sss7",
      },
      { name: "7-Ders başlama tarihlerini nasıl öğrenebilirim?", value: "sss8" }
    )
    .setTimestamp()
    .setFooter({
      text: "Aubamyng_17 : ",
      iconURL: "https://i.imgur.com/AfFp7pu.png",
    });

  channel.send({ embeds: [exampleEmbed] });
}

client.login(mySecret);
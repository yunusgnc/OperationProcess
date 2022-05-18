const discord = require("discord.js");
const { MessageButton } = require("discord-buttons");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, message, args, prefix) => {
  if (message.content.startsWith(prefix+"btn")) return;

  const embed = new MessageEmbed().setTitle("Are you smart ?").setColor("BLUE");

  const yes = new MessageButton()
    .setLabel("Evet")
    .setColor("green")
    .setStyle("primary")
    .setID("yes");
  

  const no = new MessageButton()
    .setLabel("Hayır")
    .setColor("#0099ff")
    .setStyle("danger")
    .setID("no");

  message.channel.send("hello", {
    buttons: [yes, no],
    embeds: embed,
  });

  module.exports.help = {
    name: "smart",
    aliases: [],
  };
};

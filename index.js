const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = "t#";
const colors = { spirit: "#b2f5ff", deft: "#fbe6a3", tough: "#ffadbe" }

const fs = require("fs");
client.msgs = require ("./msgs.json");

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if(message.content === prefix + 'profile'){
        let embed = new Discord.RichEmbed()
            .setImage(message.member.user.avatarURL)
            .setTitle(message.member.user.tag)
            .setDescription(`${message.member.user.username}'s Avatar`);
        message.channel.send(embed);
    }
    if(message.content === prefix + 'server'){
        let embed = new Discord.RichEmbed()
            .setTitle(message.guild.name)
            .setDescription("Server Information")
            .setThumbnail(message.guild.iconURL)
            .setColor("#15f153")
            .addField("Member Count", message.guild.members.filter(member => !member.user.bot).size)
            .addField("Bot Count", message.guild.members.filter(member => member.user.bot).size);
        message.channel.send(embed);
    }
    if(message.content.startsWith("write")){
        let editedMessage = message.content.slice(6);
        client.messages[message.author.username] = {
            message: message.content
        }
        fs.writeFile("./msgs.json", JSON.stringify(client.msgs, null, 4), err => {
            if (err) throw err;
            message.channel.send("message written");
        })
    }
    if(message.content.startsWith("get")){
        let _message = client.msgs[message.author.username].message;
        message.channel.send("message is: " + _message);
    }
})

client.login(auth.token);
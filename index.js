const Discord = require('discord.js');
const fs = require("fs");

const client = new Discord.Client();
// const auth = require('./auth.json');
// const auth = require('./auth-dev.json');
require("dotenv-flow").config();

const config = {
    token: process.env.TOKEN,
    owner: process.env.OWNER,
    prefix: process.env.PREFIX,
} 

const prefix = config.prefix;
const colors = { weapon: "11728383", memory: "16508579", character: "16756158" };
const rarities = { weapon: [6, 5], memory: [6, 5], character: ["S", "A", "B"]};
const global_timeout = 120000;

function capitalizeFirstLetter(string) {
    if(string === "") return;
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function titleCase(string) {
    return string.split(" ").map(x => capitalizeFirstLetter(x)).join(" ");
}

function emoji(name) {
    return client.emojis.find(emoji => emoji.name === name).toString();
}

function initializeReactCollector(msg) {
    const filter = (reaction, user) => {
        return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id !== msg.author.id;
    };
    msg.react('◀️').then(() => {
        msg.react('▶️')
    });
    return msg.createReactionCollector(filter, { time: global_timeout });
}

client.msgs = require ("./msgs.json");
client.memories = require ("./json/memories.json");
client.missions = require ("./json/missions.json");
client.weapons = require ("./json/weapons.json");
client.characters = require ("./json/characters.json");

client.on('ready', () => {
    client.user.setActivity('~help for commands!');
    console.log(`logged in as ${client.user.tag}! I am currently in ${client.guilds.size} servers!`);
});

client.on('message', msg => {
    if(msg.content.toLowerCase().includes("bully") || msg.content.toLowerCase().includes("bulli")){
        if(!msg.author.bot) return msg.channel.send("no bully!");
    }
    // if(msg.content.startsWith("write")){
    //     let editedmsg = msg.content.slice(6);
    //     client.msgs[msg.author.username] = {
    //         msg: editedmsg
    //     }
    //     fs.writeFile("./msgs.json", JSON.stringify(client.msgs, null, 4), err => {
    //         if (err) throw err;
    //         msg.channel.send("msg written");
    //     })
    // }
    // if(msg.content.startsWith("get")){
    //     let _msg = client.msgs[msg.author.username].msg;
    //     msg.channel.send("msg is: " + _msg);
    // }
})

client.login(config.token);
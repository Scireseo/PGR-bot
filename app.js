const { Client } = require('discord.js');
const client = new Client();
const Enmap = require('enmap');
const fs = require("fs");
require("dotenv-flow").config();

const config = {
    token: process.env.TOKEN,
    owner: process.env.OWNER,
    prefix: process.env.PREFIX,
} 
client.commands = new Enmap();
client.config = config;
client.memories = require ("./json/memories.json");
client.missions = require ("./json/missions.json");
client.weapons = require ("./json/weapons.json");
client.characters = require ("./json/characters.json");
client.misc = require ("./json/misc.json");
client.colors = { weapon: "11728383", memory: "16508579", character: "16756158" };
client.rarities = { weapon: [6, 5], memory: [6, 5], character: ["S", "A", "B"]};
client.global_timeout = 120000;
client.on('ready', () => {
    client.user.setActivity('~help for commands!');
    console.log(`logged in as ${client.user.tag}! I am currently in ${client.guilds.cache.size} servers!`);
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.login(config.token);

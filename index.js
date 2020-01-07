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
    if(msg.content === prefix + 'profile'){
        let embed = {
            title: msg.member.user.tag,
            description: `${msg.member.user.username}'s Avatar`,
            image: {
                url: msg.member.user.avatarURL,
            }
        }
        msg.channel.send({ embed: embed });
    }
    if(msg.content === prefix + 'server'){
        let embed = {
            title: msg.guild.name,
            description: "Server Information",
            thumbnail: {
                url: msg.guild.iconURL,
            },
            color: 1438035,
            fields: [
                {
                    name: "Member Count",
                    value: msg.guild.members.filter(member => !member.user.bot).size
                },
                {
                    name: "Bot Count",
                    value: msg.guild.members.filter(member => member.user.bot).size
                }
            ]
        }
        msg.channel.send({ embed: embed });
    }
    if(msg.content === prefix + 'help'){
        let embed = {
            title: "Here are the commands that you can use, Commander!",
            fields: [
                {
                    name: "Memories",
                    value: `
                        **~memory list** | Shows a list of available memories
                        **~memory <name of memory>** | Displays information about the Memory  
                    `
                },
                {
                    name: "Weapons",
                    value: `
                        **~weapon list** | Shows a list of available weapons
                        **~weapon <name of weapon>** | Displays information about the Weapon
                    `
                },
                {
                    name: "Missions",
                    value: `
                        **~mission list** | Shows a list of available missions
                        **~mission <name of mission>** | Displays information about the Mission
                    `
                },
            ]
        }
        msg.author.send({ embed: embed });
        msg.channel.send(`Message sent, Commander! Now please stop bullying me! ${emoji("2_")}`);
    }
    if(msg.content.toLowerCase().startsWith(prefix + "mission")){
        let embed = {};
        let mission_name = msg.content.replace(prefix + "mission", "").trim().toLowerCase();
        let list_of_missions = Object.keys(client.missions);
        let selected_mission = list_of_missions.find(mission => mission.includes(mission_name));
        if(mission_name.toLowerCase() === "list"){
            list_of_missions = list_of_missions.map((mission, index) => `${index + 1}.) ${mission}`).join("\r\n");
            embed = {
                title: "Mission list",
                fields: [{ name: "names", value: list_of_missions }]
            }
            return msg.channel.send({ embed: embed });
        }
        else if(selected_mission === undefined || mission_name === "")
            return msg.channel.send("The mission that you're looking for does not exist. Be sure to check the list by typing the command `~mission list`");
        mission_name = titleCase(selected_mission);
        selected_mission = client.missions[selected_mission];
        embed = {
            title: `${mission_name} missions`,
            fields: Object.keys(selected_mission).map(mission => {
                return {
                    name: mission_name.toLowerCase() === "rookie" ? `Day ${parseInt(mission) + 1}` : mission,
                    value: Object.values(selected_mission[mission]).map(details => `• ${details}`).join("\r\n")
                }
            })
        }; 
        msg.channel.send({ embed: embed });
    }
    // if(msg.content.toLowerCase().startsWith(prefix + "memory")){
    //     let embed = {};
    //     let rarity = "";
    //     let memory_name = titleCase(msg.content.replace(prefix + "memory", "").trim());
    //     let list_of_memories = Object.values(client.memories);
    //     let selected_memory = list_of_memories.find(memory => memory.name.includes(memory_name));
    //     let memory_index = list_of_memories.findIndex(memory => memory.name.includes(memory_name));
    //     if(memory_name.toLowerCase() === "list"){
    //         let rarity_index = 0;
    //         let max_index = rarities.memory.length - 1;
    //         function generateEmbed(){
    //             let list_of_memories_by_rarity = list_of_memories.filter(memory => memory.rarity === rarities.memory[rarity_index]).map((memory, index) => `${index + 1}.) ${memory.name}`).join("\r\n");
    //             let generated_embed = {
    //                 title: "memory list",
    //                 fields: [{ name: `${rarities.memory[rarity_index]}★ memories`, value: list_of_memories_by_rarity }]
    //             }
    //             return generated_embed;
    //         }
    //         embed = generateEmbed();
    //         return msg.channel.send({ embed: embed }).then((sent_msg) => {
    //             let react_collector = initializeReactCollector(sent_msg);
    //             react_collector.on('collect', reaction => {
    //                 if(reaction.emoji.name === '◀️'){
    //                     rarity_index = rarity_index - 1 < 0 ? max_index : --rarity_index;
    //                     embed = generateEmbed();
    //                     sent_msg.edit({ embed: embed });
    //                 }
    //                 else{
    //                     rarity_index = rarity_index + 1 > max_index ? 0 : ++rarity_index;
    //                     embed = generateEmbed();
    //                     sent_msg.edit({ embed: embed });
    //                 }
    //             });
    //             react_collector.on('end', () => {
    //                 sent_msg.reactions.map(reaction => reaction.remove(sent_msg.author.id));
    //             })
    //         });
    //     }
    //     else if(selected_memory === undefined || memory_name === "")
    //         return msg.channel.send("The memory that you're looking for does not exist. Be sure to check the list by typing the command `~memory list`!");
    //     let attachment = ("0" + memory_index).slice(-2).concat(".png");
    //     for(x = 0; x <= selected_memory.rarity - 1; x++){
    //         rarity += "★";
    //     }
    //     embed = {
    //         title: `${selected_memory.name}(${rarity})`,
    //         color: colors.memory,
    //         thumbnail: {
    //             url: `attachment://${attachment}`,
    //         },
    //         fields: [
    //             {
    //                 name: "2 set effect",
    //                 value: selected_memory.effect_1,
    //             },
    //             {
    //                 name: "4 set effect",
    //                 value: selected_memory.effect_2,
    //             },
    //             {
    //                 name: "HP",
    //                 value: selected_memory.base_HP + `(**${selected_memory.max_HP}**)`,
    //                 inline: true,
    //             },
    //             {
    //                 name: "ATK",
    //                 value: selected_memory.base_ATK + `(**${selected_memory.max_ATK}**)`,
    //                 inline: true,
    //             },
    //             {
    //                 name: "DEF",
    //                 value: selected_memory.base_DEF + `(**${selected_memory.max_DEF}**)`,
    //                 inline: true,
    //             },
    //             {
    //                 name: "CRIT",
    //                 value: selected_memory.base_CRIT + `(**${selected_memory.max_CRIT}**)`,
    //                 inline: true,
    //             },
    //         ]
    //     }
    //     msg.channel.send({ 
    //         embed: embed,
    //         files: [{
    //             attachment: `./static/images/memories/${attachment}`,
    //             name: attachment
    //         }]
    //     });
    // }
    // if(msg.content.toLowerCase().startsWith(prefix + "weapon")){
    //     let embed = {};
    //     let rarity = "";
    //     let weapon_name = titleCase(msg.content.replace(prefix + "weapon", "").trim());
    //     let list_of_weapons = Object.values(client.weapons);
    //     let selected_weapon = list_of_weapons.find(weapon => weapon.name.includes(weapon_name));
    //     let weapon_index = list_of_weapons.findIndex(weapon => weapon.name.includes(weapon_name));
    //     if(weapon_name.toLowerCase() === "list"){
    //         let rarity_index = 0;
    //         let max_index = rarities.weapon.length - 1;
    //         function generateEmbed(){
    //             let list_of_weapons_by_rarity = list_of_weapons.filter(weapon => weapon.rarity === rarities.weapon[rarity_index]).map((weapon, index) => `${index + 1}.) ${weapon.name}`).join("\r\n");
    //             let generated_embed = {
    //                 title: "weapon list",
    //                 fields: [{ name: `${rarities.weapon[rarity_index]}★ weapons`, value: list_of_weapons_by_rarity }]
    //             }
    //             return generated_embed;
    //         }
    //         embed = generateEmbed();
    //         return msg.channel.send({ embed: embed }).then((sent_msg) => {
    //             let react_collector = initializeReactCollector(sent_msg);
    //             react_collector.on('collect', reaction => {
    //                 if(reaction.emoji.name === '◀️'){
    //                     rarity_index = rarity_index - 1 < 0 ? max_index : --rarity_index;
    //                     embed = generateEmbed();
    //                     sent_msg.edit({ embed: embed });
    //                 }
    //                 else{
    //                     rarity_index = rarity_index + 1 > max_index ? 0 : ++rarity_index;
    //                     embed = generateEmbed();
    //                     sent_msg.edit({ embed: embed });
    //                 }
    //             });
    //             react_collector.on('end', () => {
    //                 sent_msg.reactions.map(reaction => reaction.remove(sent_msg.author.id));
    //             })
    //         });
    //     }
    //     else if(selected_weapon === undefined || weapon_name === "")
    //         return msg.channel.send("The weapon that you're looking for does not exist. Be sure to check the list by typing the command `~weapon list`!");
    //     let attachment = ("0" + weapon_index).slice(-2).concat(".png");
    //     for(x = 0; x <= selected_weapon.rarity - 1; x++){
    //         rarity += "★";
    //     }
    //     embed = {
    //         title: `${selected_weapon.name}(${rarity})`,
    //         color: colors.weapon,
    //         thumbnail: {
    //             url: `attachment://${attachment}`,
    //         },
    //         fields: [
    //             {
    //                 name: "effect",
    //                 value: selected_weapon.effect,
    //             },
    //             {
    //                 name: "ATK",
    //                 value: selected_weapon.base_ATK + `(**${selected_weapon.max_ATK}**)`,
    //                 inline: true,
    //             },
    //             {
    //                 name: "CRIT",
    //                 value: selected_weapon.base_CRIT + `(**${selected_weapon.max_CRIT}**)`,
    //                 inline: true,
    //             },
    //         ]
    //     }
    //     msg.channel.send({ 
    //         embed: embed,
    //         files: [{
    //             attachment: `./static/images/weapons/${attachment}`,
    //             name: attachment
    //         }]
    //     });
    // }
    if(msg.content.toLowerCase().startsWith(prefix + "character")){
        let embed = {};
        let rarity = "";
        let character_name = titleCase(msg.content.replace(prefix + "character", "").trim());
        let list_of_characters = Object.values(client.characters);
        let selected_character = list_of_characters.filter(character => character.name.includes(character_name));
        console.log('check: ', selected_character);
        // let weapon_index = list_of_weapons.findIndex(weapon => weapon.name.includes(weapon_name));
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
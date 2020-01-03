const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = "~";
const colors = { weapons: "11728383", memory: "16508579", character: "16756158" };

const fs = require("fs");

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

client.msgs = require ("./msgs.json");
client.memories = require ("./json/memories.json");
client.missions = require ("./json/missions.json");

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
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
    if(msg.content.toLowerCase().startsWith(prefix + "mission")){
        let embed = {};
        let mission_name = msg.content.replace(prefix + "mission", "").trim().toLowerCase();
        let list_of_missions = Object.keys(client.missions);
        let selected_mission = list_of_missions.find(mission => mission.includes(mission_name));
        if("list".includes(mission_name.toLowerCase())){
            list_of_missions = list_of_missions.map((mission, index) => `${index + 1}.) ${mission}`).join("\r\n");
            embed = {
                title: "mission list",
                fields: [{ name: "commands", value: list_of_missions }]
            }
            return msg.channel.send({ embed: embed });
        }
        else if(selected_mission === undefined)
            return msg.channel.send("The mission that you're looking for does not exist. Be sure to check the list by typing the command `~mission list`");
        mission_name = titleCase(selected_mission);
        selected_mission = client.missions[selected_mission];
        embed = {
            title: `${mission_name} missions`,
            fields: Object.keys(selected_mission).map(mission => {
                return {
                    name: mission,
                    value: Object.values(selected_mission[mission]).map(details => `• ${details}`).join("\r\n")
                }
            })
        }; 
        msg.channel.send({ embed: embed });
    }
    if(msg.content.toLowerCase().startsWith(prefix + "memory")){
        let embed = {};
        let rarity = "";
        let memory_name = titleCase(msg.content.replace(prefix + "memory", "").trim());
        let list_of_memories = Object.values(client.memories);
        let selected_memory = list_of_memories.find(memory => memory.name.includes(memory_name));
        let memory_index = list_of_memories.findIndex(memory => memory.name.includes(memory_name));
        if("list".includes(memory_name.toLowerCase())){
            list_of_memories = list_of_memories.map((memory, index) => `${index + 1}.) ${memory.name}`).join("\r\n");
            embed = {
                title: "memory list",
                fields: [{ name: "names", value: list_of_memories }]
            }
            return msg.channel.send({ embed: embed });
        }
        else if(selected_memory === undefined)
            return msg.channel.send("The memory that you're looking for does not exist. Be sure to check the list by typing the command `~memory list`");
        let attachment = ("0" + memory_index).slice(-2).concat(".png");
        for(x = 0; x <= selected_memory.rarity - 1; x++){
            rarity += "★";
        }
        embed = {
            title: `${selected_memory.name}(${rarity})`,
            color: colors.memory,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            fields: [
                {
                    name: "2 set effect",
                    value: selected_memory.effect_1,
                },
                {
                    name: "4 set effect",
                    value: selected_memory.effect_2,
                },
                {
                    name: "HP",
                    value: selected_memory.base_HP + `(**${selected_memory.max_HP}**)`,
                    inline: true,
                },
                {
                    name: "ATK",
                    value: selected_memory.base_ATK + `(**${selected_memory.max_ATK}**)`,
                    inline: true,
                },
                {
                    name: "DEF",
                    value: selected_memory.base_DEF + `(**${selected_memory.max_DEF}**)`,
                    inline: true,
                },
                {
                    name: "CRIT",
                    value: selected_memory.base_CRIT + `(**${selected_memory.max_CRIT}**)`,
                    inline: true,
                },
            ]
        }
        msg.channel.send({ 
            embed: embed,
            files: [{
                attachment: `./static/images/memories/${attachment}`,
                name: attachment
            }]
        });
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

client.login(auth.token);
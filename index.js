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
        let bullet_point = "•";
        let embed = {};
        let mission_name = titleCase(msg.content.replace(prefix + "mission", "").trim());
        let selected_mission = Object.keys(client.missions).find(missions => missions.includes(mission_name));
        let mission_index = Object.keys(client.missions).findIndex(missions => missions.includes(mission_name));
        mission_name = selected_mission;
        selected_mission = client.missions[selected_mission];
        console.log("[checking]", mission_name, selected_mission);
        // let embed = {
        //     title: "Daily missions",
        //     fields: [{ 
        //         name: "Standard", 
        //         value: `
        //             • Login in 1 time
        //             • Clear any battle once
        //             • Enhance weapon
        //             • Enhance stigma
        //             • Enhance character
        //             • Purchase any item in the shop
        //             • Exchange black cards for stamina once
        //             • Consume 100 stamina
        //             • Consume 200 stamina
        //             • Consume 300 stamina
        //             • Talk to character in the home page once
        //             • Visit dorm once
        //             • Clear pain cage 3 times
        //             • Clear war zone 3 times
        //         `
        //     }]
        // }
        // msg.channel.send({ embed: embed });
    }
    if(msg.content.toLowerCase().startsWith(prefix + "memory")){
        let embed = {};
        let memory_name = titleCase(msg.content.replace(prefix + "memory", "").trim());
        let selected_memory = Object.keys(client.memories["memory"]).find(memory => memory.includes(memory_name));
        let memory_index = Object.keys(client.memories["memory"]).findIndex(memory => memory.includes(memory_name));
        memory_name = selected_memory;
        selected_memory = client.memories["memory"][selected_memory];
        if(memory_name.toLowerCase() === "list"){
            let listOfmemory = Object.keys(client.memories["memory"]).map((memory, index) => `${index + 1}.) ${memory}`)
            listOfmemory = listOfmemory.join("\r\n");
            embed = {
                title: "memory list",
                fields: [{ name: "Names", value: listOfmemory }]
            }
            return msg.channel.send({ embed: embed });
        }
        else if(selected_memory === undefined)
            return msg.channel.send("The memory that you're looking for does not exist. Be sure to check the list by typing the command `~memory list`");
            let attachment = ("0" + memory_index).slice(-2).concat(".png");
        let rarity = "";
        for(x = 0; x <= selected_memory.rarity - 1; x++){
            rarity += "★";
        }
        embed = {
            title: `${memory_name}(${rarity})`,
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
                attachment: `./static/images/memory/${attachment}`,
                name: attachment
            }]
        });
        
        //move to a separate command
        // let selectedLB = client.memories["breakthrough"][selected_memory["rarity"]];
        // console.log("rarity", selectedLB);
        // let breakthrough = Object.keys(selectedLB).map((breakthrough, index) => 
        //     `
        //         ${index + 1}: ${selectedLB[breakthrough].nuts}x ${emoji("black_nuts")} 
        //         ${selectedLB[breakthrough].memory_low}x ${emoji("memory_low")}
        //         ${selectedLB[breakthrough].memory_high}x ${emoji("memory_high")}
        //         ${selectedLB[breakthrough].alloy_low}x ${emoji("alloy_low")}
        //         ${selectedLB[breakthrough].alloy_high}x ${emoji("alloy_high")}
        //     `
        // );
        // breakthrough = breakthrough.join("\r\n");
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
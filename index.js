const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = "~";
// const colors = { spirit: "#b2f5ff", deft: "#fbe6a3", tough: "#ffadbe" }
const colors = { weapons: "11728383", awareness: "16508579", character: "16756158" };

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
client.awareness = require ("./json/awareness.json");

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.toLowerCase().includes("bully") || msg.content.toLowerCase().includes("bulli")){
        if(!msg.author.bot) return msg.channel.send("no bully!");
    }
    if(msg.content === prefix + 'profile'){
        let embed = new Discord.RichEmbed()
            .setImage(msg.member.user.avatarURL)
            .setTitle(msg.member.user.tag)
            .setDescription(`${msg.member.user.username}'s Avatar`);
        msg.channel.send(embed);
    }
    if(msg.content === prefix + 'server'){
        let embed = new Discord.RichEmbed()
            .setTitle(msg.guild.name)
            .setDescription("Server Information")
            .setThumbnail(msg.guild.iconURL)
            .setColor("#15f153")
            .addField("Member Count", msg.guild.members.filter(member => !member.user.bot).size)
            .addField("Bot Count", msg.guild.members.filter(member => member.user.bot).size);
        msg.channel.send(embed);
    }
    if(msg.content.toLowerCase() === prefix + 'daily'){
        let embed = {
            title: "Daily missions",
            fields: [{ 
                name: "list of dailies", 
                value: `
                    • Login in 1 time
                    • Clear any battle once
                    • Enhance weapon
                    • Enhance stigma
                    • Enhance character
                    • Purchase any item in the shop
                    • Exchange black cards for stamina once
                    • Consume 100 stamina
                    • Consume 200 stamina
                    • Consume 300 stamina
                    • Talk to character in the home page once
                    • Visit dorm once
                    • Clear pain cage 3 times
                    • Clear war zone 3 times
                `
            }]
        }
        msg.channel.send({ embed: embed });
    }
    if(msg.content.toLowerCase().startsWith(prefix + "awareness")){
        let embed = {};
        let awarenessName = titleCase(msg.content.replace(prefix + "awareness", "").trim());
        let selectedAwareness = Object.keys(client.awareness["awareness"]).find(awareness => awareness.includes(awarenessName));
        let awarenessIndex = Object.keys(client.awareness["awareness"]).findIndex(awareness => awareness.includes(awarenessName));
        awarenessName = selectedAwareness;
        selectedAwareness = client.awareness["awareness"][selectedAwareness];
        if(awarenessName.toLowerCase() === "list"){
            let listOfAwareness = Object.keys(client.awareness["awareness"]).map((awareness, index) => `${index + 1}.) ${awareness}`)
            listOfAwareness = listOfAwareness.join("\r\n");
            embed = {
                title: "Awareness list",
                fields: [{ name: "Names", value: listOfAwareness }]
            }
            return msg.channel.send({ embed: embed });
        }
        else if(selectedAwareness === undefined)
            return msg.channel.send("The awareness that you're looking for does not exist. Be sure to check the list by typing the command `~awareness list`");
        
            let attachment = ("0" + awarenessIndex).slice(-2).concat(".png");
        let rarity = "";
        for(x = 0; x <= selectedAwareness.rarity - 1; x++){
            rarity += "★";
        }
        embed = {
            title: `${awarenessName}(${rarity})`,
            color: colors.awareness,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            fields: [
                {
                    name: "2 set effect",
                    value: selectedAwareness.effect_1,
                },
                {
                    name: "4 set effect",
                    value: selectedAwareness.effect_2,
                },
                {
                    name: "HP",
                    value: selectedAwareness.base_HP + `(**${selectedAwareness.max_HP}**)`,
                    inline: true,
                },
                {
                    name: "ATK",
                    value: selectedAwareness.base_ATK + `(**${selectedAwareness.max_ATK}**)`,
                    inline: true,
                },
                {
                    name: "DEF",
                    value: selectedAwareness.base_DEF + `(**${selectedAwareness.max_DEF}**)`,
                    inline: true,
                },
                {
                    name: "CRIT",
                    value: selectedAwareness.base_CRIT + `(**${selectedAwareness.max_CRIT}**)`,
                    inline: true,
                },
            ]
        }
        msg.channel.send({ 
            embed: embed,
            files: [{
                attachment: `./static/images/awareness/${attachment}`,
                name: attachment
            }]
        });
        
        //move to a separate command
        // let selectedLB = client.awareness["breakthrough"][selectedAwareness["rarity"]];
        // console.log("rarity", selectedLB);
        // let breakthrough = Object.keys(selectedLB).map((breakthrough, index) => 
        //     `
        //         ${index + 1}: ${selectedLB[breakthrough].nuts}x ${emoji("black_nuts")} 
        //         ${selectedLB[breakthrough].awareness_low}x ${emoji("awareness_low")}
        //         ${selectedLB[breakthrough].awareness_high}x ${emoji("awareness_high")}
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
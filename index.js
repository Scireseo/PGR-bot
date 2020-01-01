const titleCase = require('./helpers/characterCase.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = "~";
const colors = { spirit: "#b2f5ff", deft: "#fbe6a3", tough: "#ffadbe" }

const fs = require("fs");
client.msgs = require ("./msgs.json");
client.awareness = require ("./awareness.json");

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
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
    if(msg.content.toLowerCase().startsWith(prefix + "awareness")){
        let awarenessName = titleCase(msg.content.slice(11));
        let selectedAwareness = client.awareness[awarenessName];
        console.log("awareness: ", awarenessName, selectedAwareness);
        if(selectedAwareness === undefined) return;
        // let embed = new Discord.RichEmbed()
        //     .setTitle(awarenessName)
        //     .setThumbnail("attachment://hannah.png")
        //     .setColor(colors.deft)
        //     .addField("2 set effect", selectedAwareness.effect_1)
        //     .addField("4 set effect", selectedAwareness.effect_2)
        //     .addField("HP", selectedAwareness.base_HP + `(**${selectedAwareness.max_HP}**)`, true)
        //     .addField("ATK", selectedAwareness.base_ATK + `(**${selectedAwareness.max_ATK}**)`, true)
        //     .addField("DEF", selectedAwareness.base_DEF + `(**${selectedAwareness.max_DEF}**)`, true)
        //     .addField("CRIT", selectedAwareness.base_CRIT + `(**${selectedAwareness.max_CRIT}**)`, true)
        // msg.channel.send({embed, files: [{
        //     attachment: './static/images/awareness/hannah.png',
        //     name: 'hannah.png'
        // }]});
        let embed = {
            title: awarenessName,
            colors: colors.deft,
            thumbnail: {
                url: "attachment://hannah.png",
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
                attachment: './static/images/awareness/hannah.png',
                name: 'hannah.png'
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
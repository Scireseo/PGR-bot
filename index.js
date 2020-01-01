const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const prefix = "t#";
const colors = { spirit: "#b2f5ff", deft: "#fbe6a3", tough: "#ffadbe" }

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
    if(msg.content === prefix + 'guides'){
        let letter = { a: "🇦", b: "🇧", c: "🇨", d: "🇩"};
        let embed = new Discord.RichEmbed()
            .setThumbnail(msg.guild.iconURL)
            .setColor(colors.spirit)
            .addField("Guide Commands Master List", 
                    `Listed here are the commands for managing guides.\nNavigate through these commands by reacting on this post.\n` + 
                    `${letter.a} - Add Guides\n` +
                    `${letter.b} - Show All Guides\n` +
                    `${letter.c} - Remove Guides\n` +
                    `${letter.d} - Manage your Guides`);
        msg.channel.send(embed).then(botMessage => {
            botMessage.react(letter.a)
            .then(() => {
                botMessage.react(letter.b).then(()=>{
                    botMessage.react(letter.c).then(()=>{
                        botMessage.react(letter.d);
                    });
                });
            });
            const filter = (reaction, user) => {
                return Object.values(letter).includes(reaction.emoji.name) && user.id === msg.author.id;
            }
            botMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected=>{
                const reaction = collected.first();
                console.log("[reaction]", reaction.emoji.name === letter.a);
            })
        })
    }
})

client.login(auth.token);
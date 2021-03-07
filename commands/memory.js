exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = args.map(arg => arg.includes("-") ? 
        arg.split("-").map(a=> general_functions.titleCase(a)).join("-") 
        : general_functions.titleCase(arg));
    args = args.join(" ");
    console.log("[args 1]", args);
    // return;
    let embed = {};
    let list_of_memories = Object.values(client.memories);
    if(args === "List"){
        let rarity_index = 0;
        let max_index = client.rarities.memory.length - 1;
        function generateEmbed(){
            let list_of_memories_by_rarity = list_of_memories.filter(memory => memory.rarity === client.rarities.memory[rarity_index]).map((memory, index) => `${index + 1}.) ${memory.name}`).join("\r\n");
            let generated_embed = {
                title: "memory list",
                fields: [{ name: `${client.rarities.memory[rarity_index]}★ memories`, value: list_of_memories_by_rarity }]
            }
            return generated_embed;
        }
        embed = generateEmbed();
        return message.channel.send({ embed: embed }).then((sent_message) => {
            let react_collector = general_functions.initializeReactCollector(client, sent_message);
            react_collector.on('collect', reaction => {
                if(reaction.emoji.name === '◀️'){
                    rarity_index = rarity_index - 1 < 0 ? max_index : --rarity_index;
                    embed = generateEmbed();
                    sent_message.edit({ embed: embed });
                }
                else{
                    rarity_index = rarity_index + 1 > max_index ? 0 : ++rarity_index;
                    embed = generateEmbed();
                    sent_message.edit({ embed: embed });
                }
            });
            react_collector.on('end', () => {
                sent_message.reactions.map(reaction => reaction.remove(sent_message.author.id));
            })
        });
    }
    let rarity = "";
    let selected_memory = list_of_memories.find(memory => memory.name.includes(args));
    let memory_index = list_of_memories.indexOf(selected_memory);
    if(args === "" || selected_memory === undefined) return message.channel.send("The memory that you're looking for does not exist. Be sure to check the list by typing the command `#memory list`!");
    let attachment = ("0" + memory_index).slice(-2).concat(".png");
    for(x = 0; x <= selected_memory.rarity - 1; x++){
        rarity += "★";
    }
    let translatorDetails = {};
    client.fetchUser(selected_memory.translator).then(translator => {
        translatorDetails.avatar = translator.avatarURL;
        translatorDetails.username = translator.username;
        translatorDetails.discriminator = translator.discriminator;
    }).then(() => {
        embed = {
            title: `${selected_memory.name}(${rarity})`,
            color: client.colors.memory,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            author: {
                "name": `Translated by ${translatorDetails.username}#${translatorDetails.discriminator}`,
                "icon_url": `${translatorDetails.avatar}`
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
                    name: "6 set effect",
                    value: selected_memory.effect_3,
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
                {
                    name: "For any further questions, please ask in this server",
                    value: `https://discord.gg/5BXWz3E57S`,
                    inline: false,
                }
            ]
        }

        if (!selected_memory.effect_3) {
            embed.fields = embed.fields.filter(field => field.name !== "6 set effect");
        }

        console.log(embed);

        message.channel.send({ 
            embed: embed,
            files: [{
                attachment: `./static/images/memories/${attachment}`,
                name: attachment
            }]
        })
        .catch(err => {
            message.channel.send({
                embed: embed
            })
        })
    });
}

exports.help = {
    name: 'memories list'
}
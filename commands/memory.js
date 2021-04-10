exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = args.map(arg => arg.includes("-") ? 
        arg.split("-").map(a=> general_functions.titleCase(a)).join("-") 
        : general_functions.titleCase(arg));
    args = args.join(" ");
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
    let selected_memory = list_of_memories.filter(memory => memory.name.includes(args) || (memory.cn_name ? memory.cn_name.includes(args) : false));
    if (selected_memory.length > 1) {
        embed = {
            title: "Multiple memories found",
            fields: [{ 
                name: `Please select one of the following: `, 
                value: selected_memory.map((memory, index) => `${index + 1}.) ${memory.name}`).join("\r\n") 
            }],
        };
        const filter = m => m.author.id === message.author.id;
        message.channel.send({ embed })
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
                    .then(_message => {
                        _message = _message.first();
                        const selected = selected_memory[_message.content - 1];
                        generateMemory(selected);
                    })
            })
    }
    else {
        selected_memory = selected_memory[0];
        generateMemory(selected_memory);
    }

    function generateMemory(selectedMemory) {
        if (args.length === "" || selectedMemory === undefined) return message.channel.send("The memory that you're looking for does not exist. Be sure to check the list by typing the command `~memory list`!");
        const rarity = "★".repeat(selectedMemory.rarity);
        const attachment = ("0" + list_of_memories.indexOf(selectedMemory)).slice(-2).concat(".png");
        embed = {
            title: `${selectedMemory.name}(${rarity})`,
            // color: client.colors.memory,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            fields: [
                {
                    name: "2 set effect",
                    value: selectedMemory.effect_1,
                },
                {
                    name: "4 set effect",
                    value: selectedMemory.effect_2,
                },
                {
                    name: "6 set effect",
                    value: selectedMemory.effect_3,
                },
                {
                    name: "HP",
                    value: selectedMemory.base_HP + `(**${selectedMemory.max_HP}**)`,
                    inline: true,
                },
                {
                    name: "ATK",
                    value: selectedMemory.base_ATK + `(**${selectedMemory.max_ATK}**)`,
                    inline: true,
                },
                {
                    name: "DEF",
                    value: selectedMemory.base_DEF + `(**${selectedMemory.max_DEF}**)`,
                    inline: true,
                },
                {
                    name: "CRIT",
                    value: selectedMemory.base_CRIT + `(**${selectedMemory.max_CRIT}**)`,
                    inline: true,
                },
                {
                    name: "For any further questions, please ask in this server",
                    value: `https://discord.gg/JErpUEk`,
                    inline: false,
                }
            ]
        }
        if (!selectedMemory.effect_3) {
            embed.fields = embed.fields.filter(field => field.name !== "6 set effect");
        }
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
    }
}

exports.help = {
    name: 'memories list'
}
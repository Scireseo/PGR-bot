exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = args.map(arg => arg.includes("-") ? arg.split("-").map(a=> general_functions.titleCase(a)).join("-") : general_functions.titleCase(arg))
    args = args.join(" ");
    // console.log("[args 1]", args);
    let embed = {};
    let list_of_characters = Object.values(client.characters);
    if(args === "List"){
        let rarity_index = 0;
        let max_index = client.rarities.character.length - 1;
        function generateEmbed(){
            let list_of_characters_by_rarity = list_of_characters.filter(character => character.rarity === client.rarities.character[rarity_index]).map((character, index) => `${index + 1}.) ${character.name}(${character.code_name}/${character.code_name_CN})`).join("\r\n");
            let generated_embed = {
                title: "character list",
                fields: [{ name: `Rank ${client.rarities.character[rarity_index]} characters`, value: list_of_characters_by_rarity }]
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
        });;
    }
    let selected_character = list_of_characters.filter(character => 
        character.name.includes(args) || character.code_name.includes(args) || 
        character.name.concat(" ", character.code_name).includes(args));
    if(args === "" || selected_character === undefined) return message.channel.send("The character that you're looking for does not exist. Be sure to check the list by typing the command `~character list`!");
    if(selected_character.length > 1){
        selected_character = selected_character.map((character, index) => `${index + 1}.) ${character.name}(${character.code_name})`).join("\r\n");
        embed = {
            title: "Characters list",
            description: "Found multiple results. Please select one of the following:",
            fields: [{ name: "names", value: selected_character }]
        }
        return message.channel.send({ embed: embed });
    }
    selected_character = selected_character[0];
    let selected_character_active_skills = Object.values(selected_character.skills.active).map(skill => {    
        let multipliers_placeholders = ["X%", "Y%", "Z%"];
        let special_multipliers_placeholders = ["A%", "B%", "C%", "D%", "E%"];
        if(skill.hasOwnProperty("multipliers")){
            Object.values(skill.multipliers).map((multiplier, index) => {
                skill.description = skill.description.replace(multipliers_placeholders[index], `${multiplier}(**${multiplier * 2}**)%`);
            })
        }
        if(skill.hasOwnProperty("special_multipliers")){
            Object.values(skill.special_multipliers).map((multiplier, index) => {
                skill.description = skill.description.replace(special_multipliers_placeholders[index], `${multiplier}(**${multiplier * 2}**)%`);
            })
        }
        return {
            name: skill.name,
            value: skill.description
        };
    });
    let selected_character_passive_skills = Object.values(selected_character.skills.passives).map(skill => {    
        let multipliers_placeholders = ["X%", "Y%", "Z%"];
        let special_multipliers_placeholders = ["A%", "B%", "C%", "D%", "E%"];
        if(skill.hasOwnProperty("multipliers")){
            Object.values(skill.multipliers).map((multiplier, index) => {
                skill.description = skill.description.replace(multipliers_placeholders[index], `${multiplier}(**${multiplier * 2}**)%`);
            })
        }
        if(skill.hasOwnProperty("special_multipliers")){
            Object.values(skill.special_multipliers).map((multiplier, index) => {
                skill.description = skill.description.replace(special_multipliers_placeholders[index], `${multiplier}(**${multiplier * 2}**)%`);
            })
        }
        return {
            name: skill.name,
            value: skill.description
        };
    });
    let selected_character_skills = [...selected_character_active_skills, ...selected_character_passive_skills];
    // console.log("[check]", selected_character_skills);
    let character_index = list_of_characters.indexOf(selected_character);
    let attachment = ("0" + character_index).slice(-2).concat(".png");
    let character_details_current_index = 0;
    let character_details = [
        [
            {
                name: "Rarity",
                value: selected_character.rarity,
                inline: true,
            },
            {
                name: "Class",
                value: selected_character.class,
                inline: true,
            },
            {
                name: "HP",
                value: selected_character.base_HP + `(**${selected_character.max_HP}**)`,
                inline: true,
            },
            {
                name: "ATK",
                value: selected_character.base_ATK + `(**${selected_character.max_ATK}**)`,
                inline:true,
            },
            {
                name: "DEF",
                value: selected_character.base_DEF + `(**${selected_character.max_DEF}**)`,
                inline:true,
            },
            {
                name: "CRIT",
                value: selected_character.base_CRIT + `(**${selected_character.max_CRIT}**)`,
                inline:true,
            }
        ],
        [selected_character_skills[0], selected_character_skills[1]],
        [selected_character_skills[2], selected_character_skills[3]],
        [selected_character_skills[4], selected_character_skills[5]],
        [selected_character_skills[6], selected_character_skills[7]],
        [selected_character_skills[8], selected_character_skills[9]],
        [selected_character_skills[10], selected_character_skills[11]],
    ]
    let character_details_max_index = character_details.length - 1;
    function generateEmbed(){
        let generated_embed = {
            title: `${selected_character.name}(${selected_character.code_name})`,
            color: client.colors.character,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            fields: character_details[character_details_current_index]
        }
        return generated_embed;
    }
    embed = generateEmbed();
    message.channel.send({ 
        embed: embed,
        files: [{
            attachment: `./static/images/characters/${attachment}`,
            name: attachment
        }]
    }).then((sent_message) => {
        let react_collector = general_functions.initializeReactCollector(client, sent_message);
        react_collector.on('collect', reaction => {
            if(reaction.emoji.name === '◀️'){
                character_details_current_index = character_details_current_index - 1 < 0 ? character_details_max_index : --character_details_current_index;
                embed = generateEmbed();
                sent_message.edit({ embed: embed });
            }
            else{
                character_details_current_index = character_details_current_index + 1 > character_details_max_index ? 0 : ++character_details_current_index;
                embed = generateEmbed();
                sent_message.edit({ embed: embed });
            }
        });
        react_collector.on('end', () => {
            sent_message.reactions.map(reaction => reaction.remove(sent_message.author.id));
        })
    })
}

exports.help = {
    name: "Character Details"
}
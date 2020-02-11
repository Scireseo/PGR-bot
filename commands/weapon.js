exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = args.map(arg => arg.includes("-") ? arg.split("-").map(a=> general_functions.titleCase(a)).join("-") : general_functions.titleCase(arg))
    args = args.join(" ");
    let embed = {};
    let list_of_weapons = Object.values(client.weapons);
    if(args === "List"){
        let rarity_index = 0;
        let max_index = client.rarities.weapon.length - 1;
        function generateEmbed(){
            let list_of_weapons_by_rarity = list_of_weapons.filter(weapon => weapon.rarity === client.rarities.weapon[rarity_index]).map((weapon, index) => `${index + 1}.) ${weapon.name}[${weapon.type}]`).join("\r\n");
            let generated_embed = {
                title: "weapon list",
                fields: [{ name: `${client.rarities.weapon[rarity_index]}★ weapons`, value: list_of_weapons_by_rarity }]
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
    let selected_weapon = list_of_weapons.find(weapon => weapon.name.includes(args));
    let weapon_index = list_of_weapons.indexOf(selected_weapon);
    if(args.length === "" || selected_weapon === undefined) return message.channel.send("The weapon that you're looking for does not exist. Be sure to check the list by typing the command `~weapon list`!");
    let attachment = ("0" + weapon_index).slice(-2).concat(".png");
    for(x = 0; x <= selected_weapon.rarity - 1; x++){
        rarity += "★";
    }
    let translatorDetails = {};
    client.fetchUser(selected_weapon.translator).then(translator => {
        translatorDetails.avatar = translator.avatarURL;
        translatorDetails.username = translator.username;
        translatorDetails.discriminator = translator.discriminator;
    }).then(() => {
        embed = {
            title: `${selected_weapon.name}(${rarity})`,
            color: client.colors.weapon,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            footer: {
                "icon_url": translatorDetails.avatar,
                "text": `Translated by ${translatorDetails.username}#${translatorDetails.discriminator}`
            },
            fields: [
                {
                    name: "effect",
                    value: selected_weapon.effect,
                },
                {
                    name: "ATK",
                    value: selected_weapon.base_ATK + `(**${selected_weapon.max_ATK}**)`,
                    inline: true,
                },
                {
                    name: "CRIT",
                    value: selected_weapon.base_CRIT + `(**${selected_weapon.max_CRIT}**)`,
                    inline: true,
                },
            ]
        }
        message.channel.send({ 
            embed: embed,
            files: [{
                attachment: `./static/images/weapons/${attachment}`,
                name: attachment
            }]
        });
    })
}

exports.help = {
    name: 'weapons list'
}
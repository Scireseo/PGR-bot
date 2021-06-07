exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = args.map(arg => arg.includes("-") ? arg.split("-").map(a=> general_functions.titleCase(a)).join("-") : general_functions.titleCase(arg))
    args = args.join(" ");
    let embed = {};
    let list_of_weapons = Object.values(client.weapons);
    if(args === "List"){
        const weaponTypes = getWeaponTypes();
        let weaponIndex = 0;
        let maxWeaponIndex = weaponTypes.length - 1;

        embed = generateEmbedByWeaponTypes();

        function getWeaponTypes() {
            return [...new Set(list_of_weapons.map(weapon => weapon.type))];
        }

        function sortByRarity(list) {
            return list.sort((a,b) => (a.rarity < b.rarity) ? 1 : ((b.rarity < a.rarity) ? -1 : 0))
        }

        function generateEmbedByWeaponTypes() {
            let fields = [];
            const data = sortByRarity(list_of_weapons.filter(weapon => weapon.type === weaponTypes[weaponIndex]));  
            const rarities = [... new Set(data.map(weapon => weapon.rarity))];
            rarities.map(rarity => {
                let field = { name: "★".repeat(rarity), value: "" };
                data.filter(weapon => weapon.rarity === rarity).map((weapon, index) => {
                    field.value += `${index + 1}.) ${weapon.name}\r\n`;
                });
                fields = [...fields, field];
            })
            const generated_embed = {
                title: `${weaponTypes[weaponIndex]} list`,
                fields
            }
            return generated_embed;
        }
        return message.channel.send({ embed: embed }).then((sent_message) => {
            let react_collector = general_functions.initializeReactCollector(client, sent_message);
            react_collector.on('collect', reaction => {
                if(reaction.emoji.name === '◀️'){
                    weaponIndex = weaponIndex - 1 < 0 ? maxWeaponIndex : --weaponIndex;
                    embed = generateEmbedByWeaponTypes();
                    sent_message.edit({ embed: embed });
                }
                else{
                    weaponIndex = weaponIndex + 1 > maxWeaponIndex ? 0 : ++weaponIndex;
                    embed = generateEmbedByWeaponTypes();
                    sent_message.edit({ embed: embed });
                }
            });
            react_collector.on('end', () => {
                sent_message.reactions.removeAll()
            })
        });
    }
    let rarity = "";
    let selected_weapon = list_of_weapons.find(weapon => general_functions.titleCase(weapon.name).includes(args));
    let weapon_index = list_of_weapons.indexOf(selected_weapon);
    if(args.length === "" || selected_weapon === undefined) return message.channel.send("The weapon that you're looking for does not exist. Be sure to check the list by typing the command `~weapon list`!");
    let attachment = ("0" + weapon_index).slice(-2).concat(".png");
    for(x = 0; x <= selected_weapon.rarity - 1; x++){
        rarity += "★";
    }
    // let translatorDetails = {};
    // client.fetchUser(selected_weapon.translator).then(translator => {
    //     translatorDetails.avatar = translator.avatarURL;
    //     translatorDetails.username = translator.username;
    //     translatorDetails.discriminator = translator.discriminator;
    // }).then(() => {
        embed = {
            title: `${selected_weapon.name}(${rarity})`,
            // color: client.colors.weapon,
            thumbnail: {
                url: `attachment://${attachment}`,
            },
            // author: {
            //     "name": `Translated by ${translatorDetails.username}#${translatorDetails.discriminator}`,
            //     "icon_url": translatorDetails.avatar
            // },
            fields: [
                {
                    name: "Effect",
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
                {
                    name: "For any further questions, please ask in this server",
                    value: client.discordLink,
                    inline: false,
                }
            ]
        }
        message.channel.send({ 
            embed: embed,
            files: [{
                attachment: `./static/images/weapons/${attachment}`,
                name: attachment
            }]
        })
        .catch(err => {
            message.channel.send({
                embed: embed
            })
        })
    // })
}

exports.help = {
    name: 'weapons list'
}
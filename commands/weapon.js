
exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = args.map(arg => arg.includes("-") ? arg.split("-").map(a => general_functions.titleCase(a)).join("-") : general_functions.titleCase(arg))
    args = args.join(" ");
    let embed = {};
    let list_of_weapons = Object.values(client.weapons);
    if (args === "List") {
        const weaponTypes = list_of_weapons.reduce((acc, item) => {
            if (!acc.includes(item.type)) {
                acc.push(item.type);
            }
            return acc;
        }, []);
        embed = {
            title: "Types of Weapons",
            fields: [{ name: "Select the weapon type of your choosing", value: weaponTypes.map(weapon => `• ${weapon}`).join("\r\n") }]
        }
        const filter = m => m.author.id === message.author.id;
        return message.channel.send({ embed })
            .then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
                    .then(message => {
                        message = message.first();
                        if (weaponTypes.includes(general_functions.titleCase(message.content))) {
                            const weapons = list_of_weapons.filter(weapon => weapon.type === message.content);
                            embed = {
                                title: `${message.content}`,
                                fields: [{ name: "Select the weapon of your choosing", value: weapons.map(weapon => `• ${weapon.name}`).join("\r\n") }]
                            }
                            message.channel.send({ embed })
                                .then(() => {
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time']
                                    })
                                        .then(_message => {
                                            _message = _message.first();
                                            if (weapons.find(weapon => weapon.name === _message.content)) {
                                                const selectedWeapon = list_of_weapons.filter(weapon => weapon.name === _message.content)[0];
                                                console.log(">>>", selectedWeapon);
                                                generateWeapon(selectedWeapon);
                                            }
                                        })
                                })
                        }
                    })
            });
    }

    function generateWeapon(selectedWeapon) {
        if (args.length === "" || selectedWeapon === undefined) return message.channel.send("The weapon that you're looking for does not exist. Be sure to check the list by typing the command `#weapon list`!");
        const rarity = "★".repeat(selectedWeapon.rarity);
        const attachment = ("0" + list_of_weapons.indexOf(selectedWeapon)).slice(-2).concat(".png");
        client.fetchUser(selectedWeapon.translator).then(translator => {
            return {
                avatar: translator.avatarURL,
                username: translator.username,
                discriminator: translator.discriminator
            }
        }).then(translatorDetails => {
            embed = {
                title: `${selectedWeapon.name}(${rarity})`,
                color: client.colors.weapon,
                thumbnail: {
                    url: `attachment://${attachment}`,
                },
                author: {
                    "name": `Translated by ${translatorDetails.username}#${translatorDetails.discriminator}`,
                    "icon_url": translatorDetails.avatar
                },
                fields: [
                    {
                        name: "Effect",
                        value: selectedWeapon.effect,
                    },
                    {
                        name: "ATK",
                        value: selectedWeapon.base_ATK + `(**${selectedWeapon.max_ATK}**)`,
                        inline: true,
                    },
                    {
                        name: "CRIT",
                        value: selectedWeapon.base_CRIT + `(**${selectedWeapon.max_CRIT}**)`,
                        inline: true,
                    },
                    {
                        name: "For any further questions, please ask in this server",
                        value: `https://discord.gg/5BXWz3E57S`,
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
        })
    }

    const weapon = list_of_weapons.find(weapon => weapon.name.toLowerCase().includes(args.toLowerCase()));
    generateWeapon(weapon);
}

exports.help = {
    name: 'weapons list'
}
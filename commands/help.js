exports.run = (client, message, args) => {
    let embed = {
        title: "Here are the commands that you can use, Commander!",
        fields: [
            {
                name: "Memories",
                value: `
                    **~memory list** | Shows a list of available memories
                    **~memory <name of memory>** | Displays information about the Memory  
                `
            },
            {
                name: "Weapons",
                value: `
                    **~weapon list** | Shows a list of available weapons
                    **~weapon <name of weapon>** | Displays information about the Weapon
                `
            },
            {
                name: "Missions",
                value: `
                    **~mission list** | Shows a list of available missions
                    **~mission <name of mission>** | Displays information about the Mission
                `
            },
        ]
    }
    message.author.send({ embed: embed });
    message.channel.send(`Message sent, Commander! Now please stop bullying me! ${emoji("2_")}`);
}

exports.help = {
    name: "Help"
}
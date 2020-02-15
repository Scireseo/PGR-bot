exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    let embed = {
        title: "Here are the commands that you can use, Commander!",
        fields: [
            {
                name: "General",
                value: `
                    **~memory list** | Shows a list of available memories
                    **~memory <name of memory>** | Displays information about the Memory  
                    **~weapon list** | Shows a list of available weapons
                    **~weapon <name of weapon>** | Displays information about the Weapon
                    **~character list** | Shows a list of available characters
                    **~character <name of character>** | Displays information about the Character
                    **~mission list** | Shows a list of available missions
                    **~mission <name of mission>** | Displays information about the Mission
                    **~register** | Displays instructions on how to create a QQ account in PGR
                `
            },
            {
                name: "Miscellaneous",
                value: `
                    **~info** | Some info about me!
                `
            },
        ]
    }
    message.author.send({ embed: embed });
    message.channel.send(`Message sent, Commander! Now please stop bullying me! ${general_functions.emoji(client, "2_")}`);
}

exports.help = {
    name: "Help"
}
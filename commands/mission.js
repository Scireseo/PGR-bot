exports.run = (client, message, args) => {
    const general_functions = require('../helpers/general');
    args = general_functions.titleCase(args.join(" "));
    let embed = {};
    let list_of_missions = Object.keys(client.missions);
    if(args === "List"){
        list_of_missions = list_of_missions.map((mission, index) => `${index + 1}.) ${mission}`).join("\r\n");
        embed = {
            title: "Missions list",
            fields: [{ name: "names", value: list_of_missions }]
        }
        return message.channel.send({ embed: embed });
    }
    let selected_mission = list_of_missions.find(mission => mission.includes(args.toLowerCase()));
    if(args === "" || selected_mission === undefined) return message.channel.send("The mission that you're looking for does not exist. Be sure to check the list by typing the command `#mission list`");
    selected_mission = client.missions[selected_mission];
    embed = {
        title: `${args} missions`,
        fields: Object.keys(selected_mission).map(mission => {
            return {
                name: args.toLowerCase() === "rookie" ? `Day ${parseInt(mission) + 1}` : mission,
                value: Object.values(selected_mission[mission]).map(details => `• ${details}`).join("\r\n")
            }
        })
    }; 
    message.channel.send({ embed: embed });
}

exports.help = {
    name: 'missions list'
}
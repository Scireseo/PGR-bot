exports.run = (client, message, args) => {
    let embed = {
        title: message.guild.name,
        description: "Server Information",
        thumbnail: {
            url: message.guild.iconURL,
        },
        color: 1438035,
        fields: [
            {
                name: "Member Count",
                value: message.guild.members.filter(member => !member.user.bot).size
            },
            {
                name: "Bot Count",
                value: message.guild.members.filter(member => member.user.bot).size
            }
        ]
    }
    message.channel.send({ embed: embed });
}

exports.help = {
    name: "Server Details"
}
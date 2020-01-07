exports.run = (client, message, args) => {
    let embed = {
        title: message.member.user.tag,
        description: `${message.member.user.username}'s Avatar`,
        image: {
            url: message.member.user.avatarURL,
        }
    }
    message.channel.send({ embed: embed });
}

exports.help = {
    name: "Profile Details"
}
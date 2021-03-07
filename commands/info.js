exports.run = (client, message, args) => {
    let msg = 
    `Hi! I'm **${client.user.tag}**, created by **Kuu + Snows**!\nMy aim is to provide users info about the game **Punishing Gray Raven**!
    \n**Info**
    -**Original Author**: Kuu#6969
    -**Updated by Snows🌌❄#8077**
    -**Translators**: Pinky#7220, The LoIi Hunter#6112, and ViceHampton#2514
    `;
    message.channel.send(msg);
}

exports.help = {
    name: "Info"
}
exports.run = (client, message, args) => {
    let msg = 
    `Hi! I'm **${client.user.tag}**, created by **Kuu**!\nMy aim is to provide users info about the game **Punishing Gray Raven**!
    \n**Info**
    -**Author**: Kuu#6969
    -**Translators**: Pinky#7220, The LoIi Hunter#6112, and ViceHampton#2514
    -**Proofreader**: Rexlent#2020
    If you have any further questions, feel free ask us in this server: https://discord.gg/JErpUEk
    `;
    message.channel.send(msg);
}

exports.help = {
    name: "Info"
}
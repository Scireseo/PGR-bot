exports.run = (client, message, args) => {
    let msg = 
    `Hi! I'm **${client.user.tag}**, created by **Kuu**!\nMy aim is to provide users info about the game **Punishing Gray Raven**!
    \n**Info**
    -**Author**: Kuu#6969
    -**Translators**: Rexlent#2020
    `;
    message.channel.send(msg);
}

exports.help = {
    name: "Info"
}
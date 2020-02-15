exports.run = (client, message, args) => {
    console.log("check", client.misc.miscellaneous.register.data.length);
    message.channel.send(client.misc.miscellaneous.register.data );
}

exports.help = {
    name: 'How to Register'
}
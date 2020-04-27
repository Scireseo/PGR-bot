function capitalizeFirstLetter(string) {
    if(string === "") return;
    if(string === "II") return string;
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function titleCase(string) {
    return string.split(" ").map(x => capitalizeFirstLetter(x)).join(" ");
}

function emoji(client, name) {
    return client.emojis.find(emoji => emoji.name === name).toString();
}

function initializeReactCollector(client, msg) {
    const filter = (reaction, user) => {
        return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id !== msg.author.id;
    };
    msg.react('◀️').then(() => {
        msg.react('▶️')
    });
    return msg.createReactionCollector(filter, { time: client.global_timeout });
}

module.exports.capitalizeFirstLetter = capitalizeFirstLetter;
module.exports.titleCase = titleCase;
module.exports.emoji = emoji;
module.exports.initializeReactCollector = initializeReactCollector;
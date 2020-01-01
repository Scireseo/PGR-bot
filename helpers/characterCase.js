function capitalizeFirstLetter(string) {
    console.log("string>>>>", string)
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

var titleCase = function(string) {
    return string.split(" ").map(x => capitalizeFirstLetter(x)).join(" ");
}

module.exports = titleCase;
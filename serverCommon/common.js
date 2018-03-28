// utility to print out diagnostics
const logError = e => {
    console.log("error object:");
    console.log(e);
    console.log();

    console.log("error object toString():");
    console.log("\t" + e.toString());

    console.log();
    console.log("error object attributes: ");
    console.log('\tname: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text);

    console.log();
    console.log("error object stack: ");
    console.log(e.stack);
};

module.exports = {
    logError
}

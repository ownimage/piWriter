// utility to print out diagnostics
export function logError(debug, e) {
    debug("error object:");
    debug(e);
    debug();

    debug("error object toString():");
    debug("\t%s", e);

    debug();
    debug("error object attributes: ");
    debug("\tname: %s message: %s at: %s text: %s", e.name , e.message, e.at, e.text);

    debug();
    debug("error object stack: ");
    debug(e.stack);
}

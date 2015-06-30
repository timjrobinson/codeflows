
/**
 * start
 * starts a flow from a location. text is the text immediately proceeding the row / column
 */
function start(file, row, column, text) {
    
}

/**
 * endFlow
 * ends a flow. Does nothing if flow creation is not in process
 */
function end(file, row, column, text) {
    
}

/**
 * followFlow
 * IDE specific function to jump between the start/end points of a flow. 
 */
function follow() {
    
}

/**
 * onSave
 * reads in the file contents and checks all flows are in the correct places
 * If a flow is not found where it should be it uses a best guess algorithm to
 * determine where it has gone and reset it to the new location. 
 */
function onSave(file, contents) {
    
}

module.exports = {
    start: start,
    end: end,
    follow: follow,
    onSave: onSave
};
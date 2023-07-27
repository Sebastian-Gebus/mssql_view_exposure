var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

var isValidDate = function (dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}

var isViewExists = (viewName) => {
    var availableViews = config.allViews;
    var result = "";

    availableViews.forEach(element => {
        if (element == viewName) {
            result = element;
        }
    })
    return result;
}

var isFilterViewExists = (viewName) => {
    var availableViews = config.filterViews;
    var result = "";

    availableViews.forEach(element => {
        if (element == viewName) {
            result = element;
        }
    })
    return result;
}

module.exports = { isValidDate, isViewExists, isFilterViewExists }
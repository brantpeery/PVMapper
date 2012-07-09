/// <reference path="../jquery-1.6.2.js" />

var consoleDiv = $("<div id='log'></div>").appendTo('body');

var debug = {
    write: function (message) {
        consoleDiv.append('<p>' + message + '</p>');
        this.show();
    },
    flash: function () {
        consoleDiv.show('normal', 'pulsate');
    },
    show: function () {
        consoleDiv.show();
    },
    hide: function () {
        consoleDiv.hide();
    }
}
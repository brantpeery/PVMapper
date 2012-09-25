﻿//Event manager
//Parameter: <boolean> allowDuplicateHandler 
//          true will allow the registration of the same function multiple times as a callback
//          false will only allow a function to be registered once as a callback. It will ignore any other attempts to register the same function.

//Use the managager by creating a new event in code. 
//  ex. this.myEvent = new Event();
//Then attach the handlers to the event using the addHandler method


function Event(allowDuplicateHandler) {
    this.eventHandlers = new Array();
    this.allowDuplicateHandler = false || allowDuplicateHandler;
}

Event.prototype.addHandler = function (callBack) {
    if (this.eventHandlers.indexOf(callBack) == -1 || this.allowDuplicateHandler) {
        this.eventHandlers.push(callBack);
    }
}
Event.prototype.removeHandler = function (handler) {
    var idx;
    while (this.eventHandlers) {
        idx = this.eventHandlers.indexOf(handler)
        if (idx == -1) { break; }
        this.eventHandlers.splice(idx, 1);
    }
}
Event.prototype.fire = function (context, eventArgs) {
    var self = this;
    if (!(eventArgs instanceof Array)) {
        eventArgs = [eventArgs];
    }
    $.each(self.eventHandlers, function (idx, func) {
        if (typeof(func)!='undefined')
            func.apply(context, eventArgs);
    });
}
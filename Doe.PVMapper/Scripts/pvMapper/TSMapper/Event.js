Event.prototype.addHandler = ///
function (callBack) {
    if(this.eventHandlers.indexOf(callBack) == -1 || this.allowDuplicateHandler) {
        this.eventHandlers.push(callBack);
    }
};
Event.prototype.removeHandler = function (handler) {
    var idx;
    while(this.eventHandlers) {
        idx = this.eventHandlers.indexOf(handler);
        if(idx == -1) {
            break;
        }
        this.eventHandlers.splice(idx, 1);
    }
};
Event.prototype.fire = function (context, eventArgs) {
    var self = this;
    if(!(eventArgs instanceof Array)) {
        eventArgs = [
            eventArgs
        ];
    }
    $.each(self.eventHandlers, function (idx, func) {
        if(typeof (func) != 'undefined') {
            func.apply(context, eventArgs);
        }
    });
};
/*
NOTE: re-implement lib.d.ts.Event instead of create our own Event class.  Code below to be removed.
*/
var pvMapper;
(function (pvMapper) {
    /*
    Is a publish point. Uses the handlers and fire method to publish events
    */
    var Event_1 = (function () {
        /// Creates the publish point.
        /// allowDuplicateHandler if set to true will allow the same function to subscribe more than once.
        function Event_1(allowDuplicateHandler) {
            if (typeof allowDuplicateHandler === "undefined") { allowDuplicateHandler = false; }
            this.allowDuplicateHandler = allowDuplicateHandler;
            //for event parameter data tag
            this.data = null;
            this.eventHandlers = new Array();
        }
        Event_1.prototype.addHandler = ///
        function (callBack) {
            if(this.eventHandlers.indexOf(callBack) == -1 || this.allowDuplicateHandler) {
                this.eventHandlers.push(callBack);
            }
        };
        Event_1.prototype.removeHandler = function (handler) {
            var idx;
            while(this.eventHandlers) {
                idx = this.eventHandlers.indexOf(handler);
                if(idx == -1) {
                    break;
                }
                this.eventHandlers.splice(idx, 1);
            }
        };
        Event_1.prototype.fire = function (context, eventArgs) {
            var self = this;
            if(!(eventArgs instanceof Array)) {
                eventArgs = [
                    eventArgs
                ];
            }
            $.each(self.eventHandlers, function (idx, func) {
                if(typeof (func) != 'undefined') {
                    func.apply(context, eventArgs);
                }
            });
        };
        return Event_1;
    })();
    pvMapper.Event_1 = Event_1;    
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=Event.js.map

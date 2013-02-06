/// <reference path="../../jquery.d.ts" />
var pvMapper;
(function (pvMapper) {
    /*
    Is a publish point. Uses the handlers and fire method to publish events
    */
    var Event = (function () {
        /// Creates the publish point.
        /// allowDuplicateHandler if set to true will allow the same function to subscribe more than once.
        function Event(allowDuplicateHandler) {
            if (typeof allowDuplicateHandler === "undefined") { allowDuplicateHandler = false; }
            this.allowDuplicateHandler = allowDuplicateHandler;
            //for event parameter data tag
            this.data = null;
            this.eventHandlers = new Array();
        }
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
        return Event;
    })();
    pvMapper.Event = Event;    
})(pvMapper || (pvMapper = {}));

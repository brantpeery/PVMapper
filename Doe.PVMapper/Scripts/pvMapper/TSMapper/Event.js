/// <reference path="common.ts" />
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
            var _this = this;
            this.allowDuplicateHandler = allowDuplicateHandler;
            this.addHandler = function (callBack) {
                if (_this.allowDuplicateHandler || _this.eventHandlers.indexOf(callBack) === -1) {
                    _this.eventHandlers.push(callBack);
                }
            };
            this.removeHandler = function (handler) {
                var idx = _this.eventHandlers.indexOf(handler);
                while (idx >= 0) {
                    _this.eventHandlers.splice(idx, 1);
                    idx = _this.eventHandlers.indexOf(handler);
                }
            };
            //for event parameter data tag
            this.data = null;
            if (console && console.assert)
                console.assert(!allowDuplicateHandler, "Allowing duplicate event handlers? Why would this ever be a good idea?");
            this.eventHandlers = new Array();
        }
        Event.prototype.fire = function (context, eventArgs) {
            var self = this;
            if (typeof eventArgs !== 'undefined' && !(eventArgs instanceof Array)) {
                eventArgs = [eventArgs];
            }
            self.eventHandlers.map(function (func, idx) {
                if (typeof (func) != 'undefined') {
                    try  {
                        func.apply(context, eventArgs);
                    } catch (e) {
                        if (console && console.error && console.debug) {
                            console.error("Error caught while in an event: " + e.message + " : file: " + e.fileName + " line: " + e.lineNumber);
                            console.debug(context);
                            console.debug(e);
                        }
                    }
                }
            });
        };
        return Event;
    })();
    pvMapper.Event = Event;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Event.js.map

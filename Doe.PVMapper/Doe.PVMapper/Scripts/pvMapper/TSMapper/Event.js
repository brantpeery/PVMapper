var pvMapper;
(function (pvMapper) {
    var Event = (function () {
        function Event(allowDuplicateHandler) {
            if (typeof allowDuplicateHandler === "undefined") { allowDuplicateHandler = false; }
            this.allowDuplicateHandler = allowDuplicateHandler;
            this.data = null;
            this.eventHandlers = new Array();
        }
        Event.prototype.addHandler = function (callBack) {
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
            self.eventHandlers.map(function (func, idx) {
                if(typeof (func) != 'undefined') {
                    try  {
                        func.apply(context, eventArgs);
                    } catch (e) {
                        if(console) {
                            console.log("Error caught while in an event: " + e.message + " : file: " + e.fileName + " line: " + e.lineNumber);
                            console.log(context);
                            console.error(e);
                        }
                    }
                }
            });
        };
        return Event;
    })();
    pvMapper.Event = Event;    
})(pvMapper || (pvMapper = {}));
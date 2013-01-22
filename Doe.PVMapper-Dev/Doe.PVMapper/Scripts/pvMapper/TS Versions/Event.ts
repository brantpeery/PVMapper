/// <reference path="../../jquery.d.ts" />
/// <reference path="../../_references.js" />
/// <reference path="_frameworkobjects.d.ts" />


module pvMapper {
    /*
    Is a publish point. Uses the handlers and fire method to publish events
   */
    export class Event {
        public eventHandlers: { (any): any; }[];
        /// Creates the publish point. 
        /// allowDuplicateHandler if set to true will allow the same function to subscribe more than once.
        constructor (public allowDuplicateHandler?: bool = false) {
            this.eventHandlers = new Array();
        }
        ///
        addHandler(callBack) {
            if (this.eventHandlers.indexOf(callBack) == -1 || this.allowDuplicateHandler) {
                this.eventHandlers.push(callBack);
            }
        }

        removeHandler(handler) {
            var idx;
            while (this.eventHandlers) {
                idx = this.eventHandlers.indexOf(handler)
                if (idx == -1) { break; }
                this.eventHandlers.splice(idx, 1);
            }
        }

        fire(context, eventArgs?:any) {
            var self = this;
            if (!(eventArgs instanceof Array)) {
                eventArgs = [eventArgs];
            }
            $.each(self.eventHandlers, function (idx, func) {
                if (typeof (func) != 'undefined')
                    func.apply(context, eventArgs);
            });
        }
    }
}
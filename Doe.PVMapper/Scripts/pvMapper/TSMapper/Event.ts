/// <reference path="common.ts" />
/// <reference path="../../jquery.d.ts" />


/**
 An alias to browser's Event object.  Use this class for passing event object into event function.  The pvMapper.Event class is for creating
event delegate pair.
*/
interface EventArg {
  parent: EventArg;
  data: any;
  timeStamp: number;
  target: pvMapper.Event;
  type: string;
  cancelable: boolean;
}

declare var EventArg: {                                                             
  new (data?: any, parent?: any ): EventArg;
  prototype: EventArg;
}


module pvMapper {
  /*
  Is a publish point. Uses the handlers and fire method to publish events
 */
  export class Event {
    public eventHandlers: EventCallback[];
    /// Creates the publish point. 
    /// allowDuplicateHandler if set to true will allow the same function to subscribe more than once.
    constructor(public allowDuplicateHandler: boolean = false) {
      this.eventHandlers = new Array();
    }
    ///
    public addHandler(callBack : EventCallback) {
        if (this.allowDuplicateHandler || this.eventHandlers.indexOf(callBack) === -1) {
            this.eventHandlers.push(callBack);
        }
    }

    public removeHandler(handler:EventCallback) {
      var idx: number;
      while (this.eventHandlers) {
        idx = this.eventHandlers.indexOf(handler)
        if (idx == -1) { break; }
        this.eventHandlers.splice(idx, 1);
      }
    }

    public fire(context, eventArgs: any) {
      var self = this;
      if (typeof eventArgs !== 'undefined' && !(eventArgs instanceof Array)) {
        eventArgs = [eventArgs];
      }
      self.eventHandlers.map(function (func, idx) {
          if (typeof (func) != 'undefined') {
              //try {
                  func.apply(context, eventArgs);
              //} catch (e) {
              //    if (console) {
              //        console.log("Error caught while in an event: " + e.message + " : file: " + e.fileName + " line: " + e.lineNumber);
              //        console.log(context);
              //        console.error(e);
              //    }
              //}
          }
      });
    }
    //for event parameter data tag 
    public data: any = null;
  }

}
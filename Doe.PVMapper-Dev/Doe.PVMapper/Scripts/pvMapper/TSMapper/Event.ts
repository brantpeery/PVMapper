/// <reference path="Options.d.ts" />
/// <reference path="../../jquery.d.ts" />

/*
Is a publish point. Uses the handlers and fire method to publish events
*/
interface Event {
  removeHandler(handler: any);
  addHandler(handler: ICallBack);
  fire(context: any, eventArgs: any);
}

Event.prototype.addHandler = ///
function (callBack:ICallBack) {
  if (this.eventHandlers.indexOf(callBack) == -1 || this.allowDuplicateHandler) {
    this.eventHandlers.push(callBack);
  }
};
Event.prototype.removeHandler = function (handler:ICallBack) {
  var idx;
  while (this.eventHandlers) {
    idx = this.eventHandlers.indexOf(handler);
    if (idx == -1) {
      break;
    }
    this.eventHandlers.splice(idx, 1);
  }
};

Event.prototype.fire = function (context: any, eventArgs: any) {
  var self = this;
  if (!(eventArgs instanceof Array)) {
    eventArgs = [
        eventArgs
    ];
  }
  $.each(self.eventHandlers, function (idx, func) {
    if (typeof (func) != 'undefined') {
      func.apply(context, eventArgs);
    }
  });
};


/*
NOTE: re-implement lib.d.ts.Event instead of create our own Event class.  Code below to be removed.
*/
module pvMapper {
  /*
  Is a publish point. Uses the handlers and fire method to publish events
 */
  export class Event_1 {
    public eventHandlers: { (any): any; }[];
    /// Creates the publish point. 
    /// allowDuplicateHandler if set to true will allow the same function to subscribe more than once.
    constructor (public allowDuplicateHandler?: bool = false) {
      this.eventHandlers = new Array();
    }
    ///
    public addHandler(callBack) {
      if (this.eventHandlers.indexOf(callBack) == -1 || this.allowDuplicateHandler) {
        this.eventHandlers.push(callBack);
      }
    }

    public removeHandler(handler) {
      var idx: number;
      while (this.eventHandlers) {
        idx = this.eventHandlers.indexOf(handler)
        if (idx == -1) { break; }
        this.eventHandlers.splice(idx, 1);
      }
    }

    public fire(context, eventArgs: any) {
      var self = this;
      if (!(eventArgs instanceof Array)) {
        eventArgs = [eventArgs];
      }
      $.each(self.eventHandlers, function (idx, func) {
        if (typeof (func) != 'undefined')
          func.apply(context, eventArgs);
      });
    }
    //for event parameter data tag 
    public data: any = null;
  }


}
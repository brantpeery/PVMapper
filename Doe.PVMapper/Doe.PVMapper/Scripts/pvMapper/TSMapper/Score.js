/// <reference path="common.ts" />
/// <reference path="Site.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    /**
    * A PVMapper.Score object. Tracks the score for a site. Ties a site to a scoring line and represents a line's value cell for a site.
    *
    * @variable {string} value The value that was calculated for the site. Uses the site geometry and the tool to figure the value. Updated by the tool
    * @variable {string} popupMessage The message to display when the mouse hovers  over the scoring cell on the interface
    */
    var Score = (function () {
        /**
        * Creates a Score object. Ties the site's change event to this scores score changed event
        *
        * @constructor
        * @param {PVMapper.Site}  site The site that this score will track
        * @return {PVMapper.Score} New Score object
        */
        function Score(site) {
            var _this = this;
            // fancy events for tracking changes
            this.valueChangeEvent = new pvMapper.Event();
            this.invalidateEvent = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();
            this.self = this;
            this.value = Number.NaN;
            //A reference to the site this score represents
            this.site = site;
            //The long message formated in HTML that explains the value or score
            this.popupMessage = null;
            //Grab onto the change event for the site
            this.site.changeEvent.addHandler(function (e) {
                e.data = _this;
                /*debug*/ console.log('The score ' + _this.site.name + ' has detected a site change pvMapper.Event.fire its own event now.');
                _this.siteChangeEvent.fire(_this, [
                    e, 
                    _this
                ]);
            });
        }
        Score.prototype.updateUtility = //Calculates the utility score for the value passed in or if no value is passed in it uses the current value property
        function () {
            //TODO: ... duh, calculate the utility here?
            //if (typeof (value) !== 'undefined') { return this.updateValue(value); }
            // clearly wrong
            this.utility = this.value;
            //TODO: fire some kind of utilityChangedEvent, or somehting?
                    };
        Score.prototype.updateValue = /**
        * Updates the value and fires the value cahnged event. The ScoreLine this Score object belongs to subscribes to this event.
        * This event fires so that things like the score board can update themselves when scores change.
        *
        * @param {number} the new value
        * @return {number} the new value
        */
        function (value) {
            //Change the context, add this score to the event and pass the event on
            var oldvalue = this.value;
            this.value = value;
            //TODO: pvMapper.displayMessage(this.value,"Info");
            //fire the value updated event
            this.valueChangeEvent.fire(this.self, {
                oldvalue: oldvalue,
                newvalue: value
            });
            return this.value;
        };
        Score.prototype.toString = //public setError(description: string) {
        //    this.popupMessage = description;
        //    this.value = Number.NaN;
        //    this.utility = Number.NaN;
        //}
        function () {
            if(this.popupMessage && this.popupMessage.trim().length > 0) {
                return this.popupMessage;
            } else if(typeof this.value !== "undefined" && !isNaN(this.value)) {
                return this.value.toString();
            } else {
                return "No value";
            }
        };
        return Score;
    })();
    pvMapper.Score = Score;    
})(pvMapper || (pvMapper = {}));

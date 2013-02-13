/// <reference path="common.ts" />
/// <reference path="Site.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    /***
    * A PVMapper.Score object. Tracks the score for a site. Ties a site to a scoring line and represents a line's value cell for a site.
    *
    * @variable {string} myvalue The value that was calculated for the site. Uses the site geometry and the tool to figure the value. Updated by the tool
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
            this.valueChangeEvent = new pvMapper.Event();
            this.invalidateEvent = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();
            if(!site instanceof (pvMapper.Site)) {
                throw ("Parameter 'site' is not a pvMapper.Site object");
            }
            this.self = this;
            this.myvalue = "";
            //A reference to the site this score represents
            this.site = site;
            //The long message formated in HTML that explains the value or score
            this.popupMessage = null;
            //Grab onto the change event for the site
            this.site.changeEvent.addHandler(this.onSiteChanged);
        }
        Score.prototype.calculateUtility = //Calculates the utility score for the value passed in or if no value is passed in it uses the current value property
        function (value) {
            if(typeof (value) != 'undefined') {
                return this.updateValue(value);
            }
            return this.myvalue;
        };
        Score.prototype.updateValue = function (value) {
            //Change the context, add this score to the event and pass the event on
            var oldvalue = this.myvalue;
            this.myvalue = value;
            pvMapper.displayMessage(this.myvalue, "Info");
            //fire the value updated event
            this.valueChangeEvent.fire(this.self, {
                oldvalue: oldvalue,
                newvalue: value
            });
            return this.myvalue;
        };
        Score.prototype.onSiteChanged = function (event) {
            event.data = this.self;
            /*debug*/ console.log('The score ' + this.self.name + ' has detected a site change pvMapper.Event.fire its own event now.');
            this.siteChangeEvent.fire(this.self, [
                event, 
                this.self
            ]);
        };
        Score.prototype.toString = function () {
            if(this.popupMessage && this.popupMessage.trim().length > 0) {
                return this.popupMessage;
            } else {
                return this.value;
            }
        };
        return Score;
    })();
    pvMapper.Score = Score;    
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=Score.js.map

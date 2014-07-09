/// <reference path="common.ts" />
/// <reference path="Site.ts" />
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
        function Score(site, scoreLine) {
            var _this = this;
            this.deactivate = function () {
                try  {
                    _this.site.changeEvent.removeHandler(_this.siteChangeHandler);
                } catch (e) {
                    if (console && console.warn)
                        console.warn("Failed to remove site change handler while destroying score object: " + e.toString());
                }

                //this.site = null;
                //this.scoreLine = null;
                _this.valueChangeEvent = null;
                _this.siteChangeEvent = null;
                //this.siteChangeHandler = null;
            };
            this.isValueOld = false;
            /**
            * Updates the value and fires the value cahnged event. The ScoreLine this Score object belongs to subscribes to this event.
            * This event fires so that things like the score board can update themselves when scores change.
            *
            * @param {number} the new value
            * @return {number} the new value
            */
            this.updateValue = function (value) {
                if (console && console.warn && !_this.isValueOld)
                    console.warn("Warning: Received an unexpected score update (the score tool ID='" + _this.scoreLine.id + "' may be running slow)");
                _this.isValueOld = false; // a reasonable assumption

                //Change the context, add this score to the event and pass the event on
                var oldvalue = _this.value;
                _this.value = value;

                //fire the value updated event
                if (_this.valueChangeEvent) {
                    _this.valueChangeEvent.fire(_this, { score: _this, oldValue: oldvalue, newValue: value });
                } else {
                    if (console && console.warn)
                        console.warn("Warning: attempted to update a deactivated score (tool='" + (_this.scoreLine && _this.scoreLine.id) + "', site='" + (_this.site && _this.site.id) + "')");
                }

                return _this.value;
            };
            //public setError(description: string) {
            //    this.popupMessage = description;
            //    this.value = Number.NaN;
            //    this.utility = Number.NaN;
            //}
            this.toString = function () {
                if (_this.popupMessage) {
                    return _this.popupMessage;
                } else if (typeof _this.value !== "undefined" && _this.value !== null && !isNaN(_this.value)) {
                    return _this.value.toString();
                } else {
                    return "No value";
                }
            };
            this.toJSON = function () {
                return {
                    popupMessage: _this.popupMessage,
                    value: _this.value,
                    utility: _this.utility,
                    site: { id: _this.site.id },
                    scoreLine: { id: _this.scoreLine.id }
                };
            };
            this.fromJSON = function (o) {
                if (console && console.assert)
                    console.assert(_this.site && o.site && _this.site.id === o.site.id, "Warning: site ID did not match when loading score from JSON");
                if (console && console.assert)
                    console.assert(_this.scoreLine && o.scoreLine && _this.scoreLine.id === o.scoreLine.id, "Warning: scoreLine ID did not match when loading score from JSON");

                _this.popupMessage = o.popupMessage;
                _this.value = o.value;
                _this.utility = o.utility;
                //The site should have been created.
                //this.site.fromJSON(o.site);
            };
            this.value = Number.NaN;
            this.utility = Number.NaN;

            //A reference to the site this score represents
            this.site = site;
            this.scoreLine = scoreLine;

            //The long message formated in HTML that explains the value or score
            this.popupMessage = null;

            this.valueChangeEvent = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();

            //Grab onto the change event for the site
            this.siteChangeHandler = function (e) {
                e.data = _this;

                //if (console) console.log('A score for site ' + this.site.name + ' has detected a site change pvMapper.Event.fire its own event now.');
                _this.siteChangeEvent.fire(_this, [e, _this]);
            };

            this.site.changeEvent.addHandler(this.siteChangeHandler);
        }
        return Score;
    })();
    pvMapper.Score = Score;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Score.js.map

var pvMapper;
(function (pvMapper) {
    var Score = (function () {
        function Score(site) {
            var _this = this;
            this.valueChangeEvent = new pvMapper.Event();
            //public invalidateEvent: pvMapper.Event = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();
            this.self = this;
            this.value = Number.NaN;
            this.utility = Number.NaN;
            this.site = site;
            this.popupMessage = null;
            this.site.changeEvent.addHandler(function (e) {
                e.data = _this;
                console.log('The score ' + _this.site.name + ' has detected a site change pvMapper.Event.fire its own event now.');
                _this.siteChangeEvent.fire(_this, [
                    e, 
                    _this
                ]);
            });
        }
        Score.prototype.setUtility = //Sets the utility value for the score. Fires the utilityChanged event
        function (value) {
            this.utility = value;
            //TODO: fire some kind of utilityChangedEvent, or somehting?
                    };
        Score.prototype.updateValue = function (value) {
            var oldvalue = this.value;
            this.value = value;
            //TODO: pvMapper.displayMessage(this.value,"Info");
            //fire the value updated event
            this.valueChangeEvent.fire(this.self, {
                score: this.self,
                oldValue: oldvalue,
                newValue: value
            });
            return this.value;
        };
        Score.prototype.toString = function () {
            if(this.popupMessage && this.popupMessage.trim().length > 0) {
                return this.popupMessage;
            } else {
                if(typeof this.value !== "undefined" && !isNaN(this.value)) {
                return this.value.toString();
            } else {
                return "No value";
            }
            }
        };
        return Score;
    })();
    pvMapper.Score = Score;    
})(pvMapper || (pvMapper = {}));

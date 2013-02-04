var pvMapper;
(function (pvMapper) {
    var Score = (function () {
        function Score(site) {
            this.valueChangeEvent = new pvMapper.Event();
            this.invalidateEvent = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();
            if(!site instanceof (pvMapper.Site)) {
                throw ("Parameter 'site' is not a pvMapper.Site object");
            }
            this.self = this;
            this.myvalue = "";
            this.site = site;
            this.popupMessage = null;
            this.site.changeEvent.addHandler(this.onSiteChanged);
        }
        Score.prototype.calculateUtility = function (value) {
            if(typeof (value) != 'undefined') {
                return this.updateValue(value);
            }
            return this.myvalue;
        };
        Score.prototype.updateValue = function (value) {
            var oldvalue = this.myvalue;
            this.myvalue = value;
            pvMapper.displayMessage(this.myvalue, "Info");
            this.valueChangeEvent.fire(this.self, {
                oldvalue: oldvalue,
                newvalue: value
            });
            return this.myvalue;
        };
        Score.prototype.onSiteChanged = function (event) {
            event.data = this.self;
            console.log('The score ' + this.self.name + ' has detected a site change pvMapper.Event.fire its own event now.');
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

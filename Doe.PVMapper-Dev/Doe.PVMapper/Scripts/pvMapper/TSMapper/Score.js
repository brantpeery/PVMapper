var pvMapper;
(function (pvMapper) {
    var Score = (function () {
        function Score(site) {
            var _this = this;
            this.valueChangeEvent = new pvMapper.Event();
            this.invalidateEvent = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();
            this.self = this;
            this.value = "";
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
        Score.prototype.calculateUtility = function (value) {
            if(typeof (value) != 'undefined') {
                return this.updateValue(value);
            }
            return this.value;
        };
        Score.prototype.updateValue = function (value) {
            var oldvalue = this.value;
            this.value = value;
            this.valueChangeEvent.fire(this.self, {
                oldvalue: oldvalue,
                newvalue: value
            });
            return this.value;
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

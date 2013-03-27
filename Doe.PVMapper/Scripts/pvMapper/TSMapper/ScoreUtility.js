var pvMapper;
(function (pvMapper) {
    var ScoreUtility = (function () {
        function ScoreUtility(options) {
            //An options object might be better here. Then a call to a static function with options would be possible
            this.run = function (x) {
                //Run the function that the user needs run
                var y = this.UtilityFunctions[this.functionName].apply(this, x);
                //TODO: Error check y
                return y;
            };
            this.UtilityFunctions = {
                moreIsBetter: function (x) {
                    return 1 - this.utilityFunction2(x);
                },
                lessIsBetter: function (x) {
                    var l = this.minValue;
                    var b = this.target;
                    var h = this.maxValue;
                    var sRatio = (this.slope / 5) + 0.3;
                    var y = 0;//The return variable
                    
                    var s = Math.min(-2 / (b - l), -2 / (h - b));
                    s = s * (sRatio);
                    if(x >= h) {
                        y = 0;
                    } else if(x <= l) {
                        y = 1;
                    } else {
                        y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) : 1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
                    }
                    if(y >= 1) {
                        y = 1;
                    }
                    if(y <= 0) {
                        y = 0;
                    }
                    return y;
                }
            };
            this.minValue = options.minValue;
            this.target = options.target;
            this.maxValue = options.maxValue;
            this.slope = options.slope;
            this.functionName = options.functionName;
        }
        ScoreUtility.prototype.serialize = function () {
            throw "Serialize not implemented yet for this object";
        };
        ScoreUtility.prototype.deserialize = function () {
            throw "Deserialize is not implemented yet for this object";
        };
        return ScoreUtility;
    })();
    pvMapper.ScoreUtility = ScoreUtility;    
})(pvMapper || (pvMapper = {}));

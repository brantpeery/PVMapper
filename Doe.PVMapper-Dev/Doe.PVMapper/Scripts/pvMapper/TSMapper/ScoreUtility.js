var PVMapper;
(function (PVMapper) {
    var ScoreUtility = (function () {
        function ScoreUtility(minValue, target, maxValue, slope, functionName) {
            this.minValue = minValue;
            this.target = target;
            this.maxValue = maxValue;
            this.slope = slope;
            this.functionName = functionName;
            this.run = function (x) {
                //Run the function that the user needs run
                var y = this.UtilityFunctions['func'].apply(this, x);
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
        }
        return ScoreUtility;
    })();    
})(PVMapper || (PVMapper = {}));

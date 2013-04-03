var pvMapper;
(function (pvMapper) {
    var UtilityFunctions = (function () {
        function UtilityFunctions() { }
        UtilityFunctions.sinusoidal = function sinusoidal(x, args) {
            var l = args.minValue;
            var h = args.maxValue;
            var b = isNaN(args.target) ? ((h - l) / 2) + l : args.target;
            var s = isNaN(args.slope) ? 1 : args.slope;
            if(l > h) {
                var swap = l;
                l = h;
                h = swap;
                s = -s;
            }
            s = s * Math.max(2 / (b - l), 2 / (h - b));
            var y = 0;
            if(x >= h) {
                y = 0;
            } else {
                if(x <= l) {
                    y = 1;
                } else {
                    y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) : 1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
                }
            }
            return y;
        }
        UtilityFunctions.linear = function linear(x, args) {
            return ((x - args.minValue) / (args.maxValue - args.minValue));
        }
        UtilityFunctions.linear3pt = function linear3pt(x, args) {
            if(x < args.p0.x) {
                return args.p0.y;
            } else {
                if(x < args.p1.x) {
                    return args.p0.y + ((args.p1.y - args.p0.y) * (x - args.p0.x) / (args.p1.x - args.p0.x));
                } else {
                    if(x < args.p2.x) {
                        return args.p1.y + ((args.p2.y - args.p1.y) * (x - args.p1.x) / (args.p2.x - args.p1.x));
                    } else {
                        return args.p2.y;
                    }
                }
            }
        }
        UtilityFunctions.random = function random() {
            return Math.random();
        }
        return UtilityFunctions;
    })();
    pvMapper.UtilityFunctions = UtilityFunctions;    
    var ScoreUtility = (function () {
        function ScoreUtility(options) {
            this.run = function (x) {
                if(isNaN(x)) {
                    return Number.NaN;
                }
                var y = pvMapper.UtilityFunctions[this.scoreUtilityOptions.functionName](x, this.scoreUtilityOptions);
                return Math.max(0, Math.min(1, y)) * 100;
            };
            this.scoreUtilityOptions = options;
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

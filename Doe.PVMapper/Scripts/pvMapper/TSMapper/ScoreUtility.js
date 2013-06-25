var pvMapper;
(function (pvMapper) {
    var MinMaxUtilityArgs = (function () {
        function MinMaxUtilityArgs(mmObj) {
            if(mmObj == undefined) {
                this.minValue = 0;
                this.maxValue = 0;
            } else {
                this.minValue = mmObj.minValue;
                this.maxValue = mmObj.maxValue;
            }
            this.tips = {
                minValue: "The minimum value.",
                maxValue: "The maximum value."
            };
        }
        return MinMaxUtilityArgs;
    })();
    pvMapper.MinMaxUtilityArgs = MinMaxUtilityArgs;    
    var SinusoidalUtilityArgs = (function () {
        function SinusoidalUtilityArgs() {
            this.target = 0;
            this.slope = 0;
            this.tips = {
                target: "The target value.",
                slope: "The slope value.",
                minValue: "The minimum value.",
                maxValue: "The maximum value."
            };
        }
        return SinusoidalUtilityArgs;
    })();
    pvMapper.SinusoidalUtilityArgs = SinusoidalUtilityArgs;    
    var ThreePointUtilityArgs = (function () {
        function ThreePointUtilityArgs() { }
        return ThreePointUtilityArgs;
    })();
    pvMapper.ThreePointUtilityArgs = ThreePointUtilityArgs;    
    var ScoreUtility = (function () {
        function ScoreUtility(options) {
            if(options['functionCallback']) {
                var copt = options;
                pvMapper.UtilityFunctions[copt.functionName] = {
                    fn: copt.functionCallback,
                    windowSetup: copt.windowSetupCallback,
                    windowOk: copt.windowOkCallback,
                    iconURL: copt.iconURL
                };
            }
            this.functionName = options.functionName;
            this.functionArgs = options.functionArgs;
            this.iconURL = options.iconURL;
        }
        ScoreUtility.prototype.run = function (x) {
            if(isNaN(x)) {
                return Number.NaN;
            }
            var y = pvMapper.UtilityFunctions[this.functionName].fn(x, this.functionArgs);
            return Math.max(0, Math.min(1, y)) * 100;
        };
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

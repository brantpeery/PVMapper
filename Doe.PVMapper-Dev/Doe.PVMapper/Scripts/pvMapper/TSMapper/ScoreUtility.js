var pvMapper;
(function (pvMapper) {
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

var pvMapper;
(function (pvMapper) {
    //export interface IMinMaxUtilityArgs extends IScoreUtilityArgs {
    //    minValue: number;
    //    maxValue: number;
    //}
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
        // IMinMaxUtilityArgs {
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
            //Check for custom utility by checking to see if there is a function callback (not optimal but in the absence of interface comparison will do)
            if(options['functionCallback']) {
                //Load up the ScoreUtility with the custom function + window callbacks
                var copt = options;//This is a dumb way of making the IDE stop complaining that the type is not right
                
                //Create a new utility function named after the custom functionName
                pvMapper.UtilityFunctions[copt.functionName] = {
                    fn: copt.functionCallback,
                    windowSetup: //Attach handlers for setting up and tearing down the utility function setup window
                    copt.windowSetupCallback,
                    windowOk: copt.windowOkCallback,
                    iconURL: copt.iconURL
                };
            }
            //Attach the named function and window
            this.functionName = options.functionName;
            this.functionArgs = options.functionArgs;
            this.iconURL = options.iconURL;
        }
        ScoreUtility.prototype.run = //An options object might be better here. Then a call to a static function with options would be possible
        function (x) {
            if(isNaN(x)) {
                return Number.NaN;
            }
            //Run the function that the user needs run
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
//@ sourceMappingURL=ScoreUtility.js.map

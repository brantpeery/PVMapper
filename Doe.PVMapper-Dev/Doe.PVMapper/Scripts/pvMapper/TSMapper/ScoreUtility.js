/// <reference path="UtilityFunctions.ts" />
/// <reference path="ScoreUtilityWindows.ts" />
var pvMapper;
(function (pvMapper) {
    var MinMaxUtilityArgs = (function () {
        function MinMaxUtilityArgs(minValue, maxValue, unit, minTip, maxTip) {
            if (typeof minValue === "undefined") { minValue = 0; }
            if (typeof maxValue === "undefined") { maxValue = 100; }
            if (typeof unit === "undefined") { unit = ""; }
            if (typeof minTip === "undefined") { minTip = "The minimum value."; }
            if (typeof maxTip === "undefined") { maxTip = "The maximum value."; }
            this.minValue = minValue;
            this.maxValue = maxValue;
            //            this.tips = { minValue: minTip, maxValue: maxTip };
            this.metaInfo = { name: "MinMaxUtilityArgs", unitSymbol: unit, minValueTip: minTip, maxValueTip: maxTip, vline: 0 };
        }
        return MinMaxUtilityArgs;
    })();
    pvMapper.MinMaxUtilityArgs = MinMaxUtilityArgs;

    var SinusoidalUtilityArgs = (function () {
        function SinusoidalUtilityArgs(minValue, maxValue, target, slope, unit, minTip, maxTip, targetTip, slopeTip) {
            if (typeof minValue === "undefined") { minValue = 0; }
            if (typeof maxValue === "undefined") { maxValue = 100; }
            if (typeof target === "undefined") { target = 0; }
            if (typeof slope === "undefined") { slope = 10; }
            if (typeof unit === "undefined") { unit = ""; }
            if (typeof minTip === "undefined") { minTip = "The minimum value."; }
            if (typeof maxTip === "undefined") { maxTip = "The maximum value."; }
            if (typeof targetTip === "undefined") { targetTip = "The target value."; }
            if (typeof slopeTip === "undefined") { slopeTip = "The slope value."; }
            this.minValue = minValue;
            this.maxValue = maxValue;
            this.target = target;
            this.slope = slope;
            //this.tips = {
            //    target: targetTip,
            //    slope: slopeTip,
            //    minValue: minTip,
            //    maxValue: maxTip
            //};
            this.metaInfo = {
                name: "SinusoidalUtilityArgs",
                unitSymbol: unit,
                targetTip: targetTip,
                slopeTip: slopeTip,
                minValueTip: minTip,
                maxValueTip: maxTip,
                vline: 0
            };
        }
        return SinusoidalUtilityArgs;
    })();
    pvMapper.SinusoidalUtilityArgs = SinusoidalUtilityArgs;

    var ThreePointUtilityArgs = (function () {
        function ThreePointUtilityArgs(p0x, p0y, p1x, p1y, p2x, p2y, unit) {
            if (typeof p0x === "undefined") { p0x = 0; }
            if (typeof p0y === "undefined") { p0y = 0.5; }
            if (typeof p1x === "undefined") { p1x = 180; }
            if (typeof p1y === "undefined") { p1y = 1; }
            if (typeof p2x === "undefined") { p2x = 360; }
            if (typeof p2y === "undefined") { p2y = 0.5; }
            if (typeof unit === "undefined") { unit = ""; }
            this.points = ["p0", "p1", "p2"];
            this.p0 = { x: p0x, y: p0y };
            this.p1 = { x: p1x, y: p1y };
            this.p2 = { x: p2x, y: p2y };
            this.metaInfo = { name: "ThreePointUtilityArgs", unitSymbol: unit, vline: 0 };
        }
        return ThreePointUtilityArgs;
    })();
    pvMapper.ThreePointUtilityArgs = ThreePointUtilityArgs;

    var ScoreUtility = (function () {
        function ScoreUtility(options) {
            this.fCache = {};
            if (options['functionCallback']) {
                //Load up the ScoreUtility with the custom function + window callbacks
                var copt = options;

                //Create a new utility function named after the custom functionName
                pvMapper.UtilityFunctions[copt.functionName] = {
                    fn: copt.functionCallback,
                    //Attach handlers for setting up and tearing down the utility function setup window
                    windowSetup: copt.windowSetupCallback,
                    windowOk: copt.windowOkCallback,
                    iconURL: copt.iconURL
                };
            }

            //Attach the named function and window
            this.functionName = options.functionName;
            this.functionArgs = options.functionArgs;
            this.iconURL = options.iconURL;
        }
        //An options object might be better here. Then a call to a static function with options would be possible
        ScoreUtility.prototype.run = function (x) {
            if (isNaN(x))
                return Number.NaN;

            //Run the function that the user needs run
            var y = pvMapper.UtilityFunctions[this.functionName].fn(x, this.functionArgs);
            return Math.max(0, Math.min(1, y)) * 100;
        };

        ScoreUtility.prototype.toJSON = function () {
            var o = {
                functionName: this.functionName,
                functionArgs: this.functionArgs,
                iconURL: this.iconURL,
                fCache: this.fCache
            };
            return o;
        };

        ScoreUtility.prototype.fromJSON = function (o) {
            this.functionName = o.functionName;

            this.functionArgs = o.functionArgs;
            this.iconURL = o.iconURL;
            this.fCache = o.fCache;
        };
        return ScoreUtility;
    })();
    pvMapper.ScoreUtility = ScoreUtility;
})(pvMapper || (pvMapper = {}));

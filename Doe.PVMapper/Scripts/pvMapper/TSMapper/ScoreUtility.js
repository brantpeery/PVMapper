/// <reference path="UtilityFunctions.ts" />
/// <reference path="ScoreUtilityWindows.ts" />
var pvMapper;
(function (pvMapper) {
    

    

    

    var MinMaxUtilityArgs = (function () {
        function MinMaxUtilityArgs(minValue, maxValue, unit, xLabel, memo, minTip, maxTip) {
            if (typeof minValue === "undefined") { minValue = 0; }
            if (typeof maxValue === "undefined") { maxValue = 0; }
            if (typeof unit === "undefined") { unit = ""; }
            if (typeof xLabel === "undefined") { xLabel = "value"; }
            if (typeof memo === "undefined") { memo = ""; }
            if (typeof minTip === "undefined") { minTip = null; }
            if (typeof maxTip === "undefined") { maxTip = null; }
            this.minValue = minValue;
            this.maxValue = maxValue;
            //            this.tips = { minValue: minTip, maxValue: maxTip };
            this.metaInfo = {
                name: "MinMaxUtilityArgs",
                unitSymbol: unit,
                vline: 0,
                x_axis: xLabel,
                y_axis: "Score",
                comment: memo,
                minValueTip: minTip || ("The minimum " + xLabel),
                maxValueTip: maxTip || ("The maximum " + xLabel)
            };
        }
        MinMaxUtilityArgs.prototype.toExcelString = function () {
            var str = "";

            //str += "name: " + this.metaInfo.name;
            str += ", min: " + this.minValue.toFixed(0);
            str += ", max: " + this.maxValue.toFixed(0);
            str += ", x-axis: " + this.metaInfo.x_axis;
            str += ", y-axis: " + this.metaInfo.y_axis;
            str += ", comment: " + this.metaInfo.comment;
            return str;
        };
        return MinMaxUtilityArgs;
    })();
    pvMapper.MinMaxUtilityArgs = MinMaxUtilityArgs;

    var SinusoidalUtilityArgs = (function () {
        function SinusoidalUtilityArgs(minValue, maxValue, target, slope, unit, xLabel, yLabel, memo, minTip, maxTip, targetTip, slopeTip) {
            if (typeof minValue === "undefined") { minValue = 0; }
            if (typeof maxValue === "undefined") { maxValue = 100; }
            if (typeof target === "undefined") { target = 0; }
            if (typeof slope === "undefined") { slope = 10; }
            if (typeof unit === "undefined") { unit = ""; }
            if (typeof xLabel === "undefined") { xLabel = "X-axis"; }
            if (typeof yLabel === "undefined") { yLabel = "Y-axis"; }
            if (typeof memo === "undefined") { memo = ""; }
            if (typeof minTip === "undefined") { minTip = "The minimum value."; }
            if (typeof maxTip === "undefined") { maxTip = "The maximum value."; }
            if (typeof targetTip === "undefined") { targetTip = "The target value."; }
            if (typeof slopeTip === "undefined") { slopeTip = "The slope value."; }
            this.minValue = minValue;
            this.maxValue = maxValue;
            this.target = target;
            this.slope = slope;
            this.metaInfo = {
                name: "SinusoidalUtilityArgs",
                unitSymbol: unit,
                targetTip: targetTip,
                slopeTip: slopeTip,
                minValueTip: minTip,
                maxValueTip: maxTip,
                vline: 0,
                comment: memo,
                x_axis: xLabel,
                y_axis: yLabel
            };
        }
        SinusoidalUtilityArgs.prototype.toExcelString = function () {
            var str = "";

            //str += "name: " + this.metaInfo.name;
            str += "min: " + this.minValue.toFixed(0);
            str += ", max: " + this.maxValue.toFixed(0);
            str += ", slope: " + this.slope.toFixed(0);
            str += ", target: " + this.target.toFixed(0);
            str += ", x-axis: " + this.metaInfo.x_axis;
            str += ", y-axis: " + this.metaInfo.y_axis;
            str += ", comment: " + this.metaInfo.comment;
            return str;
        };
        return SinusoidalUtilityArgs;
    })();
    pvMapper.SinusoidalUtilityArgs = SinusoidalUtilityArgs;

    var ThreePointUtilityArgs = (function () {
        function ThreePointUtilityArgs(p0x, p0y, p1x, p1y, p2x, p2y, unit, xLabel, memo) {
            if (typeof p0x === "undefined") { p0x = 0; }
            if (typeof p0y === "undefined") { p0y = 0; }
            if (typeof p1x === "undefined") { p1x = 0; }
            if (typeof p1y === "undefined") { p1y = 0; }
            if (typeof p2x === "undefined") { p2x = 0; }
            if (typeof p2y === "undefined") { p2y = 0; }
            if (typeof unit === "undefined") { unit = ""; }
            if (typeof xLabel === "undefined") { xLabel = "value"; }
            if (typeof memo === "undefined") { memo = ""; }
            this.points = ["p0", "p1", "p2"];
            this.p0 = { x: p0x, y: p0y };
            this.p1 = { x: p1x, y: p1y };
            this.p2 = { x: p2x, y: p2y };
            this.metaInfo = {
                name: "ThreePointUtilityArgs",
                unitSymbol: unit,
                vline: 0,
                comment: memo,
                x_axis: xLabel || unit,
                y_axis: "Score"
            };
        }
        ThreePointUtilityArgs.prototype.toExcelString = function () {
            var str = "";
            ;

            //str += "name: " + this.metaInfo.name;
            str += "points: [";
            str += "(" + this.p0.x.toFixed(0) + "," + this.p0.y.toFixed(0) + "),";
            str += "(" + this.p1.x.toFixed(0) + "," + this.p1.y.toFixed(0) + "),";
            str += "(" + this.p2.x.toFixed(0) + "," + this.p2.y.toFixed(0) + ")]";
            str += ", x-axis: " + this.metaInfo.x_axis;
            str += ", y-axis: " + this.metaInfo.y_axis;
            str += ", comment: " + this.metaInfo.comment;
            return str;
        };
        return ThreePointUtilityArgs;
    })();
    pvMapper.ThreePointUtilityArgs = ThreePointUtilityArgs;

    var ScoreUtility = (function () {
        function ScoreUtility(options) {
            var _this = this;
            this.fCache = {};
            this.toJSON = function () {
                var o = {
                    functionName: _this.functionName,
                    functionArgs: JSON.parse(JSON.stringify(_this.functionArgs))
                };
                return o;
            };
            //Attach the named function and window
            this.functionName = options.functionName;
            this.functionArgs = this.createArg(options.functionName);
            $.extend(this.functionArgs, options.functionArgs);
            this.iconURL = options.iconURL;
        }
        //An options object might be better here. Then a call to a static function with options would be possible
        ScoreUtility.prototype.run = function (x) {
            if (typeof x !== "number" || isNaN(x))
                return Number.NaN;

            //Run the function that the user needs run
            var y = pvMapper.UtilityFunctions[this.functionName].fn(x, this.functionArgs);
            return Math.max(0, Math.min(1, y)) * 100;
        };

        ScoreUtility.prototype.createArg = function (fn) {
            switch (fn) {
                case "linear":
                    return new MinMaxUtilityArgs();
                case "sinusoidal":
                    return new SinusoidalUtilityArgs();
                case "linear3pt":
                    return new ThreePointUtilityArgs();
            }
        };

        ScoreUtility.prototype.fromJSON = function (o) {
            this.functionName = o.functionName;

            this.functionArgs = this.createArg(o.functionName);
            $.extend(this.functionArgs, o.functionArgs);
            //this.iconURL = o.iconURL;
            //this.fCache = o.fCache;
        };

        ScoreUtility.prototype.toExcelString = function () {
            var str = "";
            str += this.functionName;
            str += "(" + this.functionArgs.toExcelString() + ")";
            return str;
        };
        return ScoreUtility;
    })();
    pvMapper.ScoreUtility = ScoreUtility;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=ScoreUtility.js.map

/// <reference path="ScoreUtility.ts" />
/// <reference path="ScoreUtilityWindows.ts" />
var pvMapper;
(function (pvMapper) {
    //Static accessed class that holds all the utility functions for the application
    var UtilityFunctions = (function () {
        function UtilityFunctions() {
        }
        UtilityFunctions.sinusoidal = {
            windowSetup: pvMapper.ScoreUtilityWindows.basicWindow.setup,
            windowOk: pvMapper.ScoreUtilityWindows.basicWindow.okhandler,
            xBounds: function (args) {
                return [Math.min(args.minValue, args.maxValue), Math.max(args.minValue, args.maxValue)];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/stats_icon.jpg",
            fn: function (x, args) {
                var l = args.minValue;
                var h = args.maxValue;
                var b = isNaN(args.target) ? ((h - l) / 2) + l : args.target;
                var s = isNaN(args.slope) ? 1 : args.slope;

                if (l > h) {
                    // we're going from high to low, rather than from low to high
                    // swap values and negate the slope
                    var swap = l;
                    l = h;
                    h = swap;
                    s = -s;
                }

                s = s * Math.max(2 / (b - l), 2 / (h - b));

                var y = 0;
                if (x >= h)
                    y = 1;
                else if (x <= l)
                    y = 0;
                else
                    y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) : 1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));

                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                //if (y >= 1) y = 1;
                //if (y <= 0) y = 0;
                return y;
            }
        };

        UtilityFunctions.linear = {
            windowSetup: pvMapper.ScoreUtilityWindows.basicWindow.setup,
            windowOk: pvMapper.ScoreUtilityWindows.basicWindow.okhandler,
            xBounds: function (args) {
                return [Math.min(args.minValue, args.maxValue), Math.max(args.minValue, args.maxValue)];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/stats_icon.jpg",
            fn: function (x, args) {
                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                if (args != null)
                    return ((x - args.minValue) / (args.maxValue - args.minValue));
                else
                    return 0;
            }
        };

        UtilityFunctions.linear3pt = {
            windowSetup: pvMapper.ScoreUtilityWindows.basicWindow.setup,
            windowOk: pvMapper.ScoreUtilityWindows.basicWindow.okhandler,
            xBounds: function (args) {
                return [
                    Math.min(args.p0.x, Math.min(args.p1.x, args.p2.x)),
                    Math.max(args.p0.x, Math.max(args.p1.x, args.p2.x))];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/stats_icon.jpg",
            fn: function (x, args) {
                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                //if (args == null) return 0;
                var sortedPts = [args.p0, args.p1, args.p2].sort(function (a, b) {
                    return a.x - b.x;
                });

                if (x < sortedPts[0].x)
                    return sortedPts[0].y;
                else if (x < sortedPts[1].x)
                    return sortedPts[0].y + ((sortedPts[1].y - sortedPts[0].y) * (x - sortedPts[0].x) / (sortedPts[1].x - sortedPts[0].x));
                else if (x < sortedPts[2].x)
                    return sortedPts[1].y + ((sortedPts[2].y - sortedPts[1].y) * (x - sortedPts[1].x) / (sortedPts[2].x - sortedPts[1].x));
                else
                    return sortedPts[2].y;
            }
        };

        UtilityFunctions.random = {
            windowSetup: pvMapper.ScoreUtilityWindows.basicWindow.setup,
            windowOk: pvMapper.ScoreUtilityWindows.basicWindow.okhandler,
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/help_icon.jpg",
            fn: function () {
                return Math.random();
            }
        };
        return UtilityFunctions;
    })();
    pvMapper.UtilityFunctions = UtilityFunctions;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=UtilityFunctions.js.map

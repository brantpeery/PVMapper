/// <reference path="ScoreUtility.ts" />
/// <reference path="ScoreUtilityWindows.ts" />
var pvMapper;
(function (pvMapper) {
    //Static accessed class that holds all the utility functions for the application
    var UtilityFunctions = (function () {
        function UtilityFunctions() { }
        UtilityFunctions.sinusoidal = {
            windowSetup: pvMapper.ScoreUtilityWindows.basicWindow.setup,
            windowOk: pvMapper.ScoreUtilityWindows.basicWindow.okhandler,
            xBounds: function (args) {
                return [
                    Math.min(args.minValue, args.maxValue), 
                    Math.max(args.minValue, args.maxValue)
                ];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/wizard_icon.jpg",
            fn: function (x, args) {
                var l = args.minValue;
                var h = args.maxValue;
                var b = isNaN(args.target) ? ((h - l) / 2) + l : args.target;
                var s = isNaN(args.slope) ? 1 : args.slope;
                if(l > h) {
                    // we're going from high to low, rather than from low to high
                    // swap values and negate the slope
                    var swap = l;
                    l = h;
                    h = swap;
                    s = -s;
                }
                s = s * Math.max(2 / (b - l), 2 / (h - b));
                var y = 0;//The return variable
                
                if(x >= h) {
                    y = 0;
                } else if(x <= l) {
                    y = 1;
                } else {
                    y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) : 1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
                }
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
                return [
                    Math.min(args.minValue, args.maxValue), 
                    Math.max(args.minValue, args.maxValue)
                ];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/stats_icon.jpg",
            fn: function (x, args) {
                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                if(args != null) {
                    return ((x - args.minValue) / (args.maxValue - args.minValue));
                } else {
                    return 0;
                }
            }
        };
        UtilityFunctions.linear3pt = {
            windowSetup: pvMapper.ScoreUtilityWindows.basicWindow.setup,
            windowOk: pvMapper.ScoreUtilityWindows.basicWindow.okhandler,
            xBounds: function (args) {
                return [
                    Math.min(args.p0.x, Math.min(args.p1.x, args.p2.x)), 
                    Math.max(args.p0.x, Math.max(args.p1.x, args.p2.x))
                ];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/document_icon.jpg",
            fn: function (x, args) {
                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                //TODO: this breaks if you reorder the points - fix that.
                //if (args == null) return 0;
                if(x < args.p0.x) {
                    return args.p0.y;
                } else if(x < args.p1.x) {
                    return args.p0.y + ((args.p1.y - args.p0.y) * (x - args.p0.x) / (args.p1.x - args.p0.x));
                } else if(x < args.p2.x) {
                    return args.p1.y + ((args.p2.y - args.p1.y) * (x - args.p1.x) / (args.p2.x - args.p1.x));
                } else {
                    return args.p2.y;
                }
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

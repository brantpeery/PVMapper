var DataRecord = (function () {
    function DataRecord() {
    }
    return DataRecord;
})();

var UtilConfig = (function () {
    function UtilConfig() {
        this.data = new DataRecord();
    }
    return UtilConfig;
})();

var currentConfig = null;

var UtilityFunctions = (function () {
    function UtilityFunctions() {
        this.currentConfig = null;
    }
    UtilityFunctions.setConfig = function (obj) {
        this.currentConfig = obj;
    };

    UtilityFunctions.MoreIsBetter = function (x) {
        return 1 - this.LessIsBetter(x);
    };

    UtilityFunctions.LessIsBetter = function (x) {
        if (!currentConfig) {
            if (console)
                console.log('No configuration setup.');
            return 0;
        }

        var l = this.currentConfig.data.minValue;
        var b = this.currentConfig.data.target;
        var h = this.currentConfig.data.maxValue;
        var sRatio = this.currentConfig.data.slope / 5 + .3;
        var y = 0;

        var s = Math.min(-2 / (b - l), -2 / (h - b));
        s = s * (sRatio);

        if (x >= h)
            y = 0;
else if (x <= l)
            y = 1;
else
            y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) : 1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
        if (y >= 1)
            y = 1;
        if (y <= 0)
            y = 0;
        return y;
    };

    UtilityFunctions.NDBalance = function (x, r) {
        if (!currentConfig) {
            if (console)
                console.log('No configuration setup.');
            return 0;
        }

        var u = this.currentConfig.data.target;
        var r = this.currentConfig.data.slope / 5 + .3;
        var y = 1 / (r * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * Math.pow((x - u) / r, 2));
        return y;
    };

    UtilityFunctions.prototype.NDLeft = function (x) {
        var y = 0;

        return y;
    };

    UtilityFunctions.prototype.NDRight = function (x) {
        var y = 0;

        return y;
    };

    UtilityFunctions.prototype.LinearUp = function (x) {
        var y = 0;

        return y;
    };

    UtilityFunctions.prototype.LinearDown = function (x) {
        var y = 0;

        return y;
    };
    return UtilityFunctions;
})();

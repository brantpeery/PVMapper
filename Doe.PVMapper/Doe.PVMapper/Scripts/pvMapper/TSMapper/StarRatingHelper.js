// Module
var pvMapper;
(function (pvMapper) {
    

    // Class
    var StarRatingHelper = (function () {
        // Constructor
        function StarRatingHelper(options) {
            var _this = this;
            this.options = options;

            this.resetStarRatings = function (starRatings) {
                _this.starRatings = starRatings || {};
                if (_this.options.noCategoryLabel && typeof (_this.options.noCategoryRating) === "number" && typeof (_this.starRatings[_this.options.noCategoryLabel]) !== "number") {
                    // the no category label value is missing - set it.
                    _this.starRatings[_this.options.noCategoryLabel] = options.noCategoryRating;
                }
            };

            this.resetStarRatings(); // initial star ratings setup

            this.sortRatings = function (a, b) {
                // sort from lowest to highest star rating first
                var difference = _this.starRatings[a] - _this.starRatings[b];
                if (difference !== 0)
                    return difference;

                // after that, sort alphabitically
                return a.localeCompare(b);
            };

            // sorts the passed array by descending star rating, and returns
            // a single string representing the sorted array (including star ratings)
            this.sortRatableArray = function (ratables) {
                // if we were passed an empty array...
                if (typeof ratables === "undefined" || ratables.length <= 0) {
                    //// return the rating for the no category label (if there is one)
                    //if (this.options.noCategoryLabel) {
                    //    //this.starRatings[this.options.noCategoryLabel]
                    //    return this.options.noCategoryLabel;
                    //}
                    //// otherwise, return the default star rating
                    ////this.options.defaultStarRating;
                    return "";
                }

                ratables.forEach(function (ratable) {
                    if (typeof _this.starRatings[ratable] === "undefined") {
                        _this.starRatings[ratable] = _this.options.defaultStarRating;
                    }
                });

                ratables.sort(_this.sortRatings);

                var allText = ratables[0] + " [" + _this.starRatings[ratables[0]] + ((_this.starRatings[ratables[0]] === 1) ? " star]" : " stars]");

                for (var i = 1; i < ratables.length; i++) {
                    allText += ", " + ratables[i] + " [" + _this.starRatings[ratables[i]] + ((_this.starRatings[ratables[i]] === 1) ? " star]" : " stars]");
                }

                return allText;
            };
        }
        return StarRatingHelper;
    })();
    pvMapper.StarRatingHelper = StarRatingHelper;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=StarRatingHelper.js.map

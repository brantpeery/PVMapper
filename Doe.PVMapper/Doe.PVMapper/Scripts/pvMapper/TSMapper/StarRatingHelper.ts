// Module
module pvMapper {

    // Interfaces
    export interface IStarRatings {
        [name: string]: number;
    }

    export interface ISiteRating {
        resultString: string;
        lowestRating: {
            name: string;
            rating: number;
        };
    }

    export interface IStarRatingOptions {
        defaultStarRating: number;// = 2;
        noCategoryRating?: number;// = 4;
        noCategoryLabel?: string;// = "None";
    }

    export interface IStarRatingHelper {
        options: IStarRatingOptions;

        // dictionary mapping ratable category names to star ratings
        starRatings: IStarRatings;
        resetStarRatings(starRatings?: IStarRatings);
        // returns the lowest rated category of those passed in,
        // and also a combined string of all categories with their star values, sorted from lowest to highest
        sortRatableArray: (ratables: string[]) => string;
    }

    // Class
    export class StarRatingHelper implements IStarRatingHelper {
        // Constructor
        constructor(options: IStarRatingOptions) {
            this.options = options;

            this.resetStarRatings = (starRatings?: IStarRatings) => {
                this.starRatings = starRatings || {};
                if (this.options.noCategoryLabel &&
                    typeof (this.options.noCategoryRating) === "number" &&
                    typeof (this.starRatings[this.options.noCategoryLabel]) !== "number") {
                    // the no category label value is missing - set it.
                    this.starRatings[this.options.noCategoryLabel] = options.noCategoryRating;
                }
            }

            this.resetStarRatings(); // initial star ratings setup

            this.sortRatings = (a: string, b: string) => {
                // sort from lowest to highest star rating first
                var difference = this.starRatings[a] - this.starRatings[b];
                if (difference !== 0)
                    return difference;

                // after that, sort alphabitically
                return a.localeCompare(b);
            }

            // sorts the passed array by descending star rating, and returns
            // a single string representing the sorted array (including star ratings)
            this.sortRatableArray = (ratables: string[]) => {
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
                
                ratables.forEach((ratable: string) => {
                    if (typeof this.starRatings[ratable] === "undefined") {
                        this.starRatings[ratable] = this.options.defaultStarRating;
                    }
                });

                ratables.sort(this.sortRatings);

                var allText: string = ratables[0] + " [" + this.starRatings[ratables[0]] +
                    ((this.starRatings[ratables[0]] === 1) ? " star]" : " stars]");

                for (var i = 1; i < ratables.length; i++) {
                    allText += ", " + ratables[i] + " [" + this.starRatings[ratables[i]] +
                    ((this.starRatings[ratables[i]] === 1) ? " star]" : " stars]");
                }

                return allText;
            }
        }

        public options: IStarRatingOptions;

        public starRatings: IStarRatings;

        public resetStarRatings: (starRatings?: IStarRatings) => void;

        private sortRatings: (a: string, b: string) => number;

        // returns the lowest rated category of those passed in,
        // and also a combined string of all categories with their star values, sorted from lowest to highest
        public sortRatableArray: (ratables: string[]) => string;

    }
}

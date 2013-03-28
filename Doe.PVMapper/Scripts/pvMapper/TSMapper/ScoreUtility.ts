

module pvMapper {
    export interface IScoreUtility {
        minValue: number;
        maxValue: number;
        target: number;
        slope: number;
        functionName: string;
    }

    export class UtilityFunctions {
        public static moreIsBetter(x:number, args) {
            return 1 - UtilityFunctions.lessIsBetter(x, args);
        }

        public static lessIsBetter(x:number, args) {
            var l = args.minValue;
            var b = args.target;
            var h = args.maxValue;
            var sRatio = (args.slope / 5) + .3;
            var y = 0; //The return variable

            var s = Math.min(-2 / (b - l), -2 / (h - b));
            s = s * (sRatio);

            if (x >= h) y = 0;
            else if (x <= l) y = 1;
            else y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) :
                1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
            if (y >= 1) y = 1;
            if (y <= 0) y = 0;
            return y;
        }

        public static random():number {
            return Math.random();
        }
    }


    export class ScoreUtility {
        constructor(options: IScoreUtility) {
            this.minValue = options.minValue;
            this.target = options.target;
            this.maxValue = options.maxValue;
            this.slope = options.slope;
            this.functionName = options.functionName;
        }
       
        public minValue: number;
        public target: number;
        public maxValue: number;
        public slope: number;
        public functionName: string;

        //An options object might be better here. Then a call to a static function with options would be possible 
        public run = function (x) {
            //Run the function that the user needs run
            var y: number = pvMapper.UtilityFunctions[this.functionName].apply(UtilityFunctions, [x, this]);

            //TODO: Error check y
            return y*100;
        }


        public serialize() {
            throw "Serialize not implemented yet for this object";
        }
        public deserialize() {
            throw "Deserialize is not implemented yet for this object";
        }
    }


}
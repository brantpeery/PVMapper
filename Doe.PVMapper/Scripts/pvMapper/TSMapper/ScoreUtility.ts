

module pvMapper {
    export interface IScoreUtilityOptions {
        functionName: string;
    }

    export interface IMinMaxUtilityOptions extends IScoreUtilityOptions {
        minValue: number;
        maxValue: number;
    }

    export interface ISinusoidalUtilityOptions extends IMinMaxUtilityOptions {
        target: number;
        slope: number;
    }

    export interface IThreePointUtilityOptions extends IScoreUtilityOptions {
        p0: { x: number; y: number; };
        p1: { x: number; y: number; };
        p2: { x: number; y: number; };
    }

    export class UtilityFunctions {

        public static sinusoidal(x: number, args: ISinusoidalUtilityOptions) {
            var l = args.minValue
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

            var y = 0; //The return variable
            if (x >= h) y = 0;
            else if (x <= l) y = 1;
            else y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) :
                1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
            //Note: clamping this value to the range 0-1 is handled by the run(x) function
            //if (y >= 1) y = 1;
            //if (y <= 0) y = 0;
            return y;
        }

        public static linear(x: number, args: IMinMaxUtilityOptions) {
            //Note: clamping this value to the range 0-1 is handled by the run(x) function
            return ((x - args.minValue) / (args.maxValue - args.minValue));
        }

        // textbook linear interpolation
        public static linear3pt(x: number, args: IThreePointUtilityOptions) {
            //Note: clamping this value to the range 0-1 is handled by the run(x) function
            if (x < args.p0.x) return args.p0.y;
            else if (x < args.p1.x) return args.p0.y + ((args.p1.y - args.p0.y) * (x - args.p0.x) / (args.p1.x - args.p0.x));
            else if (x < args.p2.x) return args.p1.y + ((args.p2.y - args.p1.y) * (x - args.p1.x) / (args.p2.x - args.p1.x));
            else return args.p2.y;
        }

        public static random():number {
            return Math.random();
        }
    }

    export class ScoreUtility {
        constructor(options: IScoreUtilityOptions) {
            this.scoreUtilityOptions = options;
        }
        
        public scoreUtilityOptions: IScoreUtilityOptions;

        //An options object might be better here. Then a call to a static function with options would be possible 
        public run = function (x) {
            if (isNaN(x)) return Number.NaN;

            //Run the function that the user needs run
            var y: number = pvMapper.UtilityFunctions[this.scoreUtilityOptions.functionName](x, this.scoreUtilityOptions);

            return Math.max(0, Math.min(1, y)) * 100;
        }


        public serialize() {
            throw "Serialize not implemented yet for this object";
        }
        public deserialize() {
            throw "Deserialize is not implemented yet for this object";
        }
    }


}
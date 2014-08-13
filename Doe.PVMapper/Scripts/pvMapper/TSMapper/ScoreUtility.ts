/// <reference path="UtilityFunctions.ts" />
/// <reference path="ScoreUtilityWindows.ts" />

module pvMapper {

    export interface ICustomFunctionCallback {
        (x: number, args: any): number;
    }
    export declare var ICustomFunctionCallback: {
        new (x: number, args: any): number;
        (x: number, args: any): number;
        prototype: ICustomFunctionCallback;
    };

    /**
    A function that is called when the Utility Function Editor window is created. It allows the setup of custom fields in the window.
    Signature: function (panel:any, args:any)

    @param panel The panel that needs to be set up with custom Extjs components
    @param args  The argument object that has been saved to use with the custom function. Use this to display current values to the user when setting up the components.
    */
    export interface IWindowSetupCallback {
        (panel: any, args: any);
    }
    //export declare var IWindowSetupCallback: {
    //    new (panel: any, args: any);
    //    (panel: any, args: any);
    //    prototype: IWindowSetupCallback;
    //}

    export interface IWindowOkCallback {
        (panel: any, args: any);                                             
    }
    //export declare var IWindowOkCallback: {
    //    new (panel: any, args: any);
    //    (panel: any, args: any);
    //    prototype: IWindowOkCallback;
    //}

    export interface IScoreUtilityArgs {
        toExcelString(): string;
    }
    export interface IScoreUtilityOptions {
        functionName: string;
        functionArgs: IScoreUtilityArgs;
        iconURL?: string;
    }

    export class MinMaxUtilityArgs implements IScoreUtilityArgs {

        constructor(public minValue: number = 0,
            public maxValue: number = 0,
            unit: string = "",
            xLabel: string = "value",
            memo: string = "",
            minTip: string = null,
            maxTip: string = null
            ) {
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

        //public tips: {
        //    minValue: string;
        //    maxValue: string;
        //};
        public metaInfo: {
            name: string;
            unitSymbol: string;
            minValueTip: string;
            maxValueTip: string;
            vline: number;
            comment: string;
            x_axis: string;
            y_axis: string;
        }
        public toExcelString() {
            var str = "";
            //str += "name: " + this.metaInfo.name;
            str += ", min: " + this.minValue.toFixed(0);
            str += ", max: " + this.maxValue.toFixed(0);
            str += ", x-axis: " + this.metaInfo.x_axis;
            str += ", y-axis: " + this.metaInfo.y_axis;
            str += ", comment: " + this.metaInfo.comment;
            return str; 
        }
    }

    export class SinusoidalUtilityArgs implements IScoreUtilityArgs {// IMinMaxUtilityArgs {
        constructor(public minValue: number = 0,
            public maxValue: number = 100,
            public target: number = 0,
            public slope: number = 10,
            unit: string = "",
            xLabel: string = "X-axis",
            yLabel: string = "Y-axis",
            memo: string = "",
            minTip: string = "The minimum value.",
            maxTip: string = "The maximum value.",
            targetTip: string = "The target value.",
            slopeTip: string = "The slope value.") {
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

        //public tips: {
        //    target: string;
        //    slope: string;
        //    minValue: string;
        //    maxValue: string;
        //};
        public metaInfo: {
            name: string;
            unitSymbol: string;
            targetTip: string;
            slopeTip: string;
            minValueTip: string;
            maxValueTip: string;
            vline: number;
            comment: string;
            x_axis: string;
            y_axis: string;
        }

        public toExcelString() {
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
        }
    }

    export class ThreePointUtilityArgs implements IScoreUtilityArgs {
        constructor(p0x: number = 0, p0y: number = 0,
            p1x: number = 0, p1y: number = 0,
            p2x: number = 0, p2y: number = 0,
            unit: string = "",
            xLabel: string = "value",
            memo: string = ""
            ) {
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
        public p0: { x: number; y: number; };
        public p1: { x: number; y: number; };
        public p2: { x: number; y: number; };

        public points: string[] = ["p0", "p1", "p2"];
        public metaInfo: {
            name: string;
            unitSymbol: string;
            vline: number;
            comment: string;
            x_axis: string;
            y_axis: string;
        }
        public toExcelString() {
            var str = "";;
            //str += "name: " + this.metaInfo.name;
            str += "points: ["
            str += "(" + this.p0.x.toFixed(0) + "," + this.p0.y.toFixed(0) + "),";
            str += "(" + this.p1.x.toFixed(0) + "," + this.p1.y.toFixed(0) + "),";
            str += "(" + this.p2.x.toFixed(0) + "," + this.p2.y.toFixed(0) + ")]";
            str += ", x-axis: " + this.metaInfo.x_axis;
            str += ", y-axis: " + this.metaInfo.y_axis;
            str += ", comment: " + this.metaInfo.comment;
            return str;
        }
    }

    export class ScoreUtility {                            
        constructor(options: IScoreUtilityOptions) {
            //Attach the named function and window
            this.functionName = options.functionName;
            this.functionArgs = this.createArg(options.functionName);
            $.extend(this.functionArgs, options.functionArgs);
            this.iconURL = options.iconURL;
        }

        //public scoreUtilityOptions: IScoreUtilityOptions;
        public functionName: string;
        public functionArgs: IScoreUtilityArgs;
        public iconURL: string;
        public fCache: any = {};

        //An options object might be better here. Then a call to a static function with options would be possible 
        public run(x: number) {
            if (typeof x !== "number" || isNaN(x))
                return Number.NaN;

            //Run the function that the user needs run
            var y: number = pvMapper.UtilityFunctions[this.functionName].fn(x, this.functionArgs);
            return Math.max(0, Math.min(1, y)) * 100;
        }

        public toJSON = (): any => {
            var o = {
                functionName: this.functionName,
                functionArgs: JSON.parse(JSON.stringify(this.functionArgs)), //HACK: remove that stupid toExcelString() function from our args object
                //iconURL: this.iconURL,
                //fCache: this.fCache
            }
          return o;
        }


        public createArg(fn: string):IScoreUtilityArgs {
            switch (fn) {
                case "linear": 
                    return new MinMaxUtilityArgs();
                case "sinusoidal": 
                    return new SinusoidalUtilityArgs();
                case "linear3pt":
                    return new ThreePointUtilityArgs();
            }
        }

        public fromJSON(o: any) {
            this.functionName = o.functionName;

            this.functionArgs = this.createArg(o.functionName);
            $.extend(this.functionArgs, o.functionArgs);
            //this.iconURL = o.iconURL;
            //this.fCache = o.fCache;
        }

        public toExcelString() {
            var str = "";
            str += this.functionName;
            str += "(" + this.functionArgs.toExcelString() + ")";  
            return str;   
        }
        //public serialize() {
        //    throw "Serialize not implemented yet for this object";
        //}
        //public deserialize() {
        //    throw "Deserialize is not implemented yet for this object";
        //}
    }
}
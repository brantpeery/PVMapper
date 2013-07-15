/// <reference path="UtilityFunctions.ts" />
/// <reference path="ScoreUtilityWindows.ts" />

//declare var Ext;
//declare var JXG;
//declare var Extras;


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
        className: string;
    }
    export interface IScoreUtilityOptions {
        functionName: string;
        functionArgs: IScoreUtilityArgs;
        iconURL?: string;
    }

    export interface ICustomScoreUtilityOptions extends IScoreUtilityOptions {
        functionCallback: (x: number, args: any) => number;
        windowSetupCallback: IWindowSetupCallback;
        windowOkCallback: IWindowOkCallback;

    }

    export class MinMaxUtilityArgs implements IScoreUtilityArgs {

        constructor(public minValue: number = 0,
            public maxValue: number = 100,
            minTip: string = "The minimum value.",
            maxTip: string = "The maximum value."
            ) {
            this.tips = { minValue: minTip, maxValue: maxTip };

        }
        public tips: {
            minValue: string;
            maxValue: string;
        };
        public className = "MinMaxUtilityArgs";
    }

    export class SinusoidalUtilityArgs implements IScoreUtilityArgs {// IMinMaxUtilityArgs {
        constructor(public minValue: number = 0,
            public maxValue: number = 100,
            public target: number = 0,
            public slope: number = 0,
            minTip: string = "The minimum value.",
            maxTip: string = "The maximum value.",
            targetTip: string = "The target value.",
            slopeTip: string = "The slope value.") {
            this.tips = {
                target: targetTip,
                slope: slopeTip,
                minValue: minTip,
                maxValue: maxTip
            };
        }

        public tips: {
            target: string;
            slope: string;
            minValue: string;
            maxValue: string;
        };
        public className = "SinusoidalUtilityArgs";
    }

    export class ThreePointUtilityArgs implements IScoreUtilityArgs {
        constructor(p0x: number = 0, p0y: number = 0.5,
            p1x: number = 180, p1y: number = 1,
            p2x: number = 360, p2y: number = 0.5) {
            this.p0 = { x: p0x, y: p0y };
            this.p1 = { x: p1x, y: p1y };
            this.p2 = { x: p2x, y: p2y };
        }
        public p0: { x: number; y: number; };
        public p1: { x: number; y: number; };
        public p2: { x: number; y: number; };


        public points: string[] = ["p0", "p1", "p2"];
        public className: string = "ThreePointUtilityArgs";
    }

    export class ScoreUtility {
        constructor(options: IScoreUtilityOptions) {
            //Check for custom utility by checking to see if there is a function callback (not optimal but in the absence of interface comparison will do)
            if (options['functionCallback']) {
                //Load up the ScoreUtility with the custom function + window callbacks
                var copt: ICustomScoreUtilityOptions = <ICustomScoreUtilityOptions> options; //This is a dumb way of making the IDE stop complaining that the type is not right
                //Create a new utility function named after the custom functionName
                UtilityFunctions[copt.functionName] = {
                    fn: copt.functionCallback,
                    //Attach handlers for setting up and tearing down the utility function setup window
                    windowSetup: copt.windowSetupCallback,
                    windowOk: copt.windowOkCallback,
                    iconURL: copt.iconURL
                }
            }

            //Attach the named function and window
            this.functionName = options.functionName;
            this.functionArgs = options.functionArgs;
            this.iconURL = options.iconURL;

        }

        //public scoreUtilityOptions: IScoreUtilityOptions;
        public functionName: string;
        public functionArgs: IScoreUtilityArgs;
        public iconURL: string;

        //An options object might be better here. Then a call to a static function with options would be possible 
        public run(x) {
            if (isNaN(x)) return Number.NaN;

            //Run the function that the user needs run
            var y: number = pvMapper.UtilityFunctions[this.functionName].fn(x, this.functionArgs);
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
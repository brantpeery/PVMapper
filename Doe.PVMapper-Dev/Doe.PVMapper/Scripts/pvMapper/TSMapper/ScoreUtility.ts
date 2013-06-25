/// <reference path="UtilityFunctions.ts" />
/// <reference path="ScoreUtilityWindows.ts" />

declare var Ext: any;
declare var JXG: any;
declare var Extras: any;

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

    //export interface IMinMaxUtilityArgs extends IScoreUtilityArgs {
    //    minValue: number;
    //    maxValue: number;
    //}

    export class MinMaxUtilityArgs implements IScoreUtilityArgs {

        constructor(mmObj?: MinMaxUtilityArgs) {
            if (mmObj == undefined) {
                this.minValue = 0;
                this.maxValue = 0;
            } else
            {
                this.minValue = mmObj.minValue;
                this.maxValue = mmObj.maxValue;
            }
            this.tips = { minValue: "The minimum value.", maxValue: "The maximum value." };
        }

        public functionName: string;
        public functionArgs: IScoreUtilityArgs;
        public iconURL: string;

        public minValue: number;
        public maxValue: number;

        public tips: {
            minValue: string;
            maxValue: string;
        };
    }

    export class SinusoidalUtilityArgs implements IScoreUtilityArgs {// IMinMaxUtilityArgs {
        constructor() {
            this.target = 0;
            this.slope = 0;
            this.tips = {
                target: "The target value.",
                slope: "The slope value.",
                minValue: "The minimum value.",
                maxValue: "The maximum value."
            };
        }

        public functionName: string;
        public functionArgs: IScoreUtilityArgs;
        public iconURL: string;

        public target: number;
        public slope: number;
        public minValue: number;
        public maxValue: number;

        public tips: {
            target: string;
            slope: string;
            minValue: string;
            maxValue: string;
        };
    }

    export class ThreePointUtilityArgs implements IScoreUtilityArgs {
        p0: { x: number; y: number; };
        p1: { x: number; y: number; };
        p2: { x: number; y: number; };
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
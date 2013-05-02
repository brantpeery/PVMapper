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
        iconURL: string;
    }

    export interface ICustomScoreUtilityOptions extends IScoreUtilityOptions {
        functionCallback: (x: number, args: any) => number;
        windowSetupCallback: IWindowSetupCallback;
        windowOkCallback: IWindowOkCallback;
    }

    export interface IMinMaxUtilityArgs extends IScoreUtilityArgs {
        minValue: number;
        maxValue: number;
        target: number;
    }

    export interface ISinusoidalUtilityArgs extends IMinMaxUtilityArgs {
        target: number;
        slope: number;
    }

    export interface IThreePointUtilityArgs extends IScoreUtilityArgs {
        p0: { x: number; y: number; };
        p1: { x: number; y: number; };
        p2: { x: number; y: number; };
    }

    //Created for static access from more than one function def
    export class ScoreUtilityWindows {
        public static basicWindow = {
            _xArgs: {},
            setup: function (panel, args, fn, xBounds) {
                //var _this = this;
                var board;
                var fnOfy;
                this._xArgs = Ext.Object.merge({}, args); //!Create a clone of the args for use in the graph

                function loadboard() {
                    //Extras.loadExternalCSS("http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css");
                    Extras.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {

                        var bounds = xBounds(args);
                        // ensure that the buffer is > 0 (bounds being equal is a valid case for a step function)
                        var buffer = (bounds[0] == bounds[1]) ? 1 : (bounds[1] - bounds[0]) / 10;
                        bounds[0] -= buffer;
                        bounds[1] += buffer * 1.5; // a little more on the right hand side feels nice.

                        board = JXG.JSXGraph.initBoard('FunctionBox-body', {
                            boundingbox: [bounds[0], 108, bounds[1], -8],
                            axis: true, showCopyright: false, showNavigation: false
                        });
                        //TODO: should we replace this with ScoreUtility.run(x) ...?
                        fnOfy = board.create('functiongraph', function (x) {
                            var y = fn(x, this._xArgs);
                            return Math.max(0, Math.min(1, y)) * 100;
                        }, {
                            strokeWidth: 3, strokeColor: "red"
                        });
                    });
                }

                panel.removeAll();
                panel.add(
                    Ext.create('Ext.grid.property.Grid', {
                        source: this._xArgs,
                        listeners: {
                            afterrender: function (sender, eOpts) {
                                loadboard();
                            },
                            edit: function (editor, e, eOpts) {
                                //Update the xArgs
                                //Already handled by the prperty grid :)
                                board.update();
                            },
                            propertychange: function (source, recordId, value, oldValue, eOpts) {
                                board.update();
                            }
                        }
                    }),
                    {
                        //Center the graph
                        xtype: 'panel',
                        layout: {
                            align: 'center',
                            pack: 'center',
                            type: 'vbox'
                        },
                        items: {
                            //padding: '10 0 0 0',
                            id: 'FunctionBox',
                            xtype: 'panel',
                            layout: 'fit',
                            border: true,
                            width: 200,
                            height: 225,
                            padding: 5
                        }
                    }
                );
            },
            okhandler: function (panel, args) {
                Ext.apply(args, this._xArgs);
            }
        }
    }


    //Static accessed class that holds all the utility functions for the application
    export class UtilityFunctions {
        //System supplied utility function objects

        //Performs a sinusoidal function. Uses the basic setup UI 
        public static sinusoidal = {
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,

            xBounds: function (args: ISinusoidalUtilityArgs) {
                return [Math.min(args.minValue, args.maxValue), Math.max(args.minValue, args.maxValue)]
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/wizard_icon.jpg",
            fn: function (x: number, args: ISinusoidalUtilityArgs) {
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
        }


        public static linear = {
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,

            xBounds: function (args: IMinMaxUtilityArgs) {
                return [Math.min(args.minValue, args.maxValue), Math.max(args.minValue, args.maxValue)]
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/stats_icon.jpg",
            fn: function (x: number, args: IMinMaxUtilityArgs) {
                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                return ((x - args.minValue) / (args.maxValue - args.minValue));
            }
        }

        // textbook linear interpolation
        public static linear3pt = {
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,
    
            xBounds: function (args: IThreePointUtilityArgs) {
                return [Math.min(args.p0.x, Math.min(args.p1.x, args.p2.x)),
                     Math.max(args.p0.x, Math.max(args.p1.x, args.p2.x))];
            },
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/document_icon.jpg",
            fn: function (x: number, args: IThreePointUtilityArgs) {
                //Note: clamping this value to the range 0-1 is handled by the run(x) function
                //TODO: this breaks if you reorder the points - fix that.
                if (x < args.p0.x) return args.p0.y;
                else if (x < args.p1.x) return args.p0.y + ((args.p1.y - args.p0.y) * (x - args.p0.x) / (args.p1.x - args.p0.x));
                else if (x < args.p2.x) return args.p1.y + ((args.p2.y - args.p1.y) * (x - args.p1.x) / (args.p2.x - args.p1.x));
                else return args.p2.y;
            }
        }

        public static random = {
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/help_icon.jpg",
            fn: function (): number {
                return Math.random();
            }
        }
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
        public run (x) {
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
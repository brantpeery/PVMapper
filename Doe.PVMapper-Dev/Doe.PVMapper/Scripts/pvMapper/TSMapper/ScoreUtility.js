var pvMapper;
(function (pvMapper) {
    //Created for static access from more than one function def
    var ScoreUtilityWindows = (function () {
        function ScoreUtilityWindows() { }
        ScoreUtilityWindows.basicWindow = {
            _xArgs: {
            },
            setup: function (panel, args, fn, xBounds) {
                var _this = this;
                var board;
                var fnOfy;
                _this._xArgs = Ext.Object.merge({
                }, args)//!Create a clone of the args for use in the graph
                ;
                function loadboard() {
                    //Extras.loadExternalCSS("http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css");
                    Extras.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {
                        var bounds = xBounds(args);
                        // ensure that the buffer is > 0 (bounds being equal is a valid case for a step function)
                        var buffer = (bounds[0] == bounds[1]) ? 1 : (bounds[1] - bounds[0]) / 10;
                        bounds[0] -= buffer;
                        bounds[1] += buffer * 1.5// a little more on the right hand side feels nice.
                        ;
                        board = JXG.JSXGraph.initBoard('FunctionBox-body', {
                            boundingbox: [
                                bounds[0], 
                                108, 
                                bounds[1], 
                                -8
                            ],
                            axis: true,
                            showCopyright: false,
                            showNavigation: false
                        });
                        //TODO: should we replace this with ScoreUtility.run(x) ...?
                        fnOfy = board.create('functiongraph', function (x) {
                            var y = fn(x, _this._xArgs);
                            return Math.max(0, Math.min(1, y)) * 100;
                        }, {
                            strokeWidth: 3,
                            strokeColor: "red"
                        });
                    });
                }
                panel.removeAll();
                var gridPanel = Ext.create('Ext.grid.property.Grid', {
                    source: _this._xArgs,
                    listeners: {
                        afterrender: function (sender, eOpts) {
                            _this.loadboard();
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
                });
                //For the property grid's items, it seems always has a 'constructor' item to begin with.
                if(gridPanel.items.length > 1) {
                    panel.add(gridPanel);
                }
                panel.add({
                    xtype: //Center the graph
                    'panel',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'vbox'
                    },
                    items: {
                        id: //padding: '10 0 0 0',
                        'FunctionBox',
                        xtype: 'panel',
                        layout: 'fit',
                        border: true,
                        width: 200,
                        height: 225,
                        padding: 5
                    },
                    listeners: {
                        afterrender: function (sender, eOpts) {
                            loadboard();
                        }
                    }
                });
            },
            okhandler: function (panel, args) {
                Ext.apply(args, this._xArgs);
            }
        };
        return ScoreUtilityWindows;
    })();
    pvMapper.ScoreUtilityWindows = ScoreUtilityWindows;    
    //Static accessed class that holds all the utility functions for the application
    var UtilityFunctions = (function () {
        function UtilityFunctions() { }
        UtilityFunctions.sinusoidal = {
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,
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
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,
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
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,
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
            windowSetup: ScoreUtilityWindows.basicWindow.setup,
            windowOk: ScoreUtilityWindows.basicWindow.okhandler,
            iconURL: "http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/help_icon.jpg",
            fn: function () {
                return Math.random();
            }
        };
        return UtilityFunctions;
    })();
    pvMapper.UtilityFunctions = UtilityFunctions;    
    var ScoreUtility = (function () {
        function ScoreUtility(options) {
            //Check for custom utility by checking to see if there is a function callback (not optimal but in the absence of interface comparison will do)
            if(options['functionCallback']) {
                //Load up the ScoreUtility with the custom function + window callbacks
                var copt = options;//This is a dumb way of making the IDE stop complaining that the type is not right
                
                //Create a new utility function named after the custom functionName
                UtilityFunctions[copt.functionName] = {
                    fn: copt.functionCallback,
                    windowSetup: //Attach handlers for setting up and tearing down the utility function setup window
                    copt.windowSetupCallback,
                    windowOk: copt.windowOkCallback,
                    iconURL: copt.iconURL
                };
            }
            //Attach the named function and window
            this.functionName = options.functionName;
            this.functionArgs = options.functionArgs;
            this.iconURL = options.iconURL;
        }
        ScoreUtility.prototype.run = //An options object might be better here. Then a call to a static function with options would be possible
        function (x) {
            if(isNaN(x)) {
                return Number.NaN;
            }
            //Run the function that the user needs run
            var y = pvMapper.UtilityFunctions[this.functionName].fn(x, this.functionArgs);
            return Math.max(0, Math.min(1, y)) * 100;
        };
        ScoreUtility.prototype.serialize = function () {
            throw "Serialize not implemented yet for this object";
        };
        ScoreUtility.prototype.deserialize = function () {
            throw "Deserialize is not implemented yet for this object";
        };
        return ScoreUtility;
    })();
    pvMapper.ScoreUtility = ScoreUtility;    
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=ScoreUtility.js.map

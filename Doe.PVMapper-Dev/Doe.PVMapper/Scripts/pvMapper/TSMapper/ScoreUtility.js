var pvMapper;
(function (pvMapper) {
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
                }, args);
                function loadboard() {
                    Extras.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {
                        var bounds = xBounds(args);
                        var buffer = (bounds[0] == bounds[1]) ? 1 : (bounds[1] - bounds[0]) / 10;
                        bounds[0] -= buffer;
                        bounds[1] += buffer * 1.5;
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
                        fnOfy = board.create('functiongraph', function (x) {
                            var y = fn(x, this._xArgs);
                            return Math.max(0, Math.min(1, y)) * 100;
                        }, {
                            strokeWidth: 3,
                            strokeColor: "red"
                        });
                    });
                }
                panel.removeAll();
                panel.add(Ext.create('Ext.grid.property.Grid', {
                    source: this._xArgs,
                    listeners: {
                        afterrender: function (sender, eOpts) {
                            loadboard();
                        },
                        edit: function (editor, e, eOpts) {
                            board.update();
                        },
                        propertychange: function (source, recordId, value, oldValue, eOpts) {
                            board.update();
                        }
                    }
                }), {
                    xtype: 'panel',
                    layout: {
                        align: 'center',
                        pack: 'center',
                        type: 'vbox'
                    },
                    items: {
                        id: 'FunctionBox',
                        xtype: 'panel',
                        layout: 'fit',
                        border: true,
                        width: 200,
                        height: 225,
                        padding: 5
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
                    var swap = l;
                    l = h;
                    h = swap;
                    s = -s;
                }
                s = s * Math.max(2 / (b - l), 2 / (h - b));
                var y = 0;
                if(x >= h) {
                    y = 0;
                } else if(x <= l) {
                    y = 1;
                } else {
                    y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) : 1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
                }
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
                return ((x - args.minValue) / (args.maxValue - args.minValue));
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
            if(options['functionCallback']) {
                var copt = options;
                UtilityFunctions[copt.functionName] = {
                    fn: copt.functionCallback,
                    windowSetup: copt.windowSetupCallback,
                    windowOk: copt.windowOkCallback,
                    iconURL: copt.iconURL
                };
            }
            this.functionName = options.functionName;
            this.functionArgs = options.functionArgs;
            this.iconURL = options.iconURL;
        }
        ScoreUtility.prototype.run = function (x) {
            if(isNaN(x)) {
                return Number.NaN;
            }
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

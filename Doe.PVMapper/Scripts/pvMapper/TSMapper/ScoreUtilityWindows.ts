/// <reference path="UtilityFunctions.ts" />
declare var Ext: any;
declare var JXG: any;
declare var Extras: any;


module pvMapper {

    //Created for static access from more than one function def
    export class ScoreUtilityWindows {
        public static basicWindow = {
            _xArgs: {},
            setup: function (panel, scoreObj) { // args, fn, xBounds) {
                var args = scoreObj.functionArgs;
                var fn = pvMapper.UtilityFunctions[scoreObj.functionName].fn;
                var xBounds = pvMapper.UtilityFunctions[scoreObj.functionName].xBounds;

                var _this = this;
                var board;
                var fnOfy;
                _this._xArgs = Ext.Object.merge({}, args); //!Create a clone of the args for use in the graph
                var gridPanel;
                function loadboard() {
                    //Extras.loadExternalCSS("http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css");
                    Extras.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.97/jsxgraphcore.js", function () {

                        var bounds = xBounds(args);
                        // ensure that the buffer is > 0 (bounds being equal is a valid case for a step function)
                        var buffer = (bounds[0] == bounds[1]) ? 1 : (bounds[1] - bounds[0]) / 10;
                        bounds[0] -= buffer;
                        bounds[1] += buffer * 1.5; // a little more on the right hand side feels nice.

                        board = JXG.JSXGraph.initBoard('FunctionBox-body', {
                            boundingbox: [bounds[0], 108, bounds[1], -8],
                            axis: true, showCopyright: false, showNavigation: true
                        });


                        //TODO: should we replace this with ScoreUtility.run(x) ...?
                        fnOfy = board.create('functiongraph', function (x) {
                            var y = fn(x, _this._xArgs);
                            return Math.max(0, Math.min(1, y)) * 100;
                        }, {
                            strokeWidth: 3, strokeColor: "red",
                        });

                        //NOTE: this code section aught to move to a separate file closer to the UtilityFunction.
                        if (args.constructor == pvMapper.ThreePointUtilityArgs) {
                            if (_this._xArgs.points != undefined && _this._xArgs.points.length > 0) {
                                //create the points
                                _this._xArgs.points.forEach(function (p, idx) {
                                    var point = board.create('point', [_this._xArgs[p].x, _this._xArgs[p].y * 100], { name: p, size: 3 });
                                    point.on("drag", function (e) {
                                        _this._xArgs[p].x = point.X();
                                        _this._xArgs[p].y = point.Y() / 100;
                                        board.update();
                                    });
                                })
                            }
                        }
                        else if (args.constructor == pvMapper.MinMaxUtilityArgs) {
                            var point1 = board.create('point', [_this._xArgs.minValue, 0], { name: 'Min', size: 3 });
                            point1.on("drag", function (e) {
                                _this._xArgs.minValue = point1.X();
                                board.update();
                                point1.moveTo([point1.X(), 0]);
                                gridPanel.setSource(_this._xArgs);
                            });

                            var point2 = board.create('point', [_this._xArgs.maxValue, 100], { name: 'Max', size: 3 });
                            point2.on("drag", function (e) {
                                _this._xArgs.maxValue = point1.X();
                                board.update();
                                point2.moveTo([point1.X(), 100]);
                                gridPanel.setSource(_this._xArgs);
                            });
                        }
                        else if (args.constructor == pvMapper.SinusoidalUtilityArgs) {
                            var minPoint = board.create('point', [_this._xArgs.minValue, 0], { name: 'Min', size: 3 });
                            var maxPoint = board.create('point', [_this._xArgs.maxValue, 100], { name: 'Max', size: 3 });
                            var targetPoint = board.create('point', [_this._xArgs.target, 50], { name: 'target', size: 3 });
                            minPoint.on("drag", function (e) {
                                var x = minPoint.X();
                                if (x > targetPoint.X())
                                    x = targetPoint.X();
                                _this._xArgs.minValue = x;
                                board.update();
                                minPoint.moveTo(x, minPoint.Y());
                            });
                            maxPoint.on("drag", function (e) {
                                var x = maxPoint.X();
                                if (x < targetPoint.X())
                                    x = targetPoint.X();
                                _this._xArgs.maxValue = x;
                                board.update();
                                minPoint.moveTo(x, minPoint.Y());
                            });
                            targetPoint.on("drag", function (e) {
                                var x = targetPoint.X();
                                if (x < minPoint.X())
                                    x = minPoint.X();
                                if (x > maxPoint.X())
                                    x = maxPoint.X();
                                _this._xArgs.targetValue = x;
                                board.update();
                                minPoint.moveTo(x, targetPoint.Y());
                            });
                        }
                    });
                }

                panel.removeAll();

                gridPanel = Ext.create('Ext.grid.property.Grid', {
                    source: _this._xArgs,
                    tipValue: null,
                    viewConfig: {
                        deferEmptyText: false, // defaults to true
                        emptyText: '<center><i>no editable fields</i></center>' // can be passed to the grid itself or within a viewConfig object
                    },
                    listeners: {
                        edit: function (editor, e, eOpts) {
                            //Update the xArgs
                            //Already handled by the prperty grid :)
                            board.update();
                        },
                        propertychange: function (source, recordId, value, oldValue, eOpts) {
                            board.update();
                        },
                        //======= Add to support tool tip =============
                        itemmouseenter: function (grid, record, item, index, e, opts) {
                            if (this.source.tips != undefined) {
                                //TODO: this...?
                                //this.tipValue = pvMapper.UtilityFunctions[this.source.functionName].tips[record.internalId];
                                this.tipValue = this.source.tips[record.internalId];
                            } else {
                                this.tipValue = "Property " + record.internalId;
                            }
                            this.tip.update(this.tipValue);
                        },
                        itemmouseleave: function (grid, record, item, index, e, opts) {
                            this.tipValue = null;
                        },
                        render: function (grid, opts) {
                            var _this = this;
                            grid.tip = Ext.create('Ext.tip.ToolTip', {
                                target: grid.el,
                                delegate: grid.cellSelector,
                                trackMouse: true,
                                renterTo: Ext.getBody(),
                                listeners: {
                                    beforeshow: function (tip) {
                                        tip.update(_this.tipValue);
                                    }
                                }
                            });
                        }
                        //======= END Tooltip ========
                    }
                });
                panel.add(gridPanel);
                panel.add({
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
        }
    }

}
/// <reference path="pvMapper.ts" />
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
                var cbxFunctions;
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

                        //draggable lines querying reflecting values.  By using the fn function to query the intersecting Y value, this should work for any utility function.
                        var bb = board.getBoundingBox();
                        var dx = ((bb[2] - bb[0]) / 2.0) + bb[0];
                        var dy = fn(dx, _this._xArgs) * 100;
                        var vline = board.create('segment', [[dx, 0], [dx, dy]],
                            { name: (bb[2] / 2.0).toFixed(1) + " " + _this._xArgs.metaInfo.unitSymbol, withLabel: true, strokeColor: "blue", dash: 2, strokeOpacity: 0.15 });
                        var scoreColor = pvMapper.getColorForScore(dy);
                        var hline = board.create('segment', [[0, dy], [vline.point1.X(), dy]],
                            { name: "Score: " + dy.toFixed(0), withLabel: true, strokeColor: scoreColor, dash: 2, strokeWidth: 4, strokeOpacity: 1 });

                        //TODO: make the line move on mouseover, rather than on drag (it's more intuitive)
                        //board.on("mousemove", function (e) {
                        //    //TODO: translate coordinates from event e to score function (x,y)
                        //    //      OR, find a better event to hook into which has translated coordinates
                        //    //      then, do the same line move doodle as below...
                        //});

                        vline.on("drag", function (e) {
                            board.suspendUpdate();
                            //var bb = board.getBoundingBox();

                            var y = fn(vline.point1.X(), _this._xArgs);
                            y = Math.max(0, Math.min(1, y)) * 100;

                            vline.labelColor("red");
                            vline.setLabelText((vline.point1.X()).toFixed(1) + " " + _this._xArgs.metaInfo.unitSymbol);

                            vline.point1.moveTo([vline.point1.X(), 0]);
                            vline.point2.moveTo([vline.point1.X(), y]);

                            hline.labelColor("red");
                            hline.setLabelText("Score: " + y.toFixed(0));
                            hline.visProp.strokecolor = pvMapper.getColorForScore(y);

                            hline.point1.moveTo([0, y]);
                            hline.point2.moveTo([vline.point1.X(), y]);
                            board.unsuspendUpdate();
                        });

                        //do this just to prevent the horizontal line from dragging.
                        hline.on("drag", function (e) {
                            board.suspendUpdate();
                            var y = fn(vline.point1.X(), _this._xArgs) * 100;
                            hline.point1.moveTo([0, y]);
                            hline.point2.moveTo([vline.point1.X(), y]);
                            board.unsuspendUpdate();
                        });

                        // updates guide lines after the function is altered in some way
                        var updateGuideLines = function () {
                            board.suspendUpdate();
                            var y = fn(vline.point1.X(), _this._xArgs);
                            y = Math.max(0, Math.min(1, y)) * 100;

                            vline.point2.moveTo([vline.point1.X(), y]);
                            hline.setLabelText("Score: " + y.toFixed(2));
                            hline.point1.moveTo([0, y]);
                            hline.point2.moveTo([vline.point1.X(), y]);
                            hline.visProp.strokecolor = pvMapper.getColorForScore(y);
                            board.unsuspendUpdate();
                        };

                        //NOTE: this code section aught to move to a separate file closer to the UtilityFunction.
                        if (_this._xArgs.metaInfo.name == "ThreePointUtilityArgs") {
                            if (_this._xArgs.points != undefined && _this._xArgs.points.length > 0) {
                                //create the points
                                // var seg: any[] = new Array<any>();
                                _this._xArgs.points.forEach(function (p, idx) {
                                    var point = board.create('point', [_this._xArgs[p].x, _this._xArgs[p].y * 100], { name: p, size: 3 });
                                    //   seg.push(point);
                                    point.on("drag", function (e) {
                                        _this._xArgs[p].x = point.X();
                                        _this._xArgs[p].y = point.Y() / 100;
                                        updateGuideLines();
                                    });
                                })
                            }
                        }
                        else if (_this._xArgs.metaInfo.name == "MinMaxUtilityArgs") {
                            var point1 = board.create('point', [_this._xArgs.minValue, 0], { name: 'Min', size: 3 });
                            point1.on("drag", function (e) {
                                _this._xArgs.minValue = point1.X();
                                board.update();
                                point1.moveTo([point1.X(), 0]);
                                gridPanel.setSource(_this._xArgs);
                                updateGuideLines();
                            });

                            var point2 = board.create('point', [_this._xArgs.maxValue, 100], { name: 'Max', size: 3 });
                            point2.on("drag", function (e) {
                                _this._xArgs.maxValue = point2.X();
                                board.update();
                                point2.moveTo([point2.X(), 100]);
                                gridPanel.setSource(_this._xArgs);
                                updateGuideLines();
                            });
                        }
                        else if (_this._xArgs.metaInfo.name == "SinusoidalUtilityArgs") {
                            var minPoint = board.create('point', [_this._xArgs.minValue, 0], { name: 'Min', size: 3 });
                            var maxPoint = board.create('point', [_this._xArgs.maxValue, 100], { name: 'Max', size: 3 });
                            var targetPoint = board.create('point', [_this._xArgs.target, 50], { name: 'target', size: 3 });
                            var v = board.create('line', [targetPoint, [function () {return targetPoint.X() }, 0]], { dash: 2, size: 1, strokeOpacity: 0.15 });
                            var h = board.create('line', [targetPoint, [0, function () {return targetPoint.Y() }]], { dash: 2, size: 1, strokeOpacity: 0.15 });
                            minPoint.on("drag", function (e) {
                                var x = minPoint.X();
                                if (x > targetPoint.X())
                                    x = targetPoint.X();
                                _this._xArgs.minValue = x;
                                board.update();
                                minPoint.moveTo(x, minPoint.Y());
                                updateGuideLines();
                            });
                            maxPoint.on("drag", function (e) {
                                var x = maxPoint.X();
                                if (x < targetPoint.X())
                                    x = targetPoint.X();
                                _this._xArgs.maxValue = x;
                                board.update();
                                maxPoint.moveTo(x, maxPoint.Y());
                                updateGuideLines();
                            });
                            targetPoint.on("drag", function (e) {
                                var x = targetPoint.X();
                                if (x < minPoint.X())
                                    x = minPoint.X();
                                if (x > maxPoint.X())
                                    x = maxPoint.X();
                                _this._xArgs.targetValue = x;
                                board.update();
                                targetPoint.moveTo(x, targetPoint.Y());
                                updateGuideLines();
                            });
                        }
                    });
                }

                panel.removeAll();


                var equStore = Ext.create('Ext.data.Store', {
                    fields: ['Name', 'Function'],
                    data: [
                        { "Name": "3 points", "Function": "ThreePointUtilityArgs" },
                        { "Name": "Min-Max", "Function": "MinMaxUtilityArgs" },
                        { "Name": "Less-More", "Function": "SinusoidalUtilityArgs" }
                    ]
                });

                cbxFunctions = Ext.create('Ext.form.field.ComboBox', {
                    fieldLabel: 'Utility Function',
                    store: equStore,
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'Function',
                    //autoLoad: true,

                    renderTo: Ext.getBody(),
                    listeners: {
                        afterrender: function (combo) {
                            if ((typeof _this !== "undefined") && (typeof _this._xArgs !== "undefined")) {
                                this.setValue(_this._xArgs.metaInfo.name, true);
                                this.fireEvent('select', this);
                            }
                        },
                        select: function (combo, records, eopts) {

                            if (combo.value != _this._xArgs.metaInfo.name) {
                                _this._xArgs.metaInfo.name = combo.value;
                                switch (combo.value) {
                                    case 'ThreePointUtilityArgs':
                                        //alert(combo.value);
                                        //TODO: create a 3 points xArgs and assign to _this._xArgs then refresh the screen

                                        scoreObj.functionName = 'linear3pt';
                                        scoreObj.functionArgs = new pvMapper.ThreePointUtilityArgs(0, 0.5, 180, 1, 360, 0.5, "degrees");
                                        ScoreUtilityWindows.basicWindow.setup(panel, scoreObj);
                                        panel.doLayout();
                                        break;
                                    case 'MinMaxUtilityArgs':
                                        //alert(combo.value);
                                        //TODO: see above
                                        scoreObj.functionName = 'linear';
                                        scoreObj.functionArgs = new pvMapper.MinMaxUtilityArgs(10, 0, "degrees");
                                        ScoreUtilityWindows.basicWindow.setup(panel, scoreObj);
                                        //_this._xArgs = new pvMapper.MinMaxUtilityArgs(10, 0, "degrees");
                                        //gridPanel.source = _this._xArgs;
                                        panel.doLayout();
                                        break;
                                    case 'SinusoidalUtilityArgs':
                                        scoreObj.functionName = 'sinusoidal';
                                        scoreObj.functionArgs = new pvMapper.SinusoidalUtilityArgs(0, 100, 0, 0, "degrees");
                                        ScoreUtilityWindows.basicWindow.setup(panel, scoreObj);
                                        panel.doLayout();
                                        //TODO: see above
                                        break;
                                }
                            }
                        }
                    }
                });

                //var funcPanel = Ext.create('Ext.panel.Panel', {
                //    layout: {
                //        align: 'center',
                //        pack: 'center',
                //        type: 'vbox'
                //    },
                //    items: cbxFunctions

                //});

                //Note: Removed this for the demo, as it is not stable or bug-free.
                //      Bug fixes exist for this on the Dev branch, but those fixes also cause bugs (due to merge issues, mostly).
                //      Until there is time to sort out the Dev branch, this is the safest solution available.
                //panel.add(cbxFunctions);

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
                            //TODO: updateGuideLines() isn't called here... but it need to be
                        },
                        propertychange: function (source, recordId, value, oldValue, eOpts) {
                            board.update();
                            //TODO: updateGuideLines() isn't called here... but it need to be
                        },
                        //======= Add to support tool tip =============
                        itemmouseenter: function (grid, record, item, index, e, opts) {
                            if (this.source.metaInfo != undefined) {
                                //TODO: this...?
                                //this.tipValue = pvMapper.UtilityFunctions[this.source.functionName].tips[record.internalId];
                                this.tipValue = this.source.metaInfo[record.internalId + "Tip"];
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
﻿var pvMapper;
(function (pvMapper) {
    //Created for static access from more than one function def
    var ScoreUtilityWindows = (function () {
        function ScoreUtilityWindows() {
        }
        ScoreUtilityWindows.basicWindow = {
            _xArgs: {},
            setup: function (panel, scoreObj) {
                var args = scoreObj.functionArgs;
                var fn = pvMapper.UtilityFunctions[scoreObj.functionName].fn;
                var xBounds = pvMapper.UtilityFunctions[scoreObj.functionName].xBounds;

                var _this = this;
                var board;
                var fnOfy;
                _this._xArgs = Ext.Object.merge({}, args);
                var gridPanel;
                function loadboard() {
                    //Extras.loadExternalCSS("http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css");
                    Extras.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.97/jsxgraphcore.js", function () {
                        var bounds = xBounds(args);

                        // ensure that the buffer is > 0 (bounds being equal is a valid case for a step function)
                        var buffer = (bounds[0] == bounds[1]) ? 1 : (bounds[1] - bounds[0]) / 10;
                        bounds[0] -= buffer;
                        bounds[1] += buffer * 1.5;

                        board = JXG.JSXGraph.initBoard('FunctionBox-body', {
                            boundingbox: [bounds[0], 108, bounds[1], -8],
                            axis: true,
                            showCopyright: false,
                            showNavigation: true
                        });

                        //TODO: should we replace this with ScoreUtility.run(x) ...?
                        fnOfy = board.create('functiongraph', function (x) {
                            var y = fn(x, _this._xArgs);
                            return Math.max(0, Math.min(1, y)) * 100;
                        }, {
                            strokeWidth: 3,
                            strokeColor: "red"
                        });

                        //draggable lines querying reflecting values.  By using the fn function to query the intersecting Y value, this should work for any utility function.
                        var bb = board.getBoundingBox();
                        var vline = board.create('line', [[bb[2] / 2.0, bb[1]], [bb[2] / 2, bb[3]]], { name: (bb[2] / 2.0).toFixed(2) + " " + _this._xArgs.metaInfo.unitSymbol, withLabel: true, strokeColor: "blue", dash: 2, size: 1, strokeOpacity: 0.15 });
                        var dy = fn(bb[2] / 2.0, _this._xArgs) * 100;
                        var hline = board.create('line', [[bb[0], dy], [bb[2], dy]], { name: dy.toFixed(2) + " " + _this._xArgs.metaInfo.unitSymbol, withLabel: true, strokeColor: "blue", dash: 2, size: 1, strokeOpacity: 0.15 });

                        vline.on("drag", function (e) {
                            board.suspendUpdate();

                            var y = fn(vline.point1.X(), _this._xArgs);
                            y = Math.max(0, Math.min(1, y)) * 100;

                            hline.labelColor("red");
                            hline.setLabelText(y.toFixed(2) + " " + _this._xArgs.metaInfo.unitSymbol);
                            vline.labelColor("red");
                            vline.setLabelText((vline.point1.X()).toFixed(2) + " " + _this._xArgs.metaInfo.unitSymbol);

                            hline.point1.moveTo([bb[0], y]);
                            hline.point2.moveTo([bb[2], y]);
                            board.unsuspendUpdate();
                        });

                        //do this just to prevent the horizontal line from dragging.
                        hline.on("drag", function (e) {
                            board.suspendUpdate();
                            var y = fn(vline.point1.X(), _this._xArgs) * 100;
                            hline.point1.moveTo([bb[0], y]);
                            hline.point2.moveTo([bb[2], y]);
                            board.unsuspendUpdate();
                        });

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
                                        board.update();
                                    });
                                });
                            }
                        } else if (_this._xArgs.metaInfo.name == "MinMaxUtilityArgs") {
                            var point1 = board.create('point', [_this._xArgs.minValue, 0], { name: 'Min', size: 3 });
                            point1.on("drag", function (e) {
                                _this._xArgs.minValue = point1.X();
                                board.update();
                                point1.moveTo([point1.X(), 0]);
                                gridPanel.setSource(_this._xArgs);
                            });

                            var point2 = board.create('point', [_this._xArgs.maxValue, 100], { name: 'Max', size: 3 });
                            point2.on("drag", function (e) {
                                _this._xArgs.maxValue = point2.X();
                                board.update();
                                point2.moveTo([point2.X(), 100]);
                                gridPanel.setSource(_this._xArgs);
                            });
                        } else if (_this.xArgs.metaInfo.name == "SinusoidalUtilityArgs") {
                            var minPoint = board.create('point', [_this._xArgs.minValue, 0], { name: 'Min', size: 3 });
                            var maxPoint = board.create('point', [_this._xArgs.maxValue, 100], { name: 'Max', size: 3 });
                            var targetPoint = board.create('point', [_this._xArgs.target, 50], { name: 'target', size: 3 });
                            var v = board.create('line', [targetPoint, [function () {
                                        return targetPoint.X();
                                    }, 0]], { dash: 2, size: 1, strokeOpacity: 0.15 });
                            var h = board.create('line', [targetPoint, [0, function () {
                                        return targetPoint.Y();
                                    }]], { dash: 2, size: 1, strokeOpacity: 0.15 });
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
                                maxPoint.moveTo(x, maxPoint.Y());
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
                            });
                        }
                    });
                }

                panel.removeAll();

                gridPanel = Ext.create('Ext.grid.property.Grid', {
                    source: _this._xArgs,
                    tipValue: null,
                    viewConfig: {
                        deferEmptyText: false,
                        emptyText: '<center><i>no editable fields</i></center>'
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
        };
        return ScoreUtilityWindows;
    })();
    pvMapper.ScoreUtilityWindows = ScoreUtilityWindows;
})(pvMapper || (pvMapper = {}));

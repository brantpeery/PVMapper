/// <reference path="jxg.d.ts" />
/// <reference path="pvMapper.ts" />
/// <reference path="../../ExtJS.d.ts" />
/// <reference path="UtilityFunctions.ts" />

//declare var Ext: any;
//declare var JXG: any;
declare var Extras: any;

module pvMapper {

    //Created for static access from more than one function def
    export class ScoreUtilityWindows {
        public static basicWindow = {
            _xArgs: {},
            _scoreObj: {},
            setup: function (panel, scoreObj) { // args, fn, xBounds) {
                var _this = this;
                _this._scoreObj = scoreObj;
                var args = scoreObj.functionArgs;
                var fn = pvMapper.UtilityFunctions[scoreObj.functionName].fn;
                var xBounds = pvMapper.UtilityFunctions[scoreObj.functionName].xBounds;

                var board;
                var fnOfy;
                var xAxis;
                var yAxis;

                _this._xArgs = Ext.Object.merge({}, args); //!Create a clone of the args for use in the graph

                _this.functionName = scoreObj.functionName;
                var gridPanel;
                var cbxFunctions;
                function loadboard() {
                    //Extras.loadExternalCSS("http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css");
                    //Extras.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.97/jsxgraphcore.js", function () {

                    //if the jsxgraphcore loaded by demand then everything runs peachy.  If it is included in the index.cshtml as others, it runs very slow
                    // and eventually max call state error is thrown.  
                    //$.getScript("/scripts/jsxgraphcore.js")
                    //    .done(function (script, textStatus) { //this one has the latest (0.99.1) and supports of label rotation.
                            var bounds = xBounds(args);
                            var numTicks = 20;

                            // ensure that the buffer is > 0 (bounds being equal is a valid case for a step function)
                            var buffer = (bounds[0] == bounds[1]) ? 1 : (bounds[1] - bounds[0]) / 10;
                            //bounds[1] = dx / high;
                            bounds[1] = Math.min(120, bounds[1]);
                            buffer = buffer > 10 ? 10 : buffer;
                            bounds[1] += buffer * 1.5; // a little more on the right hand side feels nice.
                            bounds[0] -= buffer * 2;

                            JXG.Options.text.display = 'internal';  //need this to make the axis label rotation work.
                            board = JXG.JSXGraph.initBoard('FunctionBox-body', {
                                boundingbox: [bounds[0], 108, bounds[1], bounds[0]],
                                keepaspectratio: false,
                                axis: false,
                                showCopyright: false,
                                showNavigation: true
                            });

                            //move the board's origin when mouse down is not selected on any element.
                            board.on('mousedown', function (e) {
                                var x = e.x;
                                var y = e.y;
                                if (board.downObjects.length == 0) {
                                    board.mode = board.BOARD_MODE_MOVE_ORIGIN;
                                }
                            });

                            //turn off when mouse up.
                            board.on('mouseup', function (e) {
                                board.mode = board.BOARD_MODE_NONE;
                            })

                            var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";


                            var zooming = function (e) {
                                //alert('wheel on: ' + e.wheelDelta);
                                var e = window.event || e; // old IE support;
                                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                                if (delta < 0) {
                                    board.zoomOut(board.attr.zoom.factorx, board.attr.zoom.factory);
                                } else if (delta > 0) {
                                    board.zoomIn(board.attr.zoom.factorx, board.attr.zoom.factory);
                                }
                                return false;
                            }

                            if (board.containerObj.attachEvent) //if IE (and Opera depending on user setting)
                                board.containerObj.attachEvent("on" + mousewheelevt, zooming);
                            else if (board.containerObj.addEventListener) //WC3 browsers
                                board.containerObj.addEventListener(mousewheelevt, zooming, false);


                            var dxtic = board.canvasWidth / (bounds[1] - bounds[0]) * 10;
                            var dytic = board.canvasHeight / (108 - bounds[0]) * 10;

                            _this._xArgs.metaInfo.y_axis = (typeof (_this._xArgs.metaInfo.y_axis) == 'undefined') ? null : _this._xArgs.metaInfo.y_axis;
                            _this._xArgs.metaInfo.x_axis = (typeof (_this._xArgs.metaInfo.x_axis) == 'undefined') ? null : _this._xArgs.metaInfo.x_axis;
                            yAxis = board.create('axis', [[0, 0], [0, 1]],
                                {
                                    name: (_this._xArgs.metaInfo.y_axis) || 'Y-axis',
                                    withLabel: true,
                                    ticks: {
                                        insertTicks: false,
                                        ticksDistance: dytic,
                                        label: {
                                            offset: [-10, 0]
                                        }
                                    },
                                    point1: {
                                        needsRegularUpdate: true
                                    },
                                    point2: {
                                        needsRegularUpdate: true
                                    },
                                    label: {
                                        position: 'top',
                                        offset: [-20, 5],
                                        fixed: false,
                                        strokeColor: 'blue',
                                        highlightStrokeColor: 'red',
                                    }

                                });
                            yAxis.label.addRotation(90);

                            xAxis = board.create('axis', [[0, 0], [1, 0]],
                                {
                                    name: (_this._xArgs.metaInfo.x_axis) || 'X-axis',
                                    withLabel: true,
                                    ticks: {
                                        insertTicks: false,
                                        ticksDistance: dxtic,
                                        label: {
                                            offset: [-2, -10]
                                        }
                                    },
                                    point1: {
                                        needsRegularUpdate: true
                                    },
                                    point2: {
                                        needsRegularUpdate: true
                                    },
                                    label: {
                                        position: 'bot',
                                        offset: [0, -20],
                                        strokeColor: 'blue',
                                        fixed: false,
                                        highlightStrokeColor: 'green'
                                    }

                                });

                            // change between ticks distance, have to do it the hacky way.
                            yAxis.defaultTicks.ticksFunction = function () {
                                return numTicks;
                            };

                            xAxis.defaultTicks.ticksFunction = function () {
                                return numTicks;
                            };

                            //board.constantUnitX = board.unitX;
                            //board.constantUnitY = board.unitY;

                            //var bbox = board.getBoundingBox();
                            //var w = board.canvasWidth;
                            //var h = board.canvasHeight;
                            //bbox[2] = w / board.constantUnitX;
                            //bbox[1] = h / board.constantUnitY;
                            //bbox[0] = -bbox[2] * 0.1;
                            //bbox[3] = -bbox[1] * 0.2;
                            //bbox[2] = bbox[2] + bbox[0];
                            //bbox[1] = bbox[1] + bbox[3];

                            //board.resizeContainer(w, h, false);
                            //board.setBoundingBox(bbox);



                            // to size graph and bound stay the same.

                            var bbox = board.getBoundingBox();
                            board.unitX = board.canvasWidth / (bbox[2] - bbox[0]);
                            board.unitY = board.canvasHeight / (bbox[1] - bbox[3]);
                            board.resizeContainer(board.canvasWidth, board.canvasHeight, false);
                            board.setBoundingBox(bbox);
                            board.needFullUpdate = true;
                            board.fullUpdate();

                            //TODO: should we replace this with ScoreUtility.run(x) ...?
                            fnOfy = board.create('functiongraph', function (x) {
                                var y = fn(x, _this._xArgs);
                                return Math.max(0, Math.min(1, y)) * 100;
                            }, {
                                    strokeWidth: 3, strokeColor: "red",
                                });

                            //draggable lines querying reflecting values.  By using the fn function to query the intersecting Y value, this should work for any utility function.
                            var dx;
                            var bb = board.getBoundingBox();

                            if ((_this._xArgs.metaInfo.vline == undefined) || (_this._xArgs.metaInfo.vline <= 0)) {
                                dx = ((bb[2] - bb[0]) / 2.0) + bb[0];
                                _this._xArgs.metaInfo.vline = dx;
                            }
                            else
                                dx = _this._xArgs.metaInfo.vline;

                            var dy = fn(dx, _this._xArgs) * 100;
                            var vline = board.create('segment', [[dx, 0], [dx, dy]],
                                { name: dx.toFixed(1) + " " + _this._xArgs.metaInfo.unitSymbol, withLabel: true, strokeColor: "blue", dash: 2, strokeOpacity: 0.15 });
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
                                _this._xArgs.metaInfo.vline = vline.point1.X();
                                var y = fn(vline.point1.X(), _this._xArgs);
                                y = Math.max(0, Math.min(1, y)) * 100;

                                vline.labelColor("red");  //<<--- this doesn't seem to work.
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
                                var dmin = fn(_this._xArgs.minValue, _this._xArgs) * 100;
                                var dmax = fn(_this._xArgs.maxValue, _this._xArgs) * 100;
                                var dtar = fn(_this._xArgs.target, _this._xArgs) * 100;

                                var minPoint = board.create('point', [_this._xArgs.minValue, dmin], { name: 'Min', size: 3 });
                                var maxPoint = board.create('point', [_this._xArgs.maxValue, dmax], { name: 'Max', size: 3 });
                                var targetPoint = board.create('point', [_this._xArgs.target, dtar], { name: 'target', size: 3 });
                                minPoint.on("drag", function (e) {
                                    var x = minPoint.X();
                                    if (x > targetPoint.X())
                                        x = targetPoint.X();
                                    _this._xArgs.minValue = x;
                                    board.update();
                                    minPoint.moveTo([x, dmin]);
                                    gridPanel.setSource(_this._xArgs);
                                    updateGuideLines();
                                });
                                maxPoint.on("drag", function (e) {
                                    var x = maxPoint.X();
                                    if (x < targetPoint.X())
                                        x = targetPoint.X();
                                    _this._xArgs.maxValue = x;
                                    board.update();
                                    maxPoint.moveTo([x, dmax]);
                                    gridPanel.setSource(_this._xArgs);
                                    updateGuideLines();
                                });
                                targetPoint.on("drag", function (e) {
                                    var x = targetPoint.X();
                                    if (x < minPoint.X())
                                        x = minPoint.X();
                                    if (x > maxPoint.X())
                                        x = maxPoint.X();
                                    _this._xArgs.target = x;
                                    board.update();
                                    targetPoint.moveTo([x, dtar]);
                                    gridPanel.setSource(_this._xArgs);
                                    updateGuideLines();
                                });
                            }
                        //})
                        //.fail(function (jqxhr, setttings, exception) {
                        //    console.log('Loading graph library failed, cause: ' + exception.message);
                        //});
                } //loadboard()

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

                                //NOTE: merge doesn't copy programmatic add variables,  Ext.apply does, it required param1 to be and existing object where properties can copy onto.
                                var sobj: ScoreUtility = Ext.apply({}, scoreObj);
                                switch (combo.value) {
                                    case 'ThreePointUtilityArgs':
                                        //alert(combo.value);
                                        //TODO: create a 3 points xArgs and assign to _this._xArgs then refresh the screen
                                        if ((sobj.functionName != undefined) && (_this._xArgs != undefined))
                                            sobj.fCache[sobj.functionName] = _this._xArgs;
                                        sobj.functionName = 'linear3pt';
                                        var tpArgs: pvMapper.ThreePointUtilityArgs;
                                        if (sobj.fCache[sobj.functionName] != undefined)
                                            tpArgs = sobj.fCache[sobj.functionName];
                                        else {
                                            tpArgs = new pvMapper.ThreePointUtilityArgs(0, 0.5, 180, 1, 360, 0.5, "degrees");
                                            tpArgs.metaInfo.vline = 180;
                                        }
                                        sobj.functionArgs = tpArgs;
                                        var utilityFn = pvMapper.UtilityFunctions[sobj.functionName];
                                        utilityFn.windowSetup.apply(utilityFn, [panel, sobj]);
                                        _this._scoreObj = sobj;
                                        _this.functionName = sobj.functionName;
                                        _this._xArgs = sobj.functionArgs;
                                        //panel.doLayout();
                                        break;
                                    case 'MinMaxUtilityArgs':
                                        //alert(combo.value);
                                        //TODO: see above
                                        if ((sobj.functionName != undefined) && (_this._xArgs != undefined))
                                            sobj.fCache[sobj.functionName] = _this._xArgs;
                                        sobj.functionName = 'linear';
                                        var mmArgs: pvMapper.MinMaxUtilityArgs;
                                        if (sobj.fCache[sobj.functionName] != undefined)
                                            mmArgs = sobj.fCache[sobj.functionName];
                                        else {
                                            mmArgs = new pvMapper.MinMaxUtilityArgs(10, 0, "degrees");
                                            mmArgs.metaInfo.vline = 5;
                                        }
                                        sobj.functionArgs = mmArgs;
                                        var utilityFn = pvMapper.UtilityFunctions[sobj.functionName];
                                        utilityFn.windowSetup.apply(utilityFn, [panel, sobj]);
                                        _this._scoreObj = sobj;
                                        _this.functionName = sobj.functionName;
                                        _this._xArgs = sobj.functionArgs;
                                        //_this._xArgs = new pvMapper.MinMaxUtilityArgs(10, 0, "degrees");
                                        //gridPanel.source = _this._xArgs;
                                        //panel.doLayout();
                                        break;
                                    case 'SinusoidalUtilityArgs':
                                        if ((sobj.functionName != undefined) && (_this._xArgs != undefined))
                                            sobj.fCache[sobj.functionName] = _this._xArgs;
                                        sobj.functionName = 'sinusoidal';
                                        var sArgs: pvMapper.SinusoidalUtilityArgs;
                                        if (sobj.fCache[sobj.functionName] != undefined)
                                            sArgs = sobj.fCache[sobj.functionName];
                                        else {
                                            sArgs = new pvMapper.SinusoidalUtilityArgs(0, 100, 50, 0.50, "degrees");
                                            sArgs.metaInfo.vline = 50;
                                        }
                                        sobj.functionArgs = sArgs;
                                        var utilityFn = pvMapper.UtilityFunctions[sobj.functionName];
                                        utilityFn.windowSetup.apply(utilityFn, [panel, sobj]);
                                        _this._scoreObj = sobj;
                                        _this.functionName = sobj.functionName;
                                        _this._xArgs = sobj.functionArgs;
                                        //ScoreUtilityWindows.basicWindow.setup(panel, sobj);
                                        //panel.doLayout();
                                        //TODO: see above
                                        break;
                                }
                            }
                        }
                    }
                });

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
                //panel.add({
                //    xtype: 'panel',
                //    width: 400,
                //    height: 425,
                //    layout: 'fit',
                //    //{
                //    //    align: 'center',
                //    //    pack: 'center',
                //    //    type: 'vbox'
                //    //},
                //    items: {
                //        id: 'FunctionBox',
                //        xtype: 'panel',
                //        border: true,
                //        bodyPadding: 5
                //    },
                //    listeners: {
                //        afterrender: function (sender, eOpts) {
                //            loadboard();
                //        }
                //    }
                //});

                var fpanel = Ext.create("Ext.panel.Panel", {
                    height: 225,
                    id: 'FunctionBox',
                    renderTo: Ext.getBody(),
                    listeners: {
                        afterrender: function (sender, eOpts) {
                            loadboard();
                        }
                    }
                });
                panel.add(fpanel);

                //_this._xArgs.metaInfo.comment = "This is a test of the comment area";
                var commentPanel = Ext.create("Ext.panel.Panel", {
                    height: 100,
                    width: '100%',
                    bodyPadding: 10,
                    renderTo: Ext.getBody(),
                    layout: {
                        type: 'hbox',
                        align: 'top'
                    },
                    items: [{
                        xtype: 'label',
                        forId: 'function_comment_id',
                        text: 'Comment: ',
                        margin: '0 0 0 10',
                    }, {
                            xtype: 'textareafield',
                            id: 'function_comment_id',
                            height: 80,
                            hideLabel: true,
                            value: _this._xArgs.metaInfo.comment,
                            flex: 1,
                            listeners: {
                                blur: function (ed, The, op) {
                                    _this._xArgs.metaInfo.comment = this.getValue();
                                }

                            }
                        }]
                });

                panel.id = 'FunctionUtilMainPanel';
                panel.add(commentPanel);
                panel.onBodyResize = function (w, h, ops) {
                    if (board) {
                        if (this.getWidth() != w)
                            this.setWidth(w);
                        if (this.getHeight() != h)
                            this.setHeight(h - 2);

                        h = h - gridPanel.getHeight() - commentPanel.getHeight() - 2;
                        var el = document.getElementById('FunctionBox');
                        el.style.height = h + 'px';

                        // To size window, the ticks stay the same size.  Same view, bigger canvas.
                        //var bbox = board.getBoundingBox();
                        //bbox[2] = w / board.constantUnitX;
                        //bbox[1] = h / board.constantUnitY;
                        //bbox[0] = -bbox[2] * 0.1;
                        //bbox[3] = -bbox[1] * 0.2;
                        //bbox[2] = bbox[2] + bbox[0];
                        //bbox[1] = bbox[1] + bbox[3];

                        // to size the ticks space based on the size of the window. -- a stretch effect.
                        var bbox = board.getBoundingBox();
                        board.unitX = w / (bbox[2] - bbox[0]);
                        board.unitY = h / (bbox[1] - bbox[3]);
                        board.resizeContainer(w, h, false);
                        board.setBoundingBox(bbox);
                        board.needFullUpdate = true;
                        board.fullUpdate();
                    }
                }
                panel.doLayout();
            },

            okhandler: function (panel, args: ScoreUtility) {
                args.functionArgs = this._xArgs;
                args.functionName = this.functionName;

            }
        }
    }

}
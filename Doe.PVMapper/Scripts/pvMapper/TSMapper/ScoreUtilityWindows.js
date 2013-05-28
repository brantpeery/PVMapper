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
                    viewConfig: {
                        deferEmptyText: false,
                        emptyText: // defaults to true
                        '<center><h3>No Editable Fields</h3></center>'
                    },
                    listeners: // can be passed to the grid itself or within a viewConfig object
                    {
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
                panel.add(gridPanel);
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
})(pvMapper || (pvMapper = {}));

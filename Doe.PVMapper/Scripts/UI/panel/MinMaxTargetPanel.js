Ext.require('MainApp.extras.DynamicLoader');

Ext.define('MainApp.panel.MinMaxTargetPanel', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'vbox',
        align: 'stretch',
        padding: 10
    },
    items: [{
        xtype: 'numberfield',
        value: '1',
        fieldLabel: "Min Value"
    }, {
        xtype: 'numberfield',
        value: '1',
        fieldLabel: "Max Value"
    }, {
        xtype: 'numberfield',
        value: '1',
        fieldLabel: "Target Value"
    }, {
        //padding: '10 0 0 0',
        id: 'FunctionBox',
        xtype: 'panel',
        layout: 'anchor',
        border: true,
        width: 200,
        height: 250
    }],
    listeners: {
        afterrender: {
            loadBoard

        }
    }

    
});

var board, f2;
function loadBoard() {
    board = JXG.JSXGraph.initBoard('FunctionBox-body', { boundingbox: [0, 1.05, 100, -.05], axis: true, showCopyright: false, showNavigation: false });
    f2 = board.create('functiongraph', [UtilityFunctions.utilityFunction1], { strokeWidth: 3, strokeColor: "red" });
};

function updateBoard() {
    var target = Ext.getCmp('function-target');
    f2.Y = (Ext.getCmp('function-mode').value == 'More is better') ? UtilityFunctions.utilityFunction1 : UtilityFunctions.utilityFunction2;

    if (target.maxValue - target.minValue != 0) {
        var diff = target.maxValue - target.minValue;
        board.setBoundingBox([target.minValue - diff * .1, 1.1, target.maxValue + diff * .1, -.1]);
        board.update();
    }
}
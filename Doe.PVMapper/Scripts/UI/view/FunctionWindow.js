
Ext.define('MainApp.view.FunctionWindow', {
  extend: 'MainApp.view.Window',
  title: 'Functions',
  height: 500,
  width: 400,
  floating: true,
  layout: 'fit',
  closeAction: 'destroy',
  draggable: true,
  renderTo: 'maincontent-body',
  constrainHeader: true,
  initComponent: function () {
    var me = this;
    me.items = [
    Ext.create('Ext.form.Panel', {
      bodyStyle: 'padding:5px 5px 0',
      renderTo: Ext.getBody(),
      defaultType: 'numberfield',
      defaults: {
        anchor: '100%'
      },
      fieldDefaults: { labelWidth: 70 },
      //#region MinValue
      items: [{
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        items: [{
          xtype: 'numberfield',
          fieldLabel: 'Target Min',
          minWidth: 70,
          maxWidth: 150,
          value: Math.floor(Math.random() * 11),
          flex: 1,
          id: 'target-MinValue',
          listeners: {
            change: function (me, newVal, oldVal, op) {
              var slider = Ext.getCmp('target-slider');
              var target = Ext.getCmp('function-target');
              slider.setMinValue(newVal);
              if (slider.value < newVal) {
                slider.setValue(newVal);
              }
              if (target.getValue() != slider.getValue()) {
                target.setValue(slider.getValue());

              }
              target.setMinValue(newVal);
              updateBoard();
            }
          }

        },
        //#endregion
      //#region Max Value
      {
        padding: '0 0 0 10',
        xtype: 'numberfield',
        fieldLabel: 'Target Max',
        minWidth: 70,
        maxWidth: 150,
        value: Math.floor(Math.random() * 91) + 10,
        flex: 1,
        id: 'target-MaxValue',
        listeners: {
          change: function (me, newVal, oldVal, op) {
            var slider = Ext.getCmp('target-slider');
            var target = Ext.getCmp('function-target');
            slider.setMaxValue(newVal);
            if (slider.value > newVal) {
              slider.setValue(newVal);
            }
            if (target.getValue() != slider.getValue()) {
              target.setValue(slider.getValue());
            }
            target.setMaxValue(newVal);
            updateBoard();
          }
        }

      }]
      },
      //#endregion
      //#region Increment
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        items: [
        {
          xtype: 'combo',
          editable: false,
          fieldLabel: 'Increment',
          flex: 2,
          minWidth: 70,
          maxWidth: 150,
          value: 1,
          id: 'target-Increment',
          mode: 'local',
          triggerAction: 'all',
          store: [0.0001, 0.001, 0.01, 0.1, 1, 2, 5],
          listeners: {
            change: function (me, newVal, oldVal, op) {
              var slider = Ext.getCmp('target-slider');
              var target = Ext.getCmp('function-target');
              slider.increment = newVal;
              switch (newVal) {
                case 0.0001: slider.decimalPrecision = 4; target.decimalPrecision = 4; break;
                case 0.001: slider.decimalPrecision = 3; target.decimalPrecision = 3; break;
                case 0.01: slider.decimalPrecision = 2; target.decimalPrecision = 2; break;
                case 0.1: slider.decimalPrecision = 1; target.decimalPrecision = 1; break;
                default: slider.decimalPrecision = 0; target.decimalPrecision = 0; break;
              }
            }
          }
        }]
      },
      //#endregion
      //#region function target
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        defaultType: 'numberfield',
        items: [{
          fieldLabel: 'Target',
          id: 'function-target',
          flex: 3,
          minWidth: 100,
          maxWidth: 150,
          value: 0,
          allowBlank: false,
          listeners: {
            change: function (me, newVal, oldVal, op) {
              Ext.getCmp('target-slider').setValue(newVal);
              if (board) board.update();
            }
          }
        },
        {
          id: 'target-slider',
          decimalPrecision: 0,
          xtype: 'slider',
          flex: 3,
          minValue: 0,
          maxValue: 100,
          increment: 1,
          listeners: {
            change: function (me, newval, thumb, op) {
              Ext.getCmp('function-target').setValue(newval);
              if (board) board.update();
            }
          }
        }]
      },
      //#endregion
      //#region  function slope
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        defaultType: 'numberfield',
        items: [{
          fieldLabel: 'Slope',
          decimalPrecision: 0,
          id: 'function-slope',
          flex: 4,
          minWidth: 100,
          maxWidth: 150,
          //value: Math.floor(Math.random() * 100),
          minValue: 1,
          maxValue: 100,
          allowBlank: false,
          listeners: {
            change: function (me, newVal, oldVal, op) {
              Ext.getCmp('slope-slider').setValue(newVal);
              if (board) board.update();
            }
          }

        },
        {
          xtype: 'slider',
          decimalPrecision: 0,
          id: 'slope-slider',
          flex: 4,
          minValue: 1,
          maxValue: 100,
          increment: 1,
          value: Math.floor(Math.random() * 100),
          listeners: {
            change: function (select, newval, thumb, op) {
              Ext.getCmp('function-slope').setValue(newval);
              if (board) board.update();
            }
          }
        }]
      },
      //#endregion
      //#region Fuction Mode
      {
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        items: [
        {
          xtype: 'combo',
          fieldLabel: 'Mode',
          flex: 2,
          minWidth: 70,
          maxWidth: 250,
          value: 'Less is better',
          id: 'function-mode',
          mode: 'local',
          triggerAction: 'all',
          store: ['Less is better', 'More is better'],
          listeners: {
            change: function (me, newVal, oldVal, op) {
              updateBoard();
            }
          }
        }]
      },
      //#endregion
      //#region Weight
      { //Weight panel
        xtype: 'panel',
        border: false,
        layout: {
          type: 'hbox',
          align: 'middle'
        },
        defaultType: 'numberfield',
        items: [{
          fieldLabel: 'Weights(%)',
          id: 'function-weight',
          flex: 5,
          minWidth: 100,
          maxWidth: 150,
          minValue: 0,
          maxValue: 100,
          value: Math.floor(Math.random() * 100),
          allowBlank: false,
          listeners: {
            change: function (me, newVal, oldVal, op) {
              Ext.getCmp('weight-slider').setValue(newVal);
            }
          }
        },
        {
          id: 'weight-slider',
          xtype: 'slider',
          flex: 5,
          minValue: 0,
          maxValue: 100,
          increment: 1,
          tipText: function (thumb) {
            return Ext.String.format('{0}%', thumb.value);
          },
          listeners: {
            change: function (select, newval, thumb, op) {
              Ext.getCmp('function-weight').setValue(newval);
            }
          }
        }]
      },
      //#endregion
      //#region Function Graph
      {
        xtype: 'panel',
        border: false,
        height: 10
      },
      {
        //padding: '10 0 0 0',
        id: 'FunctionBox',
        xtype: 'panel',
        layout: 'anchor',
        border: true,
        width: 200,
        height: 250
      }],
      //#endregion
      //#region Buttons
      buttons: [{
        xtype: 'button',
        text: 'OK',
        handler: function () {
          var tmpStr = me.title;
          var targetWeight = Ext.getCmp('function-weight').getValue();
          tmpStr = tmpStr.substring(0, tmpStr.indexOf('function') - 1).trim();
          var funcRec = funcStore.findRecord('functionName', tmpStr);
          var isNew = false;
          if (!funcRec) {
            funcRec = createUtilsRecord(tmpStr);
            isNew = true;
          }

          var target = Ext.getCmp('function-target');
          funcRec.data.minValue = Ext.getCmp('target-MinValue').getValue();
          funcRec.data.maxValue = Ext.getCmp('target-MaxValue').getValue();
          funcRec.data.slope = Ext.getCmp('function-slope').getValue();
          funcRec.data.weight = targetWeight;
          funcRec.data.target = Ext.getCmp('function-target').getValue();
          funcRec.data.increment = Ext.getCmp('target-Increment').getValue();
          funcRec.data.mode = Ext.getCmp('function-mode').getValue();
          funcRec.commit(false);
          funcRec.dirty = true;

          if (isNew)
            funcStore.insert(funcRec);

          funcStore.save();

          //Update the navMenu store data.
          var cNode = navMenu.getRootNode().findChildBy(function () {
            var toCh, nodeName = '';
            if (this.data.leaf) {
              toCh = this.data.text.indexOf('<') - 1;
              if (toCh <= 0) toCh = this.data.text.lenth - 1;
              nodeName = this.data.text.substring(0, toCh).trim();
            }
            return nodeName == tmpStr;
          }, null, true);
          if (cNode != null) {
            toCh = cNode.data.text.indexOf('<') - 1;
            nodeName = cNode.data.text.substring(0, toCh).trim();

            fromCh = cNode.data.text.indexOf('[') + 1;
            toCh = cNode.data.text.indexOf(']');
            var tStr = cNode.data.text.substring(0, fromCh) + targetWeight + cNode.data.text.substring(toCh, cNode.data.text.length);
            cNode.data.text = tStr;
          }
          sumWeights(tmpStr);

          var treeMenu = Ext.getCmp('ToolTree');
          treeMenu.setRootNode(navMenu.getRootNode());  // by resetting root node to the treepanel, forces it to reload and update view.

          pvMapper.functionWin.close();
        }
      },
      {
        xtype: 'button',
        text: 'Cancel',
        handler: function () {
          pvMapper.functionWin.close();
        }
      }]
      //#endregion
    }
  )], me.callParent(arguments);
  },
  showing: function (aTitle) {
    this.setTitle(aTitle + ' functions ');
    var funcRec = funcStore.findRecord('functionName', aTitle);
    if (funcRec != null) {
      var target = Ext.getCmp('function-target');
      Ext.getCmp('target-MinValue').setValue(funcRec.data.minValue);
      Ext.getCmp('target-MaxValue').setValue(funcRec.data.maxValue);
      Ext.getCmp('function-slope').setValue(funcRec.data.slope);
      Ext.getCmp('slope-slider').setValue(funcRec.data.slope);
      Ext.getCmp('function-weight').setValue(funcRec.data.weight);
      Ext.getCmp('weight-slider').setValue(funcRec.data.weight);
      Ext.getCmp('target-Increment').setValue(funcRec.data.increment);
      Ext.getCmp('function-mode').setValue(funcRec.data.mode);

      var tslider = Ext.getCmp('target-slider');
      tslider.setMinValue(funcRec.data.minValue);
      tslider.setMaxValue(funcRec.data.maxValue);
      tslider.increment = funcRec.data.increment;
      switch (tslider.increment) {
        case 0.0001: tslider.decimalPrecision = 4; target.decimalPrecision = 4; break;
        case 0.001: tslider.decimalPrecision = 3; target.decimalPrecision = 3; break;
        case 0.01: tslider.decimalPrecision = 2; target.decimalPrecision = 2; break;
        case 0.1: tslider.decimalPrecision = 1; target.decimalPrecision = 1; break;
        default: tslider.decimalPrecision = 0; target.decimalPrecision = 0; break;
      }
      tslider.setValue(funcRec.data.target);
      target.setValue(funcRec.data.target);
      target.setMinValue(funcRec.data.minValue);
      target.setMaxValue(funcRec.data.maxValue);

    }


    return this;
  }
});

Ext.require('MainApp.view.RatingView');

/*
 * Start FIX: Summary + Grouping. Without this fix there would be a summary row under each group
 * http://www.sencha.com/forum/showthread.php?135442-Ext.grid.feature.Summary-amp-amp-Ext.grid.feature.Grouping
 */
Ext.override(Ext.grid.feature.Summary, {
  closeRows: function () {
    return '</tpl>{[this.recursiveCall ? "" : this.printSummaryRow()]}';
  }
});
Ext.override(Ext.XTemplate, {
  recurse: function (values, reference) {
    this.recursiveCall = true;
    var returnValue = this.apply(reference ? values[reference] : values);
    this.recursiveCall = false;
    return returnValue;
  }
});
/*
 * End FIX: Summary + Grouping. Without this fix there would be a summary row under each group
 * http://www.sencha.com/forum/showthread.php?135442-Ext.grid.feature.Summary-amp-amp-Ext.grid.feature.Grouping
 */

var toolModel = Ext.define('Tools', {
  extend: 'Ext.data.Model',
  xtype: 'Tools',
  fields: [{
    name: 'title',
    type: 'string'
  }, {
    name: 'description',
    type: 'string'
  }, {
    name: 'category',
    type: 'string'
  }, {
    name: 'id',
    type: 'int'
  }, {
    name: 'weight',
    type: 'number'
  }, {
    name: 'utility',
    mapping: 'scoreUtility',
    type: 'object'
  }, {
    name: 'utilityFnName',
    convert: function (value, record) {
      var fnName = record.get('utility').functionName;
      return fnName;
    }
  }, {
    name: 'sites',
    mapping: 'scores',
    type: 'object'
  }],


  proxy: {
    type: 'memory',
    reader: {
      type: 'json',
      root: 'tools',
      idProperty: 'id'
    }
  }
});


var toolsStore = Ext.create('Ext.data.Store', {
  autoSync: true,
  autoLoad: true,
  model: 'Tools',
  data: pvMapper.mainScoreboard.getTableData(),
  groupField: 'category',
  groupDir: 'ASC'
});

var siteColumns = []; //Empty array for use below as a reference to what will be in the array eventually

var scoreboardColumns = [{
  text: 'Tool Name',
  minWidth: 150,
  //maxWidth: 100,
  flex: 1, //Will be resized
  //shrinkWrap: 1,
  sortable: true,
  hideable: false,
  dataIndex: 'title',
  renderer: function (value, metadata, record) {
    if (record.data.description) {
      metadata.tdAttr = 'data-qtip="' + record.data.description + '"';
    }
    return value;
  },
  //tooltip: '{description}',
  //editor: 'textfield', <-- don't edit this field - that would be silly
  summaryType: function (records) {
    //Note: this fails when we allow grouping by arbitrary fields (and it fails in mysterious ways)
    //return records[0].get('category') + " subtotal: <input type='button' img='http://localhost:53465/Images/Pie Chart.png' value='Pie' onClick='scoreboardColumns[0].viewPie(\"" + records[0].get('category') + "\");' />";
    if (records.length > 0) {
      //if (records.length == scoreboardGrid.store.data.length) {
      //  //this is the total of all category summary  .... HACK!!!!
      //  return '<hr><br /><b>Summary Minimum:<br />Summary Average :</b>';
      //} else {
        return records[0].get('category') +
          " (average): <input type='image' src='/Images/Pie Chart.png' width='16' height='16' alt='Pie Chart' title='Show weight pie chart' onClick='scoreboardGrid.viewPie(\"" +
          records[0].get('category') + "\",null);' />";
      //}
    }
    else
        return ' ';
  },
}, {
  header: 'Weight',
  //text: 'Weight',
  width: 45,
  //flex: 0, //Will not be resized
  //shrinkWrap: 1,
  sortable: true,
  hideable: false,
  dataIndex: 'weight',
  editor: {
    xtype: 'numberfield',
    maxValue: 100,
    minValue: 0,
    allowBlank: false,
    allowDecimals: false,
    allowExponential: false,
    allowOnlyWhitespace: false
  }
}, {
  xtype: 'actioncolumn',
  text: 'Options',
  width: 60,
  sortable: false,
  hideable: false,
  renderer: function (value, metadata, record) {
    //metadata.style = 'cursor: pointer;' // <-- this looks silly...
    var fn = record.get('utilityFnName');
    if (fn) { this.items[0].icon = pvMapper.UtilityFunctions[fn].iconURL; }

    //this.items[1].disabled = !( $.isFunction(record.raw.getStarRatables) );
  },
  items: [{
    icon: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/gear_icon.jpg',
    tooltip: "Edit score utility function",
    height: 24,
    width: 24,
    //renderer: function (value, metadata, record) {
    //    var fn = record.get('utilityFnName');
    //    if (fn) { this.icon = pvMapper.UtilityFunctions[fn].iconURL; }
    //    //return value;
    //},
    getClass: function (value, metadata, record, rowIndex, colIndex, store) {
      if (!(record.get('utility'))) {
        return "x-item-disabled";
      }
    },
    handler: function (view, rowIndex, colIndex, item, e, record) {
      var uf = record.get('utility');
      var utilityFn = pvMapper.UtilityFunctions[uf.functionName];

      dynamicPanel = Ext.create('Ext.panel.Panel', {
        items: [{
          xtype: 'text',
          text: 'configure me',
          width: 100,
          shrinkWrap: 3,
          sortable: true,
          hideable: false,
          layout: {
            type: 'vbox',
            align: 'center'
          }
        }]
      });

      var windows = Ext.create('MainApp.view.UtilityFunctionEdit', {
        items: dynamicPanel,
        icon: utilityFn.iconURL,
        minimizable: false,
        collapsible: false,
        plugins: [{
          ptype: "headericons",
          index: 2,
          headerButtons: [
              {
                xtype: 'button',
                iconCls: 'x-ux-grid-printer',
                width: 24,
                height: 15,
                //scope: this,
                handler: function () {
                  //var win = Ext.WindowManager.getActive();
                  //if (win) {
                  //  win.toggleMaximize();
                  //}
                  var style = ''; var link = '';
                  var printContent = document.getElementById(dynamicPanel.id + "-body"); //TODO: change to get the ID, rather than use 'magic' ID
                  var printWindow = window.open('', '', ''); // 'left=10, width=800, height=520');

                  var html = printContent.outerHTML; //TODO: must change to innerHTML ???
                  $("link").each(function () {
                    link += $(this)[0].outerHTML;
                  });
                  $("style").each(function () {
                    style += $(this)[0].outerHTML;
                  });

                  // var script = '<script> window.onmouseover = function(){window.close();}</script>';
                  printWindow.document.write('<!DOCTYPE html><html lang="en"><head><title>PV Mapper: ' + windows.title + '</title>' + link + style + ' </head><body>' + html + '</body>');
                  $('div', printWindow.document).each(function () {
                    if (($(this).css('overflow') == 'hidden') || ($(this).css('overflow') == 'auto')) {
                      $(this).css('overflow', 'visible');

                    }
                  });
                  printWindow.document.close();
                  printWindow.print();
                }
              }
          ]
        }],
        buttons: [{
          xtype: 'button',
          text: 'OK',
          handler: function () {
            //send the object (reference) to the function so it can change it

            //Call the setupwindow function with the context of the function it is setting up
            if (utilityFn.windowOk !== undefined)
              utilityFn.windowOk.apply(utilityFn, [dynamicPanel, uf]); //.functionArgs]);
            //Note: I really don't get this... it seems overly complicated.

            //record.store.update();  //Is there a reason for this
            record.raw.updateScores();
            windows.close();
          }
        }, {
          xtype: 'button',
          text: 'Cancel',
          handler: function () {
            windows.close();
          }
        }],
        listeners: {
          beforerender: function () {
            utilityFn.windowSetup.apply(utilityFn, [dynamicPanel, uf]); // uf.functionArgs, utilityFn.fn, utilityFn.xBounds]);
            //TODO: can't we just pass uf here, in place of all this other crap?
            dynamicPanel.doLayout();
          }
        }

      }).show();
    }
  }, {
    icon: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/star_icon.jpg',
    tooltip: "Give star ratings to categories",
    height: 24,
    width: 24,
    getClass: function (value, metadata, record, rowIndex, colIndex, store) {
      if (typeof record.raw.getStarRatables !== "function") {
        return "x-item-disabled";
      }
    },
    handler: function (view, rowIndex, colIndex, item, e, record) {
      if (typeof record.raw.getStarRatables === "function") {
        pvMapper.showRatingWindow(
            record.raw.getStarRatables(),
            function () {
              // recalculate all scores
              //TODO: this is hideous... isn't there a better way?
              for (i = 0; i < record.raw.scores.length; i++) {
                record.raw.onSiteChange(undefined, record.raw.scores[i]);
                //record.raw.scores.forEach(updateScore);
              }
            },
            record.get('title') + " Categories"
        );
      }
    }
  }, {
    icon: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/gear_icon.jpg',
    tooltip: "Configure score tool",
    height: 24,
    width: 24,
    getClass: function (value, metadata, record, rowIndex, colIndex, store) {
      if (typeof record.raw.showConfigWindow !== "function") {
        return "x-item-disabled";
      }
    },
    handler: function (view, rowIndex, colIndex, item, e, record) {
      if (typeof record.raw.showConfigWindow === "function") {
        record.raw.showConfigWindow();
      }
    }
  }]
}, {
  text: undefined,
  sealed: true,
  menuText: "Sites",
  //defaults: {
  //    flex: 1, //Will stretch with the size of the window
  //    width: 100
  //},
  columns: siteColumns
}];


//Use this store to maintain the panel list of sites
toolsStore.on({
  load: function () {
    siteColumns.length = 0; //Empty the array
    var rec0 = this.first();
    rec0.get('sites').forEach(function (scoreLine, idx) {
      siteColumns.push({
        text: scoreLine.site.name,
        sealed: true,
        //flex: 1, //Will stretch with the size of the window
        //width: 100,
        defaults: {
          //flex: 1, //Will stretch with the size of the window
          //width: 50,
          sortable: true
        },
        columns: [{
          text: "Value",
          dataIndex: "sites",
          //flex: 1, //Will stretch with the size of the window
          //minWidth: 50,
          width: 120,
          renderer: function (value, metaData) {
            if (value.length <= idx) return '<i>Calculating...</i>'; //Avoid the index out of range error

            //if (typeof value[idx].utility !== "undefined" && !isNaN(value[idx].utility)) {
            //    metaData.style = "background-color:" + getColor(value[idx].utility);
            //}

            if (value[idx].popupMessage && value[idx].popupMessage.trim().length > 0) {
              metaData.tdAttr = 'data-qtip="' + value[idx].popupMessage + '"';
            }

            //TODO: hack hack hack... it's a hack
            if (value[idx].toString !== Object.prototype.toString) {
              if (typeof value[idx].value !== "undefined" && !isNaN(value[idx].value)) {
                return value[idx].toString();
              } else {
                // italicise on error
                return '<i>' + value[idx].toString() + '</i>';
              }
            } else {
              //TODO: hack hack hack... remove this (if we migrate to a dual scoreboard doodle)
              if (value[idx].popupMessage)
                return value[idx].popupMessage;
              return "";
            }
          },
          draggable: false
        }, {
          text: "Score",
          dataIndex: "sites",
          //flex: 1, //Will stretch with the size of the window
          //maxWidth: 500,
          width: 40,
          renderer: function (value, metaData) {
            if (value.length <= idx) return '...'; //Avoid the index out of range error
            if (isNaN(value[idx].utility)) return '...';

            var val = (value[idx] && value[idx].utility) ? value[idx].utility : 0;
            var c = pvMapper.getColorForScore(val);
            metaData.style = "text-align: center; border-radius: 5px; background-color:" + c;

            return value[idx].utility.toFixed(0);
          },
          draggable: false,

          summaryType: function (records) {
              var total = 0;
              var count = 0;
            //var count = 0, minimum = 9999, val = 0;
            

            records.forEach(function (record) {
              var scoreLine = record.raw;
                if (scoreLine.scores[idx] && !isNaN(scoreLine.scores[idx].utility)) {
                  var weight = (scoreLine.weight != undefined) ? scoreLine.weight : 1;
                  val = scoreLine.scores[idx].utility * weight;
                  total += val;
                  count += weight;
                //if (val > 0)
                  //  minimum = (minimum > val) ? val : minimum;
                }
            });

            var average = total / count;

            //Note: moved this, as the summary renderer now only calculates the score over groups, rather than for all score tools
            //// post the average score to the feature, so that it can render correctly on the map
            ////TODO: is this really the best place to be mucking about with the feature attributes?
            //if (records && records.length > 0 && records[0].raw &&
            //    records[0].raw.scores && records[0].raw.scores.length > idx &&
            //    records[0].raw.scores[idx].site && records[0].raw.scores[idx].site.feature) {
            //  // test if the feature's average score value has changed
            //  var feature = records[0].raw.scores[idx].site.feature;
            //  //if (feature.attributes['overallScore'] !== average) {
            //  if (feature.attributes.overallScore !== average) {
            //    feature.attributes.overallScore = average;
            //    // set the score's color as an attribute on the feature (note - this is at least partly a hack...)
            //    feature.attributes.fillColor = (!isNaN(average)) ? getColor(average) : "";
            //    // redraw the feature
            //    if (feature.layer) {
            //        feature.layer.drawFeature(feature);
            //    }
            //  }
            //}

            //if (records.length == scoreboardGrid.store.data.length) {
            //  //this is the total summary line -- only time it pass the entire store records.
            //  var avgC = getColor(average);
            //  var avgM = getColor(minimum);
            //  return '<hr><span style="border-radius: 3px;font-weight:bold; background-color:' + avgM + '">&nbsp' + minimum.toFixed(0) + '&nbsp</span>' +
            //         '<br /> <span style="border-radius: 3px;font-weight:bold; background-color:' + avgC + '">&nbsp' + average.toFixed(0) + '&nbsp</span>'
            //} else 
              return average;
          },
          summaryRenderer: function (value, summaryRowValues) {
            if (typeof value === "number" && !isNaN(value)) {
              var c = pvMapper.getColorForScore(value);
              return '<span style="border-radius: 3px; background-color:' + c + '">&nbsp' + value.toFixed(0) + '&nbsp</span>'
              //+ "<input type='image' src='/Images/Pie Chart.png' width='16' height='16' alt='Pie Chart' title='Show weight pie chart' onClick='scoreboardGrid.viewPie(\"" +
              //  scoreLine.Category + "\",\""+ scoreline.site.name +"\");' />";
            }
            else return '';
          },

        },
        ]
      });
    });

    //Now update the sites section of the grid
    scoreboardGrid.reconfigure(this, scoreboardColumns);
  }

});

/***
override the groupsummary class to display both grouping summary and summary.  
***/
//Ext.define('MainApp.view.GroupingSummaryWithTotal', {
//  extend: 'Ext.grid.feature.GroupingSummary',
//  alias: 'groupingsummarytotal',
//  getTableFragments: function () {
//    return {
//      closeRows: this.closeRows
//    };
//  },
//  closeRows: function () {
//    return '</tpl>{[this.recursiveCall ? "" : this.printTotalRow()]}';
//  },
//  getFragmentTpl: function () {
//    var me = this,
//      fragments = me.callParent();
//    me.totalData = this.generateTotalData();
//    Ext.apply(fragments, {
//      printTotalRow: Ext.bind(this.printTotalRow, this)
//    });
//    Ext.apply(fragments, {
//      recurse: function (values, reference) {
//        this.recursiveCall = true;
//        var returnValue = this.apply(reference ? values[reference] : values);
//        this.recursiveCall = false;
//        return returnValue;
//      }
//    });
//    return fragments;
//  },
//  printTotalRow: function () {
//    var inner = this.view.getTableChunker().metaRowTpl.join(''),
//      prefix = Ext.baseCSSPrefix;
//    inner = inner.replace(prefix + 'grid-row', prefix + 'grid-row-summary');
//    inner = inner.replace('{{id}}', '{gridSummaryValue}');
//    inner = inner.replace(this.nestedIdRe, '{id$1}');
//    inner = inner.replace('{[this.embedRowCls()]}', '{rowCls}');
//    inner = inner.replace('{[this.embedRowAttr()]}', '{rowAttr}');
//    inner = Ext.create('Ext.XTemplate', inner, {
//      firstOrLastCls: Ext.view.TableChunker.firstOrLastCls
//    });
//    return inner.applyTemplate({
//      columns: this.getTotalData()
//    });
//  },
//  getTotalData: function () {
//    var me = this,
//      columns = me.view.headerCt.getColumnsForTpl(),
//      i = 0,
//      length = columns.length,
//      data = [],
//      active = me.totalData,
//      column;
//    for (; i < length; ++i) {
//      column = columns[i];
//      column.gridSummaryValue = this.getColumnValue(column, active);
//      data.push(column);
//    }
//    return data;
//  },
//  generateTotalData: function () {
//    var me = this,
//      data = {},
//      store = me.view.store,
//      columns = me.view.headerCt.getColumnsForTpl(),
//      i = 0,
//      length = columns.length,
//      fieldData,
//      key,
//      comp;
//    for (i = 0, length = columns.length; i < length; ++i) {
//      comp = Ext.getCmp(columns[i].id);
//      data[comp.id] = me.getSummary(store, comp.summaryType, comp.dataIndex, false);
//    }
//    return data;
//  }
//});

// plugin for cell editing (Weight value)
Ext.define('MainApp.view.ScoreWeightEditing', {
  extend: 'Ext.grid.plugin.CellEditing',
  clicksToEdit: 1,
  listeners: {
    edit: function (editor, e, eOpts) {
      e.record.raw.setWeight(e.record.data['weight']);
    }
  }
});


//----------------The grid and window-----------------
Ext.define('Ext.grid.ScoreboardGrid', {
    //xtype:'Scoreboard',
    extend: 'Ext.grid.Panel',
    store: toolsStore,
    //forceFit: true,
    //width: '100%',
    //height: 600,
    //title: "Tools List",
    columns: scoreboardColumns,
    selModel: {
        selType: 'cellmodel', //'rowmodel', //Note: use 'cellmodel' once we have cell editing worked out
    },
    plugins: [Ext.create('MainApp.view.ScoreWeightEditing')],
    features: [
        //Ext.create('MainApp.view.GroupingSummaryWithTotal', {
        //  groupHeaderTpl: '{name} ({rows.length} {[values.rows.length != 1 ? "Tools" : "Tool"]})',
        //  summaryType: 'average',
        //})
        {
            //Note: this feature provides per-group summary values, rather than repeating the global summary for each group.
            groupHeaderTpl: '{name} ({rows.length} {[values.rows.length != 1 ? "Tools" : "Tool"]})',
            ftype: 'groupingsummary',
            enableGroupingMenu: false,
            //hideGroupedHeader: true, <-- this is handy, if we ever allow grouping by arbitrary fields
            //onGroupClick: function(view, group, idx, foo, e) {}
        },
        //{ ftype: 'grouping' },
        //{
        //  ftype: 'summary',
        //  dock: 'bottom'
        //},
    ],

    listeners: {
        afterlayout: function (sender, eOpts) {
            var gridViewId = $('#' + this.getId() + ' .x-grid-view').attr('id');

            var $totalsHeader = $('#' + gridViewId + '-hd-Totals');
            var $totalsRow = $('#' + gridViewId + '-bd-Totals');
            var $totalsNext = $totalsRow.next();

            // if the totals aren't at the bottom of their parent container...
            if ($totalsNext.length) {

                if (!$totalsNext.attr('class').indexOf('x-grid-row-summary') >= 0) {
                    // remove the unnecessary and needless row summary for the totals group
                    $totalsNext.hide();
                }

                // move the totals to the bottom of their parent container
                $totalsHeader.appendTo($totalsHeader.parent());
                $totalsRow.appendTo($totalsHeader.parent());
            }
        }
    },

    viewPie: function (cat, site) {

        var records = scoreboardGrid.store.getGroups(cat);
        if (records.children.length > 0) {
            pieStore.removeAll(); //delete all records in the score
            records.children.forEach(function (record, index, array) {
                pieStore.add({ Category: record.get('title'), Data: record.get('weight'), Color: "blue" });
            });
        }

        var pieWin = Ext.create('MainApp.view.PieWindow', {
            dataStore: pieStore,
            dataField: 'Data',
            dataName: 'Category',
            fillColor: 'Color',
            title: 'Weight Percentage - ' + cat,
            buttons: [{
                xtype: 'button',
                text: 'OK',
                handler: function () {
                    //TODO: execute update function here.


                    pieWin.close();
                }
            },
            ]
        }).show();

    },

});

var scoreboardGrid = Ext.create('Ext.grid.ScoreboardGrid', {
});

//define a plugin to use to insert a button onto the window panel's header area.
Ext.define('MainApp.view.ExtraIcons', {
  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.headericons',
  alternateClassName: 'MainApp.view.PanelHeaderExtraIcons',
  iconCls: '',
  index: undefined,
  headerButtons: [],
  init: function (panel) {
    this.panel = panel;
    this.callParent();
    panel.on('render', this.onAddIcons, this, { single: true });
  },
  onAddIcons: function () {
    if (this.panel.getHeader) {
      this.header = this.panel.getHeader();
    } else if (this.panel.getOwnerHeaderCt) {
      this.header = this.panel.getOwnerHeaderCt();
    }
    this.header.insert(this.index || this.header.items.length, this.headerButtons);
  }
});


Ext.define('MainApp.view.ScoreboardWindow', {
  extend: "MainApp.view.Window",
  id: "ScoreboardWindowID",
  title: 'Main Scoreboard',
  width: 800,
  height: 725,
  //cls: "propertyBoard", <-- this looked hokey, and conflicted with ext js's default styling.
  closeAction: 'hide',
  plugins: [{
    ptype: "headericons",
    index: 1,
    headerButtons: [
        {
          xtype: 'button',
          iconCls: 'x-ux-grid-printer',
          width: 24,
          height: 15,
          //scope: this,
          handler: function () {
            //var win = Ext.WindowManager.getActive();
            //if (win) {
            //  win.toggleMaximize();
            //}
            var style = ''; var link = '';
            var printContent = document.getElementById("ScoreboardWindowID-body"); //TODO: change to get the ID, rather than use 'magic' ID
            var printWindow = window.open('', '', ''); // 'left=10, width=800, height=520');

            var html = printContent.outerHTML; //TODO: must change to innerHTML ???
            $("link").each(function () {
              link += $(this)[0].outerHTML;
            });
            $("style").each(function () {
              style += $(this)[0].outerHTML;
            });

            // var script = '<script> window.onmouseover = function(){window.close();}</script>';
            printWindow.document.write('<!DOCTYPE html><html lang="en"><head><title>PV Mapper Scoreboard</title>' + link + style + ' </head><body>' + html + '</body>');
            $('div', printWindow.document).each(function () {
              if (($(this).css('overflow') == 'hidden') || ($(this).css('overflow') == 'auto')) {
                $(this).css('overflow', 'visible');

              }
            });
            //-- if we want to control auto sizing.
            //$('.x-panel, .x-grid-header-ct', printWindow.document).css('overflow', 'visible');
            //$('.x-window-body,.x-panel, .x-grid-header-ct', printWindow.document).width('inherit');
            //$('.x-panel, .x-grid-header-ct', printWindow.document).height('auto');
            //$('.x-window-body', printWindow.document).height('inherit');
            //$('.x-box-inner', printWindow.document).css('overflow','visible');
            //$('.x-box-inner', printWindow.document).width('inherit');
            //$('.x-box-inner', printWindow.document).height('inherit');

            //$('.x-panel-body,.x-grid-body,.x-grid-view', printWindow.document).css('overflow','visible');
            //$('.x-panel-body,.x-grid-view', printWindow.document).width('inherit');
            //$('.x-panel-body,.x-grid-view', printWindow.document).height('auto');
            //--

            printWindow.document.close();
            printWindow.print();

            //printWindow.close();'
          }
        }
    ]
  }],
  items: scoreboardGrid,
  constrain: true
});


//toolsStore.load(pvMapper.mainScoreboard.getTableData()); //Load the data to the panel

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

// This fix stops tooltips from disappearing after a short time - instead they will persist during hover.
Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.apply(Ext.QuickTips.getQuickTip(), {
        dismissDelay: 0
        //showDelay: 100
    });
});

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
        if (records.length > 0) {
            return records[0].get('category') +
//If we ever need pie view again, uncomment this line and comment the next line.
//              " (average): <input type='image' src='/Images/Pie Chart.png' width='16' height='16' alt='Pie Chart' title='Show weight pie chart' onClick='scoreboardGrid.viewPie(\"" + records[0].get('category') + "\",0);' />";
              " (average): ";

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
                        record.raw.saveConfiguration();  //save scoreline configuration to local database.
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
                  beforerender: function (win, op) {
                    var w = win.width;
                    if (typeof(w) == 'undefined' || (w < 400))  {
                      win.setWidth(400);
                      win.center();
                    }
                     utilityFn.windowSetup.apply(utilityFn, [dynamicPanel, uf]); // uf.functionArgs, utilityFn.fn, utilityFn.xBounds]);
                    //TODO: can't we just pass uf here, in place of all this other crap?
                  },
                    resize: function (win, width, height, opts) {
                      if (dynamicPanel.onBodyResize != undefined)
                        width = this.getContentTarget().getWidth();
                        height = this.getContentTarget().getHeight();
                        dynamicPanel.onBodyResize(width, height, opts);
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
                        record.raw.saveConfiguration();
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
    columns: siteColumns
}];

//this is for the grid.column header context menu.
function showHeaderCTMenu(xy, site) {
    var siteName = ((site === undefined) || (site === null)) ? "this site" : "site: " + site.name;
    var headerCtContext = Ext.create("Ext.menu.Menu", {
        items: [Ext.create("Ext.menu.Item",{
            text: "Zoom to " + siteName,
            iconCls: "x-zoomin-menu-icon",
            handler: function () {
                pvMapper.map.zoomToExtent(site.geometry.bounds, false);
            }
        }), Ext.create("Ext.menu.Item",{
            text: "Zoom to project",
            iconCls: "x-zoomout-menu-icon",
            handler: function () {
                pvMapper.map.zoomToExtent(pvMapper.siteLayer.getDataExtent(), false);
            }
        }),
        Ext.create("Ext.menu.Separator",{
        }),
        Ext.create("Ext.menu.Item",{
            text: "Delete " + siteName,
            iconCls: "x-delete-menu-icon",
            handler: function () {
                Ext.MessageBox.confirm("Delete " + siteName, "Deleting a site is permenant, are you sure?", function (btn) {
                    if (btn === "yes") {
                        pvMapper.deleteSite(site.id);
                        pvMapper.siteManager.removeSite(site);
                        var feature = pvMapper.siteLayer.features.find(
                           function (a) {
                               if (a.attributes.name === site.name) return true;
                               else return false;
                           });
                        pvMapper.siteLayer.removeFeatures([feature], { silent: true });
                    }
                });
            }
        })

        ]
    });
    headerCtContext.showAt(xy);
}
//Use this store to maintain the panel list of sites
toolsStore.on({
    load: function () {
        siteColumns.length = 0; //Empty the array
        var rec0 = this.first();
        rec0.get('sites').forEach(function (scoreLine, idx) {
            var siteColumn = {
                id: scoreLine.site.name,
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
                    draggable: false,

                    summaryType: function (records) {
                        return "<div style='text-align: right;'>" +
                            "<input type='image' src='/Images/Pie Chart.png' width='16' height='16' alt='Pie Chart' title='Show pie chart' onClick='pvMapper.scoreboardGrid.viewPie(\"" +
                             records[0].get('category') + "\"," + idx.toString() + ");' /></div>";
                    },
                    //summaryRenderer: function (value, summaryRowValues) {
                    //    return value;
                    //}
                }, {
                    text: "Score",
                    dataIndex: "sites",
                    //flex: 1, //Will stretch with the size of the window
                    //maxWidth: 500,
                    width: 40,
                    renderer: function (value, metaData) {
                        if (value.length <= idx) return '...'; //Avoid the index out of range error
                        if (typeof value[idx].utility !== "number" || isNaN(value[idx].utility)) return '...';

                        var val = (value[idx] && value[idx].utility) ? value[idx].utility : 0;
                        var c = pvMapper.getColorForScore(val);
                        metaData.style = "text-align: center; border-radius: 5px; background-color:" + c;

                        return value[idx].utility.toFixed(0);
                    },
                    draggable: false,

                    summaryType: function (records) {
                        var total = 0;
                        var count = 0;

                        records.forEach(function (record) {
                            var scoreLine = record.raw;
                            if (scoreLine.scores[idx] && typeof scoreLine.scores[idx].utility === "number" && !isNaN(scoreLine.scores[idx].utility)) {
                                var weight = (scoreLine.weight != undefined) ? scoreLine.weight : 1;
                                val = scoreLine.scores[idx].utility * weight;
                                total += val;
                                count += weight;
                            }
                        });

                        var average = total / count;

                        return average;
                    },
                    summaryRenderer: function (value, summaryRowValues) {
                        if (typeof value === "number" && !isNaN(value)) {
                            var c = pvMapper.getColorForScore(value);
                            return '<span style="border-radius: 3px; background-color:' + c + '">&nbsp' + value.toFixed(0) + '&nbsp</span>'
                        }
                        else return '';
                    },

                }]
            };
            siteColumns.push(siteColumn);
        });

        //Now update the sites section of the grid
        pvMapper.scoreboardGrid.reconfigure(this, scoreboardColumns);

        //The columns has been configured, Els for each column is now available.  
        //We can attach conttext menu to the header.
        var rec0 = this.first();
        rec0.get('sites').forEach(function (scoreLine, idx) {
            var col = Ext.getCmp(scoreLine.site.name);
            if (col) {
                var el = col.getEl();
                if (el) {
                    el.on({
                        'contextmenu': function (e, col, opt) {
                            e.stopEvent();
                            showHeaderCTMenu(e.getXY(), scoreLine.site);
                            return false;
                        },
                        scope: this
                    });
                }
            }
        });
    }

});
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



function removeCustomModule(moduleName) {
    var module = pvMapper.customModules.find(function (a) {
        if (a.fileName === moduleName) return true;
        else return false;
    });
    if (module) {
        //remove the module from the local database
        pvMapper.ClientDB.deleteCustomKML(module.fileName, function (isSuccessful) {
            if (isSuccessful) {
                //remove it from the custom module list.
                var idx = pvMapper.customModules.indexOf(module);
                pvMapper.customModules.splice(idx, 1);
                //now remove the scoreline.
                var scoreline = pvMapper.mainScoreboard.scoreLines.find(function (a) {
                    if (a.getModuleName !== undefined) {
                        if (a.getModuleName() === module.fileName) return true;
                        else return false;
                    }
                    else return false;
                });
                if (scoreline) {
                    idx = pvMapper.mainScoreboard.scoreLines.indexOf(scoreline);
                    if (idx >= 0) pvMapper.mainScoreboard.scoreLines.splice(idx, 1);
                    //finally then free the module.
                    delete scoreline;
                }
                if (module.moduleObject.removeLocalLayer !== undefined)
                    module.moduleObject.removeLocalLayer();  //remove the custom module layer from map.
                delete module;
                pvMapper.mainScoreboard.update();
            }
        });
    }
}

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
    viewConfig: {
        stripeRows: true,
        listeners: {

            itemcontextmenu: function (view, rec, node, idx, e) {
                if (rec.raw.getModuleName === undefined) {
                    return true;
                } else {
                    e.stopEvent();
                    var moduleName = rec.raw.getModuleName();
                    var titleName = moduleName;
                    if (rec.raw.getTitle !== undefined)
                        titleName = rec.raw.getTitle();
                    var cellContextMenu = Ext.create("Ext.menu.Menu", {
                        items: [{
                            text: "Remove Custom Module: '" + titleName+"'",
                            iconCls: "x-delete-menu-icon",
                            handler: function () {
                                
                                Ext.MessageBox.confirm("Removing '"+titleName+"("+moduleName+")'", "Are you sure you want to remove this module?", function (btn) {
                                    if (btn === "yes") {
                                        //this function is defined in MainToolbar file.
                                        removeCustomModule(moduleName);
                                    }
                                });
                            }
                        }]

                    });
                    cellContextMenu.showAt(e.getXY());
                    return false;
                }
            }
        }
    },
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

        var pieColor = '';
        var records = pvMapper.scoreboardGrid.store.getGroups(cat);
        if ((records.children.length <= 0) || (site == null)) {
            Ext.MessageBox.alert("Empty!", "There is no data in this group.");
            return;
        }
        var sitename = records.children[0].raw.scores[site].site.name;
        //pieStore.removeAll();
        //records.children.forEach(function (record, index, array) {
        //    var val = record.raw.scores[site].utility;
        //    if (isNaN(val))
        //        pieColor = 'white';
        //    else
        //        pieColor = pvMapper.getColorForScore(val);
        //    pieStore.add({Title: record.get('title'), Data: record.get('weight'), Color: pieColor });
        //});

        var pieWin = Ext.create('MainApp.view.PieWindow', {
            //dataStore: pieStore,
            scoreBoardStore: pvMapper.scoreboardGrid.store,
            siteName: sitename,
            groupName: cat,
            title: 'Weighted Percentage - ' + cat + ' : ' + siteColumns[site].text,
            buttons: [{
                xtype: 'button',
                text: 'Close',
                handler: function () {
                    //TODO: execute update function here.


                    pieWin.close();
                }
            }],
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
                            var printContent = document.getElementById(pieWin.body.id); //TODO: change to get the ID, rather than use 'magic' ID
                            var printWindow = window.open('', '', ''); // 'left=10, width=800, height=520');

                            var html = printContent.outerHTML; //TODO: must change to innerHTML ???
                            $("link").each(function () {
                                link += $(this)[0].outerHTML;
                            });
                            $("style").each(function () {
                                style += $(this)[0].outerHTML;
                            });

                            // var script = '<script> window.onmouseover = function(){window.close();}</script>';
                            printWindow.document.write('<!DOCTYPE html><html lang="en"><head><title>PV Mapper: ' + pieWin.title + '</title>' + link + style + ' </head><body>' + html + '</body>');
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
            }]
        }).show();

    },

});

pvMapper.scoreboardGrid = Ext.create('Ext.grid.ScoreboardGrid', {
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
    height: 600,
    maximizable: true,
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
                    printWindow.document.close();
                    printWindow.print();

                }
            }
        ]
    }],
    items: pvMapper.scoreboardGrid,
    constrain:true

});


//toolsStore.load(pvMapper.mainScoreboard.getTableData()); //Load the data to the panel

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
        type: 'string'
    }, {
        name: 'weight',
        type: 'number',
        //convert: null
    }, {
        name: 'utility',
        mapping: 'scoreUtility',
        type: 'object',
        //convert: null
    }, {
        name: 'sites',
        mapping: 'scores',
        type: 'auto', // an array...
        //convert: null
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
    sorters: [{ property: 'title', direction: 'ASC' }], // default sort
    groupField: 'category',
    groupDir: 'ASC'
});

var siteColumns = []; //Empty array for use below as a reference to what will be in the array eventually


var scoreboardColumns = [{
    minWidth: 150,

    text: 'Tool Name',    // Add the new "Add new Tool" href link

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

    editor: {
        xtype: 'textfield',
        allowBlank: false,
        allowDecimals: false,
        allowExponential: false,
        allowOnlyWhitespace: false
    },
    //tooltip: '{description}',
    //editor: 'textfield', <-- don't edit this field - that would be silly
    summaryType: function (records) {
        if (records.length > 0) {
            return records[0].get('category') + " (average): ";
        } else {
            return ' ';
        }
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
    renderer: function (value, metadata, record) {
        if (record.raw && typeof (record.raw.weight) === "undefined") {
            return ''; // if the source object's weight is undefined, show a blank here (instead of the autoconverted 0)
        }
        if (record.data.weight && pvMapper.mainScoreboard.scoreLines_weightTotal) {
            var ratio = record.data.weight / pvMapper.mainScoreboard.scoreLines_weightTotal * 100;
            var popup = ratio.toFixed(1) + "% of total weight";
            metadata.tdAttr = 'data-qtip="' + popup + '"';
        }
        return value;
    },
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
        var fn = record.get('utility').functionName;
        if (fn) { this.items[0].icon = pvMapper.UtilityFunctions[fn].iconURL; }
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
            if (uf) {
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
                    title: "Tool Scoring Editor - " + record.data.title + " tool",
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
                                    var printWindow = window.open('', '_blank');

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
                                    //printWindow.print();     //this doesn't support across all browsers, so just show it, user can print manually.
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
                            record.raw.applyUtilityFunctionToAllScores();
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
                            if (typeof (w) == 'undefined' || (w < 400)) {
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

// gets the score object from the given array of scores which matches the given site (using idx as a hint to its position in the array)
function getScoreForSite(scores, site, idx, suppressWarnings) {
    var score = (scores.length > idx) && scores[idx]; // <-- attempt to shortcut the full ID search
    if (!score || (score.site && score.site.id !== site.id)) {
        // try to find this score the hard way... (may be time consuming for our supported edge case of using many sites)
        var filteredScores = scores.filter(function (s) { return s.site.id === site.id; });

        score = filteredScores.length && filteredScores[0];

        // perform some logging etc.
        if (console && console.warn && !suppressWarnings) console.warn("Warning: score for site ID='" + site.id + (score ?
            "' missing from score line." : "' misaligned in score line ID='" + (score.scoreLine && score.scoreLine.id) + "'"));

        if (console && console.assert) console.assert(filteredScores.length <= 1,
            "Warning: score line holds duplicate scores for site ID='" + site.id + "'");
    }
    return score;
}

//this is for the grid.column header context menu.
function showHeaderCTMenu(xy, site) {
    if (console && console.assert) console.assert(!!site, "Warning: couldn't find site for header context menu.");
    var headerCtContext = Ext.create("Ext.menu.Menu", {
        items: [Ext.create("Ext.menu.Item", {
            text: "Zoom to " + site.name,
            iconCls: "x-zoomin-menu-icon",
            handler: function () {
                pvMapper.map.zoomToExtent(site.geometry.bounds, false);
            }
        }), Ext.create("Ext.menu.Item", {
            text: "Zoom to project",
            iconCls: "x-zoomout-menu-icon",
            handler: function () {
                pvMapper.map.zoomToExtent(pvMapper.siteLayer.getDataExtent(), false);
            }
        }),
        Ext.create("Ext.menu.Separator", {
        }),
        Ext.create("Ext.menu.Item", {
            text: "Delete " + site.name,
            iconCls: "x-delete-menu-icon",
            handler: function () {
                Ext.MessageBox.confirm('Confirm', "Are you sure you want to delete site '" + site.name + "'?", function (btn) {
                    if (btn === "yes") {
                        // unselect all features first (at present, this causes a PUT to the database if a feature was selected)
                        // if this isn't done, there will be artifacts left on the map after deleting the selected site(s).
                        // Note that this also removes any sketch features from the feature layer (ie, siteLayer.features.length may decrease !)
                        pvMapper.unselectAllSites();

                        pvMapper.deleteSite(site.id)
                            .done(function () {
                                pvMapper.siteManager.removeSite(site);
                                pvMapper.siteLayer.removeFeatures([site.feature], { silent: true });
                                site.feature.destroy();
                            })
                            .fail(function () {
                                if (console && console.log) console.log('failed to delete site "' + site.name + '" with id "' + site.id + '"');
                            });
                    }
                });
            }
        })

        ]
    });
    headerCtContext.showAt(xy);
}
//Use this store to maintain the panel list of sites
//toolsStore.on({
//    load: function (theStore, records, successful, eOpts) {
pvMapper.generateMainScoreboardColumns = function () {
        siteColumns.length = 0; //Empty the array
        pvMapper.siteManager.getSites().forEach(function (site, idx) {
            var siteColumn = {
                id: site.id,
                text: site.name,
                raw: site,
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
                    renderer: function (scores, metaData) {
                        // fetch the score object for this site (and in this score line), using idx as a hint to its position in the scores array
                        var score = getScoreForSite(scores, site, idx, true);

                        // check if the score object represents an error, and style accordingly
                        if (!score || typeof score.utility !== "number" || !isFinite(score.utility) || score.isValueOld) {
                            metaData.style = "font-style: italic;"; // italics represent messages without a value (ie, error messages, etc)
                        }

                        // if we haven't found the score object, return this default value
                        if (!score) return 'No value';

                        //if (typeof scores[idx].utility !== "undefined" && !isNaN(scores[idx].utility)) {
                        //    metaData.style = "background-color:" + getColor(scores[idx].utility);
                        //}

                        // handle the popup message, if there is one
                        if (score.popupMessage && score.popupMessage.length > 0) {
                            metaData.tdAttr = 'data-qtip="' + score.popupMessage + '"';
                        }

                        if (score.toString !== Object.prototype.toString) {
                            // trust the toString method of the score object to handle this
                            return score.toString();
                        } else {
                            // fall back on doing this manually (this will happen for total tools, since they don't use regular Score objects)
                            if (score.popupMessage)
                                return score.popupMessage;
                            if (typeof score.value !== "undefined" && score.value !== null && !isNaN(score.value))
                                return score.value.toString();
                            if (typeof score.utility === "number" && isFinite(score.utility))
                                return ""; // we have a utility score... we must've meant to leave this area blank.
                            return "No value";
                        }
                    },

                    editor: {
                        xtype: 'textfield',
                        allowBlank: false,
                        allowDecimals: false,
                        allowExponential: false,
                        allowOnlyWhitespace: false
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
                    renderer: function (scores, metaData) {
                        // fetch the score object for this site (and in this score line), using idx as a hint to its position in the scores array
                        var score = getScoreForSite(scores, site, idx);

                        if (!score) return ""; // this may be possible in the instant after a new site is added (some score lines may not have updated yet)

                        // handle a missing/invalid value
                        if (typeof score.utility !== "number" || !isFinite(score.utility)) return '...';

                        var c = pvMapper.getColorForScore(score.utility);
                        metaData.style = "text-align: center; border-radius: 5px; background-color:" + c + ";";

                        return score.utility.toFixed(0);
                    },
                    draggable: false,

                    editor: {
                        xtype: 'numberfield',
                        maxValue: 100,
                        minValue: 0,
                        allowBlank: true,
                        allowDecimals: false,
                        allowExponential: false,
                        allowOnlyWhitespace: false
                    },

                    

                    summaryType: function (records) {
                        var total = 0;
                        var count = 0;

                        records.forEach(function (record) {
                            var scoreLine = record.raw;
                            var scores = scoreLine.scores;

                            if (typeof scoreLine.weight === "number" && isFinite(scoreLine.weight)) {
                                // fetch the score object for this site (and in this score line), using idx as a hint to its position in the scores array
                                var score = getScoreForSite(scores, site, idx);

                                if (score && typeof score.utility === "number" && isFinite(score.utility)) {
                                    total += score.utility * scoreLine.weight;
                                    count += scoreLine.weight;
                                }
                            } else if (scoreLine.category !== "Totals") {
                                if (console && console.warn) console.warn("Warning: invalid weight for score line ID='" + scoreLine.id + "', weight=" + scoreLine.weight);
                            }
                        });

                        var average = total / count; //TODO: may return NaN... is that ok?

                        return average;
                    },
                    summaryRenderer: function (value, summaryRowValues) {
                        if (typeof value === "number" && isFinite(value)) {
                            var c = pvMapper.getColorForScore(value);
                            return '<span style="border-radius: 3px; background-color:' + c + '">&nbsp' + value.toFixed(0) + '&nbsp</span>'
                        }
                        return '';
                    },

                }]
            };
            siteColumns.push(siteColumn);
        });

        //Now update the sites section of the grid
        pvMapper.scoreboardGrid.reconfigure(null, scoreboardColumns);

        //The columns has been configured, Els for each column is now available.  
        //We can attach conttext menu to the header.
        //HACK: delay this for a tick... catch the scoreboard after it's been rendered. (yeah, this is hacky...)
        window.setTimeout(function() {
            pvMapper.siteManager.getSites().forEach(function (site, idx) {
                var col = Ext.getCmp(site.id);
                if (!col) {
                    if (console && console.warn) console.warn("Warning: couldn't find the column this site belongs to.");
                } else {
                    var el = col.getEl();
                    if (el) {
                        el.on({
                            'contextmenu': function (e, col, opt) {
                                e.stopEvent();
                                showHeaderCTMenu(e.getXY(), site);
                                return false;
                            },
                            scope: this
                        });
                    }
                }
            });
        }, 1);
    //}
};//);

// plugin for cell editing (Weight value)
Ext.define('MainApp.view.ScoreWeightEditing', {
    extend: 'Ext.grid.plugin.CellEditing',
    clicksToEdit: 1,
    listeners: {
        beforeedit: function (editor, e, eOpts) {
             if (e.field == "weight")
                 return typeof e.record.raw.weight === "number"; // don't allow weight editing on total tools or the like
            
             return e.record.raw.category === "All Custom Added Tools";
        },
        edit: function (editor, e, eOpts) {
            if (e.field == "weight" && typeof (e.record.raw.setWeight) === "function" && e.record.raw.weight !== e.record.data['weight'])
                e.record.raw.setWeight(e.record.data['weight']);

            //if(e.record.raw.category == "All Custom Added Tools")
            //{
            //    theScoreIdx = parseInt((e.colIdx - 3) / 2); //TODO: this isn't an ideal way to get the correct score object for this column.

            //    switch(e.column.text){
            //        case "Value" :
            //             e.record.raw.scores[theScoreIdx].popupMessage = e.value;
            //             break ;

            //        case "Score" :
            //             e.record.raw.scores[theScoreIdx].updateValue(parseInt(e.value));
            //    }

            //    if(e.field == "title")
            //        e.record.raw.title = e.value;
               
            //  //  e.record.raw.scores[0].updateValue(0);
            //}
        }
    }
});

//----------------The grid and window-----------------
Ext.define('Ext.grid.ScoreboardGrid', {
    //xtype:'Scoreboard',
    extend: 'Ext.grid.Panel',
    store: toolsStore,
    //dockedItems: [{                // Toolbar on the mainscoreboard, added by Rohan Raja (BYU)
    //    xtype: 'toolbar',
    //    dock: 'top',
    //    items: [{
    //        xtype: 'button',
    //        iconCls: 'x-openproject-menu-icon',
    //        text: 'Add Custom Tool',// <img style="width : 10px; height 10px;" src="http://www.iconsdb.com/icons/download/black/plus-2-256.png">',
    //        handler: function(){
    //            add_new_tool();
    //        }
    //    }, {
    //        xtype: 'button',
    //        iconCls: 'x-fileexport-menu-icon',
    //        text: 'Export Scoreboard to CSV',// <img style="width : 10px; height 10px;" src="http://www.iconsdb.com/icons/download/black/plus-2-256.png">',
    //        handler: function(){

    //            pvMapper.scoreboardToolsToolbarMenu.items.items[6].handler()
    //        }
    //    }]
    //}],

    //forceFit: true,
    //width: '100%',
    //height: 600,
    //title: "Tools List",
    columns: scoreboardColumns,
    invalidateScrollerOnRefresh: false, // <-- We've been looking for this fancy magic for at least a year - wahoo!
    viewConfig: {
        stripeRows: true,
        listeners: {

            itemcontextmenu: function (view, rec, node, idx, e) {
                contextMenuItems = [];

                // if this tool's scores can be refreshed, add an option to do so...
                if (typeof rec.raw.onSiteChange === "function" && rec.raw.scores) {
                    contextMenuItems.push({
                        text: "Refresh scores for this tool",
                        iconCls: "x-tag-restart-icon",
                        tooltip: "Recomputes this tool's score for every site",
                        handler: function () {
                            rec.raw.scores.forEach(function (s) { rec.raw.onSiteChange(null, s); });
                        }
                    });
                }

                // if this tool can be reset, add a menu option to reset it
                if (typeof rec.raw.resetConfiguration === "function") {
                    contextMenuItems.push({
                        text: "Reset '" + rec.raw.title + "' configuration",
                        iconCls: "x-cleaning-menu-icon",
                        tooltip: "Reset this tool to the default configuration.",
                        handler: function () {
                            rec.raw.resetConfiguration();
                        }
                    });
                }

                // if this module is registered with the module manager, then include a menu option to turn it off (as the module manager can always turn it back on)
                if (pvMapper.moduleManager.getRegisteredModuleByID(rec.raw.getModule().id)) {
                    contextMenuItems.push({
                        text: "Turn off '" + rec.raw.getModule().title + "' module",
                        iconCls: "x-tag-check-icon",
                        tooltip: "Disable this tool and its associated module, removing them from the scoreboard.",
                        handler: function () {
                            pvMapper.moduleManager.deactivateModule(rec.raw.getModule());
                        }
                    });
                }
                
                // if this module is a custom module registered with the module manager, then include a menu option to remove it
                //Note: this should be mutually exclusive with the previous if()
                if (pvMapper.moduleManager.getCustomModuleByID(rec.raw.getModule().id)) {
                    contextMenuItems.push({
                        text: "Remove '" + rec.raw.getModule().title + "' module",
                        iconCls: "x-delete-menu-icon",
                        tooltip: "Delete this tool and its associated module, permanently removing them from the scoreboard.",
                        handler: function () {
                            Ext.MessageBox.confirm("Confirm remove module", "Are you sure you want to remove module '" + rec.raw.title +
                                "', along with all of its layers and tools?", function (btn) {
                                    if (btn === "yes") {
                                        pvMapper.moduleManager.removeCustomModule(rec.raw.getModule());
                                    }
                                }
                            );
                        }
                    });
                }

                // '-',
                //{
                //    text: 'Tool Module Selector',
                //    iconCls: "x-tag-check-icon",
                //    tooltip: "Turn tool modules on and off.",
                //    //enabledToggle: false,
                //    handler: function () {
                //        var toolWin = Ext.create("MainApp.view.ToolConfigWindow", {
                //        });
                //        toolWin.show();
                //    }
                //}

                if (contextMenuItems.length) {
                    e.stopEvent(); //TODO: what is this for...?
                    var cellContextMenu = Ext.create("Ext.menu.Menu", { items: contextMenuItems });
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
        },
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
                            var printWindow = window.open('','_blank');

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
                            //printWindow.print();
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
                    var printWindow = window.open('', '_blank'); // 'left=10, width=800, height=520');

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
                    //printWindow.print();

                }
            }
        ]
    }],
    items: pvMapper.scoreboardGrid,
    constrain: true

});


//toolsStore.load(pvMapper.mainScoreboard.getTableData()); //Load the data to the panel

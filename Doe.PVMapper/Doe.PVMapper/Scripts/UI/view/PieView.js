
//#region PieStore testing.
Ext.define('PieModel', {
    extend: 'Ext.data.Model',
    fields: [
      { name: 'Title', type: 'string' },
      { name: 'Weight', type: 'int' },
      { name: 'Color', type: 'string' },
      { name: 'Score', type: 'int' },
      { name: 'ScoreText', type: 'string' }
    ],
});



var pieStore = Ext.create('Ext.data.Store', {
    model: 'PieModel',
    data: []
});

//#endregion

//#region PieWindow
Ext.define('MainApp.view.PieWindow', {
    extend: 'MainApp.view.Window',
    scoreBoardStore: null,
    siteName: '',
    groupName: '',
    minWidth: 200,
    minHeigh: 0,
    title: 'Title',
    autoWidth: true,
    autoHeight: true,
    //height: 500,
    //width: 550,
    floating: true,
    closeAction: 'close',
    constrainHeader: true,
    minimizable: false,
    collapsible: false,
    resizable: false,
    modal: true,
    initMode: true,
    myChart: null,
    siteGroup_Changed: function (group, site) {
        if (this.initMode) return;
        if (this.scoreBoardStore == undefined) return;
        if (group == undefined || null) return;
        if (site == undefined || null) return;
        if ((site == '') || (group == ''))  return;  //no group or site set, do nothing.
       // if ((group == this.groupName) && (site == this.siteName)) return;

        console.log('PieView: refresh data for [' + group + ',' + site + ']');
        this.setTitle('Weighted Percentage - ' + group + ' : ' + site);
        var records = this.scoreBoardStore.getGroups(group);
        if (records.children.length == 0) return;
        var pieColor = '';
        
        //this.myChart.store = null;

        pieStore.removeAll();

        var siteIndex = -1;
        for (n = 0; n < records.children[0].raw.scores.length; n++) {
            if (records.children[0].raw.scores[n].site.name == site) {
                siteIndex = n;
                break;
            }
        };

        
        if (siteIndex > -1) {
            records.children.forEach(function (record, index, array) {
                if (record.get('weight')) {
                    var utilScore = record.raw.scores[siteIndex].utility;
                    if (isNaN(utilScore) || utilScore === null)
                        pieColor = 'rgb(153,153,153)';
                    else
                        pieColor = pvMapper.getColorForScore(utilScore);

                    pieStore.add({
                        Title: record.get('title'),
                        Weight: record.get('weight'),
                        Color: pieColor,
                        Score: utilScore.toFixed(0),
                        ScoreText: record.raw.scores[siteIndex].popupMessage
                    });
                }
            });
        }
        this.groupName = group;
        this.siteName = site;
        //this.myChart.store = pieStore;
    },
    initComponent: function () {
        var me = this;
        me.items = [];
        var rbGroup = Ext.create('Ext.form.RadioGroup', {
            xtype: 'radiogroup',
            columns: 1,

            autoWidth: true,
            autoHeight: true,
            autoScroll: false,
            vertical: true,
            items: [],
        });

        var rb;
        var rid = 0
        me.scoreBoardStore.getGroups().forEach(function (record, obj) {
            if (record.name.toUpperCase() !== 'TOTALS') {
                rb = Ext.create('Ext.form.field.Radio', {
                    boxLabel: record.name,
                    name: 'rbGroup',
                    inputValue: record.name,
                    checked: false,
                    //id: 'rb-' + (rid++).toString(),
                    listeners: {
                        change: function (rb, newVal, oldVal, opts) {
                            if (newVal)
                                me.siteGroup_Changed(rb.boxLabel, me.siteName);
                        }
                    }
                });
                if (me.groupName == record.name)
                    rb.setValue(true);
                rbGroup.items.add(rb);
            }
        });

        var pnGroup = Ext.create('Ext.form.Panel', {
            title: 'Tool Groups',
            layout: 'anchor',
            overflowY: 'scroll',
            width: 200,
            height: 250,
            items: [rbGroup]
        });


        var rbSite = Ext.create('Ext.form.RadioGroup', {
            xtype: 'radiogroup',
            columns: 1,
            autoWidth: true,
            autoHeight: true,
            autoScroll: false,
            vertical: true,
            items: [],
        });

        me.scoreBoardStore.first().get('sites').forEach(function (scoreLine, idx) {
            rb = Ext.create('Ext.form.field.Radio',
                {
                    boxLabel: scoreLine.site.name,
                    name: 'rbSite',
                    inputValue: scoreLine.site.name,
                    checked: false,
                    //id: 'rb-' + (rid++).toString(),
                    listeners: {
                        change: function (rb, newVal, oldVal, opts) {
                            if (newVal)
                              me.siteGroup_Changed(me.groupName, rb.boxLabel);
                        }
                    }
                });
            if (me.siteName == scoreLine.site.name)
                rb.setValue(true);
            rbSite.items.add(rb);

        });

        var pnSite = Ext.create('Ext.form.Panel', {
            title: 'Site Name',
            layout: 'anchor',
            overflowY: 'scroll',
            width: 200,
            height: 250,
            items: [rbSite]
        });

        /*global Ext:false */
        var contentPanel = Ext.create('Ext.FormPanel', {
            renderTo: Ext.getBody(),
            defaults: {
                anchor: '100%'
            },
            autoWidth: true,
            height: 500,
            layout: 'hbox',
            items: [{
                xtype: 'panel',
                layout: 'fit',
                layout: 'vbox',
                autoWidth: true,
                autoHeight: true,
                items: [pnSite, pnGroup]
            }]
        });


        var myPie = {
            type: 'pie',
            angleField: 'Weight',
            showInLegend: true,

            getLegendColor: function (idx) {
                var rec = pieStore.getAt(idx);
                return rec.data.Color;
            },
            highlight: {
                segment: {
                    margin: 20
                }
            },
            tips: {
                trackMouse: true,
                minWidth: 150,
                //maxWidth: 650,
                //height: 50,
                renderer: function (storeItem, item) {
                    //calculate and display percentage on hover
                    var total = 0;
                    pieStore.each(function (rec) {
                        total += rec.get('Weight');
                    });
                    if (storeItem.get('Weight'))
                        this.setTitle(storeItem.get('Title') +
                            '; Score: ' + storeItem.get('Score') +
                            '; Weight: ' + storeItem.get('Weight') + ' (' + Math.round(storeItem.get('Weight') / total * 100) +
                            '%); Value: ' + storeItem.get('ScoreText'));
                    else
                        this.setTitle(storeItem.get('Title'));
                }
            },

            //pull the color to fill the pie from the datastore.
            renderer: function (sprite, record, attr, index, store) {
                return Ext.apply(attr, { fill: record.get('Color'), stroke: 'rgb(0,0,0)', 'stroke-width': 2, 'stroke-opacity': 0.5, 'stroke-linejoin': 'round' });
            },
            label: {
                field: 'Title',
                display: 'horizontal', //'rotate',
                contrast: true,
                font: '14px Arial'
            },
            listeners: {
                itemmousedown: function (options, obj) {
                    //alert(options.storeItem.data[me.dataName] + ' &' + options.storeItem.data[me.dataField]);
                }
            }
        };


        me.myChart = {
            xtype: 'chart',
            //animate: true,  // animation looks nice but buggy.  It doesn't render the pie chart correctly when data points are changing.
            width: 550,
            height: 495,
            theme: 'Base:gradients',

            insetPadding: 5,
            legend: {
                position: 'right',
            },
            shadow: true,
            store: pieStore,
            series: [myPie],
            //interactions: ['rotate']
        };

        var piePanel = Ext.create('Ext.form.Panel', {
            autoHeight: true,
            autoWidth: true,
            bodyStyle: 'padding: 5px 5px 0',
            renderTo: Ext.getBody(),
            anchor: '100%',
            items: [me.myChart],
        });


        contentPanel.items.items.push(piePanel);
        this.items.push(contentPanel);
        this.callParent(arguments);
    },
    listeners: {
        beforeshow: function (wnd, opts) {
            this.initMode = false;
            this.siteGroup_Changed(this.groupName, this.siteName);
            return true;
        },
        beforedestroy: function (wnd, opt) {
            pieStore.removeAll();
        }
    }
});
//#endregion



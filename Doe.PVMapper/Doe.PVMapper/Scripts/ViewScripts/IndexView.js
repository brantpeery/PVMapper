//    OpenLayers.ImgPath = "../img/"

Ext.onReady(function () {

    // display tooltips for actions
    Ext.QuickTips.init();

    // todo: the solar data we are testing seems to require specific bounds. Can we set the map to have usBounds and the WMS to use the solarBounds?
    var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
    var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);

    // default resolution 156543.0339,
    var panel = new GeoExt.MapPanel({
        renderTo: "map-id",
        height: 500,
        width: "100%",
        //layers: [
        //                wms, solar, slope
        //],
        center: [-10723197, 4500612],
        zoom: 0, //4 would be the default for US coverage if we were using 19 zoom levels instead of the reduced extents.
        map: {
            projection: new OpenLayers.Projection("EPSG:4326"), //3857
            units: "m",
            numZoomLevels: 18,
            maxResolution: 156543.0339,
            maxExtent: solarBounds,
            theme: null,
            controls: []
        }
    });

    // default controls to show in map.
    panel.map.addControl(new OpenLayers.Control.PanZoomBar({ zoomWorldIcon: false, zoomStopHeight: 2 }));
    panel.map.addControl(new OpenLayers.Control.LayerSwitcher({ 'ascending': false }));
    panel.map.addControl(new OpenLayers.Control.KeyboardDefaults());

    // add the pan hand.
    //var panelControls = [
    // new OpenLayers.Control.Navigation()
    //];
    //var toolbar = new OpenLayers.Control.Panel({
    //    displayClass: 'olControlEditingToolbar',
    //    defaultControl: panelControls[0]
    //});
    //toolbar.addControls(panelControls);
    //panel.map.addControl(toolbar);

    pvMapper.map = panel.map;
    pvMapper.toolbar = new Ext.Toolbar({
        //            renderTo: "tbar-id",
        //items: []
    });

    var tabs = new Ext.TabPanel({
        //            renderTo: "tabs-id",
        activeTab: 0,
        region: 'center',
        items: [{
            title: 'Map',
            contentEl: 'map-id'
        }, {
            title: 'Scoreboard',
            listeners: { activate: handleScoreboardActivate, single: true },
            contentEl: 'scoreboard-id'
        }]
    });
    pvMapper.tabbar = tabs;


    var tree = new Ext.tree.TreePanel({
        title: 'Tools',
        width: 250,
        region: 'west',
        rootVisible: false,
        autoScroll: true,
        loader: new Ext.tree.TreeLoader({
            url: '/api/Tools',
            preloadChildren: true
        }),
        listeners: {
            'click': function (node, ev) {
                // todo: add error handling
                // http://api.jquery.com/jQuery.getScript/
                $.getScript(node.attributes.url);

                $.getScript(node.attributes.url)
                    .done(function (script, textStatus) {

                    })
                    .fail(function (jqxhr, settings, exception) {
                        console.log(exception);
                        // $("div.log").text("Triggered ajaxError handler.");
                    });
            }
        }
    });

    // set the root node
    var treeRoot = new Ext.tree.AsyncTreeNode({
        draggable: false,
        id: 'allitems'
    });

    tree.setRootNode(treeRoot);

    var rootPanel = new Ext.Panel({
        //            title: "GeoExt LegendPanel Demo",
        layout: 'border',
        renderTo: 'extRoot-id',
        height: 500,
        width: 950,
        tbar: pvMapper.toolbar,
        items: [tree, tabs]
    });

    function handleScoreboardActivate(tab) {

        var SaleRecord = Ext.data.Record.create([
        { name: 'person', type: 'string' },
        { name: 'product', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'month', type: 'int' },
        { name: 'quarter', type: 'int' },
        { name: 'quantity', type: 'int' },
        { name: 'value', type: 'int' }
        ]);

        var myStore = new Ext.data.Store({
            url: 'json.txt',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'rows',
                idProperty: 'id'
            }, SaleRecord)
        });

        var pivotGrid = new Ext.grid.PivotGrid({
            width: 600,
            height: 259,
            renderTo: 'scoreboard-id',
            store: myStore,
            aggregator: 'sum',
            measure: 'quarter',

            leftAxis: [
               {
                   width: 190,
                   dataIndex: 'product'
               }
            ],

            topAxis: [
                {
                    dataIndex: 'city'
                }
            ]
        });
    }
  
    var sitelayer = new OpenLayers.Layer.Vector("Sites");
    sitelayer.id = "SiteLayer";
    panel.map.addLayer(sitelayer);  

    $("body").trigger("pvMapper-ready");
});
////    OpenLayers.ImgPath = "../img/"

pvMapper.onReady(function () {


    //// default controls to show in map.
    //pvMapper.map.addControl(new OpenLayers.Control.PanZoomBar({ zoomWorldIcon: false, zoomStopHeight: 2 }));
    pvMapper.map.addControl(new OpenLayers.Control.LayerSwitcher({ 'ascending': true }));
    pvMapper.map.addControl(new OpenLayers.Control.KeyboardDefaults());

    //var store = Ext.create('Ext.data.TreeStore', {
    //    proxy: {
    //        type: 'ajax',
    //        url: '/api/Tools'
    //    },
    //    sorters: [{
    //        property: 'leaf',
    //        direction: 'ASC'
    //    }, {
    //        property: 'text',
    //        direction: 'ASC'
    //    }]
    //});
    //Ext.create('Ext.tree.Panel', {
    //    store: store,
    //    rootVisible: false,
    //    useArrows: true,
    //    frame: true,
    //    title: 'Tools',
    //    renderTo: "extRoot-id",
    //    width: 200,
    //    height: 250
    //});
    //http://docs.sencha.com/ext-js/4-0/#!/api/Ext.data.TreeStore
    // http://www.packtpub.com/article/ext-js-4-working-tree-form-components

    
    //var tree = new Ext.tree.TreePanel({
    //    title: 'Tools',
    //    width: 250,
    //    region: 'west',
    //    rootVisible: false,
    //    autoScroll: true,
    //    loader: new Ext.tree.TreeLoader({
    //        url: '/api/Tools',
    //        preloadChildren: true
    //    }),
    //    listeners: {
    //        'click': function (node, ev) {
    //            // todo: add error handling
    //            // http://api.jquery.com/jQuery.getScript/
    //            $.getScript(node.attributes.url);

    //            $.getScript(node.attributes.url)
    //                .done(function (script, textStatus) {

    //                })
    //                .fail(function (jqxhr, settings, exception) {
    //                    console.log(exception);
    //                    // $("div.log").text("Triggered ajaxError handler.");
    //                });
    //        }
    //    }
    //});

    //// set the root node
    //var treeRoot = new Ext.tree.AsyncTreeNode({
    //    draggable: false,
    //    id: 'allitems'
    //});

  

});
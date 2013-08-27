///// <reference path="../OpenLayers.js" />
///// <reference path="../jquery-ui-1.8.11.js" />
///// <reference path="../jquery-ui-1.8.21.full.js" />
///// <reference path="../_references.js" />

////Brings up the SiteDetail tools
//var toolbar;
//$().ready(function () {
//    createMap('map');
//    toolbar = $("<div id='MapToolbar'>Map Toolbar<ul id='toolbarNav'></ul></div>").appendTo("body").tabs();
//    toolbar.find('ul#toolbarNav').on('dblclick', "li", function (event, ui) { //Set up the event to switch the tab back to a dialog
//        tab2Dialog(this);
//    });

//    createToolbox();

//    loadPolygon();
//    //loadWFS();

//    createLayerSwitcher();

//    //Click test
//    map.events.register('click', map, function (e) {
//        if (debug) {
//            debug.write(map.getLonLatFromViewPortPx(e.xy));
//        }
//    });

//    //Set up the toolbox to tabs effect
//    $("body").on('dialogbeforeclose', ".ui-dialog", function () {
//        tabbifyDialog(this);
//        return false;
//    });
//});

//function tabbifyDialog(control) {
//    var c = $(control); //The toolbox
//    content = c.children('.ui-dialog-content'); //Get the actual content div that was used to create the toolbox

//    dialogData = { position: c.position(), height: c.height(), width: c.width() };
//    content.data('dialogData', dialogData);

//    c.dialog("destroy").remove(); //Destroy the dialog wrap elements (should not destroy content)
//    content.addClass("toolbox-content").show(); //Turn the content to visible. Needed for the tabs stuff
//    divID = content.attr('id'); //Get the ID to use as the link

//    content.appendTo(toolbar); //Move the content to the toolbar div so the add function can find it
//    $(toolbar).first().tabs('add', '#' + divID, content.attr('title'), 3); //Add a new tab that points to the content
//}

//function tab2Dialog(control) {
//    $c = $(control);
//    $tabs = $c.closest("ul");
//    index = $c.index($c.closest("ul").children());

//    //Pop the content out of the tabs. This requires the custom extention 'popout' by Brant Peery
//    $content = $c.closest("div.ui-tabs").tabs('popout', index);

//    $content.dialog({ dialogClass: "mapToolbox", autoOpen:true, position:[$tabs.offset().left, $tabs.offset().top]});
//    if ($content.data('dialogData')) {
//        dialogData = $content.data('dialogData');

//        $dialog = $content.parent();
//        $dialog.animate({ height: dialogData.height, width: dialogData.width, top: dialogData.position.top, left: dialogData.position.left }, 1000);
//    }
//}
//function toggleDialog(control, close) {
//    $dialog = $(control).sibling('.ui-dialog-content'); //get the parent dialog
//    if ($dialog.dialog('isMinimized')) {
//        $dialog.dialog('restore');
//    } else {
//        $dialog.dialog('minimize');
//    }
//}

////Global Variabels
//var map;
//var polyLayer;
//var features = {};

////Create the tool that draws and edits the polygon

////Create the tool that saves the polygon layer to the database
//function loadPolygon() {
//    featureGeom = "POLYGON((-12919692.267077 6261721.3562499,-12919692.267077 6105178.3223436,-12733797.414313 5870363.7714843,-12743581.353932 5733388.6168163,-12665309.836979 5713820.737578,-12577254.380407 5537709.8244335,-12420711.346501 5547493.7640526,-12410927.406881 5567061.6432909,-12352223.769167 5537709.8244335,-12352223.769167 5156136.179287,-13037099.542506 5165920.1189061,-13017531.663268 5488790.1263378,-13046883.482126 5537709.8244335,-12978395.904792 5704036.7979589,-12997963.78403 5752956.4960546,-13017531.663268 5811660.1337694,-13027315.602887 6281289.2354882,-12919692.267077 6261721.3562499))";

//    poly = new OpenLayers.Format.WKT().read(featureGeom);
//    poly.fid = "Idaho";
//    features.idaho = poly;
//    polyLayer.addFeatures([poly]);

//    featureGeom = "POLYGON((-11464331.248729 4439462.6021849,-11464331.248729 4370975.0248509,-11124339.346964 4368529.0399461,-11129231.316774 4109254.6400389,-11107217.452631 4084794.7909911,-11055851.76963 4082348.8060863,-11004486.08663 4050551.0023241,-10926214.569677 4048105.0174193,-10862618.962152 4018753.1985619,-10728089.792389 3994293.349514,-10593560.622626 4018753.1985619,-10517735.090578 3986955.3947996,-10512843.12077 4205871.0437777,-10510397.135865 4218100.9683017,-10533633.99246 4370975.0248507,-10533633.99246 4440685.5946371,-11464331.248729 4439462.6021849))";
//    poly = new OpenLayers.Format.WKT().read(featureGeom);
//    poly.fid = "Oklahoma";
//    features.oklahoma = poly;

//    polyLayer.addFeatures([poly]);

//    //Create a features div and add in the features
//    var SiteToolbar = $("<div id='SitesToolbar' title='Site Selector' class='mapToolbox olControlEditingToolbar'></div>").appendTo("body");
//    SiteToolbar.dialog({ dialogClass: "mapToolbox", width: "165", position: [214, 260] });
//    var sitelist = $('<ul></ul>').appendTo(SiteToolbar);
//    $.each(polyLayer.features, function () {
//        var thisFeature = this;
//        $('<li class="link">' + this.fid + '</li>').appendTo(sitelist).click(function () {
//            map.zoomToExtent(thisFeature.geometry.getBounds());
//        });
//    });
//}

//function loadWFS() {
//    wfsURL = 'http://solarmapper.anl.gov/ArcGIS/services/Solar_Prospector_Map_Service2/MapServer/WFSServer?request=GetCapabilities&service=WFS';

//    var wfs = new OpenLayers.Layer.Vector("WFS", {
//        strategies: [new OpenLayers.Strategy.Fixed()],
//        protocol: new OpenLayers.Protocol.WFS({
//            url: wfsURL,
//            featureNS: "<namespace>",

//        }),
//        styleMap: new OpenLayers.StyleMap({
//            strokeWidth: 3,
//            strokeColor: "#333333"
//        })
//    })

//}

////Create the tool that will tell the user the area of the polygon

////Crate a tool that can turn the layers on and off

////Create the tool that can set the current layer opacity

////Create the map and set the map variable
//function createMap(div) {
//    //Create the openlayers map and allow overlays to be visible
//    USBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
//    map = new OpenLayers.Map(div, { allOverlays: true,
//        maxExtent: USBounds,
//        numZoomLevels: 4,
//        restrictedExtent: USBounds,
//        controls: []
//    });
//    map.addControls([
//        new OpenLayers.Control.Navigation(),
//        new OpenLayers.Control.Attribution(),
//        new OpenLayers.Control.PanZoomBar()
//    ]);

//    //This is a hack I found for getting the OSM resolutions without having to do the math.
//    //It would seem that Bing Maps uses the same resolution settings as OSM
//    var resolutions = OpenLayers.Layer.Bing.prototype.serverResolutions.slice(4, 19);

//    var osm = new OpenLayers.Layer.OSM("Street", null, { zoomOffset: 4, resolutions: resolutions });
//    var osmVector = new OpenLayers.Layer();
//    map.addLayers([osm]); //Base Layer

//    polyLayer = new OpenLayers.Layer.Vector("Sites",
//        {
//            styleMap: new OpenLayers.StyleMap({
//                'default': new OpenLayers.Style({
//                    strokeColor: "red",
//                    strokeWidth: 1,
//                    fillColor: "red",
//                    fillOpacity: .05,
//                    pointRadius: 3
//                })
//            })
//        }); //The editable poly layer for the user's site
//    map.addLayer(polyLayer); //The editable layer
//    OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';

//    map.zoomToMaxExtent();
//    //    map.maxExtent = new OpenLayers.Bounds(-14020385.47423, 3081940.9800292, -6799838.0353038, 6506319.8467284);
//    //    map.zoomToExtent(new OpenLayers.Bounds(-14020385.47423, 3081940.9800292, -6799838.0353038, 6506319.8467284));
//    //    map.restictedExtent = mapBounds;

//    //    polyLayer.addFeatures([
//    //        new OpenLayers.Feature.Vector(USBounds.toGeometry())
//    //    ]);
//}

////Create the toolbox
//function createToolbox(div) {
//    //Create the toolbox and initialize all the tools

//    var panel = document.getElementById("MapToolbox");
//    toolbox = new OpenLayers.Control.EditingToolbar(polyLayer, { div: panel });
//    map.addControl(toolbox);

//    $('#MapToolbox').dialog({ dialogClass: "mapToolbox", width: "165", height: 'auto', position: [214, 160] });

//    MapToolBox.panel = panel;
//    MapToolBox.addTool(new OpenLayers.Control.ModifyFeature(polyLayer, { div: panel }));
//}

//var MapToolBox = {
//    panel: $('#MapToolbox'),

//    ///Adds a tool to the toolbox
//    addTool: function (control, options) {
//        control.type = OpenLayers.Control.TYPE_BUTTON;

//        map.addControl(control);
//        control.activate();

//        mydiv = $('<div></div>').appendTo(this.panel).addClass("olControl");

//        if (options && options.buttonActiveImage) {
//        }
//    }
//}

//function createLayerSwitcher(div) {
//    //Make a custom layer switcher
//    var layerDialog = $('<div id="LayerToolbox" title="Layer Switcher" class=""></div>').appendTo('body');
//    var layerList = $("<ul></ul>").appendTo(layerDialog);

//    $.each(map.layers, function () {
//        var thisLayer = this;
//        baseClass = "";
//        if (this.isBaseLayer) { baseClass = "baseLayer"; }
//        $('<li class="link' + baseClass + '"></li>').appendTo(layerList).html(this.name)
//        .click(function () {
//            thisLayer.setVisibility(!thisLayer.getVisibility()); //Toggle the visibility
//            $(this).toggleClass("inactiveToolboxText");
//        });
//    });

//    layerDialog.dialog({ dialogClass: "mapToolbox", width: "165", height: 'auto', position: [214, 460] });
//}



////>>>>>>>>>>jQuery custom extensions<<<<<<<<<<<<<<<
//(function ($) {
//    $.fn.toolbox = function (options) {
        

//        //Check to see if a tool box exists. If not, create one
//        $menu = $(".toolbox-menu");
//        if (!$menu) {
//            //Create a menu toolbar for the tabs
//            $menu = $("<div id='ToolMenuBar' class='toolbox-menu, ol-toolbox-menu'>Map Toolbar</div>").appendTo("body");
//        }

//        //Check to see if the menu has been tabbified
//        if (!$menu.children("#toolbarNav")) {
//            $menu.append("<ul id='toolbarNav'></ul>").tabs();
//        }

//        //Now add the dialog to the screen
//        $(this).dialog($.extend({ dialogClass: "ol-mapToolbox" }, options));
//    }
        
    
//})(jQuery);
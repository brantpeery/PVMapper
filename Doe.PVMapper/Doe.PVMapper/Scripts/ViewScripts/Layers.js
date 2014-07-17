Ext.require('GeoExt.panel.Map');

pvMapper.onReady(function () {

    // EPSG:102113, EPSG:900913, and EPSG:3857 are all the same projection (just different flavors favored by different groups).
    // So, this is (a bit of) a hack to coax OpenLayers to request maps in the native projection of the server
    // TODO: move this to wherever it should ultimately go.
    Ext.override(OpenLayers.Layer.WMS, {
        getFullRequestString: function (newParams, altUrl) {
            var projectionCode = this.map.getProjection();
            if (((typeof (this.epsgOverride)) !== "undefined") && this.epsgOverride.length > 0) {
              this.params.SRS = this.epsgOverride;
            } else {
              this.params.SRS = (projectionCode === "none") ? null : projectionCode;
            }

            return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
        }
    });

    Ext.override(OpenLayers.Layer.ArcGIS93Rest, {
      getFullRequestString: function (newParams, altUrl) {
        var projectionCode = this.map.getProjection();
        if (((typeof (this.epsgOverride)) !== "undefined") && this.epsgOverride.length > 0) {
          this.params.SRS = this.epsgOverride;
        } else {
          this.params.SRS = (projectionCode === "none") ? null : projectionCode;
        }

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
      }
    });

    //var solarBounds = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34);
    var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);

    var resolutions = OpenLayers.Layer.Bing.prototype.serverResolutions.slice(4, 19);
    var osm = new OpenLayers.Layer.OSM("OpenStreetMap", null, { isBaseLayer: true, zoomOffset: 4, resolutions: resolutions, sphericalMercator: true });
    //$.jGrowl("Adding OpenStreetMap");
    pvMapper.map.addLayer(osm);

    var usBounds = new OpenLayers.Bounds(-14020385.47423, 2768854.9122167, -7435794.1105484, 6506319.8467284);
    pvMapper.map.zoomToExtent(usBounds); // <-- this worked

    

    //US Counties WMS taken from ArcGIS server

    //addWMSLayer("US Counties", "https://geoserver.byu.edu/arcgis/services/Layers/counties/MapServer/WmsServer?", 0, true);
   
    var CitiesMetaData = Ext.htmlEncode("Title: World Cities <br>Originator: Environmental Systems Research Institute, Inc. (ESRI) <br>Edition: 2000 <br><br>Keywords:<br>Theme:point,cities,capitals,administrative unit and international codes,population,country names,port identification numbers.<br><br>Publication_Information:<br>Publication_Place: Redlands, California, USA<br>Publisher: Environmental Systems Research Institute, Inc. (ESRI)<br>Description:<br>Abstract:<br>World Cities represents the locations of major cities of the world.<br>Purpose:<br>World Cities provides a base map layer of the cities for the world. The cities include national capitals, provincial capitals, major population centers, and landmark cities.<br>Supplemental_Information: Largest scale when displaying the data: 1:15,000,000.<br>Use_Constraints:<br>The data are provided by multiple, third party data vendors under license to ESRI for inclusion on ESRI Data & Maps CD-ROMs for use with ESRI® software. Each data vendor has its own data licensing policies and may grant varying redistribution rights to end users. Please consult the redistribution rights below for this data set provided on ESRI Data & Maps CD-ROMs. As used herein, \"Geodata\" shall mean any digital data set consisting of geographic data coordinates and associated attributes.The redistribution rights for this data set: Redistribution rights are granted by the data vendor for hard-copy renditions or static, electronic map images (e.g. .gif, .jpeg, etc.) that are plotted, printed, or publicly displayed with proper metadata and source/copyright attribution to the respective data vendor(s). Geodata is redistributable with a Value-Added Software Application developed by ESRI Business Partners on a royalty-free basis with proper metadata and source/copyright attribution to the respective data vendor(s). Geodata is redistributable without a Value-Added Software Application (i.e., adding the sample data to an existing, [non]commercial data set for redistribution) with proper metadata and source/copyright attribution to the respective data vendor(s).<br>For further Metadata : http://webgis.wr.usgs.gov/globalgis/metadata_qr/metadata/ESRI_cities.htm ");
    var DamsMetaData = Ext.htmlEncode("Title: VMAP_1V10 - Vector Map Level 0 (Digital Chart of the World)<br>Originator: National Imagery and Mapping Agency<br>Edition: 3<br><br>Keywords:<br>Theme:Vector Map,VMap,DCW,digital global basemap,GIS database,Global digital database,CD-ROM,rivers,roads,railroads,international boundaries,airports,elevations,contours,coastlines,populated places vegetation<br><br>Publication_Information:<br>Publication_Place: Fairfax, VA<br>Publisher: National Imagery and Mapping Agency<br>Description:<br>Abstract:<br>The Vector Map (VMap) Level 0 database represents the third edition of the Digital Chart of the World. The second edition was a limited release item published 1995 09. The product is dual named to show its lineage to the original DCW, published in 1992, while positioning the revised product within a broader emerging-family of VMap products.VMap Level 0 is a comprehensive 1:1,000,000 scale vector basemap of the world. It consists of cartographic,attribute, and textual data stored on compact disc read only memory (CD-ROM). The primary source for the database is the National Imagery and Mapping Agency's (NIMA)Operational Navigation Chart (ONC) series. This is the largest scale unclassified map series in existence that provides consistent, continuous global coverage of essential basemap features. The database contains more than 1,900 megabytes of vector data and is organized into 10 thematic layers. The data includes major road and rail networks, major hydrologic drainage systems, major utility networks (cross-country pipelines and communication lines),all major airports, elevation contours (1000 foot(ft), with 500ft and 250ft supplemental contours), coastlines, international boundaries and populated places. The database can be accessed directly from the four optical CD-ROMs thatstore the database or can be transferred to a magnetic media.<br>Purpose:<br>The VMap Level 0 is a general purpose global database designed to support Geographic Information Systems applications.<br>Use_Constraints:<br>Cite National Imagery and Mapping Agency<br>For Further details : http://webgis.wr.usgs.gov/globalgis/metadata_qr/metadata/springs_wells_dams.htm");
    var RoadsmetaData = Ext.htmlEncode("Title: VMAP_1V10 - Vector Map Level 0 (Digital Chart of the World)<br>Originator: National Imagery and Mapping Agency<br>Edition: 3<br><br>Keywords:<br>Theme:Vector Map,VMap,DCW,digital global basemap,GIS database,Global digital database,CD-ROM,rivers,roads,railroads,international boundaries,airports,elevations,contours,coastlines,populated places vegetation<br><br>Publication_Information:<br>Publication_Place: Fairfax, VA<br>Publisher: National Imagery and Mapping Agency<br>Description:<br>Abstract:<br>The Vector Map (VMap) Level 0 database represents the third edition of the Digital Chart of the World. The second edition was a limited release item published 1995 09. The product is dual named to show its lineage to the original DCW, published in 1992, while positioning the revised product within a broader emerging-family of VMap products.VMap Level 0 is a comprehensive 1:1,000,000 scale vector basemap of the world. It consists of cartographic,attribute, and textual data stored on compact disc read only memory (CD-ROM). The primary source for the database is the National Imagery and Mapping Agency's (NIMA)Operational Navigation Chart (ONC) series. This is the largest scale unclassified map series in existence that provides consistent, continuous global coverage of essential basemap features. The database contains more than 1,900 megabytes of vector data and is organized into 10 thematic layers. The data includes major road and rail networks, major hydrologic drainage systems, major utility networks (cross-country pipelines and communication lines),all major airports, elevation contours (1000 foot(ft), with 500ft and 250ft supplemental contours), coastlines, international boundaries and populated places. The database can be accessed directly from the four optical CD-ROMs thatstore the database or can be transferred to a magnetic media.<br>Purpose:<br>The VMap Level 0 is a general purpose global database designed to support Geographic Information Systems applications.<br>Use_Constraints:<br>Cite National Imagery and Mapping Agency<br>For Further details : http://webgis.wr.usgs.gov/globalgis/metadata_qr/metadata/roads.htm");
    var RiversmetaData = Ext.htmlEncode("Title: VMAP_1V10 - Vector Map Level 0 (Digital Chart of the World)<br>Originator: National Imagery and Mapping Agency<br>Edition: 3<br><br>Keywords:<br>Theme:Vector Map,VMap,DCW,digital global basemap,GIS database,Global digital database,CD-ROM,rivers,roads,railroads,international boundaries,airports,elevations,contours,coastlines,populated places vegetation<br><br>Publication_Information:<br>Publication_Place: Fairfax, VA<br>Publisher: National Imagery and Mapping Agency<br>Description:<br>Abstract:<br>The Vector Map (VMap) Level 0 database represents the third edition of the Digital Chart of the World. The second edition was a limited release item published 1995 09. The product is dual named to show its lineage to the original DCW, published in 1992, while positioning the revised product within a broader emerging-family of VMap products.VMap Level 0 is a comprehensive 1:1,000,000 scale vector basemap of the world. It consists of cartographic,attribute, and textual data stored on compact disc read only memory (CD-ROM). The primary source for the database is the National Imagery and Mapping Agency's (NIMA)Operational Navigation Chart (ONC) series. This is the largest scale unclassified map series in existence that provides consistent, continuous global coverage of essential basemap features. The database contains more than 1,900 megabytes of vector data and is organized into 10 thematic layers. The data includes major road and rail networks, major hydrologic drainage systems, major utility networks (cross-country pipelines and communication lines),all major airports, elevation contours (1000 foot(ft), with 500ft and 250ft supplemental contours), coastlines, international boundaries and populated places. The database can be accessed directly from the four optical CD-ROMs thatstore the database or can be transferred to a magnetic media.<br>Purpose:<br>The VMap Level 0 is a general purpose global database designed to support Geographic Information Systems applications.<br>Use_Constraints:<br>Cite National Imagery and Mapping Agency<br>For Further details : http://webgis.wr.usgs.gov/globalgis/metadata_qr/metadata/perennial.htm");
    var RailroadsmetaData = Ext.htmlEncode("Title: VMAP_1V10 - Vector Map Level 0 (Digital Chart of the World)<br>Originator: National Imagery and Mapping Agency<br>Edition: 3<br><br>Keywords:<br>Theme:Vector Map,VMap,DCW,digital global basemap,GIS database,Global digital database,CD-ROM,rivers,roads,railroads,international boundaries,airports,elevations,contours,coastlines,populated places vegetation<br><br>Publication_Information:<br>Publication_Place: Fairfax, VA<br>Publisher: National Imagery and Mapping Agency<br>Description:<br>Abstract:<br>The Vector Map (VMap) Level 0 database represents the third edition of the Digital Chart of the World. The second edition was a limited release item published 1995 09. The product is dual named to show its lineage to the original DCW, published in 1992, while positioning the revised product within a broader emerging-family of VMap products.VMap Level 0 is a comprehensive 1:1,000,000 scale vector basemap of the world. It consists of cartographic,attribute, and textual data stored on compact disc read only memory (CD-ROM). The primary source for the database is the National Imagery and Mapping Agency's (NIMA)Operational Navigation Chart (ONC) series. This is the largest scale unclassified map series in existence that provides consistent, continuous global coverage of essential basemap features. The database contains more than 1,900 megabytes of vector data and is organized into 10 thematic layers. The data includes major road and rail networks, major hydrologic drainage systems, major utility networks (cross-country pipelines and communication lines),all major airports, elevation contours (1000 foot(ft), with 500ft and 250ft supplemental contours), coastlines, international boundaries and populated places. The database can be accessed directly from the four optical CD-ROMs thatstore the database or can be transferred to a magnetic media.<br>Purpose:<br>The VMap Level 0 is a general purpose global database designed to support Geographic Information Systems applications.<br>Use_Constraints:<br>Cite National Imagery and Mapping Agency<br>For Further details : http://webgis.wr.usgs.gov/globalgis/metadata_qr/metadata/railroads.htm");
   
    addWMSLayer("Cities", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "7", true, CitiesMetaData);
    addWMSLayer("Dams", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "6", true, DamsMetaData);
    addWMSLayer("Roads", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "5", true, RoadsmetaData);
    addWMSLayer("Rivers", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "4", true, RiversmetaData);
    addWMSLayer("Railroads", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "3", true, RailroadsmetaData);
    addWMSLayer("Indian Reservations", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "2", true, "Mdata for Indian Reservations not found");
    addWMSLayer("States", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "1", true, "Mdata for States not found");
    addWMSLayer("Counties", "https://geoserver.byu.edu/arcgis/services/Layers/ref_layer/MapServer/WmsServer?", "0", true, "Mdata for Countries not found");
    
    //addBYUServerLayer("US Counties", "https://geoserver.byu.edu/arcgis/rest/services/Layers/counties/MapServer", 0);
    //addBYUServerLayer("Dams", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 0);
    //addBYUServerLayer("Airports", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 1);
    //addBYUServerLayer("Cities", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 2);
    //addBYUServerLayer("Railroads", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 3);
    //addBYUServerLayer("Rivers", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 4);
    //addBYUServerLayer("Roads", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 5);
    //addBYUServerLayer("Indian Reservations", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 6);
    //addBYUServerLayer("States", "https://geoserver.byu.edu/arcgis/rest/services/Layers/ref_layer/MapServer", 7);

    addArcLayer("Solar Energy Zones", "http://solarmapper.anl.gov/ArcGIS/rest/services/SEZ_Map_Service_SDE/MapServer", "1,2", "MetaData for Solar Energy Zones Not Found");



    //Note: the function doesn't work for this layer - it needs some peculiar values
    //addWMSLayer("EPA Contaminated Lands", "http://mapsdb.nrel.gov/geoserver/geothermal_prospector/wms?", "geothermal_prospector:Brownfields", true);

    var wms = new OpenLayers.Layer.WMS(
        //"<img class=\"on_c_img\" mdata= ' MetaData for EPA Brownfield Sites Not Found' src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png'  style='width:20px; height:20px'> " + "EPA Brownfield Sites",
        "EPA Brownfield Sites",
        "http://mapsdb.nrel.gov/geoserver/geothermal_prospector/wms?",
        {
            layers: "geothermal_prospector:Brownfields",
            transparent: true,
            //srs: "EPSG:3857",
            format: "image/gif",
        }, {
            opacity: 0.5,
            isBaseLayer: false
        });

    wms.setVisibility(false);
    wms.epsgOverride = "EPSG:3857";
    wms.isReferenceLayer = true;
    pvMapper.map.addLayer(wms);



    //var slope = new OpenLayers.Layer.WMS(
    //        "Slope",
    //        "http://mapsdb.nrel.gov/jw_router/DNI_slope_3/tile",
    //        {
    //            layers: "DNI_slope_3",
    //            format: "image/gif",
    //            transparent: "true",
    //            maxResolution: 156543.0339,
    //        },
    //        {
    //            isBaseLayer: false,
    //            wrapDateLine: true
    //        }
    //    );
    //slope.setOpacity(0.3);
    //slope.setVisibility(false);
    //$.jGrowl("Adding Slope");
    //pvMapper.map.addLayer(slope);

    //Note: this isn't working ...
    //var blueMarble = new OpenLayers.Layer.WMS(
    //        "Global Imagery",
    //        "http://maps.opengeo.org/geowebcache/service/wms", {
    //            layers: "bluemarble",
    //        });
    //pvMapper.map.addLayer(blueMarble);

    //Note: this is hideous...
    //var openLayersWmsThing = new OpenLayers.Layer.WMS(
    //    "OpenLayers",
    //    "http://vmap0.tiles.osgeo.org/wms/vmap0?", {
    //        layers: 'basic',
    //        projection: new OpenLayers.Projection("EPSG:900913")
    //    });
    //openLayersWmsThing.epsgOverride = "EPSG:900913";
    //pvMapper.map.addLayer(openLayersWmsThing);


    //Note: this map is pretty ugly...
    var esriWorldTerrain = new OpenLayers.Layer.XYZ("Shaded Relief",
        "http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/${z}/${y}/${x}?blankTile=true",
            { transitionEffect: "resize", buffer: 1, sphericalMercator: true });
    pvMapper.map.addLayer(esriWorldTerrain);
    /*
    var esriWorldTerrain = new OpenLayers.Layer.ArcGIS93Rest(
        "Shaded Relief",
        "http://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/export",
        {
            layers: "0",
            format: "gif",
            srs: "3857",
            transparent: "true",
        });
    esriWorldTerrain.setIsBaseLayer(true);
    esriWorldTerrain.epsgOverride = "3857";
    pvMapper.map.addLayer(esriWorldTerrain);
    */

    var esriImagery = new OpenLayers.Layer.XYZ("World Imagery", 
        "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}?blankTile=true",
            { transitionEffect: "resize", buffer: 1, numZoomLevels: 20, sphericalMercator: true });
    pvMapper.map.addLayer(esriImagery);

    var esriStreet = new OpenLayers.Layer.XYZ("ESRI Street Map",
        "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}?blankTile=true",
            { transitionEffect: "resize", buffer: 1, sphericalMercator: true });
    pvMapper.map.addLayer(esriStreet);


    var usgsTopoCache = new OpenLayers.Layer.XYZ("USGS Topo", 
        "http://basemap.nationalmap.gov/ArcGIS/rest/services/USGSTopo/MapServer/tile/${z}/${y}/${x}?blankTile=true",
            { transitionEffect: "resize", buffer: 1, sphericalMercator: true });
    //usgsTopoCache.zoomOffset = 3; //Note: this seems to hoark the spherical mercator setting...
    pvMapper.map.addLayer(usgsTopoCache);


    // Add the power line and substation data layer
    //http://t0.beta.itoworld.com/4/317c99f331113b90c57c41ccdb137030/${z}/${x}/${y}.png
    osmPowerInfrastructure = new OpenLayers.Layer.XYZ("Power Infrastructure",
        "http://t0.beta.itoworld.com/4/317c99f331113b90c57c41ccdb137030/${z}/${x}/${y}.png",
            { transitionEffect: null, buffer: 1, sphericalMercator: true, isBaseLayer: false, visibility: false });
    pvMapper.map.addLayer(osmPowerInfrastructure);


    //Set up the layer for the site polys
    //If a style is applied at the layer level, then 
    //when a label is applied, the engine draws it incorrectly
    //For this reason the style is defined here, but used only when a 
    //feature is added

    var siteStyleMap = new OpenLayers.StyleMap();

    siteStyleMap.styles.select.addRules([
        new OpenLayers.Rule({
            symbolizer: {
                "Point": {
                    pointRadius: 5,
                    fillOpacity: 0.25,
                    fillColor: "white",
                },
            }
        }),
    ]);

    siteStyleMap.styles.default.addRules([
        new OpenLayers.Rule({
            symbolizer: {
                "Polygon": {
                    fontSize: "14px",
                    label: "${name}",
                    labelOutlineColor: "#fab715",
                    strokeWidth: 2,
                }
            }
        }),
    ]);

    siteStyleMap.styles.default.addRules([
        new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                //Note: just leaving this filter here to ensure that we don't recolor sites which don't have a valid score
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "overallScore",
                lowerBoundary: 0,
                upperBoundary: 100,
            }),
            symbolizer: {
                //"Polygon": {
                    // wow... that was easy
                    fillColor: "${fillColor}",
                    labelOutlineColor: "${fillColor}",
                //}
            }
        }),
    ]);

    pvMapper.siteLayer.styleMap = siteStyleMap;

    pvMapper.map.addLayer(pvMapper.siteLayer);

    // set up site selection and highlighting controls
    //var highlightControl = new OpenLayers.Control.SelectFeature(
    //    pvMapper.siteLayer,
    //    {
    //        hover: true,
    //        highlightOnly: true,
    //        renderIntent: "temporary"
    //    });
    //map.addControl(highlightControl);
    //highlightControl.activate();

    //var selectControl = pvMapper.selectControl; // new OpenLayers.Control.SelectFeature(pvMapper.siteLayer);
    //map.addControl(selectControl);
    //selectControl.initLayer(pvMapper.siteLayer); <-- breaks later in selectControl.activate();
    //selectControl.setLayer(pvMapper.siteLayer); <-- breaks immediately
    //selectControl.activate();

    //pvMapper.selectControl = selectControl;

    //var selectSiteControl = new OpenLayers.Control.SelectFeature(
    //    pvMapper.siteLayer,
    //    {
    //        clickout: true, toggle: true,
    //        multiple: false, hover: false,
    //        toggleKey: "ctrlKey", // ctrl key removes from selection
    //        multipleKey: "shiftKey", // shift key adds to selection
    //        //box: true,
    //    });
    //map.addControl(selectSiteControl);

    //Custom calls to attach event listeners to info icon. 



    function addArcLayer(name, url, layerNumber,mdata) {

        var layer = new OpenLayers.Layer.ArcGIS93Rest(
            //"<img class=\"on_c_img\" mdata='" + mdata + "' src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png' style='width:20px; height:20px'> " + name,
            name,
            url + "/export",
            {
                f: "image",
                layers: "show: " + layerNumber,
                //bbox: "-1.4206537879290022E7,4093175.1430570777,-7133549.99921288,7889772.508363001",
                transparent: true,
                format: "gif",
                srs: "3857", //"102100",
            },
            {
                isBaseLayer: false,
            }
        );
        layer.setOpacity(0.5);
        layer.epsgOverride = "3857"; //"EPSG:102100";
        layer.setVisibility(false);
        layer.isReferenceLayer = true;
        pvMapper.map.addLayer(layer);
        console.log(name + " Overlay added");
    }

    /*
        name: string - name of layer as displayed in the GUI
        url: string - url of the wms service
        layer: string - the name of the layer in the server
        reference: boolean - is it a reference layer? true/false
    */
    function addWMSLayer(name, url, layer, reference,mdata) {
        var wms = new OpenLayers.Layer.WMS(//"<img class= \"on_c_img\" mdata='"+mdata+ "' src='http://www.iconsdb.com/icons/preview/tropical-blue/info-xxl.png'  style='width:20px; height:20px'> " + name,
            name,
            url,
            {
                layers: layer,
                transparent: true,
                //srs: "3857",
                format: "gif",
            }, {
                opacity: 0.5,
                isBaseLayer: false
            });
        wms.setVisibility(false);
        wms.epsgOverride = "3857";
        wms.isReferenceLayer = reference;
        pvMapper.map.addLayer(wms);
        console.log(name + " Overlay added");
    }
});
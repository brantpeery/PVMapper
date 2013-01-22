////    OpenLayers.ImgPath = "../img/"

pvMapper.onReady(function () {

    //// default controls to show in map.
    //pvMapper.map.addControl(new OpenLayers.Control.PanZoomBar({ zoomWorldIcon: false, zoomStopHeight: 2 }));
    pvMapper.map.addControl(new OpenLayers.Control.LayerSwitcher({ 'ascending': true }));
    pvMapper.map.addControl(new OpenLayers.Control.KeyboardDefaults());

});
/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />
var pvMapper;
(function (pvMapper) {
    pvMapper.readyEvent = new pvMapper.Event();
    function onReady(fn) {
        pvMapper.readyEvent.addHandler(fn);
    }
    pvMapper.onReady = onReady;
    pvMapper.map;
})(pvMapper || (pvMapper = {}));

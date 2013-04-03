var pvMapper;
(function (pvMapper) {
    pvMapper.readyEvent = new pvMapper.Event();
    function onReady(fn) {
        pvMapper.readyEvent.addHandler(fn);
    }
    pvMapper.onReady = onReady;
    pvMapper.map;
    pvMapper.siteLayer;
})(pvMapper || (pvMapper = {}));

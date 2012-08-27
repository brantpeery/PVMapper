(function () {

    var site = pvMapper.getSelectedSite();
    if (site) {
        // todo: tools need a way to get their ID, or the postScore should figure it out for them.
        var geo = site.geometry;
        var area = geo.getGeodesicArea();
        var kmArea = area / 1000000;
        pvMapper.postScore(kmArea, kmArea, site.fid, "501062b7440aa11aa044d222");
        $.jGrowl("Submitted area: " + kmArea);
    }
})();
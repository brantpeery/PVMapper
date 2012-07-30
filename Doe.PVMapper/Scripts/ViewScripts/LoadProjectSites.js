Ext.onReady(function () {
  
     $.get("/api/ProjectSite/")
        .done(function( sites ) { 
            for (var i = 0; i < sites.length; i++)
            {
    // api/ProjectSite/ will return ids of sites. This seems to be a bug.
               pvMapper.getSite(sites[i].id)
                 .done(function (site) {
                       // todo: load users's site when loading the map.
                 });
            }
    });
 
});
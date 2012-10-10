(function (pvM) {
    pvMapper.dataManger = {
        // todo: update to use secret and token.
        postScore: function (score, rank, siteId, toolId) {
            $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId },
               function (data) {
                   // refresh scoreboard.
                   Ext.getCmp('scoreboard-grid-id').store.load();
                   Ext.getCmp('scoreboard-grid-id').getView().refresh();
               });
        },
        getSite: function (siteId) {
            return $.get("/api/ProjectSite/" + siteId);
        },
        postSite: function (name, description, polygonGeometry) {
            return $.post("/api/ProjectSite", { name: name, description: description, isActive: true, polygonGeometry: polygonGeometry });
        },
        updateSite: function (siteId, name, description, polygonGeometry) {

            //Only send the stuff that was passed into this function.
            var data = { id: siteId, isActive: true };
            if (name) { data.name = name; }
            if (description) { data.description = description; }
            if (polygonGeometry) { data.polygonGeometry = polygonGeometry; }

            return $.ajax("/api/ProjectSite", {
                data: data,
                type: "POST",
                done: function () {
                    pvMapper.displayMessage("The site changes were saved", "info");
                },
                fail: function () {
                    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.", "warning";)
            }
            });
            pvMapper.displayMessage("The site has been updated.", "info");
        },
        //Deletes a site from the datastore
        deleteSite: function (siteId) {
            return $.ajax("/api/ProjectSite/" + siteId, {
                data: { Id: siteId }, type: "DELETE",
                done: function () {
                    pvMapper.displayMessage("The site was deleted from the database.", "help");
                },
                fail: function () {
                    pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
                }
            });
        },
    }
})(pvMapper);
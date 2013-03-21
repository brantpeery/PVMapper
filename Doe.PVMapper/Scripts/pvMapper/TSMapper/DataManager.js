/// <reference path="common.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />
/// <reference path="Score.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    //Just to trick TypeScript into believing that we are creating an Ext object
    //to by pass development time compiler
    if(typeof (Ext) === 'undefined') {
        var Ext;
    }
    var SiteData = (function () {
        function SiteData() { }
        return SiteData;
    })();
    pvMapper.SiteData = SiteData;    
    // Class
    var dataManager = (function () {
        // Constructor
        function dataManager() {
        }
        dataManager.prototype.postScore = function (score, rank, siteId, toolId) {
            $.post("/api/SiteScore", {
                score: score,
                rank: rank,
                siteId: siteId,
                toolId: toolId
            }, function (data) {
                // refresh scoreboard.
                //Ext.getCmp('scoreboard-grid-id')).store.load();
                //Ext.getCmp('scoreboard-grid-id').getView().refresh();
                var grid = Ext.getCmp('scoreboard-grid-id');
                grid.store.load();
                grid.getView().refresh();
            });
        };
        dataManager.prototype.getSite = function (siteId) {
            return $.get("/api/ProjectSite/" + siteId);
        };
        dataManager.prototype.postSite = function (aName, aDesc, aPolygon) {
            return $.post("/api/ProjectSite", {
                name: aName,
                description: aDesc,
                isActive: true,
                polygonGeometry: aPolygon
            });
        };
        dataManager.prototype.updateSite = function (siteId, aName, aDesc, aPoly) {
            //Only send the stuff that was passed into this function.
            var data = new SiteData();
            data.id = siteId;
            data.isActive = true;
            if(aName) {
                data.name = aName;
            }
            if(aDesc) {
                data.description = aDesc;
            }
            if(aPoly) {
                data.polygon = aPoly;
            }
            return $.ajax("/api/ProjectSite", {
                data: data,
                type: "PUT",
                done: function () {
                    pvMapper.displayMessage("The site changes were saved", "Info");
                },
                fail: function () {
                    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.", "Warning");
                }
            });
            pvMapper.displayMessage("The site has been updated.", "Info");
        };
        dataManager.prototype.deleteSite = //Deletes a site from the datastore
        function (siteId) {
            return $.ajax("/api/ProjectSite/" + siteId, {
                data: {
                    Id: siteId,
                    type: "DELETE",
                    done: function () {
                        pvMapper.displayMessage("The site was deleted from the database.", "Warning");
                    },
                    fail: function () {
                        pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
                    }
                }
            });
        };
        return dataManager;
    })();
    pvMapper.dataManager = dataManager;    
})(pvMapper || (pvMapper = {}));

/// <reference path="common.ts" />
/// <reference path="Score.ts" />
/// <reference path="../../ExtJS.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    //Just to trick TypeScript into believing that we are creating an Ext object
    //to by pass development time compiler
    //   if (typeof(Ext) === 'undefined') var Ext: ;
    var ClientDB = (function () {
        function ClientDB() {
        }
        ClientDB.initClientDB = function () {
            var me = this;
            if (!ClientDB.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                return;
            }

            if (ClientDB.db)
                return;

            try  {
                if (!ClientDB.isDBCreating) {
                    ClientDB.isDBCreating = true;
                    var dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    dbreq.onsuccess = function (evt) {
                        console.log("Database [PVMapperScores] is open sucessful.");
                        ClientDB.db = evt.currentTarget.result;
                    };

                    dbreq.onerror = function (event) {
                        me.clientDBError = true;
                        console.log("indexedDB open error: " + event.message);
                    };

                    dbreq.onupgradeneeded = function (evt) {
                        try  {
                            var objStore = evt.currentTarget.result.createObjectStore(ClientDB.STORE_NAME, { keypath: "title" });

                            //objStore.createIndex("title", "title", { unique: true });
                            ClientDB.db = evt.currentTarget.result;
                        } catch (e) {
                            console.log("Creating object store failed, cause: " + e.message);
                        }
                    };
                }
            } catch (e) {
                console.log("initDB error, cause: " + e.message);
            }
            return null;
        };
        ClientDB.DB_NAME = "PVMapperData";
        ClientDB.STORE_NAME = "PVMapperScores";
        ClientDB.db = null;
        ClientDB.DBVersion = 2;

        ClientDB.indexedDB = window.indexedDB || window.msIndexedDB;

        ClientDB.isDBCreating = false;
        ClientDB.clientDBError = false;
        return ClientDB;
    })();
    pvMapper.ClientDB = ClientDB;

    var SiteData = (function () {
        function SiteData() {
        }
        return SiteData;
    })();
    pvMapper.SiteData = SiteData;

    // Class
    var dataManager = (function () {
        // Constructor
        function dataManager() {
        }
        dataManager.prototype.postScore = function (score, rank, siteId, toolId) {
            $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId }, function (data) {
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
            if (aName)
                data.name = aName;
            if (aDesc)
                data.description = aDesc;
            if (aPoly)
                data.polygon = aPoly;

            return $.ajax("/api/ProjectSite", {
                data: data,
                type: "PUT"
            });
            //pvMapper.displayMessage("The site has been updated.","Info");
        };

        //Deletes a site from the datastore
        dataManager.prototype.deleteSite = function (siteId) {
            return $.ajax("/api/ProjectSite/" + siteId, {
                data: {
                    Id: siteId,
                    type: "DELETE"
                }
            });
        };
        return dataManager;
    })();
    pvMapper.dataManager = dataManager;
})(pvMapper || (pvMapper = {}));

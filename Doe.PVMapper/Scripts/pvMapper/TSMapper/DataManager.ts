/// <reference path="common.ts" />
/// <reference path="Score.ts" />
/// <reference path="../../ExtJS.d.ts" />


// Module
module pvMapper {
   //Just to trick TypeScript into believing that we are creating an Ext object
   //to by pass development time compiler
//   if (typeof(Ext) === 'undefined') var Ext: ;

    export class ClientDB {

        public static DB_NAME: string = "PVMapperData";
        public static STORE_NAME: string = "PVMapperScores";
        public static db: IDBDatabase = null;
        public static DBVersion = 2;

        public static indexedDB: IDBFactory = window.indexedDB || window.msIndexedDB; // || window.webkitIndexedDB || window.mozIndexedDB 

        public static isDBCreating = false;
        public static clientDBError: boolean = false;
        public static initClientDB() {
            var me = this;
            if (!ClientDB.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                return;                         
            }

            if (ClientDB.db) return;//already have database object.

            try {
                if (!ClientDB.isDBCreating) {
                    ClientDB.isDBCreating = true;
                    var dbreq: IDBOpenDBRequest = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    dbreq.onsuccess = function (evt): any {
                        console.log("Database [PVMapperScores] is open sucessful.");
                        ClientDB.db = evt.currentTarget.result;
                        
                    }

                    dbreq.onerror = function (event: ErrorEvent): any {
                        me.clientDBError = true;
                        console.log("indexedDB open error: " + event.message);
                    }

                    dbreq.onupgradeneeded = function (evt): any {
                        try {
                            var objStore = evt.currentTarget.result.createObjectStore(ClientDB.STORE_NAME, { keypath: "title" });
                            //objStore.createIndex("title", "title", { unique: true });
                            ClientDB.db = evt.currentTarget.result;
                        }
                        catch (e) {
                            console.log("Creating object store failed, cause: " + e.message);
                        }
                    }
                }
            }
            catch (e) {
                console.log("initDB error, cause: " + e.message);
            }
            return null;
        }
    }


  export class SiteData{
    id: string;
    isActive: Boolean;
    name: string;
    description: string;
    polygon: OpenLayers.Polygon;
  }
  // Class
  export class dataManager {
    // Constructor
    constructor () { }



    public postScore(score: pvMapper.Score, rank: number, siteId: string, toolId: string) {
      $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId },
        function (data: any) {
          // refresh scoreboard.
          //Ext.getCmp('scoreboard-grid-id')).store.load();
          //Ext.getCmp('scoreboard-grid-id').getView().refresh();
          var grid: Ext.grid.IPanel = Ext.getCmp('scoreboard-grid-id');
          grid.store.load();
          grid.getView().refresh();
        });
    }

    public getSite(siteId : string) {
      return $.get("/api/ProjectSite/" + siteId);
    }

    public postSite (aName:string,aDesc:string,aPolygon:OpenLayers.Polygon) {
        return $.post("/api/ProjectSite", {
            name: aName,
            description: aDesc,
            isActive: true,
            polygonGeometry: aPolygon
        });
    }

    public updateSite(siteId:string,aName:string, aDesc:string, aPoly){
      //Only send the stuff that was passed into this function.
      var data: SiteData = new SiteData();
      data.id = siteId;
      data.isActive = true;
      if (aName) data.name = aName;
      if (aDesc) data.description = aDesc;
      if (aPoly) data.polygon = aPoly;

      return $.ajax("/api/ProjectSite", {
        data:data,
        type:"PUT",
        //done: function () {
        //    pvMapper.displayMessage("The site changes were saved","Info");
        //  },
        //  fail: function () {
        //    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.","Warning");
        //  }
        });
        //pvMapper.displayMessage("The site has been updated.","Info");
    }

    //Deletes a site from the datastore
    public deleteSite(siteId: string) {
      return $.ajax("/api/ProjectSite/" + siteId, {
        data: {
          Id: siteId,
          type: "DELETE",
          //done: function () {
          //  pvMapper.displayMessage("The site was deleted from the database.", "Warning");
          //},
          //fail: function () {
          //  pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
          //}
        }
      });
    }
  }

}


/// <reference path="common.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />
/// <reference path="Score.ts" />


// Module
module pvMapper {
   //Just to trick TypeScript into believing that we are creating an Ext object
   //to by pass development time compiler
   if (typeof(Ext) === 'undefined') var Ext: Ext;


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
          var grid: Ext_panel_Table = <Ext_panel_Table>Ext.getCmp('scoreboard-grid-id');
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

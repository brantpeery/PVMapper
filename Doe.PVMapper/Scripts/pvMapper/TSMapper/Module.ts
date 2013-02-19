/// <reference path="Scoreboard.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Tools.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />


// Module
module pvMapper {

    // Class
    export class Module {
        constructor(options: IModuleOptions) {
            this.id = options.id;
            this.version = options.version;
            this.author = options.author;

            this.init = options.init;
            this.destroy = options.destroy;
            this.activate = options.activate;
            this.deactivate = options.deactivate;

            this.scoringTools = options.scoringTools;
            this.infoTools = options.infoTools;

            //Load the info for this module into the data model

            //Load the scoring tools into the api
            this.scoringTools.map((tool, idx, toolarr) => {
                console.log("Loading scoring tool " + tool.title + " into the API");
                 
                //Create the scoreline
                var scoreline = new ScoreLine(tool);

                //Add the scoreline to the scoreboard/data model
                pvMapper.mainScoreboard.addLine(scoreline);
            });

            //Load up the info tools into the api
            this.infoTools.map((tool, idx, toolbar) => {
                console.log("Loading info tool " + tool.title + " into the API");
                
                //TODO: Tie to the data model when ready 

            });
        }

        public id: string;
        public author: string;
        public version: string;

        public scoringTools: IScoreTool[];
        public infoTools: ITool[];
        
        
        public init: ICallback;
        public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;

    }

}



    /*************************************************
    //Old module code here for reference only

            // Constructor
        constructor(options: any) {
            this.settings =

            this.self = this;
            this.id = (typeof (this.self.settings.id) === 'string') ? this.self.settings.id : '';
            this.author = (typeof (this.self.settings.author) === 'string') ? this.self.settings.author : '';
            this.scoringTools = new ScoringTool[]();
            var st: ScoringTool = new ScoringTool();
            st.calculateCallback = this.calculateSiteArea;
            st.updateCallback = this.updateSetbackFeature;

            this.scoringTools.push(st);
        }




        public self: Module;
        public defaults: Module;
        public id: string = "";
        public author: string = "";
        public version: string = "";

        //Called when the tool is loaded as a module.
        public init() { };
            //Called when the tool needs to completely remove itself from the interface and object tree
        public destroy() { };
            //Called when the tool is checkmarked or activated by the system or user
        public activate() { };
            //Called when the tool is unchecked or deactivated by the system or user
        public deactivate() { };

        public settings: Module; // = $.extend({}, this.defaults, options);

        public nonScoringTools: any[];
        public scoringTools: ScoringTool[];
        public addScoringTool(scoreTool: ScoringTool) {
            this.scoringTools.push(scoreTool);
        }
        public removeScoringTool(scoreTool: ScoringTool) {
            var idx: number = this.scoringTools.indexOf(scoreTool, 0);
            if (idx >= 0)
                this.scoringTools.splice(idx, 1);
        }

        public calculateArea(polygon: OpenLayers.Polygon): number {

            var proj: OpenLayers.Projection = new OpenLayers.Projection('EPSG:900913');
            var area: number = polygon.getGeodesicArea(proj);
            var kmArea = area / 1000000;

            return Math.round(kmArea * 100) / 100;
        }

        public calculateSiteArea(site: Site): number {
            //Use the geometry of the OpenLayers feature to get the area
            var val = this.calculateArea(site.feature.geometry);
            return val;

        }

        public setbackLayer: any;

        

    public updateSetbackFeature(site: pvMapper.Site, setbackLength ? : number): any {
        var reader = new jsts.io.WKTReader();
        var parser = new jsts.io.OpenLayersParser();

        var input = parser.read(site.feature.geometry);
        var buffer = input.buffer(-1 * setbackLength); //Inset the feature
        var newGeometry = parser.write(buffer);

        if (!this.setbackLayer) {
            this.setbackLayer = new OpenLayers.Layer.Vector("Site Setback");
            pvMapper.map.addLayer(this.setbackLayer);
        }

        if (site.offsetFeature) {
            //Redraw the polygon
            this.setbackLayer.removeFeatures(site.offsetFeature);
            site.offsetFeature.geometry = newGeometry; //This probably wont work
        } else {
            var style = { fillColor: 'blue', fillOpacity: 0, strokeWidth: 3, strokeColor: "purple" };
            site.offsetFeature = new OpenLayers.Feature.Vector(newGeometry, { parentFID: site.feature.fid }, style);
        }
        this.setbackLayer.addFeatures(site.offsetFeature);

        return 0;
    }

    };

    export var map: any = new OpenLayers.Map();
*/
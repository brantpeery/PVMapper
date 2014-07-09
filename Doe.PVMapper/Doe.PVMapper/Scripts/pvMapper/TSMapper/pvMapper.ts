/// <reference path="Tools.ts" />
/// <reference path="InfoTools.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />

module pvMapper {


    export var readyEvent: pvMapper.Event = new pvMapper.Event;

    export var mapToolbar: Ext.toolbar.IToolbar; // The main toolbar above the map

    export var sitesToolbarMenu: Ext.menu.IMenu; // The site sub-menu in the toolbar
    export var scoreboardToolsToolbarMenu: Ext.menu.IMenu; // The scoreboard tools sub-menu in the toolbar
    export var reportsToolbarMenu: Ext.menu.IMenu; // The Reports sub-menu in the toolbar
    export var linksToolbarMenu: Ext.menu.IMenu; // The links sub-menu in the toolbar

    //export var infoTools: IInfoTool[] = [];

    export var isReady: boolean = false;

    export function onReady(fn: ICallback) {
        if (isReady) fn();
        else readyEvent.addHandler(fn);
    }

    export var map: OpenLayers.IMap;
    export var siteLayer: any;
    //export var customModules: ICustomModuleHandle[] = new Array<ICustomModuleHandle>();
    export var waitToLoad: any = null;
    //export var clientScripts: string;
    export function getColorForScore(score: number): string {
        var min = Math.min;
        var max = Math.max;
        var round = Math.round;

        var startColor = {
            red: 255,
            green: 0,
            blue: 0
        };
        var midColor = {
            red: 255,
            green: 255,
            blue: 100
        };
        var endColor = {
            red: 173,
            green: 255,
            blue: 47
        };

        var scale = 0;
        score = round(min(100, max(0, score)));
        if (score > 50) {
            startColor = midColor;
            scale = score / 50 - 1;
        } else {
            endColor = midColor;
            scale = score / 50;
        }

        //var r = startColor['red'] + scale * (endColor['red'] - startColor['red']);
        //var b = startColor['blue'] + scale * (endColor['blue'] - startColor['blue']);
        //var g = startColor['green'] + scale * (endColor['green'] - startColor['green']);
        var r = startColor.red + scale * (endColor.red - startColor.red);
        var b = startColor.blue + scale * (endColor.blue - startColor.blue);
        var g = startColor.green + scale * (endColor.green - startColor.green);
        r = round(min(255, max(0, r)));
        b = round(min(255, max(0, b)));
        g = round(min(255, max(0, g)));

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    //export function addInfoTool(tool:IInfoTool) {
    //    infoTools.push(tool);
    //    tool.init();
    //}

    //readyEvent.addHandler(function () {
    //    //Activate all the info tools
    //    infoTools.map(function (tool, idx) {
    //        tool.activate();
    //    });
    //})

    export function getIncludeModules() { return null; }

    export var displayMessage: (msg: string, type: string) => void;

    export var getSite: (siteId: string) => JQueryXHR;
    export var postSite: (name: string, description: string, polygonGeometry: string) => JQueryXHR;
    export var updateSite: (siteId: string, name: string, description: string, polygonGeometry: string) => JQueryXHR;
    export var deleteSite: (siteId: string) => JQueryXHR;
    export var deleteAllSites: () => JQueryXHR;
}

//allow jquery to cache all ajax get from server.
$.ajaxSetup({ cache: true });

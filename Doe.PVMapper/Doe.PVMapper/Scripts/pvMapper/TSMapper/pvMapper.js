/// <reference path="Tools.ts" />
/// <reference path="InfoTools.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />
var pvMapper;
(function (pvMapper) {
    pvMapper.readyEvent = new pvMapper.Event;

    pvMapper.mapToolbar;

    pvMapper.sitesToolbarMenu;
    pvMapper.scoreboardToolsToolbarMenu;
    pvMapper.reportsToolbarMenu;
    pvMapper.linksToolbarMenu;

    //export var infoTools: IInfoTool[] = [];
    pvMapper.isReady = false;

    function onReady(fn) {
        if (pvMapper.isReady)
            fn();
        else
            pvMapper.readyEvent.addHandler(fn);
    }
    pvMapper.onReady = onReady;

    pvMapper.map;
    pvMapper.siteLayer;

    //export var customModules: ICustomModuleHandle[] = new Array<ICustomModuleHandle>();
    pvMapper.waitToLoad = null;

    //export var clientScripts: string;
    function getColorForScore(score) {
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
    pvMapper.getColorForScore = getColorForScore;

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
    function getIncludeModules() {
        return null;
    }
    pvMapper.getIncludeModules = getIncludeModules;

    pvMapper.displayMessage;

    pvMapper.getSite;
    pvMapper.postSite;
    pvMapper.updateSite;
    pvMapper.deleteSite;
    pvMapper.deleteAllSites;
})(pvMapper || (pvMapper = {}));

//allow jquery to cache all ajax get from server.
$.ajaxSetup({ cache: true });
//# sourceMappingURL=pvMapper.js.map

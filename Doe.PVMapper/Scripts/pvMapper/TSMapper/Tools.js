var pvMapper;
(function (pvMapper) {
    })(pvMapper || (pvMapper = {}));
/**
An example of how to create a tool using the ITool interface

var mytool: IScoreTool = {
title: "ThisTool",
description: "My super sweet score thingy",
init: null,
destroy: null,
activate: null,
deactivate: null,
calculateValueCallback: function (site: pvMapper.Site) {
return 1;
},
onSiteChange: null,
onScoreAdded: function (context: any, event: EventArg, score: pvMapper.Score) => void {}
};

An example of loading the tool after creating it

var myothertool: IScoreTool;
myothertool.title = "Other Tool";
myothertool.calculateValueCallback = (site: Site) => {
return 1;
}
myothertool.description = "Some cool tool that does stuff";
//Finish fleshing out all members of the interface...

*/
/**
An example of how to create a tool using the ITool interface

var mytool: IScoreTool = {
title: "ThisTool",
description: "My super sweet score thingy",
init: null,
destroy: null,
activate: null,
deactivate: null,
calculateValueCallback: function (site: pvMapper.Site) {
return 1;
},
onSiteChange: null,
onScoreAdded: function (context: any, event: EventArg, score: pvMapper.Score) => void {}
};

An example of loading the tool after creating it

var myothertool: IScoreTool;
myothertool.title = "Other Tool";
myothertool.calculateValueCallback = (site: Site) => {
return 1;
}
myothertool.description = "Some cool tool that does stuff";
//Finish fleshing out all members of the interface...

*/

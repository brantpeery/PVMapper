/// <reference path="Scoreboard.ts" />
/// <reference path="ScoreLine.ts" />
/// <reference path="Tools.ts" />
/// <reference path="OpenLayers.d.ts" />
/// <reference path="../../jquery.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    

    // Class
    var Module = (function () {
        function Module(moduleInfo) {
            var _this = this;
            this.init = function (options) {
                if (console && console.assert)
                    console.assert(options && !_this.options, "Warning: attempting to initialize an already initialized module");
                _this.options = options;

                // make sure our required attributes have been defined by the inheriting class...
                if (console && console.assert)
                    console.assert(!!(_this.id && _this.author && _this.version && _this.url && _this.title && _this.category && _this.description, "Warning: initializing module '" + (_this.id || _this.title) + "' without a required property."));

                _this.scoreTools = (_this.scoreTools || []).concat((options.scoringTools || []).map(function (t) {
                    return new pvMapper.ScoreLine(t, _this);
                }));

                _this.totalTools = (_this.totalTools || []).concat((options.totalTools || []).map(function (t) {
                    return new pvMapper.TotalLine(t, _this);
                }));

                _this.infoTools = (_this.infoTools || []).concat((options.infoTools || []).map(function (t) {
                    return new pvMapper.InfoTool(t, _this);
                }));
            };
            this.isActive = false;
            this.scoreTools = [];
            this.infoTools = [];
            this.totalTools = [];
            this.activate = function () {
                if (console && console.assert)
                    console.assert(pvMapper.isReady);

                if (_this.isActive) {
                    if (console && console.warn)
                        console.warn("Warning: attempting to activate an already active module ID='" + _this.id + "'");
                }

                if (!_this.isActive && _this.options && typeof (_this.options.activate) === "function")
                    _this.options.activate();

                //Load the info for this module into the data model
                //Load the scoring tools into the api
                _this.scoreTools.forEach(function (tool) {
                    if (!tool.isActive)
                        tool.activate();
                });

                //Load in the TotalLine tools into the api
                _this.totalTools.forEach(function (tool) {
                    pvMapper.mainScoreboard.addTotalLine(tool);
                });

                //Load up the info tools into the api
                _this.infoTools.forEach(function (tool) {
                    if (typeof (tool.activate) === "function")
                        tool.activate();
                });

                _this.isActive = true;
            };
            this.deactivate = function () {
                if (!_this.isActive) {
                    if (console && console.warn)
                        console.warn("Warning: attempting to deactivate an already inactive module ID='" + _this.id + "'");
                }

                //Load the info for this module into the data model
                //Load the scoring tools into the api
                _this.scoreTools.forEach(function (tool) {
                    if (tool.isActive)
                        tool.deactivate();
                });

                //Load in the TotalLine tools into the api
                _this.totalTools.forEach(function (tool) {
                    pvMapper.mainScoreboard.removeTotalLine(tool);
                });

                //Load up the info tools into the api
                _this.infoTools.forEach(function (tool) {
                    if (typeof (tool.deactivate) === "function")
                        tool.deactivate();
                });

                if (_this.options && typeof (_this.options.deactivate) === "function")
                    _this.options.deactivate();

                _this.isActive = false;
            };
            if (moduleInfo) {
                if (moduleInfo.id)
                    this.id = moduleInfo.id;
                if (moduleInfo.author)
                    this.author = moduleInfo.author;
                if (moduleInfo.version)
                    this.version = moduleInfo.version;
                if (moduleInfo.url)
                    this.url = moduleInfo.url;

                if (moduleInfo.title)
                    this.title = moduleInfo.title;
                if (moduleInfo.category)
                    this.category = moduleInfo.category;
                if (moduleInfo.description)
                    this.description = moduleInfo.description;
                if (moduleInfo.longDescription)
                    this.longDescription = moduleInfo.longDescription;

                //else if (moduleInfo.description) this.longDescription = "<p>" + moduleInfo.description + "</p>"; // backup plan for absent long descriptions...
                var modOptions = moduleInfo;
                if (modOptions.activate || modOptions.deactivate || modOptions.infoTools || modOptions.scoringTools || modOptions.totalTools)
                    this.init(modOptions);
            }
        }
        return Module;
    })();
    pvMapper.Module = Module;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=Module.js.map

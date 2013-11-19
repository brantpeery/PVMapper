/// <reference path="Tools.ts" />
/// <reference path="pvMapper.ts" />
var pvMapper;
(function (pvMapper) {
    var InfoTool = (function () {
        function InfoTool(options) {
            this.category = "Totals";
            this.title = options.title;

            //this.name = options.name;
            this.description = options.description;

            this.init = options.init || function () {
            };
            this.destroy = options.destroy || function () {
            };
            this.activate = options.activate || function () {
            };
            this.deactivate = options.deactivate || function () {
            };
        }
        return InfoTool;
    })();
    pvMapper.InfoTool = InfoTool;
})(pvMapper || (pvMapper = {}));

/// <reference path="Tools.ts" />
/// <reference path="pvMapper.ts" />
var pvMapper;
(function (pvMapper) {
    var InfoTool = (function () {
        function InfoTool(options) {
            var _this = this;
            this.category = "Totals";
            this.title = options.title;

            //this.name = options.name;
            this.category = options.category;
            this.description = options.description;
            this.longDescription = options.longDescription;

            this.init = options.init || function () {
            };
            this.destroy = options.destroy || function () {
            };
            this.activate = options.activate || function () {
            };
            this.deactivate = options.deactivate || function () {
            };

            if ($.isFunction(options.getModuleName)) {
                this.getModuleName = function () {
                    return options.getModuleName.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setModuleName)) {
                this.setModuleName = function (name) {
                    options.setModuleName.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.getTitle)) {
                this.getTitle = function () {
                    return options.getTitle.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.setTitle)) {
                this.setTitle = function (name) {
                    options.setTitle.apply(_this, arguments);
                };
            }
        }
        return InfoTool;
    })();
    pvMapper.InfoTool = InfoTool;
})(pvMapper || (pvMapper = {}));

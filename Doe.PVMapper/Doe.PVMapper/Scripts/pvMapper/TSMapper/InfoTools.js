/// <reference path="Tools.ts" />
/// <reference path="pvMapper.ts" />
var pvMapper;
(function (pvMapper) {
    var InfoTool = (function () {
        function InfoTool(options, parentModule) {
            var _this = this;
            this.category = "Totals";
            this.getModule = function () {
                return parentModule;
            };

            if (console && console.assert)
                console.assert(!!options.id, "Tool ID is required");
            this.id = options.id;

            this.title = options.title || (parentModule && parentModule.title) || 'Unnamed Tool';
            this.category = options.category || (parentModule && parentModule.category) || 'Other';
            this.description = options.description || (parentModule && parentModule.description) || "";
            this.longDescription = options.longDescription || (parentModule && parentModule.longDescription) || "<p>" + this.description + "</p>";

            //this.init = options.init || function () { };
            //this.destroy = options.destroy || function () { };
            //this.activate = options.activate || function () { };
            //this.deactivate = options.deactivate || function () { };
            //if ($.isFunction(options.getModuleName)) {
            //    this.getModuleName = () => { return options.getModuleName.apply(this, arguments); }
            //}
            //if ($.isFunction(options.setModuleName)) {
            //    this.setModuleName = (name: string) => { options.setModuleName.apply(this, arguments); }
            //}
            //if ($.isFunction(options.getTitle)) {
            //    this.getTitle = () => { return options.getTitle.apply(this, arguments); }
            //}
            //if ($.isFunction(options.setTitle)) {
            //    this.setTitle = (name: string) => { options.setTitle.apply(this, arguments); }
            //}
            if ($.isFunction(options.activate)) {
                this.activate = function () {
                    return options.activate.apply(_this, arguments);
                };
            }

            if ($.isFunction(options.deactivate)) {
                this.deactivate = function () {
                    return options.deactivate.apply(_this, arguments);
                };
            }
        }
        return InfoTool;
    })();
    pvMapper.InfoTool = InfoTool;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=InfoTools.js.map

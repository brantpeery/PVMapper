/// <reference path="Tools.ts" />
/// <reference path="pvMapper.ts" />


module pvMapper{
    export class InfoTool implements pvMapper.IInfoTool{
        constructor(options: IInfoToolOptions, parentModule: Module) {
            this.getModule = () => { return parentModule; };

            if (console && console.assert) console.assert(!!options.id, "Tool ID is required");
            this.id = /*((parentModule && parentModule.id) || "") + "." +*/ options.id;

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
                this.activate = () => { return options.activate.apply(this, arguments); }
            }

            if ($.isFunction(options.deactivate)) {
                this.deactivate = () => { return options.deactivate.apply(this, arguments); }
            }
        }

        public id: string;

        //public init: ICallback;
        //public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;

        public title: string;
        //public name: string;
        public description: string;
        public longDescription: string;

        public category = "Totals";
        
        //getModuleName: () => string;
        //setModuleName: (name: string) => void ;

        //getTitle: () => string;                     
        //setTitle: (newTitle: string) => void;

        public getModule: () => pvMapper.Module;
    }

}
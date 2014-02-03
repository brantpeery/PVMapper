/// <reference path="Tools.ts" />
/// <reference path="pvMapper.ts" />


module pvMapper{
    export class InfoTool implements pvMapper.IInfoTool{
        constructor (options: IInfoToolOptions){
            this.title = options.title;
            //this.name = options.name;
            this.category = options.category;
            this.description = options.description;
            this.longDescription = options.longDescription;

            this.init = options.init || function () { };
            this.destroy = options.destroy || function () { };
            this.activate = options.activate || function () { };
            this.deactivate = options.deactivate || function () { };

            if ($.isFunction(options.getModuleName)) {
                this.getModuleName = () => { return options.getModuleName.apply(this, arguments); }
            }

            if ($.isFunction(options.setModuleName)) {
                this.setModuleName = (name: string) => { options.setModuleName.apply(this, arguments); }
            }

            if ($.isFunction(options.getTitle)) {
                this.getTitle = () => { return options.getTitle.apply(this, arguments); }
            }

            if ($.isFunction(options.setTitle)) {
                this.setTitle = (name: string) => { options.setTitle.apply(this, arguments); }
            }

        }


        public init: ICallback;
        public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;
        public title: string;
        //public name: string;
        public description: string;
        public longDescription: string;

        public category = "Totals";
        
        getModuleName: () => string;
        setModuleName: (name: string) => void ;

        getTitle: () => string;                     
        setTitle: (newTitle: string) => void ;
    }

}
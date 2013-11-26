/// <reference path="Tools.ts" />
/// <reference path="pvMapper.ts" />


module pvMapper{
	export class InfoTool implements pvMapper.IInfoTool{
	    constructor (options: IInfoToolOptions){
            this.title = options.title;
            //this.name = options.name;
            this.description = options.description;
            this.longDescription = options.longDescription;

            this.init = options.init || function () { };
            this.destroy = options.destroy || function () { };
            this.activate = options.activate || function () { };
            this.deactivate = options.deactivate || function () { };
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
    }

}
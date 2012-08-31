/// <reference path="../_references.js" />

//Creates and registers a custom modual's attributes, tools and intents. 
(function (pvM) {
    //This is a factory     
    pvM.Module = function (options) {
        this.id = "";
        this.author = "";
        this.version = "";

        this.init = function () { };          //Called when the tool is loaded as a module.
        this.destroy = function () { };       //Called when the tool needs to completely remove itself from the interface and object tree
        this.activate = function () { };      //Called when the tool is checkmarked or activated by the system or user
        this.deactivate = function () { };    //Called when the tool is unchecked or deactivated by the system or user

        this.scoreboardLineItems

        function factory(settings) {
            var defaults = {
                id: "",
                author: "",
                version: "",

                init: function () { },          //Called when the tool is loaded as a module.
                destroy: function () { },       //Called when the tool needs to completely remove itself from the interface and object tree
                activate: function () { },      //Called when the tool is checkmarked or activated by the system or user
                deactivate: function () { },    //Called when the tool is unchecked or deactivated by the system or user
            };

            var settings = $.extend({}, defaults, options);

            this.id = settings.id;
            this.author = settings.author;
            this.version = settings.version;
            this.init = setting.init;
            this.destroy = settings.destroy;
            this.activate = settings.activate;
            this.deactivate = settings.deactivate;

            if (settings["scoringTools"]){
                for(tool in settings["scoringTools"]){
                    var newline = pvM.Scoreboard.addLine(

                }


        }

    }


    pvM.registerModule();
    pvM.registerSiteTool();
    pvM.register


})(pvMapper);

/// <reference path="../_references.js" />

//Creates and registers a custom modual's attributes, tools and intents. 
(function (pvM) {
    //This is a factory     
    pvM.Module = function (settings) {
        this.id = "";
        this.author = "";
        this.version = "";

        this.init = function () { };          //Called when the tool is loaded as a module.
        this.destroy = function () { };       //Called when the tool needs to completely remove itself from the interface and object tree
        this.activate = function () { };      //Called when the tool is checkmarked or activated by the system or user
        this.deactivate = function () { };    //Called when the tool is unchecked or deactivated by the system or user

        this.scoreboardLineItems      

    }


    pvM.registerModule();
    pvM.registerSiteTool();
    pvM.register


})(pvMapper);

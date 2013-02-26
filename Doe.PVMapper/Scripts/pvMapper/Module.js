/// <reference path="../_references.js" />
/// <reference path="pvMapper.js" />
/// <reference path="ScoreLine.js" />

//Creates and registers a custom modual's attributes, tools and intents. 
(function (pvM) {
    //This is a factory  

    /**
    Module Object
    Creates a module that is automatically wired up to the rest of the pvMapper objects according to the options passed in. 
    @param {Object} options The constructor options to be used to set the Module up. If the proper options are provided the Module will have all 
        the appropriate wireing to scores, buttons, and managers, etc...
    @return {pvMapper.Module} A new module object that is wired up to the PVMapper system according to the options passed in
    */
    pvM.Module = function (options) {
        var self = this;
        this.init = function () { };          //Called when the tool is loaded as a module.
        this.destroy = function () { };       //Called when the tool needs to completely remove itself from the interface and object tree
        this.activate = function () { };      //Called when the tool is checkmarked or activated by the system or user
        this.deactivate = function () { };    //Called when the tool is unchecked or deactivated by the system or user

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

        this.id = (typeof (settings.id) === 'string') ? settings.id : '';
        this.author = (typeof (settings.author) === 'string') ? settings.author : '';
        this.version = (typeof (settings.version) === 'string') ? settings.version : '';
        this.init = (typeof (settings.init) === 'function') ? settings.init : null;
        this.destroy = (typeof (settings.destroy) === 'function') ? settings.destroy : null;
        this.activate = (typeof (settings.activate) === 'function') ? settings.activate : null;
        this.deactivate = (typeof (settings.deactivate) === 'function') ? settings.deactivate : null;

        this.scoringTools = {};

        if (settings["scoringTools"]) {
            console.log("Loading scoring tools for module: " + this.id);
            $.each(settings["scoringTools"], function (idx, toolOptions) {

                /*debug*/console.log('Adding a line for ' + toolOptions.title);

                //TODO: Update this so it doesn't need a dependancy of pvM to contain a mainScoreboard object
                var tool = new pvM.ScoreLine(toolOptions);
                pvM.mainScoreboard.addLine(tool);

                //Add the scoring line to the scoring tools collection
                self.scoringTools[idx] = tool;
            });
        }

        //pvM.registerModule();
        //pvM.registerSiteTool();
    };
})(pvMapper);



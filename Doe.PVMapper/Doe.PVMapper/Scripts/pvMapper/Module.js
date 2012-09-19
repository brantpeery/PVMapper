/// <reference path="../_references.js" />
/// <reference path="pvMapper.js" />
/// <reference path="ScoreLine.js" />

//Creates and registers a custom modual's attributes, tools and intents. 
(function (pvM) {
    //This is a factory  

    /**
    Module Class
    Creates a module that is automatically wired up to the rest of the pvMapper objects according to the options passed in. 
    @param {Object} options The constructor options to be used to set the Module up. If the proper options are provided the Module will have all 
        the appropriate wireing to scores, buttons, and managers, etc...
    @return {pvMapper.Module} A new module object that is wired up to the PVMapper system according to the options passed in
    */
    pvM.Module = function (options) {          
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

        this.id = settings.id instanceof String && settings.id;
        this.author = settings.author instanceof String && settings.author;
        this.version = settings.version instanceof String && settings.version;
        this.init = setting.init instanceof String && setting.init;
        this.destroy = settings.destroy instanceof String && settings.destroy;
        this.activate = settings.activate instanceof String && settings.activate;
        this.deactivate = settings.deactivate instanceof String && settings.deactivate;

        if (settings["scoringTools"]) {
            for (toolOptions in settings["scoringTools"]) {
                //TODO: Update this so it doesn't need a dependancy of pvM to contain a mainScoreboard object
                var newline = new pvM.ScoreLine(toolOptions)
                pvM.mainScoreboard.addLine(tool);
            }
        }

        //pvM.registerModule();
        //pvM.registerSiteTool();
    }
})(pvMapper);



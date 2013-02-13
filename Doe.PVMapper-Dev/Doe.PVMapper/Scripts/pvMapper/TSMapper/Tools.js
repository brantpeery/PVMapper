var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="ModuleManager.d.ts" />
/// <reference path="common.ts" />
var pvMapper;
(function (pvMapper) {
    if(typeof (moduleManager) === 'undefined') {
        var moduleManager = new ModuleManager();
    }
    //#region ToolInfo
    /**
    A helper class stores tool module information.
    */
    var ToolInfo = (function () {
        function ToolInfo(mName, mURL, mOwner, mIsPublic, mDescription, mIsVisible) {
            this.moduleName = mName;
            this.moduleDescription = mDescription;
            this.moduleURL = mURL;
            this.owner = mOwner;
            this.isPublic = mIsPublic;
            this.isVisible = mIsVisible;
        }
        return ToolInfo;
    })();
    pvMapper.ToolInfo = ToolInfo;    
    //#endregion
    //#region ScoreTool
    /**
    A base class for creating scoring tool module. This class is for loading module using the ToolInfo helper class.
    */
    var ScoreTool = (function () {
        /**
        Creates a scoring tool module based on the information found in the parameter object.  Decendant class must make call
        to this constructor to register a module onto the ModuleManager.
        @param aToolInfo: ToolInfo - an object containing the module name, URL, description, owner, isPublic, and isVisible.
        */
        function ScoreTool(aToolInfo) {
            if(typeof (aToolInfo) === 'undefined') {
                var ex = new DOMException();
                ex.message = 'Registration error:  invalid or undefined ToolInfo object.';
                throw ex;
            }
            this.name = aToolInfo.moduleName;
            this.description = aToolInfo.moduleDescription;
            this.url = aToolInfo.moduleURL;
            this.owner = aToolInfo.owner;
            this.isPublic = aToolInfo.isPublic;
            this.isVisible = aToolInfo.isVisible;
            var aTool = this;
            moduleManager.add(aTool);
            moduleManager.activate(aTool);
        }
        ScoreTool.prototype.calculate = /**
        The scoring tool module's main calculation procedure.  This function must be overriden by descendant modules.
        @param args?: NameValueArray - an array containing NameValue pair.
        */
        function (args) {
            return 0;
        };
        ScoreTool.prototype.onClick = /**
        Fire when a user interface has a mouse clicked, if the module has user interface implementation.  Decendant class must override
        to subscribe to the onclick event.
        @param sender: any - the UI being clicked.
        @event: EventArg - event information about the event.
        */
        function (sender, event) {
        };
        ScoreTool.prototype.onChange = /**
        Fire when a user interface has requested something to be updated.  Decendant class must override
        to subscribe to this onChange event.
        @param sender: any - the UI being clicked.
        @event: EventArg - event information about the event.
        */
        function (sender, event) {
        };
        ScoreTool.prototype.onActivate = function (sender, event) {
        };
        ScoreTool.prototype.onDeactivate = function (sender, event) {
        };
        return ScoreTool;
    })();
    pvMapper.ScoreTool = ScoreTool;    
    //#endregion
    //#region ScoreToolGeneric
    /**
    A base class for creating scoring tool module. This class loads module using the individual parameters.
    */
    var ScoreToolGeneric = (function (_super) {
        __extends(ScoreToolGeneric, _super);
        /**
        Creates a scoring tool module based on the name and URL parameters.  Descendant class's constructor must invoke this contructor to register
        the scoring tool module onto the ModuleManager.
        @param name : string - the tool module name.
        @param url : string- the path to load the tool module code library from.
        @param owner? : string - optional indicates the owner name of the tool module.  Default: 'unknown'.
        @param  isPublic? : bool - optional indicates whether this tool module can be shared with other users.  Default: false.
        @param description? : string - optional brief describing what the tool module's purpose.  Default: blank.
        @param isVisible? : bool- optional indicates whethere this tool module has user interface with user interaction.  Default: false.
        */
        function ScoreToolGeneric(name, url, owner, isPublic, description, isVisible) {
            if (typeof owner === "undefined") { owner = 'unknown'; }
            if (typeof isPublic === "undefined") { isPublic = false; }
            if (typeof description === "undefined") { description = ''; }
            if (typeof isVisible === "undefined") { isVisible = false; }
            var aToolInfo = null;
            if(!name.isNullOrEmpty() && !url.isNullOrEmpty()) {
                aToolInfo = new ToolInfo(name, url, owner, isPublic, description, isVisible);
            }
                _super.call(this, aToolInfo);
        }
        return ScoreToolGeneric;
    })(ScoreTool);
    pvMapper.ScoreToolGeneric = ScoreToolGeneric;    
    //#endregion
    //#region InfoTool
    /**
    A base class for creating information tool module. This class is for loading module using the ToolInfo helper class.
    */
    var InfoTool = (function () {
        /**
        Creates an information tool module based on the attributes found in the parameter object.  Decendant class must make call
        to this constructor to register a module onto the ModuleManager.
        @param aToolInfo: ToolInfo - an object containing the module name, URL, description, owner, isPublic, and isVisible.
        */
        function InfoTool(aToolInfo) {
            if(typeof (aToolInfo) === 'undefined') {
                var ex = new DOMException();
                ex.message = 'Registration error:  invalid or undefined ToolInfo object.';
                throw ex;
            }
            this.name = aToolInfo.moduleName;
            this.description = aToolInfo.moduleDescription;
            this.url = aToolInfo.moduleURL;
            this.owner = aToolInfo.owner;
            this.isPublic = aToolInfo.isPublic;
            this.isVisible = aToolInfo.isVisible;
            var aTool = this;
            moduleManager.add(aTool);
            moduleManager.activate(aTool);
        }
        InfoTool.prototype.calculate = /**
        The information tool module's main calculation procedure.  This function must be overriden by descendant modules.
        @param args?: NameValueArray - an array containing NameValue pair.
        */
        function (args) {
            return 0;
        };
        InfoTool.prototype.onClick = /**
        Fire when a user interface has a mouse clicked, if the module has user interface implementation.  Decendant class must override
        to subscribe to the onclick event.
        @param sender: any - the UI being clicked.
        @event: EventArg - event information about the event.
        */
        function (sender, event) {
        };
        InfoTool.prototype.onChange = /**
        Fire when a user interface has requested something to be updated.  Decendant class must override
        to subscribe to this onChange event.
        @param sender: any - the UI being clicked.
        @event: EventArg - event information about the event.
        */
        function (sender, event) {
        };
        InfoTool.prototype.onActivate = function (sender, event) {
        };
        InfoTool.prototype.onDeactivate = function (sender, event) {
        };
        return InfoTool;
    })();
    pvMapper.InfoTool = InfoTool;    
    //#endregion
    //#region InfoToolGeneric
    /**
    A base class for creating information tool module. This class loads module using the individual parameters.
    */
    var InfoToolGeneric = (function (_super) {
        __extends(InfoToolGeneric, _super);
        /**
        Creates a information tool module based on the name and URL parameters.  Descendant class's constructor must invoke this contructor to register
        the scoring tool module onto the ModuleManager.
        @param name : string - the tool module name.
        @param url : string- the path to load the tool module code library from.
        @param owner? : string - optional indicates the owner name of the tool module.  Default: 'unknown'.
        @param  isPublic? : bool - optional indicates whether this tool module can be shared with other users.  Default: false.
        @param description? : string - optional brief describing what the tool module's purpose.  Default: blank.
        @param isVisible? : bool- optional indicates whethere this tool module has user interface with user interaction.  Default: false.
        */
        function InfoToolGeneric(name, url, owner, isPublic, description, isVisible) {
            if (typeof owner === "undefined") { owner = 'unknown'; }
            if (typeof isPublic === "undefined") { isPublic = false; }
            if (typeof description === "undefined") { description = ''; }
            if (typeof isVisible === "undefined") { isVisible = true; }
            var aToolInfo = null;
            if(!name.isNullOrEmpty() && !url.isNullOrEmpty()) {
                aToolInfo = new ToolInfo(name, url, owner, isPublic, description, isVisible);
            }
                _super.call(this, aToolInfo);
        }
        return InfoToolGeneric;
    })(InfoTool);
    pvMapper.InfoToolGeneric = InfoToolGeneric;    
    //#endregion
    })(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=Tools.js.map

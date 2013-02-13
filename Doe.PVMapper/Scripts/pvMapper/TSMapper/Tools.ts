/// <reference path="ModuleManager.d.ts" />
/// <reference path="common.ts" />

module pvMapper {

  if (typeof (moduleManager) === 'undefined')
    var moduleManager: ModuleManager = new ModuleManager();

  //#region ToolInfo
  /**
  A helper class stores tool module information.
  */
  export class ToolInfo implements IToolInfo {
    constructor(mName: string, mURL: string, mOwner?: string, mIsPublic?: bool, mDescription?: string, mIsVisible?: bool) {
      this.moduleName = mName;
      this.moduleDescription = mDescription;
      this.moduleURL = mURL;
      this.owner = mOwner;
      this.isPublic = mIsPublic;
      this.isVisible = mIsVisible;
    }
    /**
    The name of a tool module.
    */
    public moduleName: string;
    /**
    A short description of a module's intension and capabilities.
    */
    public moduleDescription: string;
    /**
    A Path pointing tothe location of the module's code library.
    */public moduleURL: string;
    /**
    The name of the owner of the module.
    */public owner: string;
    /**
    Indicates whether a particular module can be shared with the global community.
    */public isPublic: bool;
    /**
    Indicates whether  a particular module has user interface and allow user interraction.
    */public isVisible: bool;
  }
  //#endregion

  //#region ScoreTool

  /**
  A base class for creating scoring tool module. This class is for loading module using the ToolInfo helper class.
  */
  export class ScoreTool implements ITool {
    /**
    Creates a scoring tool module based on the information found in the parameter object.  Decendant class must make call 
    to this constructor to register a module onto the ModuleManager.
    @param aToolInfo: ToolInfo - an object containing the module name, URL, description, owner, isPublic, and isVisible.
    */
    constructor(aToolInfo: ToolInfo) {
      if (typeof (aToolInfo) === 'undefined') {
        var ex: DOMException = new DOMException();
        ex.message = 'Registration error:  invalid or undefined ToolInfo object.';
        throw ex;
      }

      this.name = aToolInfo.moduleName;
      this.description = aToolInfo.moduleDescription;
      this.url = aToolInfo.moduleURL;
      this.owner = aToolInfo.owner;
      this.isPublic = aToolInfo.isPublic;
      this.isVisible = aToolInfo.isVisible;

      var aTool: ITool = this;
      moduleManager.add(aTool);
      moduleManager.activate(aTool);
    }
    /**
    The scoring tool module's main calculation procedure.  This function must be overriden by descendant modules.
    @param args?: NameValueArray - an array containing NameValue pair.
    */
    public calculate(args?: NameValueArray): number {
      return 0;
    }

    public name: string;
    public description: string;
    public url: string;
    public owner: string;
    public isPublic: bool;
    public isVisible: bool;
    
    /**
    Fire when a user interface has a mouse clicked, if the module has user interface implementation.  Decendant class must override
    to subscribe to the onclick event.
    @param sender: any - the UI being clicked.
    @event: EventArg - event information about the event.
    */
    public onClick(sender: any, event: EventArg) { }
    /**
    Fire when a user interface has requested something to be updated.  Decendant class must override
    to subscribe to this onChange event.
    @param sender: any - the UI being clicked.
    @event: EventArg - event information about the event.
    */
    public onChange(sender: any, event: EventArg) { }

    public onActivate(sender: any, event: EventArg) { }
    public onDeactivate(sender: any, event: EventArg) { }
  }

  //#endregion

  //#region ScoreToolGeneric
  /**
  A base class for creating scoring tool module. This class loads module using the individual parameters.
  */
  export class ScoreToolGeneric extends ScoreTool {
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
    constructor(name: string, url: string,owner?:string='unknown',isPublic?:bool=false,description?:string = '',isVisible?: bool = false) {
      var aToolInfo: ToolInfo = null;
      if (!name.isNullOrEmpty() && !url.isNullOrEmpty()) {
        aToolInfo = new ToolInfo(name,url,owner,isPublic,description,isVisible);
      }
      super(aToolInfo);
    }
  }

  //#endregion

  //#region InfoTool
  /**
  A base class for creating information tool module. This class is for loading module using the ToolInfo helper class.
  */
  export class InfoTool implements ITool {
    /**
    Creates an information tool module based on the attributes found in the parameter object.  Decendant class must make call 
    to this constructor to register a module onto the ModuleManager.
    @param aToolInfo: ToolInfo - an object containing the module name, URL, description, owner, isPublic, and isVisible.
    */
    constructor (aToolInfo:ToolInfo ) {
      if (typeof (aToolInfo) === 'undefined') {
        var ex: DOMException = new DOMException();
        ex.message = 'Registration error:  invalid or undefined ToolInfo object.';
        throw ex;
      }
      this.name = aToolInfo.moduleName;
      this.description = aToolInfo.moduleDescription;
      this.url = aToolInfo.moduleURL;
      this.owner = aToolInfo.owner;
      this.isPublic = aToolInfo.isPublic;
      this.isVisible = aToolInfo.isVisible;

      var aTool: ITool = this;
      moduleManager.add(aTool);
      moduleManager.activate(aTool);
    }
    /**
    The information tool module's main calculation procedure.  This function must be overriden by descendant modules.
    @param args?: NameValueArray - an array containing NameValue pair.
    */
    public calculate(args?:NameValueArray): number {
      return 0;
    }
    public name: string;
    public description: string;
    public url: string;
    public owner: string;
    public isPublic: bool;
    public isVisible: bool;

    /**
    Fire when a user interface has a mouse clicked, if the module has user interface implementation.  Decendant class must override
    to subscribe to the onclick event.
    @param sender: any - the UI being clicked.
    @event: EventArg - event information about the event.
    */
    public onClick(sender: any, event: EventArg) { }
    /**
    Fire when a user interface has requested something to be updated.  Decendant class must override
    to subscribe to this onChange event.
    @param sender: any - the UI being clicked.
    @event: EventArg - event information about the event.
    */
    public onChange(sender: any, event: EventArg) { }
    public onActivate(sender: any, event: EventArg) { }
    public onDeactivate(sender: any, event: EventArg) { }


  }
  //#endregion

  //#region InfoToolGeneric
  /**
  A base class for creating information tool module. This class loads module using the individual parameters.
  */
  export class InfoToolGeneric extends InfoTool {
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
    constructor(name: string, url: string, owner?: string='unknown', isPublic?: bool=false, description?: string='',isVisible?:bool=true) {
      var aToolInfo: ToolInfo = null;
      if (!name.isNullOrEmpty() && !url.isNullOrEmpty()) {
        aToolInfo = new ToolInfo(name, url, owner, isPublic, description, isVisible);
      }
      super(aToolInfo);
    }
  }
  //#endregion
}











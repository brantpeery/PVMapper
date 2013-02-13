/// <reference path="ModuleManager.d.ts" />


/**
An alias to the ModuleManager interface.
*/
interface IModuleManager extends ModuleManager {
}

module pvMapper {
  export class ModuleManager implements IModuleManager {
    constructor() {
    }

    public tools: ITool[] = new ITool[]();

    public loadTool(mod: IToolInfo): ITool {
      var aTool: ITool;
      //TODO: add code to load a module tool

      return aTool;
    }

    /**
    Add a tool module to the module manager list.
    @param mod: ITool - a module tool to be added to the module manager.
    */
  public add(mod: ITool): number {
    var idx: number = 0;
    idx = this.tools.push(mod);
    return idx;
  }

  public remove(mod: ITool): bool {
    var isRemoved: bool = false;
    //remove the tool module from the module manager list.
    try {
      this.tools.splice(0, 1, mod);
      isRemoved = true;
    }
    catch(ex) {
    }
    return isRemoved;
  }

    //activate the tool module.
  public activate(mod: ITool): bool {
    var isActivated: bool = false;
    if (this.tools.indexOf(mod, 0) >= 0) {
      if (mod.onActivate != null)
        isActivated = mod.onActivate(mod, new EventArg());
    }
    return isActivated;
  }

    //deactivate the tool module.
  public deactivate(mod: ITool): bool  {
    var isDeactivated: bool = false;
    if (this.tools.indexOf(mod, 0) >= 0) {
      if (mod.onActivate != null)
        isDeactivated = mod.onDeactivate(mod, new EventArg());
    }
    return isDeactivated;
  }
}
}
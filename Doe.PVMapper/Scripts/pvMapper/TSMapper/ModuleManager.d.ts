/// <reference path="Event.ts" />

/**
Basic name/value object.
*/
interface NameValue {
  name: string;
  value: any;
}
declare var NameValue: {
  new (name: string, value?: any): NameValue;
  (name: string, value?: any): NameValue;
  prototype: NameValue;
}

/**
Basic name/value array list.
*/
interface NameValueArray {
  nameValues: NameValue[];
}

/**
A module contractual interface for all scoring and none scoring modules.
*/
interface ITool {
  /**
  Module unique identification name.
  */
  name: string;
  /**
  A brief description about a module's purpose.
  */
  description: string;
  /**
  The module's URL path to the code library.
  */
  url: string;
  /**
  The name of the owner.
  */
  owner: string;
  /**
  Indicates whether this module is available to the general public.
  */
  isPublic: bool;
  /**
  Indicates whether this module has user interface representation allowing user to interact with.
  */
  isVisible: bool;
  /**
  A delegate to calculate the module's main function based some specific parameters.
  @param args:NameValueArray optional parameter contains arrays of name/value pair.
  */
  calculate(args?: NameValueArray): number;
  onClick(event: Event);
}

/**
A help class to assist module load and registration.
*/
interface IToolInfo {
  moduleName: string;
  moduleDescription: string;
  moduleURL: string;
  owner: string;
  isPublic: bool;
  isVisible: bool;
}

/**
Interface for any module to register and submit to be managed.
*/
interface ModuleManager {
  tools: ITool[];
  loadTool(mod: IToolInfo): ITool;
  add(mod: ITool): number;
  remove(mod: ITool): bool;
  activate(mod: ITool): bool;
  deactivate(mod: ITool): bool;
}
declare var ModuleManager: {
  new (mm?: any): ModuleManager;
    (mm?: any): ModuleManager;
    prototype: ModuleManager;
}

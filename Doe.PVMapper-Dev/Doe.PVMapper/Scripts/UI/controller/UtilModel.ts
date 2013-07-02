
/*    /  /  <reference path="Ext-all-src.js"/> */

///<reference path="C:\Workspace\Dotnet\WebDev\pvmapper\Doe.PVMapper\Doe.PVMapper\Scripts\pvMapper\Utility.ts" />

if (typeof Ext == 'undefined')
  var Ext = Ext || {};


// Interface
Ext.define('MyApp.data.UtilConfig', {
  extend: 'Ext.data.Model',
  fields: [{ name: 'functionName', type: 'string' },
    { name: 'minValue', type: 'float' },
    { name: 'maxValue', type: 'float' },
    { name: 'increment', type: 'float' },
    { name: 'target', type: 'float' },
    { name: 'slope', type: 'float' },
    { name: 'mode', type: 'string' },
    { name: 'weight', type: 'int' },
    { name: 'UserId', type: 'string' }
  ],
  idProperty: 'functionName'
});

if (typeof (Ext.data.JsonStore) == 'undefined') {
  Ext.define("Ext.data.JsonStore", {
    extend: "Ext.data.Store",
    alias: "store.json",
    requires: ["Ext.data.proxy.Ajax", "Ext.data.reader.Json", "Ext.data.writer.Json"],
    constructor: function (a) {
      a = Ext.apply({
        proxy: {
          type: "ajax",
          reader: "json",
          writer: "json"
        }
      }, a);
      this.callParent([a])
    }
  });
}

var configStore = Ext.Create('Ext.data.JsonStore', {
  model: 'MyApp.data.UtilConfig',
  autoLoad: false,
  autoSave: false,
  root: 'data',
  idProperty: 'id',
  proxy: {
    type: 'ajax',
    url: '../api/Properties',
  }
});


interface IUtilModel {
  executeFunction(id: string, x: number): any;
  getFunction(id: string): any;
  setFunction(id: string, func: (...args: any[]) =>any);
}

// Module
module UtilityModel {


  class UtilFunction {
    constructor (public functionName: string,
         public functionPtr: (...args: any[]) =>any) {
    }
  }

  interface IDictionary {
    add(aName: any, anObj: any);
    remove(aName: any);
    clear();
    indexOf(aValue: any, fn: any): any;
  }

  class DictionaryCollection implements IDictionary {
    _dictionary: { [index: string]: any; } = {};

    //fn is a callback function to perform the comparison.
    public indexOf(fn: (value: string) =>boolean): any {
      //Since the array is defined as associative array, can not use regular
      //loop.  The index becomes the propery of the array itself.  To access
      //the index name, this loop should work, based on javascript specs.
      for (var i in this._dictionary) {
        if (fn(i) == true)
          return i;
      }
    }

    public add(aName: string, anObj: any) {
      this._dictionary[aName] = anObj;
    }
    public remove(aName: string) {
      if (aName in this._dictionary)
        delete this._dictionary[aName];
    }
    public clear() {
      delete this._dictionary;
      this._dictionary = {};
    }
    public valueOf(aName: string): any {
      if (aName in this._dictionary)
        return this._dictionary[aName];
      else
        return null;
    }
  }

  // Class
  export class UtilModel implements IUtilModel {

    fDict: DictionaryCollection = new DictionaryCollection();
    //configDict: DictionaryCollection = new DictionaryCollection();

    // Constructor
    constructor () {
      configStore.load();
    }

    private loadConfig(configName: string): UtilConfig {
      var cfg: UtilConfig;
      if (configStore.data == null)
        configStore.load();

      cfg = configStore.findRecord('functionName', configName);
      return cfg;
    }
    private getConfiguration(configName: string): UtilConfig {
      return this.loadConfig(configName);
    }
    private setConfiguration(configName: string, config: UtilConfig) {
      var isNew: boolean = false;
      var cfg: UtilConfig = configStore.findRecord('functionName', configName);
      if (!cfg) {
        isNew = true;
        cfg = Ext.create('MyApp.data.UtilConfig');
      }
      cfg.data.functionName = config.data.functionName;
      cfg.data.minValue = config.data.minValue;
      cfg.data.maxValue = config.data.maxValue;
      cfg.data.increment = config.data.increment;
      cfg.data.target = config.data.target;
      cfg.data.slope = config.data.slope;
      cfg.data.mode = config.data.mode;
      cfg.data.weight = config.data.weight;
      cfg.data.UserId = config.data.UserId;

      if (isNew)
        configStore.add(cfg);
      configStore.save();
    }
    // Instance member
    public setFunction(id: string, func: (...args: any[]) =>any) {
      this.fDict.add(id, func);
    }

    //just return a function pointer address.
    public getFunction(id: string): any {
      var fd = this.fDict.valueOf(id);
      if (fd) {
        return fd.functionPtr;
      }
      else return null;
    }

    //invoking the function name in 'id' with parameters in 'args'
    public executeFunction(id: string, ...args: any[]): any {
      var fd = this.fDict.valueOf(id);
      if (fd) {
        currentConfig = fd;
        return fd.functionPtr(args);
      }
      else
        return null;
    }
    // Static member
  }

  var utilModel = new UtilModel();
  utilModel.setFunction('More is better', UtilityFunctions.MoreIsBetter);
  utilModel.setFunction('Less is better', UtilityFunctions.LessIsBetter);
  utilModel.setFunction('Normal', UtilityFunctions.NDBalance);


}

//var Ext: any;
//Ext.create("Ext.panel.Panel", {
//    title: "Hello"
//});


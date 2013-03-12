/*    /  /  <reference path="Ext-all-src.js"/> */
///<reference path="C:\Workspace\Dotnet\WebDev\pvmapper\Doe.PVMapper\Doe.PVMapper\Scripts\pvMapper\Utility.ts" />
if(typeof Ext == 'undefined') {
    var Ext = Ext || {
    };
}
// Interface
Ext.define('MyApp.data.UtilConfig', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'functionName',
            type: 'string'
        }, 
        {
            name: 'minValue',
            type: 'float'
        }, 
        {
            name: 'maxValue',
            type: 'float'
        }, 
        {
            name: 'increment',
            type: 'float'
        }, 
        {
            name: 'target',
            type: 'float'
        }, 
        {
            name: 'slope',
            type: 'float'
        }, 
        {
            name: 'mode',
            type: 'string'
        }, 
        {
            name: 'weight',
            type: 'int'
        }, 
        {
            name: 'UserId',
            type: 'string'
        }
    ],
    idProperty: 'functionName'
});
if(typeof (Ext.data.JsonStore) == 'undefined') {
    Ext.define("Ext.data.JsonStore", {
        extend: "Ext.data.Store",
        alias: "store.json",
        requires: [
            "Ext.data.proxy.Ajax", 
            "Ext.data.reader.Json", 
            "Ext.data.writer.Json"
        ],
        constructor: function (a) {
            a = Ext.apply({
                proxy: {
                    type: "ajax",
                    reader: "json",
                    writer: "json"
                }
            }, a);
            this.callParent([
                a
            ]);
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
        url: '../api/Properties'
    }
});
// Module
var UtilityModel;
(function (UtilityModel) {
    var UtilFunction = (function () {
        function UtilFunction(functionName, functionPtr) {
            this.functionName = functionName;
            this.functionPtr = functionPtr;
        }
        return UtilFunction;
    })();    
    var DictionaryCollection = (function () {
        function DictionaryCollection() {
            this._dictionary = {
            };
        }
        DictionaryCollection.prototype.indexOf = //fn is a callback function to perform the comparison.
        function (fn) {
            //Since the array is defined as associative array, can not use regular
            //loop.  The index becomes the propery of the array itself.  To access
            //the index name, this loop should work, based on javascript specs.
            for(var i in this._dictionary) {
                if(fn(i) == true) {
                    return i;
                }
            }
        };
        DictionaryCollection.prototype.add = function (aName, anObj) {
            this._dictionary[aName] = anObj;
        };
        DictionaryCollection.prototype.remove = function (aName) {
            if(aName in this._dictionary) {
                delete this._dictionary[aName];
            }
        };
        DictionaryCollection.prototype.clear = function () {
            delete this._dictionary;
            this._dictionary = {
            };
        };
        DictionaryCollection.prototype.valueOf = function (aName) {
            if(aName in this._dictionary) {
                return this._dictionary[aName];
            } else {
                return null;
            }
        };
        return DictionaryCollection;
    })();    
    // Class
    var UtilModel = (function () {
        //configDict: DictionaryCollection = new DictionaryCollection();
        // Constructor
        function UtilModel() {
            this.fDict = new DictionaryCollection();
            configStore.load();
        }
        UtilModel.prototype.loadConfig = function (configName) {
            var cfg;
            if(configStore.data == null) {
                configStore.load();
            }
            cfg = configStore.findRecord('functionName', configName);
            return cfg;
        };
        UtilModel.prototype.getConfiguration = function (configName) {
            return this.loadConfig(configName);
        };
        UtilModel.prototype.setConfiguration = function (configName, config) {
            var isNew = false;
            var cfg = configStore.findRecord('functionName', configName);
            if(!cfg) {
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
            if(isNew) {
                configStore.add(cfg);
            }
            configStore.save();
        };
        UtilModel.prototype.setFunction = // Instance member
        function (id, func) {
            this.fDict.add(id, func);
        };
        UtilModel.prototype.getFunction = //just return a function pointer address.
        function (id) {
            var fd = this.fDict.valueOf(id);
            if(fd) {
                return fd.functionPtr;
            } else {
                return null;
            }
        };
        UtilModel.prototype.executeFunction = //invoking the function name in 'id' with parameters in 'args'
        function (id) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var fd = this.fDict.valueOf(id);
            if(fd) {
                currentConfig = fd;
                return fd.functionPtr(args);
            } else {
                return null;
            }
        };
        return UtilModel;
    })();
    UtilityModel.UtilModel = UtilModel;    
    // Static member
    var utilModel = new UtilModel();
    utilModel.setFunction('More is better', UtilityFunctions.MoreIsBetter);
    utilModel.setFunction('Less is better', UtilityFunctions.LessIsBetter);
    utilModel.setFunction('Normal', UtilityFunctions.NDBalance);
})(UtilityModel || (UtilityModel = {}));
//var Ext: any;
//Ext.create("Ext.panel.Panel", {
//    title: "Hello"
//});
//var Ext: any;
//Ext.create("Ext.panel.Panel", {
//    title: "Hello"
//});

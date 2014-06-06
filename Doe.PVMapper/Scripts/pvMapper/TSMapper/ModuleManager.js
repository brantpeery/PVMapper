/// <reference path="es6-promises.d.ts" />
var pvClient;

var pvMapper;
(function (pvMapper) {
    var ModuleInfo = (function () {
        function ModuleInfo(_category, _moduleName, _ctor, _isActive, _moduleUrl, _description) {
            if (typeof _moduleUrl === "undefined") { _moduleUrl = ""; }
            if (typeof _description === "undefined") { _description = ""; }
            this._category = _category;
            this._moduleName = _moduleName;
            this._ctor = _ctor;
            this._isActive = _isActive;
            this._moduleUrl = _moduleUrl;
            this._description = _description;
        }
        Object.defineProperty(ModuleInfo.prototype, "category", {
            get: function () {
                return this._category;
            },
            set: function (acat) {
                this._category = acat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleInfo.prototype, "moduleName", {
            get: function () {
                return this._moduleName;
            },
            set: function (aname) {
                this._moduleName = aname;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleInfo.prototype, "ctor", {
            get: function () {
                return this._ctor;
            },
            set: function (actor) {
                this._ctor = actor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleInfo.prototype, "isActive", {
            get: function () {
                return this._isActive;
            },
            set: function (isOn) {
                this._isActive = isOn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleInfo.prototype, "moduleUrl", {
            get: function () {
                return this._moduleUrl;
            },
            set: function (aUrl) {
                this._moduleUrl = aUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModuleInfo.prototype, "description", {
            get: function () {
                return this._description;
            },
            set: function (desc) {
                this._description = desc;
            },
            enumerable: true,
            configurable: true
        });
        return ModuleInfo;
    })();
    pvMapper.ModuleInfo = ModuleInfo;

    var ModuleManager = (function () {
        function ModuleManager() {
            var _this = this;
            this._modules = new Array();
            this.toolStoreName = 'ToolModules';
            //Instantiate the registered tool modules whose isActive is true.  isActive is check against user's configuration first.
            //It also load the module from server if it has not been loaded.
            this.loadTools = function () {
                //The openStore function returns a <Promise> object which will call our onOpened or error delegate
                //functions when it finishes processing database inquery.  The "bindTo" will force the onSuccess to be
                //execute in the DataManager domain, just so the 'this' always refer to our class here.
                pvMapper.ClientDB.loadToolModules(_this.toolStoreName).then(function (arrObj) {
                    _this.loadToolsFromConfig(arrObj);
                }, function (err) {
                    console.warn("Opening database store failed, cause: " + err.message);
                    _this.loadToolsFromConfig([]);
                    //this.loadModuleScripts();
                });
            };
            //Synchronize the register of user's preference modules.  If no user preferences saved,
            //load all modules using a pre-select included list through a pvClient.getIncludeModules function.
            this.loadToolsFromConfig = function (moduleConfigs) {
                try  {
                    // update the active state of any modules already registered, based on the loaded configuration
                    //Note: this replicates past behavior that was here, but I believe that this._modules will always be empty at this point!
                    _this._modules.forEach(function (m) {
                        var config = moduleConfigs.filter(function (c) {
                            return c.value._moduleName === m.moduleName && c.value._moduleUrl === m.moduleUrl;
                        });
                        console.assert(config.length <= 1, "Warning: module name and url collision detected!");
                        if (config.length)
                            m.isActive = config[0].value._isActive;
                    });

                    // fetch the modules available on the server
                    var availableModules = pvClient.getIncludeModules();

                    // of the modules available on the server, we want to load any new modules we haven't seen before (i.e. we don't have a saved configuration for them),
                    // and any old modules where the configuration we do have shows that the tool is active, and where it isn't currently loaded in the module manager.
                    var moduleUrlsToLoad = availableModules.filter(function (a) {
                        return moduleConfigs.filter(function (m) {
                            return a == m.value._moduleUrl;
                        }).length <= 0 || moduleConfigs.filter(function (m) {
                            return a == m.value._moduleUrl && m.value._isActive && _this.getRegisteredModulesByURL(m.value._moduleUrl).length <= 0;
                        }).length > 0;
                    });

                    // load the modules (logging errors, if any)
                    var modulesLoading = moduleUrlsToLoad.map(function (u) {
                        return _this.getScript(u).catch(function (e) {
                            if (console && console.error)
                                console.error(e);
                        });
                    });
                } catch (ex) {
                    if (console && console.warn)
                        console.warn("Reading user module preferences failed, cause: " + ex.message);
                    if (console && console.error)
                        console.error(ex);
                }
            };
        }
        ModuleManager.prototype.getModule = function (name) {
            var ma = this._modules.filter(function (a) {
                return (a.moduleName === name);
            });
            console.assert(ma.length < 2, "Module name collision detected!");
            return ma.length ? ma[0] : null;
        };

        ModuleManager.prototype.getRegisteredModulesByURL = function (url) {
            return this._modules.filter(function (a) {
                return (a.moduleUrl === url);
            });
            //console.assert(ma.length < 2, "Module url collision detected!"); // this is expected - several modules can share a single URL
            //return ma.length ? ma[0] : null; //TODO: this is NOT a unique key !
        };

        ModuleManager.prototype.getCtor = function (moduleName) {
            var m = this.getModule(moduleName);
            if (m) {
                return m.ctor;
            } else
                return null;
        };

        //This function should only be call by the tool module.  Calling from anywhere else, the caller must make sure
        //that the supporting code script (configProperties) is loaded.
        ModuleManager.prototype.registerModule = function (category, name, ctor, isActivated, url) {
            if (typeof url === "undefined") { url = ''; }
            if (typeof (ctor.description) == 'undefined')
                ctor.description = "";
            isActivated = isActivated || false;
            var m = this.getModule(name);
            if (m == null) {
                this._modules.push(new ModuleInfo(category, name, ctor, isActivated, url, ctor.description));
                if (ctor && isActivated) {
                    var tm = new ctor();
                    var mObj = tm.getModuleObj();
                    if (typeof (mObj.activate) === 'function')
                        mObj.activate();
                }
            } else {
                if (!m.ctor && m.isActive && ctor) {
                    //create the tool if it has created before.
                    m.ctor = ctor;
                    var tm = new ctor();
                    var mObj = tm.getModuleObj();
                    if (typeof (mObj.activate) === 'function')
                        mObj.activate();
                }
                if (m.moduleUrl != url && url !== null)
                    m.moduleUrl = url;
            }
        };

        ModuleManager.prototype.deleteModule = function (aName) {
            var m = this.getModule(aName);
            if (m) {
                var idx = this._modules.indexOf(m);
                if (idx >= 0)
                    this._modules.splice(idx, 1);
                delete m;
            }
        };

        Object.defineProperty(ModuleManager.prototype, "modules", {
            get: function () {
                return this._modules;
            },
            enumerable: true,
            configurable: true
        });

        ModuleManager.prototype.activateModules = function () {
            this.modules.forEach(function (tool) {
                if (tool.isActive && tool.ctor != undefined) {
                    new tool.ctor();
                }
            });
            pvMapper.mainScoreboard.update();
            pvMapper.mainScoreboard.updateTotals();
        };

        ModuleManager.prototype.saveTools = function () {
            var tools = this._modules.map(function (m) {
                return { key: m.moduleName, value: m };
            });

            if (tools.length <= 0)
                return;

            pvMapper.ClientDB.saveToolModules(this.toolStoreName, tools);
        };

        ModuleManager.prototype.getScript = function (url, cbFn) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                try  {
                    var req = new XMLHttpRequest();
                    req.open("GET", url);
                    req.onload = function (e) {
                        if (req.status != 404) {
                            _this.evaluateScript(url, req.responseText);
                            if (cbFn)
                                cbFn.apply(_this);
                            console.log("Tool module '" + url + "' loaded successful.");
                            resolve(null);
                        } else {
                            reject(Error("Load tool '" + url + "' not found."));
                        }
                    };
                    req.onerror = function (e) {
                        reject(Error("Loading tool module '" + url + "' failed."));
                    };
                    req.send();
                } catch (ex) {
                    reject(Error("Getting module '" + url + "' from server failed, cause: " + ex.message));
                }
            });
        };

        ModuleManager.prototype.evaluateScript = function (url, script) {
            if (script.length == 0)
                return;

            // the //# sourceURL is for help debugging in browser because all script loaded dynamically doesn't show up in browser developer tool.
            // selfUrl is to supply the URL to the loading tool module so it can use to register back to the moduleManager.
            var prescript = "//# sourceURL=" + url + "\n" + "var selfUrl = '" + url + "';\n";
            script = prescript + script;
            eval(script);
        };
        return ModuleManager;
    })();
    pvMapper.ModuleManager = ModuleManager;
    pvMapper.moduleManager = new ModuleManager();
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=ModuleManager.js.map

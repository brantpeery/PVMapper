/// <reference path="es6-promises.d.ts" />

var pvMapper;
(function (pvMapper) {
    var ModuleInfoJSON = (function () {
        function ModuleInfoJSON(modInfo) {
            this.id = modInfo.id;
            this.author = modInfo.author;
            this.version = modInfo.version;
            this.url = modInfo.url;

            this.title = modInfo.title;
            this.category = modInfo.category;
            this.description = modInfo.description;
            this.longDescription = null; // modInfo.longDescription; // <-- don't store this; it's just wasted space.

            this.isActive = modInfo.isActive;
        }
        return ModuleInfoJSON;
    })();

    var ModuleManager = (function () {
        function ModuleManager() {
            var _this = this;
            this._availableModulesByID = {};
            this._registeredModulesByID = {};
            this._customModulesByID = {};
            //This function should only be call by the tool module.  Calling from anywhere else, the caller must make sure
            //that the supporting code script (configProperties) is loaded.
            this.registerModule = function (newModule, isActiveByDefault) {
                console.assert(!!(newModule.id && newModule.title && newModule.url && newModule.activate && newModule.deactivate), "Warning: attempting to register an incomplete module '" + (newModule.id || newModule.title || newModule.url) + "' (id, title, and url are required on all modules).");

                console.assert(!_this._registeredModulesByID[newModule.id], "Warning: attempting to register module '" + newModule.id + "', when a module with the same ID has already been registered.");

                var modInfo = _this._availableModulesByID[newModule.id];
                var shouldBeActive = modInfo ? modInfo.isActive : isActiveByDefault;

                _this._availableModulesByID[newModule.id] = newModule;
                _this._registeredModulesByID[newModule.id] = newModule;

                if (shouldBeActive !== newModule.isActive) {
                    if (shouldBeActive)
                        _this._activateModule(newModule);
                    else
                        _this._deactivateModule(newModule); // this will likely never occurr
                }
            };
            // there is nothing special about this above or beyond calling module.activate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
            this.activateModule = function (mod) {
                var availableModule = _this._availableModulesByID[mod.id];
                var registeredModule = _this._registeredModulesByID[mod.id];
                if (console && console.assert)
                    console.assert(!!availableModule, "Warning: attempting to activate a module which isn't available.");

                if (registeredModule) {
                    _this._activateModule(registeredModule);
                    return registeredModule;
                } else if (availableModule) {
                    availableModule.isActive = true; // set as active, so that after our script is fetched and registered, it will also be activated.

                    _this.getScript(availableModule.url).then(function () {
                        mod.isActive = _this._registeredModulesByID[mod.id] && _this._registeredModulesByID[mod.id].isActive; // update active state (in case of errors)
                    }, function () {
                        mod.isActive = _this._registeredModulesByID[mod.id] && _this._registeredModulesByID[mod.id].isActive; // update active state (in case of errors)
                    });
                }
                return null;
            };
            // there is nothing special about this above or beyond calling module.activate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
            this._activateModule = function (mod) {
                pvMapper.onReady(function () {
                    try  {
                        mod.activate();
                    } catch (ex) {
                        pvMapper.displayMessage("Failed to activate module '" + mod.title + "'", "error");
                        if (console && console.error)
                            console.error(ex);

                        _this.deactivateModule(mod);
                    }
                    _this.saveModulesToBrowserConfig();
                });
            };
            // there is nothing special about this above or beyond calling module.deactivate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
            this.deactivateModule = function (mod) {
                var registeredModule = _this._registeredModulesByID[mod.id];
                var customModule = _this._customModulesByID[mod.id];
                if (console && console.assert)
                    console.assert(!!registeredModule || !!customModule, "Warning: attempting to deactivate a module (ID='" + mod.id + "') which isn't registered.");

                if (registeredModule) {
                    _this._deactivateModule(registeredModule);
                    return registeredModule;
                } else if (customModule) {
                    _this.removeCustomModule(customModule);
                } else if (typeof mod.deactivate === "function") {
                    _this._deactivateModule(mod); // <-- custom modules aren't registered, but they can be deactivated. Handle them here as well.
                }
                return null;
            };
            // there is nothing special about this above or beyond calling module.deactivate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
            this._deactivateModule = function (mod) {
                try  {
                    mod.deactivate();
                    if (console && console.log)
                        console.log("Deactivated module '" + mod.title + "'");
                } catch (ex) {
                    if (console && console.error)
                        console.error("Failed to deactivate module '" + mod.title + "': " + ex);
                }
                _this.saveModulesToBrowserConfig();
            };
            this.addCustomModule = function (newModule) {
                if (typeof (_this._customModulesByID[newModule.id]) === "object") {
                    throw new Error("Error: Attempted to register a duplicate custom module: " + newModule.id);
                }

                _this._customModulesByID[newModule.id] = newModule;

                if (!newModule.isActive)
                    _this._activateModule(newModule);
            };
            this.removeCustomModule = function (oldModule) {
                if (_this._customModulesByID[oldModule.id] !== oldModule) {
                    if (console && console.error)
                        console.error("Warning: Attempting to deactivate a custom module that was never activated '" + oldModule.id + "'");
                } else {
                    delete _this._customModulesByID[oldModule.id];
                }

                _this._deactivateModule(oldModule);
            };
            this.getAvailableModuleByID = function (id) {
                return _this._availableModulesByID[id];
            };
            this.getRegisteredModuleByID = function (id) {
                return _this._registeredModulesByID[id];
            };
            this.getCustomModuleByID = function (id) {
                return _this._customModulesByID[id];
            };
            this.getAvailableModules = function () {
                return Object.keys(_this._availableModulesByID).map(function (k) {
                    return _this._availableModulesByID[k];
                });
            };
            this.toJSON = function () {
                return Object.keys(_this._availableModulesByID).map(function (k) {
                    return new ModuleInfoJSON(_this._availableModulesByID[k]);
                });
                /*.concat(Object.keys(this._customModulesByID).map(k => new ModuleInfoJSON(this._customModulesByID[k])))*/
                //TODO: at present, we have to way to save or load custom tools to/from files, projects, etc. They are stored only in the browser.
            };
            this.fromJSON = function (modules) {
                if (modules)
                    _this.loadModulesFromConfig(modules);
            };
            this.saveModulesToBrowserConfig_timeoutHandle = null;
            //Instantiate the registered tool modules whose isActive is true.  isActive is check against user's configuration first.
            //It also load the module from server if it has not been loaded.
            this.loadModulesFromBrowserConfig = function () {
                //The openStore function returns a <Promise> object which will call our onOpened or error delegate
                //functions when it finishes processing database inquery.  The "bindTo" will force the onSuccess to be
                //execute in the DataManager domain, just so the 'this' always refer to our class here.
                pvMapper.ClientDB.loadToolModules().then(function (arrObj) {
                    _this.loadModulesFromConfig(arrObj);
                }, function (err) {
                    console.warn("Opening database store failed, cause: " + err.message);
                    _this.loadModulesFromConfig([]);
                    //this.loadModuleScripts();
                });
            };
            // ***************************************************************
            //TODO: Why, oh why, didn't we just use require.js !?!?!
            //      It is supported by TypeScript as external modules.
            //      It is supported and used by ExtJS, which we're using.
            //      There is no reason to roll our own dynamic JS loader...!
            // ***************************************************************
            //Synchronize the register of user's preference modules.  If no user preferences saved,
            //load all modules available on the server through a pvClient.getIncludeModules function.
            this.loadModulesFromConfig = function (savedModuleConfig) {
                try  {
                    // fetch the list of modules available on the server
                    var serverModuleUrls = pvClient.getIncludeModules();

                    // ignore saved configs for modules not available on the server (and discard them)
                    var moduleConfig = savedModuleConfig.filter(function (x) {
                        return serverModuleUrls.indexOf(x.url) >= 0;
                    });

                    // update configs for any registered (already available) modules, and add unregistered modules to the list of available modules
                    moduleConfig.forEach(function (config) {
                        var rm = _this._registeredModulesByID[config.id];
                        if (rm) {
                            // (de)activate modules as necessary, as dictated by the stored module config.
                            if (config.isActive !== rm.isActive) {
                                if (config.isActive)
                                    _this._activateModule(rm);
                                else
                                    _this._deactivateModule(rm);
                            }
                        } else {
                            // add to available modules (or replace the older available module config, if we have one)
                            _this._availableModulesByID[config.id] = config;
                        }
                    });

                    var availableModules = Object.keys(_this._availableModulesByID).map(function (k) {
                        return _this._availableModulesByID[k];
                    });

                    // of the modules available on the server, we want to load any new modules we haven't seen before (i.e. we don't have a saved configuration for them),
                    // and any old modules where the configuration we do have shows that the tool is active, and where we don't currently have a constructor/factory method registered for it.
                    var moduleUrlsToLoad = serverModuleUrls.filter(function (url) {
                        var urlMods = availableModules.filter(function (m) {
                            return m.url === url;
                        });

                        return urlMods.length <= 0 || urlMods.filter(function (m) {
                            return !_this._registeredModulesByID[m.id] && m.isActive;
                        }).length > 0;
                    });

                    // load the modules (logging errors, if any)
                    moduleUrlsToLoad.forEach(_this.getScript);
                } catch (ex) {
                    if (console && console.error)
                        console.error("Reading user module preferences failed: " + ex.message);
                    if (console && console.debug)
                        console.debug(ex);
                }
            };
            // this is a hack... prefetch all script files before we load a project file, since we don't know which modules might be used, and ideally we'd like the project to load up quickly.
            this.prefetchAllModuleScripts = function () {
                var serverModuleUrls = pvClient.getIncludeModules();
                serverModuleUrls.forEach(_this.getScript);
            };
            this.scriptsFetchedThisSession = {};
            this.getScript = function (url) {
                if (_this.scriptsFetchedThisSession[url])
                    return;

                return new Promise(function (resolve, reject) {
                    try  {
                        var req = new XMLHttpRequest();
                        req.open("GET", url);
                        req.onload = function (e) {
                            if (req.status != 404) {
                                _this.scriptsFetchedThisSession[url] = true;
                                _this.evaluateScript(url, req.responseText);
                                console.log("Tool module '" + url + "' loaded successfully.");
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
                }).catch(function (e) {
                    if (console && console.error)
                        console.error(e);
                });
            };
        }
        ModuleManager.prototype.saveModulesToBrowserConfig = function () {
            var _this = this;
            if (typeof this.saveModulesToBrowserConfig_timeoutHandle === "number") {
                // it's been less than 7 second since the last module (de)activation / save request, so cancel our next save (it will happen too soon)
                window.clearTimeout(this.saveModulesToBrowserConfig_timeoutHandle);
            }

            // wait until we haven't seen any module (de)activations for 5 seconds before saving the current module state to the browser
            this.saveModulesToBrowserConfig_timeoutHandle = window.setTimeout(function () {
                _this.saveModulesToBrowserConfig_timeoutHandle = null;
                var tools = _this.toJSON();
                pvMapper.ClientDB.saveToolModules(tools);
            }, 5000);
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

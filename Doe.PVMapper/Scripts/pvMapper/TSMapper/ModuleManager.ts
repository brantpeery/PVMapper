/// <reference path="es6-promises.d.ts" />

declare var pvClient: {
    getIncludeModules: () => Array<string>;
}

module pvMapper {

    class ModuleInfoJSON implements IModuleInfoJSON {
        constructor(modInfo: IModuleInfoJSON) {
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

        id: string;
        author: string;
        version: string;
        url: string;

        title: string;
        category: string;
        description: string;
        longDescription: string;

        isActive: boolean;
    }

    export class ModuleManager {
        constructor() { }
        private _availableModulesByID: { [id: string]: IModuleInfoJSON } = {};
        private _registeredModulesByID: { [id: string]: IModule } = {};

        private _customModulesByID: { [id: string]: IModule } = {};

        //This function should only be call by the tool module.  Calling from anywhere else, the caller must make sure
        //that the supporting code script (configProperties) is loaded.  
        public registerModule = (newModule: IModule, isActiveByDefault: boolean) => {
            console.assert(!!(newModule.id && newModule.title && newModule.url && newModule.activate && newModule.deactivate),
                "Warning: attempting to register an incomplete module '" + (newModule.id || newModule.title || newModule.url) +
                "' (id, title, and url are required on all modules).");

            console.assert(!this._registeredModulesByID[newModule.id], "Warning: attempting to register module '" +
                newModule.id + "', when a module with the same ID has already been registered.");

            var modInfo = this._availableModulesByID[newModule.id];
            var shouldBeActive = modInfo ? modInfo.isActive : isActiveByDefault;

            this._availableModulesByID[newModule.id] = newModule;
            this._registeredModulesByID[newModule.id] = newModule;

            if (shouldBeActive !== newModule.isActive) {
                if (shouldBeActive)
                    this._activateModule(newModule);
                else
                    this._deactivateModule(newModule); // this will likely never occurr
            }
        }

        // there is nothing special about this above or beyond calling module.activate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
        public activateModule = (mod: IModuleInfoJSON) => {
            var availableModule = this._availableModulesByID[mod.id];
            var registeredModule = this._registeredModulesByID[mod.id];
            if (console && console.assert) console.assert(!!availableModule, "Warning: attempting to activate a module which isn't available.");

            if (registeredModule) {
                this._activateModule(registeredModule);
                return registeredModule;
            } else if (availableModule) {
                availableModule.isActive = true; // set as active, so that after our script is fetched and registered, it will also be activated.

                this.getScript(availableModule.url).then(() => {
                    mod.isActive = this._registeredModulesByID[mod.id] && this._registeredModulesByID[mod.id].isActive; // update active state (in case of errors)
                }, () => {
                    mod.isActive = this._registeredModulesByID[mod.id] && this._registeredModulesByID[mod.id].isActive; // update active state (in case of errors)
                });
            }
            return null;
        };

        // there is nothing special about this above or beyond calling module.activate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
        private _activateModule = (mod: IModule) => {
            pvMapper.onReady(() => {
                try {
                    mod.activate();
                } catch (ex) {
                    pvMapper.displayMessage("Failed to activate module '" + mod.title + "'", "error");
                    if (console && console.error) console.error(ex);

                    this.deactivateModule(mod);
                }
                this.saveModulesToBrowserConfig();
            });
        };

        // there is nothing special about this above or beyond calling module.deactivate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
        public deactivateModule = (mod: IModule) => {
            var registeredModule = this._registeredModulesByID[mod.id];
            var customModule = this._customModulesByID[mod.id];
            if (console && console.assert) console.assert(!!registeredModule || !!customModule, "Warning: attempting to deactivate a module (ID='" + mod.id + "') which isn't registered.");

            if (registeredModule) {
                this._deactivateModule(registeredModule);
                return registeredModule;
            } else if (customModule) {
                this.removeCustomModule(customModule);
            } else if (typeof mod.deactivate === "function") {
                this._deactivateModule(mod); // <-- custom modules aren't registered, but they can be deactivated. Handle them here as well.
            }
            return null;
        };

        // there is nothing special about this above or beyond calling module.deactivate(), except that it had some sensible error handling thrown in, and it saves module configs to the browser
        private _deactivateModule = (mod: IModule) => {
            try {
                mod.deactivate();
                if (console && console.log) console.log("Deactivated module '" + mod.title + "'");
            } catch (ex) {
                if (console && console.error) console.error("Failed to deactivate module '" + mod.title + "': " + ex);
            }
            this.saveModulesToBrowserConfig();
        };

        public addCustomModule = (newModule: IModule) => {
            if (typeof (this._customModulesByID[newModule.id]) === "object") {
                throw new Error("Error: Attempted to register a duplicate custom module: " + newModule.id);
            }

            this._customModulesByID[newModule.id] = newModule;

            if (!newModule.isActive)
                this._activateModule(newModule);
        }

        public removeCustomModule = (oldModule: IModule) => {
            if (this._customModulesByID[oldModule.id] !== oldModule) {
                if (console && console.error) console.error("Warning: Attempting to deactivate a custom module that was never activated '" + oldModule.id + "'");
            } else {
                delete this._customModulesByID[oldModule.id];
            }

            this._deactivateModule(oldModule);
        }

        public getAvailableModuleByID = (id: string): IModuleInfoJSON=> {
            return this._availableModulesByID[id];
        }

        public getRegisteredModuleByID = (id: string): IModule=> {
            return this._registeredModulesByID[id];
        }

        public getCustomModuleByID = (id: string): IModule=> {
            return this._customModulesByID[id];
        }

        public getAvailableModules = (): IModuleInfoJSON[] => {
            return Object.keys(this._availableModulesByID).map(k => this._availableModulesByID[k]);
        }

        public toJSON = (): IModuleInfoJSON[] => {
            return Object.keys(this._availableModulesByID).map(k => new ModuleInfoJSON(this._availableModulesByID[k]));
            /*.concat(Object.keys(this._customModulesByID).map(k => new ModuleInfoJSON(this._customModulesByID[k])))*/
            //TODO: at present, we have to way to save or load custom tools to/from files, projects, etc. They are stored only in the browser.
        }

        public fromJSON = (modules: IModuleInfoJSON[]) => {
            if (modules) this.loadModulesFromConfig(modules);
        }

        private saveModulesToBrowserConfig_timeoutHandle = null;
        public saveModulesToBrowserConfig() {
            if (typeof this.saveModulesToBrowserConfig_timeoutHandle === "number") {
                // it's been less than 7 second since the last module (de)activation / save request, so cancel our next save (it will happen too soon)
                window.clearTimeout(this.saveModulesToBrowserConfig_timeoutHandle);
            }

            // wait until we haven't seen any module (de)activations for 5 seconds before saving the current module state to the browser
            this.saveModulesToBrowserConfig_timeoutHandle = window.setTimeout(() => {
                this.saveModulesToBrowserConfig_timeoutHandle = null;
                var tools = this.toJSON();
                ClientDB.saveToolModules(tools);
            }, 5000);
        }

        //Instantiate the registered tool modules whose isActive is true.  isActive is check against user's configuration first.  
        //It also load the module from server if it has not been loaded.
        public loadModulesFromBrowserConfig = () => {
            //The openStore function returns a <Promise> object which will call our onOpened or error delegate 
            //functions when it finishes processing database inquery.  The "bindTo" will force the onSuccess to be 
            //execute in the DataManager domain, just so the 'this' always refer to our class here.
            ClientDB.loadToolModules().then(
                (arrObj: IModuleInfoJSON[]) => {
                    this.loadModulesFromConfig(arrObj);
                },
                (err) => {
                    console.warn("Opening database store failed, cause: " + err.message);
                    this.loadModulesFromConfig([]);
                    //this.loadModuleScripts();
                }
            );
        }

        // ***************************************************************
        //TODO: Why, oh why, didn't we just use require.js !?!?!
        //      It is supported by TypeScript as external modules.
        //      It is supported and used by ExtJS, which we're using.
        //      There is no reason to roll our own dynamic JS loader...!
        // ***************************************************************

        //Synchronize the register of user's preference modules.  If no user preferences saved,
        //load all modules available on the server through a pvClient.getIncludeModules function.
        private loadModulesFromConfig = (savedModuleConfig: IModuleInfoJSON[]) => {
            try {
                // fetch the list of modules available on the server
                var serverModuleUrls = pvClient.getIncludeModules();

                // ignore saved configs for modules not available on the server (and discard them)
                var moduleConfig = savedModuleConfig.filter((x) => serverModuleUrls.indexOf(x.url) >= 0);

                // update configs for any registered (already available) modules, and add unregistered modules to the list of available modules
                moduleConfig.forEach((config) => {
                    var rm = this._registeredModulesByID[config.id];
                    if (rm) {
                        // (de)activate modules as necessary, as dictated by the stored module config.
                        if (config.isActive !== rm.isActive) {
                            if (config.isActive)
                                this._activateModule(rm);
                            else
                                this._deactivateModule(rm);
                        }
                    } else {
                        // add to available modules (or replace the older available module config, if we have one)
                        this._availableModulesByID[config.id] = config;
                    }
                });

                var availableModules = Object.keys(this._availableModulesByID).map(k => this._availableModulesByID[k]);

                // of the modules available on the server, we want to load any new modules we haven't seen before (i.e. we don't have a saved configuration for them),
                // and any old modules where the configuration we do have shows that the tool is active, and where we don't currently have a constructor/factory method registered for it.
                var moduleUrlsToLoad = serverModuleUrls.filter((url) => {
                    var urlMods = availableModules.filter(m => m.url === url);

                    return urlMods.length <= 0 || // <-- this must be a new url/file, so load it.
                        urlMods.filter((m) => !this._registeredModulesByID[m.id] && m.isActive).length > 0; // <-- this is an unregistered but active module, so load it.
                }); 
                
                // load the modules (logging errors, if any)
                moduleUrlsToLoad.forEach(this.getScript);
            } catch (ex) {
                if (console && console.error) console.error("Reading user module preferences failed: " + ex.message);
                if (console && console.debug) console.debug(ex);
            }
        }


        // this is a hack... prefetch all script files before we load a project file, since we don't know which modules might be used, and ideally we'd like the project to load up quickly.
        public prefetchAllModuleScripts = () => {
            var serverModuleUrls = pvClient.getIncludeModules();
            serverModuleUrls.forEach(this.getScript);
        };


        private scriptsFetchedThisSession: { [url: string]: boolean } = {};

        public getScript = (url: string) => {
            if (this.scriptsFetchedThisSession[url])
                return; // nothing to do here.
            
            return new Promise((resolve, reject) => {
                try {
                    var req = new XMLHttpRequest();
                    req.open("GET", url);
                    req.onload = (e) => {
                        if (req.status != 404) {
                            this.scriptsFetchedThisSession[url] = true;
                            this.evaluateScript(url, req.responseText);
                            console.log("Tool module '" + url + "' loaded successfully.");
                            resolve(null);
                        }
                        else {
                            reject(Error("Load tool '" + url + "' not found."));
                        }
                    };
                    req.onerror = function (e) {
                        reject(Error("Loading tool module '" + url + "' failed."));

                    }
                    req.send();
                }
                catch (ex) {
                    reject(Error("Getting module '" + url + "' from server failed, cause: " + ex.message));
                }
            }).catch((e) => { if (console && console.error) console.error(e); });
        }

        public evaluateScript(url: string, script: string) {
            if (script.length == 0) return;
            // the //# sourceURL is for help debugging in browser because all script loaded dynamically doesn't show up in browser developer tool.
            // selfUrl is to supply the URL to the loading tool module so it can use to register back to the moduleManager.
            var prescript = "//# sourceURL=" + url + "\n" + "var selfUrl = '" + url + "';\n" // + "var isActive = true; \n";
            script = prescript + script;
            eval(script);
        }
    }
    export var moduleManager = new ModuleManager();
}

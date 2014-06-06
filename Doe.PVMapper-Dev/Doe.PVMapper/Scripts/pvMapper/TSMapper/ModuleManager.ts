/// <reference path="es6-promises.d.ts" />

interface pvClient {

}
var pvClient: {
    getIncludeModules: () => Array<string>;
    prototype: pvClient;
    moduleChanged: boolean;
}

module pvMapper {

    export class ModuleInfo {
        constructor(private _category: string, private _moduleName: string, private _ctor: any, private _isActive: boolean, private _moduleUrl: string = "", private _description:string = "") { }
        get category(): string { return this._category; } set category(acat: string) { this._category = acat; }
        get moduleName(): string { return this._moduleName; } set moduleName(aname: string) { this._moduleName = aname; }
        get ctor(): any { return this._ctor; } set ctor(actor: any) { this._ctor = actor; }
        get isActive(): boolean { return this._isActive; } set isActive(isOn: boolean) { this._isActive = isOn; }
        get moduleUrl(): string { return this._moduleUrl; } set moduleUrl(aUrl: string) { this._moduleUrl = aUrl; }
        get description(): string { return this._description; } set description(desc: string) { this._description = desc; }
    }

    export class ModuleManager {
        constructor() { }
        private _modules: Array<pvMapper.ModuleInfo> = new Array<pvMapper.ModuleInfo>();

        public getModule(name: string): pvMapper.ModuleInfo {
            var ma = this._modules.filter(function (a: pvMapper.ModuleInfo) {
                return (a.moduleName === name); //TODO: this is NOT a unique key !
            });
            console.assert(ma.length < 2, "Module name collision detected!");
            return ma.length ? ma[0] : null;
        }

        public getRegisteredModulesByURL(url: string): pvMapper.ModuleInfo[] {
            return this._modules.filter(function (a: pvMapper.ModuleInfo) {
                return (a.moduleUrl === url);
            });
            //console.assert(ma.length < 2, "Module url collision detected!"); // this is expected - several modules can share a single URL
            //return ma.length ? ma[0] : null; //TODO: this is NOT a unique key !
        }

        public getCtor(moduleName: string): any {
            var m = this.getModule(moduleName);
            if (m) {
                return m.ctor;
            }
            else return null;
        }

        //This function should only be call by the tool module.  Calling from anywhere else, the caller must make sure
        //that the supporting code script (configProperties) is loaded.  
        public registerModule(category: string, name: string, ctor: any, isActivated: boolean, url: string = '') {
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
            }
            else {
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
        }

        public deleteModule(aName: string) {
            var m = this.getModule(aName);
            if (m) {
                var idx = this._modules.indexOf(m);
                if (idx >= 0) this._modules.splice(idx, 1);
                delete m;
            }
        }

        get modules(): Array<pvMapper.ModuleInfo> {
            return this._modules;
        }

        public activateModules() {

            this.modules.forEach(function (tool) {
                if (tool.isActive && tool.ctor != undefined) {
                    new tool.ctor();
                }
            });
            pvMapper.mainScoreboard.update();
            pvMapper.mainScoreboard.updateTotals();
        }

        private toolStoreName: string = 'ToolModules';
        public saveTools() {
            var tools = this._modules.map((m: ModuleInfo) => { return { key: m.moduleName, value: m }; });

            if (tools.length <= 0) return;

            ClientDB.saveToolModules(this.toolStoreName, tools);
        }

        //Instantiate the registered tool modules whose isActive is true.  isActive is check against user's configuration first.  
        //It also load the module from server if it has not been loaded.
        public loadTools = () => {
            //The openStore function returns a <Promise> object which will call our onOpened or error delegate 
            //functions when it finishes processing database inquery.  The "bindTo" will force the onSuccess to be 
            //execute in the DataManager domain, just so the 'this' always refer to our class here.
            ClientDB.loadToolModules(this.toolStoreName).then(
                (arrObj: Array<{ key: any; value: any; }>) => {
                    this.loadToolsFromConfig(arrObj);
                },
                (err) => {
                    console.warn("Opening database store failed, cause: " + err.message);
                    this.loadToolsFromConfig([]);
                    //this.loadModuleScripts();
                }
            );
        }

        //Synchronize the register of user's preference modules.  If no user preferences saved,
        //load all modules using a pre-select included list through a pvClient.getIncludeModules function.
        public loadToolsFromConfig = (moduleConfigs: { key: any; value: { _isActive: boolean; _moduleUrl: string; _moduleName: string; _category: string}; }[]) => {
            try {
                // update the active state of any modules already registered, based on the loaded configuration
                //Note: this replicates past behavior that was here, but I believe that this._modules will always be empty at this point!
                this._modules.forEach((m) => {
                    var config = moduleConfigs.filter((c) => c.value._moduleName === m.moduleName && c.value._moduleUrl === m.moduleUrl);
                    console.assert(config.length <= 1, "Warning: module name and url collision detected!");
                    if (config.length)
                        m.isActive = config[0].value._isActive;
                });

                // fetch the modules available on the server
                var availableModules = pvClient.getIncludeModules();

                // of the modules available on the server, we want to load any new modules we haven't seen before (i.e. we don't have a saved configuration for them),
                // and any old modules where the configuration we do have shows that the tool is active, and where it isn't currently loaded in the module manager.
                var moduleUrlsToLoad = availableModules.filter((a) => 
                    moduleConfigs.filter((m) => a == m.value._moduleUrl).length <= 0 || // <-- this must be a new module, so load it.
                        moduleConfigs.filter((m) => a == m.value._moduleUrl && m.value._isActive &&  // <-- this is a configured & unregistered module,
                            this.getRegisteredModulesByURL(m.value._moduleUrl).length <= 0).length > 0);   // so load it too.

                // load the modules (logging errors, if any)
                var modulesLoading = moduleUrlsToLoad.map((u) => this.getScript(u)
                    .catch((e) => { if (console && console.error) console.error(e); }));
            }
            catch (ex) {
                if (console && console.warn) console.warn("Reading user module preferences failed, cause: " + ex.message);
                if (console && console.error) console.error(ex);
            }
        }

        public getScript(url: string, cbFn?: ICallback) {
            return new Promise((resolve, reject) => {
                try {
                    var req = new XMLHttpRequest();
                    req.open("GET", url);
                    req.onload = (e) => {
                        if (req.status != 404) {
                            this.evaluateScript(url, req.responseText);
                            if (cbFn)
                                cbFn.apply(this);
                            console.log("Tool module '" + url + "' loaded successful.");
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
            });
        }

        public evaluateScript(url: string, script: string) {
            if (script.length == 0) return;
            // the //# sourceURL is for help debugging in browser because all script loaded dynamically doesn't show up in browser developer tool.
            // selfUrl is to supply the URL to the loading tool module so it can use to register back to the moduleManager.
            var prescript = "//# sourceURL=" + url + "\n" + "var selfUrl = '" + url + "';\n" // + "var isActive = true; \n";
            script = prescript + script;
            eval(script);
        }

        //public isLoadOnly: boolean = false;
        //public loadModuleScripts() {
        //    var moduleScripts = pvClient.getIncludeModules();
        //    if (moduleScripts && moduleScripts.length > 0) {
        //        var loadedCnt = 0;
        //        var totalCnt = moduleScripts.length;
        //        var errCnt = 0;
        //        var wasLoaded = 0;

        //        new Promise((resolve: ICallback, reject: ICallback) => {
        //            try {
        //                moduleScripts.forEach((url) => {
        //                    var m = this.getModuleByURL(url);
        //                    if (m == null) //only if not already loaded.  Assumption is that if a module is registered, the code should have been loaded.
        //                        this.getScript(url).then(function onResolve() { ++loadedCnt; }, function onError(err) { ++errCnt; });
        //                    else
        //                        ++wasLoaded;
        //                });

        //                var cycle = 0;  //wait 10 seconds max.
        //                var waitaSecond = function () {
        //                    if ((loadedCnt + errCnt + wasLoaded >= totalCnt) || (cycle >= 10)) {
        //                        resolve();
        //                    }
        //                    else {
        //                        ++cycle;
        //                        setTimeout(waitaSecond, 1000);
        //                    }
        //                }
        //                waitaSecond();
        //            }
        //            catch (ex) {
        //                reject(Error(ex.message));
        //            }

        //        }).then(
        //            () => {
        //                if (pvClient.moduleChanged) {
        //                    pvClient.moduleChanged = false;
        //                    this.saveTools();
        //                }
        //            },
        //            (Err) => {
        //                console.warn("loadModuleScripts: Loading all scripts failed, cause: " + Err.message);
        //            });

        //    }
        //}
    }
    export var moduleManager = new ModuleManager();
}

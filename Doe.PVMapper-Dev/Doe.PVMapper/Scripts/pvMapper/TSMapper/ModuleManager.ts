﻿interface pvClient {

}
var pvClient: {
    getIncludeModules: () => Array<string>;
    prototype: pvClient;
}

module pvMapper {

    export class ModuleInfo {
        constructor(private _category: string, private _moduleName: string, private _ctor: any, private _isActive: boolean, private _moduleUrl?: string) { }
        get category(): string { return this._category; } set category(acat: string) { this._category = acat; }
        get moduleName(): string { return this._moduleName; } set moduleName(aname: string) { this._moduleName = aname; }
        get ctor(): any { return this._ctor; } set ctor(actor: any) { this._ctor = actor; }
        get isActive(): boolean { return this._isActive; } set isActive(isOn: boolean) { this._isActive = isOn; }
        get moduleUrl(): string { return this._moduleUrl; } set moduleUrl(aUrl: string) { this._moduleUrl = aUrl; }
    }

    export class ModuleManager {
        constructor() { }
        private _modules: Array<pvMapper.ModuleInfo> = new Array<pvMapper.ModuleInfo>();
        public getModule(name: string): pvMapper.ModuleInfo {
            var m: pvMapper.ModuleInfo = <pvMapper.ModuleInfo>(this._modules.find(function (a: pvMapper.ModuleInfo) {
                if (a.moduleName === name) return true;
                else return false;
            }));
            if (m) return m;
            return null;
        }

        public getModuleByURL(url: string): pvMapper.ModuleInfo {
            var m: pvMapper.ModuleInfo = <pvMapper.ModuleInfo>(this._modules.find(function (a: pvMapper.ModuleInfo) {
                if (a.moduleUrl === url) return true;
                else return false;
            }));
            if (m) return m;
            return null;
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
            var m = this.getModule(name);
            if (m == null) {
                this._modules.push(new ModuleInfo(category, name, ctor, isActivated, url));
                if (ctor && isActivated) {
                    new ctor();
                }
            }
            else {
                if (!m.ctor && m.isActive && ctor) {
                    //create the tool if it has created before.
                    m.ctor = ctor;
                    new ctor();
                }
                if (m.moduleUrl != url && url !== null)
                    m.moduleUrl = url;
            }
        }

        public deleteModule(aName: string) {
            var m = <pvMapper.ModuleInfo>this._modules.find(function (a: pvMapper.ModuleInfo) {
                if (a.moduleName === aName) return true;
                else return false;
            });
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
            var tools: Array<any> = new Array<any>();
            this._modules.forEach(function (m: ModuleInfo) {
                tools.push({ key: m.moduleName, value: m });
            });

            if (tools.length <= 0) return;

            pvMapper.ClientDB.saveToolModules(this.toolStoreName, tools);
        }

        //Instantiate the registered tool modules whose isActive is true.  isActive is check against user's configuration first.  
        //It also load the module from server if it has not been loaded.
        public loadTools() {
            //The openStore function returns a <Promise> object which will call our onOpened or error delegate 
            //functions when it finishes processing database inquery.  The "bindTo" will force the onSuccess to be 
            //execute in the DataManager domain, just so the 'this' always refer to our class here.
            pvMapper.ClientDB.loadToolModules(this.toolStoreName).then(
                bindTo(this, function onOpened(arrObj: Array<any>) {
                    try {

                        //Synchronize the register of user's preference modules.  If no user preferences saved,
                        //load all modules using a pre-select included list through a pvClient.getIncludeModules function.
                        new Promise(bindTo(this, function (resolve: ICallback, reject: ICallback) {
                            var cntr: number = 0;
                            try {
                                arrObj.forEach(bindTo(this, function (tool) {
                                    var cm: ModuleInfo = this.getModule(tool.value._moduleName);
                                    if (cm) {
                                        cm.isActive = tool.value._isActive;
                                    }
                                    else { //if a tool is in the database but not yet registered, go get the script, it should self register.
                                        if (tool.value._isActive)
                                            this.getScript(tool.value._moduleUrl);
                                        else
                                            this.modules.push(new ModuleInfo(tool.value._category, tool.value._moduleName, undefined, tool.value._isActive, tool.value._moduleUrl));
                                    }
                                    ++cntr;
                                }));
                                resolve(cntr);
                            }
                            catch (ex) {
                                reject(Error("Registering user's preferred modules failed, cause: " + ex.message));
                            }
                        })).then(
                            bindTo(this, function onResolved(cntr) {
                                //end of records list.
                                if (cntr == 0) {
                                    //no user preferences saved, load the default scripts file.
                                    this.loadModuleScripts();
                                }
                                //else {
                                //    this.activateModules();
                                //}
                            }),
                            function onReject(err) {
                                console.log(err.message);
                            });
                    }
                    catch (ex) {
                        console.log("Reading user module preferences failed, cause: " + ex.message);
                    }
                }),
                bindTo(this, function onError(err) {
                    console.log("Opening database store failed, cause: " + err.message);
                    this.loadModuleScripts();
                }));
        }

        public getScript(url: string, cbFn : ICallback) {
            var req = new XMLHttpRequest();
            req.open("GET", url);
            req.onload = bindTo(this, function (e) {
                this.evaluateScript(url, req.responseText);
                if (cbFn)
                    cbFn.apply(this);
                console.log("Tool module '" + url + "' loaded successful.");
            });
            req.onerror = function (e) {
                console.log("Loading tool module '" + url + "' failed.");
            }
            req.send();
        }

        public evaluateScript(url: string, script: string) {
            // the //# sourceURL is for help debugging in browser because all script loaded dynamically doesn't show up in browser developer tool.
            // selfUrl is to supply the URL to the loading tool module so it can use to register back to the moduleManager.
            var prescript = "//# sourceURL=" + url + "\n" + "var selfUrl = '" + url + "';\n" // + "var isActive = true; \n";
            script = prescript + script;
            eval(script);
        }

        public loadModuleScripts() {
            var moduleScripts = pvClient.getIncludeModules();
            if (moduleScripts && moduleScripts.length > 0) {
                moduleScripts.forEach(bindTo(this, function (url) {
                    var m = this.getModuleByURL(url);
                    if (m == null) //only if not already loaded.  Assumption is that if a module is registered, the code should have been loaded.
                        this.getScript(url);
                }));
            }
        }
    }
    export var moduleManager = new ModuleManager();
}

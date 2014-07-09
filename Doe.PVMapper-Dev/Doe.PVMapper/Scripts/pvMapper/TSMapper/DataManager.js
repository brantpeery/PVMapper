/// <reference path="es6-promises.d.ts" />
/// <reference path="common.ts" />
/// <reference path="pvMapper.ts" />
/// <reference path="Score.ts" />
/// <reference path="../../ExtJS.d.ts" />
// Module
var pvMapper;
(function (pvMapper) {
    // for mainttaining uploaded custom KML modules.  The purpose if for keeping handles onto the module in case
    // user want to remove it from the project.
    //this class is the database KML Module record.  The key is the filename.  moduleName is the user given name.
    var CustomModule = (function () {
        function CustomModule(name, aclass, data) {
            this.customName = name;
            this.customClass = aclass;
            this.customData = data;
        }
        return CustomModule;
    })();
    pvMapper.CustomModule = CustomModule;

    

    var ClientDB = (function () {
        function ClientDB() {
            this.isScoreLoaded = false;
        }
        ClientDB.initClientDB = function (forced) {
            if (typeof forced === "undefined") { forced = false; }
            if (!ClientDB.indexedDB) {
                window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
                return;
            }

            if (ClientDB.db) {
                if (!forced)
                    return;
                else {
                    ClientDB.db = null;
                    ClientDB.isDBCreating = false;
                }
            }
            try  {
                if (!ClientDB.isDBCreating) {
                    ClientDB.isDBCreating = true;
                    if (forced)
                        ClientDB.dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    else
                        ClientDB.dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME);
                    ClientDB.dbreq.onsuccess = function (evt) {
                        ClientDB.useDatabase(evt.currentTarget.result);
                    };

                    ClientDB.dbreq.onerror = function (event) {
                        ClientDB.clientDBError = true;
                        if (console && console.warn)
                            console.warn("indexedDB open error: " + event.currentTarget.error.message);
                        alert("Error: couldn't connect to in-browser storage.");
                    };

                    ClientDB.dbreq.onupgradeneeded = function (evt) {
                        try  {
                            var db = evt.target.result;
                            if (!db.objectStoreNames.contains(ClientDB.CONFIG_STORE_NAME)) {
                                evt.currentTarget.result.createObjectStore(ClientDB.CONFIG_STORE_NAME, { keypath: "title" });
                            }
                            if (!db.objectStoreNames.contains(ClientDB.PROJECT_STORE_NAME)) {
                                evt.currentTarget.result.createObjectStore(ClientDB.PROJECT_STORE_NAME, { keypath: "project" });
                            }
                            if (!db.objectStoreNames.contains(ClientDB.TOOLS_STORE_NAME)) {
                                evt.currentTarget.result.createObjectStore(ClientDB.TOOLS_STORE_NAME, { keypath: "tools" });
                            }
                            if (ClientDB.CUSTOM_STORE_NAME && ClientDB.CUSTOM_STORE_NAME.length > 0) {
                                if (!db.objectStoreNames.contains(ClientDB.CUSTOM_STORE_NAME)) {
                                    evt.currentTarget.result.createObjectStore(ClientDB.CUSTOM_STORE_NAME, { keypath: "custom_id" });
                                }
                            }

                            ClientDB.useDatabase(evt.currentTarget.result);
                        } catch (e) {
                            if (console && console.warn)
                                console.warn("Creating object store failed, cause: " + e.message);
                        }
                    };

                    ClientDB.dbreq.onblocked = function (event) {
                        if (console && console.warn)
                            console.warn("database open is blocked ?!?");
                        alert("PV Mapper is open in another browser tab; please close that tab to continue.");
                    };
                }
            } catch (e) {
                console.log("initDB error, cause: " + e.message);
            }
            return null;
        };

        ClientDB.useDatabase = function (db) {
            // Make sure to add a handler to be notified if another page requests a version
            // change. We must close the database. This allows the other page to upgrade the database.
            // If you don't do this then the upgrade won't happen until the user closes the tab.
            db.onversionchange = function (event) {
                alert("PV Mapper is open in another browser tab; please close this tab to continue.");

                //db.close();
                window.close();
            };

            // Do stuff with the database.
            ClientDB.db = db;
            ClientDB.DBVersion = +ClientDB.db.version;

            if (console && console.log)
                console.log("Database 'PVMapperData' (version " + ClientDB.DBVersion + ") is open.");

            // Now, handle loading from our new database (or schedule it for handling, whenever pvMapper is ready)
            pvMapper.onReady(function () {
                pvMapper.moduleManager.loadTools();

                //load custom modules.
                if (console && console.assert)
                    console.assert(typeof (pvMapper.loadLocalModules) === "function", "Warning: MainToolbar isn't finished loading...!");

                if (typeof (pvMapper.loadLocalModules) === "function") {
                    pvMapper.loadLocalModules();
                }

                //load configuration
                if (console && console.assert)
                    console.assert(!this.isScoreLoaded, "If this never happens, then I should delete isScoreLoaded - it server no purpose."); //TODO: delete isScoreLoaded !

                if ((ClientDB.db != null) && (!this.isScoreLoaded)) {
                    pvMapper.mainScoreboard.scoreLines.forEach(function (sc) {
                        sc.loadConfiguration();
                    });
                    this.isScoreLoaded = true;
                }
            });
        };

        ClientDB.saveCustomKML = function (moduleName, moduleClass, filename, kmlStream) {
            if (ClientDB.db == null)
                return;
            try  {
                var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readwrite");
                var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);

                var request = store.get(filename);
                request.onsuccess = function (evt) {
                    var data = new CustomModule(moduleName, moduleClass, kmlStream);
                    if (request.result != undefined) {
                        if (console && console.warn)
                            console.warn("Warning: overwriting KML file already saved in browser: " + filename);
                        store.put(data, filename);
                    } else {
                        store.add(data, filename); // if new, add
                    }
                    pvMapper.displayMessage(filename + " stored in local browser.", "success");
                };
            } catch (e) {
                pvMapper.displayMessage("Couldn't store " + filename + " in local browser.", "error");
                if (console && console.error)
                    console.error(e);
            }
        };

        ClientDB.loadCustomKML = function (key, cbFn) {
            var kmlData;
            if (ClientDB.db == null)
                return;
            var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readonly");
            var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
            var request = store.get(key);
            request.onsuccess = function (evt) {
                if (request.result != undefined) {
                    if (+ClientDB.db.version <= 6)
                        kmlData = new CustomModule(key, "LocalLayerModule", request.result);
                    else
                        kmlData = request.result;
                    if (typeof (cbFn) === "function")
                        cbFn(kmlData);
                }
            };
        };

        ClientDB.deleteCustomKML = function (key, fn) {
            if (ClientDB.db == null)
                return;
            var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readwrite");
            txn.oncomplete = function (evt) {
                if (console && console.log)
                    console.log("Transaction completed deleting module: " + key + " has been deleted from the database.");
            };
            txn.onerror = function (evt) {
                pvMapper.displayMessage("Failed to remove " + key + " module.", "error");
                if (console && console.error)
                    console.error("Transaction delete module: " + key + " failed, cause: " + txn.error);
            };

            txn.onabort = function (evt) {
                if (console && console.warn)
                    console.warn("Transaction aborted module: " + key + " failed, cause: " + txn.error);
            };

            var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
            var request = store.delete(key);
            request.onsuccess = function (evt) {
                pvMapper.displayMessage("Deleted " + key + " from the local browser.", "success");
                if ((fn) && (typeof (fn) === "function")) {
                    fn(true);
                }
            };
            request.onerror = function (evt) {
                pvMapper.displayMessage("Failed to delete " + key + " from the local browser.", "error");
                if (console && console.error)
                    console.error("Attempt to delete module: " + key + " failed, cause: " + request.error);
                if ((fn) && (typeof (fn) === "function")) {
                    fn(false);
                }
            };
        };

        ClientDB.getAllCustomKMLName = function (fn) {
            var kmlNames = new Array();
            if (ClientDB.db == null)
                return;
            try  {
                var txn = ClientDB.db.transaction(ClientDB.PROJECT_STORE_NAME, "readonly");
                var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
                store.openCursor().onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    if (cursor) {
                        kmlNames.push(cursor.key);
                        cursor.continue();
                    } else {
                        if (typeof fn === "function") {
                            fn(kmlNames);
                        }
                    }
                };
            } catch (ex) {
                if (console && console.error)
                    console.error("getAllCustomerKMLName failed, cause: " + ex.message);
            }
            return kmlNames;
        };

        ClientDB.loadToolModules = function (storeName) {
            ClientDB.CUSTOM_STORE_NAME = storeName;

            return new Promise(function (resolve, reject) {
                if (ClientDB.db == null) {
                    reject(Error("Database is not available or not ready."));
                    return;
                }
                if (storeName == undefined || storeName.length == 0) {
                    reject(Error("Tried to open a store, but store name is not provided."));
                    return;
                }

                try  {
                    //if the custom store is not yet exists, re-initCLientDB to force it to connect with higher version.
                    if (!ClientDB.db.objectStoreNames.contains(ClientDB.CUSTOM_STORE_NAME)) {
                        reject(Error("There is no store '" + ClientDB.CUSTOM_STORE_NAME + "' exists."));
                    }

                    var txn = ClientDB.db.transaction(ClientDB.CUSTOM_STORE_NAME, 'readonly');
                    txn.oncomplete = function (evt) {
                        if (console && console.log)
                            console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' completed.");
                    };
                    txn.onerror = function (evt) {
                        if (console && console.error)
                            console.error("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' failed, cause: " + txn.error);
                    };

                    txn.onabort = function (evt) {
                        if (console && console.warn)
                            console.warn("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' aborted, cause: " + txn.error);
                    };

                    var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);

                    if (store) {
                        var results = new Array();
                        var cursor = store.openCursor();
                        cursor.onsuccess = function (evt) {
                            var rec = evt.target.result;
                            if (rec) {
                                var jsonObj = JSON.parse(rec.value);
                                results.push(jsonObj);
                                rec.continue();
                            } else {
                                resolve(results);
                            }
                        };
                        cursor.onerror = function (evt) {
                            if (console && console.error)
                                console.error("Open a cursor on '" + store + "' failed, cause: " + evt.message);
                        };
                    }
                } catch (e) {
                    reject(Error(e.message));
                }
            });
        };

        //Save user preferences of tool modules to local database.
        //storeName - the "table" name
        //tools - array of object [key,value] pair.
        ClientDB.saveToolModules = function (storeName, tools) {
            ClientDB.CUSTOM_STORE_NAME = storeName;

            if (ClientDB.db == null) {
                console.log("Database is not available or not ready.");
                return;
            }
            if (storeName == undefined || storeName.length == 0) {
                console.log("Tried to open a store, but store name is not provided.");
                return;
            }

            try  {
                //if the custom store is not yet exists, re-initCLientDB to force it to connect with higher version.
                if (!ClientDB.db.objectStoreNames.contains(ClientDB.CUSTOM_STORE_NAME)) {
                    ClientDB.DBVersion = +ClientDB.db.version + 1; //TODO: this is a terrible abuse of the version system. Terrible. Truly terrible.

                    if (console && console.log)
                        console.log("Upgrading database 'PVMapperData' to version " + ClientDB.DBVersion + ".");

                    new Promise(function (resolve, reject) {
                        ClientDB.initClientDB(true);
                        var cycle = 0;
                        var waitAsecond = function () {
                            if (ClientDB.db == null) {
                                ++cycle;
                                setTimeout(waitAsecond, 1000);
                            } else if (cycle == 10) {
                                reject(Error("Waiting for create database time out"));
                            } else {
                                resolve();
                            }
                        };
                        waitAsecond();
                    }).then(function onResolve() {
                    }, function onReject(Err) {
                        if (console && console.error)
                            console.error(Err);
                    });
                }

                if (ClientDB.db == null) {
                    console.log("There is no data store '" + ClientDB.CUSTOM_STORE_NAME + "' exists.");
                    return;
                }
                var txn = ClientDB.db.transaction(ClientDB.CUSTOM_STORE_NAME, 'readwrite');
                var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);
                if (store) {
                    store.clear().onsuccess = function (event) {
                        tools.forEach(function (tool) {
                            var request = store.get(tool.id);
                            request.onsuccess = function (evt) {
                                //tool.value.ctorStr = tool.value.ctor.toString();
                                var jsonStr = JSON.stringify(tool);
                                if (request.result != undefined) {
                                    store.put(jsonStr, tool.id);
                                    console.log("Tool module '" + tool.id + "' browser config resaved.");
                                } else {
                                    store.add(jsonStr, tool.id); // if new, add
                                    console.log("Tool module '" + tool.id + "' browser config saved.");
                                }
                            };
                            request.onerror = function (evt) {
                                if (console && console.error)
                                    console.error("Attempt to save tool key = '" + tool.id + "' failed, cause: " + evt.message);
                            };
                        });
                        pvMapper.displayMessage("Saved tool configuration to the local browser.", "success");
                    };
                }
            } catch (ex) {
                pvMapper.displayMessage("Failed to save tool configuration to the local browser.", "error");
                console.log("Save tool Modules failed, cause: " + ex.message);
            }
        };
        ClientDB.DB_NAME = "PVMapperData";
        ClientDB.CONFIG_STORE_NAME = "PVMapperScores";
        ClientDB.PROJECT_STORE_NAME = "PVMapperProjects";
        ClientDB.TOOLS_STORE_NAME = "PVMapperTools";
        ClientDB.db = null;
        ClientDB.dbreq = null;
        ClientDB.DBVersion = 1;

        ClientDB.indexedDB = window.indexedDB || window.msIndexedDB;

        ClientDB.isDBCreating = false;
        ClientDB.clientDBError = false;

        ClientDB.CUSTOM_STORE_NAME = "";
        return ClientDB;
    })();
    pvMapper.ClientDB = ClientDB;

    //===========================================
    var SiteData = (function () {
        function SiteData() {
        }
        return SiteData;
    })();
    pvMapper.SiteData = SiteData;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=DataManager.js.map

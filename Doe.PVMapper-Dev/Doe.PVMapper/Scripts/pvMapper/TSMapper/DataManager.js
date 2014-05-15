/// <reference path="Options.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Score.ts" />
/// <reference path="../../ExtJS.d.ts" />
var Promise;

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

    

    pvMapper.ICustomModuleData;

    var CustomModuleData = (function () {
        function CustomModuleData(options) {
            this.fileName = options.fileName;
            this.moduleObject = options.moduleObject;
        }
        return CustomModuleData;
    })();
    pvMapper.CustomModuleData = CustomModuleData;

    var ClientDB = (function () {
        function ClientDB() {
        }
        ClientDB.initClientDB = function (forced) {
            if (typeof forced === "undefined") { forced = false; }
            var me = this;
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
                        var dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME, ClientDB.DBVersion);
                    else
                        var dbreq = ClientDB.indexedDB.open(ClientDB.DB_NAME);
                    dbreq.onsuccess = function (evt) {
                        console.log("Database [PVMapperData] is open sucessful.");
                        ClientDB.db = evt.currentTarget.result;
                        ClientDB.DBVersion = +ClientDB.db.version;
                    };

                    dbreq.onerror = function (event) {
                        me.clientDBError = true;
                        console.log("indexedDB open error: " + event.currentTarget.error.message);
                    };

                    dbreq.onupgradeneeded = function (evt) {
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

                            ClientDB.db = evt.currentTarget.result;
                        } catch (e) {
                            console.log("Creating object store failed, cause: " + e.message);
                        }
                    };
                }
            } catch (e) {
                console.log("initDB error, cause: " + e.message);
            }
            return null;
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
                        store.put(data, filename);
                    } else
                        store.add(data, filename); // if new, add
                };
            } catch (e) {
                console.log("save custom KML failed, cause: " + e.message);
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
                console.log("Transaction completed deleting module: " + key + " has been deleted from the database.");
            };
            txn.onerror = function (evt) {
                console.log("Transaction delete module: " + key + " failed, cause: " + txn.error);
            };

            txn.onabort = function (evt) {
                console.log("Transaction aborted module: " + key + " failed, cause: " + txn.error);
            };

            var store = txn.objectStore(ClientDB.PROJECT_STORE_NAME);
            var request = store.delete(key);
            request.onsuccess = function (evt) {
                console.log("Custom KML module: " + key + " has been deleted from the database.");
                if ((fn) && (typeof (fn) === "function")) {
                    fn(true);
                }
            };
            request.onerror = function (evt) {
                console.log("Attempt to delete module: " + key + " failed, cause: " + request.error);
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
                console.log("getAllCustomerKMLName failed, cause: " + ex.message);
            }
            return kmlNames;
        };

        ClientDB.loadToolModules = function (storeName) {
            this.CUSTOM_STORE_NAME = storeName;

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
                        console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' completed.");
                    };
                    txn.onerror = function (evt) {
                        console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' failed, cause: " + txn.error);
                    };

                    txn.onabort = function (evt) {
                        console.log("Transaction for '" + ClientDB.CUSTOM_STORE_NAME + "' aborted, cause: " + txn.error);
                    };

                    var store = txn.objectStore(ClientDB.CUSTOM_STORE_NAME);

                    if (store) {
                        var results = new Array();
                        var cursor = store.openCursor();
                        cursor.onsuccess = function (evt) {
                            var rec = evt.target.result;
                            if (rec) {
                                var jsonObj = JSON.parse(rec.value);
                                results.push({ key: rec.key, value: jsonObj });
                                rec.continue();
                            } else {
                                resolve(results);
                            }
                        };
                        cursor.onerror = function (evt) {
                            console.log("Open a cursor on '" + store + "' failed, cause: " + evt.message);
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
            this.CUSTOM_STORE_NAME = storeName;

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
                    ClientDB.DBVersion = +ClientDB.db.version + 1;
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
                        console.log(Err.message);
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
                            var request = store.get(tool.key);
                            request.onsuccess = function (evt) {
                                //tool.value.ctorStr = tool.value.ctor.toString();
                                var jsonStr = JSON.stringify(tool.value);
                                if (request.result != undefined) {
                                    store.put(jsonStr, tool.key);
                                    console.log("Tool module: '" + tool.key + "' updated successful.");
                                } else {
                                    store.add(jsonStr, tool.key); // if new, add
                                    console.log("Tool module: '" + tool.key + "' added successfule.");
                                }
                            };
                            request.onerror = function (evt) {
                                console.log("Attempt to save tool key = '" + tool.key + "' failed, cause: " + evt.message);
                            };
                        });
                    };
                }
            } catch (ex) {
                console.log("Save tool Modules failed, cause: " + ex.message);
            }
        };
        ClientDB.DB_NAME = "PVMapperData";
        ClientDB.CONFIG_STORE_NAME = "PVMapperScores";
        ClientDB.PROJECT_STORE_NAME = "PVMapperProjects";
        ClientDB.TOOLS_STORE_NAME = "PVMapperTools";
        ClientDB.db = null;
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

    // Class
    var dataManager = (function () {
        // Constructor
        function dataManager() {
        }
        dataManager.prototype.postScore = function (score, rank, siteId, toolId) {
            $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId }, function (data) {
                // refresh scoreboard.
                //Ext.getCmp('scoreboard-grid-id')).store.load();
                //Ext.getCmp('scoreboard-grid-id').getView().refresh();
                var grid = Ext.getCmp('scoreboard-grid-id');
                grid.store.load();
                grid.getView().refresh();
            });
        };

        dataManager.prototype.getSite = function (siteId) {
            return $.get("/api/ProjectSite/" + siteId);
        };

        dataManager.prototype.postSite = function (aName, aDesc, aPolygon) {
            return $.post("/api/ProjectSite", {
                name: aName,
                description: aDesc,
                isActive: true,
                polygonGeometry: aPolygon
            });
        };

        dataManager.prototype.updateSite = function (siteId, aName, aDesc, aPoly) {
            //Only send the stuff that was passed into this function.
            var data = new SiteData();
            data.id = siteId;
            data.isActive = true;
            if (aName)
                data.name = aName;
            if (aDesc)
                data.description = aDesc;
            if (aPoly)
                data.polygon = aPoly;

            return $.ajax("/api/ProjectSite", {
                data: data,
                type: "PUT"
            });
            //pvMapper.displayMessage("The site has been updated.","Info");
        };

        //Deletes a site from the datastore
        dataManager.prototype.deleteSite = function (siteId) {
            return $.ajax("/api/ProjectSite/" + siteId, {
                data: {
                    Id: siteId,
                    type: "DELETE"
                }
            });
        };
        return dataManager;
    })();
    pvMapper.dataManager = dataManager;
})(pvMapper || (pvMapper = {}));
//# sourceMappingURL=DataManager.js.map

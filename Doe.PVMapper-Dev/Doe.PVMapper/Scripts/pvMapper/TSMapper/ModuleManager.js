var pvMapper;
(function (pvMapper) {
    var ModuleManager = (function () {
        function ModuleManager() {
            this.tools = new Array();
        }
        ModuleManager.prototype.loadTool = function (mod) {
            var aTool;
            //TODO: add code to load a module tool
            return aTool;
        };
        ModuleManager.prototype.add = /**
        Add a tool module to the module manager list.
        @param mod: ITool - a module tool to be added to the module manager.
        */
        function (mod) {
            var idx = 0;
            idx = this.tools.push(mod);
            return idx;
        };
        ModuleManager.prototype.remove = function (mod) {
            var isRemoved = false;
            //remove the tool module from the module manager list.
            try  {
                this.tools.splice(0, 1, mod);
                isRemoved = true;
            } catch (ex) {
            }
            return isRemoved;
        };
        ModuleManager.prototype.activate = //activate the tool module.
        function (mod) {
            var isActivated = false;
            if(this.tools.indexOf(mod, 0) >= 0) {
                if(mod.onActivate != null) {
                    isActivated = mod.onActivate(mod, new EventArg());
                }
            }
            return isActivated;
        };
        ModuleManager.prototype.deactivate = //deactivate the tool module.
        function (mod) {
            var isDeactivated = false;
            if(this.tools.indexOf(mod, 0) >= 0) {
                if(mod.onActivate != null) {
                    isDeactivated = mod.onDeactivate(mod, new EventArg());
                }
            }
            return isDeactivated;
        };
        return ModuleManager;
    })();
    pvMapper.ModuleManager = ModuleManager;    
})(pvMapper || (pvMapper = {}));
//@ sourceMappingURL=ModuleManager.js.map

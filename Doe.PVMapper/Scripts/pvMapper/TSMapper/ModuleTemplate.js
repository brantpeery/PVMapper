var Modules;
(function (Modules) {
    var Module = (function () {
        function Module() {
            var myModule = new pvMapper.Module({
                id: "",
                author: "",
                version: "",
                activate: function () {
                },
                deactivate: null,
                destroy: null,
                init: null,
                scoringTools: [
                    {
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init: null,
                        title: "",
                        description: "",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                        },
                        updateScoreCallback: function (score) {
                        }
                    }
                ],
                infoTools: null
            });
        }
        return Module;
    })();    
    var modInstance = new Module();
})(Modules || (Modules = {}));

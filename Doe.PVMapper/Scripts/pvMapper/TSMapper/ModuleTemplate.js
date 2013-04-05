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
                deactivate: function () {
                },
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
                        category: "",
                        onScoreAdded: function (event, score) {
                        },
                        onSiteChange: function (event, score) {
                        },
                        scoreUtilityOptions: {
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

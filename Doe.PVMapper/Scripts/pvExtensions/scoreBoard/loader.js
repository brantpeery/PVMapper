/// <reference path="../../_references.js" />
/// <reference path="UtilityWeights.js" />
/// <reference path="UtilityFunctions.js" />



(function (pvM) {
    pvM.onReady(function () {
        var path = "/Scripts/pvExtensions/scoreBoard/";
        $("<link/>").appendTo("head").attr({ rel: "stylesheet", type: "text/css", href: path + "Utility.css" });

        utilweight = Ext.create("Ext.Panel", {
            id:"UtilWeight",
            title: 'Weighting',
            xtype: 'panel',
            loader: {
                url: '/Scripts/pvExtensions/scoreBoard/UtilityWeights.html',
                scripts: false,
                autoLoad: true,
                success: function () {
                    //this.target.show();
                    console.log("Loading the utility weight scripts. The panel is rendered? " + this.target.rendered);

                    console.log("Loading the utility function scripts. The panel is rendered? " + this.target.rendered);
                    $.getScript(path + "UtilityFunctions.js", function () {
                        //Now that we have the script loaded, lets instanciate the objects
                        var utilityFunctionManager = new pvM.ScoringUtilities.UtilityFunctionsManager();
                        utilityFunctionManager.init();

                        //Load in the script file for the weight manager
                        $.getScript(path + "UtilityWeights.js", function () {
                            //Now that we have the script loaded, lets instanciate the objects
                            var weightManager = new pvM.ScoringUtilities.UtilityWeightsManager();
                            weightManager.init(utilityFunctionManager); //send in the UFM that should be used by this manager
                        });

                    })

                }

            }
        });


        var tPanel = Ext.create('Ext.tab.Panel', {
            activeTab: "UtilWeight",
            renderTo: document.body,
            layout: 'fit',
            //items: [utilfunc,utilweight]
            items: [utilweight]
        });

        pvMapper.tabs.add({
            
            layout: 'fit',
            title: 'Scoreboard',
            items: [tPanel],
            listeners: {
                activate: function (tab) {
                }
            }
        });

        
    });
})(pvMapper);
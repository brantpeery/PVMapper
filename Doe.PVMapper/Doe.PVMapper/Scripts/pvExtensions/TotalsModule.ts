/// <reference path="../pvMapper/TSMapper/pvMapper.ts" />
/// <reference path="../pvMapper/TSMapper/Site.ts" />
/// <reference path="../pvMapper/TSMapper/Score.ts" />
/// <reference path="../pvMapper/TSMapper/Tools.ts" />
/// <reference path="../pvMapper/TSMapper/Options.d.ts" />
/// <reference path="../pvMapper/TSMapper/Module.ts" />

module pvMapper {
    export module Tools {
        export class TotalScore {
            constructor() {
                var myModule: Module = new Module(<IModuleOptions>{
                    activate: () => { },
                    init: () => { },
                    destroy: () => { },
                    deactivate: () => { },

                    author: "Brant Peery, INL",
                    version: "0.1",
                    id: "TOTALS_TOOLS",
                    totalTools: [{
                        title: "Weighted Average Score",
                        description: "The weighted arithmetic mean of all scores for a site",
                        category: "Totals",
                        
                        activate: () => { },
                        init: () => { },
                        destroy: () => { },
                        deactivate: () => { },
                        //addedToScoreboard: () => { },
                        //removedFromScoreboard: () => { },

                        CalculateScore: function (values:IValueWeight[], site: Site) {
                            var total = 0;
                            var count = 0; //Count including weight
                            
                            values.forEach(function (v) {
                                total += v.utility * v.tool.weight;
                                count += v.tool.weight;
                            });

                            var average = total / count;

                            // post the average score to the feature, so that it can render correctly on the map
                            //TODO: is this really the best place to be mucking about with the feature attributes?
                            var feature = site.feature;
                            // test if the feature's average score value has changed
                            if (feature.attributes.overallScore !== average) {
                                feature.attributes.overallScore = average;
                                // set the score's color as an attribute on the feature (note - this is at least partly a hack...)
                                feature.attributes.fillColor = (!isNaN(average)) ? pvMapper.getColorForScore(average) : "";
                                // redraw the feature
                                if (feature.layer) {
                                    feature.layer.drawFeature(feature);
                                }
                            }

                            //Return the basic average 
                            return { utility: average, popupMessage: "Average" };
                        }                      
                    }, {
                        title: "Lowest Score",
                        description: "The lowest score for a site, and the name of the tool which generated that score",
                        category: "Totals",

                        activate: () => { },
                        init: () => { },
                        destroy: () => { },
                        deactivate: () => { },
                        //addedToScoreboard: () => { },
                        //removedFromScoreboard: () => { },

                        CalculateScore: function (values: IValueWeight[], site: Site) {
                            var min = Number.POSITIVE_INFINITY;
                            var title;
                            values.forEach(function (v) {
                                // skip 0-weight scores tools...
                                if (v.tool.weight) {
                                    if (typeof v.utility !== 'undefined' && v.utility < min) {
                                        min = v.utility;
                                        title = v.tool.title;
                                    }
                                }
                            });

                            if (isNaN(min) || !isFinite(min)) {
                                min = NaN; // NaN is already used to flag bad values...
                                title = null; // no need for a popup 
                            }

                            return { utility: min, popupMessage: title };
                        }
                    }],
                    infoTools: null
                });
            }
        }
    }

    var TotalAverageScoreInstance = new pvMapper.Tools.TotalScore();
}


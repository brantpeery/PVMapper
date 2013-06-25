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
                    totalTools: [<ITotalTool>{
                        title: "Total Score",
                        description: "The total scores for the sites, calculated across all categories.",
                        category: "Totals",
                        
                        activate: () => { },
                        init: () => { },
                        destroy: () => { },
                        deactivate: () => { },
                        //addedToScoreboard: () => { },
                        //removedFromScoreboard: () => { },

CalculateScore: function (values:IValueWeight[]) {
                            var total = 0;
                            var count = 0; //Count including weight
                            
                            values.forEach(function (v) {
                                total += v.value * v.weight;
                                count += v.weight;
                            });

                            //Return the basic average 
                            return total / count;
                        }                      
                    }],
                    infoTools: null
                });
            }
        }
    }

    var TotalAverageScoreInstance = new pvMapper.Tools.TotalScore();
}


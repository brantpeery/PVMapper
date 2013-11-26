/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="Options.d.ts" />
/// <reference path="SiteManager.ts" />

module pvMapper {
    export class TotalLine implements ITotalTool {
        constructor(options: ITotalTool) {
            this.CalculateScore = options.CalculateScore;
            this.title = options.title;
            //this.name = options.name;
            this.description = options.description;

            this.init = options.init || function () { };
            this.destroy = options.destroy || function () { };
            this.activate = options.activate || function () { };
            this.deactivate = options.deactivate || function () { };

        }

        public ValueChangedEvent = new pvMapper.Event();

        public init: ICallback;
        public destroy: ICallback;
        public activate: ICallback;
        public deactivate: ICallback;
        public title: string;
        public description: string;
        public longDescription: string;

        public category = "Totals";
        public scores: IScore[] = [];
        public CalculateScore: (values: IValueWeight[], site: Site) => IScore;
        public UpdateScores(lines: ScoreLine[]) {
            //Setup an array of sites(scores) that contain all the scoringTool values
            var numSites: number = (lines.length > 0) ? lines[0].scores.length : 0;

            if (numSites < this.scores.length) {
                //Remove the excess scores
                this.scores.splice(numSites, this.scores.length - numSites);
            }
            
            //Loop through all the sites on the scoreboard
            for (var idx = 0; idx < numSites; idx++) {
                var site: Site = null;
                var values: IValueWeight[] = [];
                
                //Aggragate all the scoreline's values into an array
                lines.forEach((line) => {
                    //TODO: This should be the weighted score
                    if (line.scores && line.scores[idx] && !isNaN(line.scores[idx].utility)) {
                        site = line.scores[idx].site; // during this loop, this will (should?) always be the same site
                        values.push({ utility: line.scores[idx].utility, tool: line });
                    }
                });

                //Create a new score if one doesn't exist for this index
                if (!this.scores[idx]) {
                    this.scores.push({ utility: 0 });
                }

                //Update the score on the total line using the tools CalculateScore method
                this.scores[idx] = this.CalculateScore(values, site);
            }
        }
    }
}
/// <reference path="IEventTypes.ts" />
/// <reference path="ScoreUtility.ts" />
/// <reference path="Score.ts" />
/// <reference path="Site.ts" />
/// <reference path="SiteManager.ts" />

module pvMapper {
    export class TotalLine implements ITotalTool, IToolLine {
        constructor(options: ITotalTool, parentModule: Module) {
            this.getModule = () => { return parentModule; };

            if (console && console.assert) console.assert(!!options.id, "Tool ID is required");
            this.id = options.id;

            this.title = options.title || parentModule.title || this.title || 'Unnamed Tool';
            this.category = options.category || (parentModule && parentModule.category) || this.category || 'Totals';
            this.description = options.description || (parentModule && parentModule.description) || this.description || "";
            this.longDescription = options.longDescription || (parentModule && parentModule.longDescription) || this.longDescription || "";

            this.CalculateScore = options.CalculateScore;

            //this.init = options.init || function () { };
            //this.destroy = options.destroy || function () { };
            //this.activate = options.activate || function () { };
            //this.deactivate = options.deactivate || function () { };
        }
        public getModule: () => pvMapper.Module;

        //public getModule(): pvMapper.Module { return null; }

        public ValueChangedEvent = new pvMapper.Event();

        //public init: ICallback;
        //public destroy: ICallback;
        //public activate: ICallback;
        //public deactivate: ICallback;
        public id: string;
        public title: string;
        public description: string;
        public longDescription: string;

        public category = "Totals";
        public scores: IScoreJSON[] = [];

        public toJSON(): IToolJSON {
            var o = {
                id: this.id,
                title: this.title,
                category: this.category,
                description: this.description,
                longDescription: this.longDescription,
                scores: this.scores
            }
            return o;
        }

        public fromJSON(o: IToolJSON) {
            if (console && console.assert) console.assert(o.id === this.id);

            //this.title = o.title; //TODO: if we allow users to change the names of tool lines, then we should re-enable this line.
            // we don't want to load a lot of these - our current values are likely better than the old saved description etc.
            //this.description = o.description;
            //this.longDescription = o.longDescription;
            //this.category = o.category;
            //this.scores = o.scores;
        }

        // gets the score object from the given array of scores which matches the given site (using idx as a hint to its position in the array)
        private static getScoreForSiteFromLine(line: { id: string; scores: IScoreJSON[]; }, site: Site, hintIndex: number) {
            var scores = line.scores;
            var score = (scores.length > hintIndex) && scores[hintIndex]; // <-- attempt to shortcut the full ID search
            if (!score || (score.site && score.site.id !== site.id)) {
                // try to find this score the hard way... (may be time consuming for our supported edge case of using many sites)
                var filteredScores = scores.filter((s) => s.site.id === site.id );

                score = filteredScores.length && filteredScores[0];

                // perform some logging etc.
                if (console && console.warn && score) console.warn(
                    "Warning: unaligned score array found in score line ID='" + line.id + "'");

                if (console && console.assert) console.assert(filteredScores.length <= 1,
                    "Warning: score line ID='" + line.id + "' holds duplicate scores for site ID='" + site.id + "'");
            }
            return score;
        }

        
        public CalculateScore: (values: IValueWeight[], site: Site) => IScore;
        public UpdateScores = (lines: ScoreLine[]) => {
            //Setup an array of sites(scores) that contain all the scoringTool values

            this.scores = siteManager.getSites().map((site, index) => {
                //Aggragate all valid scores for this site into an array
                var scoresToTotal: IValueWeight[] = [];
                lines.forEach((line) => {
                    //TODO: This should be the weighted score
                    var score = TotalLine.getScoreForSiteFromLine(line, site, index);

                    if (score && typeof score.utility === "number" && isFinite(score.utility)) {
                        scoresToTotal.push({ utility: score.utility, site: site, scoreLine: line });
                    }
                });

                // get the Total line's score object which we'll update with our new total
                var score = TotalLine.getScoreForSiteFromLine(this, site, index) ||
                    { utility: NaN, site: { id: site.id }, scoreLine: { id: this.id } };

                //Update the score on the total line using the tools CalculateScore method
                if (scoresToTotal.length) {
                    var scoreUpdate = this.CalculateScore(scoresToTotal, site);
                    score.utility = scoreUpdate.utility;
                    score.popupMessage = scoreUpdate.popupMessage;
                }

                return score;
            });
        }
    }
}
/// <reference path="common.ts" />
/// <reference path="Site.ts" />

// Module
module pvMapper {
    export interface IScore {
        utility: number;
        popupMessage?: string;
    }

    export interface ISiteScore extends IScore {
        value: number;
        site: Site;
        valueChangeEvent: pvMapper.Event;
        siteChangeEvent: pvMapper.Event;
        updateValue: (value: number) => number;
    }

    export interface IScoreJSON extends IScore {
        utility: number;
        popupMessage?: string;
        value?: number;
        //site: ISiteJSON;
        site: { id: string };
        scoreLine: { id: string };
    }

    export interface IValueWeight extends IScoreJSON {
        scoreLine: {
            id: string;
            title: string;
            weight: number;
            //category: string;
            //description: string;
            // etc...
        };
    }

    /**
     * A PVMapper.Score object. Tracks the score for a site. Ties a site to a scoring line and represents a line's value cell for a site.
     *
     * @variable {string} value The value that was calculated for the site. Uses the site geometry and the tool to figure the value. Updated by the tool
     * @variable {string} popupMessage The message to display when the mouse hovers  over the scoring cell on the interface
     */
    export class Score implements ISiteScore{
        /**
         * Creates a Score object. Ties the site's change event to this scores score changed event
         *
         * @constructor
         * @param {PVMapper.Site}  site The site that this score will track
         * @return {PVMapper.Score} New Score object
         */
        constructor(site: pvMapper.Site, scoreLine: IToolLine) {
            this.value = Number.NaN;
            this.utility = Number.NaN;
            //A reference to the site this score represents
            this.site = site;
            this.scoreLine = scoreLine;

            //The long message formated in HTML that explains the value or score
            this.popupMessage = null;

            this.valueChangeEvent = new pvMapper.Event();
            this.siteChangeEvent = new pvMapper.Event();

            //Grab onto the change event for the site
            this.siteChangeHandler = (e: any) => {
                e.data = this;
                //if (console) console.log('A score for site ' + this.site.name + ' has detected a site change pvMapper.Event.fire its own event now.');
                this.siteChangeEvent.fire(this, [e, this]);
            };

            this.site.changeEvent.addHandler(this.siteChangeHandler);
        }

        private siteChangeHandler: (e: any) => void;

        public deactivate = () => {
            try {
                this.site.changeEvent.removeHandler(this.siteChangeHandler);
            } catch (e) {
                if (console && console.warn) console.warn("Failed to remove site change handler while destroying score object: " + e.toString());
            }

            //this.site = null;
            //this.scoreLine = null;

            this.valueChangeEvent = null;
            this.siteChangeEvent = null;

            //this.siteChangeHandler = null;
        }

        /// <Summary>A reference the this object independent of scope</Summary>
        public site: pvMapper.Site;
        public scoreLine: IToolLine;

        /**
         * A textual description of the raw value as provided by the scoring tool
         */
        public popupMessage: string;

        /**
         * The raw value reported by the scoring tool.
         * Number.NaN indicates an invalid / outdated / error-full value.
        */
        public value: number;

        // the computed utility based on the raw value provided by the score tool
        // Number.NaN indicates an invalid / outdated / error-full value
        public utility: number;

        public isValueOld = false;

        // fancy events for tracking changes
        public valueChangeEvent: pvMapper.Event;
        //public invalidateEvent: pvMapper.Event = new pvMapper.Event();
        public siteChangeEvent: pvMapper.Event;

        /**
         * Updates the value and fires the value cahnged event. The ScoreLine this Score object belongs to subscribes to this event.
         * This event fires so that things like the score board can update themselves when scores change.
         *
         * @param {number} the new value
         * @return {number} the new value
         */
        public updateValue = (value: number) => {
            if (console && console.warn && !this.isValueOld) console.warn(
                "Warning: Received an unexpected score update (the score tool ID='" + this.scoreLine.id + "' may be running slow)");
            this.isValueOld = false; // a reasonable assumption

            //Change the context, add this score to the event and pass the event on
            var oldvalue = this.value;
            this.value = value;

            //fire the value updated event
            if (this.valueChangeEvent) {
                this.valueChangeEvent.fire(this, { score: this, oldValue: oldvalue, newValue: value });
            } else {
                if (console && console.warn) console.warn("Warning: attempted to update a deactivated score (tool='" +
                    (this.scoreLine && this.scoreLine.id) + "', site='" + (this.site && this.site.id)  + "')");
            }

            return this.value;
        }

        //public setError(description: string) {
        //    this.popupMessage = description;
        //    this.value = Number.NaN;
        //    this.utility = Number.NaN;
        //}

        public toString = () => {
            if (this.popupMessage) {
                return this.popupMessage;
            } else if (typeof this.value !== "undefined" && this.value !== null && !isNaN(this.value)) {
                return this.value.toString();
            } else {
                return "No value";
            }
        }

        public toJSON = (): IScoreJSON => {
            return {
                popupMessage: this.popupMessage,
                value: this.value,
                utility: this.utility,
                site: { id: this.site.id },
                scoreLine: { id: this.scoreLine.id },
            }
        }
        
        public fromJSON = (o: IScoreJSON) => {
            if (console && console.assert) console.assert(this.site && o.site && this.site.id === o.site.id, "Warning: site ID did not match when loading score from JSON");
            if (console && console.assert) console.assert(this.scoreLine && o.scoreLine && this.scoreLine.id === o.scoreLine.id, "Warning: scoreLine ID did not match when loading score from JSON");

            this.popupMessage = o.popupMessage;
            this.value = o.value;
            this.utility = o.utility;
            //The site should have been created.
            //this.site.fromJSON(o.site);   
        }
    }
}


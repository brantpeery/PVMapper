/// <reference path="common.ts" />
/// <reference path="Site.ts" />

// Module
module pvMapper {
    export interface IScore{
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
        constructor(site: pvMapper.Site) {
            this.self = this;
            //this.parent; //Assign the parent so that we can use the scoring functions
            this.value = Number.NaN;
            this.utility = Number.NaN;
            //A reference to the site this score represents
            this.site = site;

            //The long message formated in HTML that explains the value or score
            this.popupMessage = null;

            //Grab onto the change event for the site
            this.site.changeEvent.addHandler((e: any) => {
                e.data = this;
                if (console) console.log('The score ' + this.site.name + ' has detected a site change pvMapper.Event.fire its own event now.');
                this.siteChangeEvent.fire(this, [e,this]);
            });
        }

        /// <Summary>A reference the this object independent of scope</Summary>
        public self;
        public site: pvMapper.Site;
        //public parent: IScoreTool;

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

        // fancy events for tracking changes
        public valueChangeEvent: pvMapper.Event = new pvMapper.Event();
        //public invalidateEvent: pvMapper.Event = new pvMapper.Event();
        public siteChangeEvent: pvMapper.Event = new pvMapper.Event();

        //Sets the utility value for the score. Fires the utilityChanged event
        public setUtility(value:number) {
            
            this.utility = value;

            //TODO: fire some kind of utilityChangedEvent, or somehting?
        }

        /**
         * Updates the value and fires the value cahnged event. The ScoreLine this Score object belongs to subscribes to this event.
         * This event fires so that things like the score board can update themselves when scores change.
         *
         * @param {number} the new value
         * @return {number} the new value
         */
        public updateValue(value: number) {
            //Change the context, add this score to the event and pass the event on
            var oldvalue = this.value;
            this.value = value;
            
            //TODO: pvMapper.displayMessage(this.value,"Info");

            //fire the value updated event
            this.valueChangeEvent.fire(this.self, { score:this.self, oldValue: oldvalue, newValue: value });
            return this.value;
        }

        //public setError(description: string) {
        //    this.popupMessage = description;
        //    this.value = Number.NaN;
        //    this.utility = Number.NaN;
        //}

        public toString() {
            if (this.popupMessage && this.popupMessage.trim().length > 0) {
                return this.popupMessage;
            } else if (typeof this.value !== "undefined" && !isNaN(this.value)) {
                return this.value.toString();
            } else {
                return "No value";
            }
        }
    }

}


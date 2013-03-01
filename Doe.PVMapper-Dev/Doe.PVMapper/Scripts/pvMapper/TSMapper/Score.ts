/// <reference path="common.ts" />
/// <reference path="Site.ts" />
/// <reference path="../../ext-4.1.1a.d.ts" />


// Module
module pvMapper {

    /***
    * A PVMapper.Score object. Tracks the score for a site. Ties a site to a scoring line and represents a line's value cell for a site.
    *
    * @variable {string} value The value that was calculated for the site. Uses the site geometry and the tool to figure the value. Updated by the tool
    * @variable {string} popupMessage The message to display when the mouse hovers  over the scoring cell on the interface
    */
    export class Score {
        /**
          * Creates a Score object. Ties the site's change event to this scores score changed event
          *
          * @constructor
          * @param {PVMapper.Site}  site The site that this score will track
          * @return {PVMapper.Score} New Score object
          */
        constructor(site: pvMapper.Site) {
            this.self = this;
            this.value = "";
            //A reference to the site this score represents
            this.site = site;

            //The long message formated in HTML that explains the value or score
            this.popupMessage = null;

            //Grab onto the change event for the site
            this.site.changeEvent.addHandler((e: any) => {
                e.data = this;
                /*debug*/ console.log('The score ' + this.site.name + ' has detected a site change pvMapper.Event.fire its own event now.');
                this.siteChangeEvent.fire(this, [e,this]);
            });


        }

        /// <Summary>A reference the this object independent of scope</Summary>
        public self;
        public site: pvMapper.Site;
        public popupMessage: string;

        public valueChangeEvent: pvMapper.Event = new pvMapper.Event();
        public invalidateEvent: pvMapper.Event = new pvMapper.Event();
        public siteChangeEvent: pvMapper.Event = new pvMapper.Event();

        //Calculates the utility score for the value passed in or if no value is passed in it uses the current value property
        public calculateUtility(value: string): string {
            if (typeof (value) != 'undefined') { return this.updateValue(value); }
            return this.value;
        }

        public updateValue(value: string): string {
            //Change the context, add this score to the event and pass the event on
            var oldvalue: string = this.value;
            this.value = value;
            //TODO: pvMapper.displayMessage(this.value,"Info");

            //fire the value updated event
            this.valueChangeEvent.fire(this.self, { oldvalue: oldvalue, newvalue: value });
            return this.value;
        }


        public value: string;
        public toString() {
            if (this.popupMessage && this.popupMessage.trim().length > 0) {
                return this.popupMessage;
            } else { return this.value; }
        }
    }

}

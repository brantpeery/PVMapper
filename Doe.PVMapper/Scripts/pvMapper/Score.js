(function (pvM) {
    pvM.Score = function (site) {
        //Events
        this.valueChangeEvent = new Event();
        this.invalidateEvent = new Event();
        this.siteChanged = new Event();

        //Validate input
        if (!site instanceof pvM.Site) { throw ("Parameter 'site' is not a pvMapper.Site object"); }

        //Private members
        

        //Public members
        this.site;                  //A reference to the site this score represents
        this.popupMessage = null;   //The long message formated in HTML that explains the value or score
        this.value = "";            //The textual value of the evaluation along with the units and anything else that makes the value meaningfull (ex. Light Industrial Zoning or 3 Turtle Nests)
        this.utility = {};           //The utility object that is used to calculate the utility value
        this.calculateUtility = function (value) { }; //Calculates the utility score for the value passed in or if no value is passed in it uses the current value property
    }


    pvM.Score.prototype.toString = function () {
        if (this.popupMessage && this.popupMessage.trim().length > 0) {
            return this.popupMessage;
        } else { return this.value; }
    }

})(pvMapper);
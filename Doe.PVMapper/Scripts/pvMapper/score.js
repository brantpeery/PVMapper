(function (pvM) {
    pvM.score = function (site) {
        //Events
        this.valueChangeEvent = new Event();
        this.invalidateEvent = new Event();

        //Validate input
        if (site.prototype != pvM.site) { throw ("Parameter 'site' is not a pvMapper.site object"); }

        //Private members
        var test1 = 1;

        //Public members
        this.site;                  //A reference to the site this score represents
        this.popupMessage = null;   //The long message formated in HTML that explains the value or score
        this.value = "";            //The textual value of the evaluation along with the units and anything else that makes the value meaningfull (ex. Light Industrial Zoning or 3 Turtle Nests)
        this.score = 0              //The evaluated score of the site as it compares to the other sites. This should be 0 to 1 (ex. .48)
    }


    pvM.score.prototype.toString = function () {
        if (this.popupMessage && this.popupMessage.trim().length > 0) {
            return this.popupMessage;
        } else { return this.value; }
    }

})(pvMapper);
(function (pvM) {
    pvM.Score = function (site) {
        var self = this;
        var myvalue = "";            //The textual value of the evaluation along with the units and anything else that makes the value meaningfull (ex. Light Industrial Zoning or 3 Turtle Nests)

        //Events
        this.valueChangeEvent = new pvM.Event();
        this.invalidateEvent = new pvM.Event();
        this.siteChangeEvent = new pvM.Event();

        //Validate input
        if (!site instanceof pvM.Site) { throw ("Parameter 'site' is not a pvMapper.Site object"); };

        //Private members


        //Public members
        this.site = site;           //A reference to the site this score represents
        this.popupMessage = null;   //The long message formated in HTML that explains the value or score
        //this.utility = {};           //The utility object that is used to calculate the utility value
        this.calculateUtility = function (value) { }; //Calculates the utility score for the value passed in or if no value is passed in it uses the current value property
        this.value = function (value) {
            if (typeof (value) != 'undefined') { return self.updateValue(value); }

            return myvalue;
        };
        this.updateValue = function (value) {
            var oldvalue = self.myValue;
            myvalue = value;
            pvM.displayMessage(myvalue);

            //Fire the value updated event
            self.valueChangeEvent.fire(self, { oldvalue: oldvalue, newvalue: value });
            return myvalue;
        };

        //Grab onto the change event for the site
        this.site.changeEvent.addHandler(onSiteChanged);

        function onSiteChanged(event) {
            //Change the context, add this score to the event and pass the event on
            event.score = self;
            /*debug*/console.log('The score ' + self.site.name + ' has detected a site change pvM.Event.Firing its own event now');
            self.siteChangeEvent.fire(self, [event, self]);
        };
    };


    pvM.Score.prototype.toString = function () {
        if (this.popupMessage && this.popupMessage.trim().length > 0) {
            return this.popupMessage;
        } else { return this.value; }
    };

})(pvMapper);
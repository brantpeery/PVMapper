var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
// Module
var pvMapper;
(function (pvMapper) {
    var ScoreEvent = (function (_super) {
        __extends(ScoreEvent, _super);
        function ScoreEvent() {
            _super.apply(this, arguments);

        }
        return ScoreEvent;
    })(pvMapper.Event);
    pvMapper.ScoreEvent = ScoreEvent;    
    // Class
    var ScoringTool = (function () {
        // Constructor
        function ScoringTool() {
            this.calculateCallback = null;
            this.updateCallback = null;
        }
        ScoringTool.prototype.onSiteChange = function (event, score) {
            //Fires when a score has been notified that it's site has changed
            if(this.updateCallback != null) {
                this.updateCallback(score.site);
            }
            //Update the property (only do this if this is a very fast calculation)
            if(this.calculateCallback != null) {
                score.updateValue(this.calculateCallback(score.site));
            }//Do it this way so the score can manage getting itself refreshed on the screen and in the DB
            
        };
        ScoringTool.prototype.onScoreAdded = function (event, score) {
            //This will be called when a score is added to the scoreline that represents this tool
            //Really don't need to do anything here as the framework will be asking for the updated value later
                    }//these are delegate function place holders.
        ;
        return ScoringTool;
    })();
    pvMapper.ScoringTool = ScoringTool;    
    var Intent = (function () {
        function Intent() {
            this.calculateArea = null;
        }
        Intent.prototype.Area = function (geometry) {
            if(this.calculateArea != null) {
                return this.calculateArea(geometry);
            } else {
                return null;
            }
        };
        Intent.prototype.OffsetArea = function (geometry, offset) {
            if(this.calculateArea != null) {
                return this.calculateArea(geometry, offset);
            } else {
                return null;
            }
        };
        return Intent;
    })();
    pvMapper.Intent = Intent;    
})(pvMapper || (pvMapper = {}));


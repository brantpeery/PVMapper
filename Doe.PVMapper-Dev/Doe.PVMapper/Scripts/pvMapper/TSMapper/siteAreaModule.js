var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    var ScoringTool = (function () {
        function ScoringTool() {
            this.calculateCallback = null;
            this.updateCallback = null;
        }
        ScoringTool.prototype.onSiteChange = function (event, score) {
            if(this.updateCallback != null) {
                this.updateCallback(score.site);
            }
            if(this.calculateCallback != null) {
                score.updateValue(this.calculateCallback(score.site));
            }
        };
        ScoringTool.prototype.onScoreAdded = function (event, score) {
        };
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

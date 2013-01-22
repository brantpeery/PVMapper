/// <reference path="../_references.js" />


(function (pvM) {
    console.log("loading the function script stuff");
    if (!pvM.ScoringUtilities) { pvM.ScoringUtilities = {}; }
    $.extend(pvM.ScoringUtilities, {
        UtilityFunctionsManager: function () {
            var currentFunction, board, f2; //Variables to run the board
            var self = this;

            this.init = function () {
                
                console.log("Init utilities functions");
                $(".utilityFunctions input.slider").wrap("<div class='slide-wrapper'/>");
                $("<div></div>").insertAfter(".utilityFunctions input.slider")
                .slider({
                    "create": function (event, ui) {
                        $(this).slider("value", $(this).prev("input.slider").val());
                    }
                })
                .on("slide", function (event, ui) {
                    $(event.target).prev("input.slider").val(ui.value).change();
                });

                //Set the selector
                $("#FunctionSelector option").on("click", function (event, ui) {
                    self.updateBoard();
                });

                if (typeof (JXG) == "undefined") {
                    console.log("Loading in the JXG Graph script");
                    $("<link/>")
                        .appendTo("head")
                        .attr({ rel: "stylesheet", type: "text/css", href: "http://jsxgraph.uni-bayreuth.de/distrib/jsxgraph.css" });
                    $.getScript("http://cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.93/jsxgraphcore.js", function () {
                        loadBoard();
                    });
                } else {
                    loadBoard();
                }
            };

            this.updateBoard = function () {
                var currentFunction = UtilityFunctions[$(".utilityFunctions #FunctionSelector").val()];
                if (currentFunction) {
                    f2.Y = currentFunction;
                    board.update();
                }
            }

            this.loadValues = function () {

            };

            this.saveValues=function(id, data){

            }

            this.getValue=function(x){
                return f2.Y(x);
            }

            function loadBoard() {

                console.log("Initing the graph board");
                board = JXG.JSXGraph.initBoard('box', { boundingbox: [0, 1.05, 100, -.05], axis: true, showCopyright: false, showNavigation: false });
                console.log("Board ready!");
                var p = [];

                //p[0] = board.create('point', [0, 0], { size: 2, face: 'o' });
                //p[1] = board.create('point', [100, 1], { size: 2, face: 'o' });
                //p[2] = board.create('point', [50, 0.5], { size: 2, face: 'o', });

                //var c = board.create('spline', p, { strokeWidth: 3 });
                //var f = board.create('functiongraph', [utilityFunction1], { strokeWidth: 3 })
                f2 = board.create('functiongraph', [UtilityFunctions.utilityFunction1], { strokeWidth: 3, strokeColor: "red" })

                //var g = board.create('glider', [1.5, 0, c], { name: '', style: 8 });
                //var t = board.create('tangent', [g], { dash: 2, strokeColor: '#aa0000' });
            };

            function addPoint() {
                p.push(board.create('point', [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 3], { size: 4, face: 'o' }));
                board.update();
            }

            var UtilityFunctions = {
                utilityFunction1: function (x) {
                    var l = parseInt($("#MinValue").val());
                    var b = parseInt($("#TargetValue").val());
                    var h = parseInt($("#MaxValue").val());
                    var s = parseInt($("#SlopeValue").val());
                    var y = 0;

                    if (x >= h) y = 1;
                    else if (x <= l) y = 0;
                    else y = 1 / (1 + Math.pow((b - l) / (x - l), (2 * (1 / s) * (b + x - 2 * l))));

                    if (y >= 1) y = 1;
                    if (y <= 0) y = 0;
                    return 1 - y;
                },

                utilityFunction2: function (x) {
                    var l = parseInt($("#MinValue").val());
                    var b = parseInt($("#TargetValue").val());
                    var h = parseInt($("#MaxValue").val());
                    var s = 1 / parseInt($("#SlopeValue").val());
                    var y = 0;

                    if (x >= h) y = 1;
                    else if (x <= l) y = 0;
                    else y = (x < b) ? 1 / (1 + Math.pow((b - l) / (x - l), (2 * s * (b + x - 2 * l)))) :
                        1 - (1 / (1 + Math.pow((b - (2 * b - h)) / ((2 * b - x) - (2 * b - h)), (2 * s * (b + (2 * b - x) - 2 * (2 * b - h))))));
                    if (y >= 1) y = 1;
                    if (y <= 0) y = 0;
                    return y;
                },
                UtilityFunction3: function (x) {

                }
            }
        }
    });

})(pvMapper);
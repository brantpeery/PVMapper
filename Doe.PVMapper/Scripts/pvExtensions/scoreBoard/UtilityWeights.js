/// <reference path="../_references.js" />

(function (pvM) {
    console.log("Loading UtilityWeightsManager object");
    if (!pvM.ScoringUtilities) { pvM.ScoringUtilities = {}; }
    $.extend(pvM.ScoringUtilities, {
        UtilityWeightsManager: function () {
            //@Parameter ufm: the UtilityFunctionsManager that coexists with the weighting heirarchy
            this.init = function (ufm) {
                console.log("Init for UtilityWeightsManager");
                $("ul.toolHierarchy").treeview({
                    animated: "fast",
                    collapsed: true,
                    unique: true,
                    //persist: "cookie"
                });

                $(".toolHierarchy li input").on("change", function (event) {
                    $elem = $(event.target);

                    updateParentBranch($elem.closest("li"));
                });



                $("<div></div>").insertAfter(".toolHierarchy input.slider")
                .slider({
                    "create": function (event, ui) {
                        $(this).slider("value", $(this).prev(".toolHierarchy input.slider").val());
                    }
                })
                .on("slide", function (event, ui) {
                    $(event.target).prev("input.slider").val(ui.value).change();
                });

                $(".toolHierarchy p, .toolHierarchy div").css("display", "inline-block");

                $(".toolHierarchy li:not(li:has(li))").addClass("leaf")
                    .append("<img class='funcButton' src='http://localhost:1919/Images/line_chart_24.png'></img>")
                    .children(".funcButton")
                    .click(function (e, ui) {
                        var target = this;
                        var title = $(this).parent().clone().children().remove().end().text();
                        $("#FunctionToolTitle").text(title);

                        //Load the values from the LI
                        var data = $(target).attr('data');
                        if (data) { data = JSON.parse(data); }

                        var dfaults = { min: 10, max: 100, target: 50, slope: 50, func:"utilityFunction1" };
                        $.extend(dfaults, data);
                        $(".utilityFunctions #MinValue").val(dfaults.min);
                        $(".utilityFunctions #MaxValue").val(dfaults.max);
                        $(".utilityFunctions #TargetValue").val(dfaults.target);
                        $(".utilityFunctions #SlopeValue").val(dfaults.slope);
                        $(".utilityFunctions #FunctionSelector").val(dfaults.func);

                        ufm.updateBoard();

                        //Save the values to the LI

                        $('.utilityFunctions input').add('select').off("change.uw").on("change.uw",function (e, ui) {
                            var data = {};
                            data.min = $(".utilityFunctions #MinValue").val();
                            data.max = $(".utilityFunctions #MaxValue").val();
                            data.target = $(".utilityFunctions #TargetValue").val();
                            data.slope = $(".utilityFunctions #SlopeValue").val();
                            data.func = $(".utilityFunctions #FunctionSelector").val();
                            
                            data = JSON.stringify(data);

                            $(target).attr('data', data);
                        });
                        //setUpUtilityFunction($(this).parent())
                    })
                .hover(function () {

                },
                    function () { }
                   );

                $(".toolHierarchy ul.toolHierarchy li").each(function (idx, elem) { updateParentBranch(elem) });
            }

            function updateParentBranch(element) {
                var $e = $(element);
                var $p = $e.parent().closest("li"); //Get the parent node

                if ($e.has("ul")) {
                    var val = (parseInt($e.find("input:first").val()) || 0);

                    //Get all the li
                    $e.siblings(".toolHierarchy li").find("input:first").each(function (idx, elem) {
                        var i = parseInt(elem.value);
                        val += (i) ? i : 0;
                    })


                    var $x = $p.find(".totalBranchValue").first();
                    if (val != 100) { $x.addClass("invalid-value"); }
                    else { $x.removeClass("invalid-value"); }

                    $x.html(val);
                }
            };
        }

    });
})(pvMapper);
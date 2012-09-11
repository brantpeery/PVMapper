/// <reference path="../_references.js" />

(function (pvM) {
    console.log("Loading UtilityWeightsManager object");
    if (!pvM.ScoringUtilities) { pvM.ScoringUtilities = {}; }
    $.extend(pvM.ScoringUtilities, {
        UtilityWeightsManager: function () {
            this.init = function () {
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

                $(".toolHierarchy li:not(li:has(li))").addClass("leaf");

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
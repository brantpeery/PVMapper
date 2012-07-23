Ext.onReady(function () {

    //http://www.codeproject.com/Articles/344078/ASP-NET-WebAPI-Getting-Started-with-MVC4-and-WebAP
    var scoreTest = new Ext.Action({
        text: "Score Slope",
        handler: function () {
            pvMapper.map.zoomTo(9)

            //Todo: replace these calls with the pvMapper.postScore()
            //,
            //               $.post(
            //               "/api/SiteScore",
            //                { score: "High", rank: Math.random(), siteId: "Arizona", ToolDescription: "Zapit1" }
            //                ),
            //                $.post(
            //                "/api/SiteScore",
            //                  { score: "Med", rank: Math.random(), siteId: "Arizona", ToolDescription: "Squishit" }
            //                 ),
            //                $.post(
            //                "/api/SiteScore",
            //                   { score: "5", rank: Math.random(), siteId: "Arizona", ToolDescription: "Scoreit" }
            //                 ),
            //                $.post(
            //                "/api/SiteScore",
            //                 { score: "High", rank: Math.random(), siteId: "Missouri", ToolDescription: "Zapit" }
            //                 ),
            //                $.post(
            //                "/api/SiteScore",
            //                  { score: "Med", rank: Math.random(), siteId: "Missouri", ToolDescription: "Squishit" }
            //                 ),
            //                $.post(
            //                "/api/SiteScore",
            //                   { score: "5", rank: Math.random(), siteId: "Missouri", ToolDescription: "Scoreit" }
            //                 )

            //                $("#addBook").serialize(),
            //                function (value) {
            //                    $("#bookTemplate").tmpl(value).appendTo("#books");
            //                    $("#name").val("");
            //                    $("#price").val("");
            //                },
            //                "json"

            //                jQuery.ajax({
            //                    type: "POST",
            //                    url: 'http://localhost:1919/api/SiteScore',
            //                    dataType: "json",

            //                    success: function (data) {
            //                        alert(data);
            //                    },
            //                    error: function (XMLHttpRequest, textStatus, errorThrown) {
            //                        alert("error");
            //                    }
            //                })
        }
        // tooltip: ""
    });
    pvMapper.toolbar.add(scoreTest);
});
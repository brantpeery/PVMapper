// File author : Rohan Raja (rohan1020)

var customModules = [];   // Will contain all the newly created modules
var cust_idx = 0;
var globalScore = [];


function create_custom_Module()
{
	var customModule = new pvMapper.Module({
                id: "customModule_" + cust_idx.toString(),
                author: "The User",
                version: "1",
                // activate: function () {
                //     _this.addMap();
                // },
                // deactivate: function () {
                //     _this.removeMap();
                // },
                destroy: null,
                init: null,
                scoringTools: [
                ],
                infoTools: null
            });
}

 var customModule ;
var sctools = [] ;


function edit_tool(the_idx)
{
    alert("Editing Tool No : " + the_idx);

}

function add_new_tool()
{

	var newToolForm = new Ext.form.Panel({
    width: 500,
    height: 200,
    title: 'Add new custom tool',
    floating: true,
    closable : true,
  
  items: [{
        xtype: 'textfield',
        id : 'new_name',
        name: 'Name',
        fieldLabel: 'Tool Name',
        allowBlank: false  // requires a non-empty value
    }, {
        xtype: 'textfield',
        id : 'new_val',
        name: 'new_val',
        fieldLabel: 'Value',
        allowBlank: false  // requires value to be a valid email address format
    }, {
        xtype: 'textfield',
        id : 'new_score',
        name: 'new_score',
        fieldLabel: 'Score',
        allowBlank: false
        //vtype: 'alphnum'  // requires value to be a valid email address format
    }],

     buttons: [{
            text: 'Add',
            anchor: '100%',
            id: 'addBtn',
            handler: function() {

            var to_continue = 0;

                $(newToolForm.items.items).each(function(i,val){

                    if(val.isValid() == false)
                        to_continue = 1;

                });

                if(!isFinite(document.getElementById('new_score-inputEl').value))
                {
                    alert('Score must be numeric');
                    to_continue = 1;
                }

                if(to_continue)
                    return 0;

         if(customModule == undefined)
         {       
                 customModule = new pvMapper.Module({
                id: "customModule_" + cust_idx.toString(),
                author: "The User",
                version: "1",
                // activate: function () {
                //     _this.addMap();
                // },
                // deactivate: function () {
                //     _this.removeMap();
                // },
                destroy: null,
                init: null,
                scoringTools: [
         
                ],
                infoTools: null
            });

            

        }
             sctools.push({
                        activate: null,
                        deactivate: null,
                        destroy: null,
                        init:null,
                        title: (document.getElementById('new_name-inputEl').value), // + " <a href='#' onClick='delete_custom_tool(this,"+ cust_idx.toString() + ")'>Delete</a>" ,
                        category: "All Custom Added Tools",
                        description: "The type of land cover found in the center of a site, using GAP land cover data hosted by gapanalysisprogram.com",
                        longDescription: '<p>This star rating tool finds the type of land cover present at the center of a proposed site. The GAP Land Cover dataset provides detailed vegetation and land use patterns for the continental United States, incorporating an ecological classification system to represent natural and semi-natural land cover. Note that the land cover at the center point of a site may not be representative of the overall land cover at that site. Note also that this dataset was created for regional biodiversity assessment, and not for use at scales larger than 1:100,000. Due to these limitations, results from this tool should be considered preliminary. For more information, see the USGS Gap Analysis Program (gapanalysis.usgs.gov/gaplandcover/data).</p><p>This tool depends on a user-defined star rating for the land cover classification found at each site, on a scale of 0-5 stars. The default rating for all land classes is three stars. These ratings should be adjusted by the user. The score for a site is based on the star rating of its land cover class (so overlapping a one-star class may give a score of 20, and overlapping a five-star class might give a score of 100). Like every other score tool, these scores ultimately depend on the user-defined utility function.</p>',
                        //onScoreAdded: (e, score: pvMapper.Score) => {
                        //},
                        onSiteChange: function (e, score) {                           
                           globalScore[cust_idx] = score;
                            score.popupMessage = (document.getElementById('new_val-inputEl').value);
                            score.updateValue(parseInt(document.getElementById('new_score-inputEl').value));
                        },
                        //getStarRatables: function (mode) {
                        //    if ((mode !== undefined) && (mode === "default")) {
                        //        return _this.starRatingHelper.defaultStarRatings;
                        //    } else {
                        //        return _this.starRatingHelper.starRatings;
                        //    }
                        //},
                        //setStarRatables: function (rateTable) {
                        //    $.extend(_this.starRatingHelper.starRatings, rateTable);
                        //},
                        //scoreUtilityOptions: {
                        //    functionName: "linear",
                        //    functionArgs: new pvMapper.MinMaxUtilityArgs(0, 5, "stars", "Under Development", "Preference", "Preference for vegetation cover and land uses.")
                        //},
                        weight: 10
                    });

               /* $.each(sctools, function (idx, toolOptions) {

                if (console) console.log('Adding a line for ' + toolOptions.title);
var
               
            });*/
            
             toolOptions = sctools[cust_idx] ;

                 var tool = new pvMapper.ScoreLine(toolOptions);
                pvMapper.mainScoreboard.addLine(tool);
                tool.scoreChangeEvent.fire(tool, undefined);

                //Add the scoring line to the scoring tools collection
                customModule.scoringTools[cust_idx] = tool;




 //   customModules.push(customModule);
    cust_idx = cust_idx + 1;

    newToolForm.close();
            }
        }]


});
newToolForm.show();




	 
}

  function delete_custom_tool(the_ele, the_idx)
  {

    pvMapper.mainScoreboard.scoreLines.splice(17-1-the_idx, 1);


  }

/*  function on_all_tools_completion()
  {
    $('#completed_val').css('background-color','green');
    $('#completed_val').css('color','white');

  }
*/

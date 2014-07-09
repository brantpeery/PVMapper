// File author : Rohan Raja (rohan1020)

function findIDX(the_title)
{
    for(i=0 ; i<pvMapper.mainScoreboard.scoreLines.length ; i++)
    {
        if($(pvMapper.scoreboardGrid.getView().getNode(i)).find('td:first div').html() == the_title)
            return i;
    }
}

  function scoreboard_refresh()
  {

    //alert('ref');

window.setTimeout(function () {


    count_false = 0;

    scoreLinesCopy = pvMapper.mainScoreboard.scoreLines ;

    $(pvMapper.mainScoreboard.scoreLines).each(function(i,val){

        idxx = findIDX(val.title);

        //if(isNaN(val.scores[0].value) == false)
        try{
            //TODO: this will only work once, as popup messages aren't cleared when sites are edited.
            //      also, it will falsely report completed updates for score tools which load a cached value before getting the actual value.
            //      also, it appears to only fetch the load progress for the first site (site 0), and I believe it will fail if there are no sites.
            if(val.scores[0].popupMessage != null )
            {   
                count_false++ ;
               $(pvMapper.scoreboardGrid.getView().getNode(idxx)).css('color', 'black') ;

            }
            else
            {
                $(pvMapper.scoreboardGrid.getView().getNode(idxx)).css('color', 'red') ;
            }
        }
        catch(e)
        {}
    });
    var the_val = parseInt((count_false*100)/pvMapper.mainScoreboard.scoreLines.length);
    $('.completed_val').html(the_val);
    done_percent = " ("+ count_false.toString() + "/" + pvMapper.mainScoreboard.scoreLines.length.toString() + ") " + the_val.toString() ;

  //  p.updateProgress(the_val/100);
    pb2.updateProgress(the_val/100);
    pb2.updateText('Updating Tools');
   // p.updateText('Updating Tools');

        $('.completed_val').html(done_percent);

        if(done_percent.split(' ')[2] == '100')
        {   
            p.updateText('Done');
            pb2.updateText('Done');
           // on_all_tools_completion();
            pvMapper.allToolsLoadedEvent.fire(this);

        }

        },300);

  }

/*$(document).ready(function(){
    pvMapper.onScoreboardRefresh.addHandler(scoreboard_refresh);
pvMapper.allToolsLoadedEvent.addHandler(on_all_tools_completion);
});

*/

/*
pvMapper.siteManager.siteAdded.addHandler(function(){

    alert('site added') ;

});*/
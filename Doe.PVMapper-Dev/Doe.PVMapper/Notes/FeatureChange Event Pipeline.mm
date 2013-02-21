<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node CREATED="1347864297324" ID="ID_1259816601" MODIFIED="1361463490317" TEXT="OpenLayers.Layer.FeatureChanged Event">
<node CREATED="1347864332803" ID="ID_952834590" MODIFIED="1361221489728" POSITION="right" TEXT="SiteManager.onFeatureChangeHandler">
<node CREATED="1347864421691" ID="ID_1374160117" MODIFIED="1361220853536" STYLE="bubble" TEXT="fires: Site.SiteChange Event">
<node CREATED="1347864498267" ID="ID_241270404" MODIFIED="1361220854157" STYLE="fork" TEXT="Score.onSiteChangeHandler(event)">
<node CREATED="1347864536740" ID="ID_726848312" MODIFIED="1361220860911" STYLE="bubble" TEXT="fires: Score.siteChange Event">
<node CREATED="1347864574740" ID="ID_985978966" MODIFIED="1361463591390" STYLE="fork" TEXT="ScoreLine.onSiteChangeHandler(event)">
<node CREATED="1347864642756" ID="ID_1587416501" MODIFIED="1361220870152" STYLE="bubble" TEXT="fires: ScoreLine.siteChange Event">
<node CREATED="1347864745827" ID="ID_593170931" MODIFIED="1361220870152" STYLE="fork" TEXT="Tool.onSiteChangedHandler(event, score, site)">
<node CREATED="1347864783172" ID="ID_782323099" MODIFIED="1361220870152" STYLE="fork" TEXT="Handles the calulation of the new value for the site"/>
<node CREATED="1347864805163" ID="ID_660774975" MODIFIED="1361463542890" STYLE="fork" TEXT="Updates the Score on this ScoreLine using the parameter Score">
<node CREATED="1347865246162" ID="ID_358543384" MODIFIED="1361220870152" STYLE="fork" TEXT="Make sure the Score is updated using the Score.value(value) function so the proper events will be fired on the Score object"/>
</node>
</node>
</node>
<node CREATED="1347864965275" ID="ID_1332103851" MODIFIED="1361220860913" STYLE="fork" TEXT="sets context to the ScoreLine"/>
</node>
<node CREATED="1361463559746" ID="ID_1063793855" MODIFIED="1361463589203" TEXT="tools.onScoreChange(event, score)">
<node CREATED="1361463616899" ID="ID_1664072652" MODIFIED="1361463636503" TEXT="Update score using updateValue on score">
<node CREATED="1361463643313" ID="ID_731471116" MODIFIED="1361463661877" TEXT="Score.valueChanged fired">
<node CREATED="1361463662912" ID="ID_638085172" MODIFIED="1361463680388" TEXT="ScoreLine.changed fired">
<node CREATED="1361463681951" ID="ID_161877812" MODIFIED="1361463693652" TEXT="Scoreboard rerenders"/>
</node>
</node>
</node>
</node>
</node>
<node CREATED="1347865016003" ID="ID_1858546737" MODIFIED="1361220848412" STYLE="fork" TEXT="sets context to the Score"/>
</node>
</node>
<node CREATED="1347865062028" ID="ID_502166822" MODIFIED="1347865082764" TEXT="sets the context to the Site"/>
<node CREATED="1347865109587" ID="ID_193540923" MODIFIED="1347865128155" TEXT="creats an event object with the target set to the Site">
<node CREATED="1347865164931" ID="ID_908420945" MODIFIED="1347865182331" TEXT="Through the site object the tool can get the feature geometry and stuff"/>
</node>
</node>
</node>
</map>

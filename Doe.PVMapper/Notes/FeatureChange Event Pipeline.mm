<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node CREATED="1347864297324" ID="ID_1259816601" MODIFIED="1347864331115" TEXT="OpenLayers.Layer.FeatureChanged Event">
<node CREATED="1347864332803" ID="ID_952834590" MODIFIED="1347864457799" POSITION="right" TEXT="SiteManager.onFeatureChangeHandler">
<node CREATED="1347864421691" ID="ID_1374160117" MODIFIED="1347865191121" TEXT="fires: Site.SiteChange Event">
<node CREATED="1347864498267" ID="ID_241270404" MODIFIED="1347865055396" TEXT="Score.onSiteChangeHandler(event)">
<node CREATED="1347864536740" ID="ID_726848312" MODIFIED="1347865009692" TEXT="fires: Score.siteChange Event">
<node CREATED="1347864574740" ID="ID_985978966" MODIFIED="1347864962500" TEXT="ScoreLine.onSiteChangeHandler(event)">
<node CREATED="1347864642756" ID="ID_1587416501" MODIFIED="1347864743347" TEXT="fires: ScoreLine.siteChange Event">
<node CREATED="1347864745827" ID="ID_593170931" MODIFIED="1347864906028" TEXT="Tool.onSiteChangedHandler(event, score, site)">
<node CREATED="1347864783172" ID="ID_782323099" MODIFIED="1347864804492" TEXT="Handles the calulation of the new value for the site"/>
<node CREATED="1347864805163" ID="ID_660774975" MODIFIED="1347865236061" TEXT="Updates the Score on this ScoreLine using the parameter Score"/>
<node CREATED="1347865246162" ID="ID_358543384" MODIFIED="1347865322755" TEXT="Make sure the Score is updated using the Score.value(value) function so the proper events will be fired on the Score object"/>
</node>
</node>
<node CREATED="1347864965275" ID="ID_1332103851" MODIFIED="1347865006867" TEXT="sets context to the ScoreLine"/>
</node>
</node>
<node CREATED="1347865016003" ID="ID_1858546737" MODIFIED="1347865023915" TEXT="sets context to the Score"/>
</node>
</node>
<node CREATED="1347865062028" ID="ID_502166822" MODIFIED="1347865082764" TEXT="sets the context to the Site"/>
<node CREATED="1347865109587" ID="ID_193540923" MODIFIED="1347865128155" TEXT="creats an event object with the target set to the Site">
<node CREATED="1347865164931" ID="ID_908420945" MODIFIED="1347865182331" TEXT="Through the site object the tool can get the feature geometry and stuff"/>
</node>
</node>
</node>
</map>
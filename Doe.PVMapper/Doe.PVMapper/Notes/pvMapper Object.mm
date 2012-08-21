<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node BACKGROUND_COLOR="#ff0000" CREATED="1344972839248" ID="ID_1818206805" MODIFIED="1344984102491" TEXT="pvMapper Object">
<node COLOR="#cc6600" CREATED="1344972852747" ID="ID_1257586185" MODIFIED="1344981859499" POSITION="right" TEXT="Events">
<node CREATED="1344981861052" ID="ID_1221155162" MODIFIED="1344981864979" TEXT="onReady"/>
<node CREATED="1344973164692" ID="ID_1198242875" MODIFIED="1344983162761" TEXT="siteChanged"/>
<node CREATED="1344973182997" ID="ID_1659722593" MODIFIED="1344983168610" TEXT="siteDeleted"/>
<node CREATED="1344973190909" ID="ID_841205823" MODIFIED="1344983174083" TEXT="siteAdded"/>
<node CREATED="1344973233567" ID="ID_738499573" MODIFIED="1344983113464" TEXT="toolAdded"/>
<node CREATED="1344973238255" ID="ID_864097076" MODIFIED="1344983119704" TEXT="toolDeleted"/>
<node CREATED="1344973249631" ID="ID_570940929" MODIFIED="1344983151033" TEXT="toolDeactivate"/>
<node CREATED="1344973256632" ID="ID_815765165" MODIFIED="1344983143337" TEXT="toolActivate"/>
</node>
<node COLOR="#cc6600" CREATED="1344972861966" ID="ID_1058868502" MODIFIED="1345564926048" POSITION="right" TEXT="Variables">
<node CREATED="1344981943570" ID="ID_499460468" MODIFIED="1344983768359" TEXT="scoreboard(object)">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      The scoreboard object will listen to each tool's onPostScore event.
    </p>
    <p>
      The tool will fire the event to post a score to it's appropriate cell for the appropriate site.
    </p>
  </body>
</html></richcontent>
<icon BUILTIN="folder"/>
<node COLOR="#996600" CREATED="1344981963362" ID="ID_1673601201" MODIFIED="1344985336186" TEXT="Variables">
<node CREATED="1344985578264" ID="ID_881223134" MODIFIED="1344985795765" TEXT="scoreLines[]">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      A public array of score lines that will be maintained by the scorecard. The update function for each scoreline will be called when the scorecard needs the line information to be updated.
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node COLOR="#996600" CREATED="1344981968089" ID="ID_1450572615" MODIFIED="1344985336187" TEXT="Events">
<node CREATED="1344982144897" ID="ID_1823071918" MODIFIED="1344983804814" TEXT="scoreChanged"/>
<node CREATED="1344982149424" ID="ID_1702852897" MODIFIED="1344983789891" TEXT="scoresInvalidated"/>
<node CREATED="1344982164194" ID="ID_697087049" MODIFIED="1344982164194" TEXT=""/>
</node>
<node COLOR="#996600" CREATED="1344981970897" ID="ID_462075859" MODIFIED="1344985336186" TEXT="Methods">
<node CREATED="1344984150693" ID="ID_110634111" MODIFIED="1344986485872" TEXT="addLine">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Tools will need to call this if they want to participate in the scoreboard. The tool is resposible for attaching to the update events so they can use their custom functions to update the scores when needed. The tool will generally save the return scoreLine object as an instance variable so it can call the methods at will for the particular line it has created.
    </p>
  </body>
</html></richcontent>
<node CREATED="1344984225904" ID="ID_1545616146" MODIFIED="1344986509728" TEXT="returns: scoreLine object">
<font NAME="SansSerif" SIZE="12"/>
<node COLOR="#996600" CREATED="1344984950639" ID="ID_975108013" MODIFIED="1344985937757" TEXT="Events">
<node CREATED="1344985040721" ID="ID_441465719" MODIFIED="1344985046287" TEXT="scoreChange">
<node CREATED="1344986894752" ID="ID_182247719" MODIFIED="1344986908658" TEXT="score{}"/>
<node CREATED="1344986909485" ID="ID_233215812" MODIFIED="1344986919014" TEXT="context=scoreLine instance"/>
</node>
<node CREATED="1344985939523" ID="ID_226091840" MODIFIED="1344986786917" TEXT="requestToUpdateScore">
<node CREATED="1344986802483" ID="ID_448619795" MODIFIED="1344986811342" TEXT="featureID"/>
<node CREATED="1344986812127" ID="ID_459687321" MODIFIED="1344986859426" TEXT="context=scoreLine instance"/>
</node>
</node>
<node COLOR="#996600" CREATED="1344984960102" ID="ID_331110610" MODIFIED="1344986519883" TEXT="Methods">
<node CREATED="1344985024571" FOLDED="true" ID="ID_1335194926" MODIFIED="1344986641069" TEXT="setScore">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Updates the scores value for the feature in the scores hash
    </p>
  </body>
</html></richcontent>
<node CREATED="1344985986178" ID="ID_1809985469" MODIFIED="1344985993885" TEXT="featureID"/>
<node CREATED="1344985994806" ID="ID_665068671" MODIFIED="1344986003493" TEXT="scoreValue"/>
<node CREATED="1344986089978" ID="ID_1073697456" MODIFIED="1344986102241" TEXT="[popupMessage]"/>
</node>
<node CREATED="1344985814550" ID="ID_997825327" MODIFIED="1344985935741" TEXT="updateScores">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Called when the scores need to be updated. This will fire the requestToUpdateScores event for this scoreLine object
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1344986530027" ID="ID_198075919" MODIFIED="1344986638437" TEXT="onSiteChanged">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Gets attached to the pvMapper.site events (changed, added, deleted) so that it can properly maintain the scores hash
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node COLOR="#996600" CREATED="1344984963622" ID="ID_1355482438" MODIFIED="1344985321438" TEXT="Variables">
<node CREATED="1344984987036" ID="ID_1212790714" MODIFIED="1344984989364" TEXT="name"/>
<node CREATED="1344984990173" ID="ID_242334119" MODIFIED="1344984993601" TEXT="description"/>
<node CREATED="1344984999052" ID="ID_551042064" MODIFIED="1344986890436" TEXT="scores{}[]">
<node CREATED="1344985111573" ID="ID_1661872723" MODIFIED="1344985118052" TEXT="featureID"/>
<node CREATED="1344985119133" ID="ID_1292216793" MODIFIED="1344985121347" TEXT="score"/>
<node CREATED="1344985124270" ID="ID_881719404" MODIFIED="1344985153225" TEXT="popupMessage"/>
<node CREATED="1345564912943" ID="ID_1341608627" MODIFIED="1345564917849" TEXT="shortValue"/>
<node CREATED="1344986710483" ID="ID_949918614" MODIFIED="1344986784001" TEXT="valid">
<richcontent TYPE="NOTE"><html>
  <head>
    
  </head>
  <body>
    <p>
      used by the object to know if it should fire the requestToUpdateScore for this site. This allows the tool to update all scores at once if it chooses to.
    </p>
  </body>
</html></richcontent>
</node>
</node>
</node>
</node>
<node CREATED="1344984251729" ID="ID_757952179" MODIFIED="1344984300792" TEXT="Name"/>
<node CREATED="1344984275601" ID="ID_213506659" MODIFIED="1344984294690" TEXT="Description"/>
</node>
</node>
</node>
<node CREATED="1345564932153" ID="ID_1033273676" MODIFIED="1345564934928" TEXT="map"/>
<node CREATED="1345564935768" ID="ID_806447424" MODIFIED="1345564938778" TEXT="toolbar"/>
<node CREATED="1345564939583" ID="ID_353006408" MODIFIED="1345564946399" TEXT="extensions[]"/>
<node CREATED="1345564947174" ID="ID_1117577264" MODIFIED="1345564956762" TEXT="toolBox[]"/>
<node CREATED="1345564965911" ID="ID_1366168342" MODIFIED="1345564970313" TEXT="selectedSite"/>
<node CREATED="1345564971030" ID="ID_759937197" MODIFIED="1345564973694" TEXT="sites[]"/>
<node CREATED="1345564976510" ID="ID_1454696929" MODIFIED="1345564987799" TEXT="sitelayer"/>
</node>
<node COLOR="#cc6600" CREATED="1344972868759" ID="ID_261169770" MODIFIED="1344973080099" POSITION="right" TEXT="Methods">
<node CREATED="1344973377317" ID="ID_1297104472" MODIFIED="1344973381274" TEXT="getTools"/>
<node CREATED="1344973382069" ID="ID_1653291962" MODIFIED="1344973388883" TEXT="registerTool"/>
<node CREATED="1344973467345" ID="ID_1880363233" MODIFIED="1344973477271" TEXT="deleteTool"/>
<node CREATED="1344973389765" ID="ID_894880673" MODIFIED="1344973394259" TEXT="registerIntent"/>
<node CREATED="1344973400437" ID="ID_1183174938" MODIFIED="1344986996950" TEXT="runIntent (intentName, parameters{}) returns object"/>
<node CREATED="1344973409310" ID="ID_1405794280" MODIFIED="1344973435215" TEXT="getSites"/>
<node CREATED="1344973435879" ID="ID_1579389192" MODIFIED="1344973438341" TEXT="getSite"/>
<node CREATED="1344973439175" ID="ID_119005820" MODIFIED="1344973451205" TEXT="updateSite"/>
<node CREATED="1344973451927" ID="ID_234448122" MODIFIED="1344973455854" TEXT="insertSite"/>
<node CREATED="1344973457241" ID="ID_955335171" MODIFIED="1344973461780" TEXT="deleteSite"/>
<node CREATED="1344973585270" ID="ID_1259541418" MODIFIED="1344973592563" TEXT="registerLayer"/>
<node CREATED="1344973593798" ID="ID_842685238" MODIFIED="1344973642293" TEXT="invalidateScores"/>
<node CREATED="1344973610215" ID="ID_1549232140" MODIFIED="1344973610215" TEXT=""/>
</node>
<node BACKGROUND_COLOR="#cccccc" COLOR="#996600" CREATED="1344972881047" ID="ID_1424229122" MODIFIED="1344973365482" POSITION="right" TEXT="Private Variables"/>
<node BACKGROUND_COLOR="#cccccc" COLOR="#996600" CREATED="1344972886944" ID="ID_1908725067" MODIFIED="1344973098192" POSITION="right" TEXT="Private Methods"/>
</node>
</map>

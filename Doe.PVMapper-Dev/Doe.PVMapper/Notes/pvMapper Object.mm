<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node BACKGROUND_COLOR="#ff0000" CREATED="1344972839248" ID="ID_1818206805" MODIFIED="1345667108298" TEXT="pvMapper Object">
<node COLOR="#cc6600" CREATED="1344972852747" FOLDED="true" ID="ID_1257586185" MODIFIED="1347861572925" POSITION="right" TEXT="Events">
<node CREATED="1344981861052" ID="ID_1221155162" MODIFIED="1344981864979" TEXT="onReady">
<node CREATED="1345665461799" ID="ID_308405492" MODIFIED="1345665489707" TEXT="Fired when the pvMapper object has been loaded and the DOM is ready"/>
</node>
<node CREATED="1344973164692" ID="ID_1198242875" MODIFIED="1345665519776" TEXT="siteChanged (site)">
<node CREATED="1345665491681" ID="ID_1847797879" MODIFIED="1345665691197" TEXT="Fired after attributes of a site have changed. ex. name, polygon, description, colors..."/>
</node>
<node CREATED="1344973182997" ID="ID_1659722593" MODIFIED="1347466238811" TEXT="siteDeleted(site)">
<node CREATED="1345665625113" ID="ID_510557739" MODIFIED="1345665644684" TEXT="Fired after a site is removed from the database"/>
</node>
<node CREATED="1344973190909" ID="ID_841205823" MODIFIED="1345666228247" TEXT="siteAdded(site)">
<node CREATED="1345665696955" ID="ID_1496146442" MODIFIED="1345665730145" TEXT="Fired after a site has been added to the site layer by the user"/>
</node>
<node CREATED="1344973233567" ID="ID_738499573" MODIFIED="1345666590927" TEXT="moduleAdded(moduleName)">
<node CREATED="1345665733822" ID="ID_1014817169" MODIFIED="1345665960927" TEXT="Fired after a tool is loaded from the database and made available to the system"/>
</node>
<node CREATED="1345665780349" ID="ID_506750397" MODIFIED="1345665844478" TEXT="moduleActivate">
<node CREATED="1345665798585" ID="ID_1941733653" MODIFIED="1345665955596" TEXT="Fired whenr a module has been activated by the user or by the system on load up"/>
</node>
<node CREATED="1344973238255" ID="ID_864097076" MODIFIED="1345665849710" TEXT="moduleDeleted">
<node CREATED="1345665893353" ID="ID_431994772" MODIFIED="1345665936892" TEXT="Fired after a tool has been deleted from the database"/>
</node>
<node CREATED="1344973249631" ID="ID_570940929" MODIFIED="1345666035471" TEXT="moduleDeactivate">
<node CREATED="1345665908851" ID="ID_170689882" MODIFIED="1345665931937" TEXT="Fired after the user deactivates a tool"/>
</node>
<node CREATED="1345665443071" ID="ID_1030672330" MODIFIED="1345665454905" TEXT="siteSelect">
<node CREATED="1345666000681" ID="ID_593769783" MODIFIED="1345666032526" TEXT="Fired on when a site is selected by the user. The selectedSite has already been set"/>
</node>
</node>
<node COLOR="#996600" CREATED="1344972861966" ID="ID_1058868502" MODIFIED="1345666816985" POSITION="right" TEXT="Variables">
<node BACKGROUND_COLOR="#cccccc" COLOR="#cc6600" CREATED="1344981943570" ID="ID_499460468" MODIFIED="1345666840380" STYLE="bubble" TEXT="scoreboard(object)">
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
<icon BUILTIN="bookmark"/>
<node COLOR="#996600" CREATED="1344981963362" ID="ID_1673601201" MODIFIED="1344985336186" TEXT="Variables">
<node CREATED="1344985578264" ID="ID_881223134" LINK="#ID_1545616146" MODIFIED="1346166256925" TEXT="scoreLines[]">
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
</node>
<node COLOR="#996600" CREATED="1344981970897" ID="ID_462075859" MODIFIED="1345969204223" TEXT="Methods">
<node CREATED="1344984150693" ID="ID_110634111" MODIFIED="1346090209865" TEXT="addLine">
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
<node COLOR="#996600" CREATED="1344984950639" ID="ID_975108013" MODIFIED="1347862168389" TEXT="Events">
<node CREATED="1344985040721" ID="ID_441465719" MODIFIED="1345967672330" TEXT="scoreChange">
<node CREATED="1344986894752" ID="ID_182247719" LINK="#ID_551042064" MODIFIED="1346166652533" TEXT="score{}"/>
<node CREATED="1344986909485" ID="ID_233215812" MODIFIED="1344986919014" TEXT="context=scoreLine instance"/>
</node>
<node CREATED="1345969120995" ID="ID_1183583035" MODIFIED="1345969173291" TEXT="updatingScores"/>
<node CREATED="1347862170959" ID="ID_709521165" MODIFIED="1347862178964" TEXT="siteChanged">
<node CREATED="1347862186267" ID="ID_1267640651" MODIFIED="1347862198476" TEXT="context = scoreLine"/>
<node CREATED="1347862199372" ID="ID_1024588973" MODIFIED="1347862210674" TEXT="event">
<node CREATED="1347862220435" ID="ID_159855923" MODIFIED="1347862228971" TEXT="target=site"/>
</node>
<node CREATED="1347862245331" ID="ID_202392038" MODIFIED="1347862252075" TEXT="score">
<node CREATED="1347862253243" ID="ID_728835339" MODIFIED="1347862260250" TEXT="The score that takes care of this site"/>
</node>
</node>
</node>
<node COLOR="#996600" CREATED="1344984960102" HGAP="31" ID="ID_331110610" MODIFIED="1347953200068" TEXT="Methods" VSHIFT="9">
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
<node CREATED="1347953202180" ID="ID_1506628523" MODIFIED="1347953208344" TEXT="addScore()"/>
</node>
<node COLOR="#996600" CREATED="1344984963622" ID="ID_1355482438" MODIFIED="1344985321438" TEXT="Variables">
<node CREATED="1344984987036" ID="ID_1212790714" MODIFIED="1344984989364" TEXT="name"/>
<node CREATED="1344984990173" ID="ID_242334119" MODIFIED="1344984993601" TEXT="description"/>
<node CREATED="1344984999052" ID="ID_551042064" MODIFIED="1347862734544" TEXT="scores{}[]">
<node CREATED="1347862735740" ID="ID_1066865207" MODIFIED="1347862739850" TEXT="Events">
<node CREATED="1347862765835" ID="ID_1478681840" MODIFIED="1347862928913" TEXT="valueChanged"/>
<node CREATED="1347862777123" ID="ID_464572153" MODIFIED="1347862784971" TEXT="siteChanged"/>
<node CREATED="1347862785747" ID="ID_348949471" MODIFIED="1347863072514" TEXT="invalidated"/>
<node CREATED="1347863073779" ID="ID_262565964" MODIFIED="1347863082020" TEXT="popupChanged"/>
</node>
<node CREATED="1347862741123" ID="ID_729214158" MODIFIED="1347862747409" TEXT="Methods">
<node CREATED="1347862945379" ID="ID_1882670932" MODIFIED="1347863335865" TEXT="calculateUtility([value])">
<node CREATED="1347863274066" ID="ID_1466281310" MODIFIED="1347863321661" TEXT="Calculates the utility score for the value passed in or if no value is passed in it uses the current value property"/>
</node>
<node CREATED="1347862952675" ID="ID_1451661531" MODIFIED="1347863341839" TEXT="value([value])">
<node CREATED="1347863093146" ID="ID_1875899632" MODIFIED="1347863551244" TEXT="Gets or sets the value. If the value is diferent, recalculates the utility and fires the valueChanged event. Sets the score to being valid (not dirty)"/>
</node>
<node CREATED="1347862990667" ID="ID_779529659" MODIFIED="1347863348497" TEXT="popupMessage([message])"/>
<node CREATED="1347863019556" ID="ID_887019135" MODIFIED="1347863626920" TEXT="invalidate(boolean [fireEvent])">
<node CREATED="1347863173628" ID="ID_875361678" MODIFIED="1347863645851" TEXT="Causes the isValid to return false. Fires the invalidated event unless fireEvent param is false"/>
</node>
<node CREATED="1347863023979" ID="ID_743860000" MODIFIED="1347863027957" TEXT="isValid()">
<node CREATED="1347863370171" ID="ID_1179674910" MODIFIED="1347863460893" TEXT="Returns true if a property change has happened but the value hasn&apos;t been recalculated. This can happen if the site changes and the score is not updated"/>
</node>
</node>
<node CREATED="1347862748331" ID="ID_1557755018" MODIFIED="1347862751874" TEXT="Variables">
<node CREATED="1344985111573" ID="ID_1661872723" MODIFIED="1347861615242" TEXT="site">
<node CREATED="1345967696252" ID="ID_1752711511" MODIFIED="1345967701798" TEXT="Object">
<node COLOR="#996600" CREATED="1345967704348" ID="ID_1037375098" MODIFIED="1345968083966" TEXT="Variables">
<node CREATED="1345967733594" ID="ID_1502873873" MODIFIED="1345967738456" TEXT="id"/>
<node CREATED="1345967739299" ID="ID_169977848" MODIFIED="1345967743877" TEXT="feature"/>
<node CREATED="1345967747818" ID="ID_1381402041" MODIFIED="1345967756750" TEXT="geometry"/>
<node CREATED="1345967758378" ID="ID_1023399239" MODIFIED="1345967763702" TEXT="name"/>
<node CREATED="1345967764331" ID="ID_1009190036" MODIFIED="1345967768843" TEXT="description"/>
<node CREATED="1345967769410" ID="ID_1382269236" MODIFIED="1345967777981" TEXT="popupHTML"/>
</node>
<node COLOR="#996600" CREATED="1345967720292" ID="ID_207087562" MODIFIED="1345968391414" TEXT="Methods">
<node CREATED="1345967972163" ID="ID_930124062" MODIFIED="1345967987234" TEXT="onFeatureSelected">
<node CREATED="1345968334914" ID="ID_1942754203" MODIFIED="1345968365807" TEXT="catches the Openlayers feature&apos;s event and passes them on to this site&apos;s events"/>
</node>
<node CREATED="1345967989179" ID="ID_1515215930" MODIFIED="1345968394542" TEXT="onFeatureChanged">
<node CREATED="1345968376803" ID="ID_1126902656" MODIFIED="1345968378846" TEXT="catches the Openlayers feature&apos;s event and passes them on to this site&apos;s events"/>
</node>
<node CREATED="1345968395387" ID="ID_1427897771" MODIFIED="1345968596366" TEXT="setSelected">
<node CREATED="1345968605259" ID="ID_328205320" MODIFIED="1345968683620" TEXT="Selects the feature and fires the select event. "/>
</node>
</node>
<node COLOR="#996600" CREATED="1345967725556" ID="ID_165524679" MODIFIED="1345968083964" TEXT="Events">
<node CREATED="1345967789163" ID="ID_803060604" MODIFIED="1345967797182" TEXT="change"/>
<node CREATED="1345967800235" ID="ID_1003216736" MODIFIED="1345967811835" TEXT="create"/>
<node CREATED="1345967812418" ID="ID_1900187817" MODIFIED="1345967838653" TEXT="destroy"/>
<node CREATED="1345967849555" ID="ID_1580574611" MODIFIED="1345967885158" TEXT="labelChange"/>
<node CREATED="1345967955323" ID="ID_457767980" MODIFIED="1346170816038" TEXT="select"/>
<node CREATED="1345968717587" ID="ID_450454474" MODIFIED="1345968722005" TEXT="unselected"/>
</node>
</node>
</node>
<node CREATED="1344985119133" ID="ID_1292216793" MODIFIED="1347863888370" TEXT="utilityValue">
<node CREATED="1347863689435" ID="ID_1614384778" MODIFIED="1347863739992" TEXT="Reference to a Utility object">
<font BOLD="true" NAME="SansSerif" SIZE="12"/>
</node>
<node CREATED="1347863762979" ID="ID_529069689" MODIFIED="1347863766957" TEXT="Steps">
<node CREATED="1346105169486" ID="ID_1149663157" MODIFIED="1346105275478" TEXT="summary statistic from site (value)"/>
<node CREATED="1346105275774" ID="ID_143842274" MODIFIED="1346105329352" TEXT="defined utility curve function">
<node CREATED="1346105289678" ID="ID_635388097" MODIFIED="1346105294366" TEXT="x=value"/>
<node CREATED="1346105295006" ID="ID_311223704" MODIFIED="1346105319944" TEXT="y=output :utility"/>
</node>
<node CREATED="1346105332000" ID="ID_289808519" MODIFIED="1346105353545" TEXT="weight then applied"/>
</node>
</node>
</node>
</node>
</node>
</node>
<node CREATED="1344984251729" ID="ID_757952179" MODIFIED="1344984300792" TEXT="Name"/>
<node CREATED="1344984275601" ID="ID_213506659" MODIFIED="1344984294690" TEXT="Description"/>
</node>
<node CREATED="1345969206898" ID="ID_1251656265" MODIFIED="1345969225952" TEXT="onScoreLineChanging"/>
</node>
</node>
<node CREATED="1345660985016" ID="ID_894777611" MODIFIED="1345665243664" TEXT="toolbar">
<node CREATED="1345660995532" FOLDED="true" ID="ID_1673338773" MODIFIED="1345665243147" TEXT="addButton(name, group, class, iconUrl, onclick, toggle, ontoggle)">
<node BACKGROUND_COLOR="#cccccc" COLOR="#cc6600" CREATED="1345661235463" FOLDED="true" HGAP="16" ID="ID_945145451" MODIFIED="1345665242405" STYLE="bubble" TEXT="button" VSHIFT="4">
<icon BUILTIN="bookmark"/>
<node CREATED="1345661132955" ID="ID_713984003" MODIFIED="1345661710854" STYLE="fork" TEXT="name"/>
<node CREATED="1345661138163" ID="ID_179335257" MODIFIED="1345661710856" STYLE="fork" TEXT="group"/>
<node CREATED="1345661140003" ID="ID_1347312281" MODIFIED="1345661710855" STYLE="fork" TEXT="class"/>
<node CREATED="1345661142395" ID="ID_377087203" MODIFIED="1345661710855" STYLE="fork" TEXT="iconUrl"/>
<node CREATED="1345661147692" ID="ID_38793389" MODIFIED="1345661710854" STYLE="fork" TEXT="toggle"/>
<node COLOR="#996600" CREATED="1345661178165" ID="ID_586549306" MODIFIED="1345661653856" TEXT="Events">
<node CREATED="1345661197422" ID="ID_1601583157" MODIFIED="1345661710853" STYLE="fork" TEXT="click"/>
<node CREATED="1345661201134" ID="ID_1341094160" MODIFIED="1345661710852" STYLE="fork" TEXT="toggle"/>
</node>
</node>
</node>
</node>
<node CREATED="1345665325265" ID="ID_1612271098" MODIFIED="1345665331795" TEXT="map"/>
<node CREATED="1345665337986" ID="ID_1936826644" MODIFIED="1345666120834" TEXT="selectedSite">
<node CREATED="1345666122443" ID="ID_621729412" MODIFIED="1345666143636" TEXT="Contains the currently highlighted site or null"/>
<node CREATED="1345665391484" ID="ID_27395218" MODIFIED="1345666110274" TEXT="Set by the select a site tool or any other tool that needs it."/>
<node CREATED="1345666061593" ID="ID_720340104" MODIFIED="1345666097573" TEXT="this could be null">
<font BOLD="true" ITALIC="true" NAME="SansSerif" SIZE="12"/>
</node>
</node>
<node CREATED="1345665349291" ID="ID_659507851" MODIFIED="1345666597211" TEXT="sites[]">
<node BACKGROUND_COLOR="#cccccc" COLOR="#cc6600" CREATED="1345666238785" ID="ID_1454539025" MODIFIED="1345666851705" STYLE="bubble" TEXT="site">
<icon BUILTIN="bookmark"/>
<node CREATED="1345666258849" ID="ID_1262872895" MODIFIED="1345666685986" STYLE="fork" TEXT="NOT an extension of feature">
<font BOLD="true" ITALIC="true" NAME="SansSerif" SIZE="12"/>
</node>
<node CREATED="1345666298939" ID="ID_595919341" MODIFIED="1345666894115" STYLE="fork" TEXT="feature">
<font NAME="SansSerif" SIZE="12"/>
</node>
<node CREATED="1345666329501" ID="ID_1185212355" MODIFIED="1345666894115" STYLE="fork" TEXT="polygon"/>
<node CREATED="1345666349509" ID="ID_1107463469" MODIFIED="1345666894114" STYLE="fork" TEXT="name"/>
<node CREATED="1345666352237" ID="ID_1170199514" MODIFIED="1345666894113" STYLE="fork" TEXT="id"/>
<node COLOR="#999900" CREATED="1345666353821" ID="ID_916152177" MODIFIED="1345666772414" TEXT="Events">
<node CREATED="1345666418456" ID="ID_1876753255" MODIFIED="1345666794204" STYLE="fork" TEXT="??"/>
</node>
<node COLOR="#999900" CREATED="1345666426080" ID="ID_1838031005" MODIFIED="1345666763991" TEXT="Methods">
<node CREATED="1345666433212" ID="ID_285953415" MODIFIED="1345666794200" STYLE="fork" TEXT="??"/>
</node>
</node>
<node CREATED="1345666705308" ID="ID_550837328" MODIFIED="1345666743060" TEXT="Indexed by id"/>
</node>
</node>
<node COLOR="#cc6600" CREATED="1344972868759" ID="ID_261169770" MODIFIED="1346104758908" POSITION="right" TEXT="Methods">
<node CREATED="1344973377317" ID="ID_1297104472" MODIFIED="1345651181163" TEXT="getTools() returns [tools]"/>
<node CREATED="1344973382069" ID="ID_1653291962" MODIFIED="1345651164560" TEXT="registerTool (toolObject) returns null"/>
<node CREATED="1344973467345" ID="ID_1880363233" MODIFIED="1345651137903" TEXT="deleteTool (toolObject) returns null"/>
<node CREATED="1344973389765" ID="ID_894880673" MODIFIED="1345651087163" TEXT="registerIntent (intentName, intentCallback) returns null"/>
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

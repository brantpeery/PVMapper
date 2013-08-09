/**
 * Class: OpenLayers.Format.WMSCustom
 * Custom Class to read GetFeatureInfo responses from Web Mapping Services
 *
 * Inherits from:
 *  - <OpenLayers.Format.WMSGetFeatureInfo>
 */
 
OpenLayers.Format.WMSCustom = OpenLayers.Class(OpenLayers.Format.WMSGetFeatureInfo, {
     /**
     * APIProperty: layerIdentifier
     * {String} All xml nodes containing this search criteria will populate an
     *     internal array of layer nodes.
     */
     layerIdentifier: '_layer',

     /**
      * APIProperty: featureIdentifier
      * {String} All xml nodes containing this search criteria will populate an 
      *     internal array of feature nodes for each layer node found.
      */
     featureIdentifier: '_feature',

     /**
      * Property: regExes
      * Compiled regular expressions for manipulating strings.
      */
     regExes: {
         trimSpace: (/^\s*|\s*$/g),
         removeSpace: (/\s*/g),
         splitSpace: (/\s+/),
         trimComma: (/\s*,\s*/g)
     },

     /**
      * Property: gmlFormat
      * {<OpenLayers.Format.GML>} internal GML format for parsing geometries
      *     in msGMLOutput
      */
     gmlFormat: null,

     /**
      * Constructor: OpenLayers.Format.WMSGetFeatureInfo
      * Create a new parser for WMS GetFeatureInfo responses
      *
      * Parameters:
      * options - {Object} An optional object whose properties will be set on
      *     this instance.
      */


     read: function(data) {
         
     },

     read_msGMLOutput: function (data) {

     },

     read_FeatureInfoResponse: function (data) {

     },

     getSiblingNodesByTagCriteria: function (node, criteria) {

     },

     parseAttributes: function (node) {

     },

     parseGeometry: function(node) {

     },

     CLASS_NAME: "OpenLayers.Format.WMSCustom"
 });

//References:
/* https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Format/WMSGetFeatureInfo.js#L85
http://dev.openlayers.org/docs/files/OpenLayers/Format/WMSGetFeatureInfo-js.html#OpenLayers.Format.WMSGetFeatureInfo.read_msGMLOutput
http://dev.openlayers.org/docs/files/OpenLayers/Control/WMSGetFeatureInfo-js.html#OpenLayers.Control.WMSGetFeatureInfo.format
http://docs.openlayers.org/library/formats.html
*/
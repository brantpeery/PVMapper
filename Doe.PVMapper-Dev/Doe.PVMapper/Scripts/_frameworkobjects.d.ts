//Creates the variable references for the frameworks that we are using. This should 
//allow the use of the frameworks in the .ts files without the compiler complaining.

//Use an include to include this file in your .ts files

declare var OpenLayers;
declare var GeoExt;
declare var Ext;

module pvMapper {
  export class Site {
    constructor (site: any);
  };
  export class siteOptions { };
}
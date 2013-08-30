

class DataRecord { 
  public functionName: string;
  public minValue: number; 
  public maxValue: number; 
  public increment: number; 
  public target: number; 
  public slope: number; 
  public mode: string; 
  public weight: number; 
  public UserId: string;  
}

  class UtilConfig {  data : DataRecord;
    constructor () {
      this.data = new DataRecord();
    } }

//var currentConfig = null;

class UtilityFunctions {
    
  public static currentConfig: UtilConfig = null;
  public static setConfig (obj : UtilConfig ) {
    this.currentConfig = obj;
  }

  public static MoreIsBetter ( x: number ) : number {
    return 1 - this.LessIsBetter( x );
  }

  public static LessIsBetter ( x: number ): number {
    if (!this.currentConfig) {
      if (console) console.log('No configuration setup.');
      return 0;
    }

    var l = this.currentConfig.data.minValue;
    var b = this.currentConfig.data.target; 
    var h = this.currentConfig.data.maxValue;
    var sRatio = this.currentConfig.data.slope / 5  + .3;
    var y = 0;

    var s = Math.min( -2 / ( b - l ), -2 / ( h - b ) );
    s = s * ( sRatio );

    if ( x >= h ) y = 0;
    else if ( x <= l ) y = 1;
    else y = ( x < b ) ? 1 / ( 1 + Math.pow(( b - l ) / ( x - l ), ( 2 * s * ( b + x - 2 * l ) ) ) ) :
        1 - ( 1 / ( 1 + Math.pow(( b - ( 2 * b - h ) ) / ( ( 2 * b - x ) - ( 2 * b - h ) ), ( 2 * s * ( b + ( 2 * b - x ) - 2 * ( 2 * b - h ) ) ) ) ) );
    if ( y >= 1 ) y = 1;
    if ( y <= 0 ) y = 0;
    return y;
  }

  public static NDBalance ( x:number, r: number ):number {
    if (!this.currentConfig) {
      if (console) console.log('No configuration setup.');
      return 0;
    }

    var u = this.currentConfig.data.target; 
    var r = this.currentConfig.data.slope / 5  + .3;
    var y = 1 / ( r * Math.sqrt( 2 * Math.PI ) ) * Math.exp( -0.5 * Math.pow(( x - u ) / r, 2 ) );
    return y;
  }

  public NDLeft(x:number):number {
    var y = 0;

    return y;
  }

  public NDRight( x: number ):number {
    var y = 0;

    return y;
  }

  public LinearUp( x: number ): number {
    var y = 0;


    return y;
  }

  public LinearDown( x: number ): number {
    var y = 0;

    return y;
  }

  
}

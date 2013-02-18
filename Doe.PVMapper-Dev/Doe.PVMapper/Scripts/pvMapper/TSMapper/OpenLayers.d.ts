// Module
module OpenLayers {
    interface ICallback extends Function{

    }

  export class Attributes {
    name: string;
    description: string;
  }

  export class SiteFeature {
    fid: number;
    geometry: Polygon;
    attributes: Attributes;
    name: string;
    description: string;
  }

  interface Collection extends Geometry {
    components: Geometry[];
    componentTypes: string[];
    destroy();
    clone(): Collection;
    getComponentsString(): string;
    calculateBounds();
    addComponents(components: Geometry[]);
    addComponent(component: Geometry, index: number): Boolean;
    removeComponents(components: Geometry[]): Boolean;
    removeComponent(component: Geometry): Boolean;
    getLength(): number;
    getArea(): number;
    getGeodesicArea(projection: Projection): number;
    getCentroid(weighted: Boolean): Point;
    getGeodesicLength(projection: Projection): number;
    move(x: number, y: number);
    rotate(angle: number, origin: Point);
    resize(scale: number, origin: Point, ratio: number): Geometry;
    distanceTo(geometry: Geometry, options?: Boolean): number;
    distanceTo(geometry: Geometry, options?: Boolean): Distance;
    equals(geometry: Geometry): Boolean;
    transform(source: Projection, dest: Projection): Geometry;
    intersects(geometry: Geometry): Boolean;
    getVertices(nodes: Boolean): Geometry[];
  }

  interface Polygon extends Geometry, Collection {
    compontTypes: string[];
    getArea(): number;
    getGeodesicArea(projection: Projection): number;
    containsPoint(point: Point): Boolean;
    containsPoint(point: Point): number;
    intersects(geometry: Geometry): Boolean;
    distanceTo(geometry: Geometry, options?: Boolean): number;
    distanceTo(geometry: Geometry, options?: Boolean): Distance;
    createRegularPolygon(origin: Point, radius: number, sides: number, rotation: number);
  }

  interface MultiPoint extends Collection, Geometry {
    componentTypes: string[];
    addPoint(point: Point, index: number);
    removePoint(point: Point);
  }

  interface MultiPolygon extends Collection {
    componentTypes: string[];
  }

  interface Curve extends MultiPoint {
    componentTypes: string[];
    getLength(): number;
    getGeodesicLength(projection: Projection): number;
  }

  interface LineString extends Curve {
    removeComponent(point: Point): Boolean;
    intersects(geometry: Geometry): Boolean;
    getSortedSegments(): Segment[];
    splitWithSegment(seg: Segment, edge: Boolean): any;
    splitWithSegment(seg: Segment, tolerance: number): any;
    split(target: Geometry, edge: Boolean): Geometry[];
    split(target: Geometry, tolerance: number): Geometry[];
    splitWidth(geometry: Geometry, edge: Boolean): Geometry[];
    splitWidth(geometry: Geometry, tolerance: number): Geometry[];
    getVertices(nodes: Boolean): Geometry[];
    distanceTo(geometry: Geometry, options?: Boolean): number;
    distanceTo(geometry: Geometry, options?: Boolean): Distance;
    simplify(tolerance: number): LineString;
  }

  interface MultiLineString extends Collection, Geometry {
    componentTypes: string[];
    split(geometry: Geometry, edge: Boolean): Geometry[];
    split(geometry: Geometry, tolerance: number): Geometry[];
    splitWidth(geometry: Geometry, edge: Boolean): Geometry[];
    splitWidth(geometry: Geometry, tolerance: number): Geometry[];
  }

  interface LinearRing extends LineString {
    componentTypes: string[];
    addComponent(point: Point, index: number): Boolean;
    removeComponent(point: Point): Boolean;
    move(x: number, y: number);
    rotate(angle: number, origin: Point);
    resize(scale: number, origin: Point, ration: number): Geometry;
    transform(source: Projection, dest: Projection): Geometry;
    getCentroid(): Point;
    getArea(): number;
    getGeodesicArea(projection: Projection): number;
    containsPoint(point: Point): Boolean;
    containsPoint(point: Point): number;
    intersects(geometry: Geometry): Boolean;
    getVertices(nodes: Boolean): Geometry[];
  }



  interface Size {
    w: number;
    h: number;
    toString(): string;
    clone(): Size;
    equals(sz: Size): Boolean;
  }

  interface Pixel {
    x: number; y: number;
    toString(): string;
    clone(): Pixel;
    equals(px: Pixel): Boolean;
    distanceTo(px: Pixel): number;
    add(x: number, y: number): Pixel;
    offset(px: Pixel): Pixel;
  }

  interface Bounds {
    left: number;
    bottom: number;
    right: number;
    top: number;
    centerLonLat: LonLat;

    clone(): Bounds;
    equals(bounds: Bounds): Boolean;
    toString(): string;
    toArray(reverseAxisOrder: Boolean): number[];
    toBBOX(decimal: number, reverseAxisOrder: Boolean): string;
    toGeometry(): Polygon;
    getWidth(): number;
    getHeight(): number;
    getSize(): Size;
    getCenterPixel(): Pixel;
    getCenterLonLat(): LonLat;
    scale(ratio: number, origin: Pixel): Bounds;
    scale(ratio: number, origin: LonLat): Bounds;
    add(x: number, y: number): Bounds;
    extend(object: LonLat);
    extend(object: Point);
    extend(object: Bounds);
    containsLonLat(ll: LonLat, inclusive?: Boolean): Boolean;
    containsLonLat(ll: LonLat, worldBounds?: Bounds): Boolean;
    containsPixel(px: Pixel, inclusive: Boolean): Boolean;
    contains(x: number, y: number, inclusive: Boolean): Boolean;
    intersectsBounds(bounds: Bounds, inclusive?: Boolean): Boolean;
    intersectsBounds(bounds: Bounds, worldBounds?: Bounds): Boolean;
    containsBounds(bounds: Bounds, partial: Boolean, inclusive: Boolean): Boolean;
    determineQuadrant(lonlat: LonLat): string;
    transform(source: Projection, dest: Projection): Bounds;
    fromString(str: string, reverseAxisOrder: Boolean): Bounds;
    fromArray(bbox: number[], reverseAxisOrder: Boolean): Bounds;
    fromSize(size: Size): Bounds;
    oppositeQuadrant(quadrant: string): string;
  }

  interface LonLat {
    lon: number;
    lat: number;
    toString(): string;
    toShortString(): string;
    clone(): LonLat;
    add(lon: number, lat: number): LonLat;
    equals(ll: LonLat): Boolean;
    transform(source: Projection, dest: Projection): LonLat;
    wrapDateLine(maxExtend: Bounds): LonLat;
    fromString(str: string): LonLat;
    fromArray(arr: number[]): LonLat;
  }

  interface Segment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  interface Distance {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }

  interface Geometry {
    id: string;
    parent: Geometry;
    bounds: Bounds;
    destroy();
    clone(): Geometry;
    setBounds(bounds: Bounds);
    clearBounds();
    extendBounds(newBounds: Bounds);
    getBounds(): Bounds;
    calculateBounds();
    distanceTo(geometry: Geometry, options?: any): number;
    distanceTo(geometry: Geometry, options?: any): Distance;
    getVertices(nodes: Boolean): Geometry[];
    atPoint(lonlat: LonLat, toleranceLon: number, toleranceLat: number): Boolean;
    getLength(): number;
    getArea(): number;
    getCentroid(): Point;
    toString(): string;

    fromWKT(wkt: string): Geometry;
    segmentsIntersect(seg1: Segment, seg2: Segment, point: Boolean): Boolean;
    segmentsIntersect(seg1: Segment, seg2: Segment, tolerance: number): Point;
    distanceToSegment(point: Point, segment: Segment): Point;
  }

  interface Projection {
    proj: any;
    projCode: string;
    titleRegEx: RegExp;
    getCode(): string;
    getUnits(): string;
    toString(): string;
    equals(projection: Projection): Boolean;
    destroy();
    transforms: any;
    defaults: any;
    addTransform(from: string, to: string, method: ICallback);
    transorm(point: Point, source: Projection, dest: Projection): Point;
    nullTransform(point: Point);
  }

  declare var Projection: {
    new (value?: any): Projection;
    (value?: any): Projection;
    prototype: Projection;
  }

  interface Point extends Geometry {
    x: number;
    y: number;
    clone(obj: any): Point;
    distanceTo(geometry: Geometry, details: Boolean): number;
    distanceTo(geometry: Geometry, edge: Boolean): Distance;
    equals(geometry: Point): Boolean;
    toShortString(): string;
    move(x: number, y: number);
    rotate(angle: number, origin: Point);
    resize(scale: number, origin: Point, ratio: number): Geometry;
    intersects(geometry: Geometry): Boolean;
    transform(source: Projection, dest: Projection): Geometry;
  }

  interface String {
    startsWidth(str: string, sub: string): Boolean;
    contains(str: string, sub: string): Boolean;
    trim(str: string): string;
    camelize(str: string): string;
    format(template: string, context: any, args?: any[]): string;
    tokenRegEx: string;
    numberRegEx: string;
    isNumeric(value: number): Boolean;
    numericIf(value: number, trimWhitespace: Boolean): number;
    numericIf(value: number, trimWhitespace: Boolean): string;
  }

  interface Number {
    decimalSeparator: string;
    thousandsSeparator: string;
    limitSigDigs(num: number, sig: number): number;
    zeroPad(num: number, len: number, radix: number): string;
    format(num: number, dec: number, tsep: string, dsep: string): string;
  }

  interface Function {
    bind(func: ICallback, object: Object): ICallback;
    bindAsEventListener(func: ICallback, object: Object): ICallback;
    False(): Boolean;
    True(): Boolean;
    Void(): void;
  }

  interface Array {
    filter(array: any[], callback: ICallback, caller: Object): any[];
  }

  interface Date{
    dateRegEx: RegExp;
    toISOString(): string;
    parse(str: string);
  }

  interface Element extends String {

    visible(element: DOMElement): Boolean;
    toggle(element: DOMElement[]);
    remove(element: DOMElement);
    getHeight(element: DOMElement): number;
    hasClass(element: DOMElement, name: string): Boolean;
    addClass(element: DOMElement, name: string): DOMElement;
    removeClass(element: DOMElement, name: string): DOMElement;
    toggleClass(element: DOMElement, name: string): DOMElement;
    getStyle(element: DOMElement, style: any): any;



  }

  interface DOMElement extends Element {
    //+++++++++++++++++++++++++++++++++++TBD+++++++++++++++++++++++++++++++++++
    //No documentation about this class in the OpenLayers library.

  }

  interface HTMLDOMElement extends String {
    //+++++++++++++++++++++++++++++++++++TBD+++++++++++++++++++++++++++++++++++

  }

  interface Event {
    observers: any;
    KEY_SPACE: number;
    KEY_BACKSPACE: number;
    KEY_TAB: number;
    KEY_RETURN: number;
    KEY_ESC: number;
    KEY_LEFT: number;
    KEY_UP: number;
    KEY_RIGHT: number;
    KEY_DOWN: number;
    KEY_DELETE: number;
    element(event: Event): DOMElement;
    isSingleTouch(event: Event): Boolean;
    isMultiTouch(event: Event): Boolean;
    isLeftClick(event: Event): Boolean;
    isRightClick(event: Event): Boolean;
    stop(event: Event, allowDefault: Boolean);
    preventDefault(event: Event);
    findElement(event: Event, tagName: string): DOMElement;
    observe(elementParam: DOMElement, name: string, observer: ICallback, useCapture: Boolean);
    observe(elementParam: string, name: string, observer: ICallback, useCapture: Boolean);
    stopObservingElement(elementParam: DOMElement);
    stopObservingElement(elementParam: string);
    _removeElementObservers(elementObservers: any[]);
    stopObserving(elementParam: DOMElement, name: string, observer: ICallback, useCapture: Boolean): Boolean;
    stopObserving(elementParam: string, name: string, observer: ICallback, useCapture: Boolean): Boolean;
    unloadCache();
  }

  interface Handler{
    //constants
    MOD_NAME: any;
    MOD_SHIEFT: any;
    MOD_CONTROL: any;
    MOD_ALT: any;
    MOD_META: any;
    //properties
    id: string;
    control: Control;
    map: Map;
    keyMask: number;
    active: Boolean;
    evt: Event;

    //functions
    setMap(map: Map);
    checkModifiers(evt: Event): Boolean;
    activate(): Boolean;
    deactivate(): Boolean;
    callback(name: string, args: any[]);
    register(name: string, method: ICallback);
    setEvent(evt: Event);
    destroy();

    
  }
  declare var Handler: {
    new (control: Control, callbacks: ICallback, options: any): Handler;
    (control: Control, callbacks: ICallback, options: any): Handler;
    prototype: Handler;
  }

  interface Control{
    //constants
    TYPE_BUTTON: any;
    TYPE_TOGGLE: any;
    TYPE_TOOL: any;

    //properties
    id: string;
    map: Map;
    div: DOMElement;
    type: number;
    allowSelection: Boolean;
    displayClass: string;
    title: string;
    autoActivate: Boolean;
    active: Boolean;
    handlerOptions: any;
    handler: Handler;   
    eventListeners: any;
    events: Event;

    //functions
    destroy();
    setMap(map);
    draw(px: Pixel): DOMElement;
    moveTo(px: Pixel);
    activate(): Boolean;
    deactivate(): Boolean;
  }

  declare var Control:{
    new (options: any): Control;
    (options: any): Control;
    prototype: Control;
  }

  interface Tile{
    events: Events;
    eventListeners: any;
    id: string;
    layer: Layer;
    url: string;
    bounds: Bounds;
    size: Size;
    position: Pixel;
    isLoading: Boolean;

    //functions
    unload();
    destroy();
    draw(force: Boolean): Boolean;
    shouldDraw(): Boolean;
    setBounds(bounds: Bounds);
    moveTo(bounds: Bounds, position: Pixel, redraw: Boolean);
    clear(draw: Boolean);
  }
  declare var Tile:{
    new (layer: Layer, position: Pixel, bounds: Bounds, url: string, size: Size, options: any): Tile;
    (layer: Layer, position: Pixel, bounds: Bounds, url: string, size: Size, options: any): Tile;
    prototype: Tile;
  }

  interface TileManager{
    cacheSize: number;
    moveDelay: number;
    zoomDelay: number;
    maps: Map[];
    tileQueueId: any;
    tileQueue: Tile[];
    tileCache: any;

    //functions
    addMap(map: Map);
    removeMap(map: Map);
    move(evt: any);
    changeLayer(evt: any);
    addLayer(evt: any);
    removeLayer(evt: any);
    updateTimeout(map: Map, delay: number);
    addTile(evt: any);
    unloadTile(evt: any);
    queueTileDraw(evt: any);
    drawTileFromQueue(map: Map);
    manageTileCache(evt: any);
    addToCache(evt: any);
    clearTile(evt: any);
    destroy();
  } 
  declare var TileManager:{
    new (options: any): TileManager;
    (options: any): TileManager;
    prototype: TileManager;
  }

  interface Linear{
    easeIn(t: number, b: number, c: number, d: number): number;
    easeOut(t: number, b: number, c: number, d: number): number;
    easeInOut(t: number, b: number, c: number, d: number): number;
  }
  interface Expo{
    easeIn(t: number, b: number, c: number, d: number): number;
    easeOut(t: number, b: number, c: number, d: number): number;
    easeInOut(t: number, b: number, c: number, d: number): number;
  }
  interface Quad{
    easeIn(t: number, b: number, c: number, d: number): number;
    easeOut(t: number, b: number, c: number, d: number): number;
    easeInOut(t: number, b: number, c: number, d: number): number;
  }

  interface Tween {
    easing: any;
    begin: any;
    finish: any;
    duration: number;
    time: number;
    minFrameRate: number;
    startTime: number;
    animationId: number;
    playing: Boolean;

    start(begin: any, finish: any, duration: number, options: any);
    stop();
    play();
  }

  declare var Tween:{
    new (easing: any): Tween;
    (easing: any): Tween;
    prototype: Tween;
    Easing: {
      Liner: {
      };
      Expo: {

      };
      Quad: {

      };

    };
  }

  interface Map {
    //constant
    Z_INDEX_BASE : any;
    TILE_WIDTH: number;
    TILE_HEIGHT: number;

    //properties
    events: Events;
    id:string;
    fractionalZoom : Boolean;
    allOverlays : Boolean;
    div:DOMElement;
    dragging:Boolean;
    size:Size;
    viewPortDiv:HTMLDivElement;
    layerContainerOrigin : LonLat;
    layerContainerDiv:HTMLDivElement;
    layers:Layer[];
    controls:Control[];
    popups: Popup[];
    baseLayer: Layer;
    center: LonLat;
    resolution: number;
    zoom: number;
    panRatio: number;
    options: any;
    tileSize: Size;
    projection: Projection;
    units: string;
    resolutions: number[];
    maxResolution: number;
    minResolution: number;
    maxScale: number;
    minScale: number;
    maxExtent: Bounds[];
    minExtent: Bounds[];
    restrictedExtent: Bounds[];
    numZoomLevels: number;
    theme: string;
    displayProjection: Projection;
    tileManager: TileManager;
    fallThrough: Boolean;
    autoUpdateSize: Boolean;
    panTween: Tween;
    eventListeners: any;
    panMethod: ICallback;
    panDuration: number;
    paddingForPopups: Bounds;
    layerContainerOriginPx: any;
    minPx: Pixel;
    maxPx: Pixel;
    
    //functions
    getViewPort(): DOMElement;
    render(div: DOMElement);
    render(div: string);
    destroy();
    setOptions(options: any);
    getTileSize(): Size;
    getBy(array: string, property: string, match: string): any[];
    getBy(array: string, property: string, match: any): any[];
    getLayersBy(property: string, match: string): Layer[];
    getLayersBy(property: string, match: any): Layer[];
    getLayersByName(match: string): Layer[];
    getLayersByName(match: any): Layer[];
    getLayersByClass(match: string): Layer[];
    getLayersByClass(match: any): Layer[];
    getControlsBy(property: string, match: string): Control[];
    getControlsBy(property: string, match: any): Control[];
    getControlsByClass(match: string): Control[];
    getControlsByClass(match: any): Control[];
    getLayer(id: string): Layer;
    setLayerZIndex(layer: Layer, zIndex: number);
    resetLayersZIndex();
    addLayer(layer: Layer): Boolean;
    addLayers(layers: Layer[]);
    removeLayer(layer: Layer, setNewBaseLayer: Boolean);
    getNumLayers(): number;
    getLayerIndex(layer: Layer): number;
    setLayerIndex(layer: Layer, idx: number);
    raiseLayer(layer: Layer, delta: number);
    setBaseLayer(newBaseLayer: Layer);
    addControl(control: Control, px: Pixel);
    addControls(controls: Control[], pixels: Pixel[]);
    addControlMap(control: Control, px: Pixel);
    getControl(id: string): Control;
    removeControl(control: Control);
    addPopup(popup: Popup, exclusive: Boolean); 
    removePopup(popup: Popup);
    getSize(): Size;
    updateSize();
    getCurrentSize(): Size;
    calculateBounds(center: LonLat, resolution: number): Bounds;
    getCenter(): LonLat;
    getCachedCenter(): LonLat;
    getZooom(): number;
    pan(dx: number, dy: number, options: any);
    panTo(lonlat: LonLat);
    setCenter(lonlat: LonLat, zoom: number, dragging: Boolean, forceZoomChange: Boolean);
    moveByPx(dx: number, dy: number);
    adjustZoom(zoom: number): number;
    getMinZoom(): number;
    moveTo(lonlat: LonLat, zoom: number, options: any);
    centerLayerContainer(lonlat: LonLat);
    isValidZoomLevel(zoomLevel: number): Boolean;
    isValidLonLat(lonlat: LonLat): Boolean;
    getProjection(): string;
    getProjectionObject(): Projection;
    getMaxResolution(): string;
    getMaxExtent(restricted: Boolean): Bounds;
    getNumZoomLevels(): number;
    getExtent(): Bounds;
    getResolution(): number;
    getUnits(): number;
    getScale(): number;
    getZoomForExtent(bounds: Bounds, closest: Boolean): number;
    getResolutionForZoom(zoom: number): number;
    getZoomForResolution(resolution: number, closest: Boolean): number;
    zoomTo(zoom: number);
    zoomIn();
    zoomOut();
    zoomToExtent(bounds: Bounds, closest: Boolean);
    zoomToMaxExtent(restricted: Boolean);
    zoomToScale(scale: number, closest: Boolean);
    getLonLatFromViewPortPx(viewPortPx: Pixel);
    getLonLatFromViewPortPx(viewPortPx: any):LonLat;
    getViewPortPxFromLonLat(lonlat: LonLat): Pixel;
    getLonLatFromPixel(px: Pixel): LonLat;
    getPixelFromLonLat(lonlat: LonLat): Pixel;
    getGeodesicPixelSize(px: Pixel): Size;
    getViewPortPxFromLayerPx(layerPx: Pixel): Pixel;
    getLayerPxFromViewPortPx(viewPortPx: Pixel): Pixel;
    getLonLatFromLayerPx(px: Pixel): LonLat;
    getLayerPxFromLonLat(lonlat: LonLat): Pixel;

    //delegate
    unloadDestroy: ICallback;
    updateSizeDestroy: ICallback;
  }

  declare var Map: {
    new (value?: any): Map;
    (value?: any): Map;
    new (div: DOMElement, options?: any): Map;
    new (div: DOMElement, center: LonLat): Map;
    new (div: DOMElement, zoom: number): Map;
    new (div: DOMElement, extent:Bounds): Map;
    (div: DOMElement, options?: any): Map;
    (div: DOMElement, center: LonLat): Map;
    (div: DOMElement, zoom: number): Map;
    (div: DOMElement, extent:Bounds): Map;
    prototype: Map;
  }


  interface Events {
    BROWSER_EVENTS: string[];
    listeners: any;
    object: any;
    element: DOMElement;
    eventHandler: ICallback;
    fallThrough: Boolean;
    includeXY: Boolean;
    extensions: any;
    extensionCount: any;
    destroy();
    addEventType(eventName: string);
    attachToElement(element: HTMLDOMElement);
    on(object: any);
    register(type: string, obj: any, func: ICallback, priority: Boolean);
    registerPriority(type: string, obj: any, func: ICallback);
    un(object: any);
    unregister(type: string, obj: any, func: ICallback);
    remove(type: string);
    triggerEvent(type: string, evt: Event):Boolean;
    triggerEvent(type: string, evt: any):Boolean;
    handleBrowserEvent(evt: Event);
    getTouchClientXY(evt: Event): any;
    clearMouseCache();
    getMousePosition(evt: Event): OpenLayers.Pixel;
  }

  declare var Events: {
    new (object: any, element: DOMElement, eventTypes: string[], fallThrough: Boolean, options?: any): Events;
    new (value?: any): Events;
    (object: any, element: DOMElement, eventTypes: string[], fallThrough: Boolean, options?: any): Events;
    (value?: any): Events;
    prototype: Events;
  }

  interface Layer {
    //properties
    id: string;
    name: string;
    div: DOMElement;
    opacity: number;
    alwaysInRange: Boolean;

    events: Events;
    map: Map;
    isBaseLayer: Boolean;
    alpha: Boolean;
    displayInLayerSwitcher: Boolean;
    visibility: Boolean;
    attribution: string;
    inRange: Boolean;
    options: any;
    eventListeners: any;
    gutter: number;
    projection: Projection;
    units: string;
    scales: any[];
    resolutions: any[];
    maxExtent: Bounds[];
    minExtent: Bounds[];
    maxResolution: number;
    minResolution: number;
    numZoomLevels: number;
    minScale: number;
    maxScale: number;
    displayOutsideMaxExtent: Boolean;
    wrapDateLine: Boolean;
    metaData: any;

    //constant
    RESOLUTION_PROPERTIES: any[];
    
    //functions
    destroy();
    clone(obj:Layer): Layer;
    getOptions(): any;
    setName(newName: string);
    addOptions(newOptions: any, reinitialize: Boolean);
    onMapResize();
    redraw(): Boolean;
    moveTo(bounds: Bounds, zoomChanged: Boolean, draging: Boolean);
    moveByPx(dx: number, dy: number);
    setMap(map: Map);
    afterAdd();
    removeMap(map: Map);
    getImageSize(bounds: Bounds): Size;
    setTileSize(size: Size);
    getVisibility(): Boolean;
    setVisibility(visibility: Boolean);
    display(display: Boolean);
    calculateInRange(): Boolean;
    initResolutions();
    resolutionsFromScale(scales: number[]): number[];
    calculateResolutions(props: any): number[];
    getResolution(): number;
    getExtent(): Bounds;
    getZoomForExtent(extent: Bounds, closest: Boolean): number;
    getDataExtent(): Bounds;
    getResolutionForZoom(zoom: number): number;
    getZoomForResolution(resolution: number, closest: Boolean): number;
    getLonLatFromViewPortPx(viewPortPx: Pixel[]): LonLat;
    getViewPortPxFromLonLat(lonlat: LonLat, resolution: number): Pixel;
    setOpacity(opacity: number);
    getZIndex(): number;
    setZIndex(zIndex: number);
    adjustBounds(bounds: Bounds);
   }

  declare var Layer:{
    new (value?: any): Layer;
    new (name: string, options: any): Layer;
    (value?: any): Layer;
    (name: string, options: any): Layer;
    prototype: Layer;
    Vector: {
      new (value?: any): Vector;
      (value?: any): Vector;
      prototype: Vector;
    };
  }

  interface Filter {
    destroy();
    evaluate(context: any): Boolean;
    clone(): Filter;
    toString(): string;
  }

  declare var Filter:{
    new (options?: any): Filter;
    (options?: any): Filter;
    prototype: Filter;
  }

  interface StyleMap {
    styles:any;
    extendDefault : Boolean;

    destroy();
    createSymobolizer(feature: Feature, intent: string): any;
    addUniqueValueRules(renderIntent: string, property: string, symbolizers: any, content: any);
  }

  interface Strategy {
    layer: Vector;
    options: any;
    active: Boolean;
    autoActivate: Boolean;
    autoDestroy: Boolean;
    destroy();
    setLayer(layer: Layer);
    activate(): Boolean;
    deactivate(): Boolean;
  }

  declare var Strategy: {
    new (options?: any): Strategy;
    (options?: any): Strategy;
    prototype: Strategy;
  }
  interface Format{
    options: any;
    externalProjection: Projection;
    internalProjection: Projection;
    data: any;
    keepData: any;

    destroy();
    read(data: string): any;
    write(object: any):string;
  }

  declare var Format:{
    new (options?: any): Format;
    (options?: any): Format;
    prototype: Format;
  }

  interface Response{
    code: number;
    requestType:string;
    last:Boolean;
    features: FVector[];
    data: any;
    reqFeatures: FVector[];
    priv: any;
    error: any;

    sucess(): Boolean;
  }

  interface Protocol {
    format: Format;
    options: any;
    autoDestroy: Boolean;
    defaultFilter: Filter;
    //functions;
    mergeWithDefaultFilter(filter: Filter);
    destroy();
    read(options: any): Response;
    create(features: FVector[], options: any): Response;
    update(features: FVector[], options: any): Response;
    delete(features: FVector[], options: any): Response;
    commit(features: FVector[], options: any): Response;
    abort(response: Response);
    createCallback(method: ICallback, response: Response, options: any);


  }

  declare var Protocol: {
    new (value?: any): Protocol;
    (value?: any): Protocol;
    prototype: Protocol;
    Response: {
      new (options?: any): Response;
      (options?: any): Response;
      prototype: Response;
    };
  }

  interface DefaultSymbolizer {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeWidth: number;
    pointRadius: number;
    graphicName: string;
  }

  interface Renderer {
    container: DOMElement;
    root:DOMElement;
    extent:Bounds;
    locked: Boolean;
    size: Size;
    resolution: number;
    map: Map;
    featureDx: number;
    //functions;
    destroy();
    supported(): Boolean;
    setExtent(extent: Bounds, resolutionChanged: Boolean): Boolean;
    setSize(size: Size);
    getResolution(): number;
    drawFeature(feature: FVector, style: any): Boolean;
    calculateFeatureDx(bounds: Bounds, worldBounds: Bounds);
    drawGeometry(geometry: Geometry, style: any, featureId: string);
    drawText(featureId: string, style: any, location: Point);
    removeText(featureId: string);
    clear();
    getFeatureIdFromEvent(evt: Event): string;
    eraseFeature(features: FVector[]);
    eraseGeometry(geometry: Geometry, featureId: string);
    moveRoot(renderer: Renderer);
    getRenderLayerId(): string;
    applyDefaultSymobolizer(symbolizer: any):any;

    //Constants
    defaultSymbolizer: DefaultSymbolizer;
    symbol: any;
  }

  declare var Renderer: {
    new (value?: any): Renderer;
    (value?: any): Renderer;
    new (containerID: string, options: any): Renderer;
    (containerID: string, options: any): Renderer;
    prototype: Renderer;
    defaultSymbolizer: {
      new (value?: any): DefaultSymbolizer;
      (value?: any): DefaultSymbolizer;
      prototype: DefaultSymbolizer;
    };
  }


  interface Vector extends Layer {
    events: Events;
    isBaseLayer:Boolean;
    isFixed:Boolean;
    features:Vector[];
    filter: Filter;
    selectedFeatures: FVector[];
    unrenderedFeatures: any;
    reportError: Boolean;
    style: any;
    styleMap:StyleMap;
    strategies: Strategy[];
    protocol: Protocol;
    renderers: string[];
    renders: Renderer;
    rendererOptions:any;
    geometryType:string;
    drawn:Boolean;
    ratio: number;
    //function
    destroy();
    clone(obj: Vector): Vector;
    refresh(obj: any);
    assignRenderer();
    displayError();
    setMap(map: Map);
    afterAdd();
    removeMap(map: Map);
    onMapResize: () =>any;
    moveTo(bounds: Bounds, zoomChanged: Boolean, dragging: Boolean);
    display(display: Boolean);
    addFeatures(features: FVector[], options: any);
    removeFeatures(features: FVector[], options: any);
    removeAllFeatures(silent: Boolean);
    destroyFeatures(features: FVector[], options: any);
    drawFeature(feature: FVector, style: string);
    eraseFeature(feature: FVector);
    getFeatureFromEvent(evt: Event): FVector;
    getFeatureBy(property: string, value: string): FVector;
    getFeatureByFid(featureFid: string): FVector;
    getFeatureByAttribute(attrName: string, attrValue: any): FVector;
    onFeatureInsert: (feature: FVector) =>any;
    preFeatureInsert: (feature: FVector) =>any;
    getDataExtent(): Bounds;
    

  }

  declare var Vector:{
    new (value?: any): Vector;
    (value?: any): Vector;
    new (name: string, options: any): Vector;
    (name: string, options: any): Vector;
    prototype: Vector;
  }


  interface Icon {
    url: string;
    size: Size;
    offset: Pixel;
    calculateOffset: ICallback;
    imageDiv: DOMElement;
    px: Pixel;
    //functions
    destroy();
    clone(): Icon;
    setSize(size: Size);
    setUrl(url: string);
    draw(px: Pixel): DOMElement;
    erase();
    setOpacity(opacity: number);
    moveTo(px: Pixel);
    display(display: Boolean);
    isDraw(): Boolean;
  }

  declare var Icon:{
    new (value?: any): Icon;
    (value?: any): Icon;
    new (url: string, size: Size, offset: Pixel, calculateOffset: ICallback): Icon;
    (url: string, size: Size, offset: Pixel, calculateOffset: ICallback): Icon;
    prototype: Icon;

  }

  interface Marker { 
    icon: Icon;
    lonlat: LonLat;
    events:Events;
    map: Map;
    //functions
    destroy();
    draw(px: Pixel): DOMElement;
    erase();
    moveTo(px: Pixel);
    isDraw(): Boolean;
    onScreen(): Boolean;
    inflats(inflate: number);
    setOpacity(opacity: number);
    setUrl(url: string);
    display(display: Boolean);
    defaultIcon(): Icon;
  }

  interface Class {   
    inherit(C: any, P: any);
    extend(destination: any, source: any): any;
  }

  declare var Class: {
    new (value?: any): Class;
    (value?: any): Class;
    new (...value: any[]): Class;
    (...value: any[]): Class;
  }

  interface Popup {   
    events: Event;
    id:string;
    lonlat: LonLat;
    div:DOMElement;
    contentSize: Size;
    size: Size;
    contentHTML: string;
    opacity: number;
    border: string;
    contentDiv: DOMElement;
    groupDiv: DOMElement;
    closeDiv: DOMElement;
    autoSize: Size;
    minSize: Size;
    maxSize: Size;
    displayClass: string;
    contentDisplayClass: string;
    padding: Bounds;
    disableFirefoxOverflowHack: Boolean;
    panMapIfOutOfView: Boolean;
    keepInMap:Boolean;
    closeOnMove:Boolean;
    map:Map;
    

    //functions
    fixPadding();
    destroy();
    draw(px: Pixel): DOMElement;
    updatePosition();
    moveTo(px: Pixel);
    visible(): Boolean;
    toggle();
    show();
    hide();
    setSize(contentSize: Size);
    updateSize();
    setBackgroundColor(color: string);
    setOpacity(opacity: number);
    setBorder(border: string);
    setContentHTML(contentHTML: string);
    registerImageListeners();
    getSafeContentSize(size: Size): Size;
    getContentDivPadding(): Bounds;
    addCloseBox(callback: ICallback);
    panIntoView();
    registerEvents();
    onmouseDown:(evt: Event) => any;
    onmouseMove:(evt: Event) => any;
    onmouseUp:(evt:Event) => any;
    onClick:(evt:Event)=>any;
    onmouseOut:(evt:Event)=>any;
    ondblClick:(evt:Event)=>any;
}

  declare var Popup: {
    new (value?: any): Popup;
    (value?: any): Popup;
    new (id: string, lonlat: LonLat, contentSize: Size, contentHTML: string, closeBox: Boolean, closeBoxCallback: ICallback);
    (id: string, lonlat: LonLat, contentSize: Size, contentHTML: string, closeBox: Boolean, closeBoxCallback: ICallback);
  }


  interface Feature {
    layer: Layer;
    id: string;
    lonlat: LonLat;
    data: any;
    marker: Marker;
    popupClass: Class;
    popup: Popup;

    destroy();
    onScreen(): Boolean;
    createMarker(): Marker;
    destroyMarker();
    createPopup(closeBox: Boolean): Popup;
    destroyPopup();
  }

  interface Style {
    fill: Boolean;
    fillColor: string;
    fillOpacity: number;
    stroke: Boolean;
    strokeColor: string;
    strokeOpacity: number;
    strokeWidth: number;
    strokeLinecap: string;
    strokeDashstyle: string;
    graphic: Boolean;
    pointRadius: number;
    pointerEvents: string;
    cursor: string;
    externalGraphic: string;
    graphicWidth: number;
    graphicHeight: number;
    graphicOpacity: number;
    graphicXOffset: number;
    graphicYOffset: number;
    rotation: number;
    graphicZIndex: number;
    graphicTitle: string;
    backgroundGraphic: string;
    backgroundGraphicZIndex: number;
    backgroundXOffset: number;
    backgroundYOffset: number;
    backgroundHeight: number;
    backgroundWidth: number;
    label: string;
    labelAlign: string;
    labelXOffset: number;
    labelYOffset: number;
    labelSelect: Boolean;
    labelOutlineColor: string;
    labelOutlineWidth: number;
    fontColor: string; 
    fontOpacity: number;
    fontFamily: string;
    fontSize: string;
    fontStyle: string;
    fontWeight: string; 
    display: string;

  }

  interface FVector extends Feature {
    //Properties
    fid: string;
    geometry: Geometry;
    attributes: any;
    bounds: Bounds;
    state: string;
    url: string;
    renderIntent: string;
    modified: any;
    //functions
    destroy();
    clone(): FVector;
    onScreen(boundsOnly: Boolean): Boolean;
    getVisibility(): Boolean;
    createMarker(): Marker;
    destroyMarker();
    createPopup(): Popup;
    atPoint(lonlat: LonLat, toleranceLon: number, toleranceLat: number): Boolean;
    destroyPopup();
    move(location: LonLat);
    move(location: Pixel);

    //Constants
    style: Style;
  }

  declare var Feature: {
    new (value?: any): Feature;
    new (layer: Layer, lonlat: LonLat, data: any): Feature;
    (value?: any): Feature;
    (layer: Layer, lonlat: LonLat, data: any): Feature;                   
    prototype: Feature;

    Vector: {
      new (geometry: Geometry, attributes: any, style: any): FVector;
      (geometry: Geometry, attributes: any, style: any): FVector;
      prototype: FVector;
    };
  }


}


module jsts {
  interface WKTReader {
    read(wkt: string): OpenLayers.Geometry;
  }
  interface WKTWriter {
    write(geometry: OpenLayers.Geometry): string;
  }

  interface OpenLayersParser {
    read(geometry: OpenLayers.Geometry): any;
    write(buffer: any):any;
  }

  declare var io: {
    WKTReader: {
      new (value?: WKTReader): WKTReader;
      (value?: WKTReader): WKTReader;
      prototype: WKTReader;
    };
    WKTWriter: {
      new (value?: WKTWriter): WKTWriter;
      (value?: WKTWriter): WKTWriter;
      prototype: WKTWriter;
    };
    OpenLayersParser: {
      new (value?: OpenLayersParser): OpenLayersParser;
      (value?: OpenLayersParser): OpenLayersParser;
      prototype: OpenLayersParser;
    };
  }
}

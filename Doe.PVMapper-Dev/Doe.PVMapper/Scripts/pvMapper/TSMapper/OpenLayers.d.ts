// Type definition for OpenLayers Release 2.12-rc3
// Project: http://http://dev.openlayers.org/
// Definitions by: Leng Vang
// Definition:https://github.com/borisyankov/DefinitelyTyped

// Module
declare module OpenLayers {
    interface ICallback extends Function {
    }

    interface Request {
        GET(config: any): any;
        POST(config: any): any;
        HEAD(config: any): any;
    }

    var Request: Request;

    export class Attributes {                                                                         
        name: string;
        description: string;
        overallScore: number;
        fillColor: string;

    }


    interface Util {
        getParameterString(params: any): string;
    }

    var Util: Util;
                                              
    interface SiteFeature extends FVector {
        attributes: Attributes;
        site: any;
    }

    export var SiteFeature: {
        new (attr?: Attributes): SiteFeature;
        prototype: SiteFeature;
    }

    interface Collection extends Geometry {
        components: Geometry[];
        componentTypes: string[];

        constructor(components: Geometry[]);

        destroy();
        //clone(): Geometry;
        getComponentsString(): string;
        calculateBounds();
        addComponents(components: Geometry[]);
        addComponent(component: Geometry, index: number): Boolean;
        removeComponents(components: Geometry[]): Boolean;
        removeComponent(component: Geometry): Boolean;
        getLength(): number;
        getArea(): number;
        getGeodesicArea(projection: Projection): number;
        getCentroid(): Point;
        getGeodesicLength(projection: Projection): number;
        move(x: number, y: number);
        rotate(angle: number, origin: Point);
        resize(scale: number, origin: Point, ratio: number): Geometry;
        //distanceTo(geometry: Geometry): number;
        distanceTo(geometry: Geometry, options?: Boolean): number;
        equals(geometry: Geometry): Boolean;
        transform(source: Projection, dest: Projection): Geometry;
        intersects(geometry: Geometry): Boolean;
        getVertices(nodes: Boolean): Geometry[];
    }

    interface Polygon extends Collection, Geometry {
        compontTypes: string[];
        getArea(): number;

        //clone(): {clone(): Collection; clone(): Geometry}

        constructor(components?: Geometry[]);
        constructor(components: LinearRing);
        
        getGeodesicArea(projection: Projection): number;
        containsPoint(point: Point): Boolean;
        //containsPoint(point: Point): number;   //this break in Typescript 0.9.1 ==> "Overloads cannot differ only by return type".
        intersects(geometry: Geometry): Boolean;
        distanceTo(geometry: Geometry): number;
        distanceTo(geometry: Geometry, options?: any): number;
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
        distanceTo(geometry: Geometry): number;
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
        //containsPoint(point: Point): number; //this break in Typescript 0.9.1 ==> "Overloads cannot differ only by return type".
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

    export class Bounds {
        left: number;
        bottom: number;
        right: number;
        top: number;
        centerLonLat: LonLat;

        constructor(left: number, bottom: number, right: number, top: number);

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
        scale(ratio: number, origin?: Pixel): Bounds;
        scale(ratio: number, origin: LonLat): Bounds;
        add(x: number, y: number): Bounds;
        extend(object: LonLat);
        extend(object: Point);
        extend(object: Bounds);
        containsLonLat(ll: LonLat, inclusive?: Boolean): Boolean;
        containsLonLat(ll: LonLat, worldBounds?: Bounds): Boolean;
        containsPixel(px: Pixel, inclusive: Boolean): Boolean;
        contains(x: number, y: number, inclusive?: Boolean): Boolean;
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

    var LonLat: {
        new (lon: number, lat: number): LonLat;
        new (location: number[]): LonLat;
        prototype: LonLat;
    }

    interface Segment {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    interface Distance {
        details: boolean; //TODO: is this right?
        distance: number;
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
        //distanceTo(geometry: Geometry): number;
        distanceTo(geometry: Geometry, options?: any): number;
        getVertices(nodes: Boolean): Geometry[];
        atPoint(lonlat: LonLat, toleranceLon: number, toleranceLat: number): Boolean;
        getLength(): number;
        getArea(): number;
        //  getCentroid(): Point;
        getCentroid(weighted?: Boolean): Point;
        toString(): string;

        fromWKT(wkt: string): Geometry;
        segmentsIntersect(seg1: Segment, seg2: Segment, point: Boolean): Boolean;
        segmentsIntersect(seg1: Segment, seg2: Segment, tolerance: number): Point;
        distanceToSegment(point: Point, segment: Segment): Point;
    }

    var Geometry: {
        new (): Geometry;
        (): Geometry;
        protytype: Geometry;
        Collection: {
            new (components: Geometry[]): Collection;
            (components: Geometry[]): Collection;
            prototype: Collection;
        }
        Curve: {
            new (point: Point): Curve;
        }
        Point: {
            new (x: number, y: number): Point;
            prototype: Point;
        }
        LinearRing: {
            new (points: Point[]): LinearRing;
            (points: Point[]): LinearRing;
            prototype: LinearRing;
        }
        LineString: {
            new (points: Point[]): LineString;
            (points: Point[]): LineString;
            prototype: LineString;
        }
        MultiLineString: {
            new (components: LineString[]): MultiLineString;
            (components: LineString[]): MultiLineString;
            prototype: MultiLineString;
        }
        MultiPoint: {
            new (components: Point[]): MultiPoint;
            (components: Point[]): MultiPoint;
            prototype: MultiPoint;
        }
        MultiPolygon: {
            new (components: Polygon[]): MultiPolygon;
            (components: Polygon[]): MultiPolygon;
            prototype: MultiPolygon;
        }
        Polygon: {
            new (components: LinearRing[]): Polygon;
            (components: LinearRing[]): Polygon;
            prototype: Polygon;
        }
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

    var Projection: {
        new (value?: any): Projection;
        (value?: any): Projection;
        prototype: Projection;
    }

  interface Point extends Geometry {
        x: number;
        y: number;
        clone(obj?: any): Point;
        distanceTo(geometry: Geometry): number;
        distanceTo(geometry: Geometry, edge?: Boolean): Distance; //this break in Typescript 0.9.1 ==> "Overloads cannot differ only by return type".
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
        //numericIf(value: number, trimWhitespace: Boolean): string;  //this break in Typescript 0.9.1 ==> "Overloads cannot differ only by return type".
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

    interface Date {
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

    interface Handler {
        //constants
        MOD_NAME: any;
        MOD_SHIEFT: any;
        MOD_CONTROL: any;
        MOD_ALT: any;
        MOD_META: any;
        //properties
        id: string;
        control: Control;
        map: IMap;
        keyMask: number;
        active: Boolean;
        evt: Event;

        //functions
        setMap(map: IMap);
        checkModifiers(evt: Event): Boolean;
        activate(): Boolean;
        deactivate(): Boolean;
        callback(name: string, args: any[]);
        register(name: string, method: ICallback);
        setEvent(evt: Event);
        destroy();
    }
    var Handler: {
        new (control: Control, callbacks: ICallback, options: any): Handler;
        (control: Control, callbacks: ICallback, options: any): Handler;
        prototype: Handler;
    }

  interface Control {
        //constants
        TYPE_BUTTON: any;
        TYPE_TOGGLE: any;
        TYPE_TOOL: any;

        //properties
        id: string;
        map: IMap;
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
        events: Events;

        //functions
        destroy();
        setMap(map);
        //draw();
        moveTo(px: Pixel);
        activate(): Boolean;
        deactivate(): Boolean;
    }

    var Control: {
        new (options: any): Control;
        (options: any): Control;
        prototype: Control;
        Navigation: {
            new (): Navigation;
            (): Navigation;
            prototype: Navigation;
        };
        PanZoomBar: {
            new (): PanZoomBar;
            (): PanZoomBar;
            prototype: PanZoomBar;
        };
        Attribution: {
            new (options?: any): Attribution;
            (options?: any): Attribution;
            prototype: Attribution;
        };
        ScaleLine: {
            new (options?: any): ScaleLine;
            (options?: any): ScaleLine;
            prototype: ScaleLine;
        };
    }

  //* controls inherites from Control
  interface ArgParser extends Control {
        center: LonLat;
        zoom: number;
        layers: string;
        displayProjection: Projection;

        getParameters(url);
        setMap(map: IMap);
        setCenter();
        configureLayers();
    }
    var ArgParse: {
        new (options: any): ArgParser;
        (options: any): ArgParser;
        prototype: ArgParser;
    }

  interface Attribution extends Control {
        separator: string;
        template: string;
        destroy();
        // draw(obj?:Pixel):DOMElement;  // was removed from OL
        udpateAttribution();

    }
    var Attribution: {
        new (options: any): Attribution;
        (options: any): Attribution;
        prototype: Attribution;
    }

  interface Button extends Control {
        type: number;
        trigger();
    }

    interface CacheRead extends Control {
        fetchEvent: string;
        layers: Grid[];
        autoActivate: boolean;

        setMap(map: IMap);
        addLayer(evt: Layer);
        removeLayer(evt: Layer);
        fetch(evt: any);
        destroy();
    }
    var CacheRead: {
        new (options: any): CacheRead;
        (options: any): CacheRead;
        prototype: CacheRead;
    }

  interface CacheWrite extends Control {
        events: Events;
        eventListeners: any;
        layers: Grid[];
        imageFormat: string;
        quotaRegEx: RegExp;

        setMap(map: IMap);
        addLayer(evt: Layer);
        removeLayer(evt: Layer);
        makeSameOrigin(evt: Event);
        onTileLoaded(evt: Event);
        cache(obj: any);  // {Object} Object with a tile property, tile being the OpenLayers.Tile.Image with the data to add to the cache
        destroy();
        clearCache();
    }
    var CacheWrite: {
        new (options: any): CacheWrite;
        (options: any): CacheWrite;
        prototype: CacheWrite;
    }

    //To finish: go here:
    //http://dev.openlayers.org/docs/files/OpenLayers/Control/CacheWrite-js.html
    interface DragFeature extends Control {
        /// {Array(String)} To restrict dragging to a limited set of geometry types, send a list of strings corresponding to the geometry class names.
        geometryTypes: string[];

        documentDrag: boolean;
        layer: Vector;
        feature: FVector;
        dragCallbacks: any;
        featureCallbacks: any;
        lastPixel: Pixel;

        /// {Function } Define this function if you want to know when a drag starts.The function should expect to receive two arguments: the feature that is about to be dragged and the pixel location of the mouse.
        onStart(feature: FVector, pixel: Pixel);
        //{Function} Define this function if you want to know about each move of a feature.  The function should expect to receive two arguments: the feature that is being dragged and the pixel location of the mouse.
        onDrag(feature: FVector, pixel: Pixel);
        //{Function} Define this function if you want to know when a feature is done dragging.  The function should expect to receive two arguments: the feature that is being dragged and the pixel location of the mouse.
        onComplete(feature: FVector, pixel: Pixel);
        //{Function } Define this function if you want to know when the mouse goes over a feature and thereby makes this feature a candidate for dragging.
        onEnter(feature: FVector);
        //{Function} Define this function if you want to know when the mouse goes out of the feature that was dragged.
        onLeave(feature: FVector);

        clickFeature(feature: FVector);
        clickoutFeature(feature: FVector);
        destroy();
        activate(): boolean;
        deactivate(): boolean;
        overFeature(feature: FVector): boolean;
        downFeature(pixel: Pixel);
        moveFeature(pixel: Pixel);
        upFeature(pixel: Pixel);
        doneDragging(pixel: Pixel);
        outFeature(feature: FVector);
        cancel();
        setMap(map: IMap);


    }

    var DragFeature: {
        new (layer: Vector, options?: any): DragFeature;
        (layer: Vector, options?: any): DragFeature;
        prototype: DragFeature;
    }

    interface Kinetic {
    }
    interface DragPan extends Control {
        type: number; //Control.TYPES
        panned: boolean;  //The map moved.
        interval: number;//{Integer } The number of milliseconds that should ellapse before panning the map again.Defaults to 0 milliseconds, which means that no separate cycle is used for panning.In most cases you won’t want to change this value.For slow machines / devices larger values can be tried out.
        documentDrag: boolean; //{Boolean} If set to true, mouse dragging will continue even if the mouse cursor leaves the map viewport.  Default is false.
        kinetic: Kinetic;
        enableKinetic: boolean; //{Boolean} Set this option to enable “kinetic dragging”.  Can be set to true or to an object.  If set to an object this object will be passed to the {OpenLayers.Kinetic} constructor.  Defaults to true.  To get kinetic dragging, ensure that OpenLayers/Kinetic.js is included in your build config.
        kineticInterval: number; //{Integer} Interval in milliseconds between 2 steps in the “kinetic scrolling”.  Applies only if enableKinetic is set.  Defaults to 10 milliseconds.

        draw();
        panMapStart();
        panMap(xy: Pixel);
        panMapDone(xy: Pixel);
    }
    interface DrawFeature extends Control {
        layer: Vector;
        callbacks: any; // The functions that are sent to the handler for callback
        events: Events; //Events instance for listeners and triggering control specific events.
        multi: boolean; //{Boolean} Cast features to multi-part geometries before passing to the layer.  Default is false.
        featureAdded(); //{Function} Called after each feature is added
        handlerOptions: any; //{Object} Used to set non-default properties on the control’s handler

        drawFeature(geometry: Geometry);
        insertXY(x: number, y: number);
        insertDeltaXY(dx: number, dy: number);
        insertDirectionLength(direction: number, length: number);
        insertDeflectionLength(deflection: number, length: number);
        undo(): boolean;
        redo(): boolean;
        finishSketch();
        cancel();
    }
    var DrawFeature: {
        new (layer: Vector, handler: Handler, options: any): DrawFeature;
        (layer: Vector, handler: Handler, options: any): DrawFeature;
        prototype: DrawFeature;
    }

    interface EditingToolbar extends Control {
        citeCompliant: boolean; //{Boolean} If set to true, coordinates of features drawn in a map extent crossing the date line won’t exceed the world bounds.  Default is false.
        draw(): DOMElement; //calls the default draw, and then activates mouse defaults.
    }
    var EditingToolbar: {
        new (layer: Vector, options: any): EditingToolbar;
        (layer: Vector, options: any): EditingToolbar;
        prototype: EditingToolbar;
    }

    interface Geolocate extends Control {
        events: Events;
        geolocation: any;
        available: boolean;
        bind: boolean;
        watch: boolean;
        geolocationOptions: any;

        destroy();
        activate(): boolean;
        deactivate(): boolean;
        geolocate(position: Position);
        getCurrentLocation(): boolean;
        failrure(error: any);
    }
    var Geolocate: {
        new (): Geolocate;
        (): Geolocate;
        prototype: Geolocate;
    }

    interface GetFeature extends Control {
        protocol: Protocol; //{OpenLayers.Protocol} Required.  The protocol used for fetching features.    
        multipleKey: string;
        toggleKey: string;
        modifier: any;
        multiple: boolean;
        click: boolean;
        single: boolean;
        clickout: boolean;
        toggle: boolean;
        clickTolerance: number;
        hover: boolean;
        box: boolean;
        maxFeatures: number;
        features: any; //{Object} Hash of {OpenLayers.Feature.Vector}, keyed by fid, holding the currently selected features
        handlerOptions: any;
        handlers: any; //{Object} Object with references to multiple OpenLayers.Handler instances.
        hoverResponse: Response;//{OpenLayers.Protocol.Response} The response object associated with the currently running hover request (if any).
        filterType: string; //{String} The type of filter to use when sending off a request.  Possible values: OpenLayers.Filter.Spatial.<BBOX|INTERSECTS|WITHIN|CONTAINS> Defaults to: OpenLayers.Filter.Spatial.BBOX

        /*
        Register a listener for a particular event with the following syntax
                control.events.register(type, obj, listener);
        Supported event types (in addition to those from OpenLayers.Control.events)
                beforefeatureselected	Triggered when click is true before a feature is selected.  The event object has a feature property with the feature about to select
                featureselected	Triggered when click is true and a feature is selected.  The event object has a feature property with the selected feature
                beforefeaturesselected	Triggered when click is true before a set of features is selected.  The event object is an array of feature properties with the features about to be selected.  Return false after receiving this event to discontinue processing of all featureselected events and the featuresselected event.
                featuresselected	Triggered when click is true and a set of features is selected.  The event object is an array of feature properties of the selected features
                featureunselected	Triggered when click is true and a feature is unselected.  The event object has a feature property with the unselected feature
                clickout	Triggered when when click is true and no feature was selected.
                hoverfeature	Triggered when hover is true and the mouse has stopped over a feature
                outfeature	Triggered when hover is true and the mouse moves moved away from a hover-selected feature
              */
        events: Events;

        activate(): boolean;
        deactivate(): boolean;
        selectClick(evt: Event);
        selectBox(position: Position);
        selectHover(evt: Event);
        cancelHover();
        /*
        Supported options include
                single	{Boolean} A single feature should be returned.  Note that this will be ignored if the protocol does not return the geometries of the features.
                hover	{Boolean} Do the request for the hover handler.
              */
        request(bounds: Bounds, options: any);

        //hover {Boolean } Do the selection for the hover handler.
        selectBestFeature(features: FVector, clickPosition: LonLat, options: any);
        setModifiers(evt: Event);
        select(features: FVector[]);
        hoverSelect(feature: FVector);
        unselect(feature: FVector);
        unselectAll();
        setMap(map: IMap);
        pixelToBounds(pixel: Pixel);
    }
    var GetFeature: {
        new (options: any): GetFeature;
        (options: any): GetFeature;
        prototype: GetFeature;
    }

    interface Symbolizer {
        zIndex: number;
        clone(): Symbolizer;
    }
    var Symbolizer: {
        new (config: any): Symbolizer;
        (config: any): Symbolizer;
        prototype: Symbolizer;
    }
    interface Graticule extends Control {
        autoActivate: boolean;
        interval: number[];
        displayInLayerSwitch: boolean;
        visible: boolean;
        numPoints: number;
        layerName: string;
        labelled: boolean;
        labelFormat: string;
        lineSymbolizer: Symbolizer;
        labelSymbolizer: Symbolizer;
        gratLayer: Vector;

        destroy();
        draw(): DOMElement;
        activate();
        deactivate();
        update(): DOMElement;
    }
    var Graticule: {
        new (options: any): Graticule;
        (options: any): Graticule;
        prototype: Graticule;
    }

    interface KeyboardDefaults extends Control {
        autoActivate: boolean;
        slideFactor: number;
        observeElement: DOMElement;

        draw();
        defaultKeyPress(evt:Event);
    }
    var KeyboardDefaults: {
        new (): KeyboardDefaults;
        (): KeyboardDefaults;
        prototype: KeyboardDefaults;
    }

    interface LayerSwitcher extends Control {
        layerStates: any[];
        layersDiv: DOMElement;
        baseLayersDiv: DOMElement;
        baseLayers: any[];
        dataLbl: DOMElement;
        dataLayersDiv: DOMElement;
        dataLayers: any[];
        minimizeDiv: DOMElement;
        maximizeDiv: DOMElement;
        ascending: boolean;

        destroy();
        setMap(map: IMap);
        draw(): DOMElement;
        clearLayersArray(layersType: string);
        checkRedraw(): boolean;
        redraw(): DOMElement;
        updateMap();
        miximizeControl(evt: Event);
        minimizeControl(evt: Event);
        showControls(minimize: boolean);
        loadContents();
    }
    var LayerSwitcher: {
        new (options: any): LayerSwitcher;
        (options: any): LayerSwitcher;
        prototype: LayerSwitcher;
    }
    
    interface ValueUnit{
        value: number;
        unit: string;
    }
    interface Measure extends Control {
        events: Events;
        handlerOptions: any;
        callbacks: any;
        displaySystem: string;
        geodesic: boolean;
        displaySystemUnits: any;
        delay: number;
        delayeredTrigger: number;
        persist: boolean;
        immediate: boolean;

        deactivate();
        cancel();
        setImmediate(immediate: boolean);
        updateHandler(handler: ICallback, options: any);
        measureComplete(geometry: Geometry);
        measurePartial(point: Point, geometry: Geometry);
        measureImmidiate(point: Point, feature: FVector, drawing: boolean);
        cancelDelay();
        measuer(geometry: Geometry, eventType: string);
        getBestArea(geometry: Geometry): ValueUnit[];
        getArea(geometry: Geometry, units: string): number;
        getBestLength(geometry: Geometry): ValueUnit[];
        getLength(geometry: Geometry, units: string): number;
    }
    var Measure: {
        new (handler: Handler, options: any): Measure;
        (handler: Handler, options: any): Measure;
        prototype: Measure;
    }
    interface ModifyFeature extends Control {

    }
    interface MousePosition extends Control {
    }
    interface Navigation extends Control {
    }
    interface NavgationHistory extends Control {
    }
    interface NavToolbar extends Control {
    }
    interface OverviewMap extends Control {
    }
    interface Pan extends Control {
    }

    interface Panel extends Control {
    }

    interface PanPanel extends Control {
    }
    interface PanZoom extends Control {
    }
    interface PanZoomBar extends Control {
    }
    interface Permalink extends Control {
    }
    interface PinchZoom extends Control {
    }
    interface Scale extends Control {
    }
    interface ScaleLine extends Control {
    }
    interface SelectFeature extends Control {
    }
    interface SLDSelect extends Control {
    }
    interface Snapping extends Control {
    }
    interface Split extends Control {
    }
    interface TouchNavigation extends Control {
    }
    interface TranformFeature extends Control {
    }
    interface UTFGrid extends Control {
    }
    interface WMSGetFeatureInfo extends Control {
    }
    interface WMTSGetFeatureInfo extends Control {
    }
    interface Zoom extends Control {
    }
    interface ZoomBox extends Control {
    }
    interface ZoomIn extends Control {
    }
    interface ZoomOut extends Control {
    }
    interface ZoomPanel extends Control {
    }
    interface ZoomToMaxExtent extends Control {
    }

    //********************


    interface Tile {
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
    var Tile: {
        new (layer: Layer, position: Pixel, bounds: Bounds, url: string, size: Size, options: any): Tile;
        (layer: Layer, position: Pixel, bounds: Bounds, url: string, size: Size, options: any): Tile;
        prototype: Tile;
    }

  interface TileManager {
        cacheSize: number;
        moveDelay: number;
        zoomDelay: number;
        maps: IMap[];
        tileQueueId: any;
        tileQueue: Tile[];
        tileCache: any;

        //functions
        addMap(map: IMap);
        removeMap(map: IMap);
        move(evt: any);
        changeLayer(evt: any);
        addLayer(evt: any);
        removeLayer(evt: any);
        updateTimeout(map: IMap, delay: number);
        addTile(evt: any);
        unloadTile(evt: any);
        queueTileDraw(evt: any);
        drawTileFromQueue(map: IMap);
        manageTileCache(evt: any);
        addToCache(evt: any);
        clearTile(evt: any);
        destroy();
    }
    var TileManager: {
        new (options: any): TileManager;
        (options: any): TileManager;
        prototype: TileManager;
    }

  interface Linear {
        easeIn(t: number, b: number, c: number, d: number): number;
        easeOut(t: number, b: number, c: number, d: number): number;
        easeInOut(t: number, b: number, c: number, d: number): number;
    }
    interface Expo {
        easeIn(t: number, b: number, c: number, d: number): number;
        easeOut(t: number, b: number, c: number, d: number): number;
        easeInOut(t: number, b: number, c: number, d: number): number;
    }
    interface Quad {
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

    var Tween: {
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

    //NOTE: This version implement the upcoming release of OpenLayers currently in development.
  interface IMap {
        //constant
        Z_INDEX_BASE: any;
        TILE_WIDTH: number;
        TILE_HEIGHT: number;

        //properties
        events: Events;
        id: string;
        fractionalZoom: Boolean;
        allOverlays: Boolean;
        div: DOMElement;
        dragging: Boolean;
        size: Size;
        viewPortDiv: HTMLDivElement;
        layerContainerOrigin: LonLat;
        layerContainerDiv: HTMLDivElement;
        layers: Layer[];
        controls: Control[];
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
        maxExtent: Bounds;
        minExtent: Bounds;
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
        setCenter(lonlat: LonLat, zoom: number, dragging?: Boolean, forceZoomChange?: Boolean);
        moveByPx(dx: number, dy: number);
        adjustZoom(zoom: number): number;
        getMinZoom(): number;
        moveTo(lonlat: LonLat, zoom: number, options?: any);
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
        getLonLatFromViewPortPx(viewPortPx: any): LonLat;
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

    var Map: {
        new (value?: any): IMap;
        (value?: any): IMap;
        new (div: DOMElement, options?: any): IMap;
        new (div: DOMElement, center: LonLat): IMap;
        new (div: DOMElement, zoom: number): IMap;
        new (div: DOMElement, extent: Bounds): IMap;
        (div: DOMElement, options?: any): IMap;
        (div: DOMElement, center: LonLat): IMap;
        (div: DOMElement, zoom: number): IMap;
        (div: DOMElement, extent: Bounds): IMap;
        prototype: IMap;
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
        triggerEvent(type: string, evt: Event): Boolean;
        triggerEvent(type: string, evt: any): Boolean;
        handleBrowserEvent(evt: Event);
        getTouchClientXY(evt: Event): any;
        clearMouseCache();
        getMousePosition(evt: Event): OpenLayers.Pixel;
    }

    var Events: {
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
        map: IMap;
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
        clone(obj: Layer): Layer;
        getOptions(): any;
        setName(newName: string);
        addOptions(newOptions: any, reinitialize: Boolean);
        onMapResize();
        redraw(): Boolean;
        moveTo(bounds: Bounds, zoomChanged: Boolean, draging: Boolean);
        moveByPx(dx: number, dy: number);
        setMap(map: IMap);
        afterAdd();
        removeMap(map: IMap);
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

    interface WMSOptions {
        setBuffer(buffer: number);
        setProjection(epsgCode: string);
        setRatio(ratio: number);
        setReproject(reproject: boolean);
        setSingleTile(b: boolean);
        setTrasitionEffect(TransitionEffect: any);
        setUnits(units: string);
        setUntitled();
        setWrapDateLine(wrap: boolean);
    }

    var WMSOptions: {
        new (): WMSOptions;
        prototype: WMSOptions;
    }

  interface WMSParams {
        getFormat(): string;
        getLayers(): string;
        getMaxExtent(): Bounds;
        getStyles(): string;
        setFormat(styles: string);
        setIsTransparent(isTransparent: boolean);
        setLayers(layers: string);
        setMaxExtent(bound: Bounds);
        setStyles(styles: string);
    }

    var WMSParams: {
        new (): WMSParams;
        new (jsObject: any);
        prototype: WMSParams;
    }

  interface ArcGIS93RestOptions {
        /**
        A name for the layer.
        */
        format: string;
        /**
         Comma-separated list of layers to display.
        */
        layers: string;
        /**
         Projection ID.
        */
        srs: string;
    }

    interface JSObject {
        createJSArray(): JSObject;
        createJSFunction(): JSObject;
        createJSObject(): JSObject;
        ensureOpaqueArray(): JSObject;
        getProperty(name: string): JSObject;
        getPropertyArray(name: string): JSObject[];
        getPropertyAsBoolean(name: string): boolean;
        getPropertyAsDomElement(name: string): any;   //The return type is "com.google.gwt.user.client.Element"
        getPropertyAsDouble(name: string): number;
        getPropertyAsFloat(name: string): number;
        getPropertyAsInt(name: string): number;
        getpropertyAsString(name: string): string;
        getpropertyName(): string;
        hasProperty(name: string): boolean;
        setProperty(name: string, value: boolean);
        setproperty(name: string, value: number);
        setproperty(name: string, value: any);
        setproperty(name: string, value: JSObject);
        setproperty(name: string, value: string);
        unsetProperty(name: string);
    }
    var JSObject: {
        new (): JSObject;
        prototype: JSObject;
    }


    interface HTTPRequest extends Layer {
        //TODO: flush out the rest.
    }

    interface Grid extends HTTPRequest {
        narrowToGridLayer(gridLayer: JSObject);
        setBuffer(buffer: number);
        setNumLoadingTile(numLoadingTiles: number);
        setRatio(ratio: number);
        setSingleTile(singleTile: boolean);
        setTitleSize(tileSize: number);
    }

    interface GridLayerOptions {

    }

    interface ArcGIS93Rest extends Grid {
        DEFAULT_PARAMS: Object;
        isBaseLayer: Boolean;
        narrowToArcGIS93Rest(arcgis93Rest: JSObject);
        setIsBaseLayer(isBaseLayer: boolean);
        destroy();
        clone(obj: ArcGIS93Rest): ArcGIS93Rest;
        getURL(bounds: Bounds): string;
        getLayerFilter(id: string, queryDef: string);
        clearLayerFilter(id: string);
        mergeNewParams(newParams: Object);
        addTile(bounds: Bounds, position: Pixel);
        getNumLoadingTiles(): number;
        epsgOverride: string;
    }

    //interface Grid extends GridLayer {
    //    getGridBounds(); // deprecated.
    //    getTilesBounds();
    //}

    interface XYZ extends Grid {
        isBaseLayer: boolean;
        sphericalMercator: boolean;
        zoomOffset: number;
        serverResolutions: any[]; //array : a list of all resolutions available on the server.

        clone(obj: any): XYZ;
        getURL(bounds: Bounds): string;
        getXYZ(bounds: Bounds): any; //an object with x, y and z properties
        setMap(map: IMap);
    }
    interface WMS extends Grid {
        DEFAULT_PARAMS: any;
        isBaseLayer: boolean;
        encodeBBOX: boolean;
        noMagic: boolean;
        yz: any;

        clone(obj): WMS;
        reverseAxisOrder(): boolean;
        getURL(bounds: Bounds): string;
        mergeNewParams(newParams: any);
        getFullRequestString(newParams: any, altUrl: string): string;
    }

    interface OSM extends XYZ {
        name: string;
        url: string;
        attribution: string;
        sphericalMercator: boolean;
        wrapDateLine: boolean;
        tileOptions: Tile;
        clone(obj: any): OSM;
    }

    var Layer: {
        new (name: string, options: any): Layer;
        (value?: any): Layer;
        (name: string, options: any): Layer;
        prototype: Layer;
        Vector: {
            new (name: string, options?: any): Vector;
            prototype: Vector;
        };
        WMS: {
            new (name: string, url: string, params: any, options?: any): WMS;
            prototype: WMS;
        }
        ArcGIS93Rest: {
            new (name: string, url: string[], params: any): ArcGIS93Rest;
            new (name: string, url: string, options: any, params?: any): ArcGIS93Rest;
            prototype: ArcGIS93Rest;
        }
        XYZ: {
            new (name: string, url: string, options: any): XYZ;
            prototype: XYZ;
        }
        //ArcGIS93Rest(name: string, url: string[], params: any):any;
        //ArcGIS93Rest(name: string, url: string, options: any, params?: any):any;
        //ArcGIS93Rest(name: string, url: string[], params: WMSParams, layerParams: WMSOptions ): any;
        //ArcGIS93Rest(name: string, url: string, params: WMSParams, options: ArcGIS93RestOptions): any;
        Grid: {
            new (): Grid;
            new (name: string, url: string, params: WMSParams): Grid;
            new (name: string, url: string, params: WMSParams, options: GridLayerOptions): Grid;
            prototype: Grid;
        }
        OSM: {
            new (): OSM;
            new (name: string, url: string, options:any): OSM;
            prototype: OSM;
        }
    }

    interface Filter {
        destroy();
        evaluate(context: any): Boolean;
        clone(): Filter;
        toString(): string;
    }

    interface Comparison extends Filter {
        type: string;
        property: string;
        value: number;
        lowerBoundary: number;
        upperBoundary: number;

        value2regex(wildCard: string, singleChar: string, escapeChar: string): string;
    }

    var Filter: {
        new (options?: any): Filter;
        (options?: any): Filter;
        prototype: Filter;

        Comparison: {
            new (options?: any): Comparison;

            EQUAL_TO: string;
            NOT_EQUAL_TO: string;
            LESS_THAN: string;
            GREATER_THAN: string;
            LESS_THAN_OR_EQUAL_TO: string;
            GREATER_THAN_OR_EQUAL_TO: string;
            BETWEEN: string;
            LIKE: string;
        }
    }

    interface StyleMap {
        styles: {
            [intent: string]: Style;
            default: Style;
            select: Style;
            temporary: Style;
        };
        extendDefault: Boolean;

        destroy();
        createSymobolizer(feature: Feature, intent: string): any;
        addUniqueValueRules(renderIntent: string, property: string, symbolizers: any, content: any);
    }

    var StyleMap: {
        new (): StyleMap;
        new (style: any): StyleMap;
        new (style: any, options: any): StyleMap;
    }

    interface Rule {
        id: string;
        name: string;
        title: string;
        description: string;
        context: any;
        filter: Filter;
        elseFilter: boolean;
        symbolizer: any;
        symbolizers: number;
        minScaleDenominator: any;
        maxScaleDenominator: any;

        destroy();
        evaluate(feature: Feature): boolean;
        getContext(feature: Feature): any;
        clone(): Rule;
    }

    var Rule: {
        new (options?: any): Rule;
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

    interface BBOX {
        bounds: Bounds;
        resolution: number;
        ratio: number;
        resFactor: number;
        response: Response;

        activate(): boolean;
        deactivate(): boolean;
        update(options?: any);   //validate: force: boolean - if true, new data must be unconditionally read.  noAbort: boolean - if true, do not abort previous requests.
        getMapBounds(): Bounds;
        invalidBounds(mapBounds: Bounds): boolean;
        calculateBounds(mapBounds: Bounds);
        triggerRead(options: any): Response;
        createFilter(): Filter;
        merge(resp: Response);
    }

    interface Cluster {
        distance: number;
        threshold: number;
        features: FVector[];
        clusters: FVector[];
        clustering: boolean;
        resolution: number;

        activate(): boolean;
        deactivate(): boolean;
        cacheFeatures(evt: any): boolean;
        clearCache();
        cluster(evt: any);
        clustersExist(): boolean;
        shouldCluster(cluster: FVector, feature: FVector);

    }

    interface Fixed{
        preload: Boolean;
        activate(): Boolean;
        deactivate(): Boolean;
        load(options?: any);
        merge(resp: Response);
    }


    var Strategy: {
        new (options?: any): Strategy;
        (options?: any): Strategy;
        prototype: Strategy;
        BBOX: {
            new (options?: any): BBOX;
            (options?: any): BBOX;
            prototype: BBOX;
        }
        Fixed: {
            new (options?: any): Fixed;
            (options?: any): Fixed;
            prototype: Fixed;
        }

    }

  interface Format {
        options: any;
        externalProjection: Projection;
        internalProjection: Projection;
        data: any;
        keepData: any;

        destroy();
        read(data: string): any;
        write(object: any): string;
    }

    interface EsriGeoJSONP {
        read(data: string): FVector[];
    }

    interface GeoJSON {
        ignoreExtraDims: boolean;
        read(json: string, type: string, filter: ICallback): any;
        write(obj: any, pretty: boolean): string;
    }

    interface ParseGeometry {
        point(node: DOMElement): Point;
        linestring(node: DOMElement): LineString;
        polygon(node: DOMElement): Polygon;
        multigeometry(node: DOMElement): Collection;
    }

    interface BuildGeometry{
        point(geometry: DOMElement): DOMElement;
        multipoint(geometry: Point): DOMElement;
        linestring(geometry: LineString): DOMElement;
        multilinestring(geometry: Point): DOMElement;
        linearring(geometry: LinearRing): DOMElement;
        polygon(geometry: Polygon): DOMElement;
        multipolygon(geometry: Point): DOMElement;
        collection(geometry: Collection): DOMElement;
        buildCoordinatesNode(geometry: Geometry): DOMElement;
        buildCoordinates(point: Point): string;
        buildExtendedData(attributes: any): DOMElement;
    }


    interface KML extends XML {
        namespaces: any;
        kmlns: string;
        placemarksDesc: string;
        foldersName: string;
        foldersDesc: string;
        extractAttributes: boolean;
        kvpAttributes: boolean;
        extractStyles: boolean;
        extractTracks: boolean;
        trackAttributes: any[];
        internalns: string;
        features: FVector[];
        styles: any[];
        styleBaseUrl: string;
        feteched: any;
        maxDepth: number;
        readers: any;

        read(data: string): FVector[];
        parseData(data: string, options: any): FVector[];
        parseLinks(nodes: DOMElement[], options: any);
        fetchLink(href: string);
        parseStyles(nodes: DOMElement[], options: any);
        parseKmlColor(kmlcolor: string): any;
        parseStyle(node: DOMElement);
        parseStyleMaps(nodes: DOMElement[], options: any);
        parseFeatures(nodes: DOMElement[], options: any);
        parseFeature(node: DOMElement): FVector;
        getStyle(styleUrl: string, options: any): any;
        parseAttributres(node: DOMElement): any;
        parseExtendedData(node: DOMElement): any;
        parseProperty(xmlNode: DOMElement, namespace: string, tagName: string): string;
        write(features: FVector[]): string;
        write(node: DOMElement): string; //extends override
        createFolderXML(): DOMElement;
        createPlacemarkXML(feature: FVector): DOMElement;
        buildGeometryNode(geometry: Geometry): DOMElement;
        buildCoordinatesNode(geometry: Geometry): DOMElement;
        buildCoordinates(point: Point): string;
        buildExtentedData(attributes: any): DOMElement;

        parseGeometry: ParseGeometry;
        buildGeometry: BuildGeometry;
    }


    interface GPX extends XML {
        defaultDesc: string;
        extractWaypoints: boolean;
        extractTracks: boolean;
        extractRoutes: boolean;
        extractAttributes: boolean;
        namespaces: any;  //Mapping of namespaces aliases to namespaces URIs.
        schemaLocation: string;
        creator: string;

        read(data: string): any;
        read(doc: Element): FVector[];
        extractSegment(segment: DOMElement, segmentType: string): LineString;
        parseAttributes(node: DOMElement): any;
        write(object: any): string;
        write(features: FVector[], meata: any);
        buildMetadataNode(metadata: any): DOMElement;
        buildFeatureNode(feature: FVector): DOMElement;
        buildTrkSegNode(geometry: Geometry): DOMElement;
        buildTrkPtNode(point: Point): DOMElement;
        buildWptNode(geometry: Point): DOMElement;
        appendAttributesNode(node: DOMElement, feature: FVector);
    }

    interface JSONSerialize {
        object(obj: any): string;
        array(arr: any[]): string;
        string(str: string): string;
        number(num: number): string;
        boolean(boo: boolean): string;
        object(date: Date): string;
        
    }


    interface JSON extends Format {
        indent: string;
        space: string;
        newline: string;
        level: number;
        pretty: boolean;
        nativeJSON: boolean;

        read(data: string): any;  //Override from Format.
        read(json: string, filter: ICallback): any;
        write(object: any): string;  //override from Format
        write(value: string, pretty: boolean): string;
        writeIndent(): string;
        writeNewLine(): string;

        serialize: JSONSerialize;
    }

    interface XML extends Format {
        namespaces: any;
        namespaceAlias: any;
        defaultPrefix: string;
        readers: any;
        writers: any;
        xmldom: any; //  the actual type is XMLDom -- not defined any where in OpenLayers.
        document: XMLDocument;


        destroy();
        setNameSpace(alias: string, uri: string);
        write(node: DOMElement): string;
        createElementNS(uri: string, name: string): Element;
        createDocumentFragment(): Element;
        createTextNode(text: string): DOMElement;
        getElementsByTagNameNS(node: Element, uri: string, name: string): NodeList;
        getAttributeNodeNS(node: Element, uri: string, name: string): DOMElement;
        getAttributeNS(node: Element, uri: string, name: string): string;
        getChildValue(node: DOMElement, def: string): string;
        isSimpleContent(node: DOMElement): boolean;
        contentType(node: DOMElement): number;
        hasAttributeNS(node: Element, uri: string, name: string): boolean;
        setAttributeNS(node: Element, uri: string, name: string, value: string);
        createElementNSPlus(name: string, options?: any): Element;
        setAttributes(node: Element, obj: any);
        readNode(node: DOMElement, obj: any): any;
        readChildNodes(node: DOMElement, obj: any): any;
        writeNode(name: string, obj: any, parent: DOMElement): DOMElement;
        getChildEl(node: DOMElement, name?: string, uri?: string): DOMElement;
        getNextEl(node: DOMElement, name?: string, uri?: string): DOMElement;
        getThisOrNextEl(node: DOMElement, name?: string, uri?: string)
        lookupNamespaceURI(node: DOMElement, prefix: string): string;
        getXMLDoc(): XMLDocument;
    }

    var Format: {
        new (options?: any): Format;
        (options?: any): Format;
        prototype: Format;
        GML: any;
        XML: {
            new (options?: any): XML;
            prototype: XML;
        }
        KML: {
            new (options?: any): KML;
            prototype: KML;
        }
        GPX: {
            new (options?: any): GPX;
            prototype: GPX;
        }
        JSON: {
            new (options?: any): any;
            prototype: JSON;
        }
        GeoJSON: {
            new (options?: any): any;
            prototype: GeoJSON;
        }
        WMSGetFeatureInfo(): any;

        //  Note: this is not from OpenLayers, it's different...
        EsriGeoJSON: {
            new (): any;
            prototype: EsriGeoJSONP;
        }
    }

  interface Response {
        code?: number;
        requestType: string;
        last: Boolean;
        features?: FVector[];
        data: any;
        reqFeatures: FVector[];
        priv: any;
        error: { code?: number; message?: string; };
        status?: number;
        statusText?: string;
        responseText?: string;

        success(): Boolean;
    }

    interface Protocol {
        format: Format;
        options: any;
        autoDestroy: Boolean;
        defaultFilter: Filter;
        response: Response;
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
    interface Script {
        url: string;
        params: any;
        callback: ICallback;
        callbackTemplate: string;
        callbackKey: string;
        callbackPrefix: string;
        scope?: any;
        format: Format;
        srsInBBOX: boolean;

        read(): Response;
        filterToParams(options?: any): Response;
        abort(response: Response);
        destroy();
    }

    interface HTTP {
        readWithPOST: boolean;
        updateWithPOST: boolean;
        deleteWithPOST: boolean;
        srsInBBOX: boolean;

        destroy();
        filterToParams(filter: Filter): any;
        read(options?: any): Response;
        create(features: FVector[], options?: any): Response;
        //create(features: FVector, options?: any): Response;
        update(feature: FVector, options?: any): Response;
        delete(feature: FVector, options?: any): Response;
        commit(features: FVector[], options?: any): Response;
        abort(response: Response);
    }

    interface WFS {
    }
    

    var Protocol: {
        new (value?: any): Protocol;
        (value?: any): Protocol;
        prototype: Protocol;
        Response: {
            new (options?: any): Response;
            (options?: any): Response;
            prototype: Response;
        };
        Script: {
            new (params: any): any;
            prototype: Script;
        }
        HTTP: {
            new (options?: any): HTTP;
            prototype: HTTP;

        }
        WFS: {
            new (options?: any): WFS;
            prototype: WFS;
        }

        //Script(url: string, params: any, callback: (response: any) => {}, scope?: any): any;
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
        root: DOMElement;
        extent: Bounds;
        locked: Boolean;
        size: Size;
        resolution: number;
        map: IMap;
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
        applyDefaultSymobolizer(symbolizer: any): any;

        //Constants
        defaultSymbolizer: DefaultSymbolizer;
        symbol: any;
    }

    var Renderer: {
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


  //support 2.13.1
  interface Vector extends Layer {
        events: Events;
        isBaseLayer: Boolean;
        isFixed: Boolean;
        features: FVector[];
        filter: Filter;
        selectedFeatures: FVector[];
        unrenderedFeatures: any;
        reportError: Boolean;
        style: any;
        styleMap: StyleMap;
        strategies: Strategy[];
        protocol: Protocol;
        renderers: string[];
        renderer: Renderer;
        rendererOptions: any;
        geometryType: string;
        drawn: Boolean;
        ratio: number;
        //function
        destroy();
        clone(obj: Vector): Vector;
        refresh(obj: any);
        assignRenderer();
        displayError();
        setMap(map: IMap);
        afterAdd();
        removeMap(map: IMap);
        onMapResize: () => any;
        moveTo(bounds: Bounds, zoomChanged: Boolean, dragging: Boolean);
        display(display: Boolean);
        addFeatures(features: FVector[], options?: any);
        removeFeatures(features: FVector[], options?: any);
        removeAllFeatures(silent: Boolean);
        destroyFeatures(features: FVector[], options?: any);
        drawFeature(feature: FVector, style?: string);
        eraseFeature(feature: FVector);
        getFeatureFromEvent(evt: Event): FVector;
        getFeatureBy(property: string, value: string): FVector;
        getFeatureByFid(featureFid: string): FVector;
        getFeatureByAttribute(attrName: string, attrValue: any): FVector;
        onFeatureInsert: (feature: FVector) => any;
        preFeatureInsert: (feature: FVector) => any;
        getDataExtent(): Bounds;


        //Custom properties.
        isReferenceLayer: boolean;
        sourceModule: pvMapper.Module;
    }

    var Vector: {
        new (name: string, options?: any): Vector;
        (name: string, options?: any): Vector;
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

    //NOTE  2.13.1 version.
    var Icon: {
        new (url: string, size: Size, offset: Pixel, calculateOffset: ICallback): Icon;
        (url: string, size: Size, offset: Pixel, calculateOffset: ICallback): Icon;
        prototype: Icon;

    }

  interface Marker {
        icon: Icon;
        lonlat: LonLat;
        events: Events;
        map: IMap;
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

    var Class: {
        new (value?: any): Class;
        (value?: any): Class;
        new (...value: any[]): Class;
        (...value: any[]): Class;
    }

  interface Popup {
        events: Event;
        id: string;
        lonlat: LonLat;
        div: DOMElement;
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
        keepInMap: Boolean;
        closeOnMove: Boolean;
        map: IMap;


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
        onmouseDown: (evt: Event) => any;
        onmouseMove: (evt: Event) => any;
        onmouseUp: (evt: Event) => any;
        onClick: (evt: Event) => any;
        onmouseOut: (evt: Event) => any;
        ondblClick: (evt: Event) => any;
    }

    var Popup: {
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
        name: string;
        layerName: string;
        isDefault: boolean;
        context: any;

        //fill: Boolean;
        //fillColor: string;
        //fillOpacity: number;
        //stroke: Boolean;
        //strokeColor: string;
        //strokeOpacity: number;
        //strokeWidth: number;
        //strokeLinecap: string;
        //strokeDashstyle: string;
        //graphic: Boolean;
        //pointRadius: number;
        //pointerEvents: string;
        //cursor: string;
        //externalGraphic: string;
        //graphicWidth: number;
        //graphicHeight: number;
        //graphicOpacity: number;
        //graphicXOffset: number;
        //graphicYOffset: number;
        //rotation: number;
        //graphicZIndex: number;
        //graphicTitle: string;
        //backgroundGraphic: string;
        //backgroundGraphicZIndex: number;
        //backgroundXOffset: number;
        //backgroundYOffset: number;
        //backgroundHeight: number;
        //backgroundWidth: number;
        //label: string;
        //labelAlign: string;
        //labelXOffset: number;
        //labelYOffset: number;
        //labelSelect: Boolean;
        //labelOutlineColor: string;
        //labelOutlineWidth: number;
        //fontColor: string;
        //fontOpacity: number;
        //fontFamily: string;
        //fontSize: string;
        //fontStyle: string;
        //fontWeight: string;
        //display: string;

        destroy();
        addRules(rules: Rule[]);
        setDefaultStyle(style: any);
        clone(): Style;
    }

    var Style : {
        new (): Style;
        new (style: any): Style;
        new (style: any, options: any): Style;
    }

    //NOTE: FVector is for all features related object.  There are a 'Vector' class which is use for layer only.
    interface FVector extends Feature {
        //Properties
        fid: string;
        geometry: Polygon; //Changed this from Geometry. It seems the documentation is wrong
        attributes: any;
        bounds: Bounds;
        state: string;
        url: string;
        renderIntent: string;
        modified: any;
        //functions
        destroy();
        clone(): FVector;
        onScreen(boundsOnly?: Boolean): Boolean;
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

        layer: Vector;
    }

    var Feature: {
        new (value?: any): Feature;
        new (layer: Layer, lonlat: LonLat, data: any): Feature;
        (value?: any): Feature;
        (layer: Layer, lonlat: LonLat, data: any): Feature;
        prototype: Feature;

        Vector: {
            new (geometry: Geometry, attributes?: any, style?: any): FVector;
            (geometry: Geometry, attributes?: any, style?: any): FVector;
            prototype: FVector;
        };
    }
}


declare module jsts {
    interface WKTReader {
        read(wkt: string): OpenLayers.Geometry;
    }
    interface WKTWriter {
        write(geometry: OpenLayers.Geometry): string;
    }

    interface OpenLayersParser {
        read(geometry: OpenLayers.Geometry): any;
        write(buffer: any): any;
    }

    var io: {
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

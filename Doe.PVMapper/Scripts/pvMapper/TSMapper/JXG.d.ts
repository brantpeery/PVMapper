// Interface

interface ICallback {
  (...args: any[]): any;
}


// Module
declare module JXG {


    interface EventEmitter {
        eventHandlers: any;
        suspended: any;
        trigger(event: any[], args: any[]): EventEmitter;
        /**
          Register a new event handler. For a list of possible events see documentation of the elements and objects implementing the EventEmitter interface. 
          @{String} event - the name of the event to be registered.
          @{Function} handler, a call back function
          @{Object} context Optional, The context the handler will be called in, default is the element itself.
        */
        on(event: string, handler: ICallback, context: any): EventEmitter;
        /**
            Unregister an event handler. 
          */
        off(event: string, handler: ICallback): EventEmitter;
        eventify(o: any);
    }

    enum BoardMode {
        BOARD_MODE_NONE, BOARD_MODE_DRAG, BOARD_MODE_ORIGIN
    }

    interface Options {
 

    }

    var Options: {
        new (): Options;
        (): Options;
        prototype: Options;
        jc: {
            enabled: boolean;
            compile: boolean;
        };
        board: {
            boundingBox: number[];
            zoomFactor: number;
            zoomX: number;
            zoomY: number;
            showCopyRight: boolean;
            axis: boolean;
            showNavigation: boolean;
            showReload: boolean;
            showClearTrace: boolean;
            keepAspectRatio: boolean;
            document: boolean;
            takeFirst: boolean;
            takeSizeFromFile: boolean;
            renderer: string;
            animationDelay: number;
            registerEvents: boolean;
            offsetX: number;
            offsetY: number;
            zoom: {
                factorX: number;
                factorY: number;
                wheel: boolean;
                needshift: boolean;
                eps: number;
            };
            pan: {
                needShift: boolean;
                needTwoFingers: boolean;
                enabled: boolean;
            };
        };
        navbar: {
            strokeColor: string;
            fillColor: string;
            hightlightFillColor: string;
            padding: string;
            position: string;
            fontSize: string;
            cursor: string;
            zIndex: string;
            right: string;
            bottom: string;
        };
        elements: {
            strokeColor: string;
            highlightStrokeColor: string;
            fillColor: string;
            highlightFillColor: string;
            strokeOpacity: number;
            highlightStrokeOpacity: number;
            fillOpacity: number;
            highlightFillOpacity: number;
            strokeWidth: number;
            highlightStrokeWidth: number;
            fixed: boolean;
            frozen: boolean;
            withLabel: boolean;
            visible: boolean;
            priv: boolean;
            layer: number;
            dash: number;
            shadow: boolean;
            trace: boolean;
            traceAttributes: any;
            highlight: boolean;
            needsRegularUpdate: boolean;
            snapToGrid: boolean;
            scalable: boolean;
            draft: {
                draft: boolean;
                strokeColor: string;
                fillColor: string;
                strokeOpacity: string;
                fillOpacity: string;
                strokeWidth: number;
            };
            isLabel: boolean;
        };
        ticks: {
            generateLabelValue: any;
            drawLabels: boolean;
            label: any;
            anchor: string;
            downZero: boolean;
            insertTicks: boolean;
            minTicksDistance: number;
            minorHeight: number;
            majorHeight: number;
            tickEndings: Array<number>;
            minorTicks: number;
            scale: number;
            scaleSymbol: string;
            labels: Array<any>;
            maxLabelLength: number;
            precision: number;
            ticksDistance: number;
            strokeOpacity: number;
            strokeWidth: number;
            strokeColor: string;
            highlightStrokeColor: string;
            includeBoundaries: boolean;
        };
        hatch: {
            drawLabels: boolean;
            drawZero: boolean;
            majorHeight: number;
            anchor: string;
            strokeWidth: number;
            strokeColor: string;
            ticksDistance: number;
        };
        precision: {
            touch: number;
            touchMax: number;
            mouse: number;
            epsilon: number;
            hasPoint: number;
        };
        /// Arrggghhh !!! too many...
        text: {
            fontSize: number;
            digits: number;
            parse: boolean;
            useCaja: boolean;
            isLabel: boolean;
            /// there are more attributes, but only include what I need for now.
            display: string;
        };
    };

  interface Board {
    animateObjects: any;
    BOARD_MODE_MOVE_ORIGIN: number;
    BOARD_MODE_ZOOM: number;
    BOARD_QUALITY_HIGH: number;
    BOARD_QUALITY_LOW: number;
    canvasHeight: number;
    canvasWidth: number;
    container: string;
    containerObj: any;
    cPos: any[];
    currentCBDef: string;
    dependBoards: any[];
    dimension: number;
    downObjects: any[];
    drag_dx: number;
    drag_dy: number;
    elementsByName: any;
    eventHandlers: any;
    geonextCompatibilityMode: boolean;
    grids: any;
    groups: any;
    hasMouseHandlers: boolean;
    hasMouseUp: boolean;
    hasPointerHandlers: boolean;
    hasPointerUp: boolean;
    hasTouchEnd: boolean;
    hasTouchHandlers: boolean;
    highlightedObjects: any;
    inUpdate: boolean;
    isSuspendedRedraw: boolean;
    mode: BoardMode;
    mouse: any;
    needsFullUpdate: boolean;
    numObjects: number;
    objects: any;
    objectsList: any[];
    options: JXG.Options;
    origin: any;
    reducedUpdate: boolean;
    render: JXG.AbstractRenderer;
    touches: any[];
    touchMoveLast: number;
    unitX: number;
    unitY: number;
    updateQuality: UpdateQualityMode;
    xmlString: string;
    zoomX: number;
    zoomY: number;

    //methods
    addEvent(event: EventEmitter, handler: ICallback, context: any): Board;
    addAnimation(element: JXG.GeometryElement): Board;
    addChild(board: Board): Board;
    addConditions(str: string);
    addEventHandlers();
    addHook(hook: ICallback, m?: string, context?: any): number;
    animate(): Board;
    applyZoom(): Board;
    calculateSnapSizes(): Board;
    clearTraces(): Board;
    clickDownArrow();
    clickLeftArrow();
    clickRightArrow();
    clickUpArrow();
    create(elementType: string, parents: any[], attributes?: any): any;
    createRoulette(c1: Curve, c2: Curve, start_c1: number, stepsize: number, direction: number, time: number, pointlist: any[]);
    dehighlightAll(): Board;
    emulateColorblindness(deficiency: string): Board;
    finalizeAdding(obj: any);
    fullUpdate(): Board;
    generateId(): string;
    generateName(obj: any): string;
    gestureChangeListener(evt: Event): boolean;
    gestureStartListener(evet: Event): boolean;
    getAllObjectsUnderMouse(evt: Event): any[];
    getAllUnderMouse(evt: Event): any[];
    getBoundingBox(): any[];
    getCoordsTopLeftCorner(): any[];
    getMousePosition(evt: Event, i?: number): any[];
    getPartialConstruction(root: GeometryElement, filt: any);
    getScrCoordsOfMouse(x: number, y: number): any[];
    getUsrCoordsOfMouse(evt: Event): any[];
    hasPoint(x: number, y: number): boolean;
    highlightCustomInfobox(text: string, el?: GeometryElement): Board;
    highlightInfobox(x: number, y: number, el?: GeometryElement): Board;
    initGeonextBoard(): Board;
    initInfobox(): Board;
    initMoveObject(x: number, y: number, evt: any, type: string): any[];
    initMoveOrigin(x: number, y: number);
    micratePoint(src: Point, dest: Point, copyName: boolean): Board;
    mouseDownListener(evt: Event, obj: any): boolean;
    mouseMoveListener(evt: Event);
    mouseUpListener(evt: Event);
    mouseWheelListener(evt: Event): boolean;
    moveObject(x: number, y: number, o: any, evt: any, type: string);
    moveOrigin(x: number, y: number, diff?: boolean): Board;
    off(event: EventEmitter, handler: ICallback);
    on(event: EventEmitter, handler: ICallback, context?: any);
    pointerDownListener(evt: Event, obj: any): boolean;
    pointerMoveListener(evt: Event): boolean;
    pointerUpListener(evt: Event): boolean;
    prepareUpdate(): Board;
    removeAncestors(obj: GeometryElement): Board;
    removeChild(board: Board): Board;
    removeEvent(event: EventEmitter, handler: ICallback): Board;
    removeEventHandlers();
    removeHook(id: number): Board;
    removeObject(obj: GeometryElement): Board;
    resizeContainer(canvasWidth:number, canvasHeight:number, dontset?:boolean): Board;
    saveStartPos(obj: GeometryElement, targets: any[]);
    select(str: string): GeometryElement;
    setBoundingBox(bbox: any[], keepaspectratio: boolean): Board;
    setId(obj: any, type: number): string;
    setZoom(fX: number, fY: number): Board;
    showDependencies(): Board;
    showXML(): Board;
    stopAllAnimation(): Board;
    suspendUpdate(): Board;
    touchEndListener(evt:Event): boolean;
    touchMoveListener(evt: Event): boolean;
    touchStartListener(evt:Event, obj:any): boolean;
    triggerEventHandlers(event: any[], args: any[]);
    twoFingerMove(p1: any[], p2: any[], o: any, evt: any);
    twoFingerTouchObject(np1c:Coords, np2c:Coords, o:any, drag:any);
    unsuspendUpdate(): Board;
    update(drag?: GeometryElement): Board;
    updateConditions();
    updateCoords(): Board;
    updateCSSTransforms();
    updateElements(drag: GeometryElement): Board;
    updateHooks(m:any): Board;
    updateInfobox(el:GeometryElement): Board;
    updateRenderer(): Board;
    updateRendererCanvas(): Board;
    zoom100(): Board;
    zoomAllPoints(): Board;
    zoomElements(elements: any[]): Board;
    zoomIn(x: number, y: number): Board;
    zoomOut(x: number, y: number): Board;

    //Event Detail
    boundingbox();
    down(e: Event);
    hit(e: Event, el: GeometryElement, target: any);
    mousedown(e: Event);
    mousehit(e: Event, el: GeometryElement, target: any);
    mousemove(e: Event, mode: number);
    mouseup(e: Event);
    move(e: Event, mode: number);
    touched(e: Event);
    touchmove(e: Event, mode: number);
    touchstart(e: Event);
    up(e: Event);
    update();
  }
  
  var Board: {
    new (container: string, renderer: AbstractRenderer, id: string, origin: Coords, zoomX: number, zoomY: number, unitX: number, unitY: number, canvasWidth: number, canvasHeight: number, attributes: any): Board;
    (container: string, renderer: AbstractRenderer, id: string, origin: Coords, zoomX: number, zoomY: number, unitX: number, unitY: number, canvasWidth: number, canvasHeight: number, attributes: any): Board;
    prototype: Board;
  }



  interface Coords{
    board: Board;
    eventHandlers: any;
    scrCoords: any[];
    usrCoords: any[];

    distance(coord_type: number, coodinates: Coords): number;
    normalizeUsrCoords();
    off(event: string, handler: ICallback);
    on(event: string, handler: ICallback, context?: any);
    screen2usr();
    setCoordinates(coord_type: number, coordinates: any[], doRound: boolean): Coords;
    triggerEventHandlers(event: any[], args: any[]);
    usr2screen(doRound:boolean);
    update(ou:any[], os:any[]);
  }
  var Coords: {
    new (method: number, coordinates: any[], board: Board): Coords;
    (method: number, coordinates: any[], board: Board): Coords;
    prototype: Coords;
  }
  interface Point {
    attractorDistance: number;
    attractors: any[];

    /**
     There are different point styles which differ in appearance. Posssible values are
     [Value,cross,circle,square,plus,diamond,triangleUp,triangleDown,triangleLeft,triangleRight]
    */
    face: string;
    showInfobox: boolean;
    size: number;
    snapToPoints: boolean;
    snatchDistance: number;
    style: number;
    coords: Coords;
    group: any[];
    onPolygon: boolean;
    position: number;
    snapSizeX: number;
    snapSizeY: number;
    snapToGrid: boolean;
    _anim(direction: number, stepCount: number);
    addConstraint(terms: any[]);
    addTransform(el: GeometryElement, transform: any[]): Point;
    Dist(point2: Point): number;
    free();
    handleAttractors();
    handleSnapToGrid();
    handleSnapToPoints();
    hasPoint(x: number, y: number): boolean;
    makeGlider(glideObject: any);
    moveAlong(path:any, time:number, options?:any): Point;
    moveTo(where: any[], time: number, options?: any): Point;
    normalizePoints(point: any): Point;
    remove();
    setGliderPosition(x: number): Point;
    setPosition(method: number, coords: Coords): Point;
    setPositionByTransform(method: number, tv: number): Point;
    setPositionDirectly(method: number, coords: Coords): Point;
    setStyle(i: number);
    update(fromParent: any);
    updateConstraint();
    updateGlider();
    updateGliderFromParent();
    updateRenderer();
    updateTransform(): Point;
    visit(where: any[], time: number, options?: any): Point;
    X(): number;
    XEval(): number;
    Y(): number;
    YEval(): number;
    Z(): number;
    ZEval(): number;
  }

  var Point: {
    new (board: Board, coordinates: Coords, attributes: any): Point;
    (board: Board, coordinates: Coords, attributes: any): Point;
    prototype: Point;
  }

  interface Curve{
    curveType: string;
    handDrawing: boolean;
    numberPoints: number;

    addTransform(transform: any[]): Curve;
    allocatePoints();
    generateTerm(varname: string, xterm: number, yterm: number, mi: number, ma: number);
    hasPoint(x: number, y: number, start: number): boolean;
    interpolationFunctionFromArray(which: string): ICallback;
    isDistOK(dx: number, dy: number, MAXX: number, MAXY: number): boolean;
    isSegmentOutside(x0: number, y0: number, x1: number, y1: number): boolean;
    maxX(): number;
    minX(): number;
    notifyParents(contentStr: string);
    setPosition(method: number, coords: any[]): Curve;
    setPositionDirectly(method: number, coords: any[], oldcoords: any[]): Curve;
    update(): Curve;
    updateCurve(): Curve;
    updateDataArray();
    updateParametricCurveNaive(mi: number, ma: number, len: number): Curve;
    updateRenderer(): Curve;
    updateTransform(p: Point): Point;
    Z(t): number;
  }

  var Curve: {
    new (board: Board, parents: any[], attributes: any[]): Curve;
    (board: Board, parents: any[], attributes: any[]): Curve;
    prototype: Curve;
  }

  interface GeometryElement {

  }

  enum UpdateQualityMode {
    BOARD_QUALITY_LOW,
    BOARD_QUALITY_HIGH
  }

  interface AbstractRenderer {
  }


  interface JSXGraph {
    initBoard(box: string, attributes: any): Board;
  }

  var JSXGraph: {
    new (): JSXGraph;
    (): JSXGraph;
    prototype: JSXGraph;
    initBoard(box: string, attributes: any): Board;

  }


  }


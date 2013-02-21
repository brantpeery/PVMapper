/// <reference path="OpenLayers.d.ts" />
/// <reference path="Event.ts" />

module pvMapper {
    export var readyEvent: pvMapper.Event = new pvMapper.Event;
    export function onReady(fn:ICallback) {
        readyEvent.addHandler(fn);
    }

    export var map: OpenLayers.IMap;

}
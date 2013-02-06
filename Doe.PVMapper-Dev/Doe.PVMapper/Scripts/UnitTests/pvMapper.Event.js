/// <reference path="../jquery-1.8.0.js" />
/// <reference path = "../pvMapper/TSMapper/Event.ts"/>
/// <reference path="jasmine.js" />


describe("Event queuing", function () {
	var e = new pvMapper.Event();
	var fn = jasmine.createSpy('fn');

	beforeEach(function () {
		fn.reset();
	});

	it("adds an event to the event queue", function () {
		e.addHandler(fn);
		expect(e.eventHandlers).toContain(fn);
	});
	it("fires event and calls handlers", function(){
		e.fire();
		expect(fn).toHaveBeenCalled();
	});
	it("fires with correct context and data object", function () {
		var data = {  };
		var self = this; //Context causes circular reference
		e.fire(self, data);
		expect(fn).toHaveBeenCalledWith(data);
	});
	it("removes the event", function () {
		e.removeHandler(fn);
		
		e.fire();
		expect(fn).not.toHaveBeenCalled();
	});
});

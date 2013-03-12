/// <reference path="../jquery-1.8.0.js" />
/// <reference path = "../pvMapper/TSMapper/Renderer.ts"/>
/// <reference path = "../pvMapper/TSMapper/Renderer.ts"/>
/// <reference path="jasmine.js" />

describe("The render class", function () {


    it("can render text from a template", function () {
        var r = new pvMapper.Renderer("Alive");
        
        expect(r).toBeDefined();
        expect(r.render()).toBe("Alive");
    });
})
    
    
    
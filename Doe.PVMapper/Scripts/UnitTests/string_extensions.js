/// <reference path="../pvMapper/TSMapper/common.ts" />
/// <reference path="../pvMapper/TSMapper/common.js" />

describe("String.format using named tags", function () {
	it("formats a string using a template", function () {
		var s = '<{tag} {attributes} src="{c3po}">{text}{\\nope}</{tag}>';
		var sf = s.format({
			tag: 'div',
			attributes: 'style="background:blue"',
			text: "What a wonderful WORLD!"
		});
        
		expect(sf).toBe('<div style="background:blue" src="{c3po}">What a wonderful WORLD!{nope}</div>');
	});
});

describe("String.format using ordered parameters", function () {
	it("formats a string using ordered parameters", function () {
		var s = '<{0} {1}>{2}</{0}>';
		var sf = s.format("div", 'style="background:blue"', "What a wonderful WORLD!");

		expect(sf).toBe('<div style="background:blue">What a wonderful WORLD!</div>');
	});
});


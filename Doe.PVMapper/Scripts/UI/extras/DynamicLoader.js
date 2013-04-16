//This file depends on the jQuery framework. The dependancy needs to be removed

var Extras;
(function (Extras) {
    
    Extras.loadScriptFile=function(filename) {
        var fileref = document.createElement('script');
        fileref.setAttribute('type', 'text/javascript');
        fileref.setAttribute('src', filename);
        if (typeof fileref == 'undefined')
            document.getElementsByTagName('head')[0].appendChild(fileref);
    }
    Extras.getScript = function (filename, completeFn) {
        $.getScript(filename, completeFn);
    }

    Extras.loadExternalCSS=function(hrefCSS) {
        $("<link/>")
            .appendTo("head")
            .attr({ rel: "stylesheet", type: "text/css", href: hrefCSS });
    }
})(Extras || (Extras = {}));
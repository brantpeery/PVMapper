///* Replace all tokens with the arguments 
//    ex. {0} with first arg. 
//    ex. {tag} with the tag property of the first parameter

//    USAGE:
//        Use a hash to pass in the named values
//        var s = '<{tag} {attributes} src="{c3po}">{text}{\\nope}</tag>';
//        s = s.format({ tag: 'div', attributes: 'style="background:blue"', text: "What a wonderful WORLD!" });

//        or use numbered parameters.
//        var s = '<{0} {1} src="{3}">{2}{\\nope}</{0}>'
//        s = s.format('div', 'style="background:blue"', "What a wonderful WORLD!");
//*/
//String.prototype.format = function (args) {
//    values = (arguments.length > 1) ?
//        values = arguments :
//        values = args;
//    var str = this;
//    return str.replace(String.prototype.format.regex, function (item) {
//        var key = item.substr(1, item.length - 2);
//        //console.log('key=' + key + " item=" + item);
//        var replace;
//        if (typeof (values[key]) != 'undefined') {
//            replace = values[key];
//        } else if (item == '{\\') {
//            replace = "{"; //Replace {\ with just {
//        } else { replace = item; }
//        //console.log("returning: " + replace + " item: " + item);
//        return replace;
//    });
//};
////console.log("{[\\w\\.-]+}|{\\\\");
//String.prototype.format.regex = new RegExp("{[\\w\\.-]+}|{\\\\", "g");
////END EXTENSIONS
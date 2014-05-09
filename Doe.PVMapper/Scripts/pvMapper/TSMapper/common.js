;

/*
Replace all tokens with values passed in using the order the value is found in args.
the { 0 } token is the first parameter, { 1 } is the second parameter and so on.
USAGE:
Using numbered parameters.
var s = '<{0} {1}>{2}</{0}>'
s = s.format('div', 'style="background:blue"', "What a wonderful WORLD!");
the above would produce
<div style="background:blue">What a wonderful WORLD!</div>
Replaces the tokens named by key with the value specified by value for each key value pair
ex "this is {name}'s {item}.".format({name:'John',item:'book'})
That would produce
"this is John's book."
*/
String.prototype.format = function () {
    var args = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        args[_i] = arguments[_i + 0];
    }
    //var values: string = (arguments.length > 1) ? arguments : args;
    //                                                              -------------  TC9.0 doesn't allow reference this way.
    var values = (arguments.length > 1) ? arguments[0] : args;
    var str = this;

    //The regular expression for the formatter to separate terms from the string.
    //    The default expression will parse to variables named inside brackets.
    //    Has to be a RegExp
    var regex = new RegExp("{[\\w\\.-]+}|{\\\\", "g");

    return str.replace(regex, function (item) {
        var key = item.substr(1, item.length - 2);
        var replace;
        if (typeof (values[key]) !== 'undefined') {
            replace = values[key];
        } else if (item === '{\\') {
            replace = "{"; //Replace {\ with just {
        } else {
            replace = item;
        }
        return replace;
    });
};

String.prototype.isNullOrEmpty = function () {
    var value = this;
    if ((typeof (value) === 'undefined') || (value.length == 0))
        return true;
    else
        return false;
};


Array.prototype.find = function (fn) {
    if (fn) {
        for (var i = 0; i < this.length; i++) {
            if (fn(this[i]))
                return this[i];
        }
    }
    return null;
};

//Just for forcing the funciton domain to a specific d.
//Specifically the 'this' argument of the function
function bindTo(d, f) {
    return function () {
        return f.apply(d, arguments);
    };
}
//# sourceMappingURL=common.js.map

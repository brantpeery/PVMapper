;
String.prototype.format = function (args) {
    var values = (arguments.length > 1) ? arguments : args;
    var str = this;
    var regex = new RegExp("{[\\w\\.-]+}|{\\\\", "g");
    return str.replace(regex, function (item) {
        var key = item.substr(1, item.length - 2);
        var replace;
        if(typeof (values[key]) !== 'undefined') {
            replace = values[key];
        } else if(item === '{\\') {
            replace = "{";
        } else {
            replace = item;
        }
        return replace;
    });
};
String.prototype.isNullOrEmpty = function () {
    var value = this;
    if((typeof (value) === 'undefined') || (value.length == 0)) {
        return true;
    } else {
        return false;
    }
};

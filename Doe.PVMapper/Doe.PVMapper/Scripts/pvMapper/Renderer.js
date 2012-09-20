//EXTENSIONS

// This is the function to allow str.format(variables). It will replace
//    all tokens with the arguments ex. {0} with first arg.
String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
//END EXTENSIONS

var pvMapper = {};
pvMapper.Renderer = function (text) {
    this.draw = function () {
        var s = '';
        for (c in this.children) {
            s += this.children[c].draw();
            //console.log(this.children.length);
        }

        var html = this.template.format(this.getTemplateArgs(s));
        return html;
    };
    this.getTemplateArgs = function (childrenRenderText) { return [this.text + childrenRenderText]; };
    this.updateElement = function (element) { };
    this.removeElement = function (element) { };
    this.clear = function () { };
    this.text = (text)?text:'';
    this.template = '{0}';
    this.children=new Array();
};

pvMapper.Renderer.HTML = function (tag, text) {
    this.__proto__ = new pvMapper.Renderer(text);
    this.template = '<{1} {2}>{0}</{1}>';
    this.getTemplateArgs = function (childrenRenderText) {
        var attributesHTML = '';
        if (this.attributes) {
            for (var a in this.attributes){
                attributesHTML += a + '="' + this.attributes[a] + '" ';
            }
        }
        return [this.text + childrenRenderText, this.tag, attributesHTML];
    };
    this.attributes = {};
    this.tag = (tag) ? tag : 'div';
};

pvMapper.Renderer.HTML.Table = function () {
    this.__proto__ = new pvMapper.Renderer.HTML('table');
};
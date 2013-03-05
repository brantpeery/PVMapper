var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var pvMapper;
(function (pvMapper) {
    var Renderer = (function () {
        function Renderer(text) {
            this.template = '{text}';
            this.children = new Array();
            this.text = (text) ? text : '';
        }
        Renderer.prototype.render = function () {
            var s = '';
            $.each(this.children, function (idx, val) {
                s += val.render();
            });
            var html = '';
            html = this.template.format(this.getTemplateArgs(s));
            return html;
        };
        Renderer.prototype.getTemplateArgs = function (childrenRenderText) {
            return {
                text: this.text + childrenRenderText
            };
        };
        Renderer.prototype.updateElement = function (element) {
        };
        Renderer.prototype.removeElement = function (element) {
        };
        Renderer.prototype.clear = function () {
        };
        return Renderer;
    })();
    pvMapper.Renderer = Renderer;    
    var HTML = (function (_super) {
        __extends(HTML, _super);
        function HTML(tag, text) {
                _super.call(this, text);
            _super.prototype.template = '<{tag} {attributes}>{text}</{tag}>';
            this.tag = (tag) ? tag : 'div';
        }
        HTML.prototype.getTemplateArgs = function (childrenRenderText) {
            var attributesHTML = '';
            if(this.attributes) {
                $.each(this.attributes, function (idx, val) {
                    attributesHTML += idx + '="' + val + '" ';
                });
            }
            return _super.prototype.text + childrenRenderText , this.tag , attributesHTML;
        };
        HTML.prototype.attr = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if(args.length == 2 && typeof (args[0]) === 'string') {
                this.attributes[args[0]] = args[1];
            } else {
                this.attributes = args[0];
            }
            return this;
        };
        return HTML;
    })(Renderer);
    pvMapper.HTML = HTML;    
    var Table = (function (_super) {
        __extends(Table, _super);
        function Table(tag) {
            if (typeof tag === "undefined") { tag = 'table'; }
                _super.call(this, tag, '');
        }
        Table.prototype.addRow = function () {
            var newRow = new Row();
            this.children.push(newRow);
            return newRow;
        };
        return Table;
    })(HTML);
    pvMapper.Table = Table;    
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row(tag) {
            if (typeof tag === "undefined") { tag = 'tr'; }
                _super.call(this, tag);
        }
        Row.prototype.addCell = function (args) {
            if(arguments[0] && arguments[0]['tag'] && (arguments[0]['tag'] == 'td' || arguments[0]['tag'] == 'th')) {
                this.children.push(arguments[0]);
                return arguments[0];
            } else {
                var text = (arguments[0]) ? arguments[0].toString() : '';
                var newCell = new HTML('td', text);
                this.children.push(newCell);
                return newCell;
            }
        };
        return Row;
    })(Table);
    pvMapper.Row = Row;    
})(pvMapper || (pvMapper = {}));

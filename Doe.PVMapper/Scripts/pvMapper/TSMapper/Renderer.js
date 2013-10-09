var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="common.ts" />
/// <reference path="../../jquery.d.ts" />
var pvMapper;
(function (pvMapper) {
    /**
    * Used to reder output either to screen or file. Uses a template for rendered output.
    */
    var Renderer = (function () {
        // Constructor
        function Renderer(text) {
            this.template = '{text}';
            this.children = new Array();
            this.text = (text) ? text : '';
        }
        /**
        * Renders the Renderer until it's rendered
        * TODO: what does this really do?
        */
        Renderer.prototype.render = function () {
            var s = '';
            $.each(this.children, function (idx, val) {
                s += val.render();
            });

            var html = '';
            html = this.template.format(this.getTemplateArgs(s));

            return html;
        };

        /*Returns a list of arguments that is meant to be used with the  template during the render */
        Renderer.prototype.getTemplateArgs = function (childrenRenderText) {
            return { text: this.text + childrenRenderText };
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

    //HTML Renderer class
    //Renders output to HTML using a template and named tag
    var HTML = (function (_super) {
        __extends(HTML, _super);
        function HTML(tag, text) {
            _super.call(this, text);
            this.template = '<{tag} {attributes}>{text}</{tag}>';
            this.tag = (tag) ? tag : 'div';
        }
        HTML.prototype.getTemplateArgs = function (childrenRenderText) {
            var attributesHTML = '';
            if (this.attributes) {
                $.each(this.attributes, function (idx, val) {
                    attributesHTML += idx + '="' + val + '" ';
                });
            }
            return this.text + childrenRenderText, this.tag, attributesHTML;
        };

        HTML.prototype.attr = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            if (args.length == 2 && typeof (args[0]) === 'string') {
                this.attributes[args[0]] = args[1];
            } else
                this.attributes = args[0];
            return this;
        };
        return HTML;
    })(Renderer);
    pvMapper.HTML = HTML;

    //class Table extends class HTML
    //Renders a table using the TABLE tag and can contain rows and columns
    var Table = (function (_super) {
        __extends(Table, _super);
        function Table(tag) {
            if (typeof tag === "undefined") { tag = 'table'; }
            _super.call(this, tag, '');
        }
        //Adds a row to the table. Returns the new empty row to be used by the calling code.
        Table.prototype.addRow = function () {
            var newRow = new Row();
            this.children.push(newRow);
            return newRow;
        };
        return Table;
    })(HTML);
    pvMapper.Table = Table;

    //class Row extends class Table
    //Renders an HTML row in a table object. Contains cells that will render with TD tag
    var Row = (function (_super) {
        __extends(Row, _super);
        function Row(tag) {
            if (typeof tag === "undefined") { tag = 'tr'; }
            _super.call(this, tag);
        }
        /*Adds a cell to the row. Passing in a cell will add that cell, passing in text will add a cell with text */
        Row.prototype.addCell = function (args) {
            if (arguments[0] && arguments[0]['tag'] && (arguments[0]['tag'] == 'td' || arguments[0]['tag'] == 'th')) {
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

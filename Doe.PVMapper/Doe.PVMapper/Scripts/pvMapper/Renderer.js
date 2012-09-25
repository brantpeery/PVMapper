/// <reference path="Common.js" />
//EXTENSIONS

(function (pvM) {
    pvMapper.Renderer = function (text) {
        this.render = function () {
            var s = '';
            for (c in this.children) {
                s += this.children[c].render();
            }

            var html = this.template.format(this.getTemplateArgs(s));
            return html;
        };

        //Returns a list of arguments that is meant to be used with the 
        //  template during the render
        this.getTemplateArgs = function (childrenRenderText) {
            return { text: this.text + childrenRenderText };
        };
        this.updateElement = function (element) { };
        this.removeElement = function (element) { };
        this.clear = function () { };
        this.text = (text) ? text : '';
        this.template = '{text}';
        this.children = new Array();
    };

    pvMapper.Renderer.HTML = function (tag, text) {
        this.__proto__ = new pvMapper.Renderer(text);
        this.template = '<{tag} {attributes}>{text}</{tag}>';
        this.getTemplateArgs = function (childrenRenderText) {
            var attributesHTML = '';
            if (this.attributes) {
                for (var a in this.attributes) {
                    attributesHTML += a + '="' + this.attributes[a] + '" ';
                }
            }
            return { text: this.text + childrenRenderText, tag: this.tag, attributes: attributesHTML };
        };
        this.attributes = {};
        this.tag = (tag) ? tag : 'div';
        this.attr = function () {
            if (arguments.length = 2 && arguments[0].isPrototypeOf(String)) {
                this.attributes[arguments[0]] = arguments[1];
            } else this.attributes = arguments[0];
            return this;
        }
    };

    pvMapper.Renderer.HTML.Table = function () {
        this.__proto__ = new pvMapper.Renderer.HTML('table');
        this.addRow = function () {
            var newRow = new pvMapper.Renderer.HTML.Table.Row();
            this.children.push(newRow);
            return newRow;
        }
    };

    pvMapper.Renderer.HTML.Table.Row = function () {
        this.__proto__ = new pvMapper.Renderer.HTML('tr');
        /*Adds a cell to the row. Passing in a cell will add that cell, passing in text will add a cell with text */
        this.addCell = function () {
            if (arguments[0] && arguments[0]['tag'] && (arguments[0]['tag'] == 'td' || arguments[0]['tag'] == 'th')) {
                this.children.push(arguments[0]);
                return arguments[0];
            } else {
                var text = (arguments[0]) ? arguments[0].toString() : '';
                var newCell = new pvMapper.Renderer.HTML('td', text);
                this.children.push(newCell);
                return newCell;
            }
        };
    };
})(pvMapper);

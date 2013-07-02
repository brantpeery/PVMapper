/// <reference path="common.ts" />

/// <reference path="../../jquery.d.ts" />

module pvMapper {

    /**
     * Used to reder output either to screen or file. Uses a template for rendered output.
     */
    export class Renderer {
        // Constructor
        constructor(text: string) {

            this.text = (text) ? text : '';
        }

        /**
         * Renders the Renderer until it's rendered
         * TODO: what does this really do?
         */
        public render(): string {
            var s: string = '';
            $.each(this.children, function (idx, val) {
                s += val.render();
            });

            var html: string = '';
            html = this.template.format(this.getTemplateArgs(s));

            return html;
        }

        /*Returns a list of arguments that is meant to be used with the  template during the render */

        public getTemplateArgs(childrenRenderText: string): Object {
            return { text: this.text + childrenRenderText };
        }

        private updateElement(element) { }
        private removeElement(element) { }
        private clear() { }
        public template: String = '{text}';
        public text: string;
        public children: Renderer[] = new Array<Renderer>(); //Renderer[]();
    }
    //HTML Renderer class
    //Renders output to HTML using a template and named tag
    export class HTML extends Renderer {
        public tag: string;
        private attributes: { [key: string]: (val: string) => string; };
        constructor(tag: string, text: string) {
            super(text);
            this.template = '<{tag} {attributes}>{text}</{tag}>';
            this.tag = (tag) ? tag : 'div';
        }

        public getTemplateArgs(childrenRenderText: string) {
            var attributesHTML: string = '';
            if (this.attributes) {
                $.each(this.attributes, function (idx, val) {
                    attributesHTML += idx + '="' + val + '" ';
                });
            }
            return this.text + childrenRenderText, this.tag, attributesHTML;
        }

        public attr(...args: any[]): any {
            if (args.length == 2 && typeof (args[0]) === 'string') {
                this.attributes[args[0]] = args[1];
            } else this.attributes = args[0];
            return this;
        }

    }

    //class Table extends class HTML
    //Renders a table using the TABLE tag and can contain rows and columns
    export class Table extends HTML {
        constructor(tag: string = 'table') {
            super(tag, '');
        }
        //Adds a row to the table. Returns the new empty row to be used by the calling code.
        public addRow() {
            var newRow: Row = new Row();
            this.children.push(newRow);
            return newRow;
        }

    }

    //class Row extends class Table
    //Renders an HTML row in a table object. Contains cells that will render with TD tag
    export class Row extends Table {
        constructor(tag: string = 'tr') {
            super(tag);
        }

        /*Adds a cell to the row. Passing in a cell will add that cell, passing in text will add a cell with text */
        public addCell(args: any): HTML {
            if (arguments[0] && arguments[0]['tag'] && (arguments[0]['tag'] == 'td' || arguments[0]['tag'] == 'th')) {
                this.children.push(arguments[0]);
                return arguments[0];
            }
            else {
                var text = (arguments[0]) ? arguments[0].toString() : '';
                var newCell: HTML = new HTML('td', text);
                this.children.push(newCell);
                return newCell;
            }
        }

    }

}

/// <reference path="common.ts" />
/// <reference path="../../jquery.d.ts" />

// Module
module pvMapper {

  // Class
  export class Renderer {
    // Constructor
    constructor (text: string) {

      this.text = (text) ? text : '';
    }

    public render(): string {
      var s: string = '';
      $.each(this.children, function (idx, val) {
        s += val.render();
      });

      var html: string = ''; 
      html = this.template.format(this.getTemplateArgs(s));
      return html;
    };
    
    /*Returns a list of arguments that is meant to be used with the  template during the render */
    
    public getTemplateArgs(childrenRenderText: string): string {
      return (this.text + childrenRenderText);
    }

    private updateElement(element) { }
    private removeElement(element) { }
    private clear() { }
    public template: String = '{text}';
    public text: string;
    public children: any[] = new any[]();
  }
  //HTML Renderer class
  export class HTML extends Renderer {
    public tag: string;
    private attributes: any = new any;

    constructor (tag: string, text: string) {
      super(text);
      super.template = '<{tag} {attributes}>{text}</{tag}>';
      this.tag = (tag) ? tag : 'div';
    }

    public getTemplateArgs(childrenRenderText : string) {
      var attributesHTML: string = '';
      if (this.attributes) {
        $.each(this.attributes, function (idx, val) {
          attributesHTML += idx + '="' + val + '" ';
        });
      }
      return super.text + childrenRenderText, this.tag, attributesHTML;
    } 

    public attr(...args:any[]):any {
      if (args.length == 2 && typeof(args[0]) === 'string') {
        this.attributes[args[0]] = args[1];
      } else this.attributes = args[0];
      return this;
    }

  }

  //class Table extends class HTML
  export class Table extends HTML {
    constructor (tag?:string = 'table') {
      super(tag,'');
    }
    public addRow() {
      var newRow: Row = new Row();
      this.children.push(newRow);
      return newRow;
    }

  }

  //class Row extends class Table

  export class Row extends Table {
    constructor(tag?:string = 'tr') {
      super(tag);
    }

     /*Adds a cell to the row. Passing in a cell will add that cell, passing in text will add a cell with text */
    public addCell(args:any) : HTML {
      if (arguments[0] && arguments[0]['tag'] && (arguments[0]['tag'] == 'td' || arguments[0]['tag'] =='th')) {
        this.children.push(arguments[0]);
        return arguments[0];
      }
      else {
        var text = (arguments[0]) ? arguments[0].toString() : '';
        var newCell : HTML = new HTML('td', text);
        this.children.push(newCell);
        return newCell;
      }
    }

  }

}

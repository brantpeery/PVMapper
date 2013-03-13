
//just in case browser do not support array indexOf function, 
//search for object in array by delegate function
if ( !Array.prototype.indexOfObject ) {
  Array.prototype.indexOfObject = function (fn/*, from*/) {
    var len = this.length;
    if (!fn || typeof (fn) != 'function') return -2;  //no function passed in.

    var from = Number(arguments[1]) || 0;  //second optional parameter is expected to be the start index, default to 0.
    from = ( from < 0 ) ? 0 : (from>len) ? len : from;

    for ( ; from < len; from++ ) {
      if (fn(this[from])) return from;
    }
    return -1;
  };
}

Ext.define( 'MainApp.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',
    items: [{
        xtype: 'panel',
        layout: 'border',
        items: [{
            id: 'header',
            region: 'north',
            xtype: 'panel',
            height: 65,
            items: [{
                xtype: 'panel',
                contentEl: 'Header',
            }]
        },
        {
            collapsible: false,
            xtype: 'panel',
            layout: 'border',
            id: 'mainbody',
            region: 'center',
            margins: '0',
            padding: '0',
            items: [{
                collapsible: false,
                xtype: 'toolbar',
                id: 'maintoolbar',
                region: 'north',
                margins: '0',
                padding: '0',
                items: [
                     {
                         // xtype: 'button', // default for Toolbars
                         text: 'Button'
                     },
                    {
                        xtype: 'splitbutton',
                        text: 'Split Button'
                    }
                ]
            },
            {
              collapsible: false,
              xtype: 'toolbar',
              id: 'maintaskbar',
              region: 'south',
              margins: '0',
              padding: '0',
              items: [ ],
              addButton: function ( winObj ) {
                //if ( this.items.items.indexOfObject( function ( val ) { return val.text === winObj.title; } ) >= 0 ) return;
                var abtn = Ext.create( 'Ext.button.Button', {
                  text: winObj.title,
                  associate: winObj,
                  listeners:{ 
                    click: function() {
                      if ( this.associate && this.associate.type == 'Window' && typeof ( this.associate.viewState ) != 'undefined' ) {
                          switch (this.associate.viewState) {
                              case Ext.view.ViewState.MINIMIZED:
                                  this.associate.show();
                                  this.associate.viewState = Ext.view.ViewState.NORMAL;
                                  break;
                              case Ext.view.ViewState.NORMAL:
                                  this.associate.hide();
                                  this.associate.viewState = Ext.view.ViewState.HIDDEN;
                                  break;
                              case Ext.view.ViewState.HIDDEN:
                                  this.associate.show();
                                  this.associate.viewState = Ext.view.ViewState.NORMAL;
                                  break;
                              default:
                                  this.associate.minimize();
                                  this.associate.viewState = Ext.view.ViewState.MINIMIZED;
                          }
                      }
                    }
                  }
                } );
                this.items.add( abtn );
                this.doLayout();
              },
              removeButton: function ( winObj ) {
                var idx = this.items.items.indexOfObject( function ( value ) { return ( value.text === winObj.title ); } );
                if (idx >= 0) {
                  var btn = this.items.items[idx];
                  //this.items.items.splice( idx, 1 );
                  this.items.remove(btn);
                  this.doLayout();
                }
              },
              updateButtonText: function (oldText, newText) {
                var idx = this.items.items.indexOfObject(function (value) { return (value.text === oldText); });
                if (idx >= 0) {
                  this.items.items[idx].setText(newText);
                }
              }
            },
            {
                collapsible: false,
                xtype: 'panel',
                id: 'maincontent',
                layout:'fit',
                region: 'center',
                margins: '0',
                padding: '5,5,5,5',
                contentEl: 'Content',
                items: [],
                weight: .7
            }]
        }],
    }]
});

Ext.define( 'MainApp.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: [
        'Ext.ux.statusbar.StatusBar', // <-- apparently this isn't included in ext-all.js
    ],
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
                    { text: 'Sites', id: 'maintoolbar-sitessmenu', menu: { items: [] } },
                    '-',
                    '-',
                    { text: 'Scoreboard Tools', id: 'maintoolbar-scoreboardtoolsmenu', menu: { items: [] } },
                    '-',
                    { text: 'Reports', id: 'maintoolbar-reportsmenu', menu: { items: [] } },
                    '->',
                    { text: 'Related Links', id: 'maintoolbar-linksmenu', menu: { items: [] } },
                ]
            },
            {
              collapsible: false,
              xtype:  'statusbar', //'toolbar',
              id: 'maintaskbar',
              statusAlign: 'right',
              region: 'south',
              margins: '0',
              padding: '0',
              items: [ ],
              addButton: function (winObj) {
                //if the button exists, do nothing.
                //if ( this.items.items.indexOfObject( function ( val ) { return val.text === winObj.title; } ) >= 0 ) return; 
                var abtn = Ext.create( 'Ext.button.Button', {
                  text: winObj.title,
                  taskbar_winObj: winObj,
                  associate: winObj,
                  listeners:{ 
                    click: function() {
                      if ( this.associate && this.associate.type === 'Window' && typeof ( this.associate.viewState ) !== 'undefined' ) {
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
                this.items.insert( this.items.length - 2, abtn ); // -2 for status object and spacer object
                this.doLayout();
              },
              removeButton: function ( winObj ) {
                var matchingButtons = this.items.items.filter(function (value) { return (value.taskbar_winObj === winObj); });
                if (matchingButtons && matchingButtons.length >= 0) {
                  //remove from the  DOM, not just remove the button.
                  this.remove(matchingButtons[0]);
                }
              },
              updateButtonText: function (oldText, newText) {
                var matchingButtons = this.items.items.filter(function (value) { return (value.taskbar_winObj === winObj); });
                if (matchingButtons && matchingButtons.length >= 0) {
                  matchingButtons[0].setText(newText);
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
                weight: 0.7
            }]
        }],
    }]
});


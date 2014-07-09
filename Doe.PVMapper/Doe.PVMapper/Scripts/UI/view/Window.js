Ext.view.ViewState = {
  NORMAL: 'ViewState_Normal',
  MINIMIZED: 'ViewState_Minimized',
  MAXIMIZED: 'ViewState_Maximized',
  HIDDEN: 'ViewState_Hidden',
  COLLAPSED: 'ViewState_Collapsed'
}

Ext.define('MainApp.view.Window', {
  extend: 'Ext.window.Window',
  //uses: 'MainApp.view.Viewport',
  alias: "pvWindow",
  layout: 'fit',
  type: 'Window',
  //title: "Super fun title",
  taskBar: null,
  //constrain: true,
  renderTo: 'maincontent-body',
  autoShow: false,
  collapseMode: 'header',
  minimizable: true,
  collapsible: true,
  bodyStyle: 'opacity: 1;',
  titleCollapse: false,  //set to false to prevent double clicking on title collapse.
  constrain: true,
  viewState: Ext.view.ViewState.NORMAL,
  collapse: function () {
    this.callParent(arguments);
    var w = this.getHeader().titleCmp.textEl.getWidth();
    w = w < 120 ? 120 : w;
    this.setWidth(w);
    this.viewState = Ext.view.ViewState.COLLAPSED;
  },
  expand: function () {
    this.callParent(arguments);
    this.viewState = Ext.view.ViewState.NORMAL;
  },
  listeners: {
    //beforerender: function (win, op) {
    //  var taskBar = Ext.getCmp('maintaskbar');
    //},
    boxready: function (win, width, height, eOpts) { //Note: this event fires only once (for each new window)
      var taskBar = Ext.getCmp('maintaskbar');
      // check to see if the window exists.  Show if it is, otherwise add new button.
      if (taskBar) {
        var aWin = null;
        for (var i = 0; i < taskBar.items.length; i++) {
          if (typeof (taskBar.items.get(i).associate) != 'undefined') {
            aWin = taskBar.items.get(i).associate;
            if (win == aWin)
              break;
            else aWin = null;
          }
        }

        if (aWin != null)
          aWin.viewState = Ext.view.ViewState.NORMAL;
        else
          taskBar.addButton(aWin);
        return true;
      }
    },
    beforeclose: function(win, eOpts) {
      var taskBar = Ext.getCmp('maintaskbar');
      if (taskBar) {
        if (!(this.closeAction == 'hide'))
          taskBar.removeButton(win);
        else 
          this.viewState = Ext.view.ViewState.MINIMIZED;
      }
      return true;
    },
    beforeshow: function(win, op) {
      var taskBar = Ext.getCmp('maintaskbar');
      // check to see if the window exists.  Show if it is, otherwise add new button.
      if (taskBar) {
        var aWin = null;
        for(var i=0;i<taskBar.items.length;i++) {
          if (typeof (taskBar.items.getAt(i).associate) != 'undefined') {
            aWin = taskBar.items.getAt(i).associate;
            if (win == aWin)
              break;
            else aWin = null;
          }
        }

        if (aWin != null)
          aWin.viewState = Ext.view.ViewState.NORMAL;
        else
          taskBar.addButton(win);
      }
      return true;
    },
    beforedestroy: function (win, op) {
      var taskBar = Ext.getCmp('maintaskbar');
      if (taskBar) 
        taskBar.removeButton(win);
      return true;
    },
    minimize: function (win, op) {
      this.viewState = Ext.view.ViewState.MINIMIZED;
      this.hide();
    },
    titlechange: function (p, newTitle, oldTitle, ops) {
      var taskBar = Ext.getCmp('maintaskbar');
      if (taskBar)
        taskBar.updateButtonText(oldTitle, newTitle);
    }/*,
    scope: this*/
  }
});

var WindowManager;
(function (wnMgr) {

  wnMgr.createWindow = function (className, configObj, allowDuplicate) {
    className = (typeof(className) == "string") ? className : ("MainApp.view.Window");
    configObj = (configObj === undefined || configObj == null) ? {} : configObj;
    var aTitle = (configObj.title) ? configObj.title : "Untitled Window";
    allowDuplicate = (allowDuplicate==true);

    var taskBar = Ext.getCmp('maintaskbar');
    // check to see if the window exists.  Show if it is, otherwise add new button.
    if (taskBar) {
      var aWin = null;
      if (!allowDuplicate) {
        for (var i = 0; i < taskBar.items.length; i++) {
          if (typeof (taskBar.items.getAt(i).associate) != 'undefined') {
            aWin = taskBar.items.getAt(i).associate;
            if (aTitle == aWin.title)
              break;
            else aWin = null;
          }
        }
      }

      if (aWin != null) {
        //if ((aWin.ViewState === Ext.view.ViewState.MINIMIZED) || (aWin.ViewState === Ext.view.ViewState.HIDDEN) || (aWin.ViewState === Ext.view.ViewState.COLLAPSED)) {
        //  aWin.viewState = Ext.view.ViewState.NORMAL;
        //}

        if (aWin.viewState == Ext.view.ViewState.HIDDEN) aWin.show();
        if (aWin.viewState == Ext.view.ViewState.MINIMIZED) aWin.viewState = Ext.view.ViewState.NORMAL;
        if (aWin.viewState == Ext.view.ViewState.COLLAPSED) aWin.expand();
        return aWin;
      }
      else {
          aWin = Ext.create(className, configObj);
          if (aWin.title == undefined && configObj.title == undefined) {
              aWin.setTitle(aTitle);
          }
        return aWin;
      }
    }
  }
})(WindowManager || (WindowManager = {}));



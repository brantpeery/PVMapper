/*!
* jQuery UI Dialog Minimize Maximize Extention 0.01
*
* Copyright 2012, Brant Peery INL
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* No documentation
*
* Depends:
*	jquery.ui.dialog 1.8.21
*/
(function ($) {
    $.extend($.ui.dialog.prototype, {
        minimizedPosition: { left: null, top: null, height: null },
        maximizedPosition: { left: null, top: null, height: null },
        minimizedClassName: "dialogMinimized",
        handles: function () { return this.widget().find('.ui-resizable-s, .ui-resizable-sw, .ui-resizable-se, .ui-resizable-n, .ui-resizable-ne, .ui-resizable-nw').hide(); },
        _restorePosition: false,

        restore: function (options) {
            //Save the minimized position
            this.minimizedPosition.left = this.uiDialog.position().left;
            this.minimizedPosition.top = this.uiDialog.position().top;
            this.minimizedPosition.height = this.uiDialog.height();

            if (this.isMinimized()) { //Make sure that we are only restoring if it was already minimized
                this.uiDialog.animate({ height: this.maximizedPosition.height }, 1000);
                this.handles().show();   //Show the sizing handle again
                this.element.removeClass(this.minimizedClassName);           //Remove the minimized class
                this._restorePosition && this.uiDialog.animate({ top: this.maximizedPosition.top, left: this.maximizedPosition.left }, 1000);
            }
            return this;
        },

        minimize: function () {
            //Save maximized positions
            this.maximizedPosition.top = this.uiDialog.position().top;
            this.maximizedPosition.left = this.uiDialog.position().left;
            this.maximizedPosition.height = this.uiDialog.height();

            //Set the height explicitly to overcome a bug in the ui.dialog that will resize
            //the content if it is set to auto when the titlebar is moved when minimized
            this._setOption("height", this.uiDialog.height());

            this.handles().hide();      //Hide the sizing handle
            size = this.uiDialogTitlebar.outerHeight(); //Set the content box to the size of the title
            this.uiDialog.animate({ height: size }, 1000);

            //Used the saved positions or just use the current position
            x = this.minimizedPosition.left || this.uiDialog.position().left;
            y = this.minimizedPosition.top || this.uiDialog.position().top;

            this._restorePosition && this.uiDialog.animate({ top: y, left: x }, 1000);     //Animate the position change
            this.element.addClass(this.minimizedClassName);       //Add the minimized class

            return this;
        },

        isMinimized: function () {
            return this.element.hasClass(this.minimizedClassName);
        },

        restorePosition: function (option) {
            if (option != null) {
                if (option === true || option === false) {
                    this.restorePosition = option;
                }
            }
            return option;
        }
    });

    //Attach the events by overriding the _init function
    var _init = $.ui.dialog.prototype._init; //Super class _init function

    $.ui.dialog.prototype._init = function () {
        var self = this; //Get a reference to this object for the events

        _init.apply(this, arguments); //Run the super's _init

        uiTitleBar = this.uiDialogTitlebar; //Get a reference to the title bar
        uiTitleBar.dblclick(function (ui, event) {
            if (self.isMinimized()) {
                self.restore();
            } else {
                self.minimize();
            }
        });
    };
})(jQuery);
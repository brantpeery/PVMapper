/*!
* jQuery UI Tabs Popout Extention 0.01
*
* Copyright 2012, Brant Peery INL
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*
* No documentation
* Notes: Pops the tabs' content div out of the tabs control. Leavs the div in place but removes the tabs' link and all the classes added by $.tabs().
*        Returns the div that was the tab's content panel
*
* Depends:
*	jquery.ui.tabs 1.8.21
*/

$.extend($.ui.tabs.prototype, {
    popout: function (index) {
        index = this._getIndex(index);
        var o = this.options,
			$li = this.lis.eq(index).remove(),
			$panel = this.panels.eq(index)
                .removeClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide ui-tabs-selected ui-state-active');

        // If selected tab was removed focus tab to the right or
        // in case the last tab was removed the tab to the left.
        if ($li.hasClass("ui-tabs-selected") && this.anchors.length > 1) {
            this.select(index + (index + 1 < this.anchors.length ? 1 : -1));
        }

        o.disabled = $.map(
			$.grep(o.disabled, function (n, i) {
			    return n != index;
			}),
			function (n, i) {
			    return n >= index ? --n : n;
			});

        this._tabify();
        
        this._trigger("remove", null, this._ui($li.find("a")[0], $panel[0]));
        return $panel;
    }
});
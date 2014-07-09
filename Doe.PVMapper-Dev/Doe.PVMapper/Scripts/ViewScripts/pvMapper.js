// define console, in case the browser won't (like IE9)
if (typeof console === 'undefined') {
    console = {};
    console.log = function () { };
    console.error = function () { };
    console.assert = function () { };
}

// define Array.indexOf(), in case the browser won't (like IE8)
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
        'use strict';
        if (this == null) {
            throw new TypeError();
        }
        var n, k, t = Object(this),
            len = t.length >>> 0;

        if (len === 0) {
            return -1;
        }
        n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0) ; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

// define Array.forEach(), in case the browser won't (like IE8)
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        'use strict';
        var i, len;
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
       } 
    };
}

// define Array.map(), in case the browser won't (like IE8)
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}

// This is a globally defined object that represents the client-side behaviors available through the PVMapper framework.
//if (console) console.log("Loading pvMapper object");
if ( typeof pvMapper == 'undefined' ) {
  this.pvMapper = {};
}

(function (pvM) {
    var displayMessage_container;
    var displayMessage_currentMessage = null;
    $.extend(pvM, { //Extend the existing pvMapper object
        self: this,
        
        // The developer needs to be able to add and remove buttons to a toolbar.
        mapToolbar: null,
        tabs: null,

        siteLayer: null,

        // todo: update to use secret and token.
        //postScore: function (score, rank, siteId, toolId) {
        //    $.post("/api/SiteScore", { score: score, rank: rank, siteId: siteId, toolId: toolId },
        //       function (data) {
        //           // refresh scoreboard.
        //           Ext.getCmp('scoreboard-grid-id').store.load();
        //           Ext.getCmp('scoreboard-grid-id').getView().refresh();
        //       });
        //},
        getSite: function (siteId) {
            return $.get("/api/ProjectSite/" + siteId);
        },
        postSite: function (name, description, polygonGeometry) {
            return $.post("/api/ProjectSite", {
                    name: name,
                    description: description,
                    isActive: true,
                    polygonGeometry: polygonGeometry
                }).done(function () {
                    pvMapper.displayMessage("The new site was saved to the database.", "success");
                }).fail(function () {
                    pvMapper.displayMessage("Unable to save the new site. There was an error communicating with the database.", "warning");
                });
        },
        updateSite: function (siteId, name, description, polygonGeometry) {
            //Only send the stuff that was passed into this function.
            var data = {isActive: true};
            if (name) { data.name = name; }
            if (description !== null) { data.description = description; }
            if (polygonGeometry) { data.polygonGeometry = polygonGeometry; }

            return $.ajax("/api/ProjectSite/" + siteId, {
                    data: data, type: "PUT"
                }).done(function () {
                    pvMapper.displayMessage("The site changes were saved", "success");
                }).fail(function () {
                    pvMapper.displayMessage("Unable to save the changes to the site. There was an error communicating with the database.", "warning");
                });
        },
        //Deletes a site from the datastore
        deleteSite: function (siteId) {
            return $.ajax("/api/ProjectSite/" + siteId, {
                    data: { Id: siteId }, type: "DELETE"
                }).done(function () {
                    pvMapper.displayMessage("The site was deleted from the database.", "success");
                }).fail(function () {
                    pvMapper.displayMessage("Unable to delete the site. There was an error communicating with the database.", "warning");
                });
        },

        //Deletes all sites from the datastore
        deleteAllSites: function() {
            return $.ajax("/api/ProjectSite/", {
                    data: {}, type: "DELETE"
                }).done(function () {
                    pvMapper.displayMessage("All sites were deleted from the database.", "success");
                }).fail(function () {
                    pvMapper.displayMessage("Unable to delete the sites. There was an error communicating with the database.", "warning");
                });
        },

        getSiteLayer: function () {
            return this.siteLayer;
        },

        //Used for displaying small messages to the user. Things like help tips or notifications. Best for 1 to 2 paragraph messages
        //The type parameter will simply be an additional class on the message box.
        displayMessage: function (msg, type) {
            //$.jGrowl(msg, { theme: type, life: 7000 });
            if (console && console.log) console.log(type + "\t" + msg);

            if (!displayMessage_container) {
                displayMessage_container = Ext.core.DomHelper.insertFirst(document.body, { id: 'msg-div' }, true);
            }

            if (displayMessage_currentMessage !== msg) { // don't show multiple sequential copies of the same message (it's annoying).
                displayMessage_currentMessage = msg;
                //var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
                var m = Ext.core.DomHelper.append(displayMessage_container, '<div class="msg"><h3>' + type + '</h3><p>' + msg + '</p></div>', true);
                m.hide();
                m.slideIn('t').ghost("t", { delay: 2500, remove: true, 
                    callback: function () { if (displayMessage_currentMessage === msg) displayMessage_currentMessage = null; }
                });
            }
        },

    } ); //End the $.extend

} )(pvMapper );



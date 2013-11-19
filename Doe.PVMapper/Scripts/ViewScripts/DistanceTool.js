
//===================These should be moved to seperate file if we want to keep it=============================================

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2013-10-21
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  || (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  || (function (view) {
      "use strict";
      var
                doc = view.document
                // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
              , get_URL = function () {
                  return view.URL || view.webkitURL || view;
              }
              , URL = view.URL || view.webkitURL || view
              , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
              , can_use_save_link = !view.externalHost && "download" in save_link
              , click = function (node) {
                  var event = doc.createEvent("MouseEvents");
                  event.initMouseEvent(
                          "click", true, false, view, 0, 0, 0, 0, 0
                          , false, false, false, false, 0, null
                  );
                  node.dispatchEvent(event);
              }
              , webkit_req_fs = view.webkitRequestFileSystem
              , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
              , throw_outside = function (ex) {
                  (view.setImmediate || view.setTimeout)(function () {
                      throw ex;
                  }, 0);
              }
              , force_saveable_type = "application/octet-stream"
              , fs_min_size = 0
              , deletion_queue = []
              , process_deletion_queue = function () {
                  var i = deletion_queue.length;
                  while (i--) {
                      var file = deletion_queue[i];
                      if (typeof file === "string") { // file is an object URL
                          URL.revokeObjectURL(file);
                      } else { // file is a File
                          file.remove();
                      }
                  }
                  deletion_queue.length = 0; // clear queue
              }
              , dispatch = function (filesaver, event_types, event) {
                  event_types = [].concat(event_types);
                  var i = event_types.length;
                  while (i--) {
                      var listener = filesaver["on" + event_types[i]];
                      if (typeof listener === "function") {
                          try {
                              listener.call(filesaver, event || filesaver);
                          } catch (ex) {
                              throw_outside(ex);
                          }
                      }
                  }
              }
              , FileSaver = function (blob, name) {
                  // First try a.download, then web filesystem, then object URLs
                  var
                            filesaver = this
                          , type = blob.type
                          , blob_changed = false
                          , object_url
                          , target_view
                          , get_object_url = function () {
                              var object_url = get_URL().createObjectURL(blob);
                              deletion_queue.push(object_url);
                              return object_url;
                          }
                          , dispatch_all = function () {
                              dispatch(filesaver, "writestart progress write writeend".split(" "));
                          }
                          // on any filesys errors revert to saving with object URLs
                          , fs_error = function () {
                              // don't create more object URLs than needed
                              if (blob_changed || !object_url) {
                                  object_url = get_object_url(blob);
                              }
                              if (target_view) {
                                  target_view.location.href = object_url;
                              } else {
                                  window.open(object_url, "_blank");
                              }
                              filesaver.readyState = filesaver.DONE;
                              dispatch_all();
                          }
                          , abortable = function (func) {
                              return function () {
                                  if (filesaver.readyState !== filesaver.DONE) {
                                      return func.apply(this, arguments);
                                  }
                              };
                          }
                          , create_if_not_found = { create: true, exclusive: false }
                          , slice
                  ;
                  filesaver.readyState = filesaver.INIT;
                  if (!name) {
                      name = "download";
                  }
                  if (can_use_save_link) {
                      object_url = get_object_url(blob);
                      // FF for Android has a nasty garbage collection mechanism
                      // that turns all objects that are not pure javascript into 'deadObject'
                      // this means `doc` and `save_link` are unusable and need to be recreated
                      // `view` is usable though:
                      doc = view.document;
                      save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
                      save_link.href = object_url;
                      save_link.download = name;
                      var event = doc.createEvent("MouseEvents");
                      event.initMouseEvent(
                              "click", true, false, view, 0, 0, 0, 0, 0
                              , false, false, false, false, 0, null
                      );
                      save_link.dispatchEvent(event);
                      filesaver.readyState = filesaver.DONE;
                      dispatch_all();
                      return;
                  }
                  // Object and web filesystem URLs have a problem saving in Google Chrome when
                  // viewed in a tab, so I force save with application/octet-stream
                  // http://code.google.com/p/chromium/issues/detail?id=91158
                  if (view.chrome && type && type !== force_saveable_type) {
                      slice = blob.slice || blob.webkitSlice;
                      blob = slice.call(blob, 0, blob.size, force_saveable_type);
                      blob_changed = true;
                  }
                  // Since I can't be sure that the guessed media type will trigger a download
                  // in WebKit, I append .download to the filename.
                  // https://bugs.webkit.org/show_bug.cgi?id=65440
                  if (webkit_req_fs && name !== "download") {
                      name += ".download";
                  }
                  if (type === force_saveable_type || webkit_req_fs) {
                      target_view = view;
                  }
                  if (!req_fs) {
                      fs_error();
                      return;
                  }
                  fs_min_size += blob.size;
                  req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                      fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                          var save = function () {
                              dir.getFile(name, create_if_not_found, abortable(function (file) {
                                  file.createWriter(abortable(function (writer) {
                                      writer.onwriteend = function (event) {
                                          target_view.location.href = file.toURL();
                                          deletion_queue.push(file);
                                          filesaver.readyState = filesaver.DONE;
                                          dispatch(filesaver, "writeend", event);
                                      };
                                      writer.onerror = function () {
                                          var error = writer.error;
                                          if (error.code !== error.ABORT_ERR) {
                                              fs_error();
                                          }
                                      };
                                      "writestart progress write abort".split(" ").forEach(function (event) {
                                          writer["on" + event] = filesaver["on" + event];
                                      });
                                      writer.write(blob);
                                      filesaver.abort = function () {
                                          writer.abort();
                                          filesaver.readyState = filesaver.DONE;
                                      };
                                      filesaver.readyState = filesaver.WRITING;
                                  }), fs_error);
                              }), fs_error);
                          };
                          dir.getFile(name, { create: false }, abortable(function (file) {
                              // delete file if it already exists
                              file.remove();
                              save();
                          }), abortable(function (ex) {
                              if (ex.code === ex.NOT_FOUND_ERR) {
                                  save();
                              } else {
                                  fs_error();
                              }
                          }));
                      }), fs_error);
                  }), fs_error);
              }
              , FS_proto = FileSaver.prototype
              , saveAs = function (blob, name) {
                  return new FileSaver(blob, name);
              }
      ;
      FS_proto.abort = function () {
          var filesaver = this;
          filesaver.readyState = filesaver.DONE;
          dispatch(filesaver, "abort");
      };
      FS_proto.readyState = FS_proto.INIT = 0;
      FS_proto.WRITING = 1;
      FS_proto.DONE = 2;

      FS_proto.error =
      FS_proto.onwritestart =
      FS_proto.onprogress =
      FS_proto.onwrite =
      FS_proto.onabort =
      FS_proto.onerror =
      FS_proto.onwriteend =
              null;

      view.addEventListener("unload", process_deletion_queue, false);
      return saveAs;
  }(this.self || this.window || this.content));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== 'undefined') module.exports = saveAs;


/* Blob.js
 * A Blob implementation.
 * 2013-06-20
 * 
 * By Eli Grey, http://eligrey.com
 * By Devin Samarin, https://github.com/eboyjr
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self, unescape */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */
//Blob = undefined;
if (!(typeof CustomBlob === "function" || typeof CustomBlob === "object") || typeof URL === "undefined")
    if ((typeof CustomBlob === "function" || typeof CustomBlob === "object") && typeof webkitURL !== "undefined") self.URL = webkitURL;
    else var CustomBlob = (function (view) {
        "use strict";

        var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || view.MSBlobBuilder || (function (view) {
            var
                      get_class = function (object) {
                          return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
                      }
                    , FakeBlobBuilder = function BlobBuilder() {
                        this.data = [];
                    }
                    , FakeBlob = function CustomBlob(data, type, encoding) {
                        this.data = data;
                        this.size = data.length;
                        this.type = type;
                        this.encoding = encoding;
                    }
                    , FBB_proto = FakeBlobBuilder.prototype
                    , FB_proto = FakeBlob.prototype
                    , FileReaderSync = view.FileReaderSync
                    , FileException = function (type) {
                        this.code = this[this.name = type];
                    }
                    , file_ex_codes = (
                              "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
                            + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
                    ).split(" ")
                    , file_ex_code = file_ex_codes.length
                    , real_URL = view.URL || view.webkitURL || view
                    , real_create_object_URL = real_URL.createObjectURL
                    , real_revoke_object_URL = real_URL.revokeObjectURL
                    , URL = real_URL
                    , btoa = view.btoa
                    , atob = view.atob

                    , ArrayBuffer = view.ArrayBuffer
                    , Uint8Array = view.Uint8Array
            ;
            FakeBlob.fake = FB_proto.fake = true;
            while (file_ex_code--) {
                FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
            }
            if (!real_URL.createObjectURL) {
                URL = view.URL = {};
            }
            URL.createObjectURL = function (blob) {
                var
                          type = blob.type
                        , data_URI_header
                ;
                if (type === null) {
                    type = "application/octet-stream";
                }
                if (blob instanceof FakeBlob) {
                    data_URI_header = "data:" + type;
                    if (blob.encoding === "base64") {
                        return data_URI_header + ";base64," + blob.data;
                    } else if (blob.encoding === "URI") {
                        return data_URI_header + "," + decodeURIComponent(blob.data);
                    } if (btoa) {
                        return data_URI_header + ";base64," + btoa(blob.data);
                    } else {
                        return data_URI_header + "," + encodeURIComponent(blob.data);
                    }
                } else if (real_create_object_URL) {
                    return real_create_object_URL.call(real_URL, blob);
                }
            };
            URL.revokeObjectURL = function (object_URL) {
                if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
                    real_revoke_object_URL.call(real_URL, object_URL);
                }
            };
            FBB_proto.append = function (data/*, endings*/) {
                var bb = this.data;
                // decode data to a binary string
                if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                    var
                              str = ""
                            , buf = new Uint8Array(data)
                            , i = 0
                            , buf_len = buf.length
                    ;
                    for (; i < buf_len; i++) {
                        str += String.fromCharCode(buf[i]);
                    }
                    bb.push(str);
                } else if (get_class(data) === "CustomBlob" || get_class(data) === "File") {
                    if (FileReaderSync) {
                        var fr = new FileReaderSync;
                        bb.push(fr.readAsBinaryString(data));
                    } else {
                        // async FileReader won't work as BlobBuilder is sync
                        throw new FileException("NOT_READABLE_ERR");
                    }
                } else if (data instanceof FakeBlob) {
                    if (data.encoding === "base64" && atob) {
                        bb.push(atob(data.data));
                    } else if (data.encoding === "URI") {
                        bb.push(decodeURIComponent(data.data));
                    } else if (data.encoding === "raw") {
                        bb.push(data.data);
                    }
                } else {
                    if (typeof data !== "string") {
                        data += ""; // convert unsupported types to strings
                    }
                    // decode UTF-16 to binary string
                    bb.push(unescape(encodeURIComponent(data)));
                }
            };
            FBB_proto.getBlob = function (type) {
                if (!arguments.length) {
                    type = null;
                }
                return new FakeBlob(this.data.join(""), type, "raw");
            };
            FBB_proto.toString = function () {
                return "[object BlobBuilder]";
            };
            FB_proto.slice = function (start, end, type) {
                var args = arguments.length;
                if (args < 3) {
                    type = null;
                }
                return new FakeBlob(
                          this.data.slice(start, args > 1 ? end : this.data.length)
                        , type
                        , this.encoding
                );
            };
            FB_proto.toString = function () {
                return "[object CustomBlob]";
            };
            return FakeBlobBuilder;
        }(view));

        return function CustomBlob(blobParts, options) {
            var type = options ? (options.type || "") : "";
            var builder = new BlobBuilder();
            if (blobParts) {
                for (var i = 0, len = blobParts.length; i < len; i++) {
                    builder.append(blobParts[i]);
                }
            }
            return builder.getBlob(type);
        };
    }(self));

//===========================================================


pvMapper.onReady(function () {
    var control = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
        eventListeners: {
            measure: function (evt) {
                Ext.MessageBox.alert('Measure Distance', "The measurement was " + evt.measure.toFixed(2) + " " + evt.units);
                //alert("The measurement was " + evt.measure.toFixed(2) + " " + evt.units);
            }
        }
    });

    pvMapper.map.addControl(control);

    var distanceBtn = new Ext.Button({
        text: 'Measure Distance',
        enableToggle: true,
        //displaySystemUnits: ["mi","ft"],
        toggleGroup: "editToolbox",
        toggleHandler: function (buttonObj, eventObj) {
            if (buttonObj.pressed) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    });

    pvMapper.mapToolbar.add(distanceBtn);


    // add a button on the tool bar to launch a file picker to load local KML file.
    //first, create an input with type='file' and add it to the body of the page.
    var fileDialogBox = document.createElement('input');
    fileDialogBox.type = 'file';
    fileDialogBox.style = 'display:none';
    fileDialogBox.accept = "application/vnd.google-earth.kml+xml"; //only support in chrome and IE.  FF doesn't work.

    document.body.appendChild(fileDialogBox);

    //listen to a file pick selection <OK> button on the file dialog box clicked.
    function handleCustomKML(evt) {
        var afile = evt.target.files[0];
        if (afile.type !== "application/vnd.google-earth.kml+xml") {
            Ext.MessageBox.alert("File type unknown.", "The file [" + afile.name + "] is not a KML format.");
            return;
        }

        //we probably don't want to load hug file.  Limit is about 2MB.
        if (afile.size > 2000000) {
            Ext.MessageBox.confirm("File too big", "The file [" + afile.name + " with size: " + afile.size.toString() + "] is larger then 2000000 bytes (2 MB), do you want to continue loading?",
                function (btn) {
                    if (btn === 'yes') {
                        var localLayer = new INLModules.LocalLayerModule();
                        isFileRead = localLayer.readTextFile(evt.target.files[0]);
                    }
                });
        } else {
            var localLayer = new INLModules.LocalLayerModule();
            isFileRead = localLayer.readTextFile(evt.target.files[0]);
        }
    }


    //create the actual button and put on the tool bar.
    var customTool = new Ext.Button({
        text: 'Add KML Distance Score',
        enabledToggle: false,
        handler: function () {
            fileDialogBox.removeEventListener('change', handleSiteKML, false);  //disable the site KML event.
            fileDialogBox.addEventListener('change', handleCustomKML, false);  // enable the distance KML event.
            fileDialogBox.click();
        }
    });
    pvMapper.mapToolbar.add(customTool);


    function handleSiteKML(evt) {
        var afile = evt.target.files[0];
        if (afile.type !== "application/vnd.google-earth.kml+xml") {
            Ext.MessageBox.alert("File type unknown.", "The file [" + afile.name + "] is not a KML format.");
            return;
        }

        //we probably don't want to load hug file.  Limit is about 2MB.
        if (afile.size > 2000000) {
            Ext.MessageBox.confirm("File too big", "The file [" + afile.name + " with size: " + afile.size.toString() + "] is larger then 2000000 bytes (2 MB), do you want to continue loading?",
                function (btn) {
                    if (btn === 'yes') {
                        importLocalSite(afile);
                    }
                });
        } else {
            importLocalSite(afile);
        }
    }

    function importLocalSite(kmlFile) {
        var reader = new FileReader();

        reader.readAsText(kmlFile);
        reader.onload = function (evt) {
            var kml_projection = new OpenLayers.Projection("EPSG:4326");
            var map_projection = new OpenLayers.Projection("EPSG:3857");

            //var osm: OpenLayers.OSM = new OpenLayers.Layer.OSM();
            var kmlFormat = new OpenLayers.Format.KML({
                extractStyles: true,
                extractAttributes: true,
                internalProjection: map_projection,
                externalProjection: kml_projection
            });

            //OpenLayers.Feature.Vector
            var features = kmlFormat.read(evt.target.result);
            var polys = [];
            for (i = 0; i < features.length; i++) {
                if (features[i].geometry && features[i].geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                    polys.push(features[i]);
                }
            }

            if (polys.length >= 10) {
                Ext.MessageBox.confirm("Too many sites", "There are more then 10 sites to be save, do you want to continue?",
                    function (btn) {
                        if (btn === 'yes') {
                            for (var i = 0; i < polys.length; i++) {
                                AddSite(polys[i]);
                            }
                        }
                    });
            } else {
                for (var i = 0; i < polys.length; i++) {
                    AddSite(polys[i]);
                }
            }
        };
    }

    function AddSite(kmlFeature) {
        var name = kmlFeature.attributes.name ? kmlFeature.attributes.name : "KML site";
        var desc = kmlFeature.attributes.description ? kmlFeature.attributes.description : "";

        kmlFeature.attributes.name = name;
        kmlFeature.attributes.description = desc;

        //Redraw the feature with its new name
        //feature.layer.drawFeature(feature);

        WKT = kmlFeature.geometry.toString();

        pvMapper.postSite(name, desc, WKT)
            .done(function (site) {
                kmlFeature.fid = site.siteId;
                kmlFeature.style = null;

                pvMapper.siteLayer.addFeatures([kmlFeature]);

                //push the new site into the pvMapper system
                var newSite = new pvMapper.Site(kmlFeature);
                pvMapper.siteManager.addSite(newSite);

                if (console) console.log('Added ' + newSite.name + ' from KML to the site manager');
            })
            .fail(function () {
                if (console) console.log('failed to post KML site');
                kmlFeature.destroy();
            });
    }

    var siteImportBtn = new Ext.Button({
        text: 'Load Sites from KML',
        enabledToggle: false,
        handler: function () {
            fileDialogBox.removeEventListener('change', handleCustomKML, false);  //enable the site KML event.
            fileDialogBox.addEventListener('change', handleSiteKML, false);  // disable the distance KML event.
            fileDialogBox.click();
        }
    });
    pvMapper.mapToolbar.add(siteImportBtn);



    
    function ExportToXML() {
        var kml_projection = new OpenLayers.Projection("EPSG:4326");
        var map_projection = new OpenLayers.Projection("EPSG:3857");

        var kmlFormat = new OpenLayers.Format.KML({
            extractStyles: false,
            extractAttributes: true,
            internalProjection: map_projection,
            externalProjection: kml_projection 
        });

        var sitesKml = kmlFormat.write(pvMapper.siteLayer.features);
        SaveAsFile(sitesKml);
    }



    function SaveAsFile(content) {

        // add a button on the tool bar to launch a file picker to load local KML file.
        //first, create an input with type='file' and add it to the body of the page.
        Ext.MessageBox.prompt('Save file as', 'Please enter a filename for the export sites.',
            function (btn, filename) {
                if (btn === 'ok') {
                    filename = filename || 'sites.kml';

                    var filenameSpecialChars = new RegExp("[~#%&*{}<>;?/+|\"]");
                    if (filename.match(filenameSpecialChars)) {
                        Ext.MessageBox.alert('Invlaid filename', 'A filename can not contains any of the following characters [~#%&*{}<>;?/+|\"]');
                        return;
                    }

                    //check to make sure that the file has '.kml' extension.
                    var dotindex = filename.lastIndexOf('.');
                    dotindex = dotindex == -1 ? filename.length : dotindex;
                    filename = filename.substr(0, dotindex, dotindex) + '.kml';

                    var blob = CustomBlob(content, null);
                    blob.data = content;
                    blob.type = 'data:application/vnd.google-earth.kml+xml';
                    saveAs(blob, filename);
                }
            }, this, false, 'Sites.kml');

        //This code below works too, but always save with a file name of "Download.kml".
        //uriContent = 'data:application/vnd.google-earth.kml+xml;headers=Content-Disposition:attachment;filename="sites.kml",' + encodeURIComponent(content);
        //newWindow = window.open(uriContent, 'sites.kml');
    }

    var kmlExportBtn = new Ext.Button({
        text: 'Save Sites to KML',
        enabledToggle: false,
        handler: function () {
            ExportToXML();
        }
    });
    pvMapper.mapToolbar.add(kmlExportBtn);

});


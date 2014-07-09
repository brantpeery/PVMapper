
Ext.define("GridExporter", {
    dateFormat: 'Y-m-d g:i',
    escapeForCSV: function (string) {
        if (string.match(/,/)) {
            if (!string.match(/"/)) {
                string = '"' + string + '"';
            } else {
                string = string.replace(/,/g, ''); // comma's and quotes-- sorry, just loose the commas
            }
        }
        return string;
    },

    getFieldText: function (fieldData) {
        var text;

        if (fieldData == null || fieldData == undefined) {
            text = '';

        } else if (typeof fieldData === "object") {
            if (fieldData instanceof Date) {
                text = Ext.Date.format(fieldData, this.dateFormat);
            }
            else {
                text = fieldData.toString();
            }
        }
        else if ((typeof fieldData === "number") || (typeof fieldData === "boolean")) {
            text = fieldData + "";
        }
        else if (typeof fieldData === "boolean") {
            text = fieldData + "";
        }
        else { //already string.
            text = fieldData;
        }

        return text;
    },

    getFieldTextAndEscape: function (fieldData) {
        var string = this.getFieldText(fieldData);
        return this.escapeForCSV(string);
    },

    getCSV: function (grid) {
        var cols = grid.columns;
        var store = grid.store;
        var data = '';

        var that = this;
        //get all the header columns name.
        var hline1 = '';
        var hline2 = '';

        cols.forEach(function (col, index) {
            var fvalue;
            if (col.hidden != true) {
                var fvalue = that.getFieldTextAndEscape(col.text);
                if (fvalue !== "") {
                    hline1 += fvalue + ',';
                    hline2 += ',';
                }
                if ((col.items.items !== undefined) && (col.items.items.length > 0)) {

                    col.items.items.forEach(function (it, idx) {
                        var hvalue = that.getFieldTextAndEscape(it.text);
                        hline1 += hvalue + ',';
                        if ((it.items !== undefined) && (it.items.items.length > 0)) {
                            it.items.items.forEach(function (sit, sid, sits) {
                                fvalue = that.getFieldTextAndEscape(sit.text);
                                if (fvalue !== "") {
                                    hline2 += fvalue + ',';
                                    if (sid < sits.length - 1)
                                        hline1 += ',';
                                }
                            });
                        }
                    });
                }
            }
        });
        data = hline1 + "\n" + hline2 + "\n";

        var text = "";
        store.each(function (record) {
            var entry = record.getData();
            cols.forEach(function (col, index) {
                if (col.hidden != true) {
                    var fieldName = col.dataIndex;
                    if (col.xtype === 'actioncolumn') {
                        var util = entry["utility"];
                        if (util.toExcelString !== undefined) {
                            text = util.toExcelString();
                        }
                        else
                            text = '';
                    }else 
                        text = entry[fieldName];

                    data += that.getFieldTextAndEscape(text);
                    if ((col.items.items !== undefined) && (col.items.items.length > 0)) {
                        // data += ',';
                        var sites = entry["sites"];
                        sites.forEach(function (sc, id, scs) {
                            data += '"' + sc.popupMessage + '",' + that.getFieldTextAndEscape(sc.utility.toFixed(0));
                            if (id < scs.length - 1)
                                data += ',';
                        });
                    }
                    else
                        data += ',';
                }
            });
            data += "\n";
        });

        return data;
    }
});
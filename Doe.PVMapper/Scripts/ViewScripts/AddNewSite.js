Ext.onReady(function () {

    var addSite = new Ext.Action({
        text: "Add Site",
        handler: function () {

            // create a new attributes store
            store = new GeoExt.data.AttributeStore({
                url: "data/describe_feature_type.xml"
            });
            store.load();

            // create a grid to display records from the store
            var grid = new Ext.grid.GridPanel({

                store: store,
                cm: new Ext.grid.ColumnModel([
                    { id: "name", header: "Name", dataIndex: "name", sortable: true },
                    { id: "type", header: "Type", dataIndex: "type", sortable: true }
                ]),
                sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
                autoExpandColumn: "name",
                renderTo: document.body,
                height: 300,
                width: 350
            });

            new Ext.Window({
                title: "GeoExt MapPanel Window",
                height: 400,
                width: 600,
                layout: "fit",
                maximizable: true,
                items: [grid]

            }).show();
        }

    });
    pvMapper.toolbar.add(addSite);
});
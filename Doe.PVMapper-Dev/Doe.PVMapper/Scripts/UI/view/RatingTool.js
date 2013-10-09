//Note: we're using the Property Grid model instead (which happens to be functionally identical to this).
//Ext.define('RatingModel', {
//    extend: 'Ext.data.Model',
//    fields: [{
//        name: 'name'
//    }, {
//        name: 'value',
//        type: 'number'
//    }]
//});


Ext.define('MainApp.view.RatingColumn', {
    extend: 'Ext.grid.column.Action',

    sortable: true,
    text: 'Rating',

    onURL: 'http://www.iconshock.com/img_jpg/MODERN/general/jpg/16/star_icon.jpg',
    offURL: 'http://www.iconshock.com/img_jpg/VECTORNIGHT/general/jpg/16/star_icon.jpg',

    me: null,

    constructor: function (config) {
        me = this;

        me.callParent(arguments); // or  me.callParent([config]);

        // Items is an array property of ActionColumns
        me.items = [
            { index: 0, handler: me.handleItems, getClass: me.getStarClass, tooltip: '0 stars', icon: me.offURL },
            { index: 1, handler: me.handleItems, getClass: me.getStarClass, tooltip: '1 star', icon: me.onURL },
            { index: 2, handler: me.handleItems, getClass: me.getStarClass, tooltip: '2 stars', icon: me.onURL },
            { index: 3, handler: me.handleItems, getClass: me.getStarClass, tooltip: '3 stars', icon: me.onURL },
            { index: 4, handler: me.handleItems, getClass: me.getStarClass, tooltip: '4 stars', icon: me.onURL },
            { index: 5, handler: me.handleItems, getClass: me.getStarClass, tooltip: '5 stars', icon: me.onURL },
        ];

        for (i = 0; i <= 5; i++) {
            me.items[i].scope = me.items[i];
        }
    },

    handleItems: function (grid, rowIndex, colIndex, item, e, record) {
        record.set('value', item.index);

        // also, update the source object
        // hackety hack hack...
        //record.raw.value = item.index;
        record.store.source[record.get('name')] = item.index;
    },

    getStarClass: function (value, metadata, record, rowIndex, colIndex, store) {
        //Note: any changes made to metadata.style will be applied to the entire row of stars, not just to this particular star ~!
        if (this.index == 0) {
            return 'ux-rating-star-zero';
        } else if (this.index > 0 && record.get('value') >= this.index) {
            return 'ux-rating-star-on';
        } else {
            return 'ux-rating-star-off';
        }
    },

});

Ext.define('MainApp.view.RatingTool', {
    extend: 'Ext.grid.Panel',
    columnLines: true,
    width: 380,
    enableColumnHide: false,
    enableColumnResize: false,
    //width: 600,
    //height: 300,

    /*
    NOTE:  Any custom class that to be create/destroy and recreate must be wrapped inside 'initComponent' function.  -- leng.
    */
    initComponent: function () {
        Ext.apply(this, {

            columns: [
                //Ext.create('Ext.grid.column.Column', {
                {
                    text: "Category",
                    minWidth: 110,
                    flex: 1,
                    dataIndex: 'name'
                //}),
                },
                Ext.create('MainApp.view.RatingColumn', {
                    //text: 'Rating',
                    minWidth: 110,
                    dataIndex: 'value',
                })
            ]
        });
        this.callParent(arguments);
    }
});

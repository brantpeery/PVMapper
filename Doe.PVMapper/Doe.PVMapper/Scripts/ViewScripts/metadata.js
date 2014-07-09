// File author : Yash vijaivargiya




function showalert(name, mdata) {
    Ext.create('Ext.window.Window',{
        title: 'Metadata -' + name,
        maxHeight: 500,
    width: 600,
    layout: 'fit',
    autoScroll: true,
    items: { // Let's put an empty grid in just to illustrate fit layout
        xtype: 'displayfield',
        name: 'home_score',
        value: mdata,
        // One header just for show. There's no data,
        store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
    } 
    }).show();
}

function assign_clicks() {

    $table = $("#gx_treeview-1031").find('table');
    $table.find("tr").each(function (i, val) {
        $tmp = $(val).find("div").clone();
        $tmp.children().remove();

        var name = $tmp.html();
        $(val).find(".on_c_img").click(function () {
            showalert(name, $(val).find(".on_c_img").attr('mdata'));
        });
    });


}

var is_cld = true;

pvMapper.readyEvent.addHandler(function () {

    if (is_cld) {
        assign_clicks();
        is_cld = false;

    }
});
   
window.setTimeout(assign_clicks, 1000);

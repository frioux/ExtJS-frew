Ext.grid.RowNumberer = function(config){
    Ext.apply(this, config);
};

Ext.grid.RowNumberer.prototype = {
    header: "",
    width: 23,
    sortable: false,
    fixed:true,
    dataIndex: '',
    id: 'numberer',

    renderer : function(v, p, record, rowIndex){
        return rowIndex+1;
    }
};
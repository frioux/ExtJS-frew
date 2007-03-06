Ext.data.DataProxy = function(){
    this.events = {
        beforeload : true,
        load : true,
        loadexception : true
    };
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable);
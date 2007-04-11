Ext.data.DataProxy = function(){
    this.events = {
        beforeload : true,
        load : true,
        loadexception : true
    };
    Ext.data.DataProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable);
Ext.direct.Provider = Ext.extend(Ext.util.Observable, {
    priority: 1, // lower is higher priority, 0 mens "duplex", aka always on
    constructor : function(config){
        Ext.apply(this, config);
        this.addEvents('connect', 'disconnect', 'data', 'exception');
        Ext.direct.Provider.superclass.constructor.call(this, config);
    },

    isConnected: function(){
        return false;
    },

    connect: Ext.emptyFn,
    disconnect: Ext.emptyFn
});

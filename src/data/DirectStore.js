Ext.data.DirectStore = function(c){
	var pcfg = Ext.copyTo({}, c, 'paramOrder,paramsAsHash,directFn');
	Ext.data.DirectStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: new Ext.data.DirectProxy(pcfg),
        reader: new Ext.data.JsonReader(c, c.fields)
    }));
};
Ext.extend(Ext.data.DirectStore, Ext.data.Store);
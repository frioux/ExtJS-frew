Ext.data.XmlStore = function(c){
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    /**
     * @cfg {Ext.data.DataProxy} proxy @hide
     */
    Ext.data.XmlStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: c.proxy || (!c.data ? new Ext.data.HttpProxy({url: c.url}) : undefined),
        reader: new Ext.data.XmlReader(c, c.fields)
    }));
};
Ext.extend(Ext.data.XmlStore, Ext.data.Store);

Ext.reg('xmlstore', Ext.data.XmlStore);
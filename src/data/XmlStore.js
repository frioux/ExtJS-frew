Ext.data.XmlStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        Ext.data.XmlStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.XmlReader(config)
        }));
    }
    /**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    /**
     * @cfg {Ext.data.DataProxy} proxy @hide
     */
});
Ext.reg('xmlstore', Ext.data.XmlStore);
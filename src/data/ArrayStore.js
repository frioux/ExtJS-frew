/**
 * @class Ext.data.ArrayStore
 * @extends Ext.data.Store
 * Small helper class to make creating Stores from Array data easier.
 * @cfg {Number} id The array index of the record id. Leave blank to auto generate ids.
 * @cfg {Array} fields An array of field definition objects, or field name strings.
 * @cfg {Array} data The multi-dimensional array of data
 * @constructor
 * @param {Object} config
 */
Ext.data.ArrayStore = Ext.extend(Ext.data.Store, {
    constructor: function(config){
        Ext.data.ArrayStore.superclass.constructor.call(this, Ext.apply(config, {
            reader: new Ext.data.ArrayReader(config)
        }));
    },

    loadData : function(data, append){
        if(this.expandData === true){
            var r = [];
            for(var i = 0, len = data.length; i < len; i++){
                r[r.length] = [data[i]];
            }
            data = r;
        }
        Ext.data.ArrayStore.superclass.loadData.call(this, data, append);
    }
});
Ext.reg('arraystore', Ext.data.ArrayStore);

// backwards compat
Ext.data.SimpleStore = Ext.data.ArrayStore;
Ext.reg('simplestore', Ext.data.SimpleStore);
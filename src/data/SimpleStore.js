/**
 * @class Ext.data.SimpleStore
 * @extends Ext.data.Store
 * Small helper class to make creating Stores from Array data easier.
 * @cfg {Number} id The array index of the record id. Leave blank to auto generate ids.
 * @cfg {Array} fields An standard field array consisting of string name or object literal field definitions
 * @cfg {Array} data The multi-dimensional array of data
 * @constructor
 * @param {Object} config
 */
Ext.data.SimpleStore = function(config){
    Ext.data.SimpleStore.superclass.constructor.call(this, {
        reader: new Ext.data.ArrayReader({
                id: config.id
            },
            Ext.data.Record.create(config.fields)
        ),
        proxy : new Ext.data.MemoryProxy(config.data)
    });
    this.load();
};
Ext.extend(Ext.data.SimpleStore, Ext.data.Store);
/**
 * @class Ext.data.JsonWriter
 * @extends Ext.data.DataWriter
 * Data reader class to create an Array of {@link Ext.data.Record} objects from a JSON response
 */
Ext.data.JsonWriter = Ext.extend(Ext.data.DataWriter, {
    /**
     * @cfg {Boolean} returnJson <tt>true</tt> to {@link Ext.util.JSON#encode encode} the
     * {@link Ext.data.DataWriter#toHash hashed data}. Defaults to <tt>true</tt>.  When using
     * {@link Ext.data.DirectProxy}, set this to <tt>false</tt> since Ext.Direct will perform
     * its own json-encoding.
     */
    returnJson : true,

    /**
     * Final action of a write event.  Apply the written data-object to params.
     * @param {String} action [Ext.data.Api.CREATE|READ|UPDATE|DESTROY]
     * @param {Record[]} rs
     * @param {Object} http params
     * @param {Object} data object populated according to DataReader meta-data "root" and "idProperty"
     */
    render : function(action, rs, params, data) {
        Ext.apply(params, data);
        if (this.returnJson) {
            if (Ext.isArray(rs) && data[this.meta.idProperty]) {
                params[this.meta.idProperty] = Ext.encode(params[this.meta.idProperty]);
            }
            params[this.meta.root] = Ext.encode(params[this.meta.root]);
        }
    },
    /**
     * createRecord
     * @param {Ext.data.Record} rec
     */
    createRecord : function(rec) {
        var data = this.toHash(rec);
        delete data[this.meta.idProperty];
        return data;
    },
    /**
     * updateRecord
     * @param {Ext.data.Record} rec
     */
    updateRecord : function(rec) {
        return this.toHash(rec);

    },
    /**
     * destroyRecord
     * @param {Ext.data.Record} rec
     */
    destroyRecord : function(rec) {
        return rec.id
    }
});
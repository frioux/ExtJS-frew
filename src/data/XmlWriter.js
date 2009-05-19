/**
 * @class Ext.data.XmlWriter
 * @extends Ext.data.DataWriter
 * DataWriter extension for writing an array or single {@link Ext.data.Record} object(s) in preparation for executing a remote CRUD action via XML.
 */
Ext.data.XmlWriter = Ext.extend(Ext.data.DataWriter, {
    /**
     * Final action of a write event.  Apply the written data-object to params.
     * @param {String} action [Ext.data.Api.CREATE|READ|UPDATE|DESTROY]
     * @param {Record[]} rs
     * @param {Object} http params
     * @param {Object} data object populated according to DataReader meta-data "root" and "idProperty"
     */
    render : function(action, rs, params, data) {
        // no impl.
    },
    /**
     * createRecord
     * @param {Ext.data.Record} rec
     */
    createRecord : function(rec) {
        // no impl
    },
    /**
     * updateRecord
     * @param {Ext.data.Record} rec
     */
    updateRecord : function(rec) {
        // no impl.

    },
    /**
     * destroyRecord
     * @param {Ext.data.Record} rec
     */
    destroyRecord : function(rec) {
        // no impl
    }
});
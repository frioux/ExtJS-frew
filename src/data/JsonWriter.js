/**
 * @class Ext.data.JsonWriter
 * @extends Ext.data.DataWriter
 * DataWriter extension for writing an array or single {@link Ext.data.Record} object(s) in preparation for executing a remote CRUD action.
 */
Ext.data.JsonWriter = function(config) {
    Ext.data.JsonWriter.superclass.constructor.call(this, config);

    // careful to respect "returnJson", renamed to "encode"
    // TODO: remove after v3 final release
    if (this.returnJson != undefined) {
        this.encode = this.returnJson;
    }
}
Ext.extend(Ext.data.JsonWriter, Ext.data.DataWriter, {
    /**
     * @cfg {Boolean} returnJson <b>Deprecated.  Use {@link Ext.data.JsonWriter#encode} instead.
     */
    returnJson : undefined,
    /**
     * @cfg {Boolean} encode <tt>true</tt> to {@link Ext.util.JSON#encode encode} the
     * {@link Ext.data.DataWriter#toHash hashed data}. Defaults to <tt>true</tt>.  When using
     * {@link Ext.data.DirectProxy}, set this to <tt>false</tt> since Ext.Direct.JsonProvider will perform
     * its own json-encoding.  In addition, if you're using {@link Ext.data.HttpProxy}, setting to <tt>false</tt>
     * will cause HttpProxy to transmit data using the <b>jsonData</b> configuration-params of {@link Ext.Ajax#request}
     * instead of <b>params</b>.  When using a {@link Ext.data.Store#restful} Store, some serverside frameworks are
     * tuned to expect data through the jsonData mechanism.  In those cases, one will want to set <b>encode: <tt>false</tt></b>
     */
    encode : true,

    /**
     * Final action of a write event.  Apply the written data-object to params.
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Record[]} rs
     * @param {Object} http params
     * @param {Object} data object populated according to DataReader meta-data "root" and "idProperty"
     */
    render : function(action, rs, params, data) {
        if (this.encode === true) {
            params[this.meta.root] = Ext.encode(data);
        } else {
            params.jsonData = {};
            params.jsonData[this.meta.root] = data;
        }
    },
    /**
     * createRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    createRecord : function(rec) {
       var data = this.toHash(rec);
       // here we check to see if the developer has defined a field for the record PK.  If they have AND
       // rec.data[idProperty] is NOT empty, the pk is probably not an autoincrement field so we send the
       // idProperty value to server.
       if (rec.fields.containsKey(this.meta.idProperty) && !Ext.isEmpty(rec.data[this.meta.idProperty])) {
           data[this.meta.idProperty] = rec.data[this.meta.idProperty];
       } else {
           delete data[this.meta.idProperty];
       }
       return data;
    },
    /**
     * updateRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    updateRecord : function(rec) {
        return this.toHash(rec);

    },
    /**
     * destroyRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    destroyRecord : function(rec) {
        return rec.id;
    }
});
/**
 * @class Ext.data.DataWriter
 * Abstract base class for writing structured data from a data source and converting
 * it into a JSON-string containing {@link Ext.data.Record} objects and metadata for use
 * by an {@link Ext.data.Store}.  This class is intended to be extended and should not
 * be created directly. For existing implementations, see {@link Ext.data.JsonWriter},
 * @constructor Create a new DataWriter
 * @param {Object} meta Metadata configuration options (implementation-specific)
 * @param {Object} recordType Either an Array of field definition objects as specified
 * in {@link Ext.data.Record#create}, or an {@link Ext.data.Record} object created
 * using {@link Ext.data.Record#create}.
 */
Ext.data.DataWriter = function(config){
    /**
     * This DataWriter's configured metadata as passed to the constructor.
     * @type Mixed
     * @property meta
     */
    Ext.apply(this, config);
};

Ext.data.DataWriter.prototype = {

    meta : {},
    /**
     * @cfg {Boolean} writeAllFields
     * <tt>false</tt> by default.  Set <tt>true</tt> to have DataWriter return ALL fields of a modified
     * record -- not just those that changed.
     * <tt>false</tt> to have DataWriter only request modified fields from a record.
     */
    writeAllFields : false,

    /**
     * Writes data in preparation for server-write action.  Simply proxies to DataWriter#update, DataWriter#create
     * DataWriter#destroy.
     * @param {String} action [CREATE|UPDATE|DESTROY]
     * @param {Object} params The params-hash to write-to
     * @param {Record/Record[]} rs The recordset write.
     */
    write : function(action, params, rs) {
        switch (action) {
            case Ext.data.Api.CREATE:
               this.create(params, rs);
               break;
            case Ext.data.Api.UPDATE:
               this.update(params, rs);
               break;
            case Ext.data.Api.DESTROY:
               this.destroy(params, rs);
               break;
        }
    },

    /**
     * update
     * @param {Object} p Params-hash to apply result to.
     * @param {Record/Record[]} rs Record(s) to write
     */
    update : function(p, rs) {
        if (Ext.isArray(rs)) {
            var data = [];
            var ids = [];
            for (var n=0,len=rs.length;n<len;n++) {
                ids.push(rs[n].id);
                data.push(this.updateRecord(rs[n]));
            }
            p[this.meta.idProperty] = ids;
            p[this.meta.root] = data;
        }
        else if (rs instanceof Ext.data.Record) {
            p[this.meta.idProperty] = rs.id;
            p[this.meta.root] = this.updateRecord(rs);
        }
        return false;
    },

    /**
     * @cfg {Function} saveRecord Abstract method that should be implemented in all subclasses
     * (eg: {@link Ext.data.JsonWriter#saveRecord JsonWriter.saveRecord}
     */
    updateRecord : Ext.emptyFn,

    /**
     * create
     * @param {Object} p Params-hash to apply result to.
     * @param {Record/Record[]} rs Record(s) to write
     */
    create : function(p, rs) {
        if (Ext.isArray(rs)) {
            var data = [];
            for (var n=0,len=rs.length;n<len;n++) {
                data.push(this.createRecord(rs[n]));
            }
            p[this.meta.root] = data;
        }
        else if (rs instanceof Ext.data.Record) {
            p[this.meta.root] = this.createRecord(rs);
        }
    },

    /**
     * @cfg {Function} createRecord Abstract method that should be implemented in all subclasses
     * (eg: {@link Ext.data.JsonWriter#createRecord JsonWriter.createRecord}
     */
    createRecord : Ext.emptyFn,

    /**
     * destroy
     * @param {Object} p Params-hash to apply result to.
     * @param {Record/Record[]} rs Record(s) to write
     */
    destroy : function(p, rs) {
        if (Ext.isArray(rs)) {
            var data = [];
            var ids = [];
            for (var i=0,len=rs.length;i<len;i++) {
                data.push(this.destroyRecord(rs[i]));
            }
            p[this.meta.root] = data;
        } else if (rs instanceof Ext.data.Record) {
            p[this.meta.root] = this.destroyRecord(rs);
        }
        return false;
    },

    /**
     * @cfg {Function} destroyRecord Abstract method that should be implemented in all subclasses
     * (eg: {@link Ext.data.JsonWriter#destroyRecord JsonWriter.destroyRecord}
     */
    destroyRecord : Ext.emptyFn,

    /**
     * toHash
     * Converts a Record to a hash
     * @param {Record}
     */
    toHash : function(rec) {
        var map = rec.fields.map;
        var data = {};
        var raw = (this.writeAllFields === false && rec.phantom === false) ? rec.getChanges() : rec.data;
        for (var k in raw) {
            data[(map[k].mapping) ? map[k].mapping : map[k].name] = raw[k];
        }
        data[this.meta.idProperty] = rec.id;
        return data;
    }
};
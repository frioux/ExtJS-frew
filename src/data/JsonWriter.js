/**
 * @class Ext.data.JsonWriter
 * @extends Ext.data.DataReader
 * Data reader class to create an Array of {@link Ext.data.Record} objects from a JSON response
 */
Ext.data.JsonWriter = Ext.extend(Ext.data.DataWriter, {
	/**
	 * @cfg {Boolean} returnJson [false]
	 */
	returnJson : false,

	/**
	 * writeRecord
	 * @param {Ext.data.Record} rec
	 * @return {Object}
	 */
	writeRecord : function(rec) {
		var data = this.toHash(rec);
		return (this.returnJson === true) ? Ext.encode(data) : data;
	},

	createRecord : function(rec) {
		var data = this.toHash(rec);
		delete data[this.meta.idProperty];
		return (this.returnJson === true) ? Ext.encode(data) : data;
	},

	save : function(p, rs) {
		Ext.data.JsonWriter.superclass.save.apply(this, arguments);
		if (this.returnJson) {
			if (Ext.isArray(rs)) {
				p[this.meta.idProperty] = Ext.encode(p[this.meta.idProperty]);
			}
			p[this.dataProperty] = Ext.encode(p[this.dataProperty]);
		}
	},

	saveRecord : function(rec) {
		return this.toHash(rec);

	},

	destroy : function(p, rs) {
		Ext.data.JsonWriter.superclass.destroy.apply(this, arguments);
		if (this.returnJson) {
			p[this.dataProperty] = Ext.encode(p[this.dataProperty]);
		}

	},

	destroyRecord : function(rec) {
		return rec.id
	}
});
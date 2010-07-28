/**
 * @class Ext.data.SQLiteStore
 * @extends Ext.data.Store
 * Convenience class which assists in setting up SQLiteStore's.
 * This class stores recordsets from the given database table or view and writes
 * changes automatically to it, if {@link Ext.data.SQLiteStore#autoSave} is <code>true</code>.
 * This class requires that all fields stored in the database will also be kept
 * in the Ext.data.Store.
 * @constructor
 * Creates a new Ext.data.SQLiteStore
 * @param {Object} config The configuration object
 */
Ext.data.SQLiteStore = Ext.extend(Ext.data.Store, {
	/**
	 * @cfg {Boolean} autoSave
	 * <p>Defaults to <tt>true</tt> causing the store to automatically {@link #save} records to
	 * the database when a record is modified (ie: becomes 'dirty'). Specify <tt>false</tt> to manually call {@link #save}
	 * to send all modifiedRecords to the database.</p>
	 * <br><p><b>Note</b>: each CRUD action will be sent as a separate request.</p>
	 */
	autoSave: true,
	/**
	 * @cfg {String} idProperty
	 * This is the primary key for the table and the id for the Ext.data.Record
	 */
	/**
	 * @cfg {String} key
	 * <b>*deprecated</b> Backwards compat for {@link Ext.data.SQLiteStore#idProperty}
	 */
	/**
	 * @cfg {Array} fields
	 * An Array of {@link Ext.data.Field Field} definition objects
	 * (which will be passed to {@link Ext.data.Record#create}
	 */
	/**
	 * @cfg {Ext.data.JsonReader} reader
	 * (optional) A customized {@link Ext.data.JsonReader}
	 */
	/**
	 * @cfg {Ext.data.JsonWriter} writer
	 * (optional) A customized (@link Ext.data.JsonWriter}
	 */
	/**
	 * @cfg {Ext.data.SQLiteProxy} proxy
	 * (optional) A customized {@link Ext.data.SQLiteProxy}
	 */
	/**
	 * @cfg {Ext.data.SQLiteDB} conn
	 * (optional) A SQLiteDB connection instance
	 */
	/**
	 * @cfg {String} dbFile
	 * (optional) A database file to open with the SQLiteDB connection.
	 * Should be defined, if {@link Ext.data.SQLiteStore#conn} is not defined.
	 */
	/**
	 * @cfg {Object} api
	 * An {Ext.data.SQLiteProxy#api} object, which defines the CRUD actions to handle with the db
	 * Only the false properties need to be defined.
	 */
	/**
	 * @cfg {String} tableName
	 * The name of the database table or view, from which to read the records or from which to write changes.
	 */
	/**
	 * @cfg {Boolean} autoCreateTable
	 * <code>true</code> to automatically create the database table with the given {@link #tableName}
	 * if it does not exist (defaults to <code>false</code>).
	 */
	/**
	 * @cfg {Boolean} remoteSort
	 * @hide
	 */
	/**
	 * @cfg {Boolean} batch
	 * @hide
	 */
	/**
	 * @cfg {Boolean} restful
	 * @hide
	 */
	constructor: function(config) {
		config = config || {};
		var idProperty = config.idProperty || config.key;
		
		// always use batch:true since we're using database transactions
		config.batch = true;
		config.restful = false;
		
		if (!config.reader) {
			config.reader = new Ext.data.JsonReader({
				idProperty: idProperty,
				fields: config.fields,
				root: '__root__',
				totalProperty: '__total__',
			});
		}
		
		if (!config.writer) {
			config.writer = new Ext.data.JsonWriter({
				encode: false
			});
		}
		
		if (!config.proxy) {
			config.proxy = new Ext.data.SQLiteProxy(Ext.copyTo({}, config, 'conn,dbFile,api'));
		}
		delete config.conn;
		delete config.dbFile;
		
		Ext.data.SQLiteStore.superclass.constructor.call(this, config);
		
		if (config.autoCreateTable === true) {
			var ct = function() {
				this.proxy.conn.createTable({
					name: config.tableName,
					key: idProperty,
					fields: this.reader.recordType.prototype.fields
				});
			};
			if (this.proxy.conn.isOpen()) {
				ct.call(this);
			} else this.proxy.conn.on('open', ct, this, {single: true});
		}
		
		this.table = this.proxy.conn.getTable(config.tableName, idProperty);
		
		// prevent temporary removed records from being loaded on store reload
		this.on('beforeload', function(s, o) {
			if (!Ext.isEmpty(this.removed)) {
				var rIds = [];
				Ext.each(this.removed, function(r) {
					rIds.push(r.id);
				});
				var q = String.leftPad('', rIds.length, "?");
				q = q.split("").join(",");
				Ext.apply(o.params, {
					where: idProperty + " NOT IN (" + q + ")",
					args: rIds
				});
			}
		}, this);
	}
});

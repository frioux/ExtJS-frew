/**
 * @class Ext.data.GroupingSQLiteStore
 * @extends Ext.data.GroupingStore
 * A specialized store implementation that provides for grouping records by one of the available fields.
 * The records are returned by a SQLite database. 
 * This is usually used in conjunction with an {@link Ext.grid.GroupingView} to proved the data model for
 * a grouped GridPanel.
 * @constructor
 * Creates a new GroupingSQLiteStore.
 * @param {Object} config A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
Ext.data.GroupingSQLiteStore = Ext.extend(Ext.data.GroupingStore, {
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
		Ext.data.SQLiteStore.prototype.constructor.call(this, config);
		this.applyGroupField();
	}
});

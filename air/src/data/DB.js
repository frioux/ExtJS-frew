/**
 * @class Ext.data.DB
 * @extends Ext.util.Observable
 * A base class to buid up connections to local databases 
 * @constructor
 * Creates a new database connection
 * @param {Object} config The configuration object
 */
Ext.data.DB = function(config){
	this.addEvents(
		/**
		 * @event open
		 * Fires when the database connection is established.
		 * @param {Ext.data.DB} this
		 */
		'open',
		/**
		 * @event error
		 * Fires if the connection to the database causes an error and cannot be established
		 * @param {Ext.data.DB} this
		 * @param {Object} error The error object. It can be air.SQLError, ArgumentError or IllegalOperationError
		 */
		'error',
		/**
		 * @event close
		 * Fires when the database connection becomes closed.
		 * @param {Ext.data.DB} this
		 */
		'close'
	);
	
	Ext.apply(this, config);
	Ext.data.DB.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DB, Ext.util.Observable, {
	/**
	 * @cfg {Number} maxResults
	 * The maximum number of records that should be loaded in one query
	 * (defaults to <code>-1</code> which means no maximum).
	 */
	maxResults: -1,
	// private
	openState: false,

	// abstract methods
	open: Ext.emptyFn,
	close: Ext.emptyFn,
	exec: Ext.emptyFn,
	execBy: Ext.emptyFn,
	query: Ext.emptyFn,
	queryBy: Ext.emptyFn,
	createTable: Ext.emptyFn,

	/**
	 * Returns if the database connection is established.
	 * @return {Boolean}
	 */	 	 	
	isOpen: function(){
		return this.openState;
	},
	// private
	getTable : function(name, keyName){
		return new Ext.data.Table(this, name, keyName);
	}
});
// deprecated
Ext.data.DB.getInstance = function(config){
	return new Ext.data.SQLiteDB(config);
};

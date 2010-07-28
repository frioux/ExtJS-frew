/**
 * @class Ext.data.SQLiteProxy
 * @extends Ext.data.DataProxy
 * An implementation of {@link Ext.data.DataProxy} that reads from a SQLLite
 * database.
 * @constructor
 * Creates a new SQLiteProxy. 
 * @param {Object} config The configuration object 
 */
Ext.data.SQLiteProxy = function(config){
	/**
	 * @cfg {Object} conn
	 * An {@link Ext.data.SQLiteDB} database connection instance
	 */
	/**
	 * @cfg {String} dbFile
	 * A database file to open, if conn is not set
	 */
	/**
	 * @cfg {Object} api
	 * Specify, which CRUD action methods should be forwarded directly to the DB.
	 * Defaults to.<pre><code>
api: {
	read: true,
	create: true,
	update: true,
	destroy: true
}
	 * </code></pre>
	 * It is only needed to specify the actions, which should <u>not</u> be forwarded to the DB.
	 * <br /><br />
	 * If an action is set to <code>true</code> and a {@link Ext.data.DataWriter} is set to the store,
	 * inserted, updated or deleted store's records are also inserted/updated/deleted in the database.
	 */
	/**
	 * @cfg {Boolean} restful
	 * @hide
	 */
	config = config || {};
	Ext.apply(config, {
		restful: false,
		url: undefined,
		api: Ext.copyTo({
			read: true, create: true, update: true, destroy: true
		}, config.api || {}, 'read,create,update,destroy')
	});
	Ext.data.SQLiteProxy.superclass.constructor.call(this, config);
	if (!config.conn || config.dbFile) {
		this.conn = new Ext.data.SQLiteDB({
			dbFile: config.dbFile
		});
	} else this.conn = config.conn;
	
};
Ext.extend(Ext.data.SQLiteProxy, Ext.data.DataProxy, {
	/**
	 * SQLiteProxy implementation of DataProxy#doRequest
	 * @param {String} action The crud action type (create, read, update, destroy)
	 * @param {Ext.data.Record/Ext.data.Record[]} rs If action is load, rs will be null
	 * @param {Object} params An object containing properties which are used to buid up the
	 * sql query string, if action is load
	 * @param {Ext.data.DataReader} reader The Reader object which converts the data
	 * object into a block of Ext.data.Records.
	 * @param {Function} callback
	 * <div class="sub-desc"><p>A function to be called after the request.
	 * The <tt>callback</tt> is passed the following arguments:<ul>
	 * <li><tt>rs</tt> : Ext.data.Record[] The block of Ext.data.Records.</li>
	 * <li><tt>options</tt>: Options object from the action request</li>
	 * <li><tt>success</tt>: Boolean success indicator</li></ul></p></div>
	 * @param {Object} store The scope (<code>this</code> reference) in which the callback function is executed. It's the SQLiteStore.
	 * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
	 * @protected
	 */
	doRequest: function(action, rs, params, reader, callback, store, options) {
		// make sure, the connection is open
		if (!this.api[action]) return;
		if (!this.conn.isOpen()) {
			this.conn.on('open', function() {
				this.doRequest.call(this, action, rs, params, reader, callback, store, options);
			}, this, {single: true});
			return;
		}
		rs = (Ext.isArray(rs)) ? rs : [rs];
		
		this.dataStack = [];
		
		// reverse records since the batch queue in Ext.data.Store starts with the last record,
		// so ids would be vice-versa on inserts
		rs.reverse();
		
		switch (action) {
			// inserts
			case Ext.data.Api.actions.create:
			// updates
			case Ext.data.Api.actions.update:
				this.recordCounter = 0;
				var beginHandler = this.processNextRow.createDelegate(this, [action, rs, reader, callback, store, options]),
					errorHandler = this.handleError.createDelegate(this, [action, null, null, null, options, callback, store]);
				// handle insert and update statements within a transaction
				this.inTransaction = this.conn.conn.inTransaction;
				this.conn.conn[this.inTransaction ? 'setSavepoint' : 'begin'](null, new air.Responder(beginHandler, errorHandler));
				break;
			// deletes
			case Ext.data.Api.actions.destroy:
				var kn = store.table.keyName,
					i, len;
				for (i = 0, len = rs.length; i < len; i++) {
					this.recordCounter = rs.length;
					store.table.removeBy(kn + " = ?", [rs[i].id], this.createCallback(action, rs, {}, reader, callback, store, options), this);
				}
				break;
			// selects
			default:
				var sort = params[store.paramNames.sort],
					dir = params[store.paramNames.dir],
					start = params[store.paramNames.start],
					limit = params[store.paramNames.limit],
					group = params.groupBy,
					groupDir = params.groupDir,
					clause = params.clause || params.where || '',
					args = params.args || [],
					response = {};
				// do sorting by groupField and sort field
				if (group || sort) {
					clause += " ORDER BY ";
					if (group && group != sort) {
						clause += group + ' ' + groupDir + ', ';
					}
					clause += sort + ' ' + (dir || "ASC");
				}
				// limit the result
				if (limit) {
					this.conn.query("SELECT count(*) as count FROM " + store.table.name + clause, function(type, success, result, stmt, db) {
						if (!success) {
							this.handleError(action, result, stmt, db, options, callback, store);
							return;
						}
						clause += " LIMIT ";
						if (Ext.isNumber(start)) clause += start + ",";
						clause += limit;
						store.table.selectBy(clause, args, this.createCallback(action, result.records[0].count, null, reader, callback, store, options), this);
					}, this);
				} else store.table.selectBy(clause, args, this.createCallback(action, null, null, reader, callback, store, options), this);
				break;
		}
	},
	/**
	 * Inserts or updates the next record within a transaction
	 * @private
	 */
	processNextRow: function(action, rs, reader, callback, store, options) {
		var r = rs[this.recordCounter++],
			data,
			kn = store.table.keyName,
			changes;
		switch(action) {
			// insert
			case Ext.data.Api.actions.create:
				data = this.processData(r.data, reader);
				store.table.insert(data, this.createCallback(action, rs, r.data, reader, callback, store, options), this);
				break;
			// update
			case Ext.data.Api.actions.update:
				if (r.dirty) {
					changes = r.getChanges();
					data = this.processData(changes, reader);
					store.table.updateBy(data, kn + " = ?", [r.id], this.createCallback(action, rs, r.data, reader, callback, store, options), this);
				// skip un-dirty records
				} else processNextRow(action, store);
				break;
		}
	},
	// private
	handleError: function(action, result, stmt, db, options, callback, scope) {
		var fn = (function() {
			this.fireEvent('exception', this, 'response', action, result, stmt, db);
			callback.call(scope, null, options, false);
		}).createDelegate(this);
		// rollback the active transaction
		if (this.conn.conn.inTransaction) {
			if (this.inTransaction) {
				this.conn.conn.rollbackToSavepoint(null, new air.Responder(fn, fn));
			} else this.conn.conn.rollback(new air.Responder(fn, fn));
		} else fn();
	},
	// private
	createCallback : function(action, rs, data, reader, callback, scope, arg) {
		return function(type, success, result, stmt, db) {
			if (!success) {
				this.handleError(action, result, stmt, db, arg, callback, scope);
				return;
			}
			if (action === Ext.data.Api.actions.read) {
				var response = {};
				response[reader.meta.root] = result.records;
				// give total records to rs
				if (Ext.isNumber(rs)) response[reader.meta.totalProperty] = rs;
				this.onRead(action, response, reader, callback, scope, arg);
			} else {
				if (action === Ext.data.Api.actions.create) {
					data[reader.meta.idProperty] = result.insertId;
				}
				this.dataStack.push(data);
				if (this.recordCounter < rs.length) {
					this.processNextRow(action, rs, reader, callback, scope, arg);
				} else {
					var commitHandler = this.onWrite.createDelegate(this, [action, result, rs, this.dataStack, reader, callback, scope, arg]),
						errorHandler = this.handleError.createDelegate(this, [action, null, null, null, arg, callback, scope]);
					// commit the active transaction
					if (this.conn.conn.inTransaction) {
						if (this.inTransaction) {
							this.conn.conn.releaseSavepoint(null, new air.Responder(commitHandler, errorHandler));
						} else this.conn.conn.commit(new air.Responder(commitHandler, errorHandler));
					} else commitHandler();
				}
			}
		};
	},
	/**
	 * Callback for read action
	 * @param {String} action Action name as per {@link Ext.data.Api.actions#read}.
	 * @param {Object} response A build-up response object containing the records and totalProperty
	 * @param {Object} reader The Reader object which converts the data
	 * @param {Function} callback
	 * @param {Object} scope of the callback
	 * @param {Object} arg args to pass to the callback	 	 	 
	 * @fires load
	 * @protected
	 */
	onRead : function(action, response, reader, callback, scope, arg) {
		var result = reader.readRecords(response);
		this.fireEvent('load', this, response, arg);
		callback.call(scope, result, arg, true);
	},
	/**
	 * Callback for write actions
	 * @param {String} action [Ext.data.Api.actions.create|update|destroy]
	 * @param {Object} result The result object of the query
	 * @param {Ext.data.Record/Ext.data.Records[]} rs The record or an array of records being inserted/updated/deleted	 	 
	 * @param {Object} The data to apply to the records
	 * @param {Object} reader The Reader object which converts the data
	 * @param {Function} callback
	 * @param {Object} scope of the callback
	 * @param {Object} arg args to pass to the event listener	 	 	 
	 * @fires write
	 * @protected
	 */
	onWrite : function(action, result, rs, data, reader, callback, scope, arg) {
		var o = reader.extractData([].concat(data), false);
		this.fireEvent('write', this, action, o, result, rs, arg);
		callback.call(scope, o, result, true);
	},
	// private
	processData : function(data, reader) {
		var fs = reader.recordType.prototype.fields,
			r = {};
		for(var key in data) {
			var f = fs.key(key),
				k, v, t;
			if(f) {
				k = f.mapping ? f.mapping : f.name,
				v = data[key],
				t = Ext.isObject(f.type) ? f.type.type : f.type;
				switch (t) {
					case 'date':
						r[k] = v ? v.format(this.conn.dateFormat || 'Y-m-d H:i:s') : null;
						break;
					case 'bool':
					case 'boolean':
						r[k] = (!v || v === 'false') ? 0 : 1;
						break;
					case 'int':
					case 'integer':
						r[k] = parseInt(v);
						break;
					case 'float':
						r[k] = parseFloat(v);
						break;
					default:
						r[k] = v;
						break;
				}
			}
		}
		return r;
	},
	/**
	 * load
	 * @hide
	 */	 	 	
	load: Ext.emptyFn,
	/**
	 * buildUrl	
	 * @hide
	 */
	buildUrl: Ext.emptyFn
});

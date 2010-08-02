/**
 * @class Ext.data.SQLiteDB
 * @extends Ext.data.DB
 * A class to buid up connections to local SQLite databases 
 * @constructor
 * Creates a new connection to a SQLite database
 * @param {Object} config The configuration object
 */
Ext.data.SQLiteDB = function(config) {
	config = config || {};
	this.addEvents(
		/**
		 * @event sqlresult
		 * Fires if a sql statement executes successfully
		 * @param {Ext.data.SQLiteDB} this
		 * @param {Array} records The returned records on SELECT statements
		 * @param {Number} insertId The last auto generated row id generated by an INSERT statement
		 * @param {Number} affectedRows The number of rows affected by the last operation
		 * @param {air.SQLStatement} stmt The air SQLStatement object
		 */
		'sqlresult',
		/**
		 * @event sqlerror
		 * Fires if a sql statement causes an error and cannot be executed successfully
		 * @param {Ext.data.SQLiteDB} this
		 * @param {air.SQLError} error The air SQLError object
		 * @param {air.SQLStatement} stmt The air SQLStatement object
		 */
		'sqlerror'
	);
	
	/**
	 * @cfg {String} dbFile
	 * Define a database file, if the connection should be build up immediately
	 * (see {@link #open} for more information).
	 */
	Ext.data.SQLiteDB.superclass.constructor.call(this, config);
	this.conn = new air.SQLConnection();
	if (config.dbFile) this.open(config.dbFile);
};
Ext.extend(Ext.data.SQLiteDB, Ext.data.DB, {
	/**
	 * @cfg {String} mode
	 * An air.SQLMode to open the database.
	 * This can be <ul>
	 * <li><code>air.SQLMode.READ</code> to open a read-only connection</li>
	 * <li><code>air.SQLMode.CREATE</code> to open a connection for updates, auto creating
	 * the database file if it does not exist</li>
	 * <li><code>air.SQLMode.UPDATE</code> to open a connection for updates, but don't create
	 * the database file if it does not exist</li>
	 * </ul> Defaults to <code>air.SQLMode.UPDATE</code>.
	 */
	mode: air.SQLMode.UPDATE,
	/**
	 * @cfg {String} dateFormat
	 * The date format which is used to store dates in the database
	 * (defaults to <code>Y-m-d H:i:s</code>).
	 * It is used to format dates with {@link Date#format} before writing it to DB.	 
	 */
	dateFormat: 'Y-m-d H:i:s',
	/**
	 * @cfg {String} encryptionKey
	 * The encryption key for the database.
	 * (defaults to <code>null</code>).
	 * Set it to a string to use encryption. This string must contain 8-32 characters with
	 * at least one uppercase character, at least one lowercase letter and at least one number or symbol.<br />
	 * Make sure, you have the EncryptionKeyGenerator.swf file included.
	 * It can be found in the resources/swf directory.
	 */
	encryptionKey: null,
	/**
	 * @cfg {Number} pageSize
	 * Indicates the page size (in bytes) for the database.
	 * This parameter is only valid when creating a new database file or opening a database file
	 * in which no tables have been created. The value must be a power of two greater than or
	 * equal to 512 and less than or equal to 32768. The default value is <code>1024</code> bytes.
	 * This value can only be set before any tables are created.
	 * Once the tables are created attempting to change this value results in an error.
	 */
	pageSize: 1024,
	/**
	 * @cfg {Boolean} autoCompact
	 * Indicates whether unused space in the database is reclaimed automatically.
	 * This parameter is only valid when creating a new database file or opening
	 * a database file in which no tables have been created. By default,
	 * the space taken up by removed data is left in the database file and reused when needed.
	 * Setting this parameter to <code>true</code> causes the database to automatically
	 * reclaim unused space. This can negatively affect performance because it requires
	 * additional processing each time data is written to the database and can also cause
	 * the database data to become fragmented over time.
	 * To force the database to reclaim unused space in a database file at any time
	 * and to defragment the database file, use the compact() method on this.conn.<br />
	 * This parameter is ignored when {@link #mode} is <code>'read'</code>.
	 */
	autoCompact: false,	 
	/**
	 * Opens the connection to the specified file
	 * @param {String} dbFile The path to the database file to open. By default it is
	 * relatively to the application directory. Example usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	// relatively to the application directory
	dbFile: 'myDb.sqlite'
});
	 * </code></pre>But you can use database files in any other directory, too:<pre><code>
var conn = new Ext.data.SQLiteDB({
	// relatively to the application storage directory
	dbFile: air.File.applicationStorageDirectory.resolvePath('myDb.sqlite').nativePath
});
	 * </code></pre>
	 */
	open : function(dbFile){
		var file = Ext.isString(dbFile) ? air.File.applicationDirectory.resolvePath(dbFile) : dbFile,
			encKey = null;
		if (this.encryptionKey && !Ext.isEmpty(air.EncryptionKeyGenerator)) {
			if (Ext.isString(this.encryptionKey)) {
				var keyGen = new air.EncryptionKeyGenerator();
				if (keyGen.validateStrongPassword(this.encryptionKey)) {
					encKey = keyGen.getEncryptionKey(file, this.encryptionKey);
				}
			// this.encryptionKey is already a valid ByteArray
			} else if (typeof this.encryptionKey == 'object' && this.encryptionKey.bytesAvailable === 0 && this.encryptionKey.length === 16) {
				encKey = this.encryptionKey;
			}
		}
		this.openState = false;
		
		var openHandler = (function() {
			this.openState = true;
			this.fireEvent('open', this);
		}).createDelegate(this),
			errorHandler = (function(e) {
			this.fireEvent('error', this, e);
		}).createDelegate(this);
		this.conn.openAsync(file, this.mode, new air.Responder(openHandler, errorHandler), this.autoCompact, this.pageSize, encKey);
	},
	/**
	 * Closes the connection
	 */
	close: function() {
		this.conn.addEventListener(air.SQLEvent.CLOSE, (function(e) {
			this.openState = false;
			this.fireEvent('close', this);
		}).createDelegate(this));
		this.conn.close();
	},
	// private
	createCallback: function(type, stmt, callback, scope) {
		var _this = this;
		return function(e) {
			var success = !e.error,
				res = stmt.getResult(),
				o = {
					records: _this.readResults(res),
					insertId: res ? res.lastInsertRowID : null,
					affectedRows: res ? res.rowsAffected : null,
					error: e.error
				};
			if (Ext.isFunction(callback)) {
				callback.call(scope || _this, type, success, o, stmt, _this);
			}
			if (success) {
				_this.fireEvent('sqlresult', _this, o.records, o.insertId, o.affectedRows, stmt);
			} else _this.fireEvent('sqlerror', _this, o.error, stmt);
		};
	},
	/**
	 * Creates a new air.SQLStatement and applies a callback to it
	 * @param {String} type (optional) a type to identify the statement in the callback function
	 * @param {Function} callback (optional) a callback function to call on every execution success
	 * or error, which is done with the statement. The callback is called with the following arguments:<ul>
	 * <li><b>type</b>: {String}<div class="sub-desc">the defined type</div></li>
	 * <li><b>success</b>: {Boolean}<div class="sub-desc">true if the execution succeeded.</div></li>
	 * <li><b>result</b>: {Object}<div class="sub-desc">An object with the following properties:<ul>
	 * <li><b>records</b>: {Array}<div class="sub-desc">The requested records of a query</div></li>
	 * <li><b>insertId</b>: {Number}<div class="sub-desc">The id of an inserted record</div></li>
	 * <li><b>affectedRows</b>: {Number}<div class="sub-desc">The number of the affected rows</div></li>
	 * <li><b>error</b>: {Object}<div class="sub-desc">An air.SQLError object, if the request didn't succeed</div></li></ul></div>	 	 	 	 	 
	 * <li><b>stmt</b>: {Object}<div class="sub-desc">the air.SQLStatement object</div></li>
	 * <li><b>db</b>: {Object}<div class="sub-desc">this, the Ext.data.SQLiteDB instance</div></li></ul>
	 * @param {Object} scope (optional) the scope in which the callback should be called (default to <code>this</code>)
	 * @return {Object} The air.SQLStatement
	 */
	createStatement : function(type, callback, scope){
		var stmt = new air.SQLStatement();
		stmt.sqlConnection = this.conn;
		var cb = this.createCallback(type, stmt, callback, scope);
		stmt.addEventListener(air.SQLEvent.RESULT, cb);
		stmt.addEventListener(air.SQLErrorEvent.ERROR, cb);
		return stmt;
	},
	/**
	 * Executes a sql statement and calls the specified callback on success or error.
	 * Uses type 'exec'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.exec("SELECT * FROM myTable", function(type, success, result) {
	if (success) console.info(result.recods);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	exec: function(sql, callback, scope) {
		return this.execBy(sql, null, callback, scope);
	},
	/**
	 * Executes a sql statement with arguments and calls the specified callback on success or error.
	 * Uses type 'exec'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.execBy("SELECT * FROM myTable WHERE id = ?", [100], function(type, success, result) {
	if (success) console.info(result.records);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Array} args The arguments to use for the sql (in the right order)	 
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	execBy : function(sql, args, callback, scope) {
		var stmt = this.createStatement('exec', callback, scope);
		stmt.text = sql;
		this.addParams(stmt, args);
		stmt.execute();
		return stmt;
	},
	
	/**
	 * Executes a sql statement and calls the specified callback on success or error.
	 * this.maxResults is considered. Uses type 'query'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.exec("SELECT * FROM myTable", function(type, success, result) {
	if (success) console.info(result.recods);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	query : function(sql, callback, scope) {
		return this.queryBy(sql, null, callback, scope);
	},
	/**
	 * Executes a sql statement with arguments and calls the specified callback on success or error.
	 * this.maxResults is considered. Uses type 'query'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.exec("SELECT * FROM myTable WHERE id = ?", [100], function(type, success, result) {
	if (success) console.info(result.recods);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Array} args The arguments to use for the sql (in the right order)	 
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	queryBy : function(sql, args, callback, scope){
		var stmt = this.createStatement('query', callback, scope);
		stmt.text = sql;
		this.addParams(stmt, args);
		stmt.execute(this.maxResults);
		return stmt;
	},
	// private
	addParams : function(stmt, args){
		if(!args){ return; }
		for(var key in args){
			if(args.hasOwnProperty(key)){
				if(!isNaN(key)){
					var v = args[key];
					if(Ext.isDate(v)){
						v = v.format(Ext.sql.Proxy.DATE_FORMAT);
					}
					stmt.parameters[parseInt(key)] = v;
				}else{
					stmt.parameters[':' + key] = args[key];
				}
			}
		}
		return stmt;
	},
	// private
	readResults : function(rs){
		var r = [];
		if(rs && rs.data){
			var len = rs.data.length;
			for(var i = 0; i < len; i++) {
				r[r.length] = rs.data[i];
			}
		}
		return r;
	},
	// pivate
	createTable : function(o){
		var tableName = o.name,
			keyName = o.key,
			fs = o.fields,
			buf = [];
		if(!Ext.isArray(fs)) { // Ext fields collection
			fs = fs.items;
		}
		for (var i = 0, len = fs.length; i < len; i++) {
			var f = fs[i],
				m = s = f.mapping ? f.mapping : f.name,
				d = f.defaultValue,
				t = Ext.isObject(f.type) ? f.type.type : f.type;
			switch (t) {
				case "bool":
				case "boolean":
					if (d === 'false') d = false;
				case "int":
				case "integer":
					s += " INTEGER";
					break;
				case "float":
					s += " REAL";
					break;
				default:
					s += " TEXT";
					break;
			}
			if (f.allowNull === false || m == keyName) {
				s += " NOT NULL";
			}
			if (!Ext.isEmpty(d) || (d === "" && t == "string")) {
				s += " DEFAULT ";
				if (Ext.isString(d)) {
					s += "'" + d.split("'").join("''") + "'";
				} else if (Ext.isBoolean(d)) {
					s += (!d) ? "0" : "1";
				} else s += d;
			}
			if (m == keyName) {
				s += " PRIMARY KEY";
				if (f.autoIncrement === true && (t == "int" || t == "integer")) {
					s += " AUTOINCREMENT";
				}
			}
			if (f.unique === true) {
				s += " UNIQUE";
			}

			buf[buf.length] = s;
		}
		var sql = ["CREATE TABLE IF NOT EXISTS ", tableName, " (", buf.join(","), ")"].join("");
		this.exec(sql);
	}
});

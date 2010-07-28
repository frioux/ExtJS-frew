/**
 * @class Ext.data.Table
 * A class to wrap a database table or view
 * @constructor
 * Creates a new Table instance
 * @param {Object} conn the database connection instance
 * @param {String} name the table or view name
 * @param {String} keyName the name of the table's or view's primary key field
 */
Ext.data.Table = function(conn, name, keyName){
	this.conn = conn;
	this.name = name;
	this.keyName = keyName;
};
Ext.data.Table.prototype = {
	/**
	 * Selects recordsets from the table filtered by the given clause.
	 * @param {String} clause A where clause (without "WHERE ").
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	select: function(clause, callback, scope) {
		return this.selectBy(clause, null, callback, scope);
	},
	/**
	 * Selects recordsets from the table filtered by the given clause.
	 * @param {String} clause A where clause (without "WHERE "). Use "?" to use an arguments of passed array.
	 * @param {Array} args An array of values that should be used with the clause
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	selectBy: function(clause, args, callback, scope) {
		var sql = "SELECT * FROM " + this.name;
		if(clause){
			sql += ' ' + clause;
		}
		args = args || [];
		return this.conn.queryBy(sql, args, callback, scope);
	},
	/**
	 * Inserts a new record with the specified values into the table.
	 * @param {Object} The data to add
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	insert: function(o, callback, scope) {
		var sql = "INSERT INTO " + this.name + " ";
		var fs = [], vs = [], a = [];
		for(var key in o){
			if(o.hasOwnProperty(key)){
				fs[fs.length] = key;
				vs[vs.length] = "?";
				a[a.length] = o[key];
			}
		}
		sql = [sql, "(", fs.join(","), ") VALUES (", vs.join(","), ")"].join("");
		return this.conn.execBy(sql, a, callback, scope);
	},
	/**
	 * Updates a recordset with the specified values.
	 * @param {Object} The data to apply (should contain the value of the table's keyName)
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	update: function(o, callback, scope) {
		var clause = this.keyName + " = ?";
		return this.updateBy(o, clause, [o[this.keyName]], callback, scope);
	},
	/**
	 * Updates a recordset with the specified values, clause and args.
	 * @param {Object} The data to apply
	 * @param {String} clause A where clause (without "WHERE "). Use "?" to use an arguments of passed array.
	 * @param {Array} args An array of values that should be used with the clause
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	updateBy : function(o, clause, args, callback, scope){
		var sql = "UPDATE " + this.name + " SET ";
		var fs = [], a = [];
		for(var key in o){
			if(o.hasOwnProperty(key)){
				fs[fs.length] = key + " = ?";
				a[a.length] = o[key];
			}
		}
		for(var key in args){
			if(args.hasOwnProperty(key)){
				a[a.length] = args[key];
			}
		}
		sql = [sql, fs.join(","), " WHERE ", clause].join("");
		return this.conn.execBy(sql, a, callback, scope);
	},
	/**
	 * Deletes recordsets from the table queried by the given clause.
	 * @param {String} clause A where clause (without "WHERE ").
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	remove: function(clause, callback, scope) {
		this.removeBy(clause, null, callback, scope);
	},
	/**
	 * Deletes recordsets from the table queried by the given clause.
	 * @param {String} clause A where clause (without "WHERE "). Use "?" to use an arguments of passed array.
	 * @param {Array} args An array of values that should be used with the clause
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	removeBy: function(clause, args, callback, scope) {
		var sql = "DELETE FROM " + this.name;
		if(clause){
			sql += " WHERE " + clause;
		}
		args = args || {};
		this.conn.execBy(sql, args, callback, scope);
	}
};

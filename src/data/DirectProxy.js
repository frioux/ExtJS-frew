/**
 * @class Ext.data.DirectProxy
 * @extends Ext.data.DataProxy
 */
Ext.data.DirectProxy = function(config){

    if(typeof this.paramOrder == 'string'){
        this.paramOrder = this.paramOrder.split(/[\s,|]/);
    }
    Ext.data.DirectProxy.superclass.constructor.call(this, config);
};

Ext.extend(Ext.data.DirectProxy, Ext.data.DataProxy, {
	/**
	 * @cfg {Array/String} paramOrder Defaults to <tt>undefined</tt>. A list of params to be executed
	 * server side.  Specify the params in the order in which they must be executed on the server-side
	 * as either (1) an Array of String values, or (2) a String of params delimited by either whitespace,
	 * comma, or pipe. For example,
	 * any of the following would be acceptable:<pre><code>
paramOrder: ['param1','param2','param3']
paramOrder: 'param1 param2 param3'
paramOrder: 'param1,param2,param3'
paramOrder: 'param1|param2|param'
	 </code></pre>
	 */
	paramOrder: undefined,

	/**
	 * @cfg {Boolean} paramsAsHash
	 * Send parameters as a collection of named arguments (defaults to <tt>true</tt>). Providing a
	 * <tt>{@link #paramOrder}</tt> nullifies this configuration.
	 */
	paramsAsHash: true,

	// protected
	doRequest : function(action, rs, params, reader, writer, callback, scope, options) {
		var args = [];
		var directFn = this.api[action];
		switch (action) {
			case 'save':
				args.push(params[reader.meta.idProperty]);	// <-- save(Integer/Integer[], Hash/Hash[])
				args.push(params[writer.dataProperty]);
				break;
			case 'destroy':
				args.push(params[writer.dataProperty]);		// <-- destroy(Int/Int[])
				break;
			case 'create':
				args.push(params[writer.dataProperty]);		// <-- create(Hash)
				break;
			case 'load':
				args.push(params);							// <-- load(Hash)
				break;
		}
		args.push(this.createCallback(action, reader, callback, scope, options));
		directFn.apply(window, args);
	},

	// private
	createCallback : function(action, reader, callback, scope, arg) {
		return {
			callback: (action == 'load') ? function(result, e){
				if (!e.status) {
					this.fireEvent(action+"exception", this, e, result);
					callback.call(scope, null, arg, false);
					return;
				}
				var records;
				try {
					records = reader.readRecords(result);
				}
				catch (ex) {
					this.fireEvent(action+"exception", this, e, result, ex);
					callback.call(scope, null, arg, false);
					return;
				}
				this.fireEvent(action, this, e, arg);
				callback.call(scope, records, arg, true);
			} : function(result, e){
				if(!e.status){
					this.fireEvent(action+"exception", this, e);
        			callback.call(scope, null, e, false);
        			return;
				}
		        this.fireEvent(action, this, result, e, arg);
		        callback.call(scope, result, e, true);
			},
			scope: this
		}
	}
});

/**
 * @class Ext.data.DirectProxy
 * @extends Ext.data.DataProxy
 */
Ext.data.DirectProxy = function(config){
    Ext.apply(this, config);
    if(typeof this.paramOrder == 'string'){
        this.paramOrder = this.paramOrder.split(/[\s,|]/);
    }
    Ext.data.DirectProxy.superclass.constructor.call(this);
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
	
	/**
	 * @cfg {Function} directFn
	 * The {@link Ext.Direct} function which has been imported from the server-side
	 */	
	directFn: undefined,

	load: function(params, reader, cb, scope, arg){
		if(this.fireEvent("beforeload", this, params) !== false) {
			var args = [];
			if(this.paramOrder){
				for(var i = 0, len = this.paramOrder.length; i < len; i++){
					args.push(params[this.paramOrder[i]]);
				}
			}else if(this.paramsAsHash){
				args.push(params);
			}
			args.push({
				callback: function(result, e){
					if(!e.status){
						this.fireEvent("loadexception", this, e, result);
						cb.call(scope, null, arg, false);
		            			return;
					}
					var rs;
					try {
					    rs = reader.readRecords(result);
					}catch(ex){
					    this.fireEvent("loadexception", this, e, result, ex);
					    cb.call(scope, null, arg, false);
					    return;
					}
					this.fireEvent("load", this, e, arg);
					cb.call(scope, rs, arg, true);
				},
				scope: this
			});

			this.directFn.apply(window, args);
		} else {
			cb.call(scope || this, null, arg, false);
		}
	}
});
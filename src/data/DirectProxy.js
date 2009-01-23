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
	 * @cfg paramOrder {Array/String} An array of params and the order which they must be executed on the server-side. Can also be specified as a comma or pipe delimited list. Examples ['arg1','arg2'] or 'arg1|arg2' or 'arg1,arg2'
	 */
	paramOrder: undefined,
	
	/**
	 * @cfg paramsAsHash {Boolean}
	 * Send parameters as a collection of named arguments. Defaults to true. Providing a paramOrder immediately overrides this configuration.
	 */	
	paramsAsHash: true,
	
	/**
	 * @cfg directFn {Function}
	 * The Ext.Direct function which has been imported from the server-side
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
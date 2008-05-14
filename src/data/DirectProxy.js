Ext.data.DirectProxy = function(config){
	Ext.apply(this, config);
	Ext.data.DirectProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DirectProxy, Ext.data.DataProxy, {

	paramOrder: undefined,
	paramsAsHash: true,
	directFn: undefined,
    
    load: function(params, reader, cb, scope, arg){
		if(this.fireEvent("beforeload", this, params) !== false) {
			var args = [];
			if(this.paramsAsHash){
				args.push(params);
			}else if(this.paramOrder){
				for(var i = 0, len = this.paramOrder.length; i < len; i++){
					args.push(params[this.paramOrder[i]]);
				}
			}
			args.push({
				callback: function(result, e){
					if(!e.success){
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
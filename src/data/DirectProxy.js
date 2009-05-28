/**
 * @class Ext.data.DirectProxy
 * @extends Ext.data.DataProxy
 */
Ext.data.DirectProxy = function(config){
    Ext.apply(this, config);
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

    /**
     * @cfg {Function} directFn
     * Function to call when executing a request.  directFn is a simple alternative to defining the api configuration-parameter
     * for Store's which will not implement a full CRUD api.
     */
    directFn : undefined,

    // protected
    doRequest : function(action, rs, params, reader, callback, scope, options) {
        var args = [];
        var directFn = this.api[action] || this.directFn;

        switch (action) {
            case Ext.data.Api.actions.create:
                args.push(params[reader.meta.root]);		// <-- create(Hash)
                break;
            case Ext.data.Api.actions.read:
                if(this.paramOrder){
                    for(var i = 0, len = this.paramOrder.length; i < len; i++){
                        args.push(params[this.paramOrder[i]]);
                    }
                }else if(this.paramsAsHash){
                    args.push(params);
                }
                break;
            case Ext.data.Api.actions.update:
                args.push(params[reader.meta.idProperty]);  // <-- save(Integer/Integer[], Hash/Hash[])
                args.push(params[reader.meta.root]);
                break;
            case Ext.data.Api.actions.destroy:
                args.push(params[reader.meta.root]);        // <-- destroy(Int/Int[])
                break;
        }

        var trans = {
            params : params || {},
            callback : callback,
            scope : scope,
            arg : options,
            reader: reader
        };

        args.push(this.createCallback(action, rs, trans), this);
        directFn.apply(window, args);
    },

    // private
    createCallback : function(action, rs, trans) {
        return function(result, e) {
            if (action === Ext.data.Api.actions.read) {
                this.onRead(action, trans, result, e);
            } else {
                this.onWrite(action, trans, result, e, rs);
            }
        }
    },
    /**
     * Callback for read actions
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Object} trans The request transaction object
     * @param {Object} res The server response
     * @protected
     */
    onRead : function(action, trans, result, e) {
        if (!e.status) {
            this.fireEvent("loadexception", this, e, trans.arg);
            callback.call(trans.scope, null, trans.arg, false);
            return;
        }
        var records;
        try {
            records = trans.reader.readRecords(result);
        }
        catch (ex) {
            this.fireEvent("responseexception", this, action, result, e, ex);
            trans.callback.call(trans.scope, null, trans.arg, false);
            return;
        }
        this.fireEvent("load", this, e, trans.arg);
        trans.callback.call(trans.scope, records, trans.arg, true);
    },
    /**
     * Callback for write actions
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Object} trans The request transaction object
     * @param {Object} res The server response
     * @protected
     */
    onWrite : function(action, trans, result, e, rs) {
         if(!e.status){
            this.fireEvent("writeexception", this, action, e, rs, trans.arg);
            trans.callback.call(trans.scope, result, e, false);
            return;
        }
        this.fireEvent("write", this, action, result, e, rs, trans.arg);
        trans.callback.call(trans.scope, result, e, true);
    }
});


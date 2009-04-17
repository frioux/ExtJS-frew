/**
 * @class Ext.data.DataProxy
 * @extends Ext.util.Observable
 * This Class is an abstract base Class for implementations which provide retrieval of
 * unformatted data objects.<br>
 *
 * <p>DataProxy implementations are usually used in conjunction with an implementation of {@link Ext.data.DataReader}
 * (of the appropriate type which knows how to parse the data object) to provide a block of
 * {@link Ext.data.Records} to an {@link Ext.data.Store}.</p>
 *
 * <p>Custom implementations must implement either the <b>doRequest</b> method (preferred) or the
 * load method (deprecated). See
 * {@link Ext.data.HttpProxy}.{@link Ext.data.HttpProxy#doRequest doRequest} or
 * {@link Ext.data.HttpProxy}.{@link Ext.data.HttpProxy#load load} for additional details.</p>
 * 
 * <p><b><u>Example 1</u></b></p>
 * <pre><code>
proxy: new Ext.data.ScriptTagProxy({
    {@link Ext.data.Connection#url url}: 'http://extjs.com/forum/topics-remote.php'
}),
 * </code></pre>
 * 
 * <p><b><u>Example 2</u></b></p>
 * <pre><code>
proxy : new Ext.data.HttpProxy({
    {@link Ext.data.Connection#method method}: 'GET',
    {@link Ext.data.HttpProxy#prettyUrls prettyUrls}: false,
    url: 'local/default.php', // see options parameter for {@link Ext.Ajax#request}
    {@link #api}: {
        // all actions except the following will use above url
        create  : 'local/new.php',
        save    : 'local/update.php'
    }
}),
 * </code></pre>
 */
Ext.data.DataProxy = function(conn){
    // make sure we have a config object here to support ux proxies.
    // All proxies should now send config into superclass constructor.
    conn = conn || {};

    Ext.apply(this, conn);

    /**
     * @cfg {Object} api
     * Specific urls to call on CRUD action methods "load", "create", "save" and "destroy".
     * Defaults to:
     * <pre><code>
api: {
    load    : undefined,
    create  : undefined,
    save    : undefined,
    destroy : undefined
}
     * </code></pre>
     * <p>If the specific url for a given CRUD action is undefined, the CRUD action request
     * will be directed to the configured <tt>{@link Ext.data.Connection#url url}</tt>.</p>
     * <br><p><b>Note</b>: To modify the url for an action dynamically the appropriate api
     * property should be modified before the action is requested using the corresponding before
     * action event.  For example to modify the url associated with the load action:
     * <pre><code>
// modify the url for the action
myStore.on({
    beforeload: {
        fn: function (store, options) {
            store.proxy.url = 'changed1.php';
            // proxy url will be superseded by api (only if proxy created to use ajax):            
            store.proxy.api.load = 'changed2.php';
        }
    }
});
     * </code></pre>
     * </p>
     */
    this.api = conn.api || {
        load: undefined,
        save: undefined,
        create: undefined,
        destroy: undefined
    };

    this.addEvents(
        /**
         * @event beforeload
         * Fires before a network request is made to retrieve a data object.
         * @param {Object} this
         * @param {Object} params The params object passed to the {@link #request} function
         */
        'beforeload',
        /**
         * @event load
         * Fires before the load method's callback is called.
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'load',
        /**
         * @event beforesave
         * Fires before a network request is made to save a data object
         * @param {Object} this
         * @param {Object} params The params object passed to the {@link #request} function
         */
        'beforesave',
        /**
         * @event save
         * Fires before the request-callback is called
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'save',
        /**
         * @event beforedestroy
         * Fires before a network request is made to destroy an object
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'beforedestroy',
        /**
         * @event destroy
         * Fires before a the request-callback is called
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'destroy',
        /**
         * @event beforecreate
         * Fires before a network request is made to create an object
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'beforecreate',
        /**
         * @event create
         * Fires before a the request-callback is called
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'create'
    );
    Ext.data.DataProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable, {

    /**
     * load
     * old-school load method with old method signature.  Simply a proxy-method -> doRequest
     * @deprecated
     * @param {Object} params
     * @param {Object} reader
     * @param {Object} callback
     * @param {Object} scope
     * @param {Object} arg
     */
    load : function(params, reader, callback, scope, arg) {
        this.doRequest('load', null, params, reader, null, cb, scope, arg);
    },

    /**
     * request
     * All proxy actions are executed through this method.  Automatically fires the "before" + action event
     * @param {String} action
     * @param {Ext.data.Record/Ext.data.Record[]} rs
     * @param {Object} params
     * @param {Ext.data.DataReader} reader
     * @param {Ext.data.DataWriter} writer
     * @param {Function} cb
     * @param {Object} scope
     * @param {Object} options
     * @private
     */
    request : function(action, rs, params, reader, writer, cb, scope, options) {
        if (!this.api[action]) {
            if (this.url) {	// <-- if an url was defined, set the appropriate api action to this url
                this.api[action] = this.url;
            }
            else if (typeof(this[action]) != 'function') {	// <-- To keep pre3.0 proxies working, look for a method matching the action (ie: 'load')
                throw new Error('No proxy url defined for api action "' + action + '"');
            }
        }
        if (this.fireEvent("before" + action, this, params) !== false) {
            this.doRequest.apply(this, arguments);
        }
        else {
            cb.call(scope || this, null, arg, false);
        }
    },

    /**
     * @cfg {Function} doRequest Abstract method that should be implemented in all subclasses
     * (eg: {@link Ext.data.HttpProxy#doRequest HttpProxy.doRequest},
     * {@link Ext.data.DirectProxy#doRequest DirectProxy.doRequest}).
     */
    doRequest : function(action, rs, params, reader, writer, cb, scope, options) {
        // default implementation of doRequest for backwards compatibility with 2.0 proxies.
        // If we're executing here, the action is probably "load".
        // Call with the pre-3.0 method signature.
        this[action](params, reader, cb, scope, options);
    }
});

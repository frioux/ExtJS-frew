/**
 * @class Ext.data.DataProxy
 * @extends Ext.util.Observable
 * <p>This Class is an abstract base Class for implementations which provide retrieval of
 * unformatted data objects.</p>
 *
 * <p>DataProxy implementations are usually used in conjunction with an implementation of {@link Ext.data.DataReader}
 * (of the appropriate type which knows how to parse the data object) to provide a block of
 * {@link Ext.data.Records} to an {@link Ext.data.Store}.</p>
 *
 * <p>Custom implementations must implement either the <code><b>doRequest</b></code> method (preferred) or the
 * <code>load</code> method (deprecated). See
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

    // This line caused a bug when people use custom Connection object having its own request method.
    // http://extjs.com/forum/showthread.php?t=67194.  Just set api and url for now.
    //Ext.applyIf(this, conn);

    this.api = conn.api;
    this.url = conn.url;

    /**
     * @cfg {Object} api
     * Specific urls to call on CRUD action methods "load", "create", "save" and "destroy".
     * Defaults to:<pre><code>
api: {
    load    : undefined,
    create  : undefined,
    save    : undefined,
    destroy : undefined
}
</code></pre>
     * <p>If the specific URL for a given CRUD action is undefined, the CRUD action request
     * will be directed to the configured <tt>{@link Ext.data.Connection#url url}</tt>.</p>
     * <br><p><b>Note</b>: To modify the URL for an action dynamically the appropriate API
     * property should be modified before the action is requested using the corresponding before
     * action event.  For example to modify the URL associated with the load action:
     * <pre><code>
// modify the url for the action
myStore.on({
    beforeload: {
        fn: function (store, options) {
            // use <tt>{@link Ext.data.HttpProxy#setUrl setUrl}</tt> to change the URL for *just* this request.
            store.proxy.setUrl('changed1.php');

            // set optional second parameter to true to make this URL change permanent, applying this URL for all subsequent requests.
            store.proxy.setUrl('changed1.php', true);

            // manually set the <b>private</b> connection URL.  <b>Warning:</b>  Accessing the private URL property like should be avoided.  Please use the public
            // method <tt>{@link Ext.data.HttpProxy#setUrl setUrl}</tt> instead, shown above.  It should be noted that changing the URL like
            // this will affect the URL for just this request.  Subsequent requests will use the API or URL defined in your initial
            // proxy configuration.
            store.proxy.conn.url = 'changed1.php';

            // proxy URL will be superseded by API (only if proxy created to use ajax):
            // It should be noted that proxy API changes are permanent and will be used for all subsequent requests.
            store.proxy.api.load = 'changed2.php';

            // However, altering the proxy API should be done using the public method <tt>{@link Ext.data.DataProxy#setApi setApi}</tt> instead.
            store.proxy.setApi('load', 'changed2.php');

            // Or set the entire API with a config-object.  When using the config-object option, you must redefine the <b>entire</b> API --
            // not just a specific action of it.
            store.proxy.setApi({
                load: 'changed_load.php',
                save: 'changed_save.php',
                destroy: 'changed_destroy.php',
                create: 'changed_create.php'
            });
        }
    }
});
     * </code></pre>
     * </p>
     */

    // Verify valid api or define if not set.
    if (this.api) {
        var valid = Ext.data.Api.isValid(this.api);
        if (valid !== true) {
            throw new Ext.data.Api.Error('invalid', 'DataProxy.js', valid);
        }
        // Prepare the proxy api.  Ensures all API-actions are defined with the Object-form.
        Ext.data.Api.prepare(this.api);
    }
    else {
        this.api = {};
        this.api[Ext.data.Api.CREATE]     = undefined;
        this.api[Ext.data.Api.READ]       = undefined;
        this.api[Ext.data.Api.UPDATE]     = undefined;
        this.api[Ext.data.Api.DESTROY]    = undefined;
    }

    this.addEvents(
        /**
         * @event beforeload (beforeExt.data.Api.READ)
         * Fires before a network request is made to retrieve a data object.
         * @param {Object} this
         * @param {Object} params The params object passed to the {@link #request} function
         */
        'before'+Ext.data.Api.READ,
        /**
         * @event load (Ext.data.Api.READ)
         * Fires before the load method's callback is called.
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        Ext.data.Api.READ,
        /**
         * @event beforewrite
         * Fires before a network request is made to CREATE, UPDATE, DESTROY an object
         * @param {Object} this
         * @param {String} action [Ext.data.Api.CREATE|Ext.data.Api.READ|Ext.data.Api.UPDATE|Ext.data.Api.DESTROY]
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'beforewrite',
        /**
         * @event write
         * Fires before a the request-callback is called
         * @param {Object} this
         * @param {String} action [Ext.data.Api.CREATE|READ|UPDATE|DESTROY]
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'write'
    );
    Ext.data.DataProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable, {

    /**
     * <p>Redefines the the Proxy's API or a single action of an API. Can be called with two method signatures.</p>
     * <p>If called with an object as the only parameter, the object should redefine the entire API, eg:</p><code><pre>
proxy.setApi({
    load: '/users/load',
    save: '/users/save',
    create: '/users/create'
    destroy: '/users/destroy'
});
</pre></code>
     * <p>If called with two parameters, the first parameter should be a string specifying the API action to
     * redefine and the second parameter should be the URL (or function if using DirectProxy) to call for that action, eg:</p><code><pre>
proxy.setApi(Ext.data.Api.READ, '/users/new_load_url');
</pre></code>
     * @param {Mixed} api An API specification object, or the name of an action.
     * @param {String/Function} url The URL (or function if using DirectProxy) to call for the action.
     */
    setApi : function() {
        if (arguments.length == 1) {
            var valid = Ext.data.Api.isValid(arguments[0]);
            if (valid === true) {
                this.api = arguments[0];
            }
            else {
                throw new Ext.data.Api.Error('invalid', 'DataProxy.js', valid);
            }
        }
        else if (arguments.length == 2) {
            if (!Ext.data.Api.isVerb(arguments[0])) {
                throw new Ext.data.Api.Error('invalid', 'DataProxy.js', arguments[0]);
            }
            this.api[arguments[0]] = arguments[1];
        }
        Ext.data.Api.prepare(this.api, this.action);
    },

    /**
     * request
     * All proxy actions are executed through this method.  Automatically fires the "before" + action event
     * @param {String} action
     * @param {Ext.data.Record/Ext.data.Record[]/null} rs Will be null when action is 'load'
     * @param {Object} params
     * @param {Ext.data.DataReader} reader
     * @param {Function} callback
     * @param {Object} scope
     * @param {Object} options
     * @private
     */
    request : function(action, rs, params, reader, callback, scope, options) {
        params = params || {};
        if ((action == Ext.data.Api.READ) ? this.fireEvent("before"+action, this, params, options) : this.fireEvent("beforewrite", this, action, params, options) !== false) {
            this.doRequest.apply(this, arguments);
        }
        else {
            callback.call(scope || this, null, arg, false);
        }
    },

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
        this.doRequest(Ext.data.Api.READ, null, params, reader, callback, scope, arg);
    },

    /**
     * @cfg {Function} doRequest Abstract method that should be implemented in all subclasses
     * (eg: {@link Ext.data.HttpProxy#doRequest HttpProxy.doRequest},
     * {@link Ext.data.DirectProxy#doRequest DirectProxy.doRequest}).
     */
    doRequest : function(action, rs, params, reader, callback, scope, options) {
        // default implementation of doRequest for backwards compatibility with 2.0 proxies.
        // If we're executing here, the action is probably "load".
        // Call with the pre-3.0 method signature.
        this[action](params, reader, callback, scope, options);
    }
});

/**
 * DataProxy Error extension.
 * constructor
 * @param {String} name
 * @param {Record/Array[Record]/Array}
 */
Ext.data.DataProxy.Error = Ext.extend(Ext.Error, {
    cls: 'Ext.data.DataProxy',
    render : function(name, data) {
        var msg = name;
        switch(name) {
            case 'api-invalid':
                msg = 'recieved an invalid API-configuration "' + data.join(', ') + '".  Please ensure your proxy API-configuration contains only the actions "' + Ext.data.Api.getVerbs().join(', ');
                break;
        }
        return msg;
    }
});
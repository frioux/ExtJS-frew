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

    Ext.apply(this, conn);

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
    if (conn.api) {
       var valid = Ext.data.isValidApi(conn.api);
       if (valid !== true) {
           throw new Error('Ext.data.DataProxy#constructor recieved an invalid API-configuration "' + valid.join(', ') + '".  Please ensure your proxy API-configuration contains only the actions "' + Ext.data.getCrudActions().join(', '));
       }
    }
    else {
        this.api = {};
        this.api[Ext.data.CREATE]     = undefined;
        this.api[Ext.data.READ]       = undefined;
        this.api[Ext.data.UPDATE]     = undefined;
        this.api[Ext.data.DESTROY]    = undefined;
    }

    this.addEvents(
        /**
         * @event beforeload (beforeExt.data.READ)
         * Fires before a network request is made to retrieve a data object.
         * @param {Object} this
         * @param {Object} params The params object passed to the {@link #request} function
         */
        'before'+Ext.data.READ,
        /**
         * @event load (Ext.data.READ)
         * Fires before the load method's callback is called.
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        Ext.data.READ,
        /**
         * @event beforesave (beforeExt.data.UPDATE)
         * Fires before a network request is made to save a data object
         * @param {Object} this
         * @param {Object} params The params object passed to the {@link #request} function
         */
        'before'+Ext.data.UPDATE,
        /**
         * @event save (Ext.data.UPDATE)
         * Fires before the request-callback is called
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        Ext.data.UPDATE,
        /**
         * @event beforedestroy (Ext.data.DESTROY)
         * Fires before a network request is made to destroy an object
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'before'+Ext.data.DESTROY,
        /**
         * @event destroy (Ext.data.DESTROY)
         * Fires before a the request-callback is called
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        Ext.data.DESTROY,
        /**
         * @event beforecreate (beforeExt.data.CREATE)
         * Fires before a network request is made to create an object
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        'before' + Ext.data.CREATE,
        /**
         * @event create (Ext.data.CREATE)
         * Fires before a the request-callback is called
         * @param {Object} this
         * @param {Object} o The data object
         * @param {Object} arg The callback's arg object passed to the {@link #request} function
         */
        Ext.data.CREATE
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
proxy.setApi(Ext.data.READ, '/users/new_load_url');
</pre></code>
     * @param {Mixed} api An API specification object, or the name of an action.
     * @param {String/Function} url The URL (or function if using DirectProxy) to call for the action.
     */
    setApi : function() {
        if (arguments.length == 1) {
            var valid = Ext.data.isValidApi(arguments[0]);
            if (valid === true) {
                this.api = arguments[0];
            }
            else {
                throw new Error('Ext.data.DataProxy#setApi received invalid API action(s) "' + valid.join(', ') + '".  Valid API actions are: ' + Ext.data.getCrudActions().join(', '));
            }
        }
        else if (arguments.length == 2) {
            if (!Ext.data.isCrudAction(arguments[0])) {
                throw new Error('Ext.data.DataProxy#setApi received an invalid API action "' + arguments[0] + '".  Valid API actions are: ' + Ext.data.getCrudActions().join(', '))
            }
            this.api[arguments[0]] = arguments[1];
        }
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
        if (this.fireEvent("before" + action, this, params) !== false) {
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
        this.doRequest(Ext.data.READ, null, params, reader, callback, scope, arg);
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

// TODO: Move these consts / static-functions somewhere more thoughtful?
/**
 * @const Ext.data.CREATE Text representing the remote-action "create"
 */
Ext.data.CREATE   = 'create';
/**
 * @const Ext.data.READ Text representing the remote-action for remotely reading/loading data from server.
 * It important these names not be changed since they sometimes map to a method on another object, like Ext.data.DataWriter for example.
 * The name "load" is important for maintaining backwards-compatibility with Ext-2.0, as well.
 */
Ext.data.READ     = 'load';
/**
 * @const Ext.data.UPDATE Text representing the remote-action to rupdate records on server.
 * The word update would be preferred here, instead of "save" but "update" has already been used for events pre-Ext3.
 */
Ext.data.UPDATE   = 'save';
/**
 * @const Ext.data.UPDATE Text representing the remote-action to destroy records on server.
 */
Ext.data.DESTROY  = 'destroy';

/**
 * Returns a list of names of all available CRUD actions
 * @static
 * @return {String[]}
 */
Ext.data.getCrudActions = function(){
    return [Ext.data.CREATE, Ext.data.READ, Ext.data.UPDATE, Ext.data.DESTROY];
};

/**
 * Returns true if supplied action-name is a valid API action defined in CRUD constants
 * Ext.data.CREATE, Ext.data.READ, Ext.data.UPDATE, Ext.data.DESTROY
 * @param {String} action
 * @param {String[]}(Optional) List of availabe CRUD actions.  Pass in list when executing multiple times for efficiency.
 * @return {Boolean}
 * @static
 */
Ext.data.isCrudAction = function(action, crud) {
    var found = false;
    crud = crud || Ext.data.getCrudActions();
    for (var n=0,len=crud.length;n<len;n++) {
        if (crud[n] == action) {
           found = true;
           break;
        }
    }
    return found;
};

/**
 * Returns true if the supplied API is valid; that is, that all keys match defined CRUD-actions,
 * Ext.data.CREATE, Ext.data.READ, Ext.data.UPDATE, Ext.data.DESTROY.  Otherwise returns an array of mistakes.
 * @return {String[]||true}
 * @static
 */
Ext.data.isValidApi = function(api){
    var invalid = [];
    var crud = Ext.data.getCrudActions();
    for (var action in api) {
        if (!Ext.data.isCrudAction(action, crud)) {
            invalid.push(action);
        }
    }
    return (!invalid.length) ? true : invalid;
};
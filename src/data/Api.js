/**
 * @class Ext.data.Api
 * @extends Object
 * Ext.data.Api is a singleton designed to manage the data API including methods for validating
 * a developer's DataProxy API.  Defines CONSTANTS for custom and CRUD actions create, read, update and destroy.
 * @singleton
 */
Ext.data.Api = (function() {

    // private validActions.  As each Api-action is validated through Ext.data.Api.isAction, its validity gets
    // cached here so we don't have to loop thorugh the api actions each time.
    var validActions = {};

    return {
        /**
         * Defined actions corresponding to remote actions:
         * <pre>
         * CREATE  Text representing the remote-action to create records on server.
         * READ    Text representing the remote-action to read/load data from server.
         * UPDATE  Text representing the remote-action to update records on server.
         * DESTROY Text representing the remote-action to destroy records on server.
         * </pre>
         * @property actions
         * @type Object
         */
        actions : {
            create  : 'create',
            // although 'read' would be preferred, load is used for backward compatibility
            // However, with the introduction of the Ext.data.Api singleton, we my be able to use "read" now.
            read    : 'load',
            // although 'update' would be preferred, 'save' has already been used for events pre-Ext3.
            // However, with the introduction of the Ext.data.Api singleton, we may be able to use "udpate" now.
            update  : 'save',
            destroy : 'destroy'
        },

        /**
         * Defined {CRUD action}:{HTTP method} pairs corresponding to remote actions for RESTful proxies.
         * Defaults to:
         * <pre><code>
restActions : {
    create  : 'POST',
    read    : 'GET',
    update  : 'PUT',
    destroy : 'DELETE'
},
         * </code></pre>
         */
        restActions : {
            create  : 'POST',
            read    : 'GET',
            update  : 'PUT',
            destroy : 'DELETE'
        },

        /**
         * Returns true if supplied action-name is a valid API action defined in <code>{@link #actions}</code> constants
         * @param {String} action
         * @param {String[]}(Optional) List of available CRUD actions.  Pass in list when executing multiple times for efficiency.
         * @return {Boolean}
         */
        isAction : function(action) {
            if (validActions[action]) {
                return true;    // <-- This action is known to be valid.  return immediately.
            }
            for (var k in this.actions) {
                if (this.actions[k] === action)  {
                    validActions[action] = true;    // <-- cache the validity of this action.
                    break;
                }
            }
            return (validActions[action]) ? true : false;
        },
        /**
         * Returns true if the supplied API is valid; that is, check that all keys match defined actions
         * otherwise returns an array of mistakes.
         * @return {String[]||true}
         */
        isValid : function(api){
            var invalid = [];
            var crud = this.actions; // <-- cache a copy of the actions.
            for (var action in api) {
                if (!(action in crud)) {
                    invalid.push(action);
                }
            }
            return (!invalid.length) ? true : invalid;
        },

        /**
         * Returns true if the supplied verb upon the supplied proxy points to a unique url in that none of the other api-actions
         * point to the same url.  The question is important for deciding whether to insert the "xaction" HTTP parameter within an
         * Ajax request.  This method is used internally and shouldn't generally need to be called directly.
         * @param {Ext.data.DataProxy} proxy
         * @param {String} verb
         * @return {Boolean}
         */
        hasUniqueUrl : function(proxy, verb) {
            var url = proxy.api[verb].url;
            var unique = true;
            for (var action in proxy.api) {
                if ((unique = (action === verb) ? true : (proxy.api[action].url != url) ? true : false) === false) {
                    break;
                }
            }
            return unique;
        },

        /**
         * This method is used internally by <tt>{@link Ext.data.DataProxy DataProxy}</tt> and should not generally need to be used directly.
         * Each action of a DataProxy api can be initially defined as either a String or an Object.  When specified as an object,
         * one can explicitly define the HTTP method (GET|POST) to use for each CRUD action.  This method will prepare the supplied API, setting
         * each action to the Object form.  If your API-actions do not explicitly define the HTTP method, the "method" configuration-parameter will
         * be used.  If the method configuration parameter is not specified, POST will be used.
         <code><pre>
new Ext.data.HttpProxy({
    method: "POST",     // <-- default HTTP method when not specified.
    api: {
        create: 'create.php',
        load: 'read.php',
        save: 'save.php',
        destroy: 'destroy.php'
    }
});

// Alternatively, one can use the object-form to specify the API
new Ext.data.HttpProxy({
    api: {
        load: {url: 'read.php', method: 'GET'},
        create: 'create.php',
        destroy: 'destroy.php',
        save: 'update.php'
    }
});
        </pre></code>
         *
         * @param {Ext.data.DataProxy} proxy
         */
        prepare : function(proxy) {
            if (!proxy.api) {
                proxy.api = {}; // <-- No api?  create a blank one.
            }
            for (var verb in this.actions) {
                var action = this.actions[verb];
                proxy.api[action] = proxy.api[action] || proxy.url;
                if (proxy.api[action] == undefined) {
                    throw new Ext.data.Api.Error('action-url-undefined', 'Api.js', action);
                }
                if (typeof(proxy.api[action]) == 'string') {
                    proxy.api[action] = {
                        url: proxy.api[action]
                    };
                }
            }
        },

        /**
         * Prepares a supplied Proxy to be RESTful.
         * @param {Ext.data.DataProxy} proxy
         */
        restify : function(proxy) {
            proxy.restful = true;
            for (var verb in this.restActions) {
                proxy.api[this.actions[verb]].method = this.restActions[verb];
            }
        }
    };
})();

/**
 * @class Ext.Error
 * @extends Object
 * <p>The Ext.Error class wraps the native Javascript Error class similar to how Ext.Element wraps a DomNode.
 * To display an error to the client call the {@link #toConsole} method which will check for the
 * existence of Firebug.</p>
 *
 * TODO: Move to Ext.js?
 *
<code><pre>
try {
    generateError({
        foo: 'bar'
    });
}
catch (e) {
    e.toConsole();
}
function generateError(data) {
    throw new Ext.Error('foo-error', 'Foo.js', data);
}

</pre></code>
 * @param {String} id A simple label for the error for lookup.
 * @param {String} file The file where the error occurred.
 * @param {Mixed} data context-data.
 */
Ext.Error = function(id, file, data) {
    this.message = this.render.apply(this, arguments);
    this.error = new Error(this.message, file);
    this.error.name = this.cls;
    this.id = id;
}
Ext.Error.prototype = {
    /**
     * The ClassName of this Error.
     * @property cls
     * @type String
     */
    cls: 'Ext.Error',
    /**
     * The id of the error.
     * @property id
     * @type String
     */
    id : undefined,

    /**
     * Abstract method to render error message.  All Error extensions should override this method.
     */
    render : function(id, file, data) {
       return this.cls + ' ' + id;
    },

    /**
     * Attempts to output the exception info on FireBug console if exists.
     */
    toConsole : function() {
        if (typeof(console) == 'object' && typeof(console.error) == 'function') {
            console.error(this.error);
        }
        else {
            alert("Error: " + this.cls + ' ' + this.message);   // <-- ugh.  fix this before official release.
        }
    },

    /**
     * toString
     */
    toString : function() {
        return this.error.toString();
    }
};

/**
 * Error class for Ext.data.Api errors.
 */
Ext.data.Api.Error = Ext.extend(Ext.Error, {
    cls: 'Ext.data.Api',
    render : function(name, file, data) {
        switch (name) {
            case 'action-url-undefined':
                return 'No fallback url defined for action "' + data + '".  When defining a DataProxy api, please be sure to define an url for each CRUD action in Ext.data.Api.actions or define a default url in addition to your api-configuration.';
            case 'invalid':
                // make sure data is an array so we can call join on it.
                data = (!Ext.isArray(data)) ? [data] : data;
                return 'received an invalid API-configuration "' + data.join(', ') + '".  Please ensure your proxy API-configuration contains only the actions defined in Ext.data.Api.actions';
            case 'invalid-url':
                return 'Invalid url "' + data + '".  Please review your proxy configuration.';
            case 'execute':
                return 'Attempted to execute an unknown action "' + data + '".  Valid API actions are defined in Ext.data.Api.actions"';
            default:
                return 'Unknown Error "' + name + '"';
        }
    }
});
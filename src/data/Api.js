/**
 * Ext.data.Api is a singleton designed to manage the data API including methods for validating
 * a developer's DataProxy API.  Defines CONSTANTS for CRUD-actions create, read, update and destroy.
 * @singleton
 */
Ext.data.Api = (function() {

    return {
        /**
         * @const Ext.data.Api.CREATE Text representing the remote-action "create"
         */
        CREATE  : 'create',
        /**
         * @const Ext.data.Api.READ Text representing the action for remotely reading/loading data from server.
         * The word "load" is important for maintaining backwards-compatibility with Ext-2.0, as well.  "read" would be preferred.
         * However, with the introduction of Ext.data.Api singleton, we my be able to use "read" now.
         */
        READ    : 'load',
        /**
         * @const Ext.data.Api.UPDATE Text representing the remote-action to rupdate records on server.
         * The word "update" would be preferred here, instead of "save" but "update" has already been used for events pre-Ext3.
         * However, since the introduction of the Ext.data.Api singleton, we may be able to use "udpate" now.
         */
        UPDATE  : 'save',
        /**
         * @const Ext.data.Api.DESTROY Text representing the remote-action to destroy records on server.
         */
        DESTROY : 'destroy',

        /**
         * Returns a list of names of all available CRUD actions
         * @return {String[]}
         */
        getVerbs : function(){
            return [this.CREATE, this.READ, this.UPDATE, this.DESTROY];
        },
        /**
         * Returns true if supplied action-name is a valid API action defined in CRUD constants
         * Ext.data.Api.CREATE, Ext.data.Api.READ, Ext.data.Api.UPDATE, Ext.data.Api.DESTROY
         * @param {String} action
         * @param {String[]}(Optional) List of availabe CRUD actions.  Pass in list when executing multiple times for efficiency.
         * @return {Boolean}
         */
        isVerb : function(action, crud) {
            var found = false;
            crud = crud || this.getVerbs();
            for (var n=0,len=crud.length;n<len;n++) {
                if (crud[n] == action) {
                   found = true;
                   break;
                }
            }
            return found;
        },
        /**
         * Returns true if the supplied API is valid; that is, that all keys match defined CRUD-actions,
         * Ext.data.Api.CREATE, Ext.data.Api.READ, Ext.data.Api.UPDATE, Ext.data.Api.DESTROY.  Otherwise returns an array of mistakes.
         * @return {String[]||true}
         */
        isValid : function(api){
            var invalid = [];
            var crud = this.getVerbs(); // <-- cache a copy of teh verbs.
            for (var action in api) {
                if (!this.isVerb(action, crud)) {   // <-- send cache of verbs into isVerb.  This call is only reason for isVerb to accept 2nd param.
                    invalid.push(action);
                }
            }
            return (!invalid.length) ? true : invalid;
        }
    }
})();

/**
 * General Ext Error class.  Wraps the Javascript Error class as Ext.Element wraps a DomNode.
 * To display the error to client, call Ext.Error#toConsole which will check for the existence of Firebug.
 * TODO: Move to Ext.js?
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
     * @property {String} cls
     * The ClassName of this Error.
     * @param {Object} name
     */
    cls: 'Ext.Error',
    /**
     * @property {String} id
     * The id of the error.
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
            case 'invalid':
                // make sure data is an array so we can call join on it.
                data = (!Ext.isArray(data)) ? [data] : data;
                return 'recieved an invalid API-configuration "' + data.join(', ') + '".  Please ensure your proxy API-configuration contains only the actions "' + Ext.data.Api.getVerbs().join(', ');
                break;
            case 'invalid-url':
                return 'Invalid url "' + data + '".  Please review your proxy configuration.';
                break;
            case 'execute':
                return 'Attempted to execute an unknown action "' + data + '".  Valid API actions are "' + Ext.data.Api.getVerbs().join(', ');
                break;
            default:
                 return 'Unknown Error "' + name + '"';
        }
    }
});


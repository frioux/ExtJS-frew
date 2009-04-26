/**
 * Ext.data.Api is a singleton designed to manage the data API including methods for validating
 * a developer's DataProxy / Ext.Direct API.  Defines CONSTANTS for CRUD-actions create, read, update and destroy.
 */
Ext.data.Api = (function() {

    return {
        /**
         * @const Ext.data.Api.CREATE Text representing the remote-action "create"
         */
        CREATE : 'create',
        /**
         * @const Ext.data.Api.READ Text representing the remote-action for remotely reading/loading data from server.
         * It important these names not be changed since they sometimes map to a method on another object, like Ext.data.DataWriter for example.
         * The name "load" is important for maintaining backwards-compatibility with Ext-2.0, as well.
         */
        READ     : 'load',
        /**
         * @const Ext.data.Api.UPDATE Text representing the remote-action to rupdate records on server.
         * The word update would be preferred here, instead of "save" but "update" has already been used for events pre-Ext3.
         */
        UPDATE   : 'save',
        /**
         * @const Ext.data.Api.UPDATE Text representing the remote-action to destroy records on server.
         */
        DESTROY  : 'destroy',

        /**
         * Returns a list of names of all available CRUD actions
         * @static
         * @return {String[]}
         */
        getVerbs : function(){
            return [this.CREATE, this.READ, this.UPDATE, this.DESTROY];
        },
        /**
         * Returns true if supplied action-name is a valid API action defined in CRUD constants
         * Ext.data.CREATE, Ext.data.READ, Ext.data.UPDATE, Ext.data.DESTROY
         * @param {String} action
         * @param {String[]}(Optional) List of availabe CRUD actions.  Pass in list when executing multiple times for efficiency.
         * @return {Boolean}
         * @static
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
         * Ext.data.CREATE, Ext.data.READ, Ext.data.UPDATE, Ext.data.DESTROY.  Otherwise returns an array of mistakes.
         * @return {String[]||true}
         * @static
         */
        isValid : function(api){
            var invalid = [];
            var crud = this.getVerbs();
            for (var action in api) {
                if (!this.isVerb(action, crud)) {
                    invalid.push(action);
                }
            }
            return (!invalid.length) ? true : invalid;
        }
    }
})();



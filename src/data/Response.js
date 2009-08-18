/**
 * Ext.data.Response
 * A generic response class to normalize response-handling internally to the framework.
 */
Ext.data.Response = function(params) {
    Ext.apply(this, params);
};
Ext.data.Response.prototype = {
    /**
     * @property {String} action {@link Ext.data.Api#actions}
     */
    action: undefined,
    /**
     * @property {Boolean} success
     */
    success : undefined,
    /**
     * @property {String} message
     */
    message : undefined,
    /**
     * @property {Array/Object} data
     */
    data: undefined,
    /**
     * @property {Object} raw The raw response returned from server-code
     */
    raw: undefined,
    /**
     * @property {Ext.data.Record/Ext.data.Record[]} record(s) related to the Request action
     */
    records: undefined
};

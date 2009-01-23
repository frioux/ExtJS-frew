/**
 * @class Ext.direct.Provider
 * @extends Ext.util.Observable
 * @abstract
 * Provider is an abstract class meant to be extended.
 */
Ext.direct.Provider = Ext.extend(Ext.util.Observable, {
    /**
     * @event connect
     * Fires when the Provider connects to the server-side
     */
    
    /**
     * @event disconnect
     * Fires when the Provider disconnects from the server-side
     */
    
    /**
     * @event data
     * Fires when the Provider receives data from the server-side
     */
    
    /**
     * @event exception
     * Fires when the Provider receives an exception from the server-side
     */            

    /**
     * @cfg {Number} priority
     * Priority of the request. Lower is higher priority, 0 means "duplex", aka always on.
     * All Providers default to 1 except for PollingProvider which defaults to 3.
     */    
    priority: 1,

    constructor : function(config){
        Ext.apply(this, config);
        this.addEvents('connect', 'disconnect', 'data', 'exception');
        Ext.direct.Provider.superclass.constructor.call(this, config);
    },

    /**
     * Returns whether or not the server-side is currently connected.
     * Abstract method for subclasses to implement.
     */
    isConnected: function(){
        return false;
    },

    /**
     * Abstract methods for subclasses to implement.
     */
    connect: Ext.emptyFn,
    
    /**
     * Abstract methods for subclasses to implement.
     */
    disconnect: Ext.emptyFn
});

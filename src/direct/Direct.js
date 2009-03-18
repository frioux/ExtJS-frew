/**
 * @class Ext.Direct
 * @extends Ext.util.Observable
 * <p>Provides a single interface to facilitate data communication between the client and server.</p>
 * @singleton
 */
Ext.Direct = Ext.extend(Ext.util.Observable, {
    /**
     * @property exceptions
     * @type Object
     * Four types of possible exceptions which can occur:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>Ext.Direct.exceptions.TRANSPORT</tt></b> : 'xhr'</li>
     * <li><b><tt>Ext.Direct.exceptions.PARSE</tt></b> : 'parse'</li>
     * <li><b><tt>Ext.Direct.exceptions.LOGIN</tt></b> : 'login'</li>
     * <li><b><tt>Ext.Direct.exceptions.SERVER</tt></b> : 'exception'</li>
     * </ul></div>
     */
    exceptions: {
        TRANSPORT: 'xhr',
        PARSE: 'parse',
        LOGIN: 'login',
        SERVER: 'exception'
    },
    
    // private
    constructor: function(){
        this.addEvents(
            /**
             * @event event
             * Fires after an event.
             * @param {event} e The event that occurred.
             * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
             */
            'event',
            /**
             * @event exception
             * Fires after an event exception.
             * @param {event} e The event that occurred.
             */
            'exception'
        );
        this.transactions = {};
        this.providers = {};
    },

    /**
     * Adds an Ext.Direct provider and creates the proxy or stub methods
     * to execute server-side methods. If the provider is not already connected,
     * it will auto-connect.
     * @param {Object/Array} provider A provider description or an array of provider
     * descriptions which instructs Ext.Direct how to create client-side stub methods
     */
    addProvider : function(provider){        
        var a = arguments;
        if(a.length > 1){
            for(var i = 0, len = a.length; i < len; i++){
                this.addProvider(a[i]);
            }
            return;
        }
        
        // if provider has not already been instantiated
        if(!provider.events){
            provider = new Ext.Direct.PROVIDERS[provider.type](provider);
        }
        provider.id = provider.id || Ext.id();
        this.providers[provider.id] = provider;

        provider.on('data', this.onProviderData, this);
        provider.on('exception', this.onProviderException, this);


        if(!provider.isConnected()){
            provider.connect();
        }

        return provider;
    },

    /**
     * Retrieve a provider by the id specified when the provider is added.
     * @param {String} id Unique identifier assigned to the provider when calling {@link #addProvider} 
     */
    getProvider : function(id){
        return this.providers[id];
    },

    removeProvider : function(id){
        var provider = id.id ? id : providers[id.id];
        provider.un('data', this.onProviderData, this);
        provider.un('exception', this.onProviderException, this);
        delete this.providers[provider.id];
        return provider;
    },

    addTransaction: function(t){
        this.transactions[t.tid] = t;
        return t;
    },

    removeTransaction: function(t){
        delete this.transactions[t.tid || t];
        return t;
    },

    getTransaction: function(tid){
        return this.transactions[tid.tid || tid];
    },

    onProviderData : function(provider, e){
        if(Ext.isArray(e)){
            for(var i = 0, len = e.length; i < len; i++){
                this.onProviderData(provider, e[i]);
            }
            return;
        }
        if(e.name && e.name != 'event' && e.name != 'exception'){
            this.fireEvent(e.name, e);
        }else if(e.type == 'exception'){
            this.fireEvent('exception', e);
        }
        this.fireEvent('event', e, provider);
    },

    createEvent : function(response, extraProps){
        return new Ext.Direct.eventTypes[response.type](Ext.apply(response, extraProps));
    }
});
// overwrite impl. with static instance
Ext.Direct = new Ext.Direct();

Ext.Direct.TID = 1;
Ext.Direct.PROVIDERS = {};
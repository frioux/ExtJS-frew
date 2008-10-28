Ext.data.DirectProvider = Ext.extend(Ext.util.Observable, {
    priority: 1, // lower is higher priority, 0 mens "duplex", aka always on
    constructor : function(config){
        Ext.apply(this, config);
        this.addEvents('connect', 'disconnect', 'data', 'exception');
        Ext.data.DirectProvider.superclass.constructor.apply(this, arguments);
    },

    isConnected: function(){
        return false;
    },

    connect: Ext.emptyFn,
    disconnect: Ext.emptyFn
});

Ext.data.PollingProvider = Ext.extend(Ext.data.DirectProvider, {
    priority: 3,
    interval: 3000,

    constructor : function(config){
        Ext.data.PollingProvider.superclass.constructor.apply(this, arguments);
        this.addEvents('beforepoll', 'poll');
    },

    isConnected: function(){
        return !!this.pollTask;
    },

    connect: function(){
        if(this.url && !this.pollTask){
            this.pollTask = Ext.TaskMgr.start({
                run: function(){
                    if(this.fireEvent('beforepoll') !== false){
                        Ext.Ajax.request({
                            url: this.url,
                            callback: this.onData,
                            scope: this,
                            params: this.baseParams
                        });
                    }
                },
                interval: this.interval,
                scope: this
            });
            this.fireEvent('connect', this);
        }else if(!this.url){
            throw 'Error initializing PollingProvider, no url configured.';
        }
    },

    disconnect: function(){
        if(this.pollTask){
            Ext.TaskMgr.stop(this.pollTask);
            delete this.pollTask;
            this.fireEvent('disconnect', this);
        }
    },

    onData: function(opt, success, xhr){
        if(success){
            this.fireEvent('data', this, {
                format: 'xhr',
                data: xhr
            });
        }else{
            this.fireEvent('exception', this, {
                format: 'xhr',
                data: xhr,
                type: Ext.Direct.exceptions.TRANSPORT
            });
        }
    }
});

Ext.Direct.PROVIDERS['poll'] = Ext.data.PollingProvider;



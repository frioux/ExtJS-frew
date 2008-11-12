Ext.Direct.Transaction = function(config){
    Ext.apply(this, config);
    this.tid = ++Ext.Direct.TID;
    this.retryCount = 0;
}
Ext.Direct.Transaction.prototype = {
    send: function(){
        this.provider.queueTransaction(this);
    },

    retry: function(){
        this.retryCount++;
        this.send();
    },

    getProvider: function(){
        return this.provider;
    }
};
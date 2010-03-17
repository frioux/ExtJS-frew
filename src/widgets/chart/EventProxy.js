/**
 * @class Ext.FlashProxy
 * @singleton
 */
Ext.FlashEventProxy = {
    onEvent : function(id, e){
        var fp = Ext.getCmp(id);
        if(fp){
            fp.onFlashEvent(e);
        }else{
            arguments.callee.defer(10, this, [id, e]);
        }
    }
};
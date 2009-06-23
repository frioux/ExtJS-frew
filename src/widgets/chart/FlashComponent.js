/**
 * @class Ext.FlashComponent
 * @extends Ext.BoxComponent
 * @constructor
 * @xtype flash
 */
Ext.FlashComponent = Ext.extend(Ext.BoxComponent, {
    flashVersion : '9.0.45',
    backgroundColor: '#ffffff',
    wmode: 'opaque',
    url: undefined,
    swfId : undefined,
    swfWidth: '100%',
    swfHeight: '100%',
    expressInstall: false,
    
    initComponent : function(){
        Ext.FlashComponent.superclass.initComponent.call(this);

        this.addEvents('initialize');
    },

    onRender : function(){
        Ext.FlashComponent.superclass.onRender.apply(this, arguments);

        var params = {
            allowScriptAccess: 'always',
            bgcolor: this.backgroundColor,
            wmode: this.wmode
        }, vars = {
            allowedDomain: document.location.hostname,
            elementID: this.getId(),
            eventHandler: 'Ext.FlashEventProxy.onEvent'
        };
        
        new swfobject.embedSWF(this.url, this.id, this.swfWidth, this.swfHeight, this.flashVersion, 
            this.expressInstall ? Ext.FlashComponent.EXPRESS_INSTALL_URL : undefined, vars, params);
            
        this.swf = Ext.getDom(this.id);
        this.el = Ext.get(this.swf);
    },

    getSwfId : function(){
        return this.swfId || (this.swfId = "extswf" + (++Ext.Component.AUTO_ID));
    },

    getId : function(){
        return this.id || (this.id = "extflashcmp" + (++Ext.Component.AUTO_ID));
    },

    onFlashEvent : function(e){
        switch(e.type){
			case "swfReady":
   				this.initSwf();
				return;
			case "log":
                return;
		}
        e.component = this;
        this.fireEvent(e.type.toLowerCase().replace(/event$/, ''), e);
    },

    initSwf : function(){
        this.onSwfReady(!!this.isInitialized);
        this.isInitialized = true;
        this.fireEvent('initialize', this);
    },
    
    beforeDestroy: function(){
        if(this.rendered){
            swfobject.removeSWF(this.swf.id);
        }
        Ext.FlashComponent.superclass.beforeDestroy.call(this);
    },

    onSwfReady : Ext.emptyFn
});

Ext.FlashComponent.EXPRESS_INSTALL_URL = 'http:/' + '/swfobject.googlecode.com/svn/trunk/swfobject/expressInstall.swf';

Ext.reg('flash', Ext.FlashComponent);
Ext.form.TriggerField = function(config){
    Ext.form.TriggerField.superclass.constructor.call(this, config);
    this.mimicing = false;
};

Ext.extend(Ext.form.TriggerField, Ext.form.TextField,  {
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
    customSize : true,
    hideTrigger:false,
    
    setSize : function(w, h){
        if(!this.wrap){
            this.width = w;
            this.height = h;
            return;
        }
        if(w){
            var wrapWidth = w;
            w = w - this.trigger.getWidth();
            Ext.form.TriggerField.superclass.setSize.call(this, w, h);
            this.wrap.setWidth(wrapWidth);
        }else{
            Ext.form.TriggerField.superclass.setSize.call(this, w, h);
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
    },

    onRender : function(ct){
        Ext.form.TriggerField.superclass.onRender.call(this, ct);
        this.wrap = this.el.wrap({cls: "x-form-field-wrap"});
        this.trigger = this.wrap.createChild({
            tag: "img", src: Ext.BLANK_IMAGE_URL, cls: "x-form-trigger "+this.triggerClass});
        this.trigger.on("click", this.onTriggerClick, this, {preventDefault:true});
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
        if(this.hideTrigger){
            this.trigger.setDisplayed(false);
        }
        this.setSize(this.width||'', this.height||'');
    },

    onFocus : function(){
        Ext.form.TriggerField.superclass.onFocus.call(this);
        if(!this.mimicing){
            this.mimicing = true;
            Ext.get(document).on("mousedown", this.mimicBlur, this);
        }
    },

    onBlur : function(){
        // do nothing
    },

    mimicBlur : function(e, t){
        if(!this.wrap.contains(t) && this.validateBlur()){
            this.mimicing = false;
            Ext.get(document).un("mousedown", this.mimicBlur);
            Ext.form.TriggerField.superclass.onBlur.call(this);
        }
    },

    validateBlur : function(e, t){
        return true;
    },

    onTriggerClick : Ext.emptyFn
});
/*
 * This field needs some work. It is only here for backword compatiblity with checkbox grid editor
 */
Ext.form.Checkbox = function(config){
    Ext.form.Checkbox.superclass.constructor.call(this, config);
    this.addEvents({
        check : true
    });
};

Ext.extend(Ext.form.Checkbox, Ext.form.Field,  {
    focusClass : "x-form-check-focus",
    fieldClass: "x-form-field",
    checked: false,
    defaultAutoCreate : { tag: "input", type: 'checkbox', autocomplete: "off"},
    boxLabel : undefined,

    setSize : function(w, h){
        if(!this.wrap){
            this.width = w;
            this.height = h;
            return;
        }
        this.wrap.setSize(w, h);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },
    onRender : function(ct){
        Ext.form.Checkbox.superclass.onRender.call(this, ct);
        this.wrap = this.el.wrap({cls: "x-form-check-wrap"});
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
        }
        if(this.checked){
            this.setValue(true);
        }
    },

    initValue : Ext.emptyFn,
    
    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return false;
    },

    setValue : function(v){
        this.checked = (v === true || v === 'true' || v == '1');
        if(this.el && this.el.dom){
            this.el.dom.checked = this.checked;
        }
    }
});
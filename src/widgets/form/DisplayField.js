/**
 * @class Ext.form.DisplayField
 * @extends Ext.form.Field
 * @constructor
 * Creates a new Field
 * @param {Object} config Configuration options
 */
Ext.form.DisplayField = Ext.extend(Ext.form.Field,  {
    validationEvent : false,
    validateOnBlur : false,
    defaultAutoCreate : {tag: "div"},
    fieldClass : "x-form-display-field",
    htmlEncode: false,

    // private
    initEvents : Ext.emptyFn,

    isValid : function(){
        return true;
    },

    validate : function(){
        return true;
    },

    getRawValue : function(){
        var v = this.rendered ? this.el.dom.innerHTML : Ext.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        if(this.htmlEncode){
            v = Ext.util.Format.htmlDecode(v);
        }
        return v;
    },

    getValue : function(){
        return this.getRawValue();
    },

    setRawValue : function(v){
        if(this.htmlEncode){
            v = Ext.util.Format.htmlEncode(v);
        }
        return this.rendered ? (this.el.dom.innerHTML = (v === null || v === undefined ? '' : v)) : (this.value = v);
    },

    setValue : function(v){
        this.setRawValue(v);
    }
});

Ext.reg('displayfield', Ext.form.DisplayField);

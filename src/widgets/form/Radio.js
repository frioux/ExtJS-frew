/**
 * @class Ext.form.Radio
 * @extends Ext.form.Checkbox
 * Single radio field.  Same as Checkbox, but provided as a convenience for automatically setting the input type.
 * Radio grouping is handled automatically by the browser if you give each radio in a group the same name.
 * @constructor
 * Creates a new Radio
 * @param {Object} config Configuration options
 */
Ext.form.Radio = function(){
    Ext.form.Radio.superclass.constructor.apply(this, arguments);
};
Ext.extend(Ext.form.Radio, Ext.form.Checkbox, {
    inputType: 'radio',

    /**
     * If this radio is part of a group, it will return the selected value
     * @return {String}
     */
    getGroupValue : function(){
    	var p = this.el.up('form') || Ext.get(document.body);
        return p.child('input[name='+this.el.dom.name+']:checked', true).value;
    },
    
    // private
    onClick : function(){
    	if(this.el.dom.checked != this.checked){
    		var p = this.el.up('form') || Ext.get(document.body);
			var els = p.select('input[name='+this.el.dom.name+']');
			els.each(function(el){
				if(el.dom.id == this.id){
					this.setValue(true);
				}else{
					Ext.getCmp(el.dom.id).setValue(false);
				}
			}, this);
		}
    }
});
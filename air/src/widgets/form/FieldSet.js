/**
 * This override is needed for the custom styled checkbox in Ext.form.Fieldset with checkboxToggle=true.
 * For some reason, the checkbox look doesn't change if it is clicked. So we have to set the checked
 * attribute manually. This is the only override that is needed for styled checkboxes and radios.
 * Hopefully it can be left out sometime.
 */
Ext.override(Ext.form.FieldSet, {
	onRender : Ext.form.FieldSet.prototype.onRender.createSequence(function() {
		if (this.checkbox && !this.collapsed) this.checkbox.dom.setAttribute('checked', 'checked');
	}),
	onCollapse : function(){
		if (this.checkbox) this.checkbox.dom.removeAttribute('checked');
		Ext.form.FieldSet.superclass.onCollapse.apply(this, arguments);
	},
	onExpand : function(){
		if (this.checkbox) this.checkbox.dom.setAttribute('checked', 'checked');
		Ext.form.FieldSet.superclass.onExpand.apply(this, arguments);
	}
});

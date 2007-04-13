/**
 * @class Ext.form.Radio
 * @extends Ext.form.Checkbox
 * Single radio field.
 * @constructor
 * Creates a new Radio
 * @param {Object} config Configuration options
 */
Ext.form.Radio = function(){
    Ext.form.Radio.superclass.constructor.apply(this, arguments);
};
Ext.extend(Ext.form.Radio, Ext.form.Checkbox, {
    inputType: 'radio'
});
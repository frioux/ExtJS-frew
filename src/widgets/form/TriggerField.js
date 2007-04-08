/**
 * @class Ext.form.TriggerField
 * @extends Ext.form.TextField
 * Provides a convenient wrapper for TextFields that adds a clickable trigger button (looks like a combobox by default).
 * The trigger has no default action, so you must assign a function to implement the trigger click handler by
 * overriding {@link #onTriggerClick}. You can create a TriggerField directly, as it renders exactly like a combobox
 * for which you can provide a custom implementation.  For example:
 * <pre><code>
var trigger = new Ext.form.TriggerField();
trigger.onTriggerClick = myTriggerFn;
trigger.applyTo('my-field');
</code></pre>
 *
 * However, in general you will most likely want to use TriggerField as the base class for a reusable component.
 * {@link Ext.form.DateField} and {@link Ext.form.ComboBox} are perfect examples of this.
 * @cfg {String} triggerClass The CSS class used to style the trigger button
 * @constructor
 * Create a new TriggerField.
 * @param {Object} config Configuration options (valid {@Ext.form.TextField} config options will also be applied
 * to the base TextField)
 */
Ext.form.TriggerField = function(config){
    Ext.form.TriggerField.superclass.constructor.call(this, config);
    this.mimicing = false;
    this.on('disable', this.disableWrapper, this);
    this.on('enable', this.enableWrapper, this);
};

Ext.extend(Ext.form.TriggerField, Ext.form.TextField,  {
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
    customSize : true,
    hideTrigger:false,


    // private
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
            if(this.onResize){
                this.onResize(wrapWidth, h);
            }
        }else{
            Ext.form.TriggerField.superclass.setSize.call(this, w, h);
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
    },

    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    },

    // private
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

    // private
    onFocus : function(){
        Ext.form.TriggerField.superclass.onFocus.call(this);
        if(!this.mimicing){
            this.mimicing = true;
            Ext.get(document).on("mousedown", this.mimicBlur, this);
            this.el.on("keydown", this.checkTab, this);
        }
    },

    // private
    checkTab : function(e){
        if(e.getKey() == e.TAB){
            this.triggerBlur();
        }
    },

    // private
    onBlur : function(){
        // do nothing
    },

    // private
    mimicBlur : function(e, t){
        if(!this.wrap.contains(t) && this.validateBlur()){
            this.triggerBlur();
        }
    },

    // private
    triggerBlur : function(){
        this.mimicing = false;
        Ext.get(document).un("mousedown", this.mimicBlur);
        this.el.un("keydown", this.checkTab, this);
        Ext.form.TriggerField.superclass.onBlur.call(this);
    },

    /**
     * This should be overriden by any subclass that needs to check whether or not the field can be blurred.
     * @param event The event to check
     * @param target The event target
     */
    validateBlur : function(e, t){
        return true;
    },

    // private
    disableWrapper : function(){
        if(this.wrap){
            this.wrap.addClass('x-item-disabled');
        }
    },

    // private
    enableWrapper : function(){
        if(this.wrap){
            this.wrap.removeClass('x-item-disabled');
        }
    },

    /**
     * The function that should handle the trigger's click event.  This method does nothing by default until overridden
     * by a handler implementation.
     */
    onTriggerClick : Ext.emptyFn
});
/**
 * @class Ext.form.Checkbox
 * @extends Ext.form.Field
 * Single checkbox field.  Can be used as a direct replacement for traditional checkbox fields.
 * @constructor
 * Creates a new Checkbox
 * @param {Object} config Configuration options
 * @xtype checkbox
 */
Ext.form.Checkbox = Ext.extend(Ext.form.Field,  {
    /**
     * @cfg {String} focusClass The CSS class to use when the checkbox receives focus (defaults to undefined)
     */
    focusClass : undefined,
    /**
     * @cfg {String} fieldClass The default CSS class for the checkbox (defaults to "x-form-field")
     */
    fieldClass: "x-form-field",
    /**
     * @cfg {Boolean} checked <tt>true</tt> if the checkbox should render initially checked (defaults to <tt>false</tt>)
     */
    checked: false,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "checkbox", autocomplete: "off"})
     */
    defaultAutoCreate : { tag: "input", type: 'checkbox', autocomplete: "off"},
    /**
     * @cfg {String} boxLabel The text that appears beside the checkbox
     */
    /**
     * @cfg {String} inputValue The value that should go into the generated input element's value attribute
     */
    /**
     * @cfg {Function} handler A function called when the {@link #checked} value changes (can be used instead of 
     * handling the check event). The handler is passed the following parameters:
     * <div class="mdetail-params"><ul>
     * <li><b>checkbox</b> : Ext.form.Checkbox<div class="sub-desc">The Checkbox being toggled.</div></li>
     * <li><b>checked</b> : Boolean<div class="sub-desc">The new checked state of the checkbox.</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Object} scope An object to use as the scope ("this" reference) of the {@link #handler} function
     * (defaults to this Checkbox).
     */

    // private
    actionMode: 'wrap',
    
	// private
    initComponent : function(){
        Ext.form.Checkbox.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event check
             * Fires when the checkbox is checked or unchecked.
             * @param {Ext.form.Checkbox} this This checkbox
             * @param {Boolean} checked The new checked value
             */
            'check'
        );
    },

    // private
    onResize : function(){
        Ext.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },

    // private
    initEvents : function(){
        Ext.form.Checkbox.superclass.initEvents.call(this);
        this.mon(this.el, 'click', this.onClick, this);
        this.mon(this.el, 'change', this.onClick, this);
    },

	// private
    getResizeEl : function(){
        return this.wrap;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    /**
     * @hide
     * Overridden and disabled. The editor element does not support standard valid/invalid marking.
     * @method
     */
    markInvalid : Ext.emptyFn,
    /**
     * @hide
     * Overridden and disabled. The editor element does not support standard valid/invalid marking.
     * @method
     */
    clearInvalid : Ext.emptyFn,

    // private
    onRender : function(ct, position){
        Ext.form.Checkbox.superclass.onRender.call(this, ct, position);
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        this.wrap = this.el.wrap({cls: "x-form-check-wrap"});
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
        }
        if(this.checked){
            this.setValue(true);
        }else{
            this.checked = this.el.dom.checked;
        }
    },

    // private
    onDestroy : function(){
        Ext.destroy(this.wrap);
        Ext.form.Checkbox.superclass.onDestroy.call(this);
    },

    // private
    initValue: function() {
        this.originalValue = this.getValue();
    },

    /**
     * Returns the checked state of the checkbox.
     * @return {Boolean} True if checked, else false
     */
    getValue : function(){
        if(this.rendered){
            return this.el.dom.checked;
        }
        return false;
    },

	// private
    onClick : function(){
        if(this.el.dom.checked != this.checked){
            this.setValue(this.el.dom.checked);
        }
    },

    /**
     * Sets the checked state of the checkbox, fires the "check" event, and calls a
     * <code>{@link #handler}</code> (if configured).
     * @param {Boolean/String} checked The following values will check the checkbox:
     * <code>true, 'true', '1', or 'on'</code>. Any other value will uncheck the checkbox.
     * @return {Ext.form.Field} this
     */
    setValue : function(v){
        var checked = this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
        if(this.rendered){
            this.el.dom.checked = checked;
            this.el.dom.defaultChecked = checked;
        }
        if(checked != this.checked){
            this.fireEvent("check", this, checked);
            if(this.handler){
                this.handler.call(this.scope || this, this, checked);
            }
        }
        return this;
    }
});
Ext.reg('checkbox', Ext.form.Checkbox);
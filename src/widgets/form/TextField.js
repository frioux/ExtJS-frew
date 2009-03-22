/**
 * @class Ext.form.TextField
 * @extends Ext.form.Field
 * Basic text field.  Can be used as a direct replacement for traditional text inputs, or as the base
 * class for more sophisticated input controls (like {@link Ext.form.TextArea} and {@link Ext.form.ComboBox}).
 * @constructor
 * Creates a new TextField
 * @param {Object} config Configuration options
 * @xtype textfield
 */
Ext.form.TextField = Ext.extend(Ext.form.Field,  {
    /**
     * @cfg {String} vtypeText A custom error message to display in place of the default message provided
     * for the <b><tt>{@link #vtype}</tt></b> currently set for this field (defaults to <tt>''</tt>).  <b>Note</b>:
     * only applies if <b><tt>{@link #vtype}</tt></b> is set, else ignored.
     */
    /**
     * @cfg {RegExp} stripCharsRe A JavaScript RegExp object used to strip unwanted content from the value
     * before validation (defaults to <tt>null</tt>).
     */
    /**
     * @cfg {Boolean} grow <tt>true</tt> if this field should automatically grow and shrink to its content
     * (defaults to <tt>false</tt>)
     */
    grow : false,
    /**
     * @cfg {Number} growMin The minimum width to allow when <tt><b>{@link #grow}</b> = true</tt> (defaults
     * to <tt>30</tt>)
     */
    growMin : 30,
    /**
     * @cfg {Number} growMax The maximum width to allow when <tt><b>{@link #grow}</b> = true</tt> (defaults
     * to <tt>800</tt>)
     */
    growMax : 800,
    /**
     * @cfg {String} vtype A validation type name as defined in {@link Ext.form.VTypes} (defaults to <tt>null</tt>)
     */
    vtype : null,
    /**
     * @cfg {RegExp} maskRe An input mask regular expression that will be used to filter keystrokes that do
     * not match (defaults to <tt>null</tt>)
     */
    maskRe : null,
    /**
     * @cfg {Boolean} disableKeyFilter Specify <tt>true</tt> to disable input keystroke filtering (defaults
     * to <tt>false</tt>)
     */
    disableKeyFilter : false,
    /**
     * @cfg {Boolean} allowBlank Specify <tt>false</tt> to validate that the value's length is > 0 (defaults to
     * <tt>true</tt>)
     */
    allowBlank : true,
    /**
     * @cfg {Number} minLength Minimum input field length required (defaults to <tt>0</tt>)
     */
    minLength : 0,
    /**
     * @cfg {Number} maxLength Maximum input field length allowed by validation (defaults to Number.MAX_VALUE).
     * This behavior is intended to provide instant feedback to the user by improving usability to allow pasting
     * and editing or overtyping and back tracking. To restrict the maximum number of characters that can be
     * entered into the field use <tt><b>{@link Ext.form.Field#autoCreate autoCreate}</b></tt> to add
     * any attributes you want to a field, for example:<pre><code>
var myField = new Ext.form.NumberField({
    id: 'mobile',
    anchor:'90%',
    fieldLabel: 'Mobile',
    maxLength: 16, // for validation
    autoCreate: {tag: "input", type: "text", size: "20", autocomplete: "off", maxlength: "10"}
});
</code></pre>
     */
    maxLength : Number.MAX_VALUE,
    /**
     * @cfg {String} minLengthText Error text to display if the <b><tt>{@link #minLength minimum length}</tt></b>
     * validation fails (defaults to <tt>"The minimum length for this field is {minLength}"</tt>)
     */
    minLengthText : "The minimum length for this field is {0}",
    /**
     * @cfg {String} maxLengthText Error text to display if the <b><tt>{@link #maxLength maximum length}</tt></b>
     * validation fails (defaults to <tt>"The maximum length for this field is {maxLength}"</tt>)
     */
    maxLengthText : "The maximum length for this field is {0}",
    /**
     * @cfg {Boolean} selectOnFocus <tt>true</tt> to automatically select any existing field text when the field
     * receives input focus (defaults to <tt>false</tt>)
     */
    selectOnFocus : false,
    /**
     * @cfg {String} blankText The error text to display if the <b><tt>{@link #allowBlank}</tt></b> validation
     * fails (defaults to <tt>"This field is required"</tt>)
     */
    blankText : "This field is required",
    /**
     * @cfg {Function} validator A custom validation function to be called during field validation
     * (defaults to <tt>null</tt>). If specified, this function will be called <b>only after</b> the built-in
     * validations ({@link #allowBlank}, {@link #minLength}, {@link #maxLength}) and any configured {@link #vtype}
     * all <tt>return true</tt>. This function will be passed the current field value and expected to return
     * boolean <tt>true</tt> if the value is valid or a string error message if invalid.
     */
    validator : null,
    /**
     * @cfg {RegExp} regex A JavaScript RegExp object to be tested against the field value during validation
     * (defaults to <tt>null</tt>). If available, this regex will be evaluated only after the basic validators
     * all <tt>return true</tt>, and will be passed the current field value.  If the test fails, the field will
     * be marked invalid using <b><tt>{@link #regexText}</tt></b>.
     */
    regex : null,
    /**
     * @cfg {String} regexText The error text to display if <b><tt>{@link #regex}</tt></b> is used and the
     * test fails during validation (defaults to <tt>""</tt>)
     */
    regexText : "",
    /**
     * @cfg {String} emptyText The default text to place into an empty field (defaults to <tt>null</tt>).
     * <b>Note</b>: that this value will be submitted to the server if this field is enabled and configured
     * with a {@link #name}.
     */
    emptyText : null,
    /**
     * @cfg {String} emptyClass The CSS class to apply to an empty field to style the <b><tt>{@link #emptyText}</tt></b>
     * (defaults to <tt>'x-form-empty-field'</tt>).  This class is automatically added and removed as needed
     * depending on the current field value.
     */
    emptyClass : 'x-form-empty-field',

    /**
     * @cfg {Boolean} enableKeyEvents <tt>true</tt> to enable the proxying of key events for the HTML input
     * field (defaults to <tt>false</tt>)
     */

    initComponent : function(){
        Ext.form.TextField.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event autosize
             * Fires when the <tt><b>{@link #autoSize}</b></tt> function is triggered. The field may or
             * may not have actually changed size according to the default logic, but this event provides
             * a hook for the developer to apply additional logic at runtime to resize the field if needed.
             * @param {Ext.form.Field} this This text field
             * @param {Number} width The new field width
             */
            'autosize',

            /**
             * @event keydown
             * Keydown input field event. This event only fires if <tt><b>{@link #enableKeyEvents}</b></tt>
             * is set to true.
             * @param {Ext.form.TextField} this This text field
             * @param {Ext.EventObject} e
             */
            'keydown',
            /**
             * @event keyup
             * Keyup input field event. This event only fires if <tt><b>{@link #enableKeyEvents}</b></tt>
             * is set to true.
             * @param {Ext.form.TextField} this This text field
             * @param {Ext.EventObject} e
             */
            'keyup',
            /**
             * @event keypress
             * Keypress input field event. This event only fires if <tt><b>{@link #enableKeyEvents}</b></tt>
             * is set to true.
             * @param {Ext.form.TextField} this This text field
             * @param {Ext.EventObject} e
             */
            'keypress'
        );
    },

    // private
    initEvents : function(){
        Ext.form.TextField.superclass.initEvents.call(this);
        if(this.validationEvent == 'keyup'){
            this.validationTask = new Ext.util.DelayedTask(this.validate, this);
            this.mon(this.el, 'keyup', this.filterValidation, this);
        }
        else if(this.validationEvent !== false){
        	this.mon(this.el, this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        }
        if(this.selectOnFocus || this.emptyText){
            this.on("focus", this.preFocus, this);
            
            this.mon(this.el, 'mousedown', function(){
                if(!this.hasFocus){
                    this.el.on('mouseup', function(e){
                        e.preventDefault();
                    }, this, {single:true});
                }
            }, this);
            
            if(this.emptyText){
                this.on('blur', this.postBlur, this);
                this.applyEmptyText();
            }
        }
        if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype+'Mask']))){
        	this.mon(this.el, 'keypress', this.filterKeys, this);
        }
        if(this.grow){
        	this.mon(this.el, 'keyup', this.onKeyUpBuffered, this, {buffer: 50});
			this.mon(this.el, 'click', this.autoSize, this);
        }
        if(this.enableKeyEvents){
        	this.mon(this.el, 'keyup', this.onKeyUp, this);
        	this.mon(this.el, 'keydown', this.onKeyDown, this);
        	this.mon(this.el, 'keypress', this.onKeyPress, this);
        }
    },

    processValue : function(value){
        if(this.stripCharsRe){
            var newValue = value.replace(this.stripCharsRe, '');
            if(newValue !== value){
                this.setRawValue(newValue);
                return newValue;
            }
        }
        return value;
    },

    filterValidation : function(e){
        if(!e.isNavKeyPress()){
            this.validationTask.delay(this.validationDelay);
        }
    },
    
    //private
    onDisable: function(){
        Ext.form.TextField.superclass.onDisable.call(this);
        if(Ext.isIE){
            this.el.dom.unselectable = 'on';
        }
    },
    
    //private
    onEnable: function(){
        Ext.form.TextField.superclass.onEnable.call(this);
        if(Ext.isIE){
            this.el.dom.unselectable = '';
        }
    },

    // private
    onKeyUpBuffered : function(e){
        if(!e.isNavKeyPress()){
            this.autoSize();
        }
    },

    // private
    onKeyUp : function(e){
        this.fireEvent('keyup', this, e);
    },

    // private
    onKeyDown : function(e){
        this.fireEvent('keydown', this, e);
    },

    // private
    onKeyPress : function(e){
        this.fireEvent('keypress', this, e);
    },

    /**
     * Resets the current field value to the originally-loaded value and clears any validation messages.
     * Also adds <tt><b>{@link #emptyText}</b></tt> and <tt><b>{@link #emptyClass}</b></tt> if the
     * original value was blank.
     */
    reset : function(){
        Ext.form.TextField.superclass.reset.call(this);
        this.applyEmptyText();
    },

    applyEmptyText : function(){
        if(this.rendered && this.emptyText && this.getRawValue().length < 1 && !this.hasFocus){
            this.setRawValue(this.emptyText);
            this.el.addClass(this.emptyClass);
        }
    },

    // private
    preFocus : function(){
        if(this.emptyText){
            if(this.el.dom.value == this.emptyText){
                this.setRawValue('');
            }
            this.el.removeClass(this.emptyClass);
        }
        if(this.selectOnFocus){
            this.el.dom.select();
        }
    },

    // private
    postBlur : function(){
        this.applyEmptyText();
    },

    // private
    filterKeys : function(e){
        if(e.ctrlKey){
            return;
        }
        var k = e.getKey();
        if(Ext.isGecko && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
            return;
        }
        var c = e.getCharCode(), cc = String.fromCharCode(c);
        if(!Ext.isGecko && e.isSpecialKey() && !cc){
            return;
        }
        if(!this.maskRe.test(cc)){
            e.stopEvent();
        }
    },

    setValue : function(v){
        if(this.emptyText && this.el && v !== undefined && v !== null && v !== ''){
            this.el.removeClass(this.emptyClass);
        }
        Ext.form.TextField.superclass.setValue.apply(this, arguments);
        this.applyEmptyText();
        this.autoSize();
        return this;
    },

    /**
     * Validates a value according to the field's validation rules and marks the field as invalid
     * if the validation fails
     * @param {Mixed} value The value to validate
     * @return {Boolean} True if the value is valid, else false
     */
    validateValue : function(value){
        if(value.length < 1 || value === this.emptyText){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },

    /**
     * Selects text in this field
     * @param {Number} start (optional) The index where the selection should start (defaults to 0)
     * @param {Number} end (optional) The index where the selection should end (defaults to the text length)
     */
    selectText : function(start, end){
        var v = this.getRawValue();
        var doFocus = false;
        if(v.length > 0){
            start = start === undefined ? 0 : start;
            end = end === undefined ? v.length : end;
            var d = this.el.dom;
            if(d.setSelectionRange){
                d.setSelectionRange(start, end);
            }else if(d.createTextRange){
                var range = d.createTextRange();
                range.moveStart("character", start);
                range.moveEnd("character", end-v.length);
                range.select();
            }
            doFocus = Ext.isGecko || Ext.isOpera;
        }else{
            doFocus = true;
        }
        if(doFocus){
            this.focus();
        }
    },

    /**
     * Automatically grows the field to accomodate the width of the text up to the maximum field width allowed.
     * This only takes effect if <tt><b>{@link #grow}</b> = true</tt>, and fires the {@link #autosize} event.
     */
    autoSize : function(){
        if(!this.grow || !this.rendered){
            return;
        }
        if(!this.metrics){
            this.metrics = Ext.util.TextMetrics.createInstance(this.el);
        }
        var el = this.el;
        var v = el.dom.value;
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(v));
        v = d.innerHTML;
        d = null;
        Ext.removeNode(d);
        v += "&#160;";
        var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) + /* add extra padding */ 10, this.growMin));
        this.el.setWidth(w);
        this.fireEvent("autosize", this, w);
    }
});
Ext.reg('textfield', Ext.form.TextField);

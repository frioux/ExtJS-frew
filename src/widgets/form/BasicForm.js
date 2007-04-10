/**
 * @class Ext.BasicForm
 * @extends Ext.util.Observable
 * Supplies the functionality to do "actions" on forms and initialize Ext.form.Field types on existing markup.
 * @constructor
 * @param {String/HTMLElement/Ext.Element} el The form element or its id
 * @param {Object} config Configuration options
 */
Ext.BasicForm = function(el, config){
    Ext.apply(this, config);
    /*
     * The Ext.form.Field items in this form
     * @type MixedCollection
     */
    this.items = new Ext.util.MixedCollection(false, function(o){
        return o.id || (o.id = Ext.id());
    });
    this.addEvents({
        /**
         * @event beforeaction
         * Fires before any action is performed. Return false to cancel the action.
         * @param {Form} this
         * @param {Action} action The action to be performed
         */
        beforeaction: true,
        /**
         * @event actionfailed
         * Fires when an action fails
         * @param {Form} this
         * @param {Action} action The action that failed
         */
        actionfailed : true,
        /**
         * @event actioncomplete 
         * Fires when an action is completed
         * @param {Form} this
         * @param {Action} action The action that completed
         */
        actioncomplete : true
    });
    if(el){
        this.initEl(el);
    }
};

Ext.extend(Ext.BasicForm, Ext.util.Observable, {
    /**
     * @cfg {String} method
     * The request method to use (GET or POST) for form actions if one isn't supplied in the action options
     */
    /**
     * @cfg {String} url
     * The url to use for form actions if one isn't supplied in the action options
     */
    /**
     * @cfg {Boolean} fileUpload
     * Set to true if this form is a file upload (YUI adapter only)
     */
    /**
     * @cfg {Object} baseParams
     * Parameters to pass with all requests. e.g. baseParams: {id: '123', foo: 'bar'}
     */
    /**
     * @cfg {Number} timeout
     */
    timeout: 30,
    /**
     * @cfg {Object} baseParams
     * Parameters to pass with all requests
     */
    baseParams: undefined,
    // private
    activeAction : null,

    // private
    initEl : function(el){
        this.el = Ext.get(el);
        this.id = this.el.id || Ext.id();
        this.el.on('submit', this.onSubmit, this);
        this.el.addClass('x-form');
    },

    // private
    onSubmit : function(e){
        e.stopEvent();
    },

    /**
     * Returns true is client-side validation on the form is successful
     * @return Boolean
     */
    isValid : function(){
        var valid = true;
        this.items.each(function(f){
           if(!f.validate()){
               valid = false;
           }
        });
        return valid;
    },

    /**
     * Performs a predefined action (submit or load) or custom actions you define on this form
     * @param {String} actionName The name of the action type
     * @param {Object} options The options to pass to the action
     */
    doAction : function(action, options){
        if(typeof action == 'string'){
            action = new Ext.form.Action.ACTION_TYPES[action](this, options);
        }
        if(this.fireEvent('beforeaction', this, action) !== false){
            this.beforeAction(action);
            action.run.defer(100, action);
        }
    },

    /**
     * Shortcut to do a submit action
     * @param {Object} options The options to pass to the action
     */
    submit : function(options){
        this.doAction('submit', options);
    },

    /**
     * Shortcut to do a load action
     * @param {Object} options The options to pass to the action
     */
    load : function(options){
        this.doAction('load', options);
    },

    // private
    beforeAction : function(action){
        var o = action.options;
        if(o.waitMsg){
            Ext.MessageBox.wait(o.waitMsg, o.waitTitle || this.waitTitle || 'Please Wait...');
        }
    },

    // private
    afterAction : function(action, success){
        this.activeAction = null;
        var o = action.options;
        if(o.waitMsg){
            Ext.MessageBox.updateProgress(1);
            Ext.MessageBox.hide();
        }
        if(success){
            if(o.reset){
                this.reset();
            }
            Ext.callback(o.success, o.scope, [this, action]);
            this.fireEvent('actioncompleted', this, action);
        }else{
            Ext.callback(o.failure, o.scope, [this, action]);
            this.fireEvent('actionfailed', this, action);
        }
    },

    /**
     * Find a Ext.form.Field in this form by id, dataIndex, name or hiddenName
     * @param {String} id The value to search for
     * @return Field
     */
    findField : function(id){
        var field = this.items.get(id);
        if(!field){
            this.items.each(function(f){
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    },


    /**
     * Mark fields in this form invalid in bulk.
     * @param {Array/Object} errors Either an array in the form [{id:'fieldId', msg:'The message'},...] or an object hash of {id: msg, id2: msg2}
     */
    markInvalid : function(errors){
        if(errors instanceof Array){
            for(var i = 0, len = errors.length; i < len; i++){
                var fieldError = errors[i];
                var f = this.findField(fieldError.id);
                if(f){
                    f.markInvalid(fieldError.msg);
                }
            }
        }else{
            var field, id;
            for(id in errors){
                if(typeof errors[id] != 'function' && (field = this.findField(id))){
                    field.markInvalid(errors[id]);
                }
            }
        }
    },

    /**
     * Set values for fields in this form in bulk.
     * @param {Array/Object} values Either an array in the form [{id:'fieldId', value:'foo'},...] or an object hash of {id: value, id2: value2}
     */
    setValues : function(values){
        if(values instanceof Array){ // array of objects
            for(var i = 0, len = values.length; i < len; i++){
                var v = values[i];
                var f = this.findField(v.id);
                if(f){
                    f.setValue(v.value);
                }
            }
        }else{ // object hash
            var field, id;
            for(id in values){
                if(typeof values[id] != 'function' && (field = this.findField(id))){
                    field.setValue(values[id]);
                }
            }
        }
    },

    /**
     * Clears all invalid messages in this form
     */
    clearInvalid : function(){
        this.items.each(function(f){
           f.clearInvalid();
        });
    },

    /**
     * Resets this form
     */
    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
    },

    /**
     * Add Ext.form components to this form
     * @param {Field} field1
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     */
    add : function(){
        this.items.addAll(Array.prototype.slice.call(arguments, 0));
    },


    /**
     * Removes a field from the items collection (does NOT remove it's markup)
     * @param {Field} field
     */
    remove : function(field){
        this.items.remove(field);
    },

    /**
     * Looks at the fields in this form, checks them for an id attribute
     * and call applyTo on the existing dom element with that id
     */
    render : function(){
        this.items.each(function(f){
            if(f.isFormField && !f.rendered && document.getElementById(f.id)){ // if the element exists
                f.applyTo(f.id);
            }
        });
    },

    /**
     * Calls {@link Ext#apply} for all field in this form with the passed object
     * @param {Object} values
     */
    applyToFields : function(o){
        this.items.each(function(f){
           Ext.apply(f, o);
        });
    },

    /**
     * Calls {@link Ext#applyIf} for all field in this form with the passed object
     * @param {Object} values
     */
    applyIfToFields : function(o){
        this.items.each(function(f){
           Ext.applyIf(f, o);
        });
    }
});
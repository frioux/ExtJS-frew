Ext.BasicForm = function(el, config){
    Ext.apply(this, config);
    this.items = new Ext.util.MixedCollection(false, function(o){
        return o.id || (o.id = Ext.id());
    });
    this.addEvents({
        beforeaction: true,
        actionfailed : true,
        actioncomplete : true
    });
    if(el){
        this.initEl(el);
    }
};

Ext.extend(Ext.BasicForm, Ext.util.Observable, {
    timeout: 30,
    providerType: 'json',
    activeAction : null,

    initEl : function(el){
        this.el = Ext.get(el);
        this.id = this.el.id || Ext.id();
        this.el.on('submit', this.onSubmit, this);
        this.el.addClass('x-form');
    },

    onSubmit : function(e){
        e.stopEvent();
    },

    isValid : function(){
        var valid = true;
        this.items.each(function(f){
           if(!f.validate()){
               valid = false;
           }
        });
        return valid;
    },

    doAction : function(action, options){
        if(typeof action == 'string'){
            action = new Ext.form.Action.ACTION_TYPES[action](this, options);
        }
        if(this.fireEvent('beforeaction', this, action) !== false){
            this.beforeAction(action);
            action.run.defer(100, action);
        }
    },

    submit : function(options){
        this.doAction('submit', options);
    },

    load : function(options){
        this.doAction('load', options);
    },

    beforeAction : function(action){
        var o = action.options;
        if(o.waitMsg){
            Ext.MessageBox.wait(o.waitMsg, o.waitTitle || this.form.waitTitle || 'Please Wait...');
        }
    },

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
            Ext.callback(o.success, o.scope, this, action);
            this.fireEvent('actioncompleted', this, action);
        }else{
            Ext.callback(o.failure, o.scope, this, action);
            this.fireEvent('actionfailed', this, action);
        }
    },

    findField : function(id){
        var field = this.items.get(id);
        if(!field){
            this.items.each(function(f){
                if(f.isFormField && f.getName() == id){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    },

    markInvalid : function(errors){
        for(var i = 0, len = errors.length; i < len; i++){
            var fieldError = errors[i];
            var f = this.findField(fieldError.id);
            if(f){
                f.markInvalid(fieldError.msg);
            }
        }
    },

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
                    field.setValue(values[v]);
                }
            }
        }
    },

    clearInvalid : function(){
        this.items.each(function(f){
           f.clearInvalid();
        });
    },

    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
    },

    add : function(){
        this.items.addAll(Array.prototype.slice.call(arguments, 0));
    },

    remove : function(field){
        this.items.remove(field);
    },

    render : function(){
        this.items.each(function(f){
            if(f.isFormField && !f.rendered && document.getElementById(f.id)){ // if the element exists
                f.applyTo(f.id);
            }
        });
    },

    applyToFields : function(o){
        this.items.each(function(f){
           Ext.apply(f, o);
        });
    },

    applyIfToFields : function(o){
        this.items.each(function(f){
           Ext.applyIf(f, o);
        });
    }
});
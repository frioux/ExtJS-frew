Ext.Form = function(el, config){
    Ext.apply(this, config);
    this.el = Ext.get(el);
    this.id = this.el.id || Ext.id();
    this.el.on('submit', this.onSubmit, this);
    this.items = new Ext.util.MixedCollection();
    this.addEvents({
        invalid : true,
        beforesubmit: true,
        success : true,
        failure: true
    });
};

Ext.Form.CLIENT_INVALID = 'client';
Ext.Form.SERVER_INVALID = 'server';

Ext.extend(Ext.Form, Ext.util.Observable, {
    timeout: 30,
    fileUpload: false,

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

    //form, uri, cb, data, isUpload, sslUri){
    submit : function(options){
        options = options || {};
        if(options.clientValidation === false || this.isValid()){
            if(options.waitMsg){
                Ext.MessageBox.wait(options.waitMsg, options.waitTitle || this.waitTitle || 'Please Wait...');
            }
            var formEl = this.el.dom;
            var url = options.url || this.url || formEl.action;
            var cb = {
                success: this.processSuccess,
                failure: this.processFailure,
                scope: this,
                timeout: (this.timeout*1000),
                argument: options,
                upload: this.fileUpload ? this.processSuccess : undefined
            };
            Ext.lib.Ajax.formRequest(formEl, url, cb, null, this.fileUpload, Ext.SSL_SECURE_URL);
        }else if (options.clientValidation !== false){
            Ext.callback(options.invalid, options.scope, [this, Ext.Form.CLIENT_INVALID, options]);
            this.fireEvent('invalid', this, Ext.Form.CLIENT_INVALID, options);
        }
    },

    findField : function(id){
        var field = this.items.get(id);
        if(!field){
            this.items.each(function(f){
                if(f.getName() == id){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    },

    processJson : function(response){
        var o = Ext.decode(response.responseText);
        if(o === true || o.success){
            return o;
        }
        if(o.errors){
            for(var i = 0, e = o.errors, len = e.length; i < len; i++){
                var fieldError = e[i];
                var f = this.findField(fieldError.id);
                if(f){
                    f.markInvalid(fieldError.msg);
                }
            }
        }
        var opt = response.argument;
        Ext.callback(opt.invalid, opt.scope, [this, Ext.Form.SERVER_INVALID, opt, o, response]);
        this.fireEvent('invalid', this, Ext.Form.SERVER_INVALID, opt, o, response);
    },

    processSuccess : function(response){
        var o = response.argument;
        if(o.reset){
            this.reset();
        }
        if(o.waitMsg){
            Ext.MessageBox.updateProgress(1);
            Ext.MessageBox.hide();
        }
        var returnObj = this.processJson(response);
        Ext.callback(o.success, o.scope, [this, returnObj, response, o]);
        this.fireEvent('success', this, returnObj, response, o);
    },

    // http request failed
    processFailure : function(response){
        var o = response.argument;
        if(o.waitMsg){
            Ext.MessageBox.updateProgress(1);
            Ext.MessageBox.hide();
        }
        Ext.callback(o.failure, o.scope, [this, response, o]);
        this.fireEvent('failure', this, response, o);
    },

    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
    },

    add : function(){
        this.items.addAll.apply(this.items, arguments);
    },

    remove : function(field){
        this.items.remove(field);
    },

    render : function(){
        this.items.each(function(f){
           if(!f.rendered){
               if(document.getElementById(f.id)){ // if the element exists
                   f.applyTo(f.id);
               }else {  // dynamic rendering = TODO

               }
           }
        });
    },

    applyToFields : function(o){
        this.items.each(function(f){
           Ext.apply(f, o);
        });
    }
});

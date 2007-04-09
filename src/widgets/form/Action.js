// define the action interface
Ext.form.Action = function(form, options){
    this.form = form;
    this.options = options || {};
};

Ext.form.Action.CLIENT_INVALID = 'client';
Ext.form.Action.SERVER_INVALID = 'server';
Ext.form.Action.CONNECT_FAILURE = 'connect';
Ext.form.Action.LOAD_FAILURE = 'load';

Ext.form.Action.prototype = {
    type : 'default',
    failureType : undefined,
    response : undefined,
    result : undefined,

    run : function(options){

    },

    success : function(response){

    },

    // default connection failure
    failure : function(response){
        this.failureType = Ext.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },

    processResponse : function(response){
        this.response = response;
        if(!response.responseText){
            this.result = true;
        }else{
            this.result = Ext.decode(response.responseText);
        }
        return this.result;
    },


    // utility functions used internally
    getUrl : function(appendParams){
        var url = this.options.url || this.form.url || this.form.el.dom.action;
        if(appendParams){
            var p = this.getParams();
            if(p){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
            }
        }
        return url;
    },

    getMethod : function(){
        return (this.options.method || this.form.method || this.form.el.dom.method || 'POST').toUpperCase();
    },

    getParams : function(){
        var bp = this.form.baseParams;
        var p = this.options.params;
        if(p){
            if(typeof p == "object"){
                p = Ext.urlEncode(Ext.applyIf(p, bp));
            }else if(typeof p == 'string' && bp){
                p += '&' + Ext.urlEncode(bp);
            }
        }else if(bp){
            p = Ext.urlEncode(bp);
        }
        return p;
    },

    createCallback : function(){
        return {
            success: this.success,
            failure: this.failure,
            scope: this,
            timeout: (this.form.timeout*1000),
            upload: this.form.fileUpload ? this.success : undefined
        };
    }
};

Ext.form.Action.Submit = function(form, options){
    Ext.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.Submit, Ext.form.Action, {
    type : 'submit',

    run : function(){
        var o = this.options;
        var isPost = this.getMethod() == 'POST';
        if(o.clientValidation === false || this.form.isValid()){
            Ext.lib.Ajax.formRequest(
                this.form.el.dom,
                this.getUrl(!isPost),
                this.createCallback(),
                isPost ? this.getParams() : null, this.form.fileUpload, Ext.SSL_SECURE_URL);

        }else if (o.clientValidation !== false){ // client validation failed
            this.failureType = Ext.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    },

    success : function(response){
        var result = this.processResponse(response);
        if(result === true || result.success){
            this.form.afterAction(this, true);
            return;
        }
        if(result.errors){
            this.form.markInvalid(result.errors);
            this.failureType = Ext.form.Action.SERVER_INVALID;
            this.form.afterAction(this, false);
        }
    }
});


Ext.form.Action.Load = function(form, options){
    Ext.form.Action.Load.superclass.constructor.call(this, form, options);
};

Ext.extend(Ext.form.Action.Load, Ext.form.Action, {
    type : 'load',

    run : function(){
        Ext.lib.Ajax.request(
            this.getMethod(),
            this.getUrl(false),
            this.createCallback(),
            this.getParams());
    },

    success : function(response){
        var result = this.processResponse(response);
        if(result === true || !result.success || !result.data){
            this.failureType = Ext.form.Action.LOAD_FAILURE;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(result.data);
        this.form.afterAction(this, true);
    }
});

Ext.form.Action.ACTION_TYPES = {
    'load' : Ext.form.Action.Load,
    'submit' : Ext.form.Action.Submit
};

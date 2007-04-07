Ext.Form = function(config){
    Ext.Form.superclass.constructor.call(this, null, config);
    this.url = this.url || this.action;
    if(!this.root){
        this.root = new Ext.form.Layout(config);
    }
    this.active = this.root;
    this.buttons = [];
};

Ext.extend(Ext.Form, Ext.BasicForm, {
    buttonPosition:'bottom',
    buttonAlign:'center',
    minButtonWidth:75,
    labelAlign:'left',

    column : function(c){
        var col = new Ext.form.Column(c);
        this.start(col);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return col;
    },

    fieldset : function(c){
        var fs = new Ext.form.FieldSet(c);
        this.start(fs);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return fs;
    },

    container : function(c){
        var l = new Ext.form.Layout(c);
        this.start(l);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return l;
    },

    start : function(c){
        // cascade label info
        Ext.applyIf(c, {'labelAlign': this.active.labelAlign, 'labelWidth': this.active.labelWidth});
        this.active.stack.push(c);
        c.ownerCt = this.active;
        this.active = c;
        return this;
    },

    end : function(){
        if(this.active == this.root){
            return this;
        }
        this.active = this.active.ownerCt;
        return this;
    },

    add : function(){
        this.active.stack.push.apply(this.active.stack, arguments);
        var r = [];
        for(var i = 0, a = arguments, len = a.length; i < len; i++) {
            if(a[i].isFormField){
                r.push(a[i]);
            }
        }
        if(r.length > 0){
            Ext.Form.superclass.add.apply(this, r);
        }
        return this;
    },

    render : function(ct){
        ct = Ext.get(ct);
        var o = this.autoCreate || {
            tag: 'form',
            method : this.method || 'POST',
            id : this.id || Ext.id()
        };
        this.initEl(ct.createChild(o));

        this.root.render(this.el);

        this.items.each(function(f){
            f.render('x-form-el-'+f.id);
        });

        if(this.buttons.length > 0){
            // tables are required to maintain order and for correct IE layout
            var tb = this.el.createChild({cls:'x-form-btns-ct', cn: {
                cls:"x-form-btns x-form-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }}, null, true);
            var tr = tb.getElementsByTagName('tr')[0];
            for(var i = 0, len = this.buttons.length; i < len; i++) {
                var b = this.buttons[i];
                var td = document.createElement('td');
                td.className = 'x-form-btn-td';
                b.render(tr.appendChild(td));
            }
        }
    },

    /**
     * Adds a button to the footer of the form - this <b>must</b> be called before the form is rendered.
     * @param {String/Object} config A string becomes the button text, an object can either be a Button config
     * object or a valid Ext.DomHelper element config
     * @param {Function} handler The function called when the button is clicked
     * @param {Object} scope (optional) The scope of the handler function
     * @return {Ext.Button}
     */
    addButton : function(config, handler, scope){
        var bc = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bc.text = config;
        }else{
            Ext.apply(bc, config);
        }
        var btn = new Ext.Button(null, bc);
        this.buttons.push(btn);
        return btn;
    }
});



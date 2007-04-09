Ext.form.Layout = function(config){
    Ext.form.Layout.superclass.constructor.call(this, config);
    this.stack = [];
};

Ext.extend(Ext.form.Layout, Ext.Component, {
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct'},
    clear:true,
    labelSeparator : ':',
    hideLabels:false,
    onRender : function(ct){
        if(this.el){ // from markup
            this.el = Ext.get(this.el);
        }else {  // generate
            var cfg = this.getAutoCreate();
            this.el = ct.createChild(cfg);
        }
        if(this.style){
            this.el.applyStyles(this.style);
        }
        if(this.labelAlign){
            this.el.addClass('x-form-label-'+this.labelAlign);
        }
        if(this.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
        }else{
            if(typeof this.labelWidth == 'number'){
                this.labelStyle = "width:"+this.labelWidth+"px;";
                this.elementStyle = "padding-left:"+((this.labelWidth+(typeof this.labelPad == 'number' ? this.labelPad : 5))+'px')+";";
            }
            if(this.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.elementStyle = "padding-left:0;";
            }
        }
        var stack = this.stack;
        var slen = stack.length;
        if(slen > 0){
            if(!this.fieldTpl){
                var t = new Ext.Template(
                    '<div class="x-form-item">',
                        '<label for="{0}" style="{2}">{1}{4}</label>',
                        '<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
                        '</div>',
                    '</div><div class="x-form-clear-left"></div>'
                );
                t.disableFormats = true;
                t.compile();
                Ext.form.Layout.prototype.fieldTpl = t;
            }
            for(var i = 0; i < slen; i++) {
                if(stack[i].isFormField){
                    this.renderField(stack[i]);
                }else{
                    this.renderComponent(stack[i]);
                }
            }
        }
        if(this.clear){
            this.el.createChild({cls:'x-form-clear'});
        }
    },

    renderField : function(f){
       this.fieldTpl.append(this.el, [f.id, f.fieldLabel, f.labelStyle||this.labelStyle||'', this.elementStyle||'', f.labelSeparator||this.labelSeparator]);
    },

    renderComponent : function(c){
        c.render(this.el);
    }
});


Ext.form.Column = function(config){
    Ext.form.Column.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.Column, Ext.form.Layout, {
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct x-form-column'},

    onRender : function(ct){
        Ext.form.Column.superclass.onRender.call(this, ct);
        if(this.width){
            this.el.setWidth(this.width);
        }
    }
});

Ext.form.FieldSet = function(config){
    Ext.form.FieldSet.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.FieldSet, Ext.form.Layout, {
    defaultAutoCreate : {tag: 'fieldset', cn: {tag:'legend'}},

    onRender : function(ct){
        Ext.form.FieldSet.superclass.onRender.call(this, ct);
        if(this.legend){
            this.setLegend(this.legend);
        }
    },

    setLegend : function(text){
        if(this.rendered){
            this.el.child('legend').update(text);
        }
    }
});


Ext.form.ButtonPanel = function(config){
    Ext.form.ButtonPanel.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.ButtonPanel, Ext.form.Layout, {
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct x-form-button-panel'},

    onRender : function(ct){
        var cfg = this.getAutoCreate();
        this.el = ct.createChild(cfg);
        var tb = this.footer.createChild({
            tag:"div",
            cls:"x-dlg-btns x-dlg-btns-"+this.buttonAlign,
            html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
        }, null, true);
        this.btnContainer = tb.firstChild.firstChild.firstChild;
        Ext.form.ButtonPanel.superclass.onRender.call(this, ct);
    },

    renderComponent : function(c){
        c.render(this.el);
    }
});
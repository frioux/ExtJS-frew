Ext.form.TextArea = function(config){
    Ext.form.TextArea.superclass.constructor.call(this, config);
    // these are provided exchanges for backwards compat
    // minHeight/maxHeight were replaced by growMin/growMax to be
    // compatible with TextField growing config values
    if(this.minHeight !== undefined){
        this.growMin = this.minHeight;
    }
    if(this.maxHeight !== undefined){
        this.growMax = this.maxHeight;
    }
};

Ext.extend(Ext.form.TextArea, Ext.form.TextField,  {
    growMin : 60,
    growMax: 1000,
    preventScrollbars: false,

    onRender : function(ct){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:300px;height:60px;",
                autocomplete: "off"
            };
        }
        Ext.form.TextArea.superclass.onRender.call(this, ct);
        if(this.grow){
            this.textSizeEl = Ext.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
    },

    onKeyUp : function(e){
        if(!e.isNavKeyPress() || e.getKey() == e.ENTER){
            this.autoSize();
        }
    },

    autoSize : function(){
        if(!this.grow || !this.textSizeEl){
            return;
        }
        var el = this.el;
        var v = el.dom.value;
        var ts = this.textSizeEl;
        Ext.fly(ts).setWidth(this.el.getWidth());
        if(v.length < 1){
            v = "&#160;&#160;";
        }else{
            v += "&#160;\n&#160;";
        }
        if(Ext.isIE){
            v = v.replace(/\n/g, '<br />');
        }
        ts.innerHTML = v;
        var h = Math.min(this.growMax, Math.max(ts.offsetHeight, this.growMin));
        this.el.setHeight(h);
        this.fireEvent("autosize", this, h);
    },

    setValue : function(v){
        Ext.form.TextArea.superclass.setValue.call(this, v);
        this.autoSize();
    }
});
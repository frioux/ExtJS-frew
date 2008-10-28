Ext.grid.Column = function(config){
    Ext.apply(this, config);

    if(typeof this.renderer == "string"){
        this.renderer = Ext.util.Format[c.renderer];
    }
    if(typeof this.id == "undefined"){
        this.id = ++Ext.grid.Column.AUTO_ID;
    }
    if(this.editor){
        if(this.editor.isFormField){
            this.editor = new Ext.grid.GridEditor(this.editor);
        }else if(this.editor.xtype && !this.editor.events){
            this.editor = new Ext.grid.GridEditor(Ext.create(this.editor, 'textfield'));
        }
    }
}

Ext.grid.Column.AUTO_ID = 0;

Ext.grid.Column.prototype = {
    isColumn : true,
    renderer : function(value){
        if(typeof value == "string" && value.length < 1){
            return "&#160;";
        }
        return value;
    }
};

Ext.grid.BooleanColumn = Ext.extend(Ext.grid.Column, {
     renderer : function(value){
            if(value === undefined){
                return "&#160;";
            }
            if(!value || value === 'false'){
                return "false";
            }
            return 'true';
    }
});

Ext.grid.NumberColumn = Ext.extend(Ext.grid.Column, {
    format : '0,000.00',
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        this.renderer = Ext.util.Format.numberRenderer(this.format);
    }
});

Ext.grid.DateColumn = Ext.extend(Ext.grid.Column, {
    format : 'm/d/Y',
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        this.renderer = Ext.util.Format.dateRenderer(this.format);
    }
});

Ext.grid.TemplateColumn = Ext.extend(Ext.grid.Column, {
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        var tpl = typeof this.tpl == 'object' ? this.tpl : new Ext.XTemplate(this.tpl);
        this.renderer = function(value, p, r){
            return tpl.apply(r.data);
        }
        this.tpl = tpl;
    }
});


Ext.grid.Column.types = {
    gridcolumn : Ext.grid.Column,
    booleancolumn: Ext.grid.BooleanColumn,
    numbercolumn: Ext.grid.NumberColumn,
    datecolumn: Ext.grid.DateColumn,
    templatecolumn: Ext.grid.TemplateColumn
};
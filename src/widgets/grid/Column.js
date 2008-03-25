Ext.grid.Column = function(config){
    Ext.apply(this, config);

    if(typeof this.renderer == "string"){
        this.renderer = Ext.util.Format[c.renderer];
    }
    if(typeof this.id == "undefined"){
        this.id = ++Ext.grid.Column.AUTO_ID;
    }
    if(this.editor && this.editor.isFormField){
        this.editor = new Ext.grid.GridEditor(this.editor);
    }
}

Ext.grid.Column.AUTO_ID = 0;

Ext.grid.Column.prototype = {
    renderer : function(value){
        if(typeof value == "string" && value.length < 1){
            return "&#160;";
        }
        return value;
    }
};
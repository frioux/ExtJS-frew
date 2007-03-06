Ext.grid.GridEditor = function(field, config){
    Ext.grid.GridEditor.superclass.constructor.call(this, field, config);
};

Ext.extend(Ext.grid.GridEditor, Ext.Editor, {
    alignment: "tl-tl",
    autoSize: "width",
    hideEl : false,
    cls: "x-grid-editor",
    shim:false,
    shadow:"frame"
});
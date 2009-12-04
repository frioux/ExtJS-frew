Ext.tree.TreeGridLoader = Ext.extend(Ext.tree.TreeLoader, {                
    createNode : function(attr) {
        if (!attr.uiProvider) {
            attr.uiProvider = Ext.tree.TreeGridNodeUI;
        }
        return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);                   
    }
});
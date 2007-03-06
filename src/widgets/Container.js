Ext.Container = function(config){
    Ext.Container.superclass.constructor.call(this, config);
    this.items = new Ext.util.MixedCollection(false, this.getComponentId);
};

Ext.extend(Ext.Container, Ext.Component, {
    getComponentId : function(comp){
        return comp.id;
    },

    add : Ext.emptyFn,

    remove : Ext.emptyFn,

    insert : Ext.emptyFn
});
Imgorg.TagCombo = Ext.extend(Ext.form.ComboBox,{
    initComponent: function() {
//        Tags.show(null, function(result, e) {
//            console.log(result);
//            this.store.loadData(result);
//        },this);
        this.store = new Ext.data.DirectStore({
            id: 'tag-store',
            api: {
                load: Tags.load
            },
            root: 'tags',
            fields: ['name', 'quantity']
        });
        Ext.apply(this,{
            displayField: 'name',
            valueField: 'name',
            triggerAction: 'all',
            queryAction: 'name',
            mode: 'remote'
        });
        
        this.store.load();
        Imgorg.TagCombo.superclass.initComponent.call(this);
    }
});
Ext.reg('tag-combo', Imgorg.TagCombo);

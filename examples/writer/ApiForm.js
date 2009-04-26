/**
 * ApiForm
 */
ApiForm = Ext.extend(Ext.Window, {
    width: 400,
    closeAction: 'hide',
    layout: 'fit',
    border: false,

    initComponent : function() {
        this.items = this.build();
        this.buttons = [
            {text: 'Apply', handler: this.onApply, scope: this}
        ];
        ApiForm.superclass.initComponent.call(this);
    },

    build : function() {
        return {
            xtype: 'form',
            autoHeight: true,
            bodyStyle: 'padding: 10px',
            labelAlign: 'top',
            defaults: {
                anchor: '98%'
            },
            items: [{
                xtype: 'fieldset',
                defaults: {anchor: '98%'},
                title: 'URL',
                items: [
                    {name: 'url', xtype: 'textfield', hideLabel: true}
                ]
            }, {
                xtype: 'fieldset',
                defaults: {anchor: '98%'},
                title: 'API',
                items: [
                    {name: 'create', fieldLabel: 'create', xtype: 'textfield'},
                    {name: 'load', fieldLabel: 'load', xtype: 'textfield'},
                    {name: 'save', fieldLabel: 'save', xtype: 'textfield'},
                    {name: 'destroy', xtype: 'textfield'},
                ]
            }]
        }
    },

    onApply : function(btn, ev) {
        var store = Ext.StoreMgr.get('users');
        var values = this.items.first().getForm().getValues();
        Ext.fly('api-url').update(values.url);
        Ext.fly('api-create').update(values.create);
        Ext.fly('api-load').update(values.load);
        Ext.fly('api-save').update(values.save);
        Ext.fly('api-destroy').update(values.destroy);

        var api = {
            create: values.create,
            load: values.load,
            save: values.save,
            destroy: values.destroy
        };
        this.dataProxy.setApi(api);
        this.dataProxy.setUrl(values.url, true);
        this.hide();
    }
});

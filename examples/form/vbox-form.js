Ext.Container.prototype.bufferResize = false;

Ext.onReady(function() {
    var form = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 55,
        url:'save-form.php',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        defaults: {
            xtype: 'textfield',
            anchor: '100%'  // anchor width by percentage
        },

        items: [{
            plugins: [ Ext.ux.FieldReplicator, Ext.ux.FieldLabeler ],
            fieldLabel: 'Send To',
            name: 'to'
        },{
            plugins: [ Ext.ux.FieldLabeler ],
            fieldLabel: 'Subject',
            name: 'subject'
        }, {
            xtype: 'textarea',
            fieldLabel: 'Message text',
            hideLabel: true,
            name: 'msg',
            flex: 1  // Take up all *remaining* vertical space
        }]
    });

    var window = new Ext.Window({
        title: 'Compose message',
        collapsible: true,
        maximizable: true,
        width: 750,
        height: 500,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain: true,
        bodyStyle: 'padding:5px;',
        buttonAlign: 'center',
        items: form,
        buttons: [{
            text: 'Send'
        },{
            text: 'Cancel'
        }]
    });
    window.show();
});
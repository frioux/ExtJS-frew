Imgorg.TagWin = Ext.extend(Ext.Window, {
    title: 'Choose Tag',
    layout: 'fit',
    closeAction: 'hide',
    width: 300,
    modal: true,
    
    initComponent: function() {
        Ext.apply(this, {
            items: [{
                autoHeight: true,
                xtype: 'form',
                id: 'tag-select',
                bodyStyle: 'padding:15px',
                labelWidth: 50,
                items: [{
                    anchor: '95%',
                    fieldLabel: 'Tag',
                    xtype: 'img-tagcombo',
                    name: 'tag',
                    allowBlank: false
                }]
            }],
            buttons: [{
                text: 'Tag Images',
                handler: this.tagImages,
                scope: this
            },{
                text: 'Cancel',
                handler: function() {
                    this.hide();
                },
                scope: this
            }]
        });
        Imgorg.TagWin.superclass.initComponent.call(this);
    },
    
        
    tagImages: function() {
        var af = this.getComponent('tag-select').getForm();
        if (af.isValid()) {
            if (this.selectedRecords) {
                var imageIds = [];
                for (var i = 0; i < this.selectedRecords.length; i++) {
                    var r = this.selectedRecords[i];
                    imageIds.push(r.data.id);
                }
                var fld = af.findField('tag');
                var tag = fld.getRawValue();
                debugger;
                
                Images.tagImage({
                    images: imageIds,
                    tag: tag
                });
            }
            this.hide();
        }
    }
});

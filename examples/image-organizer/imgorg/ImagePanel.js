Imgorg.ImagePanel = Ext.extend(Ext.Panel,{
    closable: true,
    initComponent: function() {
        Ext.apply(this,{
            layout: 'border',
            items: [{
                region: 'center',
                xtype: 'box',
                autoEl: {
                    tag: 'img',
                    src: this.url
                }
            },{
                region: 'east',
                width: 250,
                title: 'Properties',
                collapsible: true,
                html: 'TODO - populate image properties'
            }]
        });
        Imgorg.ImagePanel.superclass.initComponent.call(this);
    }
});
Ext.reg('img-panel',Imgorg.ImagePanel);

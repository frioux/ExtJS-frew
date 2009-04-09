Imgorg.ImagePanel = Ext.extend(Ext.Panel,{
    closable: true,
    initComponent: function() {
        Ext.apply(this,{
            layout: 'border',
            items: [{
                region: 'center',
                html: String.format('<img height="100%" src="{0}" />',this.url)
            },{
                region: 'east',
                width: 250,
                title: 'Properties',
                html: 'TODO - populate image properties'
            }]
        });
        Imgorg.ImagePanel.superclass.initComponent.call(this);
    }
});
Ext.reg('img-panel',Imgorg.ImagePanel);

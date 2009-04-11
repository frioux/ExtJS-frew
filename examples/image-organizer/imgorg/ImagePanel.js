Imgorg.ImagePanel = Ext.extend(Ext.Panel,{
    closable: true,
    tagTpl: new Ext.XTemplate(
        '<h3 class="image-prop-header">Tags</h3>',
        '<tpl for=".">',
            '<div class="image-prop">{text}</div>',
        '</tpl>'
    ),
    albumTpl: new Ext.XTemplate(
        '<h3 class="image-prop-header">Albums</h3>',
        '<tpl for=".">',
            '<div class="image-prop">{text}</div>',
        '</tpl>'),
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
                itemId: 'image-properties',
                width: 250,
                title: 'Properties',
                collapsible: true
            }]
        });
        Imgorg.ImagePanel.superclass.initComponent.call(this);
    },
    
    afterRender: function() {
        Imgorg.ImagePanel.superclass.afterRender.call(this);
        Albums.getAlbums({image: this.imageData.id}, this.onGetAlbums,this);
        Tags.getTags({image: this.imageData.id}, this.onGetTags, this);
    },
    
    onGetTags: function(data, resp) {
        var prop = this.getComponent('image-properties');
        this.tagTpl.append(prop.body, data);
    },
    
    onGetAlbums: function(data, resp) {
        var prop = this.getComponent('image-properties');
        this.albumTpl.append(prop.body, data);
    }
});
Ext.reg('img-panel',Imgorg.ImagePanel);

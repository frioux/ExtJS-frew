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
        '</tpl>'
    ),
    infoTpl: new Ext.XTemplate(
        '<h3 class="image-prop-header">File Info</h3>',
        '<div class="image-prop">Filename: {FileName}</div>',
        '<div class="image-prop">Size: {FileSize:fileSize}</div>',
        '<div class="image-prop">Height: {[values["COMPUTED"].Height]}</div>',
        '<div class="image-prop">Width: {[values["COMPUTED"].Width]}</div>'
    ),
    initComponent: function() {
        Ext.apply(this,{
            layout: 'border',
            items: [{
                region: 'center',
                html: '<div style="text-align:center;padding-top:20px"><img src="'+this.url+'"/></div>'
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
        Images.getInfo({image: this.imageData.id}, this.onGetInfo, this);
        Albums.getAlbums({image: this.imageData.id}, this.onGetAlbums,this);
        Tags.getTags({image: this.imageData.id}, this.onGetTags, this);
    },
    
    onGetInfo: function(data, resp) {
        var img = this.body.child('img');
        var size = img.getSize();
        if (data.COMPUTED.Height < size.height) {
            img.setHeight(data.COMPUTED.Height);
        }
        if (data.COMPUTED.Width < size.width) {
            img.setWidth(data.COMPUTED.Width);
        }
        var prop = this.getComponent('image-properties');
        this.infoTpl.append(prop.body, data)
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

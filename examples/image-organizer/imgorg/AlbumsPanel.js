Imgorg.AlbumsPanel = Ext.extend(Ext.Panel,{
    initComponent: function() {
        Ext.apply(this, {
            layout: 'column',
            defaults: {
                border: false
            },
            autoScroll: true,
            defaultType: 'img-album',
            items: [{
                columnWidth: 0.33,
                html: 'test'
            },{
                columnWidth: 0.33,
                html: 'test'
            },{
                columnWidth: 0.34,
                html: 'test'
            }]
        });
        Imgorg.AlbumsPanel.superclass.initComponent.call(this);
        Albums.getAllInfo({}, this.setupAlbums, this);
    },
    
    afterRender: function() {
        Imgorg.AlbumsPanel.superclass.afterRender.call(this);
        this.body.on('click', this.onClick, this, {delegate: 'div.album-wrap'});
    },
    
    setupAlbums: function(data, resp) {
        var cols = [[],[],[]];
        var idx = 0;
        for (var i = 0;i < data.length;i++) {
            var a = data[i];
            cols[idx].push(a);
            if (++idx >= 3) {
                idx = 0;
            }
        }
        for (var i = 0; i < 3; i++) {
            this.items.get(i).generateAlbums(cols[i]);
        }
    },
    
    onClick: function(e, n) {
        var album = n.attributes.album_id.value;
        var album_name = n.attributes.album_name.value;
        this.fireEvent('openalbum', this, album, album_name);
    }
});
Ext.reg('img-albumspanel', Imgorg.AlbumsPanel);

Imgorg.Album = Ext.extend(Ext.Panel,{
    maxWidth: 150,
    maxHeight: 100,
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="album-wrap" album_id="{id}" album_name="{text}">',
                '<div class="album-wrap-inner">',
                    '{url:this.imageFormat}',
                    '<h3>Album: {text}</h3>',
                    '<div class="album-details">',
                        '<p>Date: {date}</p>',
                        '<p>Size: {size} images</p>',
                    '</div>',
                '</div>',
            '</div>',
        '</tpl>',{
            imageFormat: function(url, data) {
                if (url) {
                    return String.format('<img src="{0}" height="{1}" width="{2}" />',url, data.height, data.width);
                } else {
                    return '<p>No Images in Album</p>';
                }
            }
        }
    ),
    initComponent: function() {
        Imgorg.Album.superclass.initComponent.call(this);
    },
    generateAlbums: function(albums) {
        for(var i = 0; i < albums.length;i++) {
            if (albums[i].exif) {
                albums[i].height = Math.min(this.maxHeight, albums[i].exif.COMPUTED.Height);
                albums[i].width = Math.min(this.maxWidth, albums[i].exif.COMPUTED.Width);
            }
        }
        this.tpl.overwrite(this.body, albums);
    }
});
Ext.reg('img-album', Imgorg.Album);

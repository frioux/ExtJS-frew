Imgorg.ImageDv = Ext.extend(Ext.DataView,{
    tpl: new Ext.XTemplate(
        '<tpl for=".">',
        '<div class="thumb-wrap" id="{name}">',
        '<div class="thumb"><img src="../view/{url}" class="thumb-img"></div>',
        '<span class="x-editable">{name:ellipsis(15)}</span></div>',
        '</tpl>'
    ),
    
    initComponent: function() {
        Ext.apply(this, {
            itemSelector: 'div.thumb-wrap',
            style: 'overflow:auto',
            multiSelect: true,
            overClass: 'x-view-over',
            emptyText: 'No images to display',
            plugins: [new Ext.DataView.DragSelector({
                dragSafe: true
            }), new Ext.DataView.LabelEditor({
                dataIndex: 'name'
            })],
            store: new Ext.data.JsonStore({
                url: '../view/get-images.php',
                autoLoad: true,
                root: 'images',
                id: 'name',
                fields: ['name', 'url', 'id']
            })
        });
        Imgorg.ImageDv.superclass.initComponent.call(this);
        this.on({// hacks to force the labeleditor to stop editing when we get a click elsewhere
            click: function() {
                this.plugins[1].completeEdit();
            },
            containerclick: function(dv, e) {
                this.plugins[1].completeEdit();
            },
            contextmenu: this.onContextMenu,
            containercontextmenu: this.onContextMenu,
            scope: this
        });
    },
    
    afterRender: function() {
        Imgorg.ImageDv.superclass.afterRender.call(this);
        this.el.unselectable(); // messy if they can select the text of the file names
    },
    
    onContextMenu: function(e, node) {
        e.stopEvent();
        if(!this.contMenu) {
            this.contMenu = new Ext.menu.Menu({
                items: [{
                    text: 'Add to Album',
                    handler: this.addToAlbum,
                    scope: this
                },{
                    text: 'Tag',
                    handler: this.tag,
                    scope: this
                },{
                    text: 'Copy',
                    handler: this.copy,
                    scope: this
                }]
            });
        }
        this.contMenu.showAt(e.getXY());
    }
});
Ext.reg('img-dv', Imgorg.ImageDv);

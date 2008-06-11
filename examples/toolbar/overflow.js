Ext.onReady(function(){

    var handleAction = function(action){
        Ext.example.msg('<b>Action</b>', 'You clicked "'+action+'"');
    };
    
    var p = new Ext.Panel({
        title: 'Standard',
        height:250,
        width: 500,
        bodyStyle: 'padding:10px',
        renderTo: 'ct',
        html: Ext.example.shortBogusMarkup,
        autoScroll: true,
        tbar: [{
            xtype:'splitbutton',
            text: 'Hideous',
            iconCls: 'add16',
            handler: handleAction.createCallback('Hideous'),
            menu: [{text: 'Hideous menu', handler: handleAction.createCallback('Hideous menu')}]
        },'-',{
            xtype:'splitbutton',
            text: 'Cut',
            iconCls: 'add16',
            handler: handleAction.createCallback('Cut'),
            menu: [{text: 'Cut menu', handler: handleAction.createCallback('Cut menu')}]
        },{
            text: 'Copy',
            iconCls: 'add16',
            handler: handleAction.createCallback('Copy')
        },{
            text: 'Paste',
            iconCls: 'add16',
            menu: [{text: 'Paste menu', handler: handleAction.createCallback('Paste menu')}]
        },'-',{
            text: 'Format',
            iconCls: 'add16',
            handler: handleAction.createCallback('Format')
        },'->',{
            text: 'Right',
            iconCls: 'add16',
            handler: handleAction.createCallback('Right')
        }],
        listeners: {
            render: function(p) {
                new Ext.Resizable(p.getResizeEl(), {
                    handles: 'e',
                    width: 300,
                    minWidth: 150,
                    maxWidth: 700,
                    height: 250,
                    resizeElement: function() {
                        var box = this.proxy.getBox();
                        p.updateBox(box);
                        if (p.layout) {
                            p.doLayout();
                        }
                        return box;
                    }
               });
           }
        }
    });

});
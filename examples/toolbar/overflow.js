Ext.onReady(function(){

    var p = new Ext.Panel({
        title: 'Standard',
        height:250,
        style: 'margin-top:15px',
        bodyStyle: 'padding:10px',
        renderTo: 'ct',
        html: Ext.example.shortBogusMarkup,
        autoScroll: true,
        tbar: [{
            xtype:'splitbutton',
            text: 'Hideous',
            iconCls: 'add16',
            menu: [{text: 'Ribbons are hideous'}]
        },'-',{
            xtype:'splitbutton',
            text: 'Cut',
            iconCls: 'add16',
            menu: [{text: 'Hideousness'}]
        },{
            text: 'Copy',
            iconCls: 'add16'
        },{
            text: 'Paste',
            iconCls: 'add16',
            menu: [{text: 'Hideousness'}]
        },'-',{
            text: 'Format',
            iconCls: 'add16'
        },'->',{
            text: 'Right',
            iconCls: 'add16'
        }]
    });

    Ext.EventManager.onWindowResize(function(){
        p.setSize(Ext.getDom('ct').clientWidth);
    });

});
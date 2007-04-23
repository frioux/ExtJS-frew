Ext.onReady(function(){
    var p = new Ext.Panel({
        frame:true,
        width:400,
        collapsible:true,
        title:"Static Framed Panel",
        contentEl: 'some-content' // add some existing markup
    });
    p.render(document.body);

    var p2 = new Ext.Panel({
        cls:'x-panel-blue float-panel',
        title:'Framed Floating Panel w/ Ajax, Scrolling, Toolbar',
        autoScroll:true,
        width:550,
        height:300,
        frame:true,
        floating:true,
        x:400, y:200,
        collapsible:true,
        tools:[{id:'minimize'},{id:'maximize'},{id:'gear'},{id:'restore'},{id:'close'}]
    });

    p2.render(document.body);
    // stick toolbar in the top bar
    var tb = new Ext.Toolbar(p2.tbar, [{
        text:'Load Content',
        handler : function(){
            p2.load({url:'../tabs/ajax1.htm'});
        }
    }]);

    // let it know about the new toolbar
    p2.syncSize();


    // the code below will eventually be wrapped up in subclasses (e.g. Dialog)


    // Attach a resizable
    var rz = new Ext.Resizable(p2.el, {
        transparent:true,
        pinned:true,
        minWidth:350,
        minHeight:200,
        handles:'all',
        resizeElement : function(){
            var box = this.proxy.getBox();
            p2.updateBox(box);
            this.proxy.hide();
            return box;
        }
    });

    // testing DD
    var dd = p2.el.initDDProxy('PanelDD',
         {dragElId: rz.proxy.id}, {
         beforeMove : function() {
             p2.el.beforeAction();
         },
         afterDrag : function(){
            p2.el.sync(true);
         },
         scroll:false
    });
    dd.setHandleElId(p2.header.id);

});
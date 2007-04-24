Ext.Window = function(config){
    Ext.Window.superclass.constructor.call(this, config);

    this.addEvents({
        resize: true
    });
};

Ext.extend(Ext.Window, Ext.Panel, {
    baseCls : 'x-window',
    frame:true,
    floating:true,
    collapsible:true,
    resizable:true,
    draggable:true,
    closable : true,

    minimizable : true,
    maximizable : true,

    tools:[{id:'minimize'},{id:'maximize'},{id:'restore', hidden:true},{id:'close'}],

    onRender : function(ct){
        Ext.Window.superclass.onRender.call(this, ct);

        // this element allows the dialog to be focused for keyboard events
        this.focusEl = this.el.createChild({
                    tag: "a", href:"#", cls:"x-dlg-focus",
                    tabIndex:"-1", onclick:'return false;'});

        this.proxy = this.el.createProxy("x-window-proxy", ct);
        this.proxy.enableDisplayMode('block');
    },

    initEvents : function(){
        if(this.resizable){
            this.resizer = new Ext.Resizable(this.el, {
                minWidth: this.minWidth,
                minHeight:this.minHeight,
                handles: this.resizeHandles || "all",
                pinned: true,
                resizeElement : this.resizerAction
            });
            this.resizer.window = this;
            this.resizer.on("beforeresize", this.beforeResize, this);
        }

        if(this.draggable){
            this.header.addClass("x-window-draggable");
            this.dd = new Ext.Window.DD(this);
        }
    },

    resizerAction : function(){
        var box = this.proxy.getBox();
        this.proxy.hide();
        this.window.handleResize(box);
        return box;
    },

    beforeResize : function(){
        this.resizer.minHeight = Math.max(this.minHeight, this.getFrameHeight() + 40); // 40 is a magic minimum content size?
        this.resizer.minWidth = Math.max(this.minWidth, this.getFrameWidth() + 40);
    },

    // private
    handleResize : function(box){
        this.updateBox(box);
        this.focus();
        this.fireEvent("resize", this, box.width, box.height);
    }


});

Ext.Window.DD = function(win){
    this.win = win;
    Ext.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD');
    this.setHandleElId(win.header.id);
    this.scroll = false;
};

Ext.extend(Ext.Window.DD, Ext.dd.DD, {
    startDrag : function(){
        var w = this.win;
        this.proxy = w.createGhost();
        var box = w.getBox(true);
        this.proxy.setLeftTop(box.x, box.y);
        this.proxy.setSize(box.width, box.height);
        if(w.constrain !== false){
            var so = w.shadowOffset;
            this.constrainTo(w.container, {right: so, left: so, bottom: so});
        }
    },
    b4Drag : Ext.emptyFn,
    
    onDrag : function(e){
        this.alignElWithMouse(this.proxy.dom, e.getPageX(), e.getPageY());
    },

    endDrag : function(e){
        var w = this.win;
        w.setPosition(this.proxy.getLeft(true), this.proxy.getTop(true));
        this.proxy.remove();
        delete this.proxy;
        w.focus();
    }
});

Ext.onReady(function(){
    var p = new Ext.Panel({
        frame:true,
        width:400,
        collapsible:true,
        title:"Static Framed Panel",
        contentEl: 'some-content' // add some existing markup
    });
    p.render(document.body);

    var p2 = new Ext.Window({
        title:'Framed Floating Panel w/ Ajax, Scrolling, Toolbar',
        autoScroll:true,
        width:550,
        height:300,
        x:400, y:200
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


    // testing DD


});
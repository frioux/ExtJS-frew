
/*
 WARNING - DO NOT USE THESE CLASSES THEY ARE STILL IN DEV
 */

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
    constrain:true,
    
    minimizable : true,
    maximizable : true,

    minHeight: 80,
    minWidth: 200,
    minButtonWidth: 75,
    defaultButton: null,
    buttonAlign: "right",

    initHidden : true,

    //tools:[{id:'minimize'},{id:'maximize'},{id:'restore', hidden:true},{id:'close'}],

    onRender : function(ct){
        Ext.Window.superclass.onRender.call(this, ct);

        // this element allows the dialog to be focused for keyboard events
        this.focusEl = this.el.createChild({
                    tag: "a", href:"#", cls:"x-dlg-focus",
                    tabIndex:"-1", onclick:'return false;'});

        this.proxy = this.el.createProxy("x-window-proxy");
        this.proxy.enableDisplayMode('block');

        if(this.modal){
            this.mask = Ext.get(document.body).createChild({cls:"ext-el-mask"});
            this.mask.enableDisplayMode("block");
        }
    },

    initEvents : function(){
        if(this.animateTarget){
            this.setAnimateTarget(this.animateTarget);
        }

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
        this.initTools();

        this.el.on("mousedown", this.toFront, this);
        //Ext.EventManager.onWindowResize(this.adjustViewport, this, true);
        Ext.DialogManager.register(this);
        this.hidden = true;
    },

    initTools : function(){
        if(this.minimizable){
            this.addTool({
                id: 'minimize',
                on: {
                    'click' : this.hide.createDelegate(this, [])
                }
            });
        }
        if(this.maximizable){
            this.addTool({
                id: 'maximize',
                on: {
                    'click' : this.hide.createDelegate(this, [])
                }
            });
            this.addTool({
                id: 'restore',
                on: {
                    'click' : this.hide.createDelegate(this, [])
                },
                hidden:true
            });
        }
        if(this.closable){
            this.addTool({
                id: 'close',
                on: {
                    'click' : this.hide.createDelegate(this, [])
                }
            });
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
    },

    /**
     * Focuses the dialog.  If a defaultButton is set, it will receive focus, otherwise the
     * dialog itself will receive focus.
     */
    focus : function(){
        this.focusEl.focus();
    },

    setAnimateTarget : function(el){
        el = Ext.get(el);
        this.animateTarget = el;
    },

    beforeShow : function(){
        delete this.el.lastXY;
        delete this.el.lastLT;
        this.el.setLeftTop(this.x, this.y);
        this.expand(false);
        if(this.modal){
            Ext.get(document.body).addClass("x-body-masked");
            this.mask.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
            this.mask.show();
        }
    },

    show : function(animateTarget, cb, scope){
        if (this.hidden === false || this.fireEvent("beforeshow", this) === false){
            return;
        }
        if(cb){
            this.on('show', cb, scope, {single:true});
        }
        this.hidden = false;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        this.beforeShow();
        if(this.animateTarget){
            this.animShow();
        }else{
            this.afterShow();
        }
    },

    afterShow : function(){
        this.proxy.hide();
        this.el.setStyle('display', 'block');
        this.el.show();
        this.toFront();
        this.focus();
        this.fireEvent("show", this);
    },

    // private
    animShow : function(){
        this.proxy.show();
        this.proxy.setBox(this.animateTarget.getBox());
        var b = this.getBox(false);
        b.callback = this.afterShow;
        b.scope = this;
        this.el.setStyle('display', 'none');
        this.proxy.shift(b);
    },


    hide : function(animateTarget, cb, scope){
        if(this.hidden || this.fireEvent("beforehide", this) === false){
            return;
        }
        if(cb){
            this.on('hide', cb, scope, {single:true});
        }
        this.hidden = true;
        if(animateTarget !== undefined){
            this.setAnimateTarget(animateTarget);
        }
        if(this.animateTarget){
            this.animHide();
        }else{
            this.el.hide();
            this.afterHide();
        }
    },

    afterHide : function(){
        this.proxy.hide();
        if(this.modal){
            this.mask.hide();
            Ext.get(document.body).removeClass("x-body-masked");
        }
        this.fireEvent("hide", this);
    },

    animHide : function(){
        this.proxy.show();
        var tb = this.getBox(false);
        this.proxy.setBox(tb);
        this.el.hide();
        var b = this.animateTarget.getBox();
        b.callback = this.afterHide;
        b.scope = this;
        this.proxy.shift(b);
    },

    // private
    // z-index is managed by the DialogManager and may be overwritten at any time
    setZIndex : function(index){
        if(this.modal){
            this.mask.setStyle("z-index", index);
        }
        this.el.setZIndex(++index);
        index += 5;

        if(this.resizer){
            this.resizer.proxy.setStyle("z-index", ++index);
        }

        this.lastZIndex = index;
    },

    /**
     * Aligns the window to the specified element
     * @param {String/HTMLElement/Ext.Element} element The element to align to.
     * @param {String} position The position to align to (see {@link Ext.Element#alignTo} for more details).
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @return {Ext.BasicDialog} this
     */
    alignTo : function(element, position, offsets){
        var xy = this.el.getAlignToXY(element, position, offsets);
        this.setPagePosition(xy[0], xy[1]);
        return this;
    },

    /**
     * Anchors this window to another element and realigns it when the window is resized or scrolled.
     * @param {String/HTMLElement/Ext.Element} element The element to align to.
     * @param {String} position The position to align to (see {@link Ext.Element#alignTo} for more details)
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @param {Boolean/Number} monitorScroll (optional) true to monitor body scroll and reposition. If this parameter
     * is a number, it is used as the buffer delay (defaults to 50ms).
     * @return {Ext.BasicDialog} this
     */
    anchorTo : function(el, alignment, offsets, monitorScroll){
        var action = function(){
            this.alignTo(el, alignment, offsets);
        };
        Ext.EventManager.onWindowResize(action, this);
        var tm = typeof monitorScroll;
        if(tm != 'undefined'){
            Ext.EventManager.on(window, 'scroll', action, this,
                {buffer: tm == 'number' ? monitorScroll : 50});
        }
        action.call(this);
        return this;
    },

    /**
     * Brings this dialog to the front of any other visible dialogs
     * @return {Ext.BasicDialog} this
     */
    toFront : function(){
        Ext.DialogManager.bringToFront(this);
        return this;
    },

    /**
     * Sends this dialog to the back (under) of any other visible dialogs
     * @return {Ext.BasicDialog} this
     */
    toBack : function(){
        Ext.DialogManager.sendToBack(this);
        return this;
    },

    /**
     * Centers this dialog in the viewport
     * @return {Ext.BasicDialog} this
     */
    center : function(){
        var xy = this.el.getCenterXY(true);
        this.setPagePosition(xy[0], xy[1]);
        return this;
    }
});

Ext.Window.DD = function(win){
    this.win = win;
    Ext.Window.DD.superclass.constructor.call(this, win.el.id, 'WindowDD');
    this.setHandleElId(win.header.id);
    this.scroll = false;
};

Ext.extend(Ext.Window.DD, Ext.dd.DD, {
    moveOnly:true,
    startDrag : function(){
        var w = this.win;
        this.proxy = w.createGhost();
        var box = w.getBox(true);
        this.proxy.setLeftTop(box.x, box.y);
        this.proxy.setWidth(box.width);
        w.el.hide();
        if(w.constrain !== false){
            var so = w.el.shadowOffset;
            this.constrainTo(w.container, {right: so, left: so, bottom: so});
        }
    },
    b4Drag : Ext.emptyFn,
    
    onDrag : function(e){
        this.alignElWithMouse(this.proxy, e.getPageX(), e.getPageY());
    },

    endDrag : function(e){
        var w = this.win;
        w.el.show();
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

    new Ext.Button(document.body, {
        text: 'Toggle Window',
        handler : function(){
            p2[p2.isVisible() ? 'hide' : 'show'](this.el);
        }
    });

    // stick toolbar in the top bar
    var tb = new Ext.Toolbar(p2.tbar, [{
        text:'Load Content',
        handler : function(){
            p2.load({url:'../tabs/ajax1.htm'});
        }
    }]);


    // stick toolbar in the top bar
    var tb2 = new Ext.Toolbar(p2.bbar, [{
        text:'Do Something',
        handler : function(){
            Ext.Msg.alert('Yeah', 'The buttons works!');
        }
    }]);

    // let it know about the new toolbar
    p2.syncSize();


    // the code below will eventually be wrapped up in subclasses (e.g. Dialog)


    // Attach a resizable


    // testing DD


});
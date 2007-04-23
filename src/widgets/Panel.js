Ext.Panel = function(config){
    Ext.Panel.superclass.constructor.call(this, config);

    this.addEvents({
        bodyresize : true,
        titlechange: true,
        collapse : true,
        expand:true
    });
};

Ext.extend(Ext.Panel, Ext.BoxComponent, {
    baseCls : 'x-panel',
    collapsedCls : 'x-panel-collapsed',
    elements : ['header', 'tbar', 'body', 'bbar', 'footer'],
    maskDisabled: true,
    collapsed : false,
    animate:Ext.enableFx,

    // private, notify box this class will handle heights
    deferHeight:true,

    createElement : function(name, pnode){
        if(name !== 'bwrap' && this.els.indexOf(name) == -1){
            return;
        }
        if(this[name]){
            pnode.appendChild(this[name].dom);
        }else{
            var el = document.createElement('div');
            el.className = this[name+'Cls'];
            this[name] = Ext.get(pnode.appendChild(el));
        }
    },

    onRender : function(ct){
        Ext.Panel.superclass.onRender.call(this, ct);

        this.createClasses();

        if(this.el){ // existing markup
            this.header = this.el.down('.'+this.headerCls);
            this.bwrap = this.el.down('.'+this.bwrapCls);
            var cp = this.bwrap ? this.bwrap : this.el;
            this.tbar = cp.down('.'+this.tbarCls);
            this.body = cp.down('.'+this.bodyCls);
            this.bbar = cp.down('.'+this.bbarCls);
            this.footer = cp.down('.'+this.footerCls);
        }else{
            this.el = ct.createChild({
                id: this.id,
                cls: this.baseCls
            });
        }
        var el = this.el, d = el.dom;
        if(this.cls){
            this.el.addClass(this.cls);
        }
        // This block allows for maximum flexibility and performance when using existing markup

        // framing requires special markup
        if(this.frame){
            el.insertHtml('afterBegin', String.format(Ext.Element.boxMarkup, this.baseCls));

            this.createElement('header', d.firstChild.firstChild.firstChild);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            var bw = this.bwrap.dom;
            var ml = d.childNodes[1], bl = d.childNodes[2];
            bw.appendChild(ml);
            bw.appendChild(bl);

            var mc = bw.firstChild.firstChild.firstChild;
            this.createElement('tbar', mc);
            this.createElement('body', mc);
            this.createElement('bbar', mc);
            this.createElement('footer', bw.childNodes[1].firstChild.firstChild);
        }else{
            this.createElement('header', d);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            var bw = this.bwrap.dom;
            this.createElement('tbar', bw);
            this.createElement('body', bw);
            this.createElement('bbar', bw);
            this.createElement('footer', bw);
        }

        this.bwrap.enableDisplayMode('block');

        if(this.header){
            this.header.unselectable();
        }

        if(this.floating){
            this.el = new Ext.Layer(
                typeof this.floating == 'object' ? this.floating : {
                    shadow:'sides', constrain:false
                }, this.el
            );
        }
    },

    afterRender : function(){
        if(this.floating && !this.hidden){
            this.el.show();
        }
        if(this.title){
            this.setTitle(this.title);
        }
        if(this.html){
            this.body.update(this.html);
            delete this.html;
        }
        if(this.autoScroll){
            this.body.dom.style.overflow = 'auto';
        }
        if(this.contentEl){
            this.body.dom.appendChild(Ext.getDom(this.contentEl));
        }
        if(this.collapsed){
            this.collapsed = false;
            this.collapse(false);
        }
        Ext.Panel.superclass.afterRender.call(this); // do sizing calcs last
        this.initEvents();
    },

    initEvents : function(){

    },

    beforeEffect : function(){
        if(this.floating){
            this.el.beforeAction();
        }
        if(Ext.isGecko){
            this.body.clip();
        }
    },

    afterEffect : function(){
        this.syncShadow();
        if(Ext.isGecko){
            this.body.unclip();
        }
    },

    // private - wraps up an animation param with internal callbacks
    createEffect : function(a, cb, scope){
        var o = {
            scope:scope,
            block:true
        };
        if(a === true){
            o.callback = cb;
            return o;
        }else if(!a.callback){
            o.callback = cb;
        }else { // wrap it up
            o.callback = function(){
                cb.call(scope);
                Ext.callback(a.callback, a.scope);
            };
        }
        return Ext.applyIf(o, a);
    },

    collapse : function(animate){
        if(this.collapsed || this.el.hasFxBlock()){
            return;
        }
        var a = animate || (animate !== false && this.animate);
        if(a){
            this.beforeEffect();
            this.bwrap.slideOut('t', this.createEffect(a, this.afterCollapse, this));
        }else{
            this.bwrap.hide();
            this.afterCollapse();
        }
        return this;
    },

    afterCollapse : function(){
        this.collapsed = true;
        this.el.addClass(this.collapsedCls);
        this.afterEffect();
        this.fireEvent('collapse', this);
    },

    expand : function(animate){
        if(!this.collapsed || this.el.hasFxBlock()){
            return;
        }
        var a = animate || (animate !== false && this.animate);
        if(a){
            this.beforeEffect();
            this.bwrap.slideIn('t', this.createEffect(a, this.afterExpand, this));
        }else{
            this.bwrap.show();
            this.afterExpand();
        }
        return this;
    },

    afterExpand : function(){
        this.collapsed = false;
        this.el.removeClass(this.collapsedCls);
        this.afterEffect();
        this.fireEvent('expand', this);
    },

    toggleCollapse : function(animate){
        this[this.collapsed ? 'expand' : 'collapse'](animate);
        return this;
    },

    onDisable : function(){
        if(this.rendered && this.maskDisabled){
            this.el.mask();
        }
        Ext.Panel.superclass.onDisable.call(this);
    },

    onEnable : function(){
        if(this.rendered && this.maskDisabled){
            this.el.unmask();
        }
        Ext.Panel.superclass.onEnable.call(this);
    },

    onResize : function(w, h){
        if(w !== undefined || h !== undefined){
            if(typeof w == 'number'){
                w -= this.el.getFrameWidth('lr');

                if(this.frame){
                    var l = this.el.dom.childNodes[1].firstChild;
                    w -= (Ext.fly(l).getFrameWidth('l') + Ext.fly(l.firstChild).getFrameWidth('r'));
                }

                this.body.setWidth(w);
            }else if(w == 'auto'){
                this.body.setWidth(w);
            }

            if(typeof h == 'number'){
                h -= this.el.getFrameWidth('tb');
                h -= (this.tbar ? this.tbar.getHeight() : 0) +
                     (this.bbar ? this.bbar.getHeight() : 0);

                if(this.frame){
                    var hd = this.el.dom.firstChild;
                    var ft = this.el.dom.childNodes[1].lastChild;
                    h -= (hd.offsetHeight + ft.offsetHeight);
                    var mc = this.el.dom.childNodes[1].firstChild.firstChild.firstChild;
                    h -= Ext.fly(mc).getFrameWidth('tb');
                }else{
                    h -= (this.header ? this.header.getHeight() : 0) +
                        (this.footer ? this.footer.getHeight() : 0);
                }
                this.body.setHeight(h);
            }else if(h == 'auto'){
                this.body.setHeight(h);
            }
            this.syncShadow();
            this.fireEvent('bodyresize', this, w, h);
        }
    },

    syncShadow : function(){
        if(this.floating){
            this.el.sync(true);
        }
    },

    setTitle : function(title){
        this.title = title;
        this.header.update(title);
        this.fireEvent('titlechange', this, title);
        return this;
    },

    /**
     * Get the {@link Ext.UpdateManager} for this panel. Enables you to perform Ajax updates.
     * @return {Ext.UpdateManager} The UpdateManager
     */
    getUpdateManager : function(){
        return this.body.getUpdateManager();
    },

     /**
     * Loads this content panel immediately with content from XHR.
     * @param {Object/String/Function} config A config object containing any of the following options:
<pre><code>
panel.load({<br/>
    url: "your-url.php",<br/>
    params: {param1: "foo", param2: "bar"}, // or a URL encoded string<br/>
    callback: yourFunction,<br/>
    scope: yourObject, //(optional scope)  <br/>
    discardUrl: false, <br/>
    nocache: false,<br/>
    text: "Loading...",<br/>
    timeout: 30,<br/>
    scripts: false<br/>
});
</code></pre>
     * The only required property is url. The optional properties nocache, text and scripts
     * are shorthand for disableCaching, indicatorText and loadScripts and are used to set their
     * associated property on this panel UpdateManager instance.
     * @return {Ext.Panel} this
     */
    load : function(){
        var um = this.body.getUpdateManager();
        um.update.apply(um, arguments);
        return this;
    },

    beforeDestroy : function(){
        Ext.Element.uncache(
            this.header,
            this.tbar,
            this.bbar,
            this.footer,
            this.body
        );
    },

    createClasses : function(){
        this.els = this.elements.join(',');

        this.headerCls = this.baseCls + '-header';
        this.bwrapCls = this.baseCls + '-bwrap';
        this.tbarCls = this.baseCls + '-tbar';
        this.bodyCls = this.baseCls + '-body';
        this.bbarCls = this.baseCls + '-bbar';
        this.footerCls = this.baseCls + '-footer';
    }
});

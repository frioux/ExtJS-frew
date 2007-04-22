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
    elements : ['header','topbar','body','bottombar','footer'],
    maskDisabled: true,
    collapsed : false,
    animate:Ext.enableFx,

    // private, notify box this class will handle heights
    deferHeight:true,

    onRender : function(ct){
        Ext.Panel.superclass.onRender.call(this, ct);

        var cls = this.baseCls;

        if(!this.el){
            var ac = this.autoCreate;
            if(!ac){
                ac = {id:this.id,cls: cls + (this.cls ? ' '+this.cls : ''), cn: []};
                var els = this.elements;
                if(this.frame){
                    ac.cn = [{cls:cls+'-tl',cn:{cls:cls+'-tr',cn:{cls:cls+'-tc '+cls+'-header'}}},
                                {cls:cls+'-bwrap', cn:[
                                    {cls:cls+'-ml',cn:{cls:cls+'-mr',cn:{cls:cls+'-mc', cn:[{cls:cls+'-body'}]}}},
                                    {cls:cls+'-bl',cn:{cls:cls+'-br',cn:{cls:cls+'-bc '+cls+'-footer'}}}
                                ]}
                            ];
                    var bd = ac.cn[1].cn[0].cn.cn.cn;
                    if(els.indexOf('topbar') != -1){
                        bd.splice(0, 0, {cls:cls+'-topbar'});
                    }
                    if(els.indexOf('bottombar') != -1){
                        bd.push({cls:cls+'-bottombar'});
                    }
                }else {
                    if(els.indexOf('header') != -1){
                        ac.cn.push({cls:cls+'-header'});
                    }
                    var cns = [];
                    ac.cn.push({cls:cls+'-bwrap', cn:cns});
                    for(var i = 0, len = els.length; i < len; i++) {
                        if(els[i] != 'header'){
                            cns.push({cls:cls+'-'+els[i]});
                        }
                    }
                }
            }
            this.el = ct.createChild(ac);
        }

        if(this.floating){
            this.el = new Ext.Layer(
                typeof this.floating == 'object' ? this.floating : {
                    shadow:'sides', constrain:false
                }, this.el
            );
        }

        var cs = (this.frame ? '.' : '> .') + cls;
        this.header = this.el.child(cs + '-header');
        this.header.unselectable();
        this.bwrap = this.el.child(cs + '-bwrap');
        this.bwrap.enableDisplayMode('block');

        this.topBar = this.bwrap.child(cs + '-topbar');
        this.body = this.bwrap.child(cs + '-body');
        this.bottomBar = this.bwrap.child(cs + '-bottombar');
        this.footer = this.bwrap.child(cs + '-footer');
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
            this.collapse();
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
    },

    afterEffect : function(){
        this.syncShadow();
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
        }else if(o.ca){ // wrap it up
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
        var a = animate || this.animate;
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
        var a = animate || this.animate;
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
                h -= (this.topBar ? this.topBar.getHeight() : 0) +
                     (this.bottomBar ? this.bottomBar.getHeight() : 0);

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
            this.topBar,
            this.bottomBar,
            this.footer,
            this.body
        );
    }
});

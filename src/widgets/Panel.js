Ext.Panel = function(config){
    Ext.Panel.superclass.constructor.call(this, config);

    this.addEvents({
        bodyresize : true,
        titlechange: true
    });
};

Ext.extend(Ext.Panel, Ext.BoxComponent, {
    baseCls : 'x-panel',
    elements : ['header','topbar','body','bottombar','footer'],
    maskDisabled: true,

    onRender : function(ct){
        Ext.Panel.superclass.onRender.call(this, ct);

        var cls = this.baseCls;

        if(!this.el){
            var ac = this.autoCreate;
            if(!ac){
                ac = {cls: cls + (this.cls ? ' '+this.cls : ''), cn: []};
                var els = this.elements;
                if(this.frame){
                    ac.cn = [{cls:cls+'-tl',cn:{cls:cls+'-tr',cn:{cls:cls+'-tc '+cls+'-header'}}},
                             {cls:cls+'-ml',cn:{cls:cls+'-mr',cn:{cls:cls+'-mc', cn:[{cls:cls+'-body'}]}}},
                             {cls:cls+'-bl',cn:{cls:cls+'-br',cn:{cls:cls+'-bc '+cls+'-footer'}}}];
                    var bd = ac.cn[1].cn.cn.cn;
                    if(els.indexOf('topbar')){
                        bd.splice(0, 0, {cls:cls+'-topbar'});
                    }
                    if(els.indexOf('bottombar')){
                        bd.push({cls:cls+'-bottombar'});
                    }
                }else {
                    for(var i = 0, len = els.length; i < len; i++) {
                        var p = els[i];
                        ac.cn.push({cls:cls+'-'+p});
                    }
                }
            }
            this.el = ct.createChild(ac);
        }

        if(this.floating){
            this.el = new Ext.Layer(
                typeof this.floating == 'object' ? this.floating : {
                    shadow:'sides', hidden:false
                }, this.el
            );
        }

        var cs = (this.frame ? '.' : '> .') + cls;
        this.header = this.el.child(cs + '-header');
        this.topBar = this.el.child(cs + '-topbar');
        this.body = this.el.child(cs + '-body');
        this.bottomBar = this.el.child(cs + '-bottombar');
        this.footer = this.el.child(cs + '-footer');
    },

    afterRender : function(){
        Ext.Panel.superclass.afterRender.call(this);
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
        if(this.floating){
            this.el.sync();
        }
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
            if(w !== undefined){
                w -= this.el.getFrameWidth('lr');

                if(this.frame){
                    var l = this.el.dom.childNodes[1];
                    w -= (Ext.fly(l).getFrameWidth('l') + Ext.fly(l.firstChild).getFrameWidth('r'));
                }

                this.body.setWidth(w);
            }
            if(h !== undefined){
                h -= this.el.getFrameWidth('tb');
                h -= (this.header ? this.header.getHeight() : 0) +
                     (this.topBar ? this.topBar.getHeight() : 0) +
                     (this.bottomBar ? this.bottomBar.getHeight() : 0) +
                     (this.footer ? this.footer.getHeight() : 0);

                if(this.frame){
                    var hd = this.el.dom.firstChild.firstChild;
                    var ft = this.el.dom.lastChild.firstChild;
                    h -= (hd.offsetHeight + ft.offsetheight);
                }
                this.body.setHeight(h);
            }
            this.fireEvent('bodyresize', this, w, h);
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
     * @param {Object/String/Function} url The url for this request or a function to call to get the url or a config object containing any of the following options:
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
     * are shorthand for disableCaching, indicatorText and loadScripts and are used to set their associated property on this panel UpdateManager instance.
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

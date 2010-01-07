/**
 * @class Ext.layout.ContainerLayout
 * <p>The ContainerLayout class is the default layout manager delegated by {@link Ext.Container} to
 * render any child Components when no <tt>{@link Ext.Container#layout layout}</tt> is configured into
 * a {@link Ext.Container Container}. ContainerLayout provides the basic foundation for all other layout
 * classes in Ext. It simply renders all child Components into the Container, performing no sizing or
 * positioning services. To utilize a layout that provides sizing and positioning of child Components,
 * specify an appropriate <tt>{@link Ext.Container#layout layout}</tt>.</p>
 * <p>This class is intended to be extended or created via the <tt><b>{@link Ext.Container#layout layout}</b></tt>
 * configuration property.  See <tt><b>{@link Ext.Container#layout}</b></tt> for additional details.</p>
 */
Ext.layout.ContainerLayout = Ext.extend(Object, {
    /**
     * @cfg {String} extraCls
     * <p>An optional extra CSS class that will be added to the container. This can be useful for adding
     * customized styles to the container or any of its children using standard CSS rules. See
     * {@link Ext.Component}.{@link Ext.Component#ctCls ctCls} also.</p>
     * <p><b>Note</b>: <tt>extraCls</tt> defaults to <tt>''</tt> except for the following classes
     * which assign a value by default:
     * <div class="mdetail-params"><ul>
     * <li>{@link Ext.layout.AbsoluteLayout Absolute Layout} : <tt>'x-abs-layout-item'</tt></li>
     * <li>{@link Ext.layout.Box Box Layout} : <tt>'x-box-item'</tt></li>
     * <li>{@link Ext.layout.ColumnLayout Column Layout} : <tt>'x-column'</tt></li>
     * </ul></div>
     * To configure the above Classes with an extra CSS class append to the default.  For example,
     * for ColumnLayout:<pre><code>
     * extraCls: 'x-column custom-class'
     * </code></pre>
     * </p>
     */
    /**
     * @cfg {Boolean} renderHidden
     * True to hide each contained item on render (defaults to false).
     */

    /**
     * A reference to the {@link Ext.Component} that is active.  For example, <pre><code>
     * if(myPanel.layout.activeItem.id == 'item-1') { ... }
     * </code></pre>
     * <tt>activeItem</tt> only applies to layout styles that can display items one at a time
     * (like {@link Ext.layout.AccordionLayout}, {@link Ext.layout.CardLayout}
     * and {@link Ext.layout.FitLayout}).  Read-only.  Related to {@link Ext.Container#activeItem}.
     * @type {Ext.Component}
     * @property activeItem
     */

    // private
    monitorResize:false,
    // private
    activeItem : null,

    constructor : function(config){
        Ext.apply(this, config);
    },

    /* Workaround for how IE measures autoWidth elements.  It prefers bottom-up measurements over
      whereas other browser prefer top-down.  We will hide all target child elements before we measure and
      put them back to get an accurate measurement.
    */
    IEMeasureHack : function(target, viewFlag) {
        var tChildren = target.dom.childNodes, tLen = tChildren.length, c, d = [], e, i, ret;
        for (i = 0 ; i < tLen ; i++) {
            c = tChildren[i];
            e = Ext.get(c);
            if (e) {
                d[i] = e.getStyle('display');
                e.setStyle({display: 'none'});
            }
        }
        ret = target ? target.getViewSize(viewFlag) : {};
        for (i = 0 ; i < tLen ; i++) {
            c = tChildren[i];
            e = Ext.get(c);
            if (e) {
                e.setStyle({display: d[i]});
            }
        }
        return ret;
    },

    getLayoutTargetSize : function() {
        var target = this.container.getLayoutTarget();
        if (Ext.isIE && target && target.dom && target.getStyle('width') == 'auto') {
            return this.IEMeasureHack(target, true);
        } else {
            return target ? target.getViewSize(true) : {};
        }
    },

    // private
    layout : function(){
        var target = this.container.getLayoutTarget();
        if(!(this.hasLayout || Ext.isEmpty(this.targetCls))){
            target.addClass(this.targetCls)
        }
        this.onLayout(this.container, target);
        this.hasLayout = true;
    },

    // Placeholder for the derived layouts
    onLayout : Ext.emptyFn,

    // private
    isValidParent : function(c, target){
        return target && c.getPositionEl().dom.parentNode == (target.dom || target);
    },

    // private
    renderAll : function(ct, target){
        var items = ct.items.items, i, c, len = items.length;
        for(i = 0; i < len; i++) {
            c = items[i];
            if(c && (!c.rendered || !this.isValidParent(c, target))){
                this.renderItem(c, i, target);
            }
        }
    },

    // private
    renderItem : function(c, position, target){
        if(c){
            if(!c.rendered){
                c.render(target, position);
                this.configureItem(c, position);
            }else if(!this.isValidParent(c, target)){
                if(Ext.isNumber(position)){
                    position = target.dom.childNodes[position];
                }
                target.dom.insertBefore(c.getPositionEl().dom, position || null);
                c.container = target;
                this.configureItem(c, position);
            }
        }
    },

    // private.
    // Get all rendered items to lay out.
    getRenderedItems: function(ct){
        var t = ct.getLayoutTarget(), cti = ct.items.items, len = cti.length, i, c, items = [];
        for (i = 0; i < len; i++) {
            if((c = cti[i]).rendered && this.isValidParent(c, t)){
                items.push(c);
            }
        };
        return items;
    },

    // private
    configureItem: function(c, position){
        if(this.extraCls){
            var t = c.getPositionEl ? c.getPositionEl() : c;
            t.addClass(this.extraCls);
        }
        // If we are forcing a layout, do so *before* we hide so elements have height/width
        if(c.deepLayout && this.forceLayout){
            c.deepLayout(true);
        }
        if (this.renderHidden && c != this.activeItem) {
            c.hide();
        }
    },

    onRemove: function(c){
         if(this.activeItem == c){
            delete this.activeItem;
         }
         if(c.rendered && this.extraCls){
            var t = c.getPositionEl ? c.getPositionEl() : c;
            t.removeClass(this.extraCls);
        }
    },

    afterRemove: function(c){
        if(c.removeRestore){
            c.removeMode = 'container';
            delete c.removeRestore;
        }
    },

    // private DEPRECATE
    onResize: function(){
        //this.layout();
    },

    // private DEPRECATE
    runLayout: function(){
        var ct = this.container;
        ct.doLayout();
        delete ct.layoutPending;
    },

    // private
    setContainer : function(ct){
        this.container = ct;
    },

    // private
    parseMargins : function(v){
        if(Ext.isNumber(v)){
            v = v.toString();
        }
        var ms = v.split(' ');
        var len = ms.length;
        if(len == 1){
            ms[1] = ms[2] = ms[3] = ms[0];
        } else if(len == 2){
            ms[2] = ms[0];
            ms[3] = ms[1];
        } else if(len == 3){
            ms[3] = ms[1];
        }
        return {
            top:parseInt(ms[0], 10) || 0,
            right:parseInt(ms[1], 10) || 0,
            bottom:parseInt(ms[2], 10) || 0,
            left:parseInt(ms[3], 10) || 0
        };
    },

    /**
     * The {@link Ext.Template Ext.Template} used by Field rendering layout classes (such as
     * {@link Ext.layout.FormLayout}) to create the DOM structure of a fully wrapped,
     * labeled and styled form Field. A default Template is supplied, but this may be
     * overriden to create custom field structures. The template processes values returned from
     * {@link Ext.layout.FormLayout#getTemplateArgs}.
     * @property fieldTpl
     * @type Ext.Template
     */
    fieldTpl: (function() {
        var t = new Ext.Template(
            '<div class="x-form-item {itemCls}" tabIndex="-1">',
                '<label for="{id}" style="{labelStyle}" class="x-form-item-label">{label}{labelSeparator}</label>',
                '<div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">',
                '</div><div class="{clearCls}"></div>',
            '</div>'
        );
        t.disableFormats = true;
        return t.compile();
    })(),

    /*
     * Destroys this layout. This is a template method that is empty by default, but should be implemented
     * by subclasses that require explicit destruction to purge event handlers or remove DOM nodes.
     * @protected
     */
    destroy : function(){
        if(!Ext.isEmpty(this.targetCls)){
            var target = this.container.getLayoutTarget();
            if(target){
                target.removeClass(this.targetCls);
            }
        }
    }
});
Ext.Container.LAYOUTS['auto'] = Ext.layout.ContainerLayout;

/**
 * @class Ext.Container
 * @extends Ext.BoxComponent
 * <p>Base class for any {@link Ext.BoxComponent} that can contain other Components. Containers handle the
 * basic behavior of containing items, namely adding, inserting and removing items.</p>
 * 
 * <p>The most commonly used Container classes are {@link Ext.Panel}, {@link Ext.Window} and {@link Ext.TabPanel}.
 * If you do not need the capabilities offered by the aforementioned classes you can create a lightweight
 * Container to be encapsulated by an HTML element to your specifications by using the
 * <tt><b>{@link Ext.Component#autoEl autoEl}</b></tt> config option. This is a useful technique when creating
 * embedded {@link Ext.layout.ColumnLayout column} layouts inside {@link Ext.form.FormPanel FormPanels}
 * for example.</p>
 *   
 * <p>The code below illustrates both how to explicitly create a Container, and how to implicitly
 * create one using the <b><tt>'container'</tt></b> xtype:<pre><code>
// explicitly create a Container
var embeddedColumns = new Ext.Container({
    autoEl: 'div',  // This is the default
    layout: 'column',
    defaults: {
        // implicitly create Container by specifying xtype
        xtype: 'container',
        autoEl: 'div', // This is the default.
        layout: 'form',
        columnWidth: 0.5,
        style: {
            padding: '10px'
        }
    },
//  The two items below will be Ext.Containers, each encapsulated by a &lt;DIV> element.
    items: [{
        items: {
            xtype: 'datefield',
            name: 'startDate',
            fieldLabel: 'Start date'
        }
    }, {
        items: {
            xtype: 'datefield',
            name: 'endDate',
            fieldLabel: 'End date'
        }
    }]
});</code></pre></p>
 * 
 * <p><u><b>Layout</b></u></p> 
 * <p>Every Container delegates the rendering of its child Components to a layout manager class which must be
 * configured into the Container using the <tt><b>{@link #layout}</b></tt> configuration property.</p>
 * <p>When either specifying child {@link #items} of a Container, or dynamically {@link #add adding} components
 * to a Container, remember to consider how you wish the Container to arrange those child elements, and whether
 * those child elements need to be sized using one of Ext's built-in <tt><b>{@link #layout}</b></tt> schemes. By
 * default, Containers use the {@link Ext.layout.ContainerLayout ContainerLayout} scheme. This simply renders
 * child components, appending them one after the other inside the Container, and <b>does not apply any sizing</b>
 * at all.</p>
 * <p>A common mistake is when a developer neglects to specify a <tt><b>{@link #layout}</b></tt>.  Widgets like
 * GridPanels or TreePanels are added to Containers for which no <tt><b>{@link #layout}</b></tt> has been specified.
 * If a Container is left to use the default {@link Ext.layout.ContainerLayout ContainerLayout} scheme, none of its
 * child components will be resized, or changed in any way when the Container is resized.</p>
 * <p>Another variation of this problem is when a developer will attempt to add a GridPanel to a TabPanel by wrapping
 * the GridPanel <i>inside</i> a wrapping Panel (that has no <tt><b>{@link #layout}</b></tt> specified) and add that
 * wrapping Panel to the TabPanel. A GridPanel <b>is</b> a Component which can be added unadorned into a Container.
 * If that wrapping Panel has no <tt><b>{@link #layout}</b></tt> configuration, then the GridPanel will not be sized
 * as expected.<p>
 * <p>Below is an example of adding a newly created GridPanel to a TabPanel. Note that a TabPanel uses
 * {@link Ext.layout.CardLayout} as its layout manager which means all its child items are sized to
 * {@link Ext.layout.FitLayout fit} exactly into its client area. The following code requires prior knowledge of
 * how to create GridPanels. See {@link Ext.grid.GridPanel}, {@link Ext.data.Store} and {@link Ext.data.JsonReader}
 * as well as the grid examples in the Ext installation's <tt>examples/grid</tt> directory.</p><pre><code>
//  Create the GridPanel.
myGrid = new Ext.grid.GridPanel({
    store: myStore,
    columns: myColumnModel,
    title: 'Results', // the title becomes the title of the tab
});

myTabPanel.add(myGrid);
myTabPanel.setActiveTab(myGrid);
</code></pre>
 * @xtype container
 */
Ext.Container = Ext.extend(Ext.BoxComponent, {
    /** 
     * @cfg {Boolean} monitorResize
     * True to automatically monitor window resize events to handle anything that is sensitive to the current size
     * of the viewport.  This value is typically managed by the chosen <tt>{@link #layout}</tt> and should not need
     * to be set manually.
     */
    /**
     * @cfg {String/Object} layout
     * <tt>layout</tt> may be specified either as an Object or as a String:
     * <div><ul class="mdetail-params">
     * 
     * <li><u>Specify as an Object</u></li>
     * <div><ul class="mdetail-params">
     * <li>Example usage:</li>
<pre><code>
layout: {
    type: 'vbox',
    padding: '5',
    align: 'left'
} 
</code></pre>
     * 
     * <li><tt><b>type</b></tt></li>
     * <br/><p>The layout type to be used for this container.  If not specified, a default {@link Ext.layout.ContainerLayout}
     * will be created and used.</p>
     * <br/><p>Valid layout <tt>type</tt> values are:</p>
     * <div class="sub-desc"><ul class="mdetail-params">
     * <li><tt><b>{@link Ext.layout.AbsoluteLayout absolute}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.Accordion accordion}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.AnchorLayout anchor}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.ContainerLayout auto}</b></tt> &nbsp;&nbsp;&nbsp; <b>Default</b></li>
     * <li><tt><b>{@link Ext.layout.BorderLayout border}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.CardLayout card}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.ColumnLayout column}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.FitLayout fit}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.FormLayout form}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.HBox hbox}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.MenuLayout menu}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.TableLayout table}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.ToolbarLayout toolbar}</b></tt></li>
     * <li><tt><b>{@link Ext.layout.VBox vbox}</b></tt></li>
     * </ul></div>
     * 
     * <li>Layout specific configuration properties</li>
     * <br/><p>Additional layout specific configuration properties may also be specified. For complete details regarding
     * the valid config options for each layout type, see the layout class corresponding to the <tt>type</tt> specified.</p>
     * 
     * </ul></div>
     * 
     * <li><u>Specify as a String</u></li>
     * <div><ul class="mdetail-params">
     * <li>Example usage:</li>
<pre><code>
layout: 'vbox',
layoutConfig: {
    padding: '5',
    align: 'left'
} 
</code></pre>
     * <li><tt><b>layout</b></tt></li>
     * <br/><p>The layout <tt>type</tt> to be used for this container (see list of valid layout type values above).</p><br/>
     * <li><tt><b>{@link #layoutConfig}</b></tt></li>
     * <br/><p>Additional layout specific configuration properties. For complete details regarding the valid config
     * options for each layout type, see the layout class corresponding to the <tt>layout</tt> specified.</p>
     * </ul></div></ul></div>
     */
    /**
     * @cfg {Object} layoutConfig
     * This is a config object containing properties specific to the chosen <tt><b>{@link #layout}</b></tt> if
     * <tt><b>{@link #layout}</b></tt> has been specified as a <i>string</i>.</p>
     */    
    /**
     * @cfg {Boolean/Number} bufferResize
     * When set to true (100 milliseconds) or a number of milliseconds, the layout assigned for this container will buffer
     * the frequency it calculates and does a re-layout of components. This is useful for heavy containers or containers
     * with a large quantity of sub-components for which frequent layout calls would be expensive.
     */
    /**
     * @cfg {String/Number} activeItem
     * A string component id or the numeric index of the component that should be initially activated within the
     * container's layout on render.  For example, activeItem: 'item-1' or activeItem: 0 (index 0 = the first
     * item in the container's collection).  activeItem only applies to layout styles that can display
     * items one at a time (like {@link Ext.layout.Accordion}, {@link Ext.layout.CardLayout} and
     * {@link Ext.layout.FitLayout}).  Related to {@link Ext.layout.ContainerLayout#activeItem}.
     */
    /**
     * @cfg {Mixed} items
     * A single item, or an array of child Components to be added to this container.
     * Each item can be any type of object based on {@link Ext.Component}.<br><br>
     * Component config objects may also be specified in order to avoid the overhead
     * of constructing a real Component object if lazy rendering might mean that the
     * added Component will not be rendered immediately. To take advantage of this
     * "lazy instantiation", set the {@link Ext.Component#xtype} config property to
     * the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * If a single item is being passed, it should be passed directly as an object
     * reference (e.g., items: {...}).  Multiple items should be passed as an array
     * of objects (e.g., items: [{...}, {...}]).
     */
    /**
     * @cfg {Object} defaults
     * <p>A config object that will be applied to all components added to this container either via the {@link #items}
     * config or via the {@link #add} or {@link #insert} methods.  The <tt>defaults</tt> config can contain any
     * number of name/value property pairs to be added to each item, and should be valid for the types of items
     * being added to the container.  For example, to automatically apply padding to the body of each of a set of
     * contained {@link Ext.Panel} items, you could pass: <tt>defaults: {bodyStyle:'padding:15px'}</tt>.</p><br/>
     * <p><b>Note</b>: <tt>defaults</tt> will not be applied to config objects if the option is already specified.
     * For example:</p><pre><code>
defaults: {               // defaults are applied to items, not the container
    autoScroll:true
},
items: [
    {
        xtype: 'panel',   // defaults <b>do not</b> have precedence over 
        id: 'panel1',     // options in config objects, so the defaults
        autoScroll: false // will not be applied here, panel1 will be autoScroll:false
    },
    new Ext.Panel({       // defaults <b>do</b> have precedence over options
        id: 'panel2',     // options in components, so the defaults
        autoScroll: false // will be applied here, panel2 will be autoScroll:true.
    })
]
     * </code></pre>
     */

    /** @cfg {Boolean} autoDestroy
     * If true the container will automatically destroy any contained component that is removed from it, else
     * destruction must be handled manually (defaults to true).
     */
    autoDestroy: true,
    /** @cfg {Boolean} hideBorders
     * True to hide the borders of each contained component, false to defer to the component's existing
     * border settings (defaults to false).
     */
    /** @cfg {String} defaultType
     * <p>The default {@link Ext.Component xtype} of child Components to create in this Container when
     * a child item is specified as a raw configuration object, rather than as an instantiated Component.</p>
     * <p>Defaults to <tt>'panel'</tt>, except {@link Ext.Toolbar} which defaults to <tt>'button'</tt>.</p>
     */
    defaultType: 'panel',

    // private
    initComponent : function(){
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event afterlayout
             * Fires when the components in this container are arranged by the associated layout manager.
             * @param {Ext.Container} this
             * @param {ContainerLayout} layout The ContainerLayout implementation for this container
             */
            'afterlayout',
            /**
             * @event beforeadd
             * Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being added
             * @param {Number} index The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was added
             * @param {Number} index The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was removed
             */
            'remove'
        );
		
		this.enableBubble('add', 'remove');

        /**
         * The collection of components in this container as a {@link Ext.util.MixedCollection}
         * @type MixedCollection
         * @property items
         */
        var items = this.items;
        if(items){
            delete this.items;
            if(Ext.isArray(items) && items.length > 0){
                this.add.apply(this, items);
            }else{
                this.add(items);
            }
        }
    },

    // private
    initItems : function(){
        if(!this.items){
            this.items = new Ext.util.MixedCollection(false, this.getComponentId);
            this.getLayout(); // initialize the layout
        }
    },

    // private
    setLayout : function(layout){
        if(this.layout && this.layout != layout){
            this.layout.setContainer(null);
        }
        this.initItems();
        this.layout = layout;
        layout.setContainer(this);
    },

    // private
    render : function(){
        Ext.Container.superclass.render.apply(this, arguments);
        if(this.layout){
            if(typeof this.layout == 'object' && !this.layout.layout){
                this.layoutConfig = this.layout;
                this.layout = this.layoutConfig.type;
            }
            if(typeof this.layout == 'string'){
                this.layout = new Ext.Container.LAYOUTS[this.layout.toLowerCase()](this.layoutConfig);
            }
            this.setLayout(this.layout);

            if(this.activeItem !== undefined){
                var item = this.activeItem;
                delete this.activeItem;
                this.layout.setActiveItem(item);
                return;
            }
        }
        if(!this.ownerCt){
            this.doLayout();
        }
        if(this.monitorResize === true){
            Ext.EventManager.onWindowResize(this.doLayout, this, [false]);
        }
    },

    /**
     * <p>Returns the Element to be used to contain the child Components of this Container.</p>
     * <p>An implementation is provided which returns the Container's {@link #getEl Element}, but
     * if there is a more complex structure to a Container, this may be overridden to return
     * the element into which the {@link #layout layout} renders child Components.</p>
     * @return {Ext.Element} The Element to render child Components into.
     */
    getLayoutTarget : function(){
        return this.el;
    },

    // private - used as the key lookup function for the items collection
    getComponentId : function(comp){
        return comp.itemId || comp.id;
    },

    /**
     * <p>Adds a {@link Ext.Component Component} to this Container. Fires the {@link #beforeadd} event before
     * adding, then fires the {@link #add} event after the component has been added.</p>
     * <p>You will never call the render method of a child Component when using a Container.
     * Child Components are rendered by this Container's {@link #layout} manager when
     * this Container is first rendered.</p>
     * <p>Certain layout managers allow dynamic addition of child components. Those that do
     * include {@link Ext.layout.CardLayout}, {@link Ext.layout.AnchorLayout},
     * {@link Ext.layout.FormLayout}, {@link Ext.layout.TableLayout}.</p>
     * <p>If the Container is already rendered when add is called, you may need to call
     * {@link #doLayout} to refresh the view which causes any unrendered child Components
     * to be rendered. This is required so that you can add multiple child components if needed
     * while only refreshing the layout once.</p>
     * <p>When creating complex UIs, it is important to remember that sizing and positioning
     * of child items is the responsibility of the Container's {@link #layout} manager. If
     * you expect child items to be sized in response to user interactions, you must
     * specify a layout manager which creates and manages the type of layout you have in mind.</p>
     * <p><b>Omitting the {@link #layout} config means that a basic layout manager is
     * used which does nothing but render child components sequentially into the Container.
     * No sizing or positioning will be performed in this situation.</b></p>
     * @param {Ext.Component/Object} component The Component to add.<br><br>
     * Ext uses lazy rendering, and will only render the added Component should
     * it become necessary, that is: when the Container is layed out either on first render
     * or in response to a {@link #doLayout} call.<br><br>
     * A Component config object may be passed instead of an instantiated Component object.
     * The type of Component created from a config object is determined by the {@link Ext.Component#xtype xtype}
     * config property. If no xtype is configured, the Container's {@link #defaultType}
     * is used.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @param {Ext.Component/Object} component2
     * @param {Ext.Component/Object} etc
     * @return {Ext.Component} component The Component (or config object) that was
     * added with the Container's default config values applied.
     * <p>example:</p><pre><code>
var myNewGrid = new Ext.grid.GridPanel({
    store: myStore,
    colModel: myColModel
});
myTabPanel.add(myNewGrid);
myTabPanel.setActiveTab(myNewGrid);
</code></pre>
     */
    add : function(comp){
        this.initItems();
        var a = arguments, len = a.length;
        if(len > 1){
            for(var i = 0; i < len; i++) {
                Ext.Container.prototype.add.call(this, a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        var pos = this.items.length;
        if(this.fireEvent('beforeadd', this, c, pos) !== false && this.onBeforeAdd(c) !== false){
            this.items.add(c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, pos);
        }
        return c;
    },

    /**
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add} event after the
     * Component has been inserted.
     * @param {Number} index The index at which the Component will be inserted
     * into the Container's items collection
     * @param {Ext.Component} component The child Component to insert.<br><br>
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.<br><br>
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this "lazy instantiation", set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @return {Ext.Component} component The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp){
        this.initItems();
        var a = arguments, len = a.length;
        if(len > 2){
            for(var i = len-1; i >= 1; --i) {
                this.insert(index, a[i]);
            }
            return;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));

        if(c.ownerCt == this && this.items.indexOf(c) < index){
            --index;
        }

        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            this.items.insert(index, c);
            c.ownerCt = this;
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

    // private
    applyDefaults : function(c){
        if(this.defaults){
            if(typeof c == 'string'){
                c = Ext.ComponentMgr.get(c);
                Ext.apply(c, this.defaults);
            }else if(!c.events){
                Ext.applyIf(c, this.defaults);
            }else{
                Ext.apply(c, this.defaults);
            }
        }
        return c;
    },

    // private
    onBeforeAdd : function(item){
        if(item.ownerCt){
            item.ownerCt.remove(item, false);
        }
        if(this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    /**
     * Removes a component from this container.  Fires the {@link #beforeremove} event before removing, then fires
     * the {@link #remove} event after the component has been removed.
     * @param {Component/String} component The component reference or id to remove.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component} component The Component that was removed.
     */
    remove : function(comp, autoDestroy){
        this.initItems();
        var c = this.getComponent(comp);
        if(c && this.fireEvent('beforeremove', this, c) !== false){
            this.items.remove(c);
            delete c.ownerCt;
            if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
                c.destroy();
            }
            if(this.layout && this.layout.activeItem == c){
                delete this.layout.activeItem;
            }
            this.fireEvent('remove', this, c);
        }
        return c;
    },
    
    /**
     * Removes all components from this container.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Array} Array of the destroyed components
     */
    removeAll: function(autoDestroy){
        this.initItems();
        var item, items = [];
        while((item = this.items.last())){
            items.unshift(this.remove(item, autoDestroy));
        }
        return items;
    },

    /**
     * Gets a direct child Component by id, or by index.
     * @param {String/Number} id or index of child Component to return.
     * @return Ext.Component
     */
    getComponent : function(comp){
        if(typeof comp == 'object'){
            return comp;
        }
        return this.items.get(comp);
    },

    // private
    lookupComponent : function(comp){
        if(typeof comp == 'string'){
            return Ext.ComponentMgr.get(comp);
        }else if(!comp.events){
            return this.createComponent(comp);
        }
        return comp;
    },

    // private
    createComponent : function(config){
        return Ext.create(config, this.defaultType);
    },

    /**
     * Force this container's layout to be recalculated. A call to this function is required after adding a new component
     * to an already rendered container, or possibly after changing sizing/position properties of child components.
     * @param {Boolean} shallow (optional) True to only calc the layout of this component, and let child components auto
     * calc layouts as required (defaults to false, which calls doLayout recursively for each subcontainer)
     * @return {Ext.Container} this
     */
    doLayout : function(shallow){
        var rendered = this.rendered;
        if(rendered && this.layout){
            this.layout.layout();
        }
        if(shallow !== false && this.items){
            var cs = this.items.items;
            for(var i = 0, len = cs.length; i < len; i++) {
                var c  = cs[i];
                if(c.doLayout){
                    c.doLayout();
                }
            }
        }
        if(rendered){
            this.onLayout(shallow)
        }
        return this;
    },
    
    //private
    onLayout: Ext.emptyFn,

    /**
     * Returns the layout currently in use by the container.  If the container does not currently have a layout
     * set, a default {@link Ext.layout.ContainerLayout} will be created and set as the container's layout.
     * @return {ContainerLayout} layout The container's layout
     */
    getLayout : function(){
        if(!this.layout){
            var layout = new Ext.layout.ContainerLayout(this.layoutConfig);
            this.setLayout(layout);
        }
        return this.layout;
    },

    // private
    beforeDestroy : function(){
        if(this.items){
            Ext.destroy.apply(Ext, this.items.items);
        }
        if(this.monitorResize){
            Ext.EventManager.removeResizeListener(this.doLayout, this);
        }
        Ext.destroy(this.layout);
        Ext.Container.superclass.beforeDestroy.call(this);
    },

    /**
     * Bubbles up the component/container heirarchy, calling the specified function with each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Container} this
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
        return this;
    },

    /**
     * Cascades down the component/container heirarchy from this component (called first), calling the specified function with
     * each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current component)
     * @param {Array} args (optional) The args to call the function with (defaults to passing the current component)
     * @return {Ext.Container} this
     */
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || cs[i], args || [cs[i]]);
                    }
                }
            }
        }
        return this;
    },

    /**
     * Find a component under this container at any level by id
     * @param {String} id
     * @return Ext.Component
     */
    findById : function(id){
        var m, ct = this;
        this.cascade(function(c){
            if(ct != c && c.id === id){
                m = c;
                return false;
            }
        });
        return m || null;
    },

    /**
     * Find a component under this container at any level by xtype or class
     * @param {String/Class} xtype The xtype string for a component, or the class of the component directly
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Array} Array of Ext.Components
     */
    findByType : function(xtype, shallow){
        return this.findBy(function(c){
            return c.isXType(xtype, shallow);
        });
    },

    /**
     * Find a component under this container at any level by property
     * @param {String} prop
     * @param {String} value
     * @return {Array} Array of Ext.Components
     */
    find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },

    /**
     * Find a component under this container at any level by a custom function. If the passed function returns
     * true, the component will be included in the results. The passed function is called with the arguments (component, this container).
     * @param {Function} fcn
     * @param {Object} scope (optional)
     * @return {Array} Array of Ext.Components
     */
    findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    },

    /**
     * Get a component contained by this container (alias for items.get(key))
     * @param {String/Number} key The index or id of the component
     * @return {Ext.Component} Ext.Component
     */
    get : function(key){
        return this.items.get(key);
    }
});

Ext.Container.LAYOUTS = {};
Ext.reg('container', Ext.Container);
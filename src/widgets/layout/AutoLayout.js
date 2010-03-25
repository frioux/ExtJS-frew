/**
 * @class Ext.layout.AutoLayout
 * <p>The AutoLayout is the default layout manager delegated by {@link Ext.Container} to
 * render any child Components when no <tt>{@link Ext.Container#layout layout}</tt> is configured into
 * a {@link Ext.Container Container}.</tt>.  AutoLayout provides only a passthrough of any layout calls
 * to any child containers.</p>
 */
Ext.layout.AutoLayout = Ext.extend(Ext.layout.ContainerLayout, {
    type: 'auto',

    monitorResize: true,

    runLayout: function(){
        var ct = this.container;
        ct.doLayout();
        delete ct.layoutPending;
    }
});

Ext.Container.LAYOUTS['auto'] = Ext.layout.AutoLayout;

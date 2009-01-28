/**
 * @class Ext.layout.AbsoluteLayout
 * @extends Ext.layout.AnchorLayout
 * <p>Inherits the anchoring of {@link Ext.layout.AnchorLayout} and adds the ability for x/y positioning using the
 * standard x and y component config options.</p>
 */
Ext.layout.AbsoluteLayout = Ext.extend(Ext.layout.AnchorLayout, {
    /**
     * @cfg {String} extraCls
     * An optional extra CSS class that will be added to the container (defaults to 'x-abs-layout-item').  This can be useful for
     * adding customized styles to the container or any of its children using standard CSS rules.
     */
    extraCls: '',

    onLayout : function(ct, target){
        target.position();
        this.paddingLeft = target.getPadding('l');
        this.paddingTop = target.getPadding('t');

        Ext.layout.AbsoluteLayout.superclass.onLayout.call(this, ct, target);
    },

    // private
    adjustWidthAnchor : function(value, comp){
        return value ? value - comp.getPosition(true)[0] + this.paddingLeft : value;
    },

    // private
    adjustHeightAnchor : function(value, comp){
        return  value ? value - comp.getPosition(true)[1] + this.paddingTop : value;
    }
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['absolute'] = Ext.layout.AbsoluteLayout;
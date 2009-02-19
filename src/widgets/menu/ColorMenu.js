/**
 * @class Ext.menu.ColorMenu
 * @extends Ext.menu.Menu
 * A menu containing a {@link Ext.menu.ColorItem} component (which provides a basic color picker).
 */
 Ext.menu.ColorMenu = Ext.extend(Ext.menu.Menu, {
    /** 
     * @cfg {Boolean} enableScrolling
     * @hide 
     */
    enableScrolling: false,
    /** 
     * @cfg {Number} maxHeight
     * @hide 
     */
    /** 
     * @cfg {Number} scrollIncrement
     * @hide 
     */
    
    initComponent: function(){
        this.ci = new Ext.menu.ColorItem(this.initialConfig);
        this.relayEvents(this.ci, ['select']);
        /**
         * The {@link Ext.ColorPalette} instance for this ColorMenu
         * @type ColorPalette
         */
        this.palette = this.ci.palette;
        Ext.apply(this, {
            plain: true,
            showSeparator: false,
            items: this.ci
        });
        Ext.menu.ColorMenu.superclass.initComponent.call(this);
    }
 });
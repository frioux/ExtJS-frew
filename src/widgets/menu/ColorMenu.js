/**
 * @class Ext.menu.ColorMenu
 * @extends Ext.menu.Menu
 * A menu containing a {@link Ext.ColorPalette} Component.
 * @xtype colormenu
 */
 Ext.menu.ColorMenu = Ext.extend(Ext.menu.Menu, {
    /** 
     * @cfg {Boolean} enableScrolling
     * @hide 
     */
    enableScrolling: false,
    
    /** 
     * @cfg {Boolean} hideOnClick
     * False to continue showing the menu after a color is selected, defaults to true.
     */
    hideOnClick: true,
    
    /** 
     * @cfg {Number} maxHeight
     * @hide 
     */
    /** 
     * @cfg {Number} scrollIncrement
     * @hide 
     */
    /**
     * @property palette
     * @type ColorPalette
     * The {@link Ext.ColorPalette} instance for this ColorMenu
     */
    initComponent: function(){
        Ext.apply(this, {
            plain: true,
            showSeparator: false,
            items: this.palette = new Ext.ColorPalette(this.initialConfig)
        });
        this.palette.purgeListeners();
        Ext.menu.ColorMenu.superclass.initComponent.call(this);
        this.relayEvents(this.palette, ['select']);
        this.on('select', this.doHide, this);
        if(this.handler){
            this.on('select', this.handler, this.scope || this)
        }
    },

    doHide: function(){
        if(this.hideOnClick){
            this.hide(true);
        }
    }
});
Ext.reg('colormenu', Ext.menu.ColorMenu);
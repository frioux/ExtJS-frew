/**
 * @class Ext.menu.ColorItem
 * @extends Ext.menu.Adapter
 * @constructor
 */
Ext.menu.ColorItem = function(config){
    Ext.menu.ColorItem.superclass.constructor.call(this, new Ext.ColorPalette(config), config);
    /** The Ext.ColorPalette object @type Ext.ColorPalette */
    this.palette = this.component;
    this.relayEvents(this.palette, ["select"]);
    if(this.selectHandler){
        this.on('select', this.selectHandler, this.scope);
    }
};
Ext.extend(Ext.menu.ColorItem, Ext.menu.Adapter);
/**
 * @class Ext.menu.DateMenu
 * @extends Ext.menu.Menu
 * A menu containing a {@link Ext.menu.DateItem} component (which provides a date picker).
 * @constructor
 * Creates a new DateMenu
 * @param {Object} config Configuration options
 */
Ext.menu.DateMenu = function(config){
    Ext.menu.DateMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var di = new Ext.menu.DateItem(config);
    this.add(di);
    this.picker = di.picker;
    this.relayEvents(di, ["select"]);
};
Ext.extend(Ext.menu.DateMenu, Ext.menu.Menu);
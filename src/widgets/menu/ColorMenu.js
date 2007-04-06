Ext.menu.ColorMenu = function(config){
    Ext.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Ext.menu.ColorItem(config);
    this.add(ci);
    this.palette = ci.palette;
    this.relayEvents(ci, ["select"]);
};
Ext.extend(Ext.menu.ColorMenu, Ext.menu.Menu);
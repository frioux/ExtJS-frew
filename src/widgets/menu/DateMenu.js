Ext.menu.DateMenu = function(config){
    Ext.menu.DateMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var di = new Ext.menu.DateItem(config);
    this.add(di);
    this.picker = di.picker;
    this.relayEvents(di, ["select"]);
};
Ext.extend(Ext.menu.DateMenu, Ext.menu.Menu);
/**
 * @class Ext.menu.DateMenu
 * @extends Ext.menu.Menu
 * A menu containing a {@link Ext.menu.DateItem} component (which provides a date picker).
 */
 Ext.menu.DateMenu = Ext.extend(Ext.menu.Menu, {
    cls:'x-date-menu',
    
    initComponent: function(){
        this.strict = (Ext.isIE7 && Ext.isStrict);
        this.di = new Ext.menu.DateItem(Ext.apply({}, {internalRender: this.strict || !Ext.isIE}, this.initialConfig));
        this.relayEvents(this.di, ["select"]);
        this.on('beforeshow', this.onBeforeShow, this);
        if(this.strict){
            this.on('show', this.onShow, this, {single: true, delay: 20});
        }
        /**
         * The {@link Ext.DatePicker} instance for this DateMenu
         * @type DatePicker
        */
        this.picker = this.di.picker;
        Ext.apply(this, {
            plain: true,
            showSeparator: false,
            items: this.di
        });
        Ext.menu.DateMenu.superclass.initComponent.call(this);
    },
    
    onBeforeShow: function(){
        if (this.picker){
            this.picker.hideMonthPicker(true);
        }
    },
    
    onShow: function(){
        var el = this.picker.getEl();
        el.setWidth(el.getWidth()); //nasty hack for IE7 strict mode
    }
 });
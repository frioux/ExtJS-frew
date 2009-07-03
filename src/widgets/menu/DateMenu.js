/**
 * @class Ext.menu.DateMenu
 * @extends Ext.menu.Menu
 * A menu containing an {@link Ext.DatePicker} Component.
 * @xtype datemenu
 */
 Ext.menu.DateMenu = Ext.extend(Ext.menu.Menu, {
    /** 
     * @cfg {Boolean} enableScrolling
     * @hide 
     */
    enableScrolling : false,
    /**
     * @cfg {Function} handler
     * Optional. A function that will handle the select event of this menu.
     * The handler is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>picker</code> : DatePicker<div class="sub-desc">The Ext.DatePicker.</div></li>
     * <li><code>date</code> : Date<div class="sub-desc">The selected date.</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Object} scope
     * The scope (<tt><b>this</b></tt> reference) in which the <code>{@link #handler}</code>
     * function will be called.  Defaults to this DateMenu instance.
     */    
    /** 
     * @cfg {Boolean} hideOnClick
     * False to continue showing the menu after a date is selected, defaults to true.
     */
    hideOnClick : true,
    
    /** 
     * @cfg {Number} maxHeight
     * @hide 
     */
    /** 
     * @cfg {Number} scrollIncrement
     * @hide 
     */
    /**
     * The {@link Ext.DatePicker} instance for this DateMenu
     * @property picker
     * @type DatePicker
     */
    cls : 'x-date-menu',
    
    /**
     * @event click
     * @hide
     */
    
    /**
     * @event itemclick
     * @hide
     */

    initComponent : function(){
        this.on('beforeshow', this.onBeforeShow, this);
        if(this.strict = (Ext.isIE7 && Ext.isStrict)){
            this.on('show', this.onShow, this, {single: true, delay: 20});
        }
        Ext.apply(this, {
            plain: true,
            showSeparator: false,
            items: this.picker = new Ext.DatePicker(Ext.apply({
                internalRender: this.strict || !Ext.isIE,
                ctCls: 'x-menu-date-item'
            }, this.initialConfig))
        });
        this.picker.purgeListeners();
        Ext.menu.DateMenu.superclass.initComponent.call(this);
        /**
         * @event select
         * Fires when a date is selected from the {@link #picker Ext.DatePicker}
         * @param {DatePicker} picker The {@link #picker Ext.DatePicker}
         * @param {Date} date The selected date
         */
        this.relayEvents(this.picker, ['select']);
        this.on('select', this.menuHide, this);
        if(this.handler){
            this.on('select', this.handler, this.scope || this);
        }
    },

    menuHide : function() {
        if(this.hideOnClick){
            this.hide(true);
        }
    },

    onBeforeShow : function(){
        if(this.picker){
            this.picker.hideMonthPicker(true);
        }
    },

    onShow : function(){
        var el = this.picker.getEl();
        el.setWidth(el.getWidth()); //nasty hack for IE7 strict mode
    }
 });
 Ext.reg('datemenu', Ext.menu.DateMenu);
 
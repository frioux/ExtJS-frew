/**
 * @class Ext.PagingToolbar
 * @extends Ext.Toolbar
 * A specialized toolbar that is bound to a {@link Ext.data.Store} and provides automatic paging controls.
 * @constructor
 * Create a new PagingToolbar
 * @param {Object} config The config object
 */
(function() {

var T = Ext.Toolbar;

Ext.PagingToolbar = Ext.extend(Ext.Toolbar, {
    /**
     * @cfg {Ext.data.Store} store The {@link Ext.data.Store} the paging toolbar should use as its data source (required).
     */
    /**
     * @cfg {Boolean} displayInfo
     * True to display the displayMsg (defaults to false)
     */
    /**
     * @cfg {Number} pageSize
     * The number of records to display per page (defaults to 20)
     */
    /**
     * @cfg {Boolean} prependButtons
     * True to insert any configured items <i>before</i> the paging buttons. Defaults to false.
     */

    pageSize: 20,
    /**
     * @cfg {String} displayMsg
     * The paging status message to display (defaults to "Displaying {0} - {1} of {2}").  Note that this string is
     * formatted using the braced numbers 0-2 as tokens that are replaced by the values for start, end and total
     * respectively. These tokens should be preserved when overriding this string if showing those values is desired.
     */
    displayMsg : 'Displaying {0} - {1} of {2}',
    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found (defaults to "No data to display")
     */
    emptyMsg : 'No data to display',
    /**
     * Customizable piece of the default paging text (defaults to "Page")
     * @type String
     */
    beforePageText : "Page",
    /**
     * Customizable piece of the default paging text (defaults to "of {0}"). Note that this string is
     * formatted using {0} as a token that is replaced by the number of total pages. This token should be 
     * preserved when overriding this string if showing the total page count is desired.
     * @type String
     */
    afterPageText : "of {0}",
    /**
     * Customizable piece of the default paging text (defaults to "First Page")
     * @type String
     */
    firstText : "First Page",
    /**
     * Customizable piece of the default paging text (defaults to "Previous Page")
     * @type String
     */
    prevText : "Previous Page",
    /**
     * Customizable piece of the default paging text (defaults to "Next Page")
     * @type String
     */
    nextText : "Next Page",
    /**
     * Customizable piece of the default paging text (defaults to "Last Page")
     * @type String
     */
    lastText : "Last Page",
    /**
     * Customizable piece of the default paging text (defaults to "Refresh")
     * @type String
     */
    refreshText : "Refresh",

    /**
     * Object mapping of parameter names for load calls (defaults to {start: 'start', limit: 'limit'})
     */
    paramNames : {start: 'start', limit: 'limit'},

    // private
    constructor: function(config) {
	    var pagingItems = [this.first = new T.Button({
	        tooltip: this.firstText,
	        iconCls: "x-tbar-page-first",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), this.prev = new T.Button({
	        tooltip: this.prevText,
	        iconCls: "x-tbar-page-prev",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), '-', this.beforePageText,
	    this.inputItem = new T.Item({
	    	height: 18,
	    	autoEl: {
		        tag: "input",
		        type: "text",
		        size: "3",
		        value: "1",
		        cls: "x-tbar-page-number"
		    }
	    }), this.afterTextItem = new T.TextItem({
	    	text: String.format(this.afterPageText, 1)
	    }), '-', this.next = new T.Button({
            tooltip: this.nextText,
	        iconCls: "x-tbar-page-next",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), this.last = new T.Button({
	        tooltip: this.lastText,
	        iconCls: "x-tbar-page-last",
	        disabled: true,
	        handler: this.onClick,
	        scope: this
	    }), '-', this.refresh = new T.Button({
	        tooltip: this.refreshText,
	        iconCls: "x-tbar-loading",
	        handler: this.onClick,
	        scope: this
	    })];


        var userItems = config.items || config.buttons || [];
        if (config.prependButtons) {
            config.items = userItems.concat(pagingItems);
        }else{
            config.items = pagingItems.concat(userItems);
        }
	    delete config.buttons;
	    if(config.displayInfo){
            config.items.push('->');
            config.items.push(this.displayItem = new T.TextItem({}));
        }
	    Ext.PagingToolbar.superclass.constructor.apply(this, arguments);

        this.addEvents('change', 'beforechange');
               
        this.cursor = 0;
        this.bind(this.store);
        this.on('afterlayout', this.onFirstLayout, this, {single: true});
	},

    // private
	onFirstLayout: function(ii) {
    	this.inputItem.el.on({
	    	keydown: {fn: this.onPagingKeydown, scope: this},
	    	focus: function(){this.select();}
	    });
        this.field = this.inputItem.el.dom;
        if(this.dsLoaded){
            this.onLoad.apply(this, this.dsLoaded);
        }
	},

    // private
    updateInfo : function(){
        if(this.displayItem){
            var count = this.store.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.store.getTotalCount()
                );
            this.displayItem.setText(msg);
        }
    },

    // private
    onLoad : function(store, r, o){
        if(!this.rendered){
            this.dsLoaded = [store, r, o];
            return;
        }
        this.cursor = (o.params && o.params[this.paramNames.start]) ? o.params[this.paramNames.start] : 0;
        var d = this.getPageData(), ap = d.activePage, ps = d.pages;

        this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
        this.field.value = ap;
        this.first.setDisabled(ap == 1);
        this.prev.setDisabled(ap == 1);
        this.next.setDisabled(ap == ps);
        this.last.setDisabled(ap == ps);
        this.refresh.enable();
        this.updateInfo();
        this.fireEvent('change', this, d);
    },

    // private
    getPageData : function(){
        var total = this.store.getTotalCount();
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },

    /**
     * Change the active page
     * @param {Integer} page The page to display
     */
    changePage: function(page){
        this.doLoad(((page-1) * this.pageSize).constrain(0, this.store.getTotalCount()));
    },

    // private
    onLoadError : function(){
        if(!this.rendered){
            return;
        }
        this.refresh.enable();
    },

    // private
    readPage : function(d){
        var v = this.field.value, pageNum;
        if (!v || isNaN(pageNum = parseInt(v, 10))) {
            this.field.value = d.activePage;
            return false;
        }
        return pageNum;
    },

    // private
    onPagingKeydown : function(e){
        var k = e.getKey(), d = this.getPageData(), pageNum;
        if (k == e.RETURN) {
            e.stopEvent();
            pageNum = this.readPage(d);
            if(pageNum !== false){
                pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
                this.doLoad(pageNum * this.pageSize);
            }
        }else if (k == e.HOME || k == e.END){
            e.stopEvent();
            pageNum = k == e.HOME ? 1 : d.pages;
            this.field.value = pageNum;
        }else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN){
            e.stopEvent();
            if(pageNum = this.readPage(d)){
                var increment = e.shiftKey ? 10 : 1;
                if(k == e.DOWN || k == e.PAGEDOWN){
                    increment *= -1;
                }
                pageNum += increment;
                if(pageNum >= 1 & pageNum <= d.pages){
                    this.field.value = pageNum;
                }
            }
        }
    },

    // private
    beforeLoad : function(){
        if(this.rendered && this.refresh){
            this.refresh.disable();
        }
    },

    // private
    doLoad : function(start){
        var o = {}, pn = this.paramNames;
        o[pn.start] = start;
        o[pn.limit] = this.pageSize;
        if(this.fireEvent('beforechange', this, o) !== false){
            this.store.load({params:o});
        }
    },

    // private
    onClick : function(button){
        var store = this.store;
        switch(button){
            case this.first:
                this.doLoad(0);
            break;
            case this.prev:
                this.doLoad(Math.max(0, this.cursor-this.pageSize));
            break;
            case this.next:
                this.doLoad(this.cursor+this.pageSize);
            break;
            case this.last:
                var total = store.getTotalCount();
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                this.doLoad(lastStart);
            break;
            case this.refresh:
                this.doLoad(this.cursor);
            break;
        }
    },

    /**
     * Unbinds the paging toolbar from the specified {@link Ext.data.Store}
     * @param {Ext.data.Store} store The data store to unbind
     */
    unbind : function(store){
        store = Ext.StoreMgr.lookup(store);
        store.un("beforeload", this.beforeLoad, this);
        store.un("load", this.onLoad, this);
        store.un("loadexception", this.onLoadError, this);
        this.store = undefined;
    },

    /**
     * Binds the paging toolbar to the specified {@link Ext.data.Store}
     * @param {Ext.data.Store} store The data store to bind
     */
    bind : function(store){
        store = Ext.StoreMgr.lookup(store);
        store.on("beforeload", this.beforeLoad, this);
        store.on("load", this.onLoad, this);
        store.on("loadexception", this.onLoadError, this);
        this.store = store;
        this.paramNames.start = store.paramNames.start;
        this.paramNames.limit = store.paramNames.limit;
    },
    
    // private
    onDestroy : function(){
        if(this.store){
            this.unbind(this.store);
        }
        Ext.PagingToolbar.superclass.onDestroy.call(this);
    }
});

})();
Ext.reg('paging', Ext.PagingToolbar);
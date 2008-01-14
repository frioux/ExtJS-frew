/**
 * @class Ext.grid.GridView
 * @extends Ext.util.Observable
 * This class encapsulates the user interface of an {@link Ext.grid.Grid}<p>
 * Methods of this class may be used to access user interface elements to enable
 * special display effects. Do not change the DOM structure of the user interface.
 * <br>
 * <p>This class does not provide ways to manipulate the underlying data. The data
 * model of a Grid is held in an {@link Ext.data.Store}.
 *
 * @constructor
 * @param {Object} config
 */
Ext.grid.GridView = function(config){
    Ext.grid.GridView.superclass.constructor.call(this);
    this.el = null;

    Ext.apply(this, config);
};

Ext.extend(Ext.grid.GridView, Ext.grid.AbstractGridView, {

    /**
     * Override this function to apply custom CSS classes to rows during rendering.  You can also supply custom
     * parameters to the row template for the current row to customize how it is rendered using the <b>rowParams</b>
     * parameter.  This function should return the CSS class name (or empty string '' for none) that will be added
     * to the row's wrapping div.  To apply multiple class names, simply return them space-delimited within the string
     * (e.g., 'my-class another-class').
     * @param {Record} record The {@link Ext.data.Record} corresponding to the current row
     * @param {Number} index The row index
     * @param {Object} rowParams A config object that is passed to the row template during rendering that allows
     * customization of various aspects of a body row, if applicable.  Note that this object will only be applied if
     * {@link #enableRowBody} = true, otherwise it will be ignored. The object may contain any of these properties:<ul>
     * <li><code>body</code> : String <div class="sub-desc">An HTML fragment to be rendered as the cell's body content (defaults to '').</div></li>
     * <li><code>bodyStyle</code> : String <div class="sub-desc">A CSS style string that will be applied to the row's TR style attribute (defaults to '').</div></li>
     * <li><code>cols</code> : Number <div class="sub-desc">The column count to apply to the body row's TD colspan attribute (defaults to the current
     * column count of the grid).</div></li>
     * </ul>
     * @param {Store} ds The {@link Ext.data.Store} this grid is bound to
     * @method getRowClass
     */

    /**
     * The CSS classes applied to a header when it is sorted. (defaults to ["sort-asc", "sort-desc"])
     * @type Array
     */
    sortClasses : ["sort-asc", "sort-desc"],

    //private - internal configs
    hlColor: "C3DAF9",
    enableMoveAnim : false,
    rowClass : "x-grid-row",
    cellClass : "x-grid-col",
    tdClass : "x-grid-td",
    hdClass : "x-grid-hd",
    splitClass : "x-grid-split",

    // private shorthand vars
    dh : Ext.DomHelper,
    fly : Ext.Element.fly,
    css : Ext.util.CSS,

    // private
    borderWidth: 1,
    splitOffset: 3,
    scrollIncrement : 22,
    cellRE: /(?:.*?)x-grid-(?:hd|cell|csplit)-(?:[\d]+)-([\d]+)(?:.*?)/,
    findRE: /\s?(?:x-grid-hd|x-grid-col|x-grid-csplit)\s/,

    // private
    bind : function(ds, cm){
        if(this.ds){
            this.ds.un("load", this.onLoad, this);
            this.ds.un("datachanged", this.onDataChange, this);
            this.ds.un("add", this.onAdd, this);
            this.ds.un("remove", this.onRemove, this);
            this.ds.un("update", this.onUpdate, this);
            this.ds.un("clear", this.onClear, this);
        }
        if(ds){
            ds.on("load", this.onLoad, this);
            ds.on("datachanged", this.onDataChange, this);
            ds.on("add", this.onAdd, this);
            ds.on("remove", this.onRemove, this);
            ds.on("update", this.onUpdate, this);
            ds.on("clear", this.onClear, this);
        }
        this.ds = ds;

        if(this.cm){
            this.cm.un("widthchange", this.onColWidthChange, this);
            this.cm.un("headerchange", this.onHeaderChange, this);
            this.cm.un("hiddenchange", this.onHiddenChange, this);
            this.cm.un("columnmoved", this.onColumnMove, this);
            this.cm.un("columnlockchange", this.onColumnLock, this);
        }
        if(cm){
            this.generateRules(cm);
            cm.on("widthchange", this.onColWidthChange, this);
            cm.on("headerchange", this.onHeaderChange, this);
            cm.on("hiddenchange", this.onHiddenChange, this);
            cm.on("columnmoved", this.onColumnMove, this);
            cm.on("columnlockchange", this.onColumnLock, this);
        }
        this.cm = cm;
    },

    // private
    init: function(grid){
		Ext.grid.GridView.superclass.init.call(this, grid);

		this.bind(grid.dataSource, grid.colModel);

	    grid.on("headerclick", this.handleHeaderClick, this);

        if(grid.trackMouseOver){
            grid.on("mouseover", this.onRowOver, this);
	        grid.on("mouseout", this.onRowOut, this);
	    }
	    grid.cancelTextSelection = function(){};
		this.gridId = grid.id;

		var tpls = this.templates || {};

		if(!tpls.master){
		    tpls.master = new Ext.Template(
		       '<div class="x-grid" hidefocus="true">',
		          '<div class="x-grid-topbar"></div>',
		          '<div class="x-grid-scroller"><div></div></div>',
		          '<div class="x-grid-locked">',
		              '<div class="x-grid-header">{lockedHeader}</div>',
		              '<div class="x-grid-body">{lockedBody}</div>',
		          "</div>",
		          '<div class="x-grid-viewport">',
		              '<div class="x-grid-header">{header}</div>',
		              '<div class="x-grid-body">{body}</div>',
		          "</div>",
		          '<div class="x-grid-bottombar"></div>',
		          '<a href="#" class="x-grid-focus" tabIndex="-1"></a>',
		          '<div class="x-grid-resize-proxy">&#160;</div>',
		       "</div>"
		    );
		    tpls.master.disableformats = true;
		}

		if(!tpls.header){
		    tpls.header = new Ext.Template(
		       '<table border="0" cellspacing="0" cellpadding="0">',
		       '<tbody><tr class="x-grid-hd-row">{cells}</tr></tbody>',
		       "</table>{splits}"
		    );
		    tpls.header.disableformats = true;
		}
		tpls.header.compile();

		if(!tpls.hcell){
		    tpls.hcell = new Ext.Template(
		        '<td class="x-grid-hd x-grid-td-{id} {cellId}"><div title="{title}" class="x-grid-hd-inner x-grid-hd-{id}">',
		        '<div class="x-grid-hd-text" unselectable="on">{value}<img class="x-grid-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" /></div>',
		        "</div></td>"
		     );
		     tpls.hcell.disableFormats = true;
		}
		tpls.hcell.compile();

		if(!tpls.hsplit){
		    tpls.hsplit = new Ext.Template('<div class="x-grid-split {splitId} x-grid-split-{id}" style="{style}" unselectable="on">&#160;</div>');
		    tpls.hsplit.disableFormats = true;
		}
		tpls.hsplit.compile();

		if(!tpls.body){
		    tpls.body = new Ext.Template(
		       '<table border="0" cellspacing="0" cellpadding="0">',
		       "<tbody>{rows}</tbody>",
		       "</table>"
		    );
		    tpls.body.disableFormats = true;
		}
		tpls.body.compile();

		if(!tpls.row){
		    tpls.row = new Ext.Template('<tr class="x-grid-row {alt}">{cells}</tr>');
		    tpls.row.disableFormats = true;
		}
		tpls.row.compile();

		if(!tpls.cell){
		    tpls.cell = new Ext.Template(
		        '<td class="x-grid-col x-grid-td-{id} {cellId} {css}" tabIndex="0">',
		        '<div class="x-grid-col-{id} x-grid-cell-inner"><div class="x-grid-cell-text" unselectable="on" {attr}>{value}</div></div>',
		        "</td>"
		    );
            tpls.cell.disableFormats = true;
        }
		tpls.cell.compile();

		this.templates = tpls;
	},

	// remap these for backwards compat
    onColWidthChange : function(){
        this.updateColumns.apply(this, arguments);
    },
    onHeaderChange : function(){
        this.updateHeaders.apply(this, arguments);
    }, 
    onHiddenChange : function(){
        this.handleHiddenChange.apply(this, arguments);
    },
    onColumnMove : function(){
        this.handleColumnMove.apply(this, arguments);
    },
    onColumnLock : function(){
        this.handleLockChange.apply(this, arguments);
    },

    // private
    onDataChange : function(){
        this.refresh();
        this.updateHeaderSortState();
    },

    // private
    onClear : function(){
        this.refresh();
    },

    // private
    onUpdate : function(ds, record){
        this.refreshRow(record);
    },

    // private
    refreshRow : function(record){
        var ds = this.ds, index;
        if(typeof record == 'number'){
            index = record;
            record = ds.getAt(index);
        }else{
            index = ds.indexOf(record);
        }
        this.insertRows(ds, index, index, true);
        this.onRemove(ds, record, index+1, true);
        this.syncRowHeights(index, index);
        this.layout();
        this.fireEvent("rowupdated", this, index, record);
    },

    // private
    onAdd : function(ds, records, index){
        this.insertRows(ds, index, index + (records.length-1));
    },

    // private
    onRemove : function(ds, record, index, isUpdate){
        if(isUpdate !== true){
            this.fireEvent("beforerowremoved", this, index, record);
        }
        var bt = this.getBodyTable(), lt = this.getLockedTable();
        if(bt.rows[index]){
            bt.firstChild.removeChild(bt.rows[index]);
        }
        if(lt.rows[index]){
            lt.firstChild.removeChild(lt.rows[index]);
        }
        if(isUpdate !== true){
            this.stripeRows(index);
            this.syncRowHeights(index, index);
            this.layout();
            this.fireEvent("rowremoved", this, index, record);
        }
    },

    // private
    onLoad : function(){
        this.scrollToTop();
    },

    /**
     * Scrolls the grid to the top
     */
    scrollToTop : function(){
        if(this.scroller){
            this.scroller.dom.scrollTop = 0;
            this.syncScroll();
        }
    },

    /**
     * Gets a panel in the header of the grid that can be used for toolbars etc.
     * After modifying the contents of this panel a call to grid.autoSize() may be
     * required to register any changes in size.
     * @param {Boolean} doShow By default the header is hidden. Pass true to show the panel
     * @return Ext.Element
     */
    getHeaderPanel : function(doShow){
        if(doShow){
            this.headerPanel.show();
        }
        return this.headerPanel;
	},

	/**
     * Gets a panel in the footer of the grid that can be used for toolbars etc.
     * After modifying the contents of this panel a call to grid.autoSize() may be
     * required to register any changes in size.
     * @param {Boolean} doShow By default the footer is hidden. Pass true to show the panel
     * @return Ext.Element
     */
    getFooterPanel : function(doShow){
        if(doShow){
            this.footerPanel.show();
        }
        return this.footerPanel;
	},

    // private
    initElements : function(){
	    var E = Ext.Element;
	    var el = this.grid.getGridEl().dom.firstChild;
	    var cs = el.childNodes;

	    this.el = new E(el);
	    this.headerPanel = new E(el.firstChild);
	    this.headerPanel.enableDisplayMode("block");

        this.scroller = new E(cs[1]);
	    this.scrollSizer = new E(this.scroller.dom.firstChild);

	    this.lockedWrap = new E(cs[2]);
	    this.lockedHd = new E(this.lockedWrap.dom.firstChild);
	    this.lockedBody = new E(this.lockedWrap.dom.childNodes[1]);

	    this.mainWrap = new E(cs[3]);
	    this.mainHd = new E(this.mainWrap.dom.firstChild);
	    this.mainBody = new E(this.mainWrap.dom.childNodes[1]);

	    this.footerPanel = new E(cs[4]);
	    this.footerPanel.enableDisplayMode("block");

        this.focusEl = new E(cs[5]);
        this.focusEl.swallowEvent("click", true);
        this.resizeProxy = new E(cs[6]);

	    this.headerSelector = String.format(
	       '#{0} td.x-grid-hd, #{1} td.x-grid-hd',
	       this.lockedHd.id, this.mainHd.id
	    );

	    this.splitterSelector = String.format(
	       '#{0} div.x-grid-split, #{1} div.x-grid-split',
	       this.lockedHd.id, this.mainHd.id
	    );
    },

/**
 * Returns the &lt;TD> HtmlElement which represents the Grid's header for the specified column index.
 * @param {Number} index The column index
 * @return {HtmlElement} The &lt;TD> element.
 */
	getHeaderCell : function(index){
	    return Ext.DomQuery.select(this.headerSelector)[index];
	},

    // private
    getHeaderCellMeasure : function(index){
	    return this.getHeaderCell(index).firstChild;
	},

    // private
    getHeaderCellText : function(index){
	    return this.getHeaderCell(index).firstChild.firstChild;
	},

    // private
    getLockedTable : function(){
	    return this.lockedBody.dom.firstChild;
	},

    // private
    getBodyTable : function(){
	    return this.mainBody.dom.firstChild;
	},

    // private
    getLockedRow : function(index){
	    return this.getLockedTable().rows[index];
	},

/**
 * Returns the &lt;TR> HtmlElement which represents a Grid row for the specified index.
 * @param {Number} index The row index
 * @return {HtmlElement} The &lt;TR> element.
 */
	getRow : function(index){
	    return this.getBodyTable().rows[index];
	},

    // private
    getRowComposite : function(index){
	    if(!this.rowEl){
	        this.rowEl = new Ext.CompositeElementLite();
	    }
        var els = [], lrow, mrow;
        if(lrow = this.getLockedRow(index)){
            els.push(lrow);
        }
        if(mrow = this.getRow(index)){
            els.push(mrow);
        }
        this.rowEl.elements = els;
	    return this.rowEl;
	},

/**
 * Returns the grid's &lt;TD> HtmlElement at the specified coordinates.
 * @param {Number} rowIndex The row index in which to find the cell.
 * @param {Number} colIndex The column index of the cell.
 * @return {HtmlElement} The &lt;TD> at the specified coordinates.
 */
	getCell : function(rowIndex, colIndex){
	    var locked = this.cm.getLockedCount();
	    var source;
	    if(colIndex < locked){
	        source = this.lockedBody.dom.firstChild;
	    }else{
	        source = this.mainBody.dom.firstChild;
	        colIndex -= locked;
	    }
        return source.rows[rowIndex].childNodes[colIndex];
	},

    // private
    getCellText : function(rowIndex, colIndex){
	    return this.getCell(rowIndex, colIndex).firstChild.firstChild;
	},

    // private
    getCellBox : function(cell){
	    var b = this.fly(cell).getBox();
        if(Ext.isOpera){ // opera fails to report the Y
            b.y = cell.offsetTop + this.mainBody.getY();
        }
        return b;
    },

    // private
    getCellIndex : function(cell){
        var id = String(cell.className).match(this.cellRE);
        if(id){
            return parseInt(id[1], 10);
        }
        return 0;
    },

    // private
    findHeaderIndex : function(n){
        var r = Ext.fly(n).findParent("td." + this.hdClass, 6);
        return r ? this.getCellIndex(r) : false;
    },

    // private
    findHeaderCell : function(n){
        var r = Ext.fly(n).findParent("td." + this.hdClass, 6);
        return r ? r : false;
    },

    // private
    findRowIndex : function(n){
        if(!n){
            return false;
        }
        var r = Ext.fly(n).findParent("tr." + this.rowClass, 6);
        return r ? r.rowIndex : false;
    },

    // private
    findCellIndex : function(node){
        var stop = this.el.dom;
        while(node && node != stop){
            if(this.findRE.test(node.className)){
                return this.getCellIndex(node);
            }
            node = node.parentNode;
        }
        return false;
    },

    // private
    getColumnId : function(index){
	    return this.cm.getColumnId(index);
	},

    // private
    getSplitters : function(){
	    if(this.splitterSelector){
	       return Ext.DomQuery.select(this.splitterSelector);
	    }else{
	        return null;
	    }
	},

    // private
    getSplitter : function(index){
	    return this.getSplitters()[index];
	},

    // private
    onRowOver : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false){
            this.getRowComposite(row).addClass("x-grid-row-over");
        }
    },

    // private
    onRowOut : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false && row !== this.findRowIndex(e.getRelatedTarget())){
            this.getRowComposite(row).removeClass("x-grid-row-over");
        }
    },

    // private
    renderHeaders : function(){
	    var cm = this.cm;
        var ct = this.templates.hcell, ht = this.templates.header, st = this.templates.hsplit;
        var cb = [], lb = [], sb = [], lsb = [], p = {};
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            p.cellId = "x-grid-hd-0-" + i;
            p.splitId = "x-grid-csplit-0-" + i;
            p.id = cm.getColumnId(i);
            p.title = cm.getColumnTooltip(i) || "";
            p.value = cm.getColumnHeader(i) || "";
            p.style = (this.grid.enableColumnResize === false || !cm.isResizable(i) || cm.isFixed(i)) ? 'cursor:default' : '';
            if(!cm.isLocked(i)){
                cb[cb.length] = ct.apply(p);
                sb[sb.length] = st.apply(p);
            }else{
                lb[lb.length] = ct.apply(p);
                lsb[lsb.length] = st.apply(p);
            }
        }
        return [ht.apply({cells: lb.join(""), splits:lsb.join("")}),
                ht.apply({cells: cb.join(""), splits:sb.join("")})];
	},

    // private
    updateHeaders : function(){
        var html = this.renderHeaders();
        this.lockedHd.update(html[0]);
        this.mainHd.update(html[1]);
    },

    /**
     * Focuses the specified row.
     * @param {Number} row The row index
     */
    focusRow : function(row){
        var x = this.scroller.dom.scrollLeft;
        this.focusCell(row, 0, false);
        this.scroller.dom.scrollLeft = x;
    },

    /**
     * Focuses the specified cell.
     * @param {Number} row The row index
     * @param {Number} col The column index
     * @param {Boolean} hscroll false to disable horizontal scrolling
     */
    focusCell : function(row, col, hscroll){
        var el = this.ensureVisible(row, col, hscroll);
        this.focusEl.alignTo(el, "tl-tl");
        if(Ext.isGecko){
            this.focusEl.focus();
        }else{
            this.focusEl.focus.defer(1, this.focusEl);
        }
    },

    /**
     * Scrolls the specified cell into view
     * @param {Number} row The row index
     * @param {Number} col The column index
     * @param {Boolean} hscroll false to disable horizontal scrolling
     */
    ensureVisible : function(row, col, hscroll){
        if(typeof row != "number"){
            row = row.rowIndex;
        }
        if(!this.ds) {
            return;
        }
        if(row < 0 && row >= this.ds.getCount()){
            return;
        }
        col = (col !== undefined ? col : 0);
        var cm = this.grid.colModel;
        while(cm.isHidden(col)){
            col++;
        }

        var el = this.getCell(row, col);
        if(!el){
            return;
        }
        var c = this.scroller.dom;

        var ctop = parseInt(el.offsetTop, 10);
        var cleft = parseInt(el.offsetLeft, 10);
        var cbot = ctop + el.offsetHeight;
        var cright = cleft + el.offsetWidth;

        var ch = c.clientHeight - this.mainHd.dom.offsetHeight;
        var stop = parseInt(c.scrollTop, 10);
        var sleft = parseInt(c.scrollLeft, 10);
        var sbot = stop + ch;
        var sright = sleft + c.clientWidth;

        if(ctop < stop){
        	c.scrollTop = ctop;
        }else if(cbot > sbot){
            c.scrollTop = cbot-ch;
        }

        if(hscroll !== false){
            if(cleft < sleft){
                c.scrollLeft = cleft;
            }else if(cright > sright){
                c.scrollLeft = cright-c.clientWidth;
            }
        }
        return el;
    },

    // private
    updateColumns : function(){
        this.grid.stopEditing();
        var cm = this.grid.colModel, colIds = this.getColumnIds();
        //var totalWidth = cm.getTotalWidth();
        var pos = 0;
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            //if(cm.isHidden(i)) continue;
            var w = cm.getColumnWidth(i);
            this.css.updateRule(this.colSelector+colIds[i], "width", (w - this.borderWidth) + "px");
            this.css.updateRule(this.hdSelector+colIds[i], "width", (w - this.borderWidth) + "px");
        }
        this.updateSplitters();
    },

    // private
    generateRules : function(cm){
        var ruleBuf = [], rulesId = this.grid.id + '-cssrules';
        Ext.util.CSS.removeStyleSheet(rulesId);
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            var cid = cm.getColumnId(i);
            var align = '';
            if(cm.config[i].align){
                align = 'text-align:'+cm.config[i].align+';';
            }
            var hidden = '';
            if(cm.isHidden(i)){
                hidden = 'display:none;';
            }
            var width = "width:" + (cm.getColumnWidth(i) - this.borderWidth) + "px;";
            ruleBuf.push(
                    this.colSelector, cid, " {\n", cm.config[i].css, align, width, "\n}\n",
                    this.hdSelector, cid, " {\n", align, width, "}\n",
                    this.tdSelector, cid, " {\n",hidden,"\n}\n",
                    this.splitSelector, cid, " {\n", hidden , "\n}\n");
        }
        return Ext.util.CSS.createStyleSheet(ruleBuf.join(""), rulesId);
    },

    // private
    updateSplitters : function(){
        var cm = this.cm, s = this.getSplitters();
        if(s){ // splitters not created yet
            var pos = 0, locked = true;
            for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                if(cm.isHidden(i)) continue;
                var w = cm.getColumnWidth(i);
                if(!cm.isLocked(i) && locked){
                    pos = 0;
                    locked = false;
                }
                pos += w;
                s[i].style.left = (pos-this.splitOffset) + "px";
            }
        }
    },

    // private
    handleHiddenChange : function(colModel, colIndex, hidden){
        if(hidden){
            this.hideColumn(colIndex);
        }else{
            this.unhideColumn(colIndex);
        }
    },

    // private
    hideColumn : function(colIndex){
        var cid = this.getColumnId(colIndex);
        this.css.updateRule(this.tdSelector+cid, "display", "none");
        this.css.updateRule(this.splitSelector+cid, "display", "none");
        if(Ext.isSafari){
            this.updateHeaders();
        }
        this.updateSplitters();
        this.layout();
    },

    // private
    unhideColumn : function(colIndex){
        var cid = this.getColumnId(colIndex);
        this.css.updateRule(this.tdSelector+cid, "display", "");
        this.css.updateRule(this.splitSelector+cid, "display", "");

        if(Ext.isSafari){
            this.updateHeaders();
        }
        this.updateSplitters();
        this.layout();
    },

    // private
    insertRows : function(dm, firstRow, lastRow, isUpdate){
        if(firstRow == 0 && lastRow == dm.getCount()-1){
            this.refresh();
        }else{
            if(!isUpdate){
                this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
            }
            var s = this.getScrollState();
            var markup = this.renderRows(firstRow, lastRow);
            this.bufferRows(markup[0], this.getLockedTable(), firstRow);
            this.bufferRows(markup[1], this.getBodyTable(), firstRow);
            this.restoreScroll(s);
            if(!isUpdate){
                this.fireEvent("rowsinserted", this, firstRow, lastRow);
                this.syncRowHeights(firstRow, lastRow);
                this.stripeRows(firstRow);
                this.layout();
            }
        }
    },

    // private
    bufferRows : function(markup, target, index){
        var before = null, trows = target.rows, tbody = target.tBodies[0];
        if(index < trows.length){
            before = trows[index];
        }
        var b = document.createElement("div");
        b.innerHTML = "<table><tbody>"+markup+"</tbody></table>";
        var rows = b.firstChild.rows;
        for(var i = 0, len = rows.length; i < len; i++){
            if(before){
                tbody.insertBefore(rows[0], before);
            }else{
                tbody.appendChild(rows[0]);
            }
        }
        b.innerHTML = "";
        b = null;
    },

    // private
    deleteRows : function(dm, firstRow, lastRow){
        if(dm.getRowCount()<1){
            this.fireEvent("beforerefresh", this);
            this.mainBody.update("");
            this.lockedBody.update("");
            this.fireEvent("refresh", this);
        }else{
            this.fireEvent("beforerowsdeleted", this, firstRow, lastRow);
            var bt = this.getBodyTable();
            var tbody = bt.firstChild;
            var rows = bt.rows;
            for(var rowIndex = firstRow; rowIndex <= lastRow; rowIndex++){
                tbody.removeChild(rows[firstRow]);
            }
            this.stripeRows(firstRow);
            this.fireEvent("rowsdeleted", this, firstRow, lastRow);
        }
    },

    // private
    updateRows : function(dataSource, firstRow, lastRow){
        var s = this.getScrollState();
        this.refresh();
        this.restoreScroll(s);
    },

    // private
    handleSort : function(dataSource, sortColumnIndex, sortDir, noRefresh){
        if(!noRefresh){
           this.refresh();
        }
        this.updateHeaderSortState();
    },

    // private
    getScrollState : function(){
        var sb = this.scroller.dom;
        return {left: sb.scrollLeft, top: sb.scrollTop};
    },

    // private
    stripeRows : function(startRow){
        if(!this.grid.stripeRows || this.ds.getCount() < 1){
            return;
        }
        startRow = startRow || 0;
        var rows = this.getBodyTable().rows;
        var lrows = this.getLockedTable().rows;
        var cls = ' x-grid-row-alt ';
        for(var i = startRow, len = rows.length; i < len; i++){
            var row = rows[i], lrow = lrows[i];
            var isAlt = ((i+1) % 2 == 0);
            var hasAlt = (' '+row.className + ' ').indexOf(cls) != -1;
            if(isAlt == hasAlt){
                continue;
            }
            if(isAlt){
                row.className += " x-grid-row-alt";
            }else{
                row.className = row.className.replace("x-grid-row-alt", "");
            }
            if(lrow){
                lrow.className = row.className;
            }
        }
    },

    // private
    restoreScroll : function(state){
        var sb = this.scroller.dom;
        sb.scrollLeft = state.left;
        sb.scrollTop = state.top;
        this.syncScroll();
    },

    // private
    syncScroll : function(){
        var sb = this.scroller.dom;
        var sh = this.mainHd.dom;
        var bs = this.mainBody.dom;
        var lv = this.lockedBody.dom;
        sh.scrollLeft = bs.scrollLeft = sb.scrollLeft;
        lv.scrollTop = bs.scrollTop = sb.scrollTop;
    },

    // private
    handleScroll : function(e){
        this.syncScroll();
        var sb = this.scroller.dom;
        this.grid.fireEvent("bodyscroll", sb.scrollLeft, sb.scrollTop);
        e.stopEvent();
    },

    // private
    handleWheel : function(e){
        var d = e.getWheelDelta();
        this.scroller.dom.scrollTop -= d*22;
        // set this here to prevent jumpy scrolling on large tables
        this.lockedBody.dom.scrollTop = this.mainBody.dom.scrollTop = this.scroller.dom.scrollTop;
        e.stopEvent();
    },

    // private
    renderRows : function(startRow, endRow){
        // pull in all the crap needed to render rows
        var g = this.grid, cm = g.colModel, ds = g.dataSource, stripe = g.stripeRows;
        var colCount = cm.getColumnCount();

        if(ds.getCount() < 1){
            return ["", ""];
        }

        // build a map for all the columns
        var cs = [];
        for(var i = 0; i < colCount; i++){
            var name = cm.getDataIndex(i);
            cs[i] = {
                name : typeof name == 'undefined' ? ds.fields.get(i).name : name,
                renderer : cm.getRenderer(i),
                id : cm.getColumnId(i),
                locked : cm.isLocked(i)
            };
        }

        startRow = startRow || 0;
        endRow = typeof endRow == "undefined"? ds.getCount()-1 : endRow;

        // records to render
        var rs = ds.getRange(startRow, endRow);

        return this.doRender(cs, rs, ds, startRow, colCount, stripe);
    },

    // private
    // As much as I hate to duplicate code, this was branched because FireFox really hates
    // [].join("") on strings. The performance difference was substantial enough to
    // branch this function
    doRender : Ext.isGecko ?
            function(cs, rs, ds, startRow, colCount, stripe){
                var ts = this.templates, ct = ts.cell, rt = ts.row;
                // buffers
                var buf = "", lbuf = "", cb, lcb, c, p = {}, rp = {}, r, rowIndex;
                for(var j = 0, len = rs.length; j < len; j++){
                    r = rs[j]; cb = ""; lcb = ""; rowIndex = (j+startRow);
                    for(var i = 0; i < colCount; i++){
                        c = cs[i];
                        p.cellId = "x-grid-cell-" + rowIndex + "-" + i;
                        p.id = c.id;
                        p.css = p.attr = "";
                        p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                        if(p.value == undefined || p.value === "") p.value = "&#160;";
                        if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                            p.css += p.css ? ' x-grid-dirty-cell' : 'x-grid-dirty-cell';
                        }
                        var markup = ct.apply(p);
                        if(!c.locked){
                            cb+= markup;
                        }else{
                            lcb+= markup;
                        }
                    }
                    var alt = [];
                    if(stripe && ((rowIndex+1) % 2 == 0)){
                        alt[0] = "x-grid-row-alt";
                    }
                    if(r.dirty){
                        alt[1] = " x-grid-dirty-row";
                    }
                    rp.cells = lcb;
                    if(this.getRowClass){
                        alt[2] = this.getRowClass(r, rowIndex);
                    }
                    rp.alt = alt.join(" ");
                    lbuf+= rt.apply(rp);
                    rp.cells = cb;
                    buf+=  rt.apply(rp);
                }
                return [lbuf, buf];
            } :
            function(cs, rs, ds, startRow, colCount, stripe){
                var ts = this.templates, ct = ts.cell, rt = ts.row;
                // buffers
                var buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r, rowIndex;
                for(var j = 0, len = rs.length; j < len; j++){
                    r = rs[j]; cb = []; lcb = []; rowIndex = (j+startRow);
                    for(var i = 0; i < colCount; i++){
                        c = cs[i];
                        p.cellId = "x-grid-cell-" + rowIndex + "-" + i;
                        p.id = c.id;
                        p.css = p.attr = "";
                        p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                        if(p.value == undefined || p.value === "") p.value = "&#160;";
                        if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                            p.css += p.css ? ' x-grid-dirty-cell' : 'x-grid-dirty-cell';
                        }
                        var markup = ct.apply(p);
                        if(!c.locked){
                            cb[cb.length] = markup;
                        }else{
                            lcb[lcb.length] = markup;
                        }
                    }
                    var alt = [];
                    if(stripe && ((rowIndex+1) % 2 == 0)){
                        alt[0] = "x-grid-row-alt";
                    }
                    if(r.dirty){
                        alt[1] = " x-grid-dirty-row";
                    }
                    rp.cells = lcb;
                    if(this.getRowClass){
                        alt[2] = this.getRowClass(r, rowIndex);
                    }
                    rp.alt = alt.join(" ");
                    rp.cells = lcb.join("");
                    lbuf[lbuf.length] = rt.apply(rp);
                    rp.cells = cb.join("");
                    buf[buf.length] =  rt.apply(rp);
                }
                return [lbuf.join(""), buf.join("")];
            },

    // private
    renderBody : function(){
        var markup = this.renderRows();
        var bt = this.templates.body;
        return [bt.apply({rows: markup[0]}), bt.apply({rows: markup[1]})];
    },

    /**
     * Refreshes the grid
     * @param {Boolean} headersToo
     */
    refresh : function(headersToo){
        this.fireEvent("beforerefresh", this);
        this.grid.stopEditing();
        var result = this.renderBody();
        this.lockedBody.update(result[0]);
        this.mainBody.update(result[1]);
        if(headersToo === true){
            this.updateHeaders();
            this.updateColumns();
            this.updateSplitters();
            this.updateHeaderSortState();
        }
        this.syncRowHeights();
        this.layout();
        this.fireEvent("refresh", this);
    },

    // private
    handleColumnMove : function(cm, oldIndex, newIndex){
        this.indexMap = null;
        var s = this.getScrollState();
        this.refresh(true);
        this.restoreScroll(s);
        this.afterMove(newIndex);
    },

    // private
    afterMove : function(colIndex){
        if(this.enableMoveAnim && Ext.enableFx){
            this.fly(this.getHeaderCell(colIndex).firstChild).highlight(this.hlColor);
        }
    },

    // private
    updateCell : function(dm, rowIndex, dataIndex){
        var colIndex = this.getColumnIndexByDataIndex(dataIndex);
        if(typeof colIndex == "undefined"){ // not present in grid
            return;
        }
        var cm = this.grid.colModel;
        var cell = this.getCell(rowIndex, colIndex);
        var cellText = this.getCellText(rowIndex, colIndex);

        var p = {
            cellId : "x-grid-cell-" + rowIndex + "-" + colIndex,
            id : cm.getColumnId(colIndex),
            css: colIndex == cm.getColumnCount()-1 ? "x-grid-col-last" : ""
        };
        var renderer = cm.getRenderer(colIndex);
        var val = renderer(dm.getValueAt(rowIndex, dataIndex), p, rowIndex, colIndex, dm);
        if(typeof val == "undefined" || val === "") val = "&#160;";
        cellText.innerHTML = val;
        cell.className = this.cellClass + " " + p.cellId + " " + p.css;
        this.syncRowHeights(rowIndex, rowIndex);
    },

    // private
    calcColumnWidth : function(colIndex, maxRowsToMeasure){
        var maxWidth = 0;
        if(this.grid.autoSizeHeaders){
            var h = this.getHeaderCellMeasure(colIndex);
            maxWidth = Math.max(maxWidth, h.scrollWidth);
        }
        var tb, index;
        if(this.cm.isLocked(colIndex)){
            tb = this.getLockedTable();
            index = colIndex;
        }else{
            tb = this.getBodyTable();
            index = colIndex - this.cm.getLockedCount();
        }
        if(tb && tb.rows){
            var rows = tb.rows;
            var stopIndex = Math.min(maxRowsToMeasure || rows.length, rows.length);
            for(var i = 0; i < stopIndex; i++){
                var cell = rows[i].childNodes[index].firstChild;
                maxWidth = Math.max(maxWidth, cell.scrollWidth);
            }
        }
        return maxWidth + /*margin for error in IE*/ 5;
    },

    /**
     * Autofit a column to its content.
     * @param {Number} colIndex
     * @param {Boolean} forceMinSize true to force the column to go smaller if possible
     */
     autoSizeColumn : function(colIndex, forceMinSize, suppressEvent){
         if(this.cm.isHidden(colIndex)){
             return; // can't calc a hidden column
         }
        if(forceMinSize){
            var cid = this.cm.getColumnId(colIndex);
            this.css.updateRule(this.colSelector + cid, "width", this.grid.minColumnWidth + "px");
           if(this.grid.autoSizeHeaders){
               this.css.updateRule(this.hdSelector + cid, "width", this.grid.minColumnWidth + "px");
           }
        }
        var newWidth = this.calcColumnWidth(colIndex);
        this.cm.setColumnWidth(colIndex,
            Math.max(this.grid.minColumnWidth, newWidth), suppressEvent);
        if(!suppressEvent){
            this.grid.fireEvent("columnresize", colIndex, newWidth);
        }
    },

    /**
     * Autofits all columns to their content and then expands to fit any extra space in the grid
     */
     autoSizeColumns : function(){
        var cm = this.grid.colModel;
        var colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            this.autoSizeColumn(i, true, true);
        }
        if(cm.getTotalWidth() < this.scroller.dom.clientWidth){
            this.fitColumns();
        }else{
            this.updateColumns();
            this.layout();
        }
    },

    /**
     * Autofits all columns to the grid's width proportionate with their current size
     * @param {Boolean} reserveScrollSpace Reserve space for a scrollbar
     */
    fitColumns : function(reserveScrollSpace){
        var cm = this.grid.colModel;
        var colCount = cm.getColumnCount();
        var cols = [];
        var width = 0;
        var i, w;
        for (i = 0; i < colCount; i++){
            if(!cm.isHidden(i) && !cm.isFixed(i)){
                w = cm.getColumnWidth(i);
                cols.push(i);
                cols.push(w);
                width += w;
            }
        }
        var avail = Math.min(this.scroller.dom.clientWidth, this.el.getWidth());
        if(reserveScrollSpace){
            avail -= 17;
        }
        var frac = (avail - cm.getTotalWidth())/width;
        while (cols.length){
            w = cols.pop();
            i = cols.pop();
            cm.setColumnWidth(i, Math.floor(w + w*frac), true);
        }
        this.updateColumns();
        this.layout();
    },

    // private
    onRowSelect : function(rowIndex){
        var row = this.getRowComposite(rowIndex);
        row.addClass("x-grid-row-selected");
    },

    // private
    onRowDeselect : function(rowIndex){
        var row = this.getRowComposite(rowIndex);
        row.removeClass("x-grid-row-selected");
    },

    // private
    onCellSelect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            Ext.fly(cell).addClass("x-grid-cell-selected");
        }
    },

    // private
    onCellDeselect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            Ext.fly(cell).removeClass("x-grid-cell-selected");
        }
    },

    // private
    updateHeaderSortState : function(){
        var state = this.ds.getSortState();
        if(!state){
            return;
        }
        this.sortState = state;
        var sortColumn = this.cm.findColumnIndex(state.field);
        if(sortColumn != -1){
            var sortDir = state.direction;
            var sc = this.sortClasses;
            var hds = this.el.select(this.headerSelector).removeClass(sc);
            hds.item(sortColumn).addClass(sc[sortDir == "DESC" ? 1 : 0]);
        }
    },

    // private
    handleHeaderClick : function(g, index){
        if(this.headersDisabled){
            return;
        }
        var dm = g.dataSource, cm = g.colModel;
	    if(!cm.isSortable(index)){
            return;
        }
	    g.stopEditing();
        dm.sort(cm.getDataIndex(index));
    },

    // private
    destroy : function(){
        if(this.colMenu){
            this.colMenu.removeAll();
            Ext.menu.MenuMgr.unregister(this.colMenu);
            this.colMenu.getEl().remove();
            delete this.colMenu;
        }
        if(this.hmenu){
            this.hmenu.removeAll();
            Ext.menu.MenuMgr.unregister(this.hmenu);
            this.hmenu.getEl().remove();
            delete this.hmenu;
        }
        if(this.grid.enableColumnMove){
            var dds = Ext.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
            if(dds){
                for(var dd in dds){
                    if(!dds[dd].config.isTarget && dds[dd].dragElId){
                        var elid = dds[dd].dragElId;
                        dds[dd].unreg();
                        Ext.get(elid).remove();
                    } else if(dds[dd].config.isTarget){
                        dds[dd].proxyTop.remove();
                        dds[dd].proxyBottom.remove();
                        dds[dd].unreg();
                    }
                    if(Ext.dd.DDM.locationCache[dd]){
                        delete Ext.dd.DDM.locationCache[dd];
                    }
                }
                delete Ext.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
            }
        }
        Ext.util.CSS.removeStyleSheet(this.grid.id + '-cssrules');
        this.bind(null, null);
        Ext.EventManager.removeResizeListener(this.onWindowResize, this);
    },

    // private
    handleLockChange : function(){
        this.refresh(true);
    },

    // template method
    onDenyColumnLock : function(){

    },

    // template method
    onDenyColumnHide : function(){

    },

    // private
    handleHdMenuClick : function(item){
        var index = this.hdCtxIndex;
        var cm = this.cm, ds = this.ds;
        switch(item.id){
            case "asc":
                ds.sort(cm.getDataIndex(index), "ASC");
                break;
            case "desc":
                ds.sort(cm.getDataIndex(index), "DESC");
                break;
            case "lock":
                var lc = cm.getLockedCount();
                if(cm.getColumnCount(true) <= lc+1){
                    this.onDenyColumnLock();
                    return;
                }
                if(lc != index){
                    cm.setLocked(index, true, true);
                    cm.moveColumn(index, lc);
                    this.grid.fireEvent("columnmove", index, lc);
                }else{
                    cm.setLocked(index, true);
                }
            break;
            case "unlock":
                var lc = cm.getLockedCount();
                if((lc-1) != index){
                    cm.setLocked(index, false, true);
                    cm.moveColumn(index, lc-1);
                    this.grid.fireEvent("columnmove", index, lc-1);
                }else{
                    cm.setLocked(index, false);
                }
            break;
            default:
                index = cm.getIndexById(item.id.substr(4));
                if(index != -1){
                    if(item.checked && cm.getColumnCount(true) <= 1){
                        this.onDenyColumnHide();
                        return false;
                    }
                    cm.setHidden(index, item.checked);
                }
        }
        return true;
    },

    // private
    beforeColMenuShow : function(){
        var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            this.colMenu.add(new Ext.menu.CheckItem({
                id: "col-"+cm.getColumnId(i),
                text: cm.getColumnHeader(i),
                checked: !cm.isHidden(i),
                hideOnClick:false
            }));
        }
    },

    // private
    handleHdCtx : function(g, index, e){
        e.stopEvent();
        var hd = this.getHeaderCell(index);
        this.hdCtxIndex = index;
        var ms = this.hmenu.items, cm = this.cm;
        ms.get("asc").setDisabled(!cm.isSortable(index));
        ms.get("desc").setDisabled(!cm.isSortable(index));
        if(this.grid.enableColLock !== false){
            ms.get("lock").setDisabled(cm.isLocked(index));
            ms.get("unlock").setDisabled(!cm.isLocked(index));
        }
        this.hmenu.show(hd, "tl-bl");
    },

    // private
    handleHdOver : function(e){
        var hd = this.findHeaderCell(e.getTarget());
        if(hd && !this.headersDisabled){
            if(this.grid.colModel.isSortable(this.getCellIndex(hd))){
               this.fly(hd).addClass("x-grid-hd-over");
            }
        }
    },

    // private
    handleHdOut : function(e){
        var hd = this.findHeaderCell(e.getTarget());
        if(hd){
            this.fly(hd).removeClass("x-grid-hd-over");
        }
    },

    // private
    handleSplitDblClick : function(e, t){
        var i = this.getCellIndex(t);
        if(this.grid.enableColumnResize !== false && this.cm.isResizable(i) && !this.cm.isFixed(i)){
            this.autoSizeColumn(i, true);
            this.layout();
        }
    },

    // private
    render : function(){
        var cm = this.cm;
        var colCount = cm.getColumnCount();

        if(this.grid.monitorWindowResize === true){
            Ext.EventManager.onWindowResize(this.onWindowResize, this, true);
        }
        var header = this.renderHeaders();
        var body = this.templates.body.apply({rows:""});
        var html = this.templates.master.apply({
            lockedBody: body,
            body: body,
            lockedHeader: header[0],
            header: header[1]
        });

        //this.updateColumns();

        this.grid.getGridEl().dom.innerHTML = html;

        this.initElements();

        this.scroller.on("scroll", this.handleScroll, this);
        this.lockedBody.on("mousewheel", this.handleWheel, this);
        this.mainBody.on("mousewheel", this.handleWheel, this);

        this.mainHd.on("mouseover", this.handleHdOver, this);
        this.mainHd.on("mouseout", this.handleHdOut, this);
        this.mainHd.on("dblclick", this.handleSplitDblClick, this,
                {delegate: "."+this.splitClass});

        this.lockedHd.on("mouseover", this.handleHdOver, this);
        this.lockedHd.on("mouseout", this.handleHdOut, this);
        this.lockedHd.on("dblclick", this.handleSplitDblClick, this,
                {delegate: "."+this.splitClass});

        if(this.grid.enableColumnResize !== false && Ext.grid.SplitDragZone){
            new Ext.grid.SplitDragZone(this.grid, this.lockedHd.dom, this.mainHd.dom);
        }

        this.updateSplitters();

        if(this.grid.enableColumnMove && Ext.grid.HeaderDragZone){
            new Ext.grid.HeaderDragZone(this.grid, this.lockedHd.dom, this.mainHd.dom);
            new Ext.grid.HeaderDropZone(this.grid, this.lockedHd.dom, this.mainHd.dom);
        }

        if(this.grid.enableCtxMenu !== false && Ext.menu.Menu){
            this.hmenu = new Ext.menu.Menu({id: this.grid.id + "-hctx"});
            this.hmenu.add(
                {id:"asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
                {id:"desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"}
            );
            if(this.grid.enableColLock !== false){
                this.hmenu.add('-',
                    {id:"lock", text: this.lockText, cls: "xg-hmenu-lock"},
                    {id:"unlock", text: this.unlockText, cls: "xg-hmenu-unlock"}
                );
            }
            if(this.grid.enableColumnHide !== false){

                this.colMenu = new Ext.menu.Menu({id:this.grid.id + "-hcols-menu"});
                this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
                this.colMenu.on("itemclick", this.handleHdMenuClick, this);

                this.hmenu.add('-',
                    {id:"columns", text: this.columnsText, menu: this.colMenu}
                );
            }
            this.hmenu.on("itemclick", this.handleHdMenuClick, this);

            this.grid.on("headercontextmenu", this.handleHdCtx, this);
        }

        if((this.grid.enableDragDrop || this.grid.enableDrag) && Ext.grid.GridDragZone){
            this.dd = new Ext.grid.GridDragZone(this.grid, {
                ddGroup : this.grid.ddGroup || 'GridDD'
            });
        }

        /*
        for(var i = 0; i < colCount; i++){
            if(cm.isHidden(i)){
                this.hideColumn(i);
            }
            if(cm.config[i].align){
                this.css.updateRule(this.colSelector + i, "textAlign", cm.config[i].align);
                this.css.updateRule(this.hdSelector + i, "textAlign", cm.config[i].align);
            }
        }*/
        
        this.updateHeaderSortState();

        this.beforeInitialResize();
        this.layout(true);

        // two part rendering gives faster view to the user
        this.renderPhase2.defer(1, this);
    },

    // private
    renderPhase2 : function(){
        // render the rows now
        this.refresh();
        if(this.grid.autoSizeColumns){
            this.autoSizeColumns();
        }
    },

    // template method
    beforeInitialResize : function(){

    },

    // private
    onColumnSplitterMoved : function(i, w){
        this.userResized = true;
        var cm = this.grid.colModel;
        cm.setColumnWidth(i, w, true);
        var cid = cm.getColumnId(i);
        this.css.updateRule(this.colSelector + cid, "width", (w-this.borderWidth) + "px");
        this.css.updateRule(this.hdSelector + cid, "width", (w-this.borderWidth) + "px");
        this.updateSplitters();
        this.layout();
        this.grid.fireEvent("columnresize", i, w);
    },

    // private
    syncRowHeights : function(startIndex, endIndex){
        if(this.grid.enableRowHeightSync === true && this.cm.getLockedCount() > 0){
            startIndex = startIndex || 0;
            var mrows = this.getBodyTable().rows;
            var lrows = this.getLockedTable().rows;
            var len = mrows.length-1;
            endIndex = Math.min(endIndex || len, len);
            for(var i = startIndex; i <= endIndex; i++){
                var m = mrows[i], l = lrows[i];
                var h = Math.max(m.offsetHeight, l.offsetHeight);
                m.style.height = l.style.height = h + "px";
            }
        }
    },

    // private
    layout : function(initialRender, is2ndPass){
        var g = this.grid;
        var auto = g.autoHeight;
        var scrollOffset = 16;
        var c = g.getGridEl(), cm = this.cm,
                expandCol = g.autoExpandColumn,
                gv = this;
        //c.beginMeasure();

        if(!c.dom.offsetWidth){ // display:none?
            if(initialRender){
                this.lockedWrap.show();
                this.mainWrap.show();
            }
            return;
        }

        var hasLock = this.cm.isLocked(0);

        var tbh = this.headerPanel.getHeight();
        var bbh = this.footerPanel.getHeight();

        if(auto){
            var ch = this.getBodyTable().offsetHeight + tbh + bbh + this.mainHd.getHeight();
            var newHeight = ch + c.getBorderWidth("tb");
            if(g.maxHeight){
                newHeight = Math.min(g.maxHeight, newHeight);
            }
            c.setHeight(newHeight);
        }

        if(g.autoWidth){
            c.setWidth(cm.getTotalWidth()+c.getBorderWidth('lr'));
        }

        var s = this.scroller;

        var csize = c.getSize(true);

        this.el.setSize(csize.width, csize.height);

        this.headerPanel.setWidth(csize.width);
        this.footerPanel.setWidth(csize.width);

        var hdHeight = this.mainHd.getHeight();
        var vw = csize.width;
        var vh = csize.height - (tbh + bbh);

        s.setSize(vw, vh);

        var bt = this.getBodyTable();
        var ltWidth = hasLock ?
                      Math.max(this.getLockedTable().offsetWidth, this.lockedHd.dom.firstChild.offsetWidth) : 0;

        var scrollHeight = bt.offsetHeight;
        var scrollWidth = ltWidth + bt.offsetWidth;
        var vscroll = false, hscroll = false;

        this.scrollSizer.setSize(scrollWidth, scrollHeight+hdHeight);

        var lw = this.lockedWrap, mw = this.mainWrap;
        var lb = this.lockedBody, mb = this.mainBody;

        setTimeout(function(){
            var t = s.dom.offsetTop;
            var w = s.dom.clientWidth,
                h = s.dom.clientHeight;

            lw.setTop(t);
            lw.setSize(ltWidth, h);

            mw.setLeftTop(ltWidth, t);
            mw.setSize(w-ltWidth, h);

            lb.setHeight(h-hdHeight);
            mb.setHeight(h-hdHeight);

            if(is2ndPass !== true && !gv.userResized && expandCol){
                // high speed resize without full column calculation
                var ci = cm.getIndexById(expandCol);
                var tw = cm.getTotalWidth(false);
                var currentWidth = cm.getColumnWidth(ci);
                var cw = Math.min(Math.max(((w-tw)+currentWidth-2)-/*scrollbar*/(w <= s.dom.offsetWidth ? 0 : 18), g.autoExpandMin), g.autoExpandMax);
                if(currentWidth != cw){
                    cm.setColumnWidth(ci, cw, true);
                    gv.css.updateRule(gv.colSelector+expandCol, "width", (cw - gv.borderWidth) + "px");
                    gv.css.updateRule(gv.hdSelector+expandCol, "width", (cw - gv.borderWidth) + "px");
                    gv.updateSplitters();
                    gv.layout(false, true);
                }
            }

            if(initialRender){
                lw.show();
                mw.show();
            }
            //c.endMeasure();
        }, 10);
    },

    // private
    onWindowResize : function(){
        if(!this.grid.monitorWindowResize || this.grid.autoHeight){
            return;
        }
        this.layout();
    },

    // private
    appendFooter : function(parentEl){
        return null;
    },

    /**
     * The text displayed in the "Sort Ascending" menu item
     * @type String
     */
    sortAscText : "Sort Ascending",
    /**
     * The text displayed in the "Sort Descending" menu item
     * @type String
     */
    sortDescText : "Sort Descending",
    /**
     * The text displayed in the "Lock Column" menu item
     * @type String
     */
    lockText : "Lock Column",
    /**
     * The text displayed in the "Unlock Column" menu item
     * @type String
     */
    unlockText : "Unlock Column",
    /**
     * The text displayed in the "Columns" menu item
     * @type String
     */
    columnsText : "Columns"
});
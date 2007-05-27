Ext.grid.GridView = function(config){
    Ext.apply(this, config);
    Ext.grid.GridView.superclass.constructor.call(this);
};

Ext.extend(Ext.grid.GridView, Ext.grid.AbstractGridView, {

    borderWidth: 2,
    scrollOffset: 19,
    autoFill:false,
    forceFit:false,

    sortClasses : ["sort-asc", "sort-desc"],
    
    sortAscText : "Sort Ascending",
    sortDescText : "Sort Descending",
    lockText : "Lock Column",
    unlockText : "Unlock Column",
    columnsText : "Columns",


    /* -------------------------------- UI Specific ----------------------------- */

    initTemplates : function(){
        var ts = this.templates || {};
        if(!ts.master){
            ts.master = new Ext.Template(
                    '<div class="x-grid3" hidefocus="true">',
                        '<div class="x-grid3-viewport">',
                            '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{header}</div></div><div class="x-clear"></div></div>',
                            '<div class="x-grid3-body">{body}</div>',
                        "</div>",
                        '<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
                        '<div class="x-grid3-resize-proxy">&#160;</div>',
                    "</div>"
                    );
        }

        if(!ts.header){
            ts.header = new Ext.Template(
                    '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody><tr class="x-grid3-hd-row">{cells}</tr></tbody>',
                    "</table>"
                    );
        }

        if(!ts.hcell){
            ts.hcell = new Ext.Template(
                    '<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id}" style="{style}"><div {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}"><a class="x-grid3-hd-btn" href="#"></a>',
                    '{value}<img class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
                    "</div></td>"
                    );
        }

        if(!ts.body){
            ts.body = new Ext.Template('{rows}');
        }

        if(!ts.row){
            ts.row = new Ext.Template(
                    '<div class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody><tr>{cells}</tr>',
                    (this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell"><div class="x-grid3-row-body">{body}</div></td></tr></tbody>' : ''),
                    '</table></div>'
                    );
        }

        if(!ts.cell){
            ts.cell = new Ext.Template(
                    '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
                    "</td>"
                    );
        }

        for(var k in ts){
            var t = ts[k];
            if(t && typeof t.compile == 'function' && !t.compiled){
                t.disableFormats = true;
                t.compile();
            }
        }

        this.templates = ts;

        this.tdClass = 'x-grid3-cell';
        this.cellSelector = 'td.x-grid3-cell';
        this.hdCls = 'x-grid3-hd';
        this.rowSelector = 'div.x-grid3-row';
        this.colRe = new RegExp("x-grid3-td-([^\\s]+)", "");
    },

    fly : function(el){
        if(!this._flyweight){
            this._flyweight = new Ext.Element.Flyweight(document.body);
        }
        this._flyweight.dom = el;
        return this._flyweight;
    },

    initElements : function(){
        var E = Ext.Element;

        var el = this.grid.getGridEl().dom.firstChild;
	    var cs = el.childNodes;

	    this.el = new E(el);

        this.mainWrap = new E(cs[0]);
	    this.mainHd = new E(this.mainWrap.dom.firstChild);
	    this.innerHd = this.mainHd.dom.firstChild;
        this.mainBody = new E(this.mainWrap.dom.childNodes[1]);

	    this.focusEl = new E(cs[1]);
        this.focusEl.swallowEvent("click", true);

        this.resizeProxy = new E(cs[2]);
    },


    // finder methods, used with delegation

    findCell : function(el){
        if(!el){
            return false;
        }
        return this.fly(el).findParent(this.cellSelector, 3);
    },

    findCellIndex : function(el, requiredCls){
        var cell = this.findCell(el);
        if(cell && (!requiredCls || this.fly(cell).hasClass(requiredCls))){
            return this.getCellIndex(cell);
        }
        return false;
    },

    getCellIndex : function(el){
        if(el){
            var m = el.className.match(this.colRe);
            if(m && m[1]){
                return this.cm.getIndexById(m[1]);
            }
        }
        return false;
    },

    findHeaderCell : function(el){
        var cell = this.findCell(el);
        return cell && this.fly(cell).hasClass(this.hdCls) ? cell : null;
    },

    findHeaderIndex : function(el){
        return this.findCellIndex(el, this.hdCls);
    },

    findRow : function(el){
        if(!el){
            return false;
        }
        return this.fly(el).findParent(this.rowSelector, 10);
    },

    findRowIndex : function(el){
        var r = this.findRow(el);
        return r ? r.rowIndex : false;
    },

    // getter methods for fetching elements dynamically in the grid

    getRow : function(row){
        return this.mainBody.dom.childNodes[row];
    },

    getCell : function(row, col){
        return this.mainBody.dom.childNodes[row].getElementsByTagName('td')[col];
	},

    getHeaderCell : function(index){
	    return this.mainHd.dom.getElementsByTagName('td')[index];
	},


    // manipulating elements

    addRowClass : function(row, cls){
        var r = this.getRow(row);
        if(r){
            this.fly(r).addClass(cls);
        }
    },

    removeRowClass : function(row, cls){
        var r = this.getRow(row);
        if(r){
            this.fly(r).removeClass(cls);
        }
    },

    removeRow : function(row){
        var r = this.getRow(row);
        if(r){
            r.parentNode.removeChild(r);
        }
    },

    removeRows : function(firstRow, lastRow){
        var bd = this.mainBody.dom;
        for(var rowIndex = firstRow; rowIndex <= lastRow; rowIndex++){
            bd.removeChild(bd.childNodes[firstRow]);
        }
    },

    // scrolling stuff

    getScrollState : function(){
        var sb = this.mainBody.dom;
        return {left: sb.scrollLeft, top: sb.scrollTop};
    },

    restoreScroll : function(state){
        var sb = this.mainBody.dom;
        sb.scrollLeft = state.left;
        sb.scrollTop = state.top;
    },

    scrollToTop : function(){
        this.mainBody.dom.scrollTop = 0;
        this.mainBody.dom.scrollLeft = 0;
    },


    syncScroll : function(){
        var mb = this.mainBody.dom;
        this.innerHd.scrollLeft = mb.scrollLeft;
        this.grid.fireEvent("bodyscroll", mb.scrollLeft, mb.scrollTop);
    },


    updateSortIcon : function(col, dir){
        var sc = this.sortClasses;
        var hds = this.mainHd.select('td').removeClass(sc);
        hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
    },

    updateAllColumnWidths : function(){
        var tw = this.getTotalWidth();
        var clen = this.cm.getColumnCount();
        var ws = [];
        for(var i = 0; i < clen; i++){
            ws[i] = this.getColumnWidth(i);
        }

        this.innerHd.firstChild.firstChild.style.width = tw;

        for(var i = 0; i < clen; i++){
            var hd = this.getHeaderCell(i);
            hd.style.width = ws[i];
        }

        var ns = this.mainBody.dom.childNodes;
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            var row = ns[i].firstChild.rows[0];
            for(var j = 0; j < clen; j++){
                row.childNodes[j].style.width = ws[j];
            }
        }
    },

    updateColumnWidth : function(col, width){
        var w = this.getColumnWidth(col);
        var tw = this.getTotalWidth();

        this.innerHd.firstChild.firstChild.style.width = tw;
        var hd = this.getHeaderCell(col);
        hd.style.width = w;

        var ns = this.mainBody.dom.childNodes;
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            ns[i].firstChild.rows[0].childNodes[col].style.width = w;
        }
    },

    updateColumnHidden : function(col, hidden){
        var tw = this.getTotalWidth();

        this.innerHd.firstChild.firstChild.style.width = tw;

        var display = hidden ? 'none' : '';

        var hd = this.getHeaderCell(col);
        hd.style.display = display;

        var ns = this.mainBody.dom.childNodes;
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            ns[i].firstChild.rows[0].childNodes[col].style.display = display;
        }
        delete this.lastViewWidth; // force recalc
        this.layout();
    },

    updateColumnText : function(col, text){

    },

    afterMove : function(colIndex){
        //if(this.enableMoveAnim && Ext.enableFx){
        //    this.fly(this.getHeaderCell(colIndex).firstChild).highlight(this.hlColor);
        //}
    },

    doRender : function(cs, rs, ds, startRow, colCount, stripe){
        var ts = this.templates, ct = ts.cell, rt = ts.row;
        var tstyle = 'width:'+this.getTotalWidth()+';';
        // buffers
        var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
        for(var j = 0, len = rs.length; j < len; j++){
            r = rs[j]; cb = [];var rowIndex = (j+startRow);
            for(var i = 0; i < colCount; i++){
                c = cs[i];
                p.id = c.id;
                p.css = p.attr = p.cellAttr = "";
                p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                p.style = c.style;
                if(p.value == undefined || p.value === "") p.value = "&#160;";
                if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                    p.css += ' x-grid3-dirty-cell';
                }
                cb[cb.length] = ct.apply(p);
            }
            var alt = [];
            if(stripe && ((rowIndex+1) % 2 == 0)){
                alt[0] = "x-grid3-row-alt";
            }
            if(r.dirty){
                alt[1] = " x-grid3-dirty-row";
            }
            rp.cols = colCount;
            if(this.getRowClass){
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
            }
            rp.alt = alt.join(" ");
            rp.cells = cb.join("");
            buf[buf.length] =  rt.apply(rp);
        }
        return buf.join("");
    },

    stripeRows : function(startRow, skipStripe){
        if(this.ds.getCount() < 1){
            return;
        }
        skipStripe = skipStripe || !this.grid.stripeRows;
        startRow = startRow || 0;
        var rows = this.mainBody.dom.childNodes;
        var cls = ' x-grid3-row-alt ';
        for(var i = startRow, len = rows.length; i < len; i++){
            var row = rows[i];
            row.rowIndex = i;
            if(!skipStripe){
                var isAlt = ((i+1) % 2 == 0);
                var hasAlt = (' '+row.className + ' ').indexOf(cls) != -1;
                if(isAlt == hasAlt){
                    continue;
                }
                if(isAlt){
                    row.className += " x-grid3-row-alt";
                }else{
                    row.className = row.className.replace("x-grid3-row-alt", "");
                }
            }
        }
    },

    renderUI : function(){
        var header = this.renderHeaders();
        var body = this.templates.body.apply({rows:''});

        var html = this.templates.master.apply({
            body: body,
            header: header
        });

        this.grid.getGridEl().dom.innerHTML = html;

        this.initElements();

        // get mousedowns early
        Ext.fly(this.innerHd).on("click", this.handleHdDown, this);
        this.mainHd.on("mouseover", this.handleHdOver, this);
        this.mainHd.on("mouseout", this.handleHdOut, this);
        this.mainHd.on("mousemove", this.handleHdMove, this);

        this.mainBody.on('scroll', this.syncScroll,  this);
        if(this.grid.enableColumnResize !== false){
            new Ext.grid.GridView.SplitDragZone(this.grid, this.mainHd.dom);
        }

        if(this.grid.enableColumnMove){
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(this.grid, this.innerHd);
            this.columnDrop = new Ext.grid.HeaderDropZone(this.grid, this.mainHd.dom);
        }

        if(this.grid.enableCtxMenu !== false){
            this.colMenu = new Ext.menu.Menu({id:this.grid.id + "-hcols-menu"});
            this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
            this.colMenu.on("itemclick", this.handleHdMenuClick, this);

            this.hmenu = new Ext.menu.Menu({id: this.grid.id + "-hctx"});
            this.hmenu.add(
                {id:"asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
                {id:"desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"},
                "separator"
            );
            this.hmenu.add(
                {id:"columns", text: this.columnsText, menu: this.colMenu}
            );
            this.hmenu.on("itemclick", this.handleHdMenuClick, this);

            //this.grid.on("headercontextmenu", this.handleHdCtx, this);
        }

        if(this.grid.enableDragDrop || this.grid.enableDrag){
            var dd = new Ext.grid.GridDragZone(this.grid, {
                ddGroup : this.grid.ddGroup || 'GridDD'
            });
        }

        this.updateHeaderSortState();


    },

    layout : function(){
        var g = this.grid;
        var c = g.getGridEl(), cm = this.cm,
                expandCol = g.autoExpandColumn,
                gv = this;

        //if(g.autoWidth){
        //    c.setWidth(cm.getTotalWidth()+c.getBorderWidth('lr'));
        //}

        if(g.autoHeight){
            this.mainBody.dom.style.overflow = 'visible';
            return;
        }

        var scrollOffset = 16;

        var csize = c.getSize(true);

        if(!csize.width || !csize.height){ // display: none?
            return;
        }

        this.el.setSize(csize.width, csize.height);

        var hdHeight = this.mainHd.getHeight();
        var vw = csize.width;
        var vh = csize.height - (hdHeight);

        this.mainBody.setSize(vw, vh);
        this.innerHd.style.width = (vw)+'px';

        this.autoExpand();

        if(this.forceFit && this.lastViewWidth != vw){
            this.fitColumns(false, false);
            this.lastViewWidth = vw;
        }
    },

    /* ----------------------------------- Core Specific -------------------------------------------*/
    init: function(grid){
        this.grid = grid;

        this.initTemplates();
        this.initData(grid.dataSource, grid.colModel);
        this.initUI(grid);
	},

	getColumnId : function(index){
	    return this.cm.getColumnId(index);
	},

    renderHeaders : function(){
	    var cm = this.cm, ts = this.templates;
        var ct = ts.hcell;

        var cb = [], sb = [], p = {};

        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            p.id = cm.getColumnId(i);
            p.value = cm.getColumnHeader(i) || "";
            p.style = this.getColumnStyle(i, true);
            if(cm.config[i].align == 'right'){
                p.istyle = 'padding-right:16px';
            }
            cb[cb.length] = ct.apply(p);
        }
        return ts.header.apply({cells: cb.join(""), tstyle:'width:'+this.getTotalWidth()+';'});
	},

    beforeUpdate : function(){
        this.grid.stopEditing();
    },

    updateHeaders : function(){
        this.innerHd.firstChild.innerHTML = this.renderHeaders();
    },

    /**
     * Focuses the specified row..
     * @param {Number} row The row index
     */
    focusRow : function(row){
        this.focusCell(row, 0, false);
    },

    /**
     * Focuses the specified cell.
     * @param {Number} row The row index
     * @param {Number} col The column index
     */
    focusCell : function(row, col, hscroll){
        var el = this.ensureVisible(row, col, hscroll);
        if(el){
            this.focusEl.alignTo(el, "tl-tl");
            if(Ext.isGecko){
                this.focusEl.focus();
            }else{
                this.focusEl.focus.defer(1, this.focusEl);
            }
        }
    },

    /** @ignore */
    ensureVisible : function(row, col, hscroll){
        if(typeof row != "number"){
            row = row.rowIndex;
        }
        if(row < 0 || row >= this.ds.getCount()){
            return;
        }
        col = (col !== undefined ? col : 0);
        while(this.cm.isHidden(col)){
            col++;
        }

        var el = this.getCell(row, col);
        if(!el){
            return;
        }
        

        var c = this.mainBody.dom;

        var ctop = parseInt(el.parentNode.parentNode.parentNode.offsetTop, 10)-this.mainHd.dom.offsetHeight;
        var cleft = parseInt(el.offsetLeft, 10);
        var cbot = ctop + el.offsetHeight;
        var cright = cleft + el.offsetWidth;

        var ch = c.clientHeight;
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

    insertRows : function(dm, firstRow, lastRow, isUpdate){
        if(firstRow == 0 && lastRow == dm.getCount()-1){
            this.refresh();
        }else{
            if(!isUpdate){
                this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
            }
            var html = this.renderRows(firstRow, lastRow);
            var before = this.mainBody.dom.childNodes[firstRow];
            if(before){
                Ext.DomHelper.insertHtml('beforeBegin', before, html);
            }else{
                Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
            }
            if(!isUpdate){
                this.fireEvent("rowsinserted", this, firstRow, lastRow);
                this.stripeRows(firstRow);
            }
        }
    },

    deleteRows : function(dm, firstRow, lastRow){
        if(dm.getRowCount()<1){
            this.fireEvent("beforerefresh", this);
            this.mainBody.update("");
            this.fireEvent("refresh", this);
        }else{
            this.fireEvent("beforerowsdeleted", this, firstRow, lastRow);

            this.removeRows(firstRow, lastRow);

            this.stripeRows(firstRow);
            this.fireEvent("rowsdeleted", this, firstRow, lastRow);
        }
    },

    getColumnStyle : function(col, isHeader){
        var style = !isHeader ? (this.cm.config[col].css || '') : '';
        style += 'width:'+this.getColumnWidth(col)+';';
        if(this.cm.isHidden(col)){
            style += 'display:none;';
        }
        var align = this.cm.config[col].align;
        if(align){
            style += 'text-align:'+align+';';
        }
        return style;
    },

    getColumnWidth : function(col){
        var w = this.cm.getColumnWidth(col);
        if(typeof w == 'number'){
            return (Ext.isBorderBox ? w : w-this.borderWidth) + 'px';
        }
        return w;
    },

    getTotalWidth : function(){
        return this.cm.getTotalWidth()+'px';
    },

    fitColumns : function(preventRefresh, onlyExpand, omitColumn){
        var cm = this.cm, leftOver, dist, i;
        var tw = cm.getTotalWidth(false);
        var aw = this.grid.getGridEl().getWidth(true)-this.scrollOffset;
        var extra = aw - tw;

        if(extra === 0){
            return false;
        }

        var vc = cm.getColumnCount(true);
        var ac = vc-(typeof omitColumn == 'number' ? 1 : 0);
        if(ac === 0){
            ac = 1;
            omitColumn = undefined;
        }
        var colCount = cm.getColumnCount();
        var cols = [];
        var extraCol = 0;
        var width = 0;
        var w;
        for (i = 0; i < colCount; i++){
            if(!cm.isHidden(i) && !cm.isFixed(i) && i !== omitColumn){
                w = cm.getColumnWidth(i);
                cols.push(i);
                extraCol = i;
                cols.push(w);
                width += w;
            }
        }
        var frac = (aw - cm.getTotalWidth())/width;
        while (cols.length){
            w = cols.pop();
            i = cols.pop();
            cm.setColumnWidth(i, Math.max(this.grid.minColumnWidth, Math.floor(w + w*frac)), true);
        }

        if((tw = cm.getTotalWidth(false)) > aw){
            var adjustCol = ac != vc ? omitColumn : extraCol;
             cm.setColumnWidth(adjustCol, Math.max(1,
                     cm.getColumnWidth(adjustCol)- (tw-aw)), true);       
        }

        if(preventRefresh !== true){
            this.updateAllColumnWidths();
        }
        return true;
    },

    autoExpand : function(preventUpdate){
        var g = this.grid, cm = this.cm;
        if(!this.userResized && g.autoExpandColumn){
            var tw = cm.getTotalWidth(false);
            var aw = this.grid.getGridEl().getWidth(true)-this.scrollOffset;
            if(tw != aw){
                var ci = cm.getIndexById(g.autoExpandColumn);
                var currentWidth = cm.getColumnWidth(ci);
                var cw = Math.min(Math.max(((aw-tw)+currentWidth), g.autoExpandMin), g.autoExpandMax);
                if(cw != currentWidth){
                    cm.setColumnWidth(ci, cw, true);
                    if(preventUpdate !== true){
                        this.updateColumnWidth(ci, cw);
                    }
                }
            }

        }
    },

    renderRows : function(startRow, endRow){
        // pull in all the crap needed to render rows
        var g = this.grid, cm = g.colModel, ds = g.dataSource, stripe = g.stripeRows;
        var colCount = cm.getColumnCount();

        if(ds.getCount() < 1){
            return "";
        }

        // build a map for all the columns
        var cs = [];
        for(var i = 0; i < colCount; i++){
            var name = cm.getDataIndex(i);

            cs[i] = {
                name : (typeof name == 'undefined' ? ds.fields.get(i).name : name),
                renderer : cm.getRenderer(i),
                id : cm.getColumnId(i),
                locked : cm.isLocked(i),
                style : this.getColumnStyle(i)
            };
        }

        startRow = startRow || 0;
        endRow = typeof endRow == "undefined"? ds.getCount()-1 : endRow;

        // records to render
        var rs = ds.getRange(startRow, endRow);

        return this.doRender(cs, rs, ds, startRow, colCount, stripe);
    },

    renderBody : function(){
        var markup = this.renderRows();
        return this.templates.body.apply({rows: markup});
    },

    refreshRow : function(record){
        var ds = this.ds, index;
        if(typeof record == 'number'){
            index = record;
            record = ds.getAt(index);
        }else{
            index = ds.indexOf(record);
        }
        var cls = [];
        this.insertRows(ds, index, index, true);
        this.mainBody.dom.childNodes[index].rowIndex = index;
        this.onRemove(ds, record, index+1, true);
        this.fireEvent("rowupdated", this, index, record);
    },

    refresh : function(headersToo){
        this.fireEvent("beforerefresh", this);
        this.grid.stopEditing();
        var result = this.renderBody();
        this.mainBody.update(result);
        if(headersToo === true){
            this.updateHeaders();
            this.updateHeaderSortState();
        }
        this.stripeRows(0, true);
        this.layout();
        this.fireEvent("refresh", this);
    },

    updateHeaderSortState : function(){
        var state = this.ds.getSortState();
        if(!state){
            return;
        }
        this.sortState = state;
        var sortColumn = this.cm.findColumnIndex(state.field);
        if(sortColumn != -1){
            var sortDir = state.direction;
            this.updateSortIcon(sortColumn, sortDir);
        }
    },

    destroy : function(){
        return;
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

        this.bind(null, null);
        Ext.EventManager.removeResizeListener(this.onWindowResize, this);
    },

    onDenyColumnHide : function(){

    },

    render : function(){

        var cm = this.cm;
        var colCount = cm.getColumnCount();

        if(this.grid.monitorWindowResize === true){
            Ext.EventManager.onWindowResize(this.onWindowResize, this, true);
        }

        if(this.autoFill){
            this.fitColumns(true, true);
        }else if(this.forceFit){
            this.fitColumns(true, false);
        }else if(this.grid.autoExpandColumn){
            this.autoExpand(true);
        }

        this.renderUI();

        //this.layout();

        // two part rendering gives faster view to the user
        //this.renderPhase2.defer(1, this);
        this.renderPhase2();
    },

    renderPhase2 : function(){
        // render the rows now
        this.refresh();
    },

    onWindowResize : function(){
        if(!this.grid.monitorWindowResize || this.grid.autoHeight){
            return;
        }
        this.layout();
    },


    /* --------------------------------- Model Events and Handlers --------------------------------*/

    initData : function(ds, cm){
        if(this.ds){
            this.ds.un("load", this.onLoad, this);
            this.ds.un("datachanged", this.onDataChange);
            this.ds.un("add", this.onAdd);
            this.ds.un("remove", this.onRemove);
            this.ds.un("update", this.onUpdate);
            this.ds.un("clear", this.onClear);
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

    onDataChange : function(){
        this.refresh();
        this.updateHeaderSortState();
    },

	onClear : function(){
        this.refresh();
    },

	onUpdate : function(ds, record){
        this.refreshRow(record);
    },

    onAdd : function(ds, records, index){
        this.insertRows(ds, index, index + (records.length-1));
    },

    onRemove : function(ds, record, index, isUpdate){
        if(isUpdate !== true){
            this.fireEvent("beforerowremoved", this, index, record);
        }
        this.removeRow(index);
        if(isUpdate !== true){
            this.stripeRows(index);
            this.layout();
            this.fireEvent("rowremoved", this, index, record);
        }
    },

    onLoad : function(){
        this.scrollToTop();
    },

    onColWidthChange : function(cm, col, width){
        this.updateColumnWidth(col, width);
    },

    onHeaderChange : function(cm, col, text){
        this.updateHeaderText(col, text);
    },

    onHiddenChange : function(cm, col, hidden){
        this.updateColumnHidden(col, hidden);
    },

    onColumnMove : function(cm, oldIndex, newIndex){
        this.indexMap = null;
        var s = this.getScrollState();
        this.refresh(true);
        this.restoreScroll(s);
        this.afterMove(newIndex);
    },

    /* -------------------- UI Events and Handlers ------------------------------ */

    initUI : function(grid){
        grid.on("headerclick", this.onHeaderClick, this);

        if(grid.trackMouseOver){
            grid.on("mouseover", this.onRowOver, this);
	        grid.on("mouseout", this.onRowOut, this);
	    }
    },

    initEvents : function(){

    },

    onHeaderClick : function(g, index){
        if(this.headersDisabled || !this.cm.isSortable(index)){
            return;
        }
	    g.stopEditing();
        g.dataSource.sort(this.cm.getDataIndex(index));
    },

    onRowOver : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false){
            this.addRowClass(row, "x-grid3-row-over");
        }
    },

    onRowOut : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false && row !== this.findRowIndex(e.getRelatedTarget())){
            this.removeRowClass(row, "x-grid3-row-over");
        }
    },

    handleWheel : function(e){
        e.stopPropagation();
    },

    onRowSelect : function(row){
        this.addRowClass(row, "x-grid3-row-selected");
    },

    onRowDeselect : function(row){
        this.removeRowClass(row, "x-grid3-row-selected");
    },

    onCellSelect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            this.fly(cell).addClass("x-grid3-cell-selected");
        }
    },

    onCellDeselect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            this.fly(cell).removeClass("x-grid3-cell-selected");
        }
    },

    onColumnSplitterMoved : function(i, w){
        this.userResized = true;
        var cm = this.grid.colModel;
        cm.setColumnWidth(i, w, true);

        if(this.forceFit){
            this.fitColumns(true, false, i);
            this.updateAllColumnWidths();
        }else{
            this.updateColumnWidth(i, w);
        }

        this.grid.fireEvent("columnresize", i, w);
    },

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
            default:
                index = cm.getIndexById(item.id.substr(4));
                if(index != -1){
                    if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
                        this.onDenyColumnHide();
                        return false;
                    }
                    cm.setHidden(index, item.checked);
                }
        }
        return true;
    },

    isHideableColumn : function(c){
        return !c.hidden && !c.fixed;
    },

    beforeColMenuShow : function(){
        var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            if(cm.config[i].fixed !== true){
                this.colMenu.add(new Ext.menu.CheckItem({
                    id: "col-"+cm.getColumnId(i),
                    text: cm.getColumnHeader(i),
                    checked: !cm.isHidden(i),
                    hideOnClick:false
                }));
            }
        }
    },

    handleHdDown : function(e, t){
        if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
            e.stopEvent();
            var hd = this.findHeaderCell(t);
            Ext.fly(hd).addClass('x-grid3-hd-menu-open');
            var index = this.getCellIndex(hd);
            this.hdCtxIndex = index;
            var ms = this.hmenu.items, cm = this.cm;
            ms.get("asc").setDisabled(!cm.isSortable(index));
            ms.get("desc").setDisabled(!cm.isSortable(index));
            this.hmenu.on("hide", function(){
                Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
            }, this, {single:true});
            this.hmenu.show(t, "tl-bl?");
        }
    },

    handleHdOver : function(e, t){
        var hd = this.findHeaderCell(t);
        if(hd && !this.headersDisabled){
            this.activeHd = hd;
            this.activeHdIndex = this.getCellIndex(hd);
            var fly = this.fly(hd);
            this.activeHdRegion = fly.getRegion();
            if(this.cm.isSortable(this.activeHdIndex) && !this.cm.isFixed(this.activeHdIndex)){
                fly.addClass("x-grid3-hd-over");
                this.activeHdBtn = fly.child('.x-grid3-hd-btn');
                if(this.activeHdBtn){
                    this.activeHdBtn.dom.style.height = (hd.firstChild.offsetHeight-1)+'px';
                }
            }
        }
    },

    handleHdMove : function(e, t){
        if(this.activeHd && !this.headersDisabled){
            var hw = this.splitHandleWidth || 5;
            var r = this.activeHdRegion;
            var x = e.getPageX();
            var ss = this.activeHd.style;
            if(x - r.left <= hw && this.cm.isResizable(this.activeHdIndex-1)){
                if(Ext.isSafari){
                    ss.cursor = 'e-resize';// col-resize not always supported
                }else{
                    ss.cursor = 'col-resize';
                }
            }else if(r.right - x <= (!this.activeHdBtn ? hw : 2) && this.cm.isResizable(this.activeHdIndex)){
                if(Ext.isSafari){
                    ss.cursor = 'w-resize'; // col-resize not always supported
                }else{
                    ss.cursor = 'col-resize';
                }
            }else{
                ss.cursor = '';
            }
        }
    },

    handleHdOut : function(e, t){
        var hd = this.findHeaderCell(t);
        if(hd && (!Ext.isIE || !e.within(hd, true))){
            this.activeHd = null;
            this.fly(hd).removeClass("x-grid3-hd-over");
            hd.style.cursor = '';
        }
    },

    handleSplitDblClick : function(e, t){
        return;
        var i = this.getCellIndex(t);
        if(this.grid.enableColumnResize !== false && this.cm.isResizable(i) && !this.cm.isFixed(i)){
            this.autoSizeColumn(i, true);
            this.layout();
        }
    }
});


// private
// This is a support class used internally by the Grid components
Ext.grid.GridView.SplitDragZone = function(grid, hd){
    this.grid = grid;
    this.view = grid.getView();
    this.proxy = this.view.resizeProxy;
    Ext.grid.GridView.SplitDragZone.superclass.constructor.call(this, hd,
        "gridSplitters" + this.grid.getGridEl().id, {
        dragElId : Ext.id(this.proxy.dom), resizeFrame:false
    });
    this.scroll = false;
    this.hw = this.view.splitHandleWidth || 5;
};
Ext.extend(Ext.grid.GridView.SplitDragZone, Ext.dd.DDProxy, {

    b4StartDrag : function(x, y){
        this.view.headersDisabled = true;
        this.proxy.setHeight(this.view.mainWrap.getHeight());
        var w = this.cm.getColumnWidth(this.cellIndex);
        var minw = Math.max(w-this.grid.minColumnWidth, 0);
        this.resetConstraints();
        this.setXConstraint(minw, 1000);
        this.setYConstraint(0, 0);
        this.minX = x - minw;
        this.maxX = x + 1000;
        this.startPos = x;
        Ext.dd.DDProxy.prototype.b4StartDrag.call(this, x, y);
    },


    handleMouseDown : function(e){
        var t = this.view.findHeaderCell(e.getTarget());
        if(t){
            var xy = this.view.fly(t).getXY(), x = xy[0], y = xy[1];
            var exy = e.getXY(), ex = exy[0], ey = exy[1];
            var w = t.offsetWidth, adjust = false;
            if((ex - x) <= this.hw){
                adjust = -1;
            }else if((x+w) - ex <= this.hw){
                adjust = 0;
            }
            if(adjust !== false){
                this.cellIndex = this.view.getCellIndex(t)+adjust;
                this.split = t.dom;
                this.cm = this.grid.colModel;
                if(this.cm.isResizable(this.cellIndex) && !this.cm.isFixed(this.cellIndex)){
                    Ext.grid.GridView.SplitDragZone.superclass.handleMouseDown.apply(this, arguments);
                }
            }else if(this.view.columnDrag){
                this.view.columnDrag.callHandleMouseDown(e);
            }
        }
    },

    endDrag : function(e){
        var v = this.view;
        var endX = Math.max(this.minX, e.getPageX());
        var diff = endX - this.startPos;
        v.onColumnSplitterMoved(this.cellIndex, this.cm.getColumnWidth(this.cellIndex)+diff);
        setTimeout(function(){
            v.headersDisabled = false;
        }, 50);
    },

    autoOffset : function(){
        this.setDelta(0,0);
    }
});

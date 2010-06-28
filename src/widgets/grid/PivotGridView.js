/**
 * @class Ext.grid.PivotGridView
 * @extends Ext.grid.GridView
 * Specialised GridView for rendering Pivot Grid components
 */
Ext.grid.PivotGridView = Ext.extend(Ext.grid.GridView, {
    
    /**
     * The string that is used to join the segments of each menu item displayed in the column drop-down menu.
     * These segments are the header strings of each group header that contain each column.
     * @property menuGroupJoinString
     * @type String
     */
    menuGroupJoinString: ' ',
    
    /**
     * The CSS class added to all group header cells. Defaults to 'grid-hd-group-cell'
     * @property colHeaderCellCls
     * @type String
     */
    colHeaderCellCls: 'grid-hd-group-cell',
    
    /**
     * The width to render each row header that does not have a width specified via {@link #getRowGroupHeaders}. Defaults to 80.
     * @property defaultRowHeaderWidth
     * @type Number
     */
    defaultRowHeaderWidth: 80,
   
    /**
     * Returns the headers to be rendered at the top of the grid. Should be a 2-dimensional array, where each item specifies the number
     * of columns it groups (column in this case refers to normal grid columns). In the example below we have 5 city groups, which are
     * each part of a continent supergroup. The colspan for each city group refers to the number of normal grid columns that group spans,
     * so in this case the grid would be expected to have a total of 12 columns:
<pre><code>
[
    {
        items: [
            {header: 'England',   colspan: 5},
            {header: 'USA',       colspan: 3}
        ]
    },
    {
        items: [
            {header: 'London',    colspan: 2},
            {header: 'Cambridge', colspan: 3},
            {header: 'Palo Alto', colspan: 3}
        ]
    }
]
</code></pre>
     * In the example above we have cities nested under countries. The nesting could be deeper if desired - e.g. Continent -> Country ->
     * State -> City, or any other structure. The only constaint is that the same depth must be used throughout the structure.
     * @return {Array} A tree structure containing the headers to be rendered. Must include the colspan property at each level, which should
     * be the sum of all child nodes beneath this node.
     */
    getGroupColumnHeaders: function() {
        return [
            {
                items: [
                    {header: 'England',   colspan: 5},
                    {header: 'USA',       colspan: 3}
                ]
            },
            {
                items: [
                    {header: 'London',    colspan: 2},
                    {header: 'Cambridge', colspan: 3},
                    {header: 'Palo Alto', colspan: 3}
                ]
            }
        ];
    },
    
    /**
     * Returns the headers to be rendered on the left of the grid. Should be a 2-dimensional array, where each item specifies the number
     * of rows it groups. In the example below we have 5 city groups, which are each part of a continent supergroup. The rowspan for each 
     * city group refers to the number of normal grid columns that group spans, so in this case the grid would be expected to have a 
     * total of 12 rows:
<pre><code>
[
    {
        width: 90,
        items: [
            {header: 'England',   rowspan: 5},
            {header: 'USA',       rowspan: 3}
        ]
    },
    {
        width: 50,
        items: [
            {header: 'London',    rowspan: 2},
            {header: 'Cambridge', rowspan: 3},
            {header: 'Palo Alto', rowspan: 3}
        ]
    }
]
</code></pre>
     * In the example above we have cities nested under countries. The nesting could be deeper if desired - e.g. Continent -> Country ->
     * State -> City, or any other structure. The only constaint is that the same depth must be used throughout the structure.
     * @return {Array} A tree structure containing the headers to be rendered. Must include the colspan property at each level, which should
     * be the sum of all child nodes beneath this node.
     * Each group may specify the width it should be rendered with, defaulting to {@link #defaultRowHeaderWidth}.
     * @return {Array} The row groups
     */
    getRowGroupHeaders: function() {
        return [
            {
                width: 60,
                items: [
                    {header: 'England',   rowspan: 5},
                    {header: 'USA',       rowspan: 3}
                ]
            },
            {
                width: 80,
                items: [
                    {header: 'London',    rowspan: 2},
                    {header: 'Cambridge', rowspan: 3},
                    {header: 'Palo Alto', rowspan: 3}
                ]
            }
        ];
    },
    
    /**
     * Returns the total width of all row headers as specified by {@link #getRowGroupHeaders}
     * @return {Number} The total width
     */
    getTotalRowHeaderWidth: function() {
        var headers = this.getRowGroupHeaders(),
            length  = headers.length,
            total   = 0,
            i;
        
        for (i = 0; i< length; i++) {
            total += headers[i].width || this.defaultRowHeaderWidth;
        }
        
        return total;
    },
    
    /**
     * The template to use when rendering the markup that contains each column of row headers. Has a default template
     * @property rowHeaderTpl
     * @type Ext.Template
     */
    rowHeaderTpl: new Ext.Template(
        '<div class="x-grid3-row-header" style="width: {width}px;">',
            '{cells}',
        '</div>'
    ),
    
    /**
     * The template to use when rendering row header cells. Has a default template
     * @property rowHeaderCellTpl
     * @type Ext.Template
     */
    rowHeaderCellTpl: new Ext.Template(
        '<div class="x-grid3-row-header-cell" data-rowspan="{rowspan}">',
            '{header}',
        '</div>'
    ),
    
    /**
     * The master template to use when rendering the GridView. Has a default template
     * @property Ext.Template
     * @type masterTpl
     */
    masterTpl: new Ext.Template(
        '<div class="x-grid3" hidefocus="true">',
            '<div class="x-grid3-viewport">',
                '<div class="x-grid3-header">',
                    '<div class="x-grid3-header-inner">',
                        '<div class="x-grid3-header-offset" style="{ostyle}">{header}</div>',
                    '</div>',
                    '<div class="x-clear"></div>',
                '</div>',
                '<div class="x-grid3-scroller">',
                    '<div class="x-grid3-row-headers">',
                        '{rowHeaders}',
                    '</div>',
                    '<div class="x-grid3-body" style="{bstyle}">{body}</div>',
                    '<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
                '</div>',
            '</div>',
            '<div class="x-grid3-resize-marker">&#160;</div>',
            '<div class="x-grid3-resize-proxy">&#160;</div>',
        '</div>'
    ),
    
    /**
     * @private
     * Adds a gcell template to the internal templates object. This is used to render the headers in a multi-level column header.
     */
    initTemplates: function() {
        Ext.grid.PivotGridView.superclass.initTemplates.apply(this, arguments);
        
        var templates = this.templates || {};
        if (!templates.gcell) {
            templates.gcell = new Ext.XTemplate(
                '<td class="x-grid3-hd x-grid3-gcell x-grid3-td-{id} ux-grid-hd-group-row-{row} ' + this.colHeaderCellCls + '" style="{style}">',
                    '<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', 
                        this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '', '{value}',
                    '</div>',
                '</td>'
            );
        }
        
        Ext.applyIf(templates, {
            rowHeader    : this.rowHeaderTpl,
            rowHeaderCell: this.rowHeaderCellTpl
        });
        
        this.templates = templates;
        this.hrowRe = new RegExp("ux-grid-hd-group-row-(\\d+)", "");
    },
    
    /**
     * @private
     * Sets up the reference to the row headers element
     */
    initElements: function() {
        Ext.grid.PivotGridView.superclass.initElements.apply(this, arguments);
        
        /**
         * @property rowHeadersEl
         * @type Ext.Element
         * The element containing all row headers
         */
        this.rowHeadersEl = new Ext.Element(this.scroller.child('div.x-grid3-row-headers'));
    },
    
    /**
     * @private
     * Takes row headers into account when calculating total available width
     */
    getGridInnerWidth: function() {
        var previousWidth = Ext.grid.PivotGridView.superclass.getGridInnerWidth.apply(this, arguments);
        
        return previousWidth - this.getTotalRowHeaderWidth();
    },
    
    /**
     * @private
     * Slight specialisation of the GridView renderUI - just adds the row headers
     */
    renderUI : function() {
        Ext.apply(this.columnDrop, this.columnDropConfig);
        
        Ext.apply(this.splitZone, {
            allowHeaderDrag: function(e){
                return !e.getTarget(null, null, true).hasClass(this.colHeaderCellCls);
            }
        });
        
        var templates = this.templates;
        
        return templates.master.apply({
            body  : templates.body.apply({rows:'&#160;'}),
            header: this.renderHeaders(),
            ostyle: 'width:' + this.getOffsetWidth() + ';',
            bstyle: 'width:' + this.getTotalWidth()  + ';',
            
            rowHeaders: this.renderGroupRowHeaders()
        });
    },
    
    /**
     * @private
     */
    renderHeaders: function() {
        this.renderGroupRowHeaders();
        
        var groupHeaders  = this.renderGroupColumnHeaders(),
            columnHeaders = Ext.grid.PivotGridView.superclass.renderHeaders.apply(this, arguments);
        
        return groupHeaders + columnHeaders;
    },
    
    /**
     * @private
     * Renders all row header groups at all levels based on the structure fetched from {@link #getGroupRowHeaders}
     * @return {String} The rendered row headers
     */
    renderGroupRowHeaders: function() {
        var template   = this.templates.rowHeaderCell,
            rowHeaders = this.getRowGroupHeaders(),
            colCount   = rowHeaders.length,
            columns    = [],
            rows, rowCount, cells, i, j;
        
        for (i = 0; i < colCount; i++) {
            cells = [];
            rows  = rowHeaders[i].items;
            rowCount = rows.length;
            
            for (j = 0; j < rowCount; j++) {
                cells.push(template.apply({
                    header : rows[j].header,
                    rowspan: rows[j].rowspan || 1
                }));
            }
            
            columns[i] = this.templates.rowHeader.apply({
                cells: cells.join(""),
                width: rowHeaders[i].width
            });
        }
        
        return columns.join("");
    },
    
    /**
     * @private
     * Renders all groups at all levels based on the structure fetched from {@link #getGroupColumnHeaders}.
     * @return {String} The rendered headers
     */
    renderGroupColumnHeaders: function() {
        var template   = this.templates.gcell,
            rowStyle   = String.format("width: {0};", this.getTotalWidth()),
            groupRows  = this.getGroupColumnHeaders(),
            rowCount   = groupRows.length,
            colModel   = this.cm,
            rows       = [],
            rowItems, group, groupCount, colIndex, cells, i, j;
        
        /*
         * groupRows is a 2-dimensional array of the group headers to render above the normal grid column headers. See getGroupColumnHeaders for
         * an example structure. We render the rows of grouped headers from top to bottom. colIndex is used internally to track how many
         * of the grid's normal columns a particular group spans via getGroupWidth.
         */
        for (i = 0; i < rowCount; i++) {
            cells      = [];
            colIndex   = 0;
            rowItems   = groupRows[i].items;
            groupCount = rowItems.length;
            
            for (j = 0; j < groupCount; j++) {
                group = rowItems[j];
                
                cells.push(template.apply({
                    row    : i,
                    id     : this.getColumnId(group.dataIndex ? colModel.findColumnIndex(group.dataIndex) : colIndex),
                    style  : this.getGroupStyle(group, this.getGroupWidth(colIndex, colIndex + group.colspan)),
                    tooltip: group.tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + group.tooltip + '"' : '',
                    istyle : group.align == 'right' ? 'padding-right: 16px' : '',
                    btn    : this.grid.enableHdMenu && group.header,
                    value  : group.header || '&nbsp;'
                }));
                
                colIndex += group.colspan;
            }
            
            rows[i] = this.templates.header.apply({
                tstyle: rowStyle,
                cells : cells.join('')
            });
        }
        
        return rows.join("");
    },
    
    /**
     * @private
     * Gives the main body and header elements a margin to make room for the row headers
     */
    afterRender: function() {
        Ext.grid.PivotGridView.superclass.afterRender.apply(this, arguments);
        
        var rowHeaderWidth = this.getTotalRowHeaderWidth(),
            marginStyle    = String.format("margin-left: {0}px;", rowHeaderWidth);
        
        this.mainBody.applyStyles(marginStyle);
        this.mainHd.applyStyles(marginStyle);
        
        this.resizeRowHeaders();
    },
    
    /**
     * @private
     * 
     */
    resizeRowHeaders: function() {
        var innerHeight  = this.mainBody.getHeight(),
            rowHeight    = innerHeight / this.getRows().length,
            rowHeaders   = Ext.get(this.rowHeadersEl).select('div.x-grid3-row-header'),
            rowHeaderEls = rowHeaders.elements,
            length       = rowHeaderEls.length,
            configs      = this.getRowGroupHeaders(),
            column, rows, rowCount, i, j;
        
        for (i = 0; i < length; i++) {
            column   = Ext.get(rowHeaderEls[i]);
            rows     = column.select('div.x-grid3-row-header-cell').elements;
            rowCount = rows.length;
            
            for (j = 0; j < rowCount; j++) {
                Ext.fly(rows[j]).setHeight(rowHeight * (configs[i].items[j].rowspan || 1));
            }
        }
    },
    
    /**
     * @private
     * Iterates over all groups and resizes them based on the number of columns they contain
     * TODO: This contains a very similar nested loop to renderGroupColumnHeaders - might be able to abstract it. See its internal
     * nested for loop for details on the workings of this
     */
    updateGroupStyles: function() {
        var tables     = this.mainHd.query('.x-grid3-header-offset > table'),
            totalWidth = this.getTotalWidth(), 
            groupRows  = this.getGroupColumnHeaders(),
            rowCount   = groupRows.length,
            groupCount, rowItems, group, cells, i, j, colIndex;
        
        for (i = 0; i < rowCount; i++) {
            cells      = Ext.fly(tables[i]).select('td').elements;
            rowItems   = groupRows[i].items;
            groupCount = rowItems.length;
            colIndex   = 0;
            
            tables[i].style.width = totalWidth;
            
            for (j = 0; j < groupCount; j++) {
                group = rowItems[j];
                
                Ext.fly(cells[j]).applyStyles(this.getGroupStyle(group, this.getGroupWidth(colIndex, colIndex + group.colspan)));
                
                colIndex += group.colspan;
            }
        }
    },
    
    /**
     * @private
     */
    onColumnWidthUpdated: function() {
        this.updateGroupStyles();
    },

    /**
     * @private
     */
    onAllColumnWidthsUpdated: function() {
        this.updateGroupStyles();
    },

    /**
     * @private
     */
    onColumnHiddenUpdated: function() {
        this.updateGroupStyles();
    },
    
    /**
     * @private
     * Returns the combined width of a series of sequential columns
     * @param {Number} startIndex The index of the first column
     * @param {Number} endIndex The index of the last column
     * @return {Number} The width in pixels to make the group
     */
    getGroupWidth: function(startIndex, endIndex) {
        var width    = 0,
            colModel = this.cm,
            colWidth, i;
        
        for (i = startIndex; i < endIndex; i++) {
            if (!colModel.isHidden(i)) {
                colWidth = colModel.getColumnWidth(i);
                
                if (typeof colWidth == 'number') {
                    width += colWidth;
                }
            }
        }
        
        return Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? width : Math.max(width - this.borderWidth, 0) + 'px';
    },
    
    /**
     * @private
     * Builds and returns a CSS string detailing the width, visibility and text alignment of a given group header
     * @param {Object} group The object representing the group
     * @param {Number} width The width of this group header
     * @return {String} The CSS string
     */
    getGroupStyle: function(group, width) {
        var groupAlign   = String.format("text-align: {0}", group.align || "center"),
            groupWidth   = String.format("width: {0}{1}", width, Ext.isWebKit ? 'px' : ''),
            groupDisplay = width == 0 ? "display: none" : "";
        
        return [groupAlign, groupWidth, groupDisplay].join("; ");
    },
    
    /**
     * @private
     * Click handler for the shared column dropdown menu, called on beforeshow. Builds the menu items.
     */
    beforeColMenuShow: function() {
        var menu     = this.colMenu,
            titles   = this.buildMenuTitles(),
            colModel = this.cm,
            config   = colModel.config,
            length   = colModel.getColumnCount();
        
        menu.removeAll();
        
        for (i = 0; i < length; i++) {
            titles[i].push(colModel.getColumnHeader(i));
            
            if (config[i].hideable !== false) {
                var item = new Ext.menu.CheckItem({
                    text       : titles[i].join(this.menuGroupJoinString),
                    itemId     : String.format("col-{0}", colModel.getColumnId(i)),
                    checked    : !colModel.isHidden(i),
                    hideOnClick: false,
                    disabled   : colModel.config[i].hideable === false
                });
                
                menu.add(item);
            }
        }
    },
    
    /**
     * Returns an array with one title for each column in the grid. These are built by combining the header text
     * of each group above the column and joining them on {@link menuGroupJoinString}. NOTE - does not include 
     * the title of the column itself, just the titles of the groups above it.
     * @return {Array} The menu titles
     */
    buildMenuTitles: function() {
        var colModel  = this.cm,
            groupRows = this.getGroupColumnHeaders(),
            rowCount  = groupRows.length,
            titles    = [],
            i, j, k, rowItems, colIndex, colCount, group;
        
        for (i = 0; i < rowCount; i++) {
            rowItems = groupRows[i].items;
            colCount = rowItems.length;
            colIndex = 0;
            
            for (j = 0; j < colCount; j++) {
                group = rowItems[j];
                
                for (k = 0; k < group.colspan; k++) {
                    titles[colIndex] = titles[colIndex] || [];
                    titles[colIndex].push(group.header);
                    
                    colIndex++;
                }
            }
        }
        
        return titles;
    },
    
    /**
     * @private
     * Intercepts the superclass' behavior, only allowing cursor change if not hovering over a group header cell. See 
     * {@link Ext.grid.GridView#handleHdMove} for explanation of what this does.
     */
    handleHdMove: function(e) {
        var header  = this.findHeaderCell(this.activeHdRef),
            isGroup;
        
        if (header) {
            if (Ext.fly(header).hasClass(this.colHeaderCellCls)) {
                return Ext.grid.PivotGridView.superclass.handleHdMove.apply(this, arguments);
            }            
        }
    },
    
    /**
     * @private
     * Overridden to test whether the user is hovering over a group cell, in which case we don't show the menu
     */
    isMenuDisabled: function(cellIndex, el) {
        return this.cm.isMenuDisabled(cellIndex) || el.hasClass(this.colHeaderCellCls);
    },
    
    
    
    
    //TODO: figure out what these things do and why
    getHeaderCell: function(index) {
        return this.mainHd.query(this.cellSelector)[index];
    },

    findHeaderCell: function(el) {
        return el ? this.fly(el).findParent('td.x-grid3-hd', this.cellSelectorDepth) : false;
    },

    findHeaderIndex: function(el) {
        var cell = this.findHeaderCell(el);
        return cell ? this.getCellIndex(cell) : false;
    }
});


/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Ext.ux.grid');

Ext.ux.grid.ColumnHeaderGroup = Ext.extend(Ext.util.Observable, {

    constructor: function(config){
        this.config = config;
    },

    init: function(grid){
        Ext.applyIf(grid.colModel, this.config);
        Ext.apply(grid.getView(), this.viewConfig);
    },

    viewConfig: {

        updateSortIcon: function(col, dir){
            var sc = this.sortClasses, hds = this.mainHd.select(this.cellSelector).removeClass(sc);
            hds.item(col).addClass(sc[dir == "DESC" ? 1 : 0]);
        }
    },
    
    columnDropConfig: {
        getTargetFromEvent: function(e){
            var t = Ext.lib.Event.getTarget(e);
            return this.view.findHeaderCell(t);
        },

        positionIndicator: function(h, n, e){
            var data = Ext.ux.grid.ColumnHeaderGroup.prototype.getDragDropData.call(this, h, n, e);
            if(data === false){
                return false;
            }
            var px = data.px + this.proxyOffsets[0];
            this.proxyTop.setLeftTop(px, data.r.top + this.proxyOffsets[1]);
            this.proxyTop.show();
            this.proxyBottom.setLeftTop(px, data.r.bottom);
            this.proxyBottom.show();
            return data.pt;
        },

        onNodeDrop: function(n, dd, e, data){
            var h = data.header;
            if(h != n){
                var d = Ext.ux.grid.ColumnHeaderGroup.prototype.getDragDropData.call(this, h, n, e);
                if(d === false){
                    return false;
                }
                var cm = this.grid.colModel, right = d.oldIndex < d.newIndex, rows = cm.rows;
                for(var row = d.row, rlen = rows.length; row < rlen; row++){
                    var r = rows[row], len = r.length, fromIx = 0, span = 1, toIx = len;
                    for(var i = 0, gcol = 0; i < len; i++){
                        var group = r[i];
                        if(d.oldIndex >= gcol && d.oldIndex < gcol + group.colspan){
                            fromIx = i;
                        }
                        if(d.oldIndex + d.colspan - 1 >= gcol && d.oldIndex + d.colspan - 1 < gcol + group.colspan){
                            span = i - fromIx + 1;
                        }
                        if(d.newIndex >= gcol && d.newIndex < gcol + group.colspan){
                            toIx = i;
                        }
                        gcol += group.colspan;
                    }
                    var groups = r.splice(fromIx, span);
                    rows[row] = r.splice(0, toIx - (right ? span : 0)).concat(groups).concat(r);
                }
                for(var c = 0; c < d.colspan; c++){
                    var oldIx = d.oldIndex + (right ? 0 : c), newIx = d.newIndex + (right ? -1 : c);
                    cm.moveColumn(oldIx, newIx);
                    this.grid.fireEvent("columnmove", oldIx, newIx);
                }
                return true;
            }
            return false;
        }
    },

    getGroupRowIndex: function(el){
        if(el){
            var m = el.className.match(this.hrowRe);
            if(m && m[1]){
                return parseInt(m[1], 10);
            }
        }
        return this.cm.rows.length;
    },

    getGroupSpan: function(row, col){
        if(row < 0){
            return {
                col: 0,
                colspan: this.cm.getColumnCount()
            };
        }
        var r = this.cm.rows[row];
        if(r){
            for(var i = 0, gcol = 0, len = r.length; i < len; i++){
                var group = r[i];
                if(col >= gcol && col < gcol + group.colspan){
                    return {
                        col: gcol,
                        colspan: group.colspan
                    };
                }
                gcol += group.colspan;
            }
            return {
                col: gcol,
                colspan: 0
            };
        }
        return {
            col: col,
            colspan: 1
        };
    },

    getDragDropData: function(h, n, e){
        if(h.parentNode != n.parentNode){
            return false;
        }
        var cm = this.grid.colModel, x = Ext.lib.Event.getPageX(e), r = Ext.lib.Dom.getRegion(n.firstChild), px, pt;
        if((r.right - x) <= (r.right - r.left) / 2){
            px = r.right + this.view.borderWidth;
            pt = "after";
        }else{
            px = r.left;
            pt = "before";
        }
        var oldIndex = this.view.getCellIndex(h), newIndex = this.view.getCellIndex(n);
        if(cm.isFixed(newIndex)){
            return false;
        }
        var row = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupRowIndex.call(this.view, h),
            oldGroup = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row, oldIndex),
            newGroup = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row, newIndex),
            oldIndex = oldGroup.col;
            newIndex = newGroup.col + (pt == "after" ? newGroup.colspan : 0);
        if(newIndex >= oldGroup.col && newIndex <= oldGroup.col + oldGroup.colspan){
            return false;
        }
        var parentGroup = Ext.ux.grid.ColumnHeaderGroup.prototype.getGroupSpan.call(this.view, row - 1, oldIndex);
        if(newIndex < parentGroup.col || newIndex > parentGroup.col + parentGroup.colspan){
            return false;
        }
        return {
            r: r,
            px: px,
            pt: pt,
            row: row,
            oldIndex: oldIndex,
            newIndex: newIndex,
            colspan: oldGroup.colspan
        };
    }
});
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
     * @property groupCellCls
     * @type String
     */
    groupCellCls: 'grid-hd-group-cell',

   
    /**
     * Returns the headers to be rendered at the top of the grid. Should be a 2-dimensional array, where each item specifies the number
     * of columns it groups (column in this case refers to normal grid columns). In the example below we have 5 city groups, which are
     * each part of a continent supergroup. The colspan for each city group refers to the number of normal grid columns that group spans,
     * so in this case the grid would be expected to have a total of 12 columns:
<pre><code>
[
    [
        {header: 'England',       colspan: 5},
        {header: 'USA',           colspan: 7}
    ],
    [
        {header: 'London',        colspan: 2},
        {header: 'Cambridge',     colspan: 3},
        {header: 'Palo Alto',     colspan: 4},
        {header: 'San Francisco', colspan: 2},
        {header: 'New York',      colspan: 1}
    ]
]
</code></pre>
     * In the example above we have cities nested under countries. The nesting could be deeper if desired - e.g. Continent -> Country ->
     * State -> City, or any other structure. The only constaint is that the same depth must be used throughout the structure.
     * @return {Array} A tree structure containing the headers to be rendered. Must include the colspan property at each level, which should
     * be the sum of all child nodes beneath this node.
     */
    getGroupRows: function() {
        return [
            [
                {header: 'England',       colspan: 5},
                {header: 'USA',           colspan: 3}
            ],
            [
                {header: 'London',        colspan: 2},
                {header: 'Cambridge',     colspan: 3},
                {header: 'Palo Alto',     colspan: 3}
            ]
        ];
    },
    
    /**
     * @private
     * Adds a gcell template to the internal templates object. This is used to render the headers in a multi-level column header.
     */
    initTemplates: function() {
        Ext.grid.PivotGridView.superclass.initTemplates.apply(this, arguments);
        
        var templates = this.templates || {};
        if (!templates.gcell) {
            templates.gcell = new Ext.XTemplate(
                '<td class="x-grid3-hd x-grid3-gcell x-grid3-td-{id} ux-grid-hd-group-row-{row} ' + this.groupCellCls + '" style="{style}">',
                    '<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', 
                        this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '', '{value}',
                    '</div>',
                '</td>'
            );
        }
        
        this.templates = templates;
        this.hrowRe = new RegExp("ux-grid-hd-group-row-(\\d+)", "");
    },
    
    /**
     * @private
     * Renders all groups at all levels based on the structure fetched from {@link #getGroupRows}.
     * @return {String} The rendered headers
     */
    renderHeaders: function() {
        var template   = this.templates.gcell,
            rowStyle   = String.format("width: {0};", this.getTotalWidth()),
            groupRows  = this.getGroupRows(),
            rowCount   = groupRows.length,
            colModel   = this.cm,
            rows       = [],
            row, group, groupCount, colIndex, cells, columnId, i, j;
        
        /*
         * groupRows is a 2-dimensional array of the group headers to render above the normal grid column headers. See getGroupRows for
         * an example structure. We render the rows of grouped headers from top to bottom. colIndex is used internally to track how many
         * of the grid's normal columns a particular group spans via getGroupWidth.
         */
        for (i = 0; i < rowCount; i++) {
            row        = groupRows[i];
            cells      = [];
            colIndex   = 0;
            groupCount = row.length;
            
            for (j = 0; j < groupCount; j++) {
                group    = row[j];
                columnId = this.getColumnId(group.dataIndex ? colModel.findColumnIndex(group.dataIndex) : colIndex);
                
                cells.push(template.apply({
                    id     : columnId,
                    row    : i,
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
        
        return rows.concat([Ext.grid.PivotGridView.superclass.renderHeaders.apply(this, arguments)]).join("");
    },
    
    /**
     * @private
     * Iterates over all groups and resizes them based on the number of columns they contain
     * TODO: This contains a very similar nested loop to renderGroupHeaders - might be able to abstract it. See its internal
     * nested for loop for details on the workings of this
     */
    updateGroupStyles: function(col) {
        var tables     = this.mainHd.query('.x-grid3-header-offset > table'),
            totalWidth = this.getTotalWidth(), 
            groupRows  = this.getGroupRows(),
            rowCount   = groupRows.length,
            groupCount, row, group, cells, i, j, colIndex;
        
        for (i = 0; i < rowCount; i++) {
            row   = groupRows[i];
            cells = Ext.fly(tables[i]).select('td').elements;
            groupCount = row.length;
            colIndex   = 0;
            
            tables[i].style.width = totalWidth;
            
            for (j = 0; j < groupCount; j++) {
                group = row[j];
                
                Ext.fly(cells[j]).applyStyles(this.getGroupStyle(group, this.getGroupWidth(colIndex, group.colspan)));
                
                colIndex += group.colspan;
            }
        }
    },
    
    /**
     * @private
     */
    onColumnWidthUpdated: function() {
        Ext.grid.PivotGridView.superclass.onColumnWidthUpdated.apply(this, arguments);
        
        this.updateGroupStyles();
    },

    /**
     * @private
     */
    onAllColumnWidthsUpdated: function() {
        Ext.grid.PivotGridView.superclass.onAllColumnWidthsUpdated.apply(this, arguments);
        
        this.updateGroupStyles();
    },

    /**
     * @private
     */
    onColumnHiddenUpdated: function() {
        Ext.grid.PivotGridView.superclass.onColumnHiddenUpdated.apply(this, arguments);
        
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
            groupWidth   = String.format("width: {0}", width),
            groupDisplay = width == 0 ? "display: none" : "";
        
        return [groupAlign, groupWidth, groupDisplay].join("; ");
    },
    
    /**
     * @private
     * Override the defaults for the splitZone and columnDrop objects
     */
    renderUI: function() {
        Ext.grid.PivotGridView.superclass.renderUI.apply(this, arguments);
        Ext.apply(this.columnDrop, this.columnDropConfig);
        
        Ext.apply(this.splitZone, {
            allowHeaderDrag: function(e){
                return !e.getTarget(null, null, true).hasClass(this.groupCellCls);
            }
        });
    },
    
    /**
     * @private
     * Click handler for the shared column dropdown menu, called on beforeshow. Builds the menu items.
     */
    beforeColMenuShow: function() {
        var menu     = this.colMenu,
            titles   = this.buildMenuTitles(),
            colModel = this.cm,
            length   = colModel.getColumnCount();
        
        menu.removeAll();
        
        for (i = 0; i < length; i++) {
            titles[i].push(colModel.getColumnHeader(i));
            
            menu.add(new Ext.menu.CheckItem({
                itemId     : String.format("col-", colModel.getColumnId(i)),
                text       : titles[i].join(this.menuGroupJoinString),
                checked    : !colModel.isHidden(i),
                hideOnClick: false,
                disabled   : colModel.config[i].hideable === false
            }));
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
            groupRows = this.getGroupRows(),
            rowCount  = groupRows.length,
            titles    = [],
            i, j, k, row, group, colIndex;
        
        for (i = 0; i < rowCount; i++) {
            row = groupRows[i];
            colCount = row.length;
            colIndex = 0;
            
            for (j = 0; j < colCount; j++) {
                group = row[j];
                
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
            if (Ext.fly(header).hasClass(this.groupCellCls)) {
                return Ext.grid.PivotGridView.superclass.handleHdMove.apply(this, arguments);
            }            
        }
    },
    
    /**
     * @private
     * Overridden to test whether the user is hovering over a group cell, in which case we don't show the menu
     */
    isMenuDisabled: function(cellIndex, el) {
        return this.cm.isMenuDisabled(cellIndex) || el.hasClass(this.groupCellCls);
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
        },

        handleHdMenuClick: function(item){
            var index = this.hdCtxIndex, cm = this.cm, ds = this.ds, id = item.getItemId();
            switch(id){
                case 'asc':
                    ds.sort(cm.getDataIndex(index), 'ASC');
                    break;
                case 'desc':
                    ds.sort(cm.getDataIndex(index), 'DESC');
                    break;
                default:
                    if(id.substr(0, 5) == 'group'){
                        var i = id.split('-'), row = parseInt(i[1], 10), col = parseInt(i[2], 10), r = this.cm.rows[row], group, gcol = 0;
                        for(var i = 0, len = r.length; i < len; i++){
                            group = r[i];
                            if(col >= gcol && col < gcol + group.colspan){
                                break;
                            }
                            gcol += group.colspan;
                        }
                        if(item.checked){
                            var max = cm.getColumnsBy(this.isHideableColumn, this).length;
                            for(var i = gcol, len = gcol + group.colspan; i < len; i++){
                                if(!cm.isHidden(i)){
                                    max--;
                                }
                            }
                            if(max < 1){
                                this.onDenyColumnHide();
                                return false;
                            }
                        }
                        for(var i = gcol, len = gcol + group.colspan; i < len; i++){
                            if(cm.config[i].fixed !== true && cm.config[i].hideable !== false){
                                cm.setHidden(i, item.checked);
                            }
                        }
                    }else{
                        index = cm.getIndexById(id.substr(4));
                        if(index != -1){
                            if(item.checked && cm.getColumnsBy(this.isHideableColumn, this).length <= 1){
                                this.onDenyColumnHide();
                                return false;
                            }
                            cm.setHidden(index, item.checked);
                        }
                    }
                    item.checked = !item.checked;
                    if(item.menu){
                        var updateChildren = function(menu){
                            menu.items.each(function(childItem){
                                if(!childItem.disabled){
                                    childItem.setChecked(item.checked, false);
                                    if(childItem.menu){
                                        updateChildren(childItem.menu);
                                    }
                                }
                            });
                        };
                        updateChildren(item.menu);
                    }
                    var parentMenu = item, parentItem;
                    while(parentMenu = parentMenu.parentMenu){
                        if(!parentMenu.parentMenu || !(parentItem = parentMenu.parentMenu.items.get(parentMenu.getItemId())) || !parentItem.setChecked){
                            break;
                        }
                        var checked = parentMenu.items.findIndexBy(function(m){
                            return m.checked;
                        }) >= 0;
                        parentItem.setChecked(checked, true);
                    }
                    item.checked = !item.checked;
            }
            return true;
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
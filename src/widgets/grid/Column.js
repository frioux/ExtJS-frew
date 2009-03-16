/**
 * @class Ext.grid.Column
 * <p>This class encapsulates column configuration data stored in a {@link Ext.grid.ColumnModel ColumnModel}'s
 * {@link Ext.grid.ColumnModel#config config} property.</p>
 * <p>This class renders a passed data field unchanged and is usually used for textual columns. Subclasses
 * are provided which render data in different ways.</p>
 */
Ext.grid.Column = function(config){
    Ext.apply(this, config);

    if(typeof this.renderer == "string"){
        this.renderer = Ext.util.Format[this.renderer];
    } else if(typeof this.renderer == 'object'){
        this.rendererScope = this.renderer.scope;
        this.renderer = this.renderer.fn;
    }
    this.renderer = this.renderer.createDelegate(this.rendererScope || config);

    if(typeof this.id == "undefined"){
        this.id = ++Ext.grid.Column.AUTO_ID;
    }
    if(this.editor){
        if(this.editor.xtype && !this.editor.events){
            this.editor = Ext.create(this.editor, 'textfield');
        }
    }
}

Ext.grid.Column.AUTO_ID = 0;

Ext.grid.Column.prototype = {
    /**
     * @cfg {String} id (optional) A name which identifies this column (defaults to the column's initial
     * ordinal position. The <tt>id</tt> is used to create a CSS <b>class</b> name which is applied to all
     * table cells (including headers) in that column (in this context the <tt>id</tt> does not need to be
     * unique). The class name takes the form of <pre>x-grid3-td-<b>id</b></pre>
     * Header cells will also receive this class name, but will also have the class <pre>x-grid3-hd</pre>
     * So, to target header cells, use CSS selectors such as:<pre>.x-grid3-hd.x-grid3-td-<b>id</b></pre>
     * The {@link Ext.grid.GridPanel#autoExpandColumn} grid config option references the column via this
     * unique identifier.
     */
    /**
     * @cfg {String} header The header text to display in the Grid view. 
     */
    /**
     * @cfg {String} groupName If the grid is being rendered by an {@link Ext.grid.GroupingView}, this option
     * may be used to specify the text with which to prefix the group field value in the group header line.
     * See also {@link #groupRenderer} and {@link Ext.grid.GroupingView}.{@link Ext.grid.GroupingView#showGroupName showGroupName}.
     */
    /**
     * @cfg {String} dataIndex (optional) The name of the field in the grid's {@link Ext.data.Store}'s
     * {@link Ext.data.Record} definition from which to draw the column's value. If not
     * specified, the column's index is used as an index into the Record's data Array.
     */
    /**
     * @cfg {Number} width (optional) The initial width in pixels of the column. This is ignored if the
     * Grid's {@link Ext.grid.GridView view} is configured with {@link Ext.grid.GridView#forceFit forceFit} true.
     */
    /**
     * @cfg {Boolean} sortable (optional) True if sorting is to be allowed on this column.
     * Whether local/remote sorting is used is specified in {@link Ext.data.Store#remoteSort}.
     */
    /**
     * @cfg {Boolean} fixed (optional) True if the column width cannot be changed.  Defaults to false.
     */
    /**
     * @cfg {Boolean} resizable (optional) False to disable column resizing. Defaults to true.
     */
    /**
     * @cfg {Boolean} menuDisabled (optional) True to disable the column menu. Defaults to false.
     */
    /**
     * @cfg {Boolean} hidden (optional) True to hide the column. Defaults to false.
     */
    /**
     * @cfg {String} tooltip (optional) A text string to use as the column header's tooltip.  If Quicktips are enabled, this
     * value will be used as the text of the quick tip, otherwise it will be set as the header's HTML title attribute.
     * Defaults to ''.
     */
    /**
     * @cfg {Mixed} renderer <p>(optional) This may be specified in either of three ways:<div class="mdetail-params"><ul>
     * <li>A renderer function used to return HTML markup for a cell given the cell's data value.</li>
     * <li>A string which references a property name of the {@link Ext.util.Format} class which provides a renderer function.</li>
     * <li>An object specifying both the renderer function, and its execution scope (<tt><b>this</b></tt> reference) eg:<code><pre style="margin-left:1.2em">
{
    fn: this.gridRenderer,
    scope: this
}
</pre></code></li></ul></div>
     * If not specified, the default renderer uses the raw data value.</p>
     * <p>For information about the renderer function, see {@link Ext.grid.ColumnModel#setRenderer}</p>
     */
    /**
     * @cfg {Object} rendererScope (optional) The scope (<tt><b>this</b></tt> reference) in which to execute the
     * renderer.  Defaults to the Column configuration object.
     */
    /**
     * @cfg {String} align (optional) Set the CSS text-align property of the column.  Defaults to undefined.
     */
    /**
     * @cfg {String} css (optional) Set custom CSS for all table cells in the column (excluding headers).  Defaults to undefined.
     */
    /**
     * @cfg {Boolean} hideable (optional) Specify as <tt>false</tt> to prevent the user from hiding this column
     * (defaults to true).  To disallow column hiding globally for all columns in the grid, use
     * {@link Ext.grid.GridPanel#enableColumnHide} instead.
     */
    /**
     * @cfg {Ext.form.Field} editor (optional) The {@link Ext.form.Field} to use when editing values in this column if
     * editing is supported by the grid.
     */
    /**
     * @cfg {Function} groupRenderer If the grid is being rendered by an {@link Ext.grid.GroupingView}, this option
     * may be used to specify the function used to format the grouping field value for display in the group 
     * {@link #groupName header}.
     * Should return a string value.
     * <p>This takes the following parameters:
     * <div class="mdetail-params"><ul>
     * <li><b>v</b> : Object<p class="sub-desc">The new value of the group field.</p></li>
     * <li><b>unused</b> : undefined<p class="sub-desc">Unused parameter.</p></li>
     * <li><b>r</b> : Ext.data.Record<p class="sub-desc">The Record providing the data
     * for the row which caused group change.</p></li>
     * <li><b>rowIndex</b> : Number<p class="sub-desc">The row index of the Record which caused group change.</p></li>
     * <li><b>colIndex</b> : Number<p class="sub-desc">The column index of the group field.</p></li>
     * <li><b>ds</b> : Ext.data.Store<p class="sub-desc">The Store which is providing the data Model.</p></li>
     * </ul></div></p>
     */

    // private. Used by ColumnModel to avoid reprocessing
    isColumn : true,
    /**
     * @property renderer
     * @type Function
     * A function which returns displayable data when passed the following parameters:
     * <div class="mdetail-params"><ul>
     * <li><b>value</b> : Object<p class="sub-desc">The data value for the cell.</p></li>
     * <li><b>metadata</b> : Object<p class="sub-desc">An object in which you may set the following attributes:<ul>
     * <li><b>css</b> : String<p class="sub-desc">A CSS class name to add to the cell's TD element.</p></li>
     * <li><b>attr</b> : String<p class="sub-desc">An HTML attribute definition string to apply to the data container element <i>within</i> the table cell
     * (e.g. 'style="color:red;"').</p></li></ul></p></li>
     * <li><b>record</b> : Ext.data.record<p class="sub-desc">The {@link Ext.data.Record} from which the data was extracted.</p></li>
     * <li><b>rowIndex</b> : Number<p class="sub-desc">Row index</p></li>
     * <li><b>colIndex</b> : Number<p class="sub-desc">Column index</p></li>
     * <li><b>store</b> : Ext.data.Store<p class="sub-desc">The {@link Ext.data.Store} object from which the Record was extracted.</p></li>
     * </ul></div>
     */
    renderer : function(value){
        if(typeof value == "string" && value.length < 1){
            return "&#160;";
        }
        return value;
    },

    // private
    getEditor: function(rowIndex){
        return this.editable !== false ? this.editor : null;
    },

    /**
     * Returns the editor defined for this column.
     * @param {Number} rowIndex The row index
     * @return {Ext.Editor} The {@link Ext.Editor Editor} that was created to wrap 
     * the {@link Ext.form.Field Field} used to edit the cell.
     */
    getCellEditor: function(rowIndex){
        var editor = this.getEditor(rowIndex);
        if(editor){
            if(!editor.startEdit){
                if(!editor.gridEditor){
                    editor.gridEditor = new Ext.grid.GridEditor(editor);
                }
                return editor.gridEditor;
            }else if(editor.startEdit){
                return editor;
            }
        }
        return null;
    }
};

/**
 * @class Ext.grid.BooleanColumn
 * @extends Ext.grid.Column
 * <p>A Column definition class which renders boolean data fields.</p>
 */
Ext.grid.BooleanColumn = Ext.extend(Ext.grid.Column, {
    /**
     * @cfg {String} trueText
     * The string returned by the renderer when the column value is not falsey.
     */
    trueText: 'true',
    /**
     * @cfg {String} falseText
     * The string returned by the renderer when the column value is falsey (but not undefined).
     */
    falseText: 'false',
    /**
     * @cfg {String} undefinedText
     * The string returned by the renderer when the column value is undefined.
     */
    undefinedText: '&#160;',

    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        var t = this.trueText, f = this.falseText, u = this.undefinedText;
        this.renderer = function(v){
            if(v === undefined){
                return u;
            }
            if(!v || v === 'false'){
                return f;
            }
            return t;
        };
    }
});

/**
 * @class Ext.grid.NumberColumn
 * @extends Ext.grid.Column
 * <p>This class encapsulates column configuration data stored in a {@link Ext.grid.ColumnModel ColumnModel}.</p>
 * <p>This class renders a numeric data field according to a {@link #format} string.</p>
 */
Ext.grid.NumberColumn = Ext.extend(Ext.grid.Column, {
    /**
     * @cfg {String} format
     * A formatting string as used by {@link Ext.util.Format#number} to format a numeric value for this Column
     * (defaults to '0,000.00').
     */
    format : '0,000.00',
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        this.renderer = Ext.util.Format.numberRenderer(this.format);
    }
});

/**
 * @class Ext.grid.DateColumn
 * @extends Ext.grid.Column
 * <p>This class encapsulates column configuration data stored in a {@link Ext.grid.ColumnModel ColumnModel}.</p>
 * <p>This class renders a passed date according to the default locale, or a configured {@link #format}.</p>
 */
Ext.grid.DateColumn = Ext.extend(Ext.grid.Column, {
    /**
     * @cfg {String} format
     * A formatting string as used by {@link Date.format} to format a Date for this Column
     * (defaults to 'm/d/Y').
     */
    format : 'm/d/Y',
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        this.renderer = Ext.util.Format.dateRenderer(this.format);
    }
});

/**
 * @class Ext.grid.TemplateColumn
 * @extends Ext.grid.Column
 * <p>This class encapsulates column configuration data stored in a {@link Ext.grid.ColumnModel ColumnModel}.</p>
 * <p>This class renders a value by processing a {@link Ext.data.Record Record}'s {@link Ext.data.Record#data data}
 * using a {@link #tpl configured} {@link Ext.XTemplate XTemplate}.</p>
 */
Ext.grid.TemplateColumn = Ext.extend(Ext.grid.Column, {
    /**
     * @cfg {String/XTemplate} tpl
     * An {@link Ext.XTemplate XTemplate}, or an XTemplate <i>definition string</i> to use to process a {@link Ext.data.Record Record}'s
     * {@link Ext.data.Record#data data} to produce a colunm's rendered value.
     */
    constructor: function(cfg){
        this.supr().constructor.apply(this, arguments);
        var tpl = typeof this.tpl == 'object' ? this.tpl : new Ext.XTemplate(this.tpl);
        this.renderer = function(value, p, r){
            return tpl.apply(r.data);
        }
        this.tpl = tpl;
    }
});

/*
 * @property types
 * @type Object
 * @member Ext.grid.Column
 * @static
 * <p>An object containing predefined Column classes keyed by a mnemonic code which may be referenced
 * by the {@link Ext.grid.ColumnModel#xtype xtype} config option of ColumnModel.</p>
 * <p>This contains the following properties</p><div class="mdesc-details"><ul>
 * <li>gridcolumn : <b>{@link Ext.grid.Column Column constructor}</b></li>
 * <li>booleancolumn : <b>{@link Ext.grid.BooleanColumn BooleanColumn constructor}</b></li>
 * <li>numbercolumn : <b>{@link Ext.grid.NumberColumn NumberColumn constructor}</b></li>
 * <li>datecolumn : <b>{@link Ext.grid.DateColumn DateColumn constructor}</b></li>
 * <li>templatecolumn : <b>{@link Ext.grid.TemplateColumn TemplateColumn constructor}</b></li>
 * </ul></div>
 */
Ext.grid.Column.types = {
    gridcolumn : Ext.grid.Column,
    booleancolumn: Ext.grid.BooleanColumn,
    numbercolumn: Ext.grid.NumberColumn,
    datecolumn: Ext.grid.DateColumn,
    templatecolumn: Ext.grid.TemplateColumn
};
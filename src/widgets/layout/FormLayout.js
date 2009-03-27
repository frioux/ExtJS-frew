/**
 * @class Ext.layout.FormLayout
 * @extends Ext.layout.AnchorLayout
 * <p>This layout manager is specifically designed for rendering and managing child Components of forms.
 * It is responsible for rendering the labels of {@link Ext.form.Field Field}s.</p>
 * <p>This layout manager is used when a Container is configured with the <tt>layout:'form'</tt>
 * {@link Ext.Container#layout layout} config option, and should generally not need to be created directly
 * via the new keyword. See <tt><b>{@link Ext.Container#layout}</b></tt> for additional details.</p>
 * <p>In an application, it will usually be preferrable to use a {@link Ext.form.FormPanel FormPanel}
 * (which is configured with FormLayout as its layout class by default) since it also provides built-in
 * functionality for {@link Ext.form.BasicForm#doAction loading, validating and submitting} the form.</p>
 * <p>A {@link Ext.Container Container} <i>using</i> the FormLayout (ie, configured with <tt>layout:'form'</tt>
 * can also accept the following layout-specific config properties:</p><div class="mdetail-params"><ul>
 * <li><b><tt>hideLabels</tt></b>: (Boolean)<div class="sub-desc">True to hide field labels by default
 * (defaults to false)</div></li>
 * <li><b><tt>labelAlign</tt></b>: (String)<div class="sub-desc">The default label alignment.  See
 * <tt>{@link Ext.form.FormPanel}.{@link Ext.form.FormPanel#labelAlign labelAlign}</tt>.</div></li>
 * <li><b><tt>labelPad</tt></b>: (Number)<div class="sub-desc">The default padding in pixels for field
 * labels (defaults to 5).  <tt>labelPad</tt> only applies if <tt>labelWidth</tt> is also specified,
 * otherwise it will be ignored.</div></li>
 * <li><b><tt>labelWidth</tt></b>: (Number)<div class="sub-desc">The default width in pixels of field labels
 * (defaults to <tt>100</tt>). See <tt>{@link Ext.form.FormPanel}.{@link Ext.form.FormPanel#labelAlign labelAlign}</tt>.</div></li>
 * </ul></div></p>
 * <p>Since FormLayout descends from {@link Ext.layout.AnchorLayout AnchorLayout}, child items managed by a
 * FormLayout also accept the following as a config option.
 * <div class="mdetail-params"><ul>
 * <li><b><tt>{@link Ext.layout.AnchorLayout#anchor anchor}</tt></b>: (String)<div class="sub-desc">See
 * <b><tt>{@link Ext.layout.AnchorLayout#anchor anchor}</tt></b> for more details.</div></li></ul></div>
 * <p>Any type of Component can be added to a FormLayout, but items that inherit from {@link Ext.form.Field}
 * can also supply the following field-specific config properties:
 * <div class="mdetail-params"><ul>
 * <li><b><tt>clearCls</tt></b>: (String)<div class="sub-desc">The CSS class to apply to the special clearing div rendered directly after each
 * form field wrapper (defaults to 'x-form-clear-left')</div></li>
 * <li><b><tt>fieldLabel</tt></b>: (String)<div class="sub-desc">The text to display as the label for this field (defaults to '')</div></li>
 * <li><b><tt>hideLabel</tt></b>: (Boolean)<div class="sub-desc">True to hide the label and separator for this field (defaults to false).</div></li>
 * <li><b><tt>itemCls</tt></b>: (String)<div class="sub-desc">A CSS class to add to the div wrapper that contains this field label
 * and field element (the default class is 'x-form-item' and itemCls will be added to that).  If supplied,
 * itemCls at the field level will override the default itemCls supplied at the container level.</div></li>
 * <li><b><tt>labelSeparator</tt></b>: (String)<div class="sub-desc">The separator to display after the text of the label for this field
 * (defaults to a colon ':' or the layout's value for {@link #labelSeparator}).  To hide the separator use empty string ''.</div></li>
 * <li><b><tt>labelStyle</tt></b>: (String)<div class="sub-desc">A CSS style specification string to add to the field label for this field
 * (defaults to '' or the layout's value for {@link #labelStyle}).</div></li>
 * </ul></div></p>
 * Example usage:</p>
 * <pre><code>
// Required if showing validation messages
Ext.QuickTips.init();

// While you can create a basic Panel with layout:'form', practically
// you should usually use a FormPanel to also get its form functionality
// since it already creates a FormLayout internally.
var form = new Ext.form.FormPanel({
    title: 'Form Layout',
    bodyStyle:'padding:15px',
    width: 350,
    defaultType: 'textfield',
    defaults: {
        // applied to each contained item
        width: 230,
        msgTarget: 'side'
    },
    layoutConfig: {
        // layout-specific configs go here
        labelSeparator: ''
    },
    items: [{
            fieldLabel: 'First Name',
            name: 'first',
            allowBlank: false
        },{
            fieldLabel: 'Last Name',
            name: 'last'
        },{
            fieldLabel: 'Company',
            name: 'company'
        },{
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email'
        }, {
            xtype: 'textarea',
            hideLabel: true,
            name: 'msg',
            anchor: '100% -53'
        }
    ],
    buttons: [
        {text: 'Save'},
        {text: 'Cancel'}
    ],
    // additional config options when layout='form':
    hideLabels: false,
    labelAlign: '', // or 'top'
    labelWidth: 65, // defaults to 100
    labelPad: 8,    // defaults to 5, must specify labelWidth to be honored
});
</code></pre>
 */
Ext.layout.FormLayout = Ext.extend(Ext.layout.AnchorLayout, {
    /**
     * @cfg {String} labelSeparator
     * The standard separator to display after the text of each form label (defaults to a colon ':').  To turn off
     * separators for all fields in this layout by default specify empty string '' (if the labelSeparator value is
     * explicitly set at the field level, those will still be displayed).
     */
    labelSeparator : ':',

    /**
     * Read only. The CSS style specification string added to field labels in this layout if not otherwise specified
     * by each contained field.
     * @type String
     * @property labelStyle
     */

    // private
    setContainer : function(ct){
        Ext.layout.FormLayout.superclass.setContainer.call(this, ct);
        if(ct.labelAlign){
            ct.addClass('x-form-label-'+ct.labelAlign);
        }

        if(ct.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
            this.labelAdjust = 0;
        }else{
            this.labelSeparator = ct.labelSeparator || this.labelSeparator;
            ct.labelWidth = ct.labelWidth || 100;
            if(typeof ct.labelWidth == 'number'){
                var pad = (typeof ct.labelPad == 'number' ? ct.labelPad : 5);
                this.labelAdjust = ct.labelWidth+pad;
                this.labelStyle = "width:"+ct.labelWidth+"px;";
                this.elementStyle = "padding-left:"+(ct.labelWidth+pad)+'px';
            }
            if(ct.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.labelAdjust = 0;
                this.elementStyle = "padding-left:0;";
            }
        }
    },

    //private
    getLabelStyle: function(s){
        var ls = '', items = [this.labelStyle, s];
        for (var i = 0, len = items.length; i < len; ++i){
            if (items[i]){
                ls += items[i];
                if (ls.substr(-1, 1) != ';'){
                    ls += ';'
                }
            }
        }
        return ls;
    },

    /**
     * <p>Read-only. The <b>{@link Ext.Template#compile compile}d</b> {@link Ext.Template} for rendering
     * the fully wrapped, labeled and styled form Field which takes the following form:</p><pre><code>
var t = new Ext.Template(
    &#39;&lt;div class="x-form-item {itemCls}" tabIndex="-1">&#39;,
        &#39;&lt;&#108;abel for="{id}" style="{labelStyle}" class="x-form-item-&#108;abel">{&#108;abel}{labelSeparator}&lt;/&#108;abel>&#39;,
        &#39;&lt;div class="x-form-element" id="x-form-el-{id}" style="{elementStyle}">&#39;,
        &#39;&lt;/div>&lt;div class="{clearCls}">&lt;/div>&#39;,
    '&lt;/div>'
);
     * </code></pre>
     * <p>A description of the properties within the template follows:</p><div class="mdetail-params"><ul>
     * <li><b><tt>itemCls</tt></b> : String<div class="sub-desc">The CSS class applied to the outermost div wrapper
     * that contains this field label and field element (the default class is <tt>'x-form-item'</tt> and <tt>itemCls</tt>
     * will be added to that). If supplied, <tt>itemCls</tt> at the field level will override the default <tt>itemCls</tt>
     * supplied at the container level.</li>
     * <li><b><tt>id</tt></b> : String<div class="sub-desc">The id of the Field</li>
     * <li><b><tt>{@link #labelStyle}</tt></b> : String<div class="sub-desc">
     * A CSS style specification string to add to the field label for this field (defaults to <tt>''</tt> or the
     * {@link #labelStyle layout's value for <tt>labelStyle</tt>}).</li>
     * <li><b><tt>label</tt></b> : String<div class="sub-desc">The text to display as the label for this
     * field (defaults to <tt>''</tt>)</li>
     * <li><b><tt>{@link #labelSeparator}</tt></b> : String<div class="sub-desc">The separator to display after
     * the text of the label for this field (defaults to a colon <tt>':'</tt> or the
     * {@link #labelSeparator layout's value for labelSeparator}). To hide the separator use empty string ''.</li>
     * <li><b><tt>elementStyle</tt></b> : String<div class="sub-desc">The styles text for the input element's wrapper.</li>
     * <li><b><tt>clearCls</tt></b> : String<div class="sub-desc">The CSS class to apply to the special clearing div
     * rendered directly after each form field wrapper (defaults to <tt>'x-form-clear-left'</tt>)</li>
     * </ul></div>
     * <p>Also see <tt>{@link #getTemplateArgs}</tt></p>
     * @type Ext.Template
     * @property fieldTpl
     */

    // private
    renderItem : function(c, position, target){
        if(c && !c.rendered && (c.isFormField || c.fieldLabel) && c.inputType != 'hidden'){
            var args = this.getTemplateArgs(c);
            if(typeof position == 'number'){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                this.fieldTpl.insertBefore(position, args);
            }else{
                this.fieldTpl.append(target, args);
            }
            c.render('x-form-el-'+c.id);
        }else {
            Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    },

    /**
     * <p>Provides template arguments for rendering the fully wrapped, labeled and styled form Field.</p>
     * <p>This method returns an object hash containing properties used by the layout's {@link #fieldTpl}
     * to create a correctly wrapped, labeled and styled form Field. This may be overriden to
     * create custom layouts. The properties which must be returned are:</p><div class="mdetail-params"><ul>
     * <li><b><tt>itemCls</tt></b> : String<div class="sub-desc">The CSS class applied to the outermost div wrapper
     * that contains this field label and field element (the default class is <tt>'x-form-item'</tt> and <tt>itemCls</tt>
     * will be added to that). If supplied, <tt>itemCls</tt> at the field level will override the default <tt>itemCls</tt>
     * supplied at the container level.</li>
     * <li><b><tt>id</tt></b> : String<div class="sub-desc">The id of the Field</li>
     * <li><b><tt>{@link #labelStyle}</tt></b> : String<div class="sub-desc">
     * A CSS style specification string to add to the field label for this field (defaults to <tt>''</tt> or the
     * {@link #labelStyle layout's value for <tt>labelStyle</tt>}).</li>
     * <li><b><tt>label</tt></b> : String<div class="sub-desc">The text to display as the label for this
     * field (defaults to <tt>''</tt>)</li>
     * <li><b><tt>{@link #labelSeparator}</tt></b> : String<div class="sub-desc">The separator to display after
     * the text of the label for this field (defaults to a colon <tt>':'</tt> or the
     * {@link #labelSeparator layout's value for labelSeparator}). To hide the separator use empty string ''.</li>
     * <li><b><tt>elementStyle</tt></b> : String<div class="sub-desc">The styles text for the input element's wrapper.</li>
     * <li><b><tt>clearCls</tt></b> : String<div class="sub-desc">The CSS class to apply to the special clearing div
     * rendered directly after each form field wrapper (defaults to <tt>'x-form-clear-left'</tt>)</li>
     * </ul></div>
     * @param field The {@link Field Ext.form.Field} being rendered.
     * @return An object hash containing the properties required to render the Field.
     */
    getTemplateArgs: function(field) {
        var noLabelSep = !field.fieldLabel || field.hideLabel;
        return {
            id: field.id,
            label: field.fieldLabel,
            labelStyle: field.labelStyle||this.labelStyle||'',
            elementStyle: this.elementStyle||'',
            labelSeparator: noLabelSep ? '' : (typeof field.labelSeparator == 'undefined' ? this.labelSeparator : field.labelSeparator),
            itemCls: (field.itemCls||this.container.itemCls||'') + (field.hideLabel ? ' x-hide-label' : ''),
            clearCls: field.clearCls || 'x-form-clear-left' 
        };
    },
	
    // private
    adjustWidthAnchor : function(value, comp){
        return value - (comp.isFormField || comp.fieldLabel  ? (comp.hideLabel ? 0 : this.labelAdjust) : 0);
    },

    // private
    isValidParent : function(c, target){
        return true;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['form'] = Ext.layout.FormLayout;
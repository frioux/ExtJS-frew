/**
 * @class Ext.form.Form
 * @extends Ext.form.BasicForm
 * Adds the ability to dynamically render forms with JS to {@link Ext.form.BasicForm}.
 * @constructor
 * @param {Object} config Configuration options
 */
Ext.form.Form = function(config){
    Ext.form.Form.superclass.constructor.call(this, null, config);
    this.url = this.url || this.action;
    if(!this.root){
        this.root = new Ext.form.Layout(Ext.applyIf({
            id: Ext.id()
        }, config));
    }
    this.active = this.root;
    /**
     * Array of all the buttons that have been added to this form via addButton
     * @type Array
     */
    this.buttons = [];
};

Ext.extend(Ext.form.Form, Ext.form.BasicForm, {
    /**
     * @cfg {Number} labelWidth The width of labels. This property cascades to child containers.
     */
    /**
     * @cfg {String} itemCls A css class to apply to the x-form-item of fields. This property cascades to child containers.
     */
    /*
     * unused
     */
    buttonPosition:'bottom',
    /**
     * @cfg {String} buttonAlign Valid values are "left," "center" and "right" (defaults to "center")
     */
    buttonAlign:'center',

    /**
     * @cfg {Number} minButtonWidth Minimum width of all buttons (defaults to 75)
     */
    minButtonWidth:75,

    /**
     * @cfg {String} labelAlign Valid values are "left," "top" and "right" (defaults to "left").
     * This property cascades to child containers if not set.
     */
    labelAlign:'left',

    /**
     * Opens the a new {@link Ext.form.Column} container in the layout stack. If fields are passed after the config, the
     * fields are added and the column is closed. If no fields are passed the column remains open
     * until end() is called.
     * @param {Object} config The config to pass to the column
     * @param {Field} field1 (optional)
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return Column The column container object
     */
    column : function(c){
        var col = new Ext.form.Column(c);
        this.start(col);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return col;
    },

    /**
     * Opens the a new {@link Ext.form.FieldSet} container in the layout stack. If fields are passed after the config, the
     * fields are added and the fieldset is closed. If no fields are passed the fieldset remains open
     * until end() is called.
     * @param {Object} config The config to pass to the fieldset
     * @param {Field} field1 (optional)
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return FieldSet The fieldset container object
     */
    fieldset : function(c){
        var fs = new Ext.form.FieldSet(c);
        this.start(fs);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return fs;
    },

    /**
     * Opens the a new {@link Ext.form.Layout} container in the layout stack. If fields are passed after the config, the
     * fields are added and the container is closed. If no fields are passed the container remains open
     * until end() is called.
     * @param {Object} config The config to pass to the Layout
     * @param {Field} field1 (optional)
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return Layout The container object
     */
    container : function(c){
        var l = new Ext.form.Layout(c);
        this.start(l);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return l;
    },

    /**
     * Opens the passed container in the layout stack. The container can be any {@link Ext.form.Layout} or subclass.
     * @param {Object} container A Ext.form.Layout or subclass of Layout
     * @return {Form} this
     */
    start : function(c){
        // cascade label info
        Ext.applyIf(c, {'labelAlign': this.active.labelAlign, 'labelWidth': this.active.labelWidth, 'itemCls': this.active.itemCls});
        this.active.stack.push(c);
        c.ownerCt = this.active;
        this.active = c;
        return this;
    },

    /**
     * Closes the current open container
     * @return {Form} this
     */
    end : function(){
        if(this.active == this.root){
            return this;
        }
        this.active = this.active.ownerCt;
        return this;
    },

    /**
     * Add Ext.form components to the current open container (e.g. column, fieldset, etc)
     * @param {Field} field1
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return {Form} this
     */
    add : function(){
        this.active.stack.push.apply(this.active.stack, arguments);
        var r = [];
        for(var i = 0, a = arguments, len = a.length; i < len; i++) {
            if(a[i].isFormField){
                r.push(a[i]);
            }
        }
        if(r.length > 0){
            Ext.form.Form.superclass.add.apply(this, r);
        }
        return this;
    },

    /**
     * Render this form into the passed container. This should only be called once!
     * @param {String/HTMLElement/Element} container The element this component should be rendered into
     * @return {Form} this
     */
    render : function(ct){
        ct = Ext.get(ct);
        var o = this.autoCreate || {
            tag: 'form',
            method : this.method || 'POST',
            id : this.id || Ext.id()
        };
        this.initEl(ct.createChild(o));

        this.root.render(this.el);

        this.items.each(function(f){
            f.render('x-form-el-'+f.id);
        });

        if(this.buttons.length > 0){
            // tables are required to maintain order and for correct IE layout
            var tb = this.el.createChild({cls:'x-form-btns-ct', cn: {
                cls:"x-form-btns x-form-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }}, null, true);
            var tr = tb.getElementsByTagName('tr')[0];
            for(var i = 0, len = this.buttons.length; i < len; i++) {
                var b = this.buttons[i];
                var td = document.createElement('td');
                td.className = 'x-form-btn-td';
                b.render(tr.appendChild(td));
            }
        }
        return this;
    },

    /**
     * Adds a button to the footer of the form - this <b>must</b> be called before the form is rendered.
     * @param {String/Object} config A string becomes the button text, an object can either be a Button config
     * object or a valid Ext.DomHelper element config
     * @param {Function} handler The function called when the button is clicked
     * @param {Object} scope (optional) The scope of the handler function
     * @return {Ext.Button}
     */
    addButton : function(config, handler, scope){
        var bc = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bc.text = config;
        }else{
            Ext.apply(bc, config);
        }
        var btn = new Ext.Button(null, bc);
        this.buttons.push(btn);
        return btn;
    }
});


// back compat
Ext.Form = Ext.form.Form;


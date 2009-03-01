Ext.ux.RowEditor = Ext.extend(Ext.Panel, {
    floating: true,
    shadow: false,
    layout: 'hbox',
    cls: 'x-small-editor',
    buttonAlign: 'center',
    baseCls: 'x-row-editor',
    elements: 'header,footer,body',
    frameWidth: 5,
    buttonPad: 3,
    clicksToEdit: 'auto',
    monitorValid: true,
    focusDelay: 250,

    defaults: {
        normalWidth: true
    },

    initComponent: function(){
        Ext.ux.RowEditor.superclass.initComponent.call(this);
        this.addEvents('beforeedit', 'validateedit', 'afteredit');
    },

    init: function(grid){
        this.grid = grid;
        this.ownerCt = grid;
        if(this.clicksToEdit == 2){
            this.grid.on('rowdblclick', this.onRowDblClick, this);
        }else{
            this.grid.on('rowclick', this.onRowClick, this);
        }
        this.grid.on('keydown', this.onGridKey, this);
        this.grid.on('columnresize', this.verifyLayout, this);
        this.grid.on('columnmove', this.onColumnMove, this);
        this.grid.on('bodyscroll', this.positionButtons, this, {buffer: 250});
        this.grid.getColumnModel().on('hiddenchange', this.verifyLayout, this, {delay:1});
        var view = grid.getView();
        view.on('refresh', this.stopEditing.createDelegate(this, []));
    },

    onColumnMove: function(){
        this.initFields();
        this.verifyLayout();
    },

    startEditing: function(rowIndex, doFocus){
        if(typeof rowIndex == 'object'){
            rowIndex = this.grid.getStore().indexOf(rowIndex);
        }
        if(this.fireEvent('beforedit', this, rowIndex) !== false){
            var g = this.grid, view = g.getView();
            var row = view.getRow(rowIndex);
            var record = g.store.getAt(rowIndex);
            this.record = record;
            this.rowIndex = rowIndex;
            if(!this.rendered){
                this.render(view.getEditorParent());
            }
            var w = Ext.fly(row).getWidth();
            this.setSize(w);
            if(!this.initialized){
                this.initFields();
            }
            var cm = g.colModel, fields = this.items.items;
            for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                fields[i].setValue(this.preEditValue(record, cm.getDataIndex(i)));
            }
            this.verifyLayout(true);
            if(!this.isVisible()){
                this.setPagePosition(Ext.fly(row).getXY());
            } else{
                this.el.setXY(Ext.fly(row).getXY(), {duration:.15});
            }
            if(!this.isVisible()){
                this.show();
                if(Ext.isIE){
                    this.doLayout();
                }
            }
            if(doFocus !== false){
                this.doFocus.defer(this.focusDelay, this);
            }
        }
    },

    stopEditing : function(saveChanges){
        if(!this.isVisible()){
            return;
        }
        if(saveChanges === false || !this.isValid()){
            this.hide();
            return;
        }
        var changes = {}, r = this.record, hasChange = false;
        var cm = this.grid.colModel, fields = this.items.items;
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            if(!cm.isHidden(i)){
                var dindex = cm.getDataIndex(i);
                var oldValue = r.data[dindex];
                var value = this.postEditValue(fields[i].getValue(), oldValue, r, dindex);
                if(String(oldValue) !== String(value)){
                    changes[dindex] = value;
                    hasChange = true;
                }
            }
        }
        if(hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false){
            r.beginEdit();
            for(var k in changes){
                if(changes.hasOwnProperty(k)){
                    r.set(k, changes[k]);
                }
            }
            r.endEdit();
            this.fireEvent('afteredit', this, changes, r, this.rowIndex)
        }
        this.hide();
    },

    verifyLayout: function(force){
        if(this.el && (this.isVisible() || force === true)){
            var row = this.grid.getView().getRow(this.rowIndex);
            this.setSize(Ext.fly(row).getWidth());
            var cm = this.grid.colModel, fields = this.items.items;
            for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                if(!cm.isHidden(i)){
                    var adjust = 0;
                    if(i == 0){
                        adjust += 0; // outer padding
                    }
                    if(i == (len - 1)){
                        adjust += 3; // outer padding
                    } else{
                        adjust += 1;
                    }
                    fields[i].show();
                    fields[i].setWidth(cm.getColumnWidth(i) - adjust);
                } else{
                    fields[i].hide();
                }
            }
            this.doLayout();
            this.positionButtons();
        }
    },

    slideHide : function(){
        this.hide();
    },

    initFields: function(){
        var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            var c = cm.getColumnAt(i);
            var ed = c.getEditor();
            if(!ed){
                ed = c.displayEditor || new Ext.form.DisplayField();
            }
            if(i == 0){
                ed.margins = pm('0 1 2 1');
            } else if(i == len - 1){
                ed.margins = pm('0 0 2 1');
            } else{
                ed.margins = pm('0 1 2');
            }
            ed.setWidth(cm.getColumnWidth(i));
            ed.column = c;
            if(ed.ownerCt != this){
                ed.on('focus', this.ensureVisible, this);
                ed.on('specialkey', this.onKey, this);
            }
            this.insert(i, ed);
        }
        this.initialized = true;
    },

    onKey: function(f, e){
        if(e.getKey() == e.ENTER){
            this.stopEditing(true);
            e.stopPropagation();
        }
    },

    onGridKey: function(e){
        if(e.getKey() == e.ENTER && !this.isVisible()){
            var r = this.grid.getSelectionModel().getSelected();
            if(r){
                var index = this.grid.store.indexOf(r);
                this.startEditing(index);
                e.stopPropagation();
            }
        }
    },

    ensureVisible: function(editor){
        if(this.isVisible()){
             this.grid.getView().ensureVisible(this.rowIndex, this.grid.colModel.getIndexById(editor.column.id), true);
        }
    },

    onRowClick: function(g, rowIndex, e){
        if(this.clicksToEdit == 'auto'){
            var li = this.lastClickIndex;
            this.lastClickIndex = rowIndex;
            if(li != rowIndex && !this.isVisible()){
                return;
            }
        }
        this.startEditing(rowIndex, false);
        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
    },

    onRowDblClick: function(g, rowIndex, e){
        this.startEditing(rowIndex, false);
        this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
    },

    onRender: function(){
        Ext.ux.RowEditor.superclass.onRender.apply(this, arguments);
        this.el.swallowEvent(['keydown', 'keyup', 'keypress']);
        this.btns = new Ext.Panel({
            baseCls: 'x-plain',
            cls: 'x-btns',
            elements:'body',
            layout: 'table',
            width: (this.minButtonWidth * 2) + (this.frameWidth * 2) + (this.buttonPad * 4), // width must be specified for IE
            items: [{
                ref: 'saveBtn',
                itemId: 'saveBtn',
                xtype: 'button',
                text: this.saveText || 'Save',
                width: this.minButtonWidth,
                handler: this.stopEditing.createDelegate(this, [true])
            }, {
                xtype: 'button',
                text: this.cancelText || 'Cancel',
                width: this.minButtonWidth,
                handler: this.stopEditing.createDelegate(this, [false])
            }]
        });
        this.btns.render(this.bwrap);
    },

    afterRender: function(){
        Ext.ux.RowEditor.superclass.afterRender.apply(this, arguments);
        this.positionButtons();
    },

    onShow: function(){
        Ext.ux.RowEditor.superclass.onShow.apply(this, arguments);
        if(this.monitorValid){
            this.startMonitoring();
        }
    },

    onHide: function(){
        Ext.ux.RowEditor.superclass.onHide.apply(this, arguments);
        this.stopMonitoring();
        this.grid.getView().focusRow(this.rowIndex);
    },

    positionButtons: function(){
        if(this.btns){
            var h = this.el.dom.clientHeight;
            var view = this.grid.getView();
            var scroll = view.scroller.dom.scrollLeft;
            var width =  view.mainBody.getWidth();
            var bw = this.btns.getWidth();
            this.btns.el.shift({left: (width/2)-(bw/2)+scroll, top: h - 2, stopFx: true, duration:.2});
        }
    },

    // private
    preEditValue : function(r, field){
        var value = r.data[field];
        return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlDecode(value) : value;
    },

    // private
	postEditValue : function(value, originalValue, r, field){
		return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
	},

    doFocus: function(pt){
        if(this.isVisible()){
            var index = 0;
            if(pt){
                index = this.getTargetColumnIndex(pt);
            }
            var cm = this.grid.getColumnModel();
            for(var i = index||0, len = cm.getColumnCount(); i < len; i++){
                var c = cm.getColumnAt(i);
                if(!c.hidden && c.getEditor()){
                    c.getEditor().focus();
                    break;
                }
            }
        }
    },

	getTargetColumnIndex: function(pt){
		var grid = this.grid, v = grid.view;
        var x = pt.left;
        var cms = grid.colModel.config;
        var i = 0, match = false;
        for(var len = cms.length, c; c = cms[i]; i++){
            if(!c.hidden){
                if(Ext.fly(v.getHeaderCell(i)).getRegion().right >= x){
                    match = i;
                    break;
                }
            }
        }
        return match;
	},

    startMonitoring : function(){
        if(!this.bound && this.monitorValid){
            this.bound = true;
            Ext.TaskMgr.start({
                run : this.bindHandler,
                interval : this.monitorPoll || 200,
                scope: this
            });
        }
    },

    stopMonitoring : function(){
        this.bound = false;
    },

    isValid: function(){
        var valid = true;
        this.items.each(function(f){
            if(!f.isValid(true)){
                valid = false;
                return false;
            }
        });
        return valid;
    },

    // private
    bindHandler : function(){
        if(!this.bound){
            return false; // stops binding
        }
        var valid = this.isValid();
        this.btns.saveBtn.setDisabled(!valid);
        this.fireEvent('validation', this, valid);
    }


});
Ext.preg('roweditor', Ext.ux.RowEditor);

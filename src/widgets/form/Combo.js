Ext.form.ComboBox = function(config){
    Ext.form.ComboBox.superclass.constructor.call(this, config);
    this.addEvents({
        'expand' : true,
        'collapse' : true,
        'beforeselect' : true,
        'select' : true
    });
    this.selectedIndex = -1;
    if(this.mode == 'local'){
        if(config.queryDelay === undefined){
            this.queryDelay = 250;
        }
        if(config.minChars === undefined){
            this.minChars = 0;
        }
    }
};

Ext.extend(Ext.form.ComboBox, Ext.form.TriggerField, {
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},
    listWidth: undefined,
    listClass: 'x-combo-list',
    selectedClass: 'x-combo-selected',
    triggerClass : 'x-form-arrow-trigger',
    shadow:'sides',
    listAlign: 'tl-bl',
    maxHeight: 300,
    triggerAction: 'query', // can also be 'all'
    minChars : 4,
    typeAhead: true,
    queryDelay: 500,
    pageSize: 0,
    selectOnFocus:false,
    queryParam: 'query',
    loadingText: 'Loading...',
    resizable: false,
    handleHeight : 8,
    editable: true,
    allQuery: '',
    mode: 'remote',

    onRender : function(ct){
        Ext.form.ComboBox.superclass.onRender.call(this, ct);

        if(Ext.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }
        var cls = this.listClass;

        this.list = new Ext.Layer({
            shadow: this.shadow, cls: cls, constrain:false
        });

        this.list.setWidth(this.listWidth || this.wrap.getWidth());

        this.assetHeight = 0;

        if(this.title){
            this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
            this.assetHeight += this.header.getHeight();
        }

        this.innerList = this.list.createChild({cls:cls+'-inner'});
        this.innerList.on('mouseover', this.onViewOver, this);
        this.innerList.on('mousemove', this.onViewMove, this);

        if(this.pageSize){
            this.footer = this.list.createChild({cls:cls+'-ft'});
            this.pageTb = new Ext.PagingToolbar(this.footer, this.store,
                    {pageSize: this.pageSize});
            this.assetHeight += this.footer.getHeight();
        }

        if(!this.tpl){
            this.tpl = '<div class="'+cls+'-item">{' + this.displayField + '}</div>';
        }

        this.view = new Ext.View(this.innerList, this.tpl, {
            singleSelect:true, store: this.store, selectedClass: this.selectedClass
        });

        this.view.on('click', this.onViewClick, this);

        this.store.on('beforeload', this.onBeforeLoad, this);
        this.store.on('load', this.onLoad, this);

        if(this.resizable){
            this.resizer = new Ext.Resizable(this.list,  {
               pinned:true, handles:'se'
            });
            this.resizer.on('resize', function(r, w, h){
                this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                this.restrictHeight();
            }, this);
            this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
        }
        if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
    },

    setEditable : function(value){
        if(value == this.editable){
            return;
        }
        if(!value){
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTriggerClick,  this);
            this.el.addClass('x-combo-noedit');
        }else{
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTriggerClick,  this);
            this.el.removeClass('x-combo-noedit');
        }
    },

    onBeforeLoad : function(){
        this.innerList.update(this.loadingText ?
               '<div class="loading-indicator">'+this.loadingText+'</div>' : '');
        this.restrictHeight();
        this.selectedIndex = -1;
    },

    onLoad : function(){
        if(this.store.getCount() > 0){
            this.expand();
            this.restrictHeight();
            this.selectNext();
            if(this.typeAhead){
                var r = this.store.getAt(0);
                var selStart = this.getRawValue().length;
                this.setValue(r.data[this.displayField]);
                this.selectText(selStart);
            }
        }else{
            this.onEmptyResults();
        }
        this.el.focus();
    },

    onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setValue(record.data[this.displayField]);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },

    onViewMove : function(e, t){
        this.inKeyMode = false;
    },

    onViewOver : function(e, t){
        if(this.inKeyMode){ // prevent key nav and mouse over conflicts
            return;
        }
        var item = this.view.findItemFromChild(t);
        if(item){
            var index = this.view.indexOf(item);
            this.select(index, false);
        }
    },

    onViewClick : function(doFocus){
        var index = this.view.getSelectedIndexes()[0];
        var r = this.store.getAt(index);
        if(r){
            this.onSelect(r, index);
        }
        if(doFocus !== false){
            this.el.focus();
        }
    },

    restrictHeight : function(){
        var inner = this.innerList.dom;
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        this.innerList.setHeight(h < this.maxHeight ? 'auto' : this.maxHeight);
        if(Ext.isIE){
            this.list.setHeight(this.innerList.getHeight()+(this.resizable?this.handleHeight:0)+this.assetHeight);
        }
        this.list.sync();
    },

    onEmptyResults : function(){
        this.collapse();
    },

    isExpanded : function(){
        return this.list.isVisible();
    },

    initEvents : function(){
        Ext.form.ComboBox.superclass.initEvents.call(this);

        this.keyNav = new Ext.KeyNav(this.el, {
            "up" : function(e){
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e){
                if(!this.isExpanded()){
                    this.onTriggerClick();
                }else{
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },

            "enter" : function(e){
                this.onViewClick();
            },

            "esc" : function(e){
                this.collapse();
            },

            scope : this,

            doRelay : function(foo, bar, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                   Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                }
            }
        });
        this.el.on("keypress", this.onKeyPress, this, {buffer:this.queryDelay});
    },

    select : function(index, scrollIntoView){
        this.selectedIndex = index;
        this.view.select(index);
        if(scrollIntoView !== false){
            this.innerList.scrollChildIntoView(this.view.getNode(index));
        }
    },

    selectNext : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex < ct-1){
                this.select(this.selectedIndex+1);
            }
        }
    },

    selectPrev : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex != 0){
                this.select(this.selectedIndex-1);
            }
        }
    },

    onKeyPress : function(e){
        if(!e.isNavKeyPress()){
            this.doQuery(this.getRawValue());
        }
    },

    validateBlur : function(){
        return !this.list || !this.list.isVisible();   
    },

    doQuery : function(q, forceAll){
        if(q === undefined || q === null){
            q = '';
        }
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery != q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.store.filter(this.displayField, q);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                }
            }
            this.expand();
        }
    },

    getParams : function(q){
        var p = {};
        //p[this.queryParam] = q;
        if(this.pageSize){
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    },

    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Ext.get(document).un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },

    expand : function(){
        if(this.isExpanded()){
            return;
        }
        this.list.alignTo(this.el, this.listAlign);
        this.list.show();
        Ext.get(document).on('mousedown', this.collapseIf, this);
        this.fireEvent('expand', this);
    },

    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        this.doQuery(this.triggerAction == 'all' ?
                     this.doQuery(this.allQuery, true) : this.doQuery(this.getRawValue()));
        this.el.focus();
    }
});
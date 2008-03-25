/*
 * TODO column resize plugin, header click plugin for sorting
 */
Ext.ListView = Ext.extend(Ext.DataView, {
    itemSelector: 'dl',
    selectedClass:'x-list-selected',
    overClass:'x-list-over',
    scrollOffset : 19,
    reserveScrollOffset : false,

    initComponent : function(){
        if(!this.internalTpl){
            this.internalTpl = new Ext.XTemplate(
                '<div class="x-list-header"><div class="x-list-header-inner">',
                    '<tpl for="columns">',
                    '<div style="width:{width};"><em unselectable="on" id="',this.id, '-xlhd-{#}">',
                        '{header}',
                    '</em></div>',
                    '</tpl>',
                    '<div class="x-clear"></div>',
                '</div></div>',
                '<div class="x-list-body"><div class="x-list-body-inner">',
                '</div></div>'
            );
        }
        if(!this.tpl){
            this.tpl = new Ext.XTemplate(
                '<tpl for="rows">',
                    '<dl>',
                        '<tpl for="parent.columns">',
                        '<dt style="width:{width};"><em unselectable="on">',
                            '{[values.tpl.apply(parent)]}',
                        '</em></dt>',
                        '</tpl>',
                        '<div class="x-clear"></div>',
                    '</dl>',
                '</tpl>'
            );
        };

        for(var i = 0, len = this.columns.length; i < len; i++){
            var c = this.columns[i];
            if(!c.tpl){
                c.tpl = new Ext.XTemplate('{' + c.dataIndex + '}');
            }else if(typeof c.tpl == 'string'){
                c.tpl = new Ext.XTemplate(c.tpl);
            }
        }
        Ext.ListView.superclass.initComponent.call(this);
    },

    onRender : function(){
        if(!this.el){
            this.el = document.createElement('div');
            this.el.id = this.id;
            this.internalTpl.overwrite(this.el, {columns: this.columns});
        }
        Ext.DataView.superclass.onRender.apply(this, arguments);

        this.innerBody = Ext.get(this.el.dom.childNodes[1].firstChild);
        this.innerHd = Ext.get(this.el.dom.firstChild.firstChild);
    },

    getTemplateTarget : function(){
        return this.innerBody;
    },

    collectData : function(){
        var rs = Ext.ListView.superclass.collectData.apply(this, arguments);
        return {
            columns: this.columns,
            rows: rs
        }
    },

    verifyInternalSize : function(){
        if(this.lastSize){
            this.onResize(this.lastSize.width, this.lastSize.height);
        }
    },

    // private
    onResize : function(w, h){
        var bd = this.innerBody.dom;
        var hd = this.innerHd.dom
        if(!bd){
            return;
        }
        var bdp = bd.parentNode;
        if(typeof w == 'number'){
            var sw = w - this.scrollOffset;
            if(this.reserveScrollOffset || ((bdp.offsetWidth - bdp.clientWidth) > 10)){
                bd.style.width = sw + 'px';
                hd.style.width = sw + 'px';
            }else{
                bd.style.width = w + 'px';
                hd.style.width = w + 'px';
                setTimeout(function(){
                    if((bdp.offsetWidth - bdp.clientWidth) > 10){
                        bd.style.width = sw + 'px';
                        hd.style.width = sw + 'px';
                    }
                }, 10);
            }
        }
        if(typeof h == 'number'){
            bdp.style.height = (h - hd.parentNode.offsetHeight) + 'px';
        }
    },

    updateIndexes : function(){
        Ext.ListView.superclass.updateIndexes.apply(this, arguments);
        this.verifyInternalSize();
    }
});
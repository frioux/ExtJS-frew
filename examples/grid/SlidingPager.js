Ext.ux.SlidingPager = Ext.extend(Ext.util.Observable, {
    init : function(pbar){
        this.pagingBar = pbar;

        pbar.on('afterlayout', this.onLayout, this, {single: true});
        pbar.on('beforedestroy', this.onDestroy, this);
    },

    onLayout : function(pbar){
        Ext.each(pbar.items.getRange(2,6), function(c){
            c.hide();
        });
        var el = Ext.getBody().createChild({tag: 'div', style: 'padding-top: 2px;'});
        var item = new Ext.Toolbar.Item({el: el});
        pbar.insert(5, item);
        pbar.doLayout();

        this.slider = new Ext.Slider({
            renderTo: el,
            width: 114,
            minValue: 1,
            maxValue: 1,
            plugins:new Ext.ux.SliderTip({
                bodyStyle:'padding:5px;',
                getText : function(s){
                    return String.format('Page <b>{0}</b> of <b>{1}</b>', s.value, s.maxValue);
                }
            })
        });

        this.slider.on('changecomplete', function(s, v){
            pbar.changePage(v);
        });

        pbar.on('change', function(pb, data){
            this.slider.maxValue = data.pages;
            this.slider.setValue(data.activePage);
        }, this);
    },

    onDestroy : function(){
        this.slider.destroy();
    }
});
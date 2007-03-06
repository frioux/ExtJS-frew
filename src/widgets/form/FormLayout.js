Ext.form.Layout = function(el, config){
    this.el = Ext.get(el);
    Ext.apply(this, config);
    this.addEvents({
        layout:true
    });
};

Ext.extend(Ext.form.Layout, Ext.util.Observable, {
    init : function(){
        var nodes = this.el.query('.x-form-item');
        this.items = new Ext.MixedCollection();
        for(var i = 0, len = nodes.length; i < len; i++){
            this.items.add(new Ext.form.LayoutItem(nodes[i]));
        }
    }
});

Ext.form.LayoutItem = function(el){
    this.el = new Ext.Element(el);
    this.id = this.el.id;
    this.labl = el.child('> label');
    this.element = el.child('> div.x-form-element');
};

Ext.form.LayoutItem.prototype = {
    autoSize : function(){
        this.el.setHeight(
                Math.max(this.labl.getComputedHeight(), this.element.getComputedHeight())
                + this.el.getFrameWidth('tb'));
    }
};
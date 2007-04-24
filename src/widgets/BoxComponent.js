Ext.BoxComponent = function(config){
    Ext.BoxComponent.superclass.constructor.call(this, config);
    this.addEvents({
        resize : true,
        move : true
    });
};

Ext.extend(Ext.BoxComponent, Ext.Component, {
    boxReady : false,

    // private, used to defer height settings to subclasses
    deferHeight: false,

    setSize : function(w, h){
        if(!this.boxReady){
            this.width = w;
            this.height = h;
            return;
        }
        var adj = this.adjustSize(w, h);
        var aw = adj.width, ah = adj.height;
        if(aw !== undefined || ah !== undefined){ // this code is nasty but performs better with floaters
            var rz = this.getResizeEl();
            if(!this.deferHeight && aw !== undefined && ah !== undefined){
                rz.setSize(aw, ah);
            }else if(!this.deferHeight && ah !== undefined){
                rz.setHeight(ah);
            }else if(aw !== undefined){
                rz.setWidth(aw);
            }
            this.onResize(aw, ah, w, h);
            this.fireEvent('resize', this, aw, ah, w, h);
        }
        return this;
    },

    getSize : function(){
        return this.el.getSize();
    },

    getPosition : function(local){
        if(local === true){
            return [this.el.getLeft(true), this.el.getTop(true)];
        }
        return this.el.getXY();
    },

    getBox : function(local){
        return this.el.getBox(false, local);
    },

    getRegion : function(){
        return this.el.getRegion();
    },

    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
    },

    getResizeEl : function(){
        return this.resizeEl || this.el;
    },

    setPosition : function(x, y){
        if(!this.boxReady){
            this.x = x;
            this.y = y;
            return;
        }
        var adj = this.adjustPosition(x, y);
        var ax = adj.x, ay = adj.y;

        if(ax !== undefined || ay !== undefined){
            if(ax !== undefined && ay !== undefined){
                this.el.setLeftTop(ax, ay);
            }else if(ax !== undefined){
                this.el.setLeft(ax);
            }else if(ay !== undefined){
                this.el.setTop(ay);
            }
            this.onPosition(ax, ay);
            this.fireEvent('move', this, ax, ay);
        }
        return this;
    },

    setPagePosition : function(x, y){
        if(!this.boxReady){
            this.pageX = x;
            this.pageY = y;
            return;
        }
        if(x === undefined || y === undefined){ // cannot translate undefined points
            return;
        }
        var p = this.el.translatePoints(x, y);
        this.setPosition(p.left, p.top);
        return this;
    },

    onRender : function(ct){
        Ext.BoxComponent.superclass.onRender.call(this, ct);
        if(this.resizeEl){
            this.resizeEl = Ext.get(this.resizeEl);
        }
    },

    afterRender : function(){
        Ext.BoxComponent.superclass.afterRender.call(this);
        this.boxReady = true;
        this.setSize(this.width, this.height);
        this.setPosition(this.x, this.y);
        if(this.pageX || this.pageY){
            this.setPagePosition(this.pageX, this.pageY);
        }
    },

    syncSize : function(){
        this.setSize(this.el.getWidth(), this.el.getHeight());
    },

    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){

    },

    onPosition : function(x, y){

    },

    adjustSize : function(w, h){
        if(this.autoWidth){
            w = 'auto';
        }
        if(this.autoHeight){
            h = 'auto';
        }
        return {width : w, height: h};
    },

    adjustPosition : function(x, y){
        return {x : x, y: y};
    }
});
Ext.BoxComponent = function(config){
    Ext.BoxComponent.superclass.constructor.call(this, config);
    this.addEvents({
        resize : true,
        move : true
    });
};

Ext.extend(Ext.BoxComponent, Ext.Component, {
    boxReady : false,

    setSize : function(w, h){
        if(!this.boxReady){
            this.width = w;
            this.height = h;
            return;
        }
        var adj = this.adjustSize(w, h);
        var aw = adj.width, ah = adj.height;
        if(aw !== undefined || ah !== undefined){
            if(aw !== undefined){
                this.getResizeEl().setWidth(aw);
            }
            if(ah !== undefined){
                this.getResizeEl().setHeight(ah);
            }
            this.onResize(aw, ah, w, h);
            this.fireEvent('resize', this, aw, ah, w, h);
        }
        return this;
    },

    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
    },

    getResizeEl : function(){
        // TODO initialize resizeEl to an Element
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
            if(ax !== undefined){
                this.el.setLeft(ax);
            }
            if(ay !== undefined){
                this.el.setTop(ay);
            }
            this.fireEvent('move', this, ax, ay, x, y);
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
        var xy = this.el.translatePoints(x, y);
        this.setPosition(xy[0], xy[1]);
        return this;
    },

    onRender : function(ct){
        Ext.BoxComponent.superclass.onRender.call(this, ct);
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

    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){

    },

    adjustSize : function(w, h){
        if(this.autoWidth){
            w = undefined;
        }
        if(this.autoHeight){
            h = undefined;
        }
        return {width : w, height: h};
    },

    adjustPosition : function(x, y){
        return {x : x, y: y};
    }
});
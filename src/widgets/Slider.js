Ext.Slider = Ext.extend(Ext.BoxComponent, {
    vertical: false,
    minValue: 0,
    maxValue: 100,
    keyIncrement: 1,
    increment: 0,
    clickRange: [5,15],
    clickToChange : true,
    animate: true,

    initComponent : function(){
        if(this.value === undefined){
            this.value = this.minValue;
        }
        Ext.Slider.superclass.initComponent.call(this);
        this.keyIncrement = Math.max(this.increment, this.keyIncrement); 
        this.addEvents('beforechange', 'change', 'startdrag', 'drag', 'enddrag');

        if(this.vertical){
            Ext.apply(this, Ext.Slider.Vertical);
        }
    },

    onRender : function(){
        this.autoEl = {
            cls: 'x-slider ' + (this.vertical ? 'x-slider-vert' : 'x-slider-horz'),
            cn:{cls:'x-slider-end',cn:{cls:'x-slider-inner',cn:[{cls:'x-slider-thumb'},{tag:'a', cls:'x-slider-focus', href:"#", tabIndex: '-1'}]}}
        };
        Ext.Slider.superclass.onRender.apply(this, arguments);
        this.endEl = this.el.first();
        this.innerEl = this.endEl.first();
        this.thumb = this.innerEl.first();
        this.halfThumb = (this.vertical ? this.thumb.getHeight() : this.thumb.getWidth())/2;
        this.focusEl = this.thumb.next();
        this.initEvents();
    },

    initEvents : function(){
        this.thumb.addClassOnOver('x-slider-thumb-over');
        this.mon(this.el, 'mousedown', this.onMouseDown, this);
        this.mon(this.el, 'keydown', this.onKeyDown, this);

        this.tracker = new Ext.dd.DragTracker({
            onBeforeStart: this.onBeforeDragStart.createDelegate(this),
            onStart: this.onDragStart.createDelegate(this),
            onDrag: this.onDrag.createDelegate(this),
            onEnd: this.onDragEnd.createDelegate(this),
            tolerance: 3,
            autoStart: 300
        });
        this.tracker.initEl(this.thumb);
        this.on('beforedestroy', this.tracker.destroy, this.tracker);
    },

    onMouseDown : function(e){
        if(this.disabled) {return;}
        if(this.clickToChange && e.target != this.thumb.dom){
            var local = this.innerEl.translatePoints(e.getXY());
            this.onClickChange(local);
        }
        this.focus();
    },

    onClickChange : function(local){
        if(local.top > this.clickRange[0] && local.top < this.clickRange[1]){
            this.setValue(Math.round(local.left/this.getRatio()));
        }
    },

    onKeyDown : function(e){
        if(this.disabled){e.preventDefault();return;}
        var k = e.getKey();
        switch(k){
            case e.UP:
            case e.RIGHT:
                e.stopEvent();
                if(e.ctrlKey){
                    this.setValue(this.maxValue);
                }else{
                    this.setValue(this.value+this.keyIncrement);
                }
            break;
            case e.DOWN:
            case e.LEFT:
                e.stopEvent();
                if(e.ctrlKey){
                    this.setValue(this.minValue);
                }else{
                    this.setValue(this.value-this.keyIncrement);
                }
            break;
            default:
                e.preventDefault();
        }
    },

    doSnap : function(value){
        if(!this.increment || this.increment == 1 || !value) {
            return value;
        }
        var newValue = value, inc = this.increment;
        var m = value % inc;
        if(m > 0){
            if(m > (inc/2)){
                newValue = value + (inc-m);
            }else{
                newValue = value - m;
            }
        }
        return newValue.constrain(this.minValue,  this.maxValue);
    },

    afterRender : function(){
        Ext.Slider.superclass.afterRender.apply(this, arguments);
        if(this.value !== undefined){
            var v = this.normalizeValue(this.value);
            if(v !== this.value){
                delete this.value;
                this.setValue(v, false);
            }else{
                this.moveThumb(this.translateValue(v), false);
            }
        }
    },

    getRatio : function(){
        var w = this.innerEl.getWidth();
        var v = this.maxValue - this.minValue;
        return w/v;
    },

    normalizeValue : function(v){
       if(typeof v != 'number'){
            v = parseInt(v);
        }
        v = Math.round(v);
        v = this.doSnap(v);
        v = v.constrain(this.minValue, this.maxValue);
        return v;
    },

    setValue : function(v, animate){
        v = this.normalizeValue(v);
        if(v !== this.value && this.fireEvent('beforechange', this, v, this.value) !== false){
            this.value = v;
            this.moveThumb(this.translateValue(v), animate !== false);
            this.fireEvent('change', this, v);
        }
    },

    translateValue : function(v){
        return (v * this.getRatio())-this.halfThumb;
    },

    moveThumb: function(v, animate){
        if(!animate || this.animate === false){
            this.thumb.setLeft(v);
        }else{
            this.thumb.shift({left: v, stopFx: true, duration:.35});
        }
    },

    focus : function(){
        this.focusEl.focus(10);
    },

    onBeforeDragStart : function(e){
        return !this.disabled;
    },

    onDragStart: function(e){
        this.thumb.addClass('x-slider-thumb-drag');
        this.fireEvent('dragstart', this, e);
    },

    onDrag: function(e){
        var pos = this.innerEl.translatePoints(this.tracker.getXY());
        this.setValue(Math.round(pos.left/this.getRatio()), false);
        this.fireEvent('drag', this, e);
    },

    onDragEnd: function(e){
        this.thumb.removeClass('x-slider-thumb-drag');
        this.fireEvent('dragend', this, e);
    },

    onResize : function(w, h){
        this.innerEl.setWidth(w - (this.el.getPadding('l') + this.endEl.getPadding('r')));
    },

    getValue : function(){
        return this.value;
    }
});
Ext.reg('slider', Ext.Slider);

Ext.Slider.Vertical = {
    onResize : function(w, h){
        this.innerEl.setHeight(h - (this.el.getPadding('t') + this.endEl.getPadding('b')));
    },

    getRatio : function(){
        var h = this.innerEl.getHeight();
        var v = this.maxValue - this.minValue;
        return h/v;
    },

    moveThumb: function(v, animate){
        if(!animate || this.animate === false){
            this.thumb.setBottom(v);
        }else{
            this.thumb.shift({bottom: v, stopFx: true, duration:.35});
        }
    },

    onDrag: function(e){
        var pos = this.innerEl.translatePoints(this.tracker.getXY());
        var bottom = this.innerEl.getHeight()-pos.top;
        this.setValue(Math.round(bottom/this.getRatio()), false);
        this.fireEvent('drag', this, e);
    },

    onClickChange : function(local){
        if(local.left > this.clickRange[0] && local.left < this.clickRange[1]){
            var bottom = this.innerEl.getHeight()-local.top;
            this.setValue(Math.round(bottom/this.getRatio()));
        }
    }
};
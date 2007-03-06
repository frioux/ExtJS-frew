(function(){

function translatePoints(el, xy){
    var e = Ext.fly(el);
    var p = e.getStyle('position');
    if(p == "static") {
        e.position("relative");
        p = "relative";
    }

    var o = Position.cumulativeOffset(el), x = o[0],  y = o[1];

    var l = parseInt(e.getStyle('left'), 10);
    var t = parseInt(e.getStyle('top'), 10);

    if(isNaN(l)){
        l = (p == "relative") ? 0 : e.dom.offsetLeft;
    }
    if(isNaN(t)){
        t = (p == "relative") ? 0 : e.dom.offsetTop;
    }

    return {left: (xy[0] - x + l), top: (xy[1] - y + t)};
}

Ext.lib.Dom = {
    getViewWidth : function(full){
        return full ? this.getDocumentWidth() : this.getViewportWidth();
    },

    getViewHeight : function(full){
        return full ? this.getDocumentHeight() : this.getViewportHeight();
    },

    getDocumentHeight: function() {
        var scrollHeight = (document.compatMode != "CSS1Compat") ? document.body.scrollHeight : document.documentElement.scrollHeight;
        return Math.max(scrollHeight, this.getViewportHeight());
    },

    getDocumentWidth: function() {
        var scrollWidth = (document.compatMode != "CSS1Compat") ? document.body.scrollWidth : document.documentElement.scrollWidth;
        return Math.max(scrollWidth, this.getViewportWidth());
    },

    getViewportHeight: function() {
        var height = self.innerHeight;
        var mode = document.compatMode;

        if ( (mode || Ext.isIE) && !Ext.isOpera ) {
            height = (mode == "CSS1Compat") ?
                    document.documentElement.clientHeight : // Standards
                    document.body.clientHeight; // Quirks
        }

        return height;
    },

    getViewportWidth: function() {
        var width = self.innerWidth;  // Safari
        var mode = document.compatMode;

        if (mode || Ext.isIE) { // IE, Gecko, Opera
            width = (mode == "CSS1Compat") ?
                    document.documentElement.clientWidth : // Standards
                    document.body.clientWidth; // Quirks
        }
        return width;
    },

    isAncestor : function(p, c){
        p = Ext.getDom(p);
        c = Ext.getDom(c);
        if (!p || !c) {return false;}

        if(p.contains && !Ext.isSafari) {
            return p.contains(c);
        }else if(p.compareDocumentPosition) {
            return !!(p.compareDocumentPosition(c) & 16);
        }else{
            var parent = c.parentNode;
            while (parent) {
                if (parent == p) {
                    return true;
                }
                else if (!parent.tagName || parent.tagName.toUpperCase() == "HTML") {
                    return false;
                }
                parent = parent.parentNode;
            }
            return false;
        }
    },

    getRegion : function(el){
        return Ext.lib.Region.getRegion(el);
    },

    getY : function(el){
        return this.getXY(el)[1];
    },

    getX : function(el){
        return this.getXY(el)[0];
    },

    getXY : function(el){
        return Position.cumulativeOffset(el);
    },

    setXY : function(el, xy){
        el = Ext.getDom(el);
        var pts = translatePoints(el, xy);
        if(xy[0] !== false){
            el.style.left = pts.left + "px";
        }
        if(xy[1] !== false){
            el.style.top = pts.top + "px";
        }
    },

    setX : function(el, x){
        this.setXY(el, [x, false]);
    },

    setY : function(el, y){
        this.setXY(el, [false, y]);
    }
};

Ext.lib.Event = {
    getPageX : function(e){
        return Event.pointerX(e.browserEvent || e);
    },

    getPageY : function(e){
        return Event.pointerX(e.browserEvent || e);
    },

    getXY : function(e){
        e = e.browserEvent || e;
        return [Event.pointerX(e), Event.pointerY(e)];
    },

    getTarget : function(e){
        return Event.element(e.browserEvent || e);
    },

    resolveTextNode: function(node) {
        if (node && 3 == node.nodeType) {
            return node.parentNode;
        } else {
            return node;
        }
    },

    getRelatedTarget: function(ev) {
        ev = ev.browserEvent || ev;
        var t = ev.relatedTarget;
        if (!t) {
            if (ev.type == "mouseout") {
                t = ev.toElement;
            } else if (ev.type == "mouseover") {
                t = ev.fromElement;
            }
        }

        return this.resolveTextNode(t);
    },

    on : function(el, eventName, fn){
        Event.observe(el, eventName, fn, false);
    },

    un : function(el, eventName, fn){
        Event.stopObserving(el, eventName, fn, false);
    },

    purgeElement : function(el){
        // no equiv?
    },

    preventDefault : function(e){  // no equiv
        e = e.browserEvent || e;
        if(e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },

    stopPropagation : function(e){  // no equiv
        e = e.browserEvent || e;
        if(e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },

    stopEvent : function(e){
        Event.stop(e.browserEvent || e);
    },

    onAvailable : function(el, fn, scope, override){  // no equiv
        var start = new Date(), iid;
        var f = function(){
            if(start.getElapsed() > 10000){
                clearInterval(iid);
            }
            var el = document.getElementById(id);
            if(el){
                clearInterval(iid);
                fn.call(scope||window, el);
            }
        };
        iid = setInterval(f, 50);
    }
};

Ext.lib.Ajax = function(){
    var createSuccess = function(cb){
         return cb.success ? function(xhr){
            cb.success.call(cb.scope||window, {
                responseText: xhr.responseText,
                responseXML : xhr.responseXML,
                argument: cb.argument
            });
         } : Ext.emptyFn;
    };
    var createFailure = function(cb){
         return cb.failure ? function(xhr){
            cb.failure.call(cb.scope||window, {
                responseText: xhr.responseText,
                responseXML : xhr.responseXML,
                argument: cb.argument
            });
         } : Ext.emptyFn;
    };
    return {
        request : function(method, uri, cb, data){
            new Ajax.Request(uri, {
                method: method,
                parameters: data || '',
                timeout: cb.timeout,
                onSuccess: createSuccess(cb),
                onFailure: createFailure(cb)
            });
        },

        formRequest : function(form, uri, cb, data, isUpload, sslUri){
            new Ajax.Request(uri, {
                method: 'POST',
                parameters: Form.serialize(form, true),
                timeout: cb.timeout,
                onSuccess: createSuccess(cb),
                onFailure: createFailure(cb)
            });
        },

        isCallInProgress : function(trans){
            return false;
        },

        abort : function(trans){
            return false;
        }
    };
}();


Ext.lib.Anim = function(){
    
    var easings = {
        easeOut: function(pos) {
            return 1-Math.pow(1-pos,2);
        },
        easeIn: function(pos) {
            return 1-Math.pow(1-pos,2);
        }
    };
    var createAnim = function(cb, scope){
        return {
            stop : function(skipToLast){
                this.effect.cancel();
            },

            isAnimated : function(){
                return this.effect.state == 'running';
            },

            proxyCallback : function(){
                Ext.callback(cb, scope);
            }
        };
    };
    return {
        scroll : function(el, args, duration, easing, cb, scope){
            // not supported so scroll immediately?
            var anim = createAnim(cb, scope);
            el = Ext.getDom(el);
            el.scrollLeft = args.to[0];
            el.scrollTop = args.to[1];
            anim.proxyCallback();
            return anim;
        },

        motion : function(el, args, duration, easing, cb, scope){
            return this.run(el, args, duration, easing, cb, scope);
        },

        color : function(el, args, duration, easing, cb, scope){
            return this.run(el, args, duration, easing, cb, scope);
        },

        run : function(el, args, duration, easing, cb, scope, type){
            var o = {};
            for(var k in args){
                switch(k){   // scriptaculous doesn't support, so convert these
                    case 'points':
                        var by, pts;
                        if(by = args.points.by){
                            var xy = Ext.lib.Dom.getXY(el);
                            pts = translatePoints(el, [xy[0]+by[0], xy[1]+by[1]]);
                        }else{
                            pts = translatePoints(el, args.points.to);
                        }
                        o.left = pts.left+'px';
                        o.top = pts.top+'px';
                        var e = Ext.fly(el);
                        //if(!parseInt(e.getStyle('left'), 10)){ // auto issues?
                        //    e.setLeft(0);
                        //}
                        //if(!parseInt(e.getStyle('top'), 10)){
                       //     e.setTop(0);
                        //}
                    break;
                    case 'width':
                        o.width = args.width.to+'px';
                    break;
                    case 'height':
                        o.height = args.height.to+'px';
                    break;
                    case 'opacity':
                        o.opacity = String(args.opacity.to);
                    break;
                    default:
                        o[k] = String(args[k].to);
                    break;
                }
            }
            var anim = createAnim(cb, scope);
            anim.effect = new Effect.Morph(Ext.id(el), {
                duration: duration,
                afterFinish: anim.proxyCallback,
                transition: easings[easing] || Effects.Transitions.linear,
                style: o
            });
            return anim;
        }
    };
}();

Ext.lib.Region = function(t, r, b, l) {
    this.top = t;
    this[1] = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
    this[0] = l;
};

Ext.lib.Region.prototype = {
    contains : function(region) {
        return ( region.left   >= this.left   &&
                 region.right  <= this.right  &&
                 region.top    >= this.top    &&
                 region.bottom <= this.bottom    );

    },

    getArea : function() {
        return ( (this.bottom - this.top) * (this.right - this.left) );
    },

    intersect : function(region) {
        var t = Math.max( this.top,    region.top    );
        var r = Math.min( this.right,  region.right  );
        var b = Math.min( this.bottom, region.bottom );
        var l = Math.max( this.left,   region.left   );

        if (b >= t && r >= l) {
            return new Ext.lib.Region(t, r, b, l);
        } else {
            return null;
        }
    },
    union : function(region) {
        var t = Math.min( this.top,    region.top    );
        var r = Math.max( this.right,  region.right  );
        var b = Math.max( this.bottom, region.bottom );
        var l = Math.min( this.left,   region.left   );

        return new Ext.lib.Region(t, r, b, l);
    },

    adjust : function(t, l, b, r){
        this.top += t;
        this.left += l;
        this.right += r;
        this.bottom += b;
        return this;
    }
};

Ext.lib.Region.getRegion = function(el) {
    var p = Ext.lib.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new Ext.lib.Region(t, r, b, l);
};

Ext.lib.Point = function(x, y) {
   if (x instanceof Array) {
      y = x[1];
      x = x[0];
   }
    this.x = this.right = this.left = this[0] = x;
    this.y = this.top = this.bottom = this[1] = y;
};

Ext.lib.Point.prototype = new Ext.lib.Region();


// prevent IE leaks
if(Ext.isIE){
    Event.observe(window, "unload", function(){
        var p = Function.prototype;
        delete p.createSequence;
        delete p.defer;
        delete p.createDelegate;
        delete p.createCallback;
        delete p.createInterceptor;
    });
}
})();
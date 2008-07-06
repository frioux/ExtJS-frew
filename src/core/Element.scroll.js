Ext.Element.addMethods({
    /**
     * Scrolls this element into view within the passed container.
     * @param {Mixed} container (optional) The container element to scroll (defaults to document.body).  Should be a
     * string (id), dom node, or Ext.Element.
     * @param {Boolean} hscroll (optional) False to disable horizontal scroll (defaults to true)
     * @return {Ext.Element} this
     */
    scrollIntoView : function(container, hscroll){
        var c = Ext.getDom(container) || Ext.getBody().dom;
        var el = this.dom;

        var o = this.getOffsetsTo(c),
            l = o[0] + c.scrollLeft,
            t = o[1] + c.scrollTop,
            b = t+el.offsetHeight,
            r = l+el.offsetWidth;

        var ch = c.clientHeight;
        var ct = parseInt(c.scrollTop, 10);
        var cl = parseInt(c.scrollLeft, 10);
        var cb = ct + ch;
        var cr = cl + c.clientWidth;

        if(el.offsetHeight > ch || t < ct){
        	c.scrollTop = t;
        }else if(b > cb){
            c.scrollTop = b-ch;
        }
        c.scrollTop = c.scrollTop; // corrects IE, other browsers will ignore

        if(hscroll !== false){
			if(el.offsetWidth > c.clientWidth || l < cl){
                c.scrollLeft = l;
            }else if(r > cr){
                c.scrollLeft = r-c.clientWidth;
            }
            c.scrollLeft = c.scrollLeft;
        }
        return this;
    },

    // private
    scrollChildIntoView : function(child, hscroll){
        Ext.fly(child, '_scrollChildIntoView').scrollIntoView(this, hscroll);
    },
    
    /**
     * Returns true if this element is scrollable.
     * @return {Boolean}
     */
     isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    /**
     * Scrolls this element the specified scroll point. It does NOT do bounds checking so if you scroll to a weird value it will try to do it. For auto bounds checking, use scroll().
     * @param {String} side Either "left" for scrollLeft values or "top" for scrollTop values.
     * @param {Number} value The new scroll value
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Element} this
     */
    scrollTo : function(side, value, animate){
        var prop = side.toLowerCase() == "left" ? "scrollLeft" : "scrollTop";
        if(!animate || !A){
            this.dom[prop] = value;
        }else{
            var to = prop == "scrollLeft" ? [value, this.dom.scrollTop] : [this.dom.scrollLeft, value];
            this.anim({scroll: {"to": to}}, this.preanim(arguments, 2), 'scroll');
        }
        return this;
    },

    /**
     * Scrolls this element the specified direction. Does bounds checking to make sure the scroll is
     * within this element's scrollable range.
     * @param {String} direction Possible values are: "l" (or "left"), "r" (or "right"), "t" (or "top", or "up"), "b" (or "bottom", or "down").
     * @param {Number} distance How far to scroll the element in pixels
     * @param {Boolean/Object} animate (optional) true for the default animation or a standard Element animation config object
     * @return {Boolean} Returns true if a scroll was triggered or false if the element
     * was scrolled as far as it could go.
     */
     scroll : function(direction, distance, animate){
         if(!this.isScrollable()){
             return;
         }
         var el = this.dom;
         var l = el.scrollLeft, t = el.scrollTop;
         var w = el.scrollWidth, h = el.scrollHeight;
         var cw = el.clientWidth, ch = el.clientHeight;
         direction = direction.toLowerCase();
         var scrolled = false;
         var a = this.preanim(arguments, 2);
         switch(direction){
             case "l":
             case "left":
                 if(w - l > cw){
                     var v = Math.min(l + distance, w-cw);
                     this.scrollTo("left", v, a);
                     scrolled = true;
                 }
                 break;
            case "r":
            case "right":
                 if(l > 0){
                     var v = Math.max(l - distance, 0);
                     this.scrollTo("left", v, a);
                     scrolled = true;
                 }
                 break;
            case "t":
            case "top":
            case "up":
                 if(t > 0){
                     var v = Math.max(t - distance, 0);
                     this.scrollTo("top", v, a);
                     scrolled = true;
                 }
                 break;
            case "b":
            case "bottom":
            case "down":
                 if(h - t > ch){
                     var v = Math.min(t + distance, h-ch);
                     this.scrollTo("top", v, a);
                     scrolled = true;
                 }
                 break;
         }
         return scrolled;
    }
});
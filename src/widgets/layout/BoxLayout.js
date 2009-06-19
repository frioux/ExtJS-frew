/**
 * @class Ext.layout.BoxLayout
 * @extends Ext.layout.ContainerLayout
 * <p>Base Class for HBoxLayout and VBoxLayout Classes. Generally it should not need to be used directly.</p>
 */
Ext.layout.BoxLayout = Ext.extend(Ext.layout.ContainerLayout, {
    /**
     * @cfg {Object} defaultMargins
     * If the individual contained items do not have a <tt>margins</tt> property specified, the margins
     * from this object literal representing the default margins will be applied to each item. Defaults
     * to <tt>{left:0,top:0,right:0,bottom:0}</tt>.
     */
    defaultMargins : {left:0,top:0,right:0,bottom:0},
    /**
     * @cfg {String} padding
     * Defaults to <tt>'0'</tt>. Sets the padding to be applied to all child items managed by this
     * container's layout. 
     */
    padding : '0',
    // documented in subclasses
    pack : 'start',

    // private
    monitorResize : true,
    scrollOffset : 0,
    extraCls : 'x-box-item',
    ctCls : 'x-box-layout-ct',
    innerCls : 'x-box-inner',

    // private
    isValidParent : function(c, target){
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },

    // private
    onLayout : function(ct, target){
        var cs = ct.items.items, len = cs.length, c, i, last = len-1, cm;

        if(!this.innerCt){
            target.addClass(this.ctCls);

            // the innerCt prevents wrapping and shuffling while
            // the container is resizing
            this.innerCt = target.createChild({cls:this.innerCls});
            this.padding = this.parseMargins(this.padding); 
        }
        this.renderAll(ct, this.innerCt);
    },

    // private
    renderItem : function(c){
        if(typeof c.margins == 'string'){
            c.margins = this.parseMargins(c.margins);
        }else if(!c.margins){
            c.margins = this.defaultMargins;
        }
        Ext.layout.BoxLayout.superclass.renderItem.apply(this, arguments);
    },

    getTargetSize : function(target){
        return (Ext.isIE6 && Ext.isStrict && target.dom == document.body) ? target.getStyleSize() : target.getViewSize();
    },
    
    // private
    checkSize: function(w, h){
        if((Ext.isIE && !Ext.isStrict) && (w < 1 || h < 1)){
            return false;
        }else if(w < 1 && h < 1){
            return false;
        }
        return true;
    }

    /**
     * @property activeItem
     * @hide
     */
});

/**
 * @class Ext.layout.VBoxLayout
 * @extends Ext.layout.BoxLayout
 * A layout that arranges items vertically
 */
Ext.layout.VBoxLayout = Ext.extend(Ext.layout.BoxLayout, {
    /**
     * @cfg {String} align
     * Controls how the child items of the container are aligned. Acceptable configuration values for this
     * property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>left</tt></b> : <b>Default</b><div class="sub-desc">child items are aligned horizontally
     * at the <b>left</b> side of the container</div></li>
     * <li><b><tt>center</tt></b> : <div class="sub-desc">child items are aligned horizontally at the
     * <b>mid-width</b> of the container</div></li>
     * <li><b><tt>stretch</tt></b> : <div class="sub-desc">child items are stretched horizontally to fill
     * the width of the container</div></li>
     * <li><b><tt>stretchmax</tt></b> : <div class="sub-desc">child items are stretched horizontally to
     * the size of the largest item.</div></li>
     * </ul></div>
     */
    align : 'left', // left, center, stretch, strechmax
    /**
     * @cfg {String} pack
     * Controls how the child items of the container are packed together. Acceptable configuration values
     * for this property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>start</tt></b> : <b>Default</b><div class="sub-desc">child items are packed together at
     * <b>top</b> side of container</div></li>
     * <li><b><tt>center</tt></b> : <div class="sub-desc">child items are packed together at
     * <b>mid-height</b> of container</div></li>
     * <li><b><tt>end</tt></b> : <div class="sub-desc">child items are packed together at <b>bottom</b>
     * side of container</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Number} flex
     * This configuation option is to be applied to <b>child <tt>items</tt></b> of the container managed
     * by this layout. Each child item with a <tt>flex</tt> property will be flexed <b>vertically</b>
     * according to each item's <b>relative</b> <tt>flex</tt> value compared to the sum of all items with
     * a <tt>flex</tt> value specified.  Any child items that have either a <tt>flex = 0</tt> or
     * <tt>flex = undefined</tt> will not be 'flexed' (the initial size will not be changed).
     */

    // private
    onLayout : function(ct, target){
        Ext.layout.VBoxLayout.superclass.onLayout.call(this, ct, target);
                    
        
        var cs = ct.items.items, cm, ch, margin,
            size = this.getTargetSize(target),
            w = size.width - target.getPadding('lr') - this.scrollOffset,
            h = size.height - target.getPadding('tb'),
            l = this.padding.left, t = this.padding.top,
            isStart = this.pack == 'start',
            isRestore = ['stretch', 'stretchmax'].indexOf(this.align) == -1,
            stretchWidth = w - (this.padding.left + this.padding.right),
            extraHeight = 0,
            maxWidth = 0,
            totalFlex = 0,
            flexHeight = 0,
            usedHeight = 0;
           
        if(!this.checkSize()){
            return;
        }
            
        Ext.each(cs, function(c){
            cm = c.margins;
            totalFlex += c.flex || 0;
            ch = c.getHeight();
            margin = cm.top + cm.bottom;
            extraHeight += ch + margin;
            flexHeight += margin + (c.flex ? 0 : ch);
            maxWidth = Math.max(maxWidth, c.getWidth() + cm.left + cm.right);
        });
        extraHeight = h - extraHeight - this.padding.top - this.padding.bottom;
        
        var innerCtWidth = maxWidth + this.padding.left + this.padding.right;
        switch(this.align){
            case 'stretch':
                this.innerCt.setSize(w, h);
                break;
            case 'stretchmax':
            case 'left':
                this.innerCt.setSize(innerCtWidth, h);
                break;
            case 'center':
                this.innerCt.setSize(w = Math.max(w, innerCtWidth), h);
                break;
        }

        var availHeight = h - this.padding.top - this.padding.bottom - flexHeight,
            leftOver = availHeight,
            heights = [],
            restore = [],
            idx = 0,
            availableWidth = w - this.padding.left - this.padding.right;
            

        Ext.each(cs, function(c){
            if(isStart && c.flex){
                ch = Math.floor(availHeight * (c.flex / totalFlex));
                leftOver -= ch;
                heights.push(ch);
            }
        }); 
        
        if(this.pack == 'center'){
            t += extraHeight ? extraHeight / 2 : 0;
        }else if(this.pack == 'end'){
            t += extraHeight;
        }
        Ext.each(cs, function(c){
            cm = c.margins;
            t += cm.top;
            c.setPosition(l + cm.left, t);
            if(isStart && c.flex){
                ch = Math.max(0, heights[idx++] + (leftOver-- > 0 ? 1 : 0));
                if(isRestore){
                    restore.push(c.getWidth());
                }
                c.setSize(availableWidth, ch);
            }else{
                ch = c.getHeight();
            }
            t += ch + cm.bottom;
        });
        
        idx = 0;
        Ext.each(cs, function(c){
            cm = c.margins;
            if(this.align == 'stretch'){
                c.setWidth((stretchWidth - (cm.left + cm.right)).constrain(
                    c.minWidth || 0, c.maxWidth || 1000000));
            }else if(this.align == 'stretchmax'){
                c.setWidth((maxWidth - (cm.left + cm.right)).constrain(
                    c.minWidth || 0, c.maxWidth || 1000000));
            }else{
                if(this.align == 'center'){
                    var diff = availableWidth - (c.getWidth() + cm.left + cm.right);
                    if(diff > 0){
                        c.setPosition(l + cm.left + (diff/2), c.y);
                    }
                }
                if(isStart && c.flex){
                    c.setWidth(restore[idx++]);
                }
            }
        }, this);
    }
    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS.vbox = Ext.layout.VBoxLayout;

/**
 * @class Ext.layout.HBoxLayout
 * @extends Ext.layout.BoxLayout
 * A layout that arranges items horizontally
 */
Ext.layout.HBoxLayout = Ext.extend(Ext.layout.BoxLayout, {
    /**
     * @cfg {String} align
     * Controls how the child items of the container are aligned. Acceptable configuration values for this
     * property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>top</tt></b> : <b>Default</b><div class="sub-desc">child items are aligned vertically
     * at the <b>left</b> side of the container</div></li>
     * <li><b><tt>middle</tt></b> : <div class="sub-desc">child items are aligned vertically at the
     * <b>mid-height</b> of the container</div></li>
     * <li><b><tt>stretch</tt></b> : <div class="sub-desc">child items are stretched vertically to fill
     * the height of the container</div></li>
     * <li><b><tt>stretchmax</tt></b> : <div class="sub-desc">child items are stretched vertically to
     * the size of the largest item.</div></li>
     */
    align : 'top', // top, middle, stretch, strechmax
    /**
     * @cfg {String} pack
     * Controls how the child items of the container are packed together. Acceptable configuration values
     * for this property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>start</tt></b> : <b>Default</b><div class="sub-desc">child items are packed together at
     * <b>left</b> side of container</div></li>
     * <li><b><tt>center</tt></b> : <div class="sub-desc">child items are packed together at
     * <b>mid-width</b> of container</div></li>
     * <li><b><tt>end</tt></b> : <div class="sub-desc">child items are packed together at <b>right</b>
     * side of container</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Number} flex
     * This configuation option is to be applied to <b>child <tt>items</tt></b> of the container managed
     * by this layout. Each child item with a <tt>flex</tt> property will be flexed <b>horizontally</b>
     * according to each item's <b>relative</b> <tt>flex</tt> value compared to the sum of all items with
     * a <tt>flex</tt> value specified.  Any child items that have either a <tt>flex = 0</tt> or
     * <tt>flex = undefined</tt> will not be 'flexed' (the initial size will not be changed).
     */

    // private
    onLayout : function(ct, target){
        Ext.layout.HBoxLayout.superclass.onLayout.call(this, ct, target);
        
        var cs = ct.items.items, cm, cw, margin,
            size = this.getTargetSize(target),
            w = size.width - target.getPadding('lr') - this.scrollOffset,
            h = size.height - target.getPadding('tb'),
            l = this.padding.left, t = this.padding.top,
            isStart = this.pack == 'start',
            isRestore = ['stretch', 'stretchmax'].indexOf(this.align) == -1,
            stretchHeight = h - (this.padding.top + this.padding.bottom),
            extraWidth = 0,
            maxHeight = 0,
            totalFlex = 0,
            flexWidth = 0,
            usedWidth = 0;
            
        if(!this.checkSize()){
            return;
        }
        
        Ext.each(cs, function(c){
            cm = c.margins;
            totalFlex += c.flex || 0;
            cw = c.getWidth();
            margin = cm.left + cm.right;
            extraWidth += cw + margin;
            flexWidth += margin + (c.flex ? 0 : cw);
            maxHeight = Math.max(maxHeight, c.getHeight() + cm.top + cm.bottom);
        });
        extraWidth = w - extraWidth - this.padding.left - this.padding.right;
        
        var innerCtHeight = maxHeight + this.padding.top + this.padding.bottom;
        switch(this.align){
            case 'stretch':
                this.innerCt.setSize(w, h);
                break;
            case 'stretchmax':
            case 'top':
                this.innerCt.setSize(w, innerCtHeight);
                break;
            case 'middle':
                this.innerCt.setSize(w, h = Math.max(h, innerCtHeight));
                break;
        }
        

        var availWidth = w - this.padding.left - this.padding.right - flexWidth,
            leftOver = availWidth,
            widths = [],
            restore = [],
            idx = 0,
            availableHeight = h - this.padding.top - this.padding.bottom;
            

        Ext.each(cs, function(c){
            if(isStart && c.flex){
                cw = Math.floor(availWidth * (c.flex / totalFlex));
                leftOver -= cw;
                widths.push(cw);
            }
        }); 
        
        if(this.pack == 'center'){
            l += extraWidth ? extraWidth / 2 : 0;
        }else if(this.pack == 'end'){
            l += extraWidth;
        }
        Ext.each(cs, function(c){
            cm = c.margins;
            l += cm.left;
            c.setPosition(l, t + cm.top);
            if(isStart && c.flex){
                cw = Math.max(0, widths[idx++] + (leftOver-- > 0 ? 1 : 0));
                if(isRestore){
                    restore.push(c.getHeight());
                }
                c.setSize(cw, availableHeight);
            }else{
                cw = c.getWidth();
            }
            l += cw + cm.right;
        });
        
        idx = 0;
        Ext.each(cs, function(c){
            var cm = c.margins;
            if(this.align == 'stretch'){
                console.log(stretchHeight, cm.top, cm.bottom, (stretchHeight - (cm.top + cm.bottom)).constrain(
                    c.minHeight || 0, c.maxHeight || 1000000));
                c.setHeight((stretchHeight - (cm.top + cm.bottom)).constrain(
                    c.minHeight || 0, c.maxHeight || 1000000));
            }else if(this.align == 'stretchmax'){
                c.setHeight((maxHeight - (cm.top + cm.bottom)).constrain(
                    c.minHeight || 0, c.maxHeight || 1000000));
            }else{
                if(this.align == 'middle'){
                    var diff = availableHeight - (c.getHeight() + cm.top + cm.bottom);
                    if(diff > 0){
                        c.setPosition(c.x, t + cm.top + (diff/2));
                    }
                }
                if(isStart && c.flex){
                    c.setHeight(restore[idx++]);
                }
            }
        }, this);
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS.hbox = Ext.layout.HBoxLayout;

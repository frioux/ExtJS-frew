/**
 * @class Ext.MenuButton
 * @extends Ext.Button
 * Simple Button class
 * @cfg {Function} arrowHandler A function called when the arrow button is clicked (can be used instead of click event)
 * @cfg {String} arrowTooltip The title attribute of the arrow
 * @constructor
 * Create a new menu button
 * @param {String/HTMLElement/Element} renderTo The element to append the button to
 * @param {Object} config The config object
 */
Ext.MenuButton = function(renderTo, config){
    Ext.MenuButton.superclass.constructor.call(this, renderTo, config);
    /**
     * @event arrowclick
     * Fires when this arrow is clicked
     * @param {Button} this
     * @param {EventObject} e The click event
     */
    this.events["arrowclick"] = true;
};

Ext.extend(Ext.MenuButton, Ext.Button, {
    render : function(renderTo){
        // this is one sweet looking template!
        var tpl = new Ext.Template(
            '<table cellspacing="0" class="x-btn-menu-wrap x-btn"><tr><td>',
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-text-wrap"><tbody>',
            '<tr><td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><button class="x-btn-text">{0}</button></td></tr>',
            "</tbody></table></td><td>",
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-arrow-wrap"><tbody>',
            '<tr><td class="x-btn-center"><button class="x-btn-menu-arrow-el">&#160;</button></td><td class="x-btn-right"><i>&#160;</i></td></tr>',
            "</tbody></table></td></tr></table>"
        );
        var btn = tpl.append(renderTo, [this.text], true);
        if(this.cls){
            btn.addClass(this.cls);
        }
        if(this.icon){
            btn.child("button").setStyle('background-image', 'url(' +this.icon +')');
        }
        this.el = btn;
        this.autoWidth();
        btn.on("click", this.onClick, this);
        btn.on("mouseover", this.onMouseOver, this);
        btn.on("mouseout", this.onMouseOut, this);
        btn.on("mousedown", this.onMouseDown, this);
        btn.on("mouseup", this.onMouseUp, this);
        if(this.tooltip){
            var btnEl = btn.child("button:first");
            if(typeof this.tooltip == 'object'){
                Ext.QuickTips.tips(Ext.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }
        if(this.arrowTooltip){
            var btnEl = btn.child("button:nth(2)");
            btnEl.dom[this.tooltipType] = this.arrowTooltip;
        }
        if(this.hidden){
            this.hide();
        }
        if(this.disabled){
            this.disable();
        }
        if(this.menu){
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
    },
    
    autoWidth : function(){
        if(this.el){
            var tbl = this.el.child("table:first");
            var tbl2 = this.el.child("table:last");
            this.el.setWidth("auto");
            tbl.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.el.child('button:first');
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.hidden){
                    this.el.beginMeasure();
                }
                if((tbl.getWidth()+tbl2.getWidth()) < this.minWidth){
                    tbl.setWidth(this.minWidth-tbl2.getWidth());
                }
                if(this.hidden){
                    this.el.endMeasure();
                }
            }
            this.el.setWidth(tbl.getWidth()+tbl2.getWidth());
        } 
    },
    /**
     * Sets this button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} scope (optional) Scope for the function passed above
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    /**
     * Sets this button's arrow click handler
     * @param {Function} handler The function to call when the arrow is clicked
     * @param {Object} scope (optional) Scope for the function passed above
     */
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;  
    },
    
    /**
     * Focus the button
     */
    focus : function(){
        if(this.el){
            this.el.child("a:first").focus();
        }
    },
    
    onClick : function(e){
        e.preventDefault();
        if(!this.disabled){
            if(e.getTarget(".x-btn-menu-arrow-wrap")){
                if(this.menu && !this.menu.isVisible()){
                    this.menu.show(this.el, this.menuAlign);
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },
    onMouseDown : function(e){
        if(!this.disabled){
            Ext.fly(e.getTarget("table")).addClass("x-btn-click");
        }
    },
    onMouseUp : function(e){
        Ext.fly(e.getTarget("table")).removeClass("x-btn-click");
    }   
});
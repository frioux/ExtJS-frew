/**
 * @class Ext.ToolTip
 * @extends Ext.Tip
 * A standard tooltip implementation for providing additional information when hovering over a target element.
 * @constructor
 * Create a new Tooltip
 * @param {Object} config The configuration options
 */
Ext.ToolTip = Ext.extend(Ext.Tip, {
    /**
     * When a Tooltip is configured with the {@link #delegate} option to cause selected child elements of the {@link #target}
     * Element to each trigger a seperate show event, this property is set to the DOM element which triggered the show.
     * @type DOMElement
     * @property triggerElement
     */
    /**
     * @cfg {Mixed} target The target HTMLElement, Ext.Element or id to monitor for mouseover events to trigger
     * showing this ToolTip.
     */
    /**
     * @cfg {Boolean} autoHide True to automatically hide the tooltip after the mouse exits the target element
     * or after the {@link #dismissDelay} has expired if set (defaults to true).  If {@link closable} = true a close
     * tool button will be rendered into the tooltip header.
     */
    /**
     * @cfg {Number} showDelay Delay in milliseconds before the tooltip displays after the mouse enters the
     * target element (defaults to 500)
     */
    showDelay: 500,
    /**
     * @cfg {Number} hideDelay Delay in milliseconds after the mouse exits the target element but before the
     * tooltip actually hides (defaults to 200).  Set to 0 for the tooltip to hide immediately.
     */
    hideDelay: 200,
    /**
     * @cfg {Number} dismissDelay Delay in milliseconds before the tooltip automatically hides (defaults to 5000).
     * To disable automatic hiding, set dismissDelay = 0.
     */
    dismissDelay: 5000,
    /**
     * @cfg {Array} mouseOffset An XY offset from the mouse position where the tooltip should be shown (defaults to [15,18]).
     */
    mouseOffset: [15,18],
    /**
     * @cfg {Boolean} trackMouse True to have the tooltip follow the mouse as it moves over the target element (defaults to false).
     */
    trackMouse : false,
    /**
     * @cfg {String} delegate <p>Optional. A {@link Ext.DomQuery DomQuery} selector which allows selection of individual elements
     * within the {@link #target} element to trigger showing and hiding the ToolTip as the mouse moves within the target.</p>
     * <p>When specified, the child element of the target which caused a show event is placed into the {@link #triggerElement} property.
     * before the ToolTip is shown.</p>
     * This may be useful when a Component has regular, repeating elements in it, each of which need a Tooltip which contains
     * information specific to that element. For example:<code><pre>
var myGrid = new Ext.grid.gridPanel(gridConfig);
myGrid.on('render', function(grid) {
    var store = grid.getStore();  // Capture the Store.
    var view = grid.getView();    // Capture the GridView.
    myGrid.tip = new Ext.ToolTip({
        target: view.mainBody,    // The overall target element.
        delegate: '.x-grid3-row', // Each grid row causes its own seperate show and hide.
        trackMouse: true,         // Moving within the row should not hide the tip.
        renderTo: document.body,  // Render immediately so that tip.body can be referenced prior to the first show.
        listeners: {              // Change content dynamically depending on which element triggered the show.
            beforeshow: function updateTipBody(tip) {
                var rowIndex = view.findRowIndex(tip.triggerElement);
                tip.body.dom.innerHTML = "Over Record ID " + store.getAt(rowIndex).id;
            }
        }
    });
});</pre></code>
     */

    constrainPosition: true,

    // private
    initComponent: function(){
        Ext.ToolTip.superclass.initComponent.call(this);
        this.lastActive = new Date();
        this.initTarget();
    },

    // private
    initTarget : function(){
        if(this.target){
            this.target = Ext.get(this.target);
            this.mon(this.target, {
            	mouseover: this.onTargetOver,
            	mouseout: this.onTargetOut,
            	mousemove: this.onMouseMove,
            	scope: this
            })
        }
    },

    // private
    onMouseMove : function(e){
        var t = this.delegate ? e.getTarget(this.delegate) : this.triggerElement = true;
        if (t) {
            this.targetXY = e.getXY();
            if (t === this.triggerElement) {
                if(!this.hidden && this.trackMouse){
                    this.setPagePosition(this.getTargetXY());
                }
            } else {
                this.hide();
                this.lastActive = new Date(0);
                this.onTargetOver(e);
            }
        } else if (!this.closable && this.isVisible()) {
            this.hide();
        }
    },

    // private
    getTargetXY : function(){
        return [this.targetXY[0]+this.mouseOffset[0], this.targetXY[1]+this.mouseOffset[1]];
    },

    // private
    onTargetOver : function(e){
        if(this.disabled || e.within(this.target.dom, true)){
            return;
        }
        var t = e.getTarget(this.delegate);
        if (t) {
            this.triggerElement = t;
            this.clearTimer('hide');
            this.targetXY = e.getXY();
            this.delayShow();
        }
    },

    // private
    delayShow : function(){
        if(this.hidden && !this.showTimer){
            if(this.lastActive.getElapsed() < this.quickShowInterval){
                this.show();
            }else{
                this.showTimer = this.show.defer(this.showDelay, this);
            }
        }else if(!this.hidden && this.autoHide !== false){
            this.show();
        }
    },

    // private
    onTargetOut : function(e){
        if(this.disabled || e.within(this.target.dom, true)){
            return;
        }
        this.clearTimer('show');
        if(this.autoHide !== false){
            this.delayHide();
        }
    },

    // private
    delayHide : function(){
        if(!this.hidden && !this.hideTimer){
            this.hideTimer = this.hide.defer(this.hideDelay, this);
        }
    },

    /**
     * Hides this tooltip if visible.
     */
    hide: function(){
        this.clearTimer('dismiss');
        this.lastActive = new Date();
        delete this.triggerElement;
        Ext.ToolTip.superclass.hide.call(this);
    },

    /**
     * Shows this tooltip at the current event target XY position.
     */
    show : function(){
        this.showAt(this.getTargetXY());
    },

    // inherit docs
    showAt : function(xy){
        this.lastActive = new Date();
        this.clearTimers();
        Ext.ToolTip.superclass.showAt.call(this, xy);
        if(this.dismissDelay && this.autoHide !== false){
            this.dismissTimer = this.hide.defer(this.dismissDelay, this);
        }
    },

    // private
    clearTimer : function(name){
        name = name + 'Timer';
        clearTimeout(this[name]);
        delete this[name];
    },

    // private
    clearTimers : function(){
        this.clearTimer('show');
        this.clearTimer('dismiss');
        this.clearTimer('hide');
    },

    // private
    onShow : function(){
        Ext.ToolTip.superclass.onShow.call(this);
        Ext.getDoc().on('mousedown', this.onDocMouseDown, this);
    },

    // private
    onHide : function(){
        Ext.ToolTip.superclass.onHide.call(this);
        Ext.getDoc().un('mousedown', this.onDocMouseDown, this);
    },

    // private
    onDocMouseDown : function(e){
        if(this.autoHide !== false && !e.within(this.el.dom)){
            this.disable();
            this.enable.defer(100, this);
        }
    },

    // private
    onDisable : function(){
        this.clearTimers();
        this.hide();
    },

    // private
    adjustPosition : function(x, y){
        // keep the position from being under the mouse
        var ay = this.targetXY[1], h = this.getSize().height;
        if(this.constrainPosition && y <= ay && (y+h) >= ay){
            y = ay-h-5;
        }
        return {x : x, y: y};
    },

    // private
    onDestroy : function(){
        Ext.ToolTip.superclass.onDestroy.call(this);
    }
});
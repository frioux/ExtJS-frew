/**
 * @class Ext.dd.DropTarget
 * @extends Ext.dd.DDTarget
 * A simple class that provides the basic implementation needed to make any element a drop target that can have
 * draggable items dropped onto it.  The drop has no effect until an implementation of notifyDrop is provided.
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Ext.dd.DropTarget = function(el, config){
    this.el = Ext.get(el);
    
    Ext.apply(this, config);
    
    if(this.containerScroll){
        Ext.dd.ScrollManager.register(this.el);
    }
    
    Ext.dd.DropTarget.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group, 
          {isTarget: true});

};

Ext.extend(Ext.dd.DropTarget, Ext.dd.DDTarget, {
    /**
     * @cfg {String} overClass The CSS class applied to the drop target element while the drag source is over it
     * (defaults to "").
     */
    /**
     * @cfg {String} dropAllowed The CSS class applied to the drop target element when drop is allowed
     * (defaults to "x-dd-drop-ok").
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed The CSS class applied to the drop target element when drop is not allowed
     * (defaults to "x-dd-drop-nodrop").
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    // private
    isTarget : true,

    // private
    isNotifyTarget : true,

    /**
     * Notifies the drop target once that a {@link Ext.dd.DragSource} has been dragged over it.  This default
     * implementation adds the CSS class specified by overClass (if any) to the drop element and returns
     * the dropAllowed config value.  This method should be overridden if drop validation is required.
     * @param {Ext.dd.DDProxy} ddProxy The proxy that was dragged over this drop target
     * @param {Event} e The event
     * @paramn {Object} data An object containing arbitrary data supplied by the drag source
     */
    notifyEnter : function(dd, e, data){
        if(this.overClass){
            this.el.addClass(this.overClass);
        }
        return this.dropAllowed;
    },

    /**
     * Notifies the drop target continuously that a {@link Ext.dd.DragSource} is being dragged over it.
     * This method will be called on every mouse movement while the drag source is over the drop target.
     * This default implementation simply returns the dropAllowed config value.
     * @param {Ext.dd.DDProxy} ddProxy The proxy that was dragged over this drop target
     * @param {Event} e The event
     * @paramn {Object} data An object containing arbitrary data supplied by the drag source
     */
    notifyOver : function(dd, e, data){
        return this.dropAllowed;
    },

    /**
     * Notifies the drop target once that a {@link Ext.dd.DragSource} has been dragged out of it.  This default
     * implementation simply removes the CSS class specified by overClass (if any) from the drop element.
     * @param {Ext.dd.DDProxy} ddProxy The proxy that was dragged over this drop target
     * @param {Event} e The event
     * @paramn {Object} data An object containing arbitrary data supplied by the drag source
     */
    notifyOut : function(dd, e, data){
        if(this.overClass){
            this.el.removeClass(this.overClass);
        }
    },

    /**
     * Notifies the drop target that a {@link Ext.dd.DragSource} has been dropped on it.  This method has no
     * default implementation and returns false, so you must provide an implementation that does something to
     * process the drop event and returns true so that the drag source's repair action does not run.
     * @param {Ext.dd.DDProxy} ddProxy The proxy that was dragged over this drop target
     * @param {Event} e The event
     * @paramn {Object} data An object containing arbitrary data supplied by the drag source
     */
    notifyDrop : function(dd, e, data){
        return false;
    }
});
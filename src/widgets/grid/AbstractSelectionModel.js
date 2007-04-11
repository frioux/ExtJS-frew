/**
 @class Ext.grid.AbstractSelectionModel
 @extends Ext.util.Observable
 @constructor
 */
Ext.grid.AbstractSelectionModel = function(){
    this.locked = false;
    Ext.grid.AbstractSelectionModel.superclass.constructor.call(this);
};

Ext.extend(Ext.grid.AbstractSelectionModel, Ext.util.Observable,  {
    /** @ignore Called by the grid automatically. Do not call directly. */
    init : function(grid){
        this.grid = grid;
        this.initEvents();
    },
    
    /**
     * Lock the selections
     */
    lock : function(){
        this.locked = true;
    },
    
    /**
     * Unlock the selections
     */
    unlock : function(){
        this.locked = false;  
    },
    
    /**
     * Returns true if the selections are locked
     * @return {Boolean}
     */
    isLocked : function(){
        return this.locked;    
    }
});
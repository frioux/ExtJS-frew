/**
 * @class Ext.grid.PivotGrid
 * @extends Ext.grid.GridPanel
 * 
 */
Ext.grid.PivotGrid = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function() {
        Ext.applyIf(this, {
            
        });
        
        Ext.grid.PivotGrid.superclass.initComponent.apply(this, arguments);
        
        /**
         * @property leftAxis
         * @type Ext.data.OlapAxis
         * 
         */
        // this.leftAxis = new Ext.data.OlapAxis(this.leftAxis);
        
        
    },
    
    /**
     * Returns the grid's GridView object.
     * @return {Ext.grid.GridView} The grid view
     */
    getView : function() {
        if (!this.view) {
            this.view = new Ext.grid.PivotGridView(this.viewConfig);
        }
        
        return this.view;
    },
    
    /**
     * Sets the function to use when aggregating data for each cell.
     * @param {String|Function} aggregator The new aggregator function or named function string
     */
    setAggregator: function(aggregator) {
        
    },
    
    /**
     * Sets the field name to use as the Measure in this Pivot Grid
     * @param {String} measure The field to make the measure
     */
    setMeasure: function(measure) {
        
    }
});

Ext.reg('pivotgrid', Ext.grid.PivotGrid);
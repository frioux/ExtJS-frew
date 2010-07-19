/**
 * @class pivot.ConfigPanel
 * @extends Ext.Panel
 * A configuration panel used for modifying the properties of a PivotGrid.
 */
pivot.ConfigPanel = Ext.extend(Ext.Panel, {
    layout: 'vbox',
    
    /**
     * @cfg {Ext.data.Record} record The Ext.data.Record to extract the field list from. Required
     */

    initComponent: function() {
        var fields = this.getRecordFields();
        
        /**
         * @property form
         * @type Ext.form.FormPanel
         * Used to set the measure and aggregation function
         */
        this.form = new Ext.form.FormPanel({
            title: 'Configure',
            height: 90,
            width: 279,
            margins: {
                top   : 10,
                left  : 10,
                right : 10,
                bottom: 0
            },
            padding: '7',
            
            items: [
                {
                  xtype:          'combo',
                  mode:           'local',
                  triggerAction:  'all',
                  forceSelection: true,
                  editable:       false,
                  anchor:         "0",
                  fieldLabel:     'Measure',
                  name:           'measure',
                  displayField:   'name',
                  valueField:     'name',
                  value:           this.measure || this.measures[0],
                  store:           this.getMeasureStore()
                },
                {
                  xtype:          'combo',
                  mode:           'local',
                  triggerAction:  'all',
                  forceSelection: true,
                  editable:       false,
                  anchor:         "0",
                  fieldLabel:     'Aggregator',
                  name:           'aggregator',
                  hiddenName:     'aggregator',
                  displayField:   'name',
                  valueField:     'value',
                  value:          this.aggregator,
                  store:          new Ext.data.JsonStore({
                      fields : ['name', 'value'],
                      data   : [
                          {name : 'Sum',     value: 'sum'},
                          {name : 'Count',   value: 'count'},
                          {name : 'Min',     value: 'min'},
                          {name : 'Max',     value: 'max'},
                          {name : 'Average', value: 'avg'}
                      ]
                    })
                }
            ]
        });
        
        /**
         * @property leftAxisGrid
         * @type pivot.AxisGrid
         */
        this.leftAxisGrid = new pivot.AxisGrid({
            title : 'Left Axis',
            fields: fields,
            
            dimensionData: this.leftAxisDimensions || [],
            hasWidthField: true
        });
        
        /**
         * @property topAxisGrid
         * @type pivot.AxisGrid
         */
        this.topAxisGrid = new pivot.AxisGrid({
            title : 'Top Axis',
            fields: fields,
            
            dimensionData: this.topAxisDimensions || []
        });
        
        Ext.applyIf(this, {
            items: [
                this.form,
                this.topAxisGrid,
                this.leftAxisGrid
            ],
            
            bbar: [
                {
                    icon   : '../shared/icons/fam/accept.png',
                    text   : 'Update',
                    scope  : this,
                    handler: this.updateGrid
                }
            ]
        });
        
        pivot.ConfigPanel.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * @private
     * Retrieves the configured axis dimensions for the top and left grids and updates the PivotGrid accordingly
     */
    updateGrid: function() {
        var leftDimensions = [],
            topDimensions  = [],
            leftGridItems  = this.leftAxisGrid.store.data.items,
            topGridItems   = this.topAxisGrid.store.data.items,
            formValues     = this.form.form.getValues(),
            i;
        
        for (i = 0; i < leftGridItems.length; i++) {
            leftDimensions.push({
                dataIndex: leftGridItems[i].get('field'),
                direction: leftGridItems[i].get('direction'),
                width    : leftGridItems[i].get('width')
            });
        }
        
        for (i = 0; i < topGridItems.length; i++) {
            topDimensions.push({
                dataIndex: topGridItems[i].get('field'),
                direction: topGridItems[i].get('direction')
            });
        }
        
        this.fireEvent('update', {
            leftDimensions: leftDimensions,
            topDimensions : topDimensions,
            aggregator    : formValues.aggregator,
            measure       : formValues.measure
        });
    },
    
    /**
     * Extracts the field names from the configured record
     * @return {Array} The set of Record fields
     */
    getRecordFields: function() {
        return Ext.pluck(this.record.prototype.fields.items, 'name');
    },
    
    /**
     * @private
     * @return {Ext.data.Store} The store
     */
    getMeasureStore: function() {
        /**
         * @property measureStore
         * @type Ext.data.JsonStore
         * The store bound to the combo for selecting the field
         */
        if (this.measureStore == undefined) {
            var fields = [],
                measures = this.measures,
                length   = measures.length,
                i;
            
            for (i = 0; i < length; i++) {
                fields[i] = [measures[i]];
            }
            
            this.measureStore = new Ext.data.ArrayStore({
                fields: ['name'],
                data  : fields
            });
        }
        
        return this.measureStore; 
    }
});

Ext.reg('pivotconfig', pivot.ConfigPanel);
Ext.onReady(function() {
    var SaleRecord = Ext.data.Record.create([
        {name: 'product',  type: 'string'},
        {name: 'city',     type: 'string'},
        {name: 'state',    type: 'string'},
        {name: 'month',    type: 'int'},
        {name: 'quarter',  type: 'int'},
        {name: 'year',     type: 'int'},
        {name: 'quantity', type: 'int'},
        {name: 'sales',    type: 'int'}
    ]);
    
    var myStore = new Ext.data.Store({
        data: buildData(100),
        reader: new Ext.data.JsonReader({}, SaleRecord)
    });
    
    var pivotGrid = new Ext.grid.PivotGrid({
        store     : myStore,
        aggregator: 'sum',
        measure   : 'sales',
        
        viewConfig: {
            forceFit: true
        },
        
        columns: [
            {dataIndex: 'product',  header: 'Product'},
            {dataIndex: 'city',     header: 'City'},
            {dataIndex: 'state',    header: 'State'},
            {dataIndex: 'month',    header: 'Month'},
            {dataIndex: 'quarter',  header: 'Quarter'},
            {dataIndex: 'year',     header: 'Year'},
            {dataIndex: 'quantity', header: 'Quantity'},
            {dataIndex: 'sales',    header: 'Sales'}
        ],
        
        leftAxis: [
            {
                title: 'Region',
                dataIndex: 'region'
            },
            {
                title: 'Product',
                dataIndex: 'product'
            },
            {
                title: 'Salesperson',
                dataIndex: 'person'
            }
        ],
        
        topAxis: [
            {
                title: 'Year',
                dataIndex: 'year'
            },
            {
                title: 'Quarter',
                dataIndex: 'quarter'
            }
        ]
    });
    
    var win = new Ext.Window({
        title : 'Sales by Region',
        height: 400,
        width : 1000,
        items : pivotGrid,
        layout: 'fit'
    });
    
    win.show();
    
    // var schema = new Ext.data.OlapSchema({
    //         dimensions: [
    //             {
    //                 name: 'Customer',
    //                 dataIndex: 'customer',
    //                 //default
    //                 hierarchy: 'customer'
    //             },
    //             {
    //                 name: 'Time',
    //                 dataIndex: 'quarter',
    //                 hierarchy: [
    //                     {
    //                         name: 'month',
    //                         dataIndex: 'month'
    //                     },
    //                     {
    //                         name: 'quarter',
    //                         dataIndex: 'quarter'
    //                     },
    //                     {
    //                         name: 'year',
    //                         dataIndex: 'year'
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 'Location',
    //                 dataIndex: 'city',
    //                 hierarchy: [
    //                     {
    //                         name: 'city',
    //                         dataIndex: 'city'
    //                     },
    //                     {
    //                         name: 'state',
    //                         dataIndex: 'state'
    //                     }
    //                 ]
    //             }
    //         ],
    //         measures: [
    //             {
    //                 name: 'Revenue',
    //                 dataIndex: 'revenue',
    //                 aggregator: 'sum'
    //             }
    //         ]
    //     });
    //     
    //     var pivotGrid = new Ext.grid.PivotGrid({
    //         store : myStore,
    //         schema: schema
    //     });
    
    
    function buildData(count) {
        count = count || 1000;
        
        var products = ['Ladder', 'Spanner', 'Chair', 'Hammer'],
            states   = ['CA', 'NY', 'UK', 'AZ', 'TX'],
            cities   = ['San Francisco', 'Palo Alto', 'London', 'Austin'],
            records  = [],
            i;
        
        for (i = 0; i < count; i++) {
            records.push(new SaleRecord({
                product : products[Math.floor(Math.random() * products.length)],
                city    : cities[Math.floor(Math.random() * cities.length)],
                state   : states[Math.floor(Math.random() * states.length)],
                quantity: Math.floor(Math.random() * 10000),
                sales   : Math.floor(Math.random() * 50),
                month   : Math.ceil(Math.random() * 12),
                quarter : Math.ceil(Math.random() * 4),
                year    : 2010 - Math.floor(Math.random() * 5)
            }));
        }
        
        return records;
    };
});

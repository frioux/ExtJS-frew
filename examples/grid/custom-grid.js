Ext.onReady(function(){
    var propsGrid = new Ext.grid.PropertyGrid({
        nameText: 'Properties Grid',
        width:300,
        autoHeight:true,
        viewConfig : {
            forceFit:true,
            scrollOffset:2 // the grid will never have scrollbars
        }
    });

    propsGrid.render('props-grid');

    propsGrid.setSource({
        "(name)": "Properties Grid",
        "grouping": false,
        "autoFitColumns": true,
        "productionQuality": false,
        "created": new Date(Date.parse('10/15/2006')),
        "tested": false,
        "version": .01,
        "borderWidth": 1
    });
});
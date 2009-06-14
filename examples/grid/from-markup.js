Ext.onReady(function(){
    var btn = Ext.get("create-grid");
    btn.on("click", function(){
        btn.dom.disabled = true;
        
        // create the grid
        var grid = new Ext.ux.grid.TableGrid("the-table", {
            stripeRows: true // stripe alternate rows
        });
        grid.render();
    }, false, {
        single: true
    }); // run once
});

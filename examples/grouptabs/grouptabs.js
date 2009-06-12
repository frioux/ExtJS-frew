Ext.onReady(function() {
	Ext.QuickTips.init();
    
    // create some portlet tools using built in Ext tool ids
    var tools = [{
        id: 'gear',
        handler: function(){
            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
        }
    },{
        id: 'close',
        handler: function(e, target, panel){
            panel.ownerCt.remove(panel, true);
        }
    }];
    
    var dashboard = [{
        columnWidth: 0.33,
        style: 'padding:10px 0 10px 10px',
        items:[{
            title: 'Grid in a Portlet',
            layout: 'fit',
            tools: tools,
            items: new SampleGrid([0, 2, 3])
        },{
            title: 'Another Panel 1',
            tools: tools,
            html: Ext.example.shortBogusMarkup
        }]
    },{
        columnWidth: 0.33,
        style: 'padding:10px 0 10px 10px',
        items:[{
            title: 'Panel 2',
            tools: tools,
            html: Ext.example.shortBogusMarkup
        },{
            title: 'Another Panel 2',
            tools: tools,
            html: Ext.example.shortBogusMarkup
        }]
    },{
        columnWidth: 0.33,
        style: 'padding:10px',
        items:[{
            title: 'Panel 3',
            tools: tools,
            html: Ext.example.shortBogusMarkup
        },{
            title: 'Another Panel 3',
            tools: tools,
            html: Ext.example.shortBogusMarkup
        }]
    }];
    
    var tab1 = {
		mainItem: 1, // make 'Dashboard' title of tab instead of the first item ('Tickets')
		items: [{
			title: 'Tickets',
            layout: 'fit',
            iconCls: 'x-icon-tickets',
            tabTip: 'Tickets tabtip',
            style: 'padding: 10px;',
			items: [{
                layout: 'fit',
                title: 'A sample grid',
                items: [new SampleGrid([0,1,2,3,4])], // defined in portal/sample-grid.js
                hideBorders: true
            }]
		}, 
        {
            title: 'Dashboard',
            xtype: 'portal',
            tabTip: 'Dashboard tabtip',
            items: dashboard                    
        }, {
			title: 'Subscriptions',
            iconCls: 'x-icon-subscriptions',
            tabTip: 'Subscriptions tabtip',
            style: 'padding: 10px;',
			html: 'Subscriptions content here'			
		}, {
			title: 'Users',
            iconCls: 'x-icon-users',
            tabTip: 'Users tabtip',
            style: 'padding: 10px;',
			html: 'Users content here'			
		}]
    };
    
    var tab2 = {
        expanded: false, // default is to expand the GroupTab
        items: [{
            title: 'Configuration',
            iconCls: 'x-icon-configuration',
            tabTip: 'Configuration tabtip',
            style: 'padding: 10px;',
            html: Ext.example.shortBogusMarkup 
        }, {
            title: 'Email Templates',
            iconCls: 'x-icon-templates',
            tabTip: 'Templates tabtip',
            style: 'padding: 10px;',
            html: Ext.example.shortBogusMarkup
        }]
    };

    // create the UI using the parts above
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items:[{
            xtype: 'grouptabpanel',
    		tabWidth: 130,
    		activeGroup: 0,
    		items: [
                tab1, 
                tab2
            ]
		}]
    });
});

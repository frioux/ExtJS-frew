Ext.onReady(function(){
    var store = new Ext.data.SimpleStore({
        fields: ['code', 'language'],
        data : Ext.exampledata.languages // from languages.js
    });
    var combo = new Ext.form.ComboBox({
        store: store,
        displayField:'language',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Select a language...',
        selectOnFocus:true,
	onSelect: function(record) {
	    //Ext.Msg.alert("Language selected", "Language: "+record.get("language")+" (code: "+record.get("code")+")");
	    window.location = "?lang="+record.get("code");
	}
    });
    combo.applyTo('languages');
});

Ext.onReady(function(){
    function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    };
    // shorthand alias
    var fm = Ext.form, Ed = Ext.grid.GridEditor;
    // the column model has information about grid columns
    // dataIndex maps the column to the specific data field in
    // the data store (created below)
    var cm = new Ext.grid.ColumnModel([{
           header: "&nbsp;",
           dataIndex: 'common',
           width: 220,
           editor: new Ed(new fm.TextField({
               allowBlank: false
           }))
        },{
           header: "&nbsp;",
           dataIndex: 'availDate',
           width: 95,
           renderer: formatDate,
           editor: new Ed(new fm.DateField({
                format: 'm/d/y',
                minValue: '01/01/06',
                disabledDays: [0, 6],
                disabledDaysText: 'Plants are not available on the weekends'
            }))
        }]);

    // by default columns are sortable
    cm.defaultSortable = true;

    // this could be inline, but we want to define the Plant record
    // type so we can add records dynamically
    var Plant = Ext.data.Record.create([
           {name: 'common', type: 'string'},
           {name: 'date', type: 'date', dateFormat: 'm/d/Y'},
      ]);

    // create the Data Store
    var ds = new Ext.data.SimpleStore({
        fields: ['common', 'date']
    });

    // create the editor grid
    var grid = new Ext.grid.EditorGrid('editor-grid', {
        ds: ds,
        cm: cm,
        selModel: new Ext.grid.RowSelectionModel(),
        enableColLock:false
    });

    var layout = Ext.BorderLayout.create({
        center: {
            margins:{left:3,top:3,right:3,bottom:3},
            panels: [new Ext.GridPanel(grid)]
        }
    }, 'grid-panel');

    // render it
    grid.render();

    var gridHead = grid.getView().getHeaderPanel(true);
    var tb = new Ext.Toolbar(gridHead, [{
        text: '',
	cls: 'x-btn-text-icon add',
        handler : function(){
	    Ext.Msg.prompt('', '', function(btn, text) {
		if (btn=="ok") {
        	    var p = new Plant({
        	        common: text,
    	    	        availDate: new Date(),
        	    });
    	    	    grid.stopEditing();
    		    ds.insert(0, p);
    	    	    grid.startEditing(0, 0);
		}
	    });
        }
    },{
        text: '',
	cls: 'x-btn-text-icon delete',
        handler : function(){
	    var sm = grid.getSelectionModel();
	    if (sm.getCount()>0) {
		var record = sm.getSelected();
		Ext.Msg.show({
		    title: record.get("common"),
		    msg: record.get("common"),
		    buttons: Ext.Msg.OKCANCEL,
		    fn:  function(btn, text) {
			if (btn=="ok") {
    	    		    grid.stopEditing();
    		    	    ds.remove(record);
    	    		    //grid.startEditing(0, 0);
			}
		    }
		});
	    }
        }
    }]);

    // trigger the data store load
    //ds.load();
});

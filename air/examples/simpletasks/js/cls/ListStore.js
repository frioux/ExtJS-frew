
tx.data.ListStore = Ext.extend(Ext.data.SQLiteStore, {
	autoSave: true,
	autoCreateTable: true,
	batch: true,
	constructor: function(){
		tx.data.ListStore.superclass.constructor.call(this, {
			sortInfo: {field: 'listName', direction: 'ASC'},
			fields: tx.data.List,
			conn: tx.data.conn,
			tableName: 'list',
			idProperty: 'listId'
		});
		this.boundTrees = {};
	},
    getName : function(id) {
    	var r = this.getById(id);
    	return r ? r.get('listName') : '';
	},
	addList : function(name, id, isFolder, parentId){
		var l = this.findList(name);
		if(!l){
			var id = id || Ext.uniqueId();
			l = new tx.data.List({listId: id, listName: name, isFolder: isFolder === true, parentId: parentId || 'root'}, id);
			l.phantom = true; // should be added to database
			this.add(l);
		}
		return l;
	},
	
	newList : function(isFolder, parentId){
		var i = 1;
		var text = isFolder ? 'New Folder ' : 'New List '; 
		while(this.findList(text + i)){
			i++;
		}
		return this.addList(text + i, undefined, isFolder, parentId);
	},
	
	findList : function(name) {
		var i = this.findExact('listName', name);
		return i != -1 ? this.getAt(i) : null;
	},
	
	loadDemoLists: function(){
		this.addList('Personal', 'personal', true, 'root');
		this.addList('Family', 'family', false, 'personal');
		this.addList('Bills', 'bills', false, 'personal');
		this.addList('Fun', 'fun', false, 'personal');
		this.addList('Other Stuff', 'personal-misc', false, 'personal');
		this.addList('Work', 'work', true, 'root');
		this.addList('Ext 2.x', 'ext2', false, 'work');
		this.addList('Ext 1.x', 'ext1', false, 'work');
		this.addList('Meetings', 'meetings', false, 'work');
		this.addList('Miscellaneous', 'work-misc', false, 'work');
	},
	
	bindTree : function(tree){
		this.boundTrees[tree.id] = {
			save: function(store, batch, data) {
				if (data.create && data.create.length > 0) {
					var pnode = tree.getNodeById(data.create[0].parentId);
					if (pnode) {
						pnode.reload();
					}
				}
			},
			
			remove: function(ls, record){
				var node = tree.getNodeById(record.id);
				if(node && node.parentNode){
					node.parentNode.removeChild(node);
				}
			},
			
			update: function(ls, record){
				var node = tree.getNodeById(record.id);
				if(node){
					node.setText(record.data.listName);
				}
			}
		};
		
		this.on(this.boundTrees[tree.id]);
	},
	
	unbindTree : function(tree){
		var h = this.boundTrees[tree.id];
		if (h) {
			this.un('save', h.save);
			this.un('remove', h.remove);
			this.un('update', h.update);
		}
	},
	
	prepareTable : function(){
        try{
	        this.createTable({
	            name: 'list',
	            key: 'listId',
	            fields: tx.data.List.prototype.fields
	        });
        }catch(e){
			console.log(e);
		}
    }
});

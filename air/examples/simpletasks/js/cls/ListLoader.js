tx.tree.ListLoader = function(config){
	Ext.apply(this, config);
};

Ext.extend(tx.tree.ListLoader, Ext.util.Observable, {
	keyAttribute: 'id',
	keyField: 'parentId',
	
	load: function(node, callback){
		var v = node.attributes[this.keyAttribute];
		
		if (node.isRoot) {
			this.store.load({
				callback: function(records, options, success) {
					if (success === true) {
						this.appendNodes(node, v);
						if (Ext.isFunction(callback)) {
							callback(this, node);
						}
					}
				},
				scope: this
			});
		} else {
			this.appendNodes(node, v);
			if (Ext.isFunction(callback)) {
				callback(this, node);
			}
		}
	},
	appendNodes: function(node, key) {
		var records = this.store.queryBy(function(r) {
			return r.get(this.keyField) == key;
		}, this);
		node.beginUpdate();
		records.each(function(r) {
			var n = this.createNode(r);
			if (n) {
				node.appendChild(n);
			}
		}, this);
		node.endUpdate();
	},
	
	createNode : function(record){
		var d = record.data, n;
		if(d.isFolder){
			n = new Ext.tree.AsyncTreeNode({
				loader: this,
				id: record.id,
				text: d.listName,
				leaf: false,
				iconCls: 'icon-folder',
				editable: true,
				expanded: true,
				isFolder: true
			});
		}else{
			n = new Ext.tree.TreeNode({
				id: record.id,
				text: d.listName,
				leaf: true,
				iconCls: 'icon-list',
				editable: true
			});
		}
		return n;
	}
});

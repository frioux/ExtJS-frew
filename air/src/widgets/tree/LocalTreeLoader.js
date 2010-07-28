/**
 * @class Ext.tree.LocalTreeLoader
 * @extends Ext.tree.TreeLoader
 * A TreeLoader, that provides for lazy loading of {@link Ext.tree.TreeNode}'s child
 * nodes via a specified function  
 * @constructor
 * Creates a new LocalTreeloader.
 * @param {Object} config A config object containing config properties.
 */
Ext.tree.LocalTreeLoader = Ext.extend(Ext.tree.TreeLoader, {
	/**
	 * @cfg {Function} dataFn
	 * Method that should be overridden to load child nodes on the current node.
	 * @param {Object} node The current node, on which the function is called
	 * @return {Array} Array of child nodes	 
	 */
	dataFn: Ext.emptyFn,
	// private
	requestData: function(node, callback, scope) {
		if (this.fireEvent("beforeload", this, node, callback) !== false) {
			var response = (this.dataFn || this.fn).call(this, node);
			this.processResponse(response, node, callback, scope);
			this.fireEvent("load", this, node, response);
		} else this.runCallback(callback, scope || node, []);
	},
	// private
	processResponse: function(response, node, callback, scope) {
		// response is an array!
		try {
			node.beginUpdate();
			for (var i = 0, len = response.length; i < len; i++) {
				var n = this.createNode(response[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [node]);
		} catch(e) {
			this.handleFailure({
				argument: {
					node: node,
					callback: callback,
					scope: scope
				},
				response: response
			});
		}
	},
	// private
	load: function(node, callback, scope){
		if (this.clearOnLoad) {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
		}
		if (this.doPreload(node)) { // preloaded json children
			this.runCallback(callback, scope || node, [node]);
		} else if (this.dataFn || this.fn) {
			this.requestData(node, callback, scope || node);
		}
	}		
});

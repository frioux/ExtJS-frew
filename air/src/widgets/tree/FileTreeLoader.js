/**
 * @class Ext.tree.FileTreeLoader
 * @extends Ext.tree.LocalTreeLoader
 * A TreeLoader, that provides lazy loading of {@link Ext.tree.TreeNode}'s child
 * nodes from a specified directory on the file system.  
 * @constructor
 * Creates a new FileTreeloader.
 * @param {Object} config A config object containing config properties.
 */
Ext.tree.FileTreeLoader = function(config) {
	Ext.tree.FileTreeLoader.superclass.constructor.call(this, config);
	if (!this.directory) this.directory = air.File.desktopDirectory;
};
Ext.extend(Ext.tree.FileTreeLoader, Ext.tree.LocalTreeLoader, {
	/**
	 * @cfg {air.File} directory
	 * An air.File instance which specifies the root folder of the tree.
	 * Can be null, if you define the attribute "url" of the root node
	 * (what is recommended). Set it to <code>'root'</code> if you want to load the
	 * air.File.getRootDirectories() as first level. On Windows, these directories
	 * are applied under the root node. On Linux and Max, there's only one root directory '/'.
	 * That's why setting directory to <code>'root'</code> will display the first level
	 * under '/' as first level under the root directory.
	 */
	/**
	 * @cfg {Boolean} showHidden
	 * True to show hidden files and directories, false to not show them
	 * (defaults to <code>false</code>).
	 */
	showHidden: false,
	/**
	 * @cfg {Array/String/Boolean} extensionFilter
	 * An extension or an array of extensions (lowercase), that files should have,
	 * if they should be displayed, or false, if all files should be displayed
	 * (defaults to <code>false</code>).
	 */
	extensionFilter: false,
	/**
	 * @cfg {Boolean} dirOnly
	 * <code>true</code> to allow only directories to be displayed
	 * (defaults to <code>false</code>).
	 */
	dirOnly: false,
	/**
	 * @cfg {Array/String} skipNames
	 * A file or directory name or an array of file or directory names,
	 * that should not be displayed (defaults to <code>[]</code>).
	 * e.g.:	 
	 * <pre><code>['System Volume Information', 'RECYCLER', '$RECYCLE.BIN']</code></pre>
	 */
	skipNames: [],
	/**
	 * @cfg {Boolean} checkLeaf
	 * <code>true</code> to check directories for child nodes and hide the expand icon,
	 * if there aren't childs (defaults to <code>false</code>, which alwasy displays
	 * the expand icon initially, but increases performance).
	 */
	checkLeaf: false,
	/**
	 * Override this method to apply custom attributes to the given Ext.tree.TreeNode config option object.
	 * This is called for every node that becomes loaded by this Loader.
	 * By default this returns an object with the following properties:<div class="mdetail-params"><ul>
	 * <li><b>text</b>: The filename/directory name of this node</li>
	 * <li><b>url</b>: The url to this file/directory</li>
	 * <li><b>cls</b>: <code>'hidden'</code> if this file/directory is hidden, otherwise <code>''</code></li>
	 * <li><b>iconCls</b>:<ul>
	 * <li><code>'drive'</code> if it is a windows root directory</li>
	 * <li><code>'folder'</code> if it is a directory</li>
	 * <li><code>'file-&lt;extension&gt;'</code> for each file with its extension (lowercase)</li>
	 * <li><code>'file'</code> for files without extension</li></ul>
	 * <li><b>extension</b>: The file extension</li>
	 * <li><b>leaf</b>: True if it is a file or leaf directory (and {@link #checkLeaf} is true), otherwise false</li>
	 * </ul></div>
	 * @param {Object} node The node config option object to which you can apply custom attributes.
	 * This object already contains the attributes described above.
	 * @param {air.File} file The file/directory instance of this node
	 * @return {Object} The new config option object	 
	 */
	applyAttributes: function(node, file) {
		return node;
	},
	// private
	getNodeConfig: function(file, isWinRoot) {
		return this.applyAttributes({
			text: file.name,
			url: file.url,
			cls: file.isHidden ? 'hidden' : '',
			iconCls: isWinRoot ? 'drive' : (file.isDirectory ? 'folder' : 'file' + (file.extension ? '-' + file.extension.toLowerCase() : '')), // set icon to "folder" or "file-..." (e.g. "file-mp3") to allow easy custom icon css
			extension: file.extension,
			leaf: !file.isDirectory
		}, file);
	},
	// private
	onDirectoryListing: function(o, e) {
		var c = e.files,
			i,
			len = c.length,
			files = [];
		o.total = len;
		for (i = 0; i < len; i++) {
			if (this.isValidFile(c[i], o.isWinRoot)) {
				if (this.checkLeaf === true && c[i].isDirectory) {
					c[i].addEventListener(air.FileListEvent.DIRECTORY_LISTING, this.onCheckLeafListing.createDelegate(this, [o, files, c[i]], 0));
					c[i].getDirectoryListingAsync();
				} else {
					files.push(this.getNodeConfig(c[i], o.isWinRoot));
					if (files.length >= o.total) this.fireLoad(files, o.node, o.callback, o.scope);
				}
			} else {
				o.total--;
				if (files.length >= o.total) this.fireLoad(files, o.node, o.callback, o.scope);
			}
		}
	},
	// private
	onCheckLeafListing: function(o, files, file, e) {
		var c = e.files,
			len = c.length,
			j, leaf = true;
		for (j = 0; j < len; j++) {
			if (this.isValidFile(c[j], o.isWinRoot)) {
				leaf = false;
				break;
			}
		}
		files.push(Ext.apply(this.getNodeConfig(file, o.isWinRoot), {
			leaf: leaf
		}));
		if (files.length >= o.total) this.fireLoad(files, o.node, o.callback, o.scope);
	},
	/**
	 * checks, if the file or directory should be displayed
	 * @private		 
	 */
	isValidFile: function(file, isWinRoot) {
		return this.skipNames.indexOf(file.name) == -1 && (file.isDirectory || ((this.extensionFilter === false || this.extensionFilter.indexOf(Ext.value(file.extension, '').toLowerCase()) != -1) && this.dirOnly === false)) && (!file.isHidden || isWinRoot || this.showHidden === true);
	},
	// private
	requestData: function(node, callback, scope) {
		if (this.fireEvent("beforeload", this, node, callback) !== false) {
			(this.dataFn || this.fn).call(this, node, callback, scope);
		} else this.runCallback(callback, scope || node, []);
	},
	// private
	fireLoad: function(files, node, callback, scope) {
		this.processResponse(files, node, callback, scope);
		this.fireEvent("load", this, node, files);
	},
	// private
	dataFn: function(currNode, callback, scope) {
		var currDir,
			o = { // Object since it is needed for total (Objects are references, Numbers not)
				node: currNode,
				callback: callback,
				scope: scope,
				isWinRoot: false
			};
		
		if (currNode.attributes.url === '/' || currNode.attributes.url === 'file:///' || (Ext.isEmpty(currNode.attributes.url) && this.directory === '/')) {
			if (Ext.isWindows) {
				o.isWinRoot = true;
			} else currDir = air.File.getRootDirectories()[0];
		} else {
			if (currNode.attributes.url) {
				currDir = new air.File(currNode.attributes.url);
			} else currDir = this.directory.clone();
		}
		// make sure, extensionFilter and skipNames are arrays
		if (!Ext.isArray(this.extensionFilter) && this.extensionFilter !== false) this.extensionFilter = [this.extensionFilter];
		if (!Ext.isArray(this.skipNames)) this.skipNames = [this.skipNames];
		
		if (o.isWinRoot) {
			c = air.File.getRootDirectories();
			this.onDirectoryListing(o, {
				files: c
			});
		} else {
			currDir.addEventListener(air.FileListEvent.DIRECTORY_LISTING, this.onDirectoryListing.createDelegate(this, [o], 0));
			currDir.getDirectoryListingAsync();
		}
	}
});

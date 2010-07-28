/**
 * @class Ext.state.FileProvider
 * @extends Ext.state.Provider
 * A Provider implementation which saves state to a json file in the users application storage directory.
 * <br />Usage:
 <pre><code>
   var cp = new Ext.state.FileProvider({
       file: "myState.json"
   });
   Ext.state.Manager.setProvider(cp);
 </code></pre>
 * @constructor
 * Creates a new FileProvider
 * @param {Object} config The configuration object
 */
Ext.state.FileProvider = function(config){
	Ext.state.FileProvider.superclass.constructor.call(this);
	
	Ext.apply(this, config);
	this.state = this.readState();
	
	air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, this.saveState.createDelegate(this));
};
Ext.extend(Ext.state.FileProvider, Ext.state.Provider, {
	/**
	 * @cfg {String} file
	 * The file name to use for the state file in the application storage directory
	 * (defaults to <code>extstate.json</code>).	 
	 */
	file: 'extstate.json',
	// private
	readState : function(){
		var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file),
			stateData;
		if(stateFile.exists) {
			var stream = new air.FileStream();
			stream.open(stateFile, air.FileMode.READ);
			stateData = Ext.decode(stream.readUTFBytes(stream.bytesAvailable));
			stream.close();
		}
		return stateData || {};
	},
	// private
	saveState : function() {
		var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file);
		var stream = new air.FileStream();
		stream.open(stateFile, air.FileMode.WRITE);
		stream.writeUTFBytes(Ext.encode(this.state));
		stream.close();
	}
});
// backwards compat
Ext.air.FileProvider = Ext.state.FileProvider;

/**
 * @class Ext.air.NativeWindowGroup
 * A collection of NativeWindows.
 */
Ext.air.NativeWindowGroup = function(){
	var list = {};
	return {
		/**
		 * Registers a window with its id
		 * @param {Object} win
		 */
		register : function(win) {
			list[win.id] = win;
		},
		/**
		 * Unregisters a window
		 * @param {Object} win
		 */
		unregister : function(win){
			delete list[win.id];
		},
		/**
		 * Returns the Ext.air.NativeWindow with the given id or nativeWindow object
		 * @param {String/air.NativeWindow/window} id The id of the window or if it is a
		 * window/nativeWindow this function returns the corresponding Ext.air.NativeWindow
		 * @return {Ext.air.NativeWindow}
		 */
		get : function(id) {
			if (Ext.isString(id)) {
				return list[id];
			} else {
				id = id.nativeWindow || id;
				for (var key in list) {
					if (list.hasOwnProperty(key) && list[key].win == id) {
						return list[key];
					}
				}
			}
			return undefined;
		},
		/**
		 * Closes all windows
		 */
		closeAll : function(){
			for(var id in list){
				if(list.hasOwnProperty(id)){
					list[id].close();
				}
			}
		},
		/**
		 * Executes the specified function once for every window in the group, passing each
		 * window as the only parameter. Returning false from the function will stop the iteration.
		 * @param {Function} fn The function to execute for each item
		 * @param {Object} scope (optional) The scope in which to execute the function
		 */
		each : function(fn, scope){
			for(var id in list){
				if(list.hasOwnProperty(id)){
					if(fn.call(scope || list[id], list[id]) === false){
						return;
					}
				}
			}
		}
	};
};

/**
 * @class Ext.air.NativeWindowManager
 * @extends Ext.air.NativeWindowGroup
 * Collection of all NativeWindows created.
 * @singleton
 */
Ext.air.NativeWindowManager = new Ext.air.NativeWindowGroup();

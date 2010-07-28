/**
 * @class Ext.air.App
 * Provides quick access to application functions and objects
 * @singleton
 */
Ext.air.App = function() {
	return {
		/**
		 * Define, if the Application should autostart at os login.
		 * @param {Boolean} launch <code>true</code> to autostart the app at next os login,
		 * <code>false</code> to not autostart it
		 */
		launchOnStartup: function(launch) {
			air.NativeApplication.nativeApplication.startAtLogin = !!launch;
		},
		/**
		 * Define, if the Application should automatically exit, if the last window is closed.
		 * @param {Boolean} autoExit <code>true</code> to autoExit, if all windows are closed,
		 * <code>false</code> to not keep the app open
		 */
		autoExit: function(autoExit) {
			air.NativeApplication.nativeApplication.autoExit = !!autoExit;
		},
		/**
		 * Returns the active NativeWindow
		 * @return {Object} The active NativeWindow
		 */
		getActiveWindow: function() {
			return air.NativeApplication.nativeApplication.activeWindow;
		},
		/**
		 * Returns the NativeApplication object of the current app
		 * @return {Object} NativeApplication
		 */
		getNativeApplication: function() {
			return air.NativeApplication.nativeApplication;
		},
		/**
		 * Returns the first opened window in your application (main window)
		 * @return {Object} air.NativeWindow
		 */
		getRootWindow: function() {
			return air.NativeApplication.nativeApplication.openedWindows[0];
		},
		/**
		 * Returns the javascript "window" object of the first opened window in your application
		 * @return {Object} window
		 */
		getRootHtmlWindow: function() {
			return Ext.air.App.getRootWindow().stage.getChildAt(0).window;
		}
	};
}();

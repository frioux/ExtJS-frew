Ext.air.App = function() {
    return {
        launchOnStartup: function(launch) {
            air.NativeApplication.nativeApplication.startAtLogin = !!launch;
        },
        getActiveWindow: function() {
            return air.NativeApplication.activeWindow;
        }
    };
}();
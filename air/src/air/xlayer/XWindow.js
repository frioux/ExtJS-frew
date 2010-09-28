/**
 * EXPERIMENTAL - True to use a lightweight transparent fullscreen alwaysInFront window to display menus,
 * tooltips etc. (Layers in general) to allow overlapping of the current window size. Set this
 * <b>before</b> any <code>Ext.onReady</code> calls. Defaults to <code>false</code>.
 * Setting this to true can cause performance issues, especially when the app starts,
 * because Ext.onReady fires not until both, the current window and the layer window are ready.
 * @property USE_EXTENDED_LAYER
 * @type Boolean
 * @member Ext
 */
Ext.USE_EXTENDED_LAYER = false;

(function() {
	var root = Ext.air.App.getRootHtmlWindow(),
		count = 0; // counter, e.g. for submenus to not hide the XWindow if parent menu is still open
	// Only execute this function in root window
	
	window.nativeWindow.addEventListener('deactivate', function() {
		if (!Ext.air.App.getActiveWindow() && Ext.air.XWindow && !Ext.air.XWindow.getNative().closed) {
			Ext.air.XWindow.hide();
		}
	});
	
	if (root != window) {
		window.Ext.air.XWindow = root.Ext.air.XWindow;
		return;
	}

	if (!Ext.air.XWindow) {
		Ext.air.XWindow = new Ext.air.NativeWindow({
			type: air.NativeWindowType.LIGHTWEIGHT,
			parent: root.nativeWindow,
			systemChrome: air.NativeWindowSystemChrome.NONE,
			transparent: true,
			complete: false,
			maximizable: false,
			resizable: false,
			minimizable: false,
			draggable: false,
			hidden: true,
			alwaysInFront: true,
			closeAction: 'hide',
			fileQuery: {
				type: 'queryExt',
				root: root.document,
				includeAllCSS: true
			},
			manager: { // do not use a manager on this window, apply a pseudo
				register: Ext.emptyFn,
				unregister: Ext.emptyFn
			},
			show: function() {
				count++;
				Ext.air.NativeWindow.prototype.show.apply(this, arguments);
			},
			hide: function() {
				count--;
				if (count < 1) {
					count = 0;
					Ext.air.NativeWindow.prototype.hide.apply(this, arguments);
				}
			},
			listeners: {
				'complete': function(w) {
					var b = w.getDocument().body;
					b.scroll = 'no';
					b.style.overflow = 'hidden';
					w.fullscreen(true);
					w.complete = true;
				}
			}
		});
	}
		
	Ext.apply(Ext.EventManager, {
		onDocumentReady: Ext.EventManager.onDocumentReady.createInterceptor(function(fn, scope, options) {
			if (root.Ext.USE_EXTENDED_LAYER === true) {
				if (root.Ext.air.XWindow.complete) {
					root.Ext.air.XWindow.getWindow().Ext.EventManager.onDocumentReady(fn, scope || window, options);
				} else {
					root.Ext.air.XWindow.on('complete', function(w) {
						w.getWindow().Ext.EventManager.onDocumentReady(fn, scope || window, options);
					}, this, {single: true});
				}
				return false;
			}
		})
	});
	Ext.onReady(function() {
		// if we do not use XWindow, close it
		if (Ext.USE_EXTENDED_LAYER !== true && Ext.air.XWindow) {
			Ext.air.XWindow.close();
		}
	}, root, {single: true});
	
	Ext.onReady = Ext.EventManager.onDocumentReady;
})();

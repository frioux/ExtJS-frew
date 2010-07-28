/**
 * @class Ext.air.NativeWindow
 * @extends Ext.util.Observable
 * Wraps the AIR NativeWindow class to give an Ext friendly API. <br/><br/>This class also adds 
 * automatic state management (position and size) for the window (by id) and it can be used 
 * for easily creating "minimize to system tray" for the main window in your application.<br/><br/>
 * Note: Many of the config options for this class can only be applied to NEW windows. Passing 
 * in an existing instance of a window along with those config options will have no effect.
 * @constructor
 * @param {Object} config Config options for the window
 */
Ext.air.NativeWindow = function(config) {
	config = config || {};
	Ext.apply(this, config);

	this.id = this.id || Ext.id();
	this.openedWindows = [];
	
	this.addEvents(
		/**
		 * @event complete
		 * Fires once after the window has been loaded completely
		 * @param {Ext.air.NativeWindow} this
		 */
		'complete',
		/**
		 * @event activate
		 * Fires after the window has been activated
		 * @param {Ext.air.NativeWindow} this
		 */
		'activate',
		/**
		 * @event deactivate
		 * Fires after the window has been deactivated
		 * @param {Ext.air.NativeWindow} this
		 */
		'deactivate',
		/**
		 * @event beforeclose
		 * Fires before the window is closed. If a handler returns false, the close operation is canceled.
		 * @param {Ext.air.NativeWindow} this
		 */
		'beforeclose',
		/**
		 * @event close
		 * Fires after the window is closed.
		 * @param {Ext.air.NativeWindow} this
		 */
		'close',
		/**
		 * @event beforehide
		 * Fires before the window is hidden. If a handler returns false, the hide operation is canceled.
		 * @param {Ext.air.NativeWindow} this
		 */
		'beforehide',
		/**
		 * @event hide
		 * Fires after the window is hidden.
		 * @param {Ext.air.NativeWindow} this
		 */
		'hide',
		/**
		 * @event beforeshow
		 * Fires before the window is shown. If a handler returns false, the show operation is canceled.
		 * @param {Ext.air.NativeWindow} this
		 */
		'beforeshow',
		/**
		 * @event show
		 * Fires after the window is shown.
		 * @param {Ext.air.NativeWindow} this
		 */
		'show',
		/**
		 * @event maximize
		 * Fires after the window has been maximized.
		 * @param {Ext.air.NativeWindow} this
		 */
		'maximize',
		/**
		 * @event minimize
		 * Fires after the window has been minimized.
		 * @param {Ext.air.NativeWindow} this
		 */
		'minimize',
		/**
		 * @event restore
		 * Fires after the window has been restored to its original size after being maximized.
		 * @param {Ext.air.NativeWindow} this
		 */
		'restore',
		/**
		 * @event titlechange
		 * Fires after the window title has changed.
		 * @param {Ext.air.NativeWindow} this
		 * @param {String} title The new window title
		 */
		'titlechange',
		/**
		 * @event move
		 * Fires after the window has moved.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Number} x the new x position
		 * @param {Number} y the new y position	
		 */
		'move',
		/**
		 * @event resize
		 * Fires after the window has been resized.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Number} width the new width of this window
		 * @param {Number} height the new height of this window	
		 */
		'resize',
		/**
		 * @event beforestaterestore
		 * Fires before the state of the window is restored. Return false from an event handler to stop the restore.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values returned from the StateProvider. If this
		 * event is not vetoed, then the state object is passed to <b><tt>applyState</tt></b>. By default,
		 * that simply copies property values into this Component. The method maybe overriden to
		 * provide custom state restoration.
		 */
		'beforestaterestore',
		/**
		 * @event staterestore
		 * Fires after the state of the window is restored.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values returned from the StateProvider. This is passed
		 * to <b><tt>applyState</tt></b>. By default, that simply copies property values into this
		 * Component. The method maybe overriden to provide custom state restoration.
		 */
		'staterestore',
		/**
		 * @event beforestatesave
		 * Fires before the state of the window is saved to the configured state provider. Return false to stop the save.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values. This is determined by calling
		 * <b><tt>getState()</tt></b> on the Ext.air.NativeWindow.
		 */
		'beforestatesave',
		/**
		 * @event statesave
		 * Fires after the state of the window is saved to the configured state provider.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values. This is determined by calling
		 * <b><tt>getState()</tt></b> on the Ext.air.NativeWindow.
		 */
		'statesave',
		/**
		 * @event fullscreen
		 * Fires after the the window entered or left fullscreen mode.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Boolean} fullscreen True, if the window entered fullscreen mode, false if it left fullscreen mode.
		 */
		'fullscreen'
	);
	
	Ext.air.NativeWindow.superclass.constructor.call(this, config);
	
	// creating new NativeWindow
	if(!this.win){
		
		if (!Ext.isDefined(this.file) && !Ext.isDefined(this.html)) {
			this.queryFiles();
		}
		
		var options = new air.NativeWindowInitOptions();
		options.systemChrome = this.systemChrome;
		options.type = this.type;
		options.resizable = !!this.resizable;
		options.minimizable = !!this.minimizable;
		options.maximizable = !!this.maximizable;
		options.transparent = !!this.transparent && (this.systemChrome != air.NativeWindowSystemChrome.STANDARD);
		this.loader = air.HTMLLoader.createRootWindow(false, options, false);
		// if trusted and Air >= 1.5, allow css and script access
		if (this.trusted === true && !Ext.isAir1) this.loader.placeLoadStringContentInApplicationSandbox = true;
		if (this.file) {
			this.loader.load(new air.URLRequest(this.file));	
		} else {
			this.loader.loadString(this.html || '');
		}
		this.win = this.loader.window.nativeWindow;
	} else {
		Ext.apply(this, {
			loader: this.win.stage.getChildAt(0),
			maximizable: this.win.maximizable,
			minimizable: this.win.minimizable,
			resizable: this.win.resizable,
			minWidth: Ext.isNumber(config.minWidth) ? config.minWidth : this.win.minSize.x,
			minHeight: Ext.isNumber(config.minHeight) ? config.minHeight : this.win.minSize.y,
			maxWidth: Ext.isNumber(config.maxWidth) ? config.maxWidth : this.win.maxSize.x,
			maxHeight: Ext.isNumber(config.maxHeight) ? config.maxHeight : this.win.maxSize.y
		});
		Ext.applyIf(this, {
			width: this.win.width,
			height: this.win.height,
			x: this.win.x,
			y: this.win.y
		});
	}

	// restore state
	if (this.stateful !== false) {
		this.initState();
	}
	
	this.toggleAlwaysInFront(this.alwaysInFront);
	
	// set min and max sizes
	this.win.minSize = new air.Point(
		Ext.isNumber(this.minWidth) ? Math.max(0, this.minWidth) : 200,
		Ext.isNumber(this.minHeight) ? Math.max(0, this.minHeight) : 100
	);
	this.win.maxSize = new air.Point(
		Ext.isNumber(this.maxWidth) ? Math.max(0, this.maxWidth) : air.NativeWindow.systemMaxSize.x,
		Ext.isNumber(this.maxHeight) ? Math.max(0, this.maxHeight) : air.NativeWindow.systemMaxSize.y
	);
	
	// restore saved position and size
	var width = (this.width || 0).constrain(this.win.minSize.x, this.win.maxSize.x),
		height = (this.height || 0).constrain(this.win.minSize.y, this.win.maxSize.y);
	this.setSize(width, height);
	this.center().setPosition(this.x || this.win.x, this.y || this.win.y);
	
	this.on('complete', this.ensureActive, this, {single: true});
	
	// Functions for applyParentWindow
	this.closeOnParentFn = (function() {
		this.parentWin.removeEventListener(air.Event.CLOSE, this.closeOnParentFn);
		this.close();
	}).createDelegate(this);
	this.activateModalOnParentFn = (function() {
		if (this.modal && this.isVisible()) this.setActive(true);
	}).createDelegate(this);
	this.activateParentOnCloseFn = (function() {
		this.parentWin.removeEventListener(air.Event.ACTIVATE, this.activateModalOnParentFn);
		if (this.modal) this.parentWin.activate();
	}).createDelegate(this);
	this.parentWin = null;
	this.applyParentWindow(this.parent);
	
	this.initEvents();
	// register in manager
	if (!this.manager) {
		try { // try to use one Manager for all windows, no matter in what window they were opened
			this.manager = Ext.air.App.getRootHtmlWindow().Ext.air.NativeWindowManager;
		} catch(e) {
			this.manager = Ext.air.NativeWindowManager;
		}
	}
	this.manager.register(this);
	
	if(this.minimizeToTray) {
		this.initMinimizeToTray(this.trayIcon, this.trayMenu);
	}
};
Ext.extend(Ext.air.NativeWindow, Ext.util.Observable, {
	/**
	 * @cfg {air.NativeWindow/Boolean} parent
	 * The parent window that should be applied to this window. See {@link #applyParentWindow} for more information.
	 * Defaults to <code>undefined</code>.
	 */
	/**
	 * @cfg {Boolean} destroyOnParentClose
	 * True to destroy this window, if its parent window (current active window when this window is created)
	 * is closed (defaults to <code>true</code>). This is useful for windows with {@link #closeAction} 'hide'.
	 */
	/**
	 * @cfg {Number} height
	 * The height of this window.
	 */
	/**
	 * @cfg {Number} width
	 * The width of this window.
	 */
	/**
	 * @cfg {Number} x
	 * The X position of the left edge of the window on initial showing.
	 * Defaults to centering the Window within the width of the desktop.
	 */
	/**
	 * @cfg {Number} y
	 * The Y position of the top edge of the window on initial showing.
	 * Defaults to centering the Window within the height of the desktop.
	 */
	/**
	 * @cfg {String} title
	 * The title to display in the window header and taskbar button.
	 */
	/**
	 * @cfg {String} html
	 * A html string, that should be used as the window's content, if {@link #file}
	 * is not defined. Defaults to an empty string <code>''</code>.
	 */
	/**
	 * @cfg {String} file
	 * (optional) An url to a file, that should be loaded as the window's content.
	 */
	/**
	 * @cfg {Object} fileQuery
	 * If you don't specify the config options {@link #file} and {@link #html}, you have the possibility
	 * to query for default JavaScript and CSS files from the current document and include them
	 * in the new window's document. fileQuery is expected as Object with the following properties:
	 * <div class="mdetail-params"><ul>
	 * <li><b>type</b>: String (required)<div class="sub-desc">The type of functionality to query for the files.
	 * It can be:<ul>
	 * <li><code>main</code><div class="sub-desc">Use the current main file from application.xml as {@link #file}
	 * property and add the current window id as "window" property in querystring (e.g. main.html?window=myWindowId).</div></li>
	 * <li><code>queryExtJS</code><div class="sub-desc">Include all CSS and JavaScript files which belong
	 * to the ExtJS Framework. It includes ext-base.js, ext-basex.js, ext-all.js, ext-all.css and all debug versions
	 * of these files as well as ext-lang files.</div></li>
	 * <li><code>queryExtAIR</code><div class="sub-desc">Include all CSS and JavaScript files which belong
	 * to the ExtAir adapter. It includes AIRAliases.js, AIRIntrospector.js, ext-air.js, ext-air-debug.js, ext-air.css
	 * and all ext-air language files.</div></li>
	 * <li><code>queryExt</code><div class="sub-desc">Like "queryExtJS" AND "queryExtAIR".</div></li>
	 * <li><code>queryRegex</code><div class="sub-desc">Include all CSS and JavaScript files that match the
	 * given regular expression. This requires a "regex" property.</div></li>
	 * <li><code>queryAttribute</code><div class="sub-desc">Include all CSS and JavaScript files that contain the
	 * given attribute in "ext" namespace. This requires an "attribute" property.<br />
	 * E.g. if attribute is <code>'window_required'</code>, all files with <code>ext:window_required="true"</code>
	 * are included, like<br />
	 * <code>&lt;script type="text/javascript" src="ext-all.js" ext:window_required="true"&gt;&lt;/script&gt;</code>.</div></li>
	 * <li><code>querySelector</code><div class="sub-desc">Include all CSS and JavaScript files that match the
	 * given {@link Ext.DomQuery} selector. This requires a "selector" property.</div></li>
	 * <li><code>queryAll</code><div class="sub-desc">Includes all CSS and JavaScript files from the current document.</div></li>
	 * </ul></li>
	 * <li><b>regex</b>: RegExp (required if type is "queryRegex")<div class="sub-desc">A regular expression, that files should
	 * match, if they should be included.</div></li>
	 * <li><b>attribute</b>: String	 (required if type is "queryAttribute")<div class="sub-desc">An attribute name
	 * that all files should have in the "ext" namespace with a "true" value if they should be included
	 * (see <code>type</code> for more information).</div></li>
	 * <li><b>selector</b>: String (required if type is "querySelector")<div class="sub-desc">An {@link Ext.DomQuery} selector
	 * that files should match, if they should be included.</div></li>
	 * <li><b>css</b>: Boolean<div class="sub-desc"><code>false</code> if CSS files should not be included
	 * (defaults to <code>true</code>).</div></li>
	 * <li><b>js</b>: Boolean<div class="sub-desc"><code>false</code> if JavaScript files should not be included
	 * (defaults to <code>true</code>).</div></li>
	 * <li><b>root</b>: Node/String<div class="sub-desc">An optional start node (or id) for all query-types
	 * (defaults to the current document).</div></li>
	 * <li><b>include</b>: Array/String<div class="sub-desc">An optinal single or an array of additional
	 * js and css files to include after the queried files (if type != 'main').</div></li></ul></div>
	 * Defaults to <pre><code>
{
	type: 'queryExt',
	root: Ext.air.App.getRootHtmlWindow().document
}
	 * </code></pre>
	 */
	fileQuery: {
		type: 'queryExt',
		root: Ext.air.App.getRootHtmlWindow().document
	},
	/**
	 * @cfg {air.NativeWindow} win
	 * (optional) You can define a native window instance, if you want to wrap an existing one into
	 * an Ext.air.Window. Use this especially for the root window. If you define this property, you have
	 * to make sure, that the ext library is already loaded. There's no need for the {@link #file} property
	 * in that case. Example Usage:<pre><code>
var win = new Ext.air.Window({
	win: window.nativeWindow,
	stateId: 'mainwindow',
	border: true,
	title: 'Main Window',
	html: 'This is my little window.'
});
	 * </code></pre>
	 */
	/**
	 * @cfg {String} id
	 * The unique id of this window (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the window later
	 * via its manager and you do not have an object reference available.
	 */
	/**
	 * @cfg {Ext.air.NativeWindowGroup} manager
	 * A reference to the NativeWindowGroup that should manage this window
	 * (defaults to {@link Ext.air.NativeWindowManager}).
	 */
	/**
	 * @cfg {Number} minHeight
	 * The minimum height in pixels allowed for this window (defaults to 100).
	 */
	minHeight: 100,
	/**
	 * @cfg {Number} minWidth
	 * The minimum width in pixels allowed for this window (defaults to 200).
	 */
	minWidth: 200,
	/**
	 * @cfg {Number} maxHeight
	 * The maximum height in pixels allowed for this window (defaults to air.NativeWindow.systemMaxSize.y).
	 */
	maxHeight: air.NativeWindow.systemMaxSize.y,
	/**
	 * @cfg {Number} maxWidth
	 * The maximum width in pixels allowed for this window (defaults to air.NativeWindow.systemMaxSize.x).
	 */
	maxWidth: air.NativeWindow.systemMaxSize.x,
	/**
	 * @cfg {Boolean} alwaysInFront
	 * True if this window should always stay in front of other windows (including other applications)
	 * (defaults to <code>false</code>)
	 */
	alwaysInFront: false,
	/**
	 * @cfg {Boolean} closable
	 * True to allow the user to close the window, false to disallow it (defaults to <code>true</code>).
	 * This can not disable or hide the close button in standard-chrome windows.
	 * However, calling the Window's '{@link #close}'-method will close the window.
	 * To make closing a Window <i>hide</i> the Window so that it may be reused,
	 * set {@link #closeAction} to <code>'hide'</code>.
	 */
	closable: true,
	/**
	 * @cfg {String} closeAction
	 * <p>The action to take when the close header button is clicked:
	 * <div class="mdetail-params"><ul>
	 * <li><b><code>'{@link #close}'</code></b> : <b>Default</b><div class="sub-desc">
	 * {@link #close} the window, so that it will <b>not</b> be available to be
	 * redisplayed via the {@link #show} method.
	 * </div></li>
	 * <li><b><code>'{@link #hide}'</code></b> : <div class="sub-desc">
	 * {@link #hide} the window by setting air.NativeWindow.visible to false.
	 * The window will be available to be redisplayed via the {@link #show} method.
	 * </div></li>
	 * </ul></div>
	 * <p><b>Note:</b> This setting does not affect the {@link #close} method
	 * which will always {@link #close} the window. To
	 * programatically <i>hide</i> a window, call {@link #hide}.</p>
	 */
	closeAction: 'close',
	/**
	 * @cfg {Boolean} draggable
	 * False to prevent the user from moving the window by dragging the header
	 * (defaults to <code>true</code>).
	 */
	draggable: true,
	/**
	 * @cfg {Boolean} hidden
	 * True to init this window hidden, false to show it immediately after it is available.
	 * (defaults to <code>true</code>).
	 */
	hidden: true,
	/**
	 * @cfg {Boolean} maximizable
	 * True to allow the user to maximize the window, false to disallow it (defaults to <code>false</code>).
	 */
	maximizable: false,
	/**
	 * @cfg {Boolean} maximized
	 * True to initially display the window in a maximized state. (Defaults to <code>false</code>).
	 */
	maximized: false,
	/**
	 * @cfg {Boolean} minimizable
	 * True to allow the user to minimize the window, false to disallow it (defaults to <code>false</code>).
	 */
	minimizable: false,
	/**
	 * @cfg {Boolean} modal
	 * True to make the window modal and do not allow the user to click any other element on the desktop.
	 * False to display it without restricting access to other UI elements (defaults to false).
	 */
	modal: false,
	/**
	 * @cfg {Boolean} resizable
	 * True to allow user resizing at each edge and corner of the window,
	 * false to disable resizing (defaults to <code>true</code>).
	 */
	resizable: true,
	/**
	 * @cfg {String} systemChrome
	 * The NativeWindow chrome (defaults to 'standard', can also be 'none').
	 */
	systemChrome: air.NativeWindowSystemChrome.STANDARD,
	/**
	 * @cfg {String} type
	 * The NativeWindow type (defaults to 'normal', can also be 'utility' or 'lightweight').
	 */
	type: air.NativeWindowType.NORMAL,
	/**
	 * @cfg {Boolean} transparent
	 * True if the window should have a transparent background. Could only be true,
	 * if {@link #systemChrome} is <code>none</code> (defaults to <code>false</code>).
	 */
	transparent: false,
	/**
	 * @cfg {Boolean} minimizeToTray
	 * True to enable minimizing to the system tray. Note: this should only be applied
	 * to the primary window in your application. A trayIcon is required.
	 */
	minimizeToTray: false,
	/**
	 * @cfg {String} trayIcon
	 * The url to an icon to display in the system tray if {@link #minimizeToTray} is true.
	 */
	trayIcon: null,
	/**
	 * @cfg {Ext.air.SystemMenu} trayMenu
	 * (optional) A menu to display on system tray click.
	 */
	trayMenu: null,
	/**
	 * @cfg {String} trayTip
	 * (optional) A tooltip to display, if the user hovers the system tray icon,
	 * if the window is minimized and {@link minimizeToTray} is true.
	 */
	trayTip: null,
	/**
	 * @cfg {Boolean} stateful
	 * <p>A flag which causes the window to attempt to restore the state of
	 * internal properties from a saved state on startup. The window must have
	 * either a <code>{@link #stateId}</code> or <code>{@link #id}</code> assigned
	 * for state to be managed. Auto-generated ids are not guaranteed to be stable
	 * across page loads and cannot be relied upon to save and restore the same
	 * state for this window.<p>
	 * <p>For state saving to work, the state manager's provider must have been
	 * set to an implementation of {@link Ext.state.Provider} which overrides the
	 * {@link Ext.state.Provider#set set} and {@link Ext.state.Provider#get get}
	 * methods to save and recall name/value pairs. An implementation for AIR,
	 * {@link Ext.state.FileProvider} is available.</p>
	 * <p>To set the state provider for the current page:</p>
	 * <pre><code>
Ext.state.Manager.setProvider(new Ext.state.FileProvider());
	 * </code></pre>
	 * <p>A stateful window attempts to save state when one of the events
	 * listed in the <code>{@link #stateEvents}</code> configuration fires.</p>
	 * <p>To save state, a stateful window first serializes its state by
	 * calling <b><code>getState</code></b>. By default, this function returns the
	 * window size and position and its maximized state. You can override this method
	 * to return other/additional information which represents the window's
	 * restorable state.</p>
	 * <p>The value yielded by getState is passed to {@link Ext.state.Manager#set}
	 * which uses the configured {@link Ext.state.Provider} to save the object
	 * keyed by the Component's <code>{@link stateId}</code>, or, if that is not
	 * specified, its <code>{@link #id}</code>.</p>
	 * <p>During construction, a stateful widnow attempts to <i>restore</i>
	 * its state by calling {@link Ext.state.Manager#get} passing the
	 * <code>{@link #stateId}</code>, or, if that is not specified, the
	 * <code>{@link #id}</code>.</p>
	 * <p>The resulting object is passed to <b><code>applyState</code></b>.
	 * The default implementation of <code>applyState</code> simply copies
	 * properties into the object, but a developer may override this to support
	 * more behaviour.</p>
	 * <p>You can perform extra processing on state save and restore by attaching
	 * handlers to the {@link #beforestaterestore}, {@link #staterestore},
	 * {@link #beforestatesave} and {@link #statesave} events.</p>
	 */
	stateful: true,
	/**
	 * @cfg {String} stateId
	 * The unique id for this window to use for state management purposes
	 * (defaults to the window's {@link #id} if one was set, otherwise null if the
	 * window is using a generated id).
	 * <p>See <code>{@link #stateful}</code> for an explanation of saving and
	 * restoring a window state.</p>
	 */
	/**
	 * @cfg {Array} stateEvents
	 * <p>An array of events that, when fired, should trigger this window to
	 * save its state (defaults to ['{@link #move}', '{@link #resize}']).
	 * <code>stateEvents</code> may be any type of event supported by this window,
	 * including browser or custom events (e.g., <tt>['click', 'customerchange']</tt>).</p>
	 * <p>See <code>{@link #stateful}</code> for an explanation of saving and
	 * restoring a window state.</p>
	 */
	stateEvents: ['move', 'resize'],
	/**
	 * @cfg {Boolean} trusted
	 * True to allow filesystem access (e.g. load css files) and access to the window.runtime
	 * object, if it is needed in the content loaded via the {@link #html} config option.
	 * If true, this sets <code>true</code> to the HTMLLoader's placeLoadStringContentInApplicationSandbox
	 * property and the content loaded via the loadString() method is put in the application sandbox.
	 * If false, ths content is put in a non-application sandbox. Defaults to <code>false</code>.
	 */
	trusted: false,
	/**
	 * @cfg {String/Boolean} notify
	 * Can be <code>'critical'</code> or <code>'informational'</code>, if you want the user to be notified
	 * (doing a taskbar blink) if the current window is not the active one when it is loaded. Can also be a
	 * Boolean. <code>true</code> means the same like 'critical', <code>false</code> means do not notify.
	 * (Defaults to 'critical' on {@link #modal} windows, 'informational' on non modal windows)
	 */
	notify: undefined,
	/**
	 * Applies a parent window to this window. Parent windows are mostly useful for modal windows or windows with
	 * {@link #closeAction} 'hide' and have the following functions:<div class="mdetail-params"><ul>
	 * <li>They can make THIS window getting closed, if they are closed (see {@link #destroyOnParentClose}).</li>
	 * <li>Modal windows are activated if they are activated and vice versa.</li>
	 * <li>They are activated if THIS window is modal and is closed.</li></ul></div>
	 * @param {air.NativeWindow/Boolean} parent A native window that should be applied as parent window.
	 * Or <code>false</code> if no parent window should be applied. Or <code>null/undefined</code> if the current
	 * active window should be applied.
	 */
	applyParentWindow: function(parent) {
		// remove listeners from previous parent window (it can change, e.g. in Ext.air.MessageBox)
		if (this.parentWin) {
			this.parentWin.removeEventListener(air.Event.CLOSE, this.closeOnParentFn);
			this.parentWin.removeEventListener(air.Event.ACTIVATE, this.activateModalOnParentFn);
			this.un('close', this.activateParentOnCloseFn);
		}
		
		this.parentWin = parent !== false ? (Ext.isObject(parent) ? parent.win || parent : Ext.air.App.getActiveWindow() || window.nativeWindow) : null;
		
		if (this.parentWin) {
			// destroy this window if its parent window is closed (extremly useful for windows with closeAction 'hide')
			if (this.destroyOnParentClose !== false) this.parentWin.addEventListener(air.Event.CLOSE, this.closeOnParentFn);
			// check modal within these functions and add listener always, because modal can change (Ext.air.MessageBox)
			this.parentWin.addEventListener(air.Event.ACTIVATE, this.activateModalOnParentFn);
			this.on('close', this.activateParentOnCloseFn);
		}
	},
	/**
	 * Wrap all air.NativeWindow events to Ext.air.NativeWindow events
	 * @private
	 */
	initEvents: function() {
		var events = ['activate', 'deactivate', 'close', 'closing', 'displayStateChange', 'displayStateChanging', 'move', 'moving', 'resize', 'resizing'];
		Ext.each(events, function(evt) {
			this.win.addEventListener(evt, this['on' + Ext.util.Format.capitalize(evt)].createDelegate(this));
		}, this);
		this.win.stage.addEventListener(air.Event.FULLSCREEN, this.onFullscreen.createDelegate(this));
		if (this.stateful !== false) {
			this.initStateEvents();
		}
		// maybe the loader is already complete?
		if (this.loader.loaded) {
			this.onComplete();
		} else {
			var fn = (function() {
				this.loader.removeEventListener(air.Event.COMPLETE, fn);
				this.onComplete();
			}).createDelegate(this);
			this.loader.addEventListener(air.Event.COMPLETE, fn);
		}
	},
	/**
	 * Fires once, when loading the window is complete.
	 * @private
	 */
	onComplete: function() {
		this.fireEvent('complete', this);
	},
	/**
	 * Fires, if the window has been activated.
	 * @private
	 */
	onActivate: function() {
		this.fireEvent('activate', this);
	},
	/**
	 * Fires, if the window has been deactivated.
	 * Activates it again immediately, if this window is modal.	 
	 * @private
	 */
	onDeactivate: function(e) {
		var aw = Ext.air.App.getActiveWindow();
		// do modal functionality only on windows that were opened before this window was opened
		// this also prevents modal functionality on FileBrowse dialogs etc.
		if (this.modal && this.isVisible() && aw !== null && this.openedWindows.indexOf(aw) != -1) {
			this.setActive(true);
		}
		this.fireEvent('deactivate', this);
	},
	/**
	 * Fires before the window is closed.
	 * Prevents closing the window, if {@link #closable} is false.
	 * @private
	 */
	onClosing: function(e) {
		var bc = !this.closable ? false : this.fireEvent('beforeclose', this);
		if ((this.closeAction == 'hide' || bc === false) && e.cancelable) {
			e.preventDefault();
			if (bc !== false && this.closeAction == 'hide') this.hide();
		}
	},
	/**
	 * Fires after the window has been closed.
	 * @private
	 */
	onClose: function() {
		this.manager.unregister(this);
		this.fireEvent('close', this);
	},
	/**
	 * Fires before the window display state changes.
	 * Prevents the changing, if {@link #maximizable} is false and the window should be maximized.
	 * Prevents the changing, if {@link #minimizable} is false or {@link #minimizeToTray} is true
	 * and the window should be maximized.
	 * @private
	 */
	onDisplaystatechanging: function(e) {
		if (e.cancelable && ((e.afterDisplayState == air.NativeWindowDisplayState.MAXIMIZED && !this.maximizable) || (e.afterDisplayState == air.NativeWindowDisplayState.MINIMIZED && (!this.minimizable || this.minimizeToTray)))) {
			e.preventDefault();
		}
		if (e.afterDisplayState == air.NativeWindowDisplayState.MAXIMIZED) {
			this.stateBounds = this.win.bounds;
		}
	},
	/**
	 * Fires after the window display state has changed.
	 * @private
	 */
	onDisplaystatechange: function() {
		if (this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED) {
			this.fireEvent('maximize', this);
		} else if (this.win.displayState == air.NativeWindowDisplayState.MINIMIZED) {
			this.fireEvent('minimize', this);
		} else this.fireEvent('restore', this);
	},
	/**
	 * Fires before the window's position changes.
	 * Prevents moving, if {@link #draggable} is false.
	 * @private
	 */
	onMoving: function(e) {
		if (!this.draggable && e.cancelable) {
			e.preventDefault();
		}
	},
	/**
	 * Fires after the window's position has changed.
	 * @private
	 */
	onMove: function(e) {
		this.fireEvent('move', this, e.afterBounds.x, e.afterBounds.y);
	},
	/**
	 * Fires before the window's size changes.
	 * Prevents resizing, if {@link #resizable} is false or the new size
	 * is smaller than the specified {@link #minWidth} or {@link #minHeight}.
	 * @private
	 */
	onResizing: function(e) {
		if (e.cancelable && (!this.resizable || e.afterBounds.width < this.minWidth || e.afterBounds.height < this.minHeight)) {
			e.preventDefault();
		}
	},
	/**
	 * Fires after the window has been resized.
	 * @private
	 */
	onResize: function(e) {
		this.fireEvent('resize', this, e.afterBounds.width, e.afterBounds.height);
	},
	/**
	 * Fires after the window entered or left fullscreen mode
	 * @private
	 */
	onFullscreen: function(e) {
		this.fireEvent('fullscreen', this, !!e.fullScreen);
	},
	// private
	initState: Ext.Component.prototype.initState,
	// private
	getStateId: Ext.Component.prototype.getStateId,
	// private
	initStateEvents: Ext.Component.prototype.initStateEvents,
	// private
	applyState: Ext.Component.prototype.applyState,
	// private
	saveState: Ext.Component.prototype.saveState,
	// private
	getState: function() {
		var m = (this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED),
			s = this.stateBounds; 
		return {
			maximized: m,
			width: m && s ? s.width : this.win.width,
			height: m && s ? s.height : this.win.height,
			x: m && s ? s.x : this.win.x,
			y: m && s ? s.y : this.win.y
		};
	},
	/**
	 * Centers the window on the desktop
	 * @return {Ext.air.NativeWindow} this
	 */
	center: function() {
		var b = air.Screen.mainScreen.visibleBounds;
		this.win.x = b.x + (b.width - this.win.width) / 2;
		this.win.y = b.y + (b.height - this.win.height) / 2;
		return this; 
	},
	/**
	 * Closes the window.<br />
	 * Note: This method is not affected by the {@link #closeAction} setting
	 * which only affects the action triggered when clicking the 'close' button
	 * in the header. To only hide the Window, call {@link #hide}.
	 */
	close: function() {
		if (!this.isVisible()) {
			this.doClose();
		} else this.hide(this.doClose, this);
	},
	// private
	doClose: function() {
		// prepare so, that onClosing will not prevent closing the window
		this.purgeListeners();
		this.closable = true;
		this.closeAction = 'close';
		this.win.close();
	},
	/**
	 * Returns the window's id.
	 * @return {String} id
	 */
	getId: function() {
		return this.id;
	},
	/**
	 * Returns the current height of the window.
	 * @return {Number} height
	 */
	getHeight: function() {
		return this.win.height;
	},
	/**
	 * Returns the current width of the window.
	 * @return {Number} width
	 */
	getWidth: function() {
		return this.win.width;
	},
	/**
	 * Returns the height of the window's content.
	 * @return {Number} height
	 */
	getInnerHeight: function() {
		return this.win.stage.stageHeight;
	},
	/**
	 * Returns the width of the window's content.
	 * @return {Number} width
	 */
	getInnerWidth: function() {
		return this.win.stage.stageWidth;
	},
	/**
	 * Returns the current XY position of the window as Array
	 * [width, height].
	 * @return {Array} The XY position of the window (e.g., [100, 200])
	 */
	getPosition: function() {
		return [this.win.x, this.win.y];
	},
	/**
	 * Returns the current size of the window.
	 * @return {Object} An object containing the window's size {width: (window width), height: (window height)}
	 */
	getSize: function() {
		return {
			width: this.win.width,
			height: this.win.height
		};
	},
	/**
	 * Hides the window by setting its visible-property to false.
	 * @param {Function} callback (optional) A callback function to call after the window is hidden
	 * @param {Object} scope (optional) The scope (<code>this</code> reference)
	 * the callback is executed (defaults to this window).
	 */
	hide: function(callback, scope) {
		if (!this.isVisible() || this.fireEvent('beforehide', this) === false) {
			return this;
		}
		this.win.visible = false;
		this.onHide();
		if (window.nativeWindow && !window.nativeWindow.closed && window.nativeWindow.displayState != air.NativeWindowDisplayState.MINIMIZED) {
			window.nativeWindow.activate(); // activate the parent Window
		}
		this.fireEvent('hide', this);
		if (Ext.isFunction(callback)) callback.call(scope || this);
	},
	/**
	 * A method that is called immediately before the <code>hide</code> event is fired
	 * (defaults to <code>Ext.emptyFn</code>).
	 */
	onHide: Ext.emptyFn,
	/**
	 * Returns <code>true</code> if the window is currently visible, <code>false</code> if it is hidden.
	 */
	isVisible: function() {
		return !this.win.closed && this.win.visible;
	},
	/**
	 * Maximizes the window, if {@link #maximizable} is true.
	 */
	maximize: function() {
		// dispatch Event for none systemChrome windows, since it is not done automatically
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			var e = new air.NativeWindowDisplayStateEvent(
				air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
				false,
				true,
				this.win.displayState,
				air.NativeWindowDisplayState.MAXIMIZED
			);
			if (this.win.dispatchEvent(e) === false) return this;
		}
		this.win.maximize();
		return this;
	},
	/**
	 * Minimizes the window, if {@link #minimizable} is true.
	 */
	minimize: function() {
		// dispatch Event for none systemChrome windows, since it is not done automatically
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			var e = new air.NativeWindowDisplayStateEvent(
				air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
				false,
				true,
				this.win.displayState,
				air.NativeWindowDisplayState.MINIMIZED
			);
			if (this.win.dispatchEvent(e) === false) return this;
		}
		this.win.minimize();
		return this;
	},
	/**
	 * Restores a maximized window back to its original size and position prior to being maximized.
	 */
	restore: function() {
		// dispatch Event for none systemChrome windows, since it is not done automatically
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			var e = new air.NativeWindowDisplayStateEvent(
				air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
				false,
				true,
				this.win.displayState,
				air.NativeWindowDisplayState.NORMAL
			);
			if (this.win.dispatchEvent(e) === false) return this;
		}
		this.win.restore();
		return this;
	},
	/**
	 * Makes the window active or deactivates it.
	 * A deactive status cannot be applied directly to the window, so if active is false, this method
	 * only fires the {@link #deactivate} event.
	 * @param {Boolean} active True to activate the window, false to deactivate it (defaults to false).
	 */
	setActive: function(active) {
		if (active) {
			this.show();
			this.win.activate();
		} else this.fireEvent('deactivate', this);
	},
	/**
	 * Sets the height of the window. This method fires the {@link #resize} event.
	 * @param {Number} height The new height of the window
	 * @return {Ext.air.NativeWindow} this
	 */
	setHeight: function(height) {
		this.win.height = parseInt(height);
		return this;
	},
	/**
	 * Sets the width of the window. This method fires the {@link #resize} event.
	 * @param {Number} width The new width of the window
	 * @return {Ext.air.NativeWindow} this
	 */
	setWidth: function(width) {
		this.win.width = parseInt(width);
		return this;
	},
	/**
	 * Sets the page XY position of the window. This method fires the {@link #move} event.
	 * @param {Number} x The new left position
	 * @param {Number} y The new top position
	 * @return {Ext.air.NativeWindow} this
	 */
	setPosition: function(x, y) {
		if (Ext.isDefined(x)) this.win.x = parseInt(x);
		if (Ext.isDefined(y)) this.win.y = parseInt(y);
		return this;
	},
	/**
	 * Sets the width and height of this window. This method fires the {@link #resize} event.
	 * This method can accept either width and height as separate arguments,
	 * or you can pass a size object like <code>{width:200, height:100}</code>.
	 * @param {Mixed} width The new width to set. This may be one of:<div class="mdetail-params"><ul>
	 * <li>A Number specifying the new width in pixels.</li>
	 * <li>A size object in the format <code>{width: widthValue, height: heightValue}</code>.</li>
	 * <li><code>undefined</code> to leave the width unchanged.</li>
	 * </ul></div>
	 * @param {Mixed} height The new height to set (not required if a size object is passed as the first arg).
	 * This may be one of:<div class="mdetail-params"><ul>
	 * <li>A Number specifying the new height in pixels.</li>
	 * <li><code>undefined</code> to leave the height unchanged.</li>
	 * </ul></div>
	 * @return {Ext.air.NativeWindow} this
	 */
	setSize: function(w, h) {
		if (Ext.isObject(w)) {
			h = w.height;
			w = w.width;
		}
		if (Ext.isDefined(w)) this.win.width = parseInt(w);
		if (Ext.isDefined(h)) this.win.height = parseInt(h);
		return this;
	},
	/**
	 * Sets the title text for this window.
	 * @param {String} title The title text to set
	 */
	setTitle: function(title) {
		this.win.title = title;
		this.fireEvent('titlechange', this, title);
	},
	/**
	 * Convenience function to hide or show this window by boolean.
	 * @param {Boolean} visible True to show, false to hide the window.
	 * @return {Ext.air.NativeWindow} this
	 */
	setVisible: function(visible) {
		if (!visible) {
			this.hide();
		} else this.show();
		return this;
	},
	/**
	 * Shows the window, activates it and brings it to front if hidden.
	 * @param {Function} callback (optional) A callback function to call after the window is displayed
	 * @param {Object} scope (optional) The scope (<code>this</code> reference)
	 * in which the callback is executed. Defaults to this window.
	 */
	show: function(callback, scope) {
		if(this.trayed){
			Ext.air.SystemTray.hideIcon();
			this.trayed = false;
		}
		if (this.isVisible()) {
			this.toFront();
			return this;
		}
		if (this.fireEvent('beforeshow', this) === false) {
			return this;
		}
		this.win.visible = true;
		
		this.memorizeOpenedWindows();
		
		this.toFront();
		this.onShow();
		this.fireEvent('show', this);
		if (Ext.isFunction(callback)) callback.call(scope || this);
	},
	/**
	 * A method that is called immediately before the <code>show</code> event is fired
	 * (defaults to <code>Ext.emptyFn</code>).
	 */
	onShow: Ext.emptyFn,
	/**
	 * Sends this window to the back of any other visible windows.
	 * @return {Ext.air.NativeWindow} this
	 */
	toBack: function() {
		this.win.orderToBack();
		return this;
	},
	/**
	 * Brings this window to the front of any other visible windows.
	 * @return {Ext.air.NativeWindow} this
	 */
	toFront: function() {
		this.win.orderToFront();
		return this;
	},
	/**
	 * Sends this window directly to the back of the specified window.
	 * @param {Ext.air.NativeWindow/air.NativeWindow} NativeWindow
	 * @return {Ext.air.NativeWindow} this
	 */
	inBackOf: function(win) {
		this.win.orderInBackOf(win.win ? win.win : win);
		return this;
	},
	/**
	 * Brings this window directly to the front of the specified window.
	 * @param {Ext.air.NativeWindow/air.NativeWindow} NativeWindow
	 * @return {Ext.air.NativeWindow} this
	 */
	inFrontOf: function(win) {
		this.win.orderInFrontOf(win.win ? win.win : win);
		return this;
	},
	/**
	 * Enter full-screen mode for the window.
	 * @param {Boolean} nonInteractive (optional) Boolean flag to allow the full screen window to be interactive or not.
	 * By default this is <code>false</code>.
	 */
	fullscreen: function(nonInteractive) {
		this.win.stage.displayState = nonInteractive ? air.StageDisplayState.FULL_SCREEN : air.StageDisplayState.FULL_SCREEN_INTERACTIVE; 
	},
	/**
	 * Returns the air.NativeWindow instance
	 * @return {air.NativeWindow} NativeWindow
	 */
	getNative: function() {
		return this.win;
	},
	/**
	 * A shortcut method for toggling between {@link #maximize} and {@link #restore}
	 * based on the current maximized state of the window.
	 * @return {Ext.air.NativeWindow} this	 
	 */
	toggleMaximize: function() {
		this[this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED ? 'restore' : 'maximize'];
		return this;
	},
	/**
	 * Toggles the full-screen mode for this window based on the current state.
	 * @param {Boolean} nonInteractive (optional) Boolean flag to allow the full screen window to be interactive or not.
	 * By default this is false.
	 */
	toggleFullscreen: function(nonInteractive) {
		var sdsn = air.StageDisplayState.NORMAL;
		if (this.win.stage.displayState == sdsn) {
			this.fullscreen(nonInteractive);
		} else {
			this.win.stage.displayState = air.StageDisplayState.NORMAL;
		}
	},
	/**
	 * Define, if this window should stay always in front of all other windows.
	 * @param {Boolean} alwaysInFront True to display this window always in front of all other windows,
	 * false to disable this functionality, undefined to toggle this state (defaults to <code>undefined</code>).
	 * @return {Ext.air.NativeWindow} this
	 */
	toggleAlwaysInFront: function(alwaysInFront) {
		this.win.alwaysInFront = (Ext.isBoolean(alwaysInFront)) ? alwaysInFront : !this.win.alwaysInFront;
		return this;
	},
	// private
	ensureActive: function() {
		var aw = Ext.air.App.getActiveWindow();
		// opened window has to be the active one
		if (aw != this.parentWin && aw != this.win) {
			// if not, notify (taskbar blink)
			if (this.notify === true || !Ext.isDefined(this.notify)) {
				this.notify = air.NotificationType[this.notify === true || this.modal ? 'CRITICAL' : 'INFORMATIONAL'];
			}
			if (this.notify == air.NotificationType.CRITICAL || this.notify == air.NotificationType.INFORMATIONAL) {
				this.win.notifyUser(this.notify);
			}
			// if modal, make sure, that this window becomes the active one, if its parent window becomes activated, too
			if (this.modal && this.parentWin) {
				this.on('activate', function() {
					this.parentWin.activate();
					this.setActive(true);
				}, this, {single: true,delay:10});
				if (this.hidden === false) this.win.visible = true;
			}
		}
		// show if it is not initially hidden
		if (!this.win.visible && this.hidden === false) {
			this.setActive(true);
		}
		if (this.maximized) this.maximize();
	},
	/**
	 * Memorize opened windows (excluding this one) to do modal functionality only on these windows
	 * @private
	 */
	memorizeOpenedWindows: function() {
		this.openedWindows = Ext.toArray(air.NativeApplication.nativeApplication.openedWindows) || [];
		this.openedWindows.remove(this.win);
	},		
	/**
	 * Returns the window object of the window content.
	 * @return {Object} window
	 */
	getWindow: function() {
		return this.win.stage.getChildAt(0).window;
	},
	/**
	 * Returns the document object of the window content.
	 * @return {Object} document
	 */
	getDocument: function() {
		return this.getWindow().document;
	},
	// private
	initMinimizeToTray : function(icon, menu){
		var tray = Ext.air.SystemTray;
		
		tray.setIcon(icon, this.trayTip);
		this.win.addEventListener('displayStateChanging', (function(e) {
			if(e.afterDisplayState == air.NativeWindowDisplayState.MINIMIZED) {
				e.preventDefault();
				this.hide();
				tray.showIcon();
				this.trayed = true;
			}
		}).createDelegate(this));
		
		tray.on('click', function(){
			this.setActive(true);
		}, this);
		
		if(menu){
			tray.setMenu(menu);
		}
		this.trayed = false;
	},
	/**
	 * Queries the current document for files to include, if {@link #file} and {@link #html} are undefined.
	 * It depends on the current {@link #fileQuery} config object.
	 * @private
	 */
	queryFiles: function() {
		var t;
		if (Ext.isObject(this.fileQuery) && (t = this.fileQuery.type)) {
			// use the main file from application.xml
			if (t == 'main') {
				var ad = air.NativeApplication.nativeApplication.applicationDescriptor,
					dp = new DOMParser(),
					xml = dp.parseFromString(ad, "text/xml"),
					f = Ext.DomQuery.selectValue("initialWindow/content", xml, "");
				if (!Ext.isEmpty(f)) {
					// add window id
					var q = f.indexOf('?');
					if (q != -1) f = f.substring(0, q);
					this.file = f + '?window=' + this.id;
				}
			} else {
				var html = '',
					r = this.fileQuery.regex,
					js = this.fileQuery.js !== false,
					css = this.fileQuery.css !== false,
					isLink, isScript, h, f, a,
					aJs = '[type=text/javascript]',
					aCss = '[type=text/css]',
					jsTag = '<script language="JavaScript" type="text/javascript" src="{0}"></script>',
					cssTag = '<link rel="stylesheet" type="text/css" href="{0}" />',
					inc = this.fileQuery.include;
				// at least css OR js must be true
				if (!js && !css) return;
				
				// build regex for Ext queries -> same routine as queryRegex
				if (t == 'queryExtJS') {
					r = /\/ext\-(basex?|all|lang)(\-[a-z_\-]+)?\.(css|js)$/i;
				} else if (t == 'queryExtAIR') {
					r = /\/(AIRAliases\.js)|(AIRIntrospector\.js)|(ext\-air(\-[a-z_\-]+)?\.(css|js))$/i;
				} else if (t == 'queryExt') {
					r = /\/(AIRAliases\.js)|(AIRIntrospector\.js)|(ext\-(basex?|all|lang|air)(\-[a-z_\-]+)?\.(css|js))$/i;
				}
				
				switch (t) {
					// query by regex
					case 'queryExtJS':
					case 'queryExtAIR':
					case 'queryExt':
					case 'queryRegex':
						if (!Ext.isDefined(r)) return;

						f = Ext.DomQuery.select(js && css ? 'link' + aCss + ',script' + aJs : (css ? 'link' + aCss : 'script' + aJs), this.fileQuery.root);
						Ext.each(f, function(file) {
							isLink = file.tagName == 'LINK';
							h = isLink ? file.href : file.src;
							if (r.test(h)) html += file.outerHTML;
						});
						break;
					// query by attribute -> same routine as queryAll/querySelector
					// namespace attribute can't be queried with Ext.DomQuery, has to be filtered afterwards
					case 'queryAttribute':
						if (!Ext.isString(this.fileQuery.attribute)) return;
						a = this.fileQuery.attribute;
					// query all -> same routine as querySelector
					case 'queryAll':
						this.fileQuery.selector = js && css ? 'link' + aCss + ',script' + aJs : (css ? 'link' + aCss : 'script' + aJs);
					// query by selector
					case 'querySelector':
						if (!Ext.isString(this.fileQuery.selector)) return;
						
						f = Ext.DomQuery.select(this.fileQuery.selector, this.fileQuery.root);
						Ext.each(f, function(file) {
							isLink = file.tagName == 'LINK' && file.type == 'text/css';
							isScript = file.tagName == 'SCRIPT' && file.type == 'text/javascript';
							// skip file if it isn't a javascript or css file
							if ((!isLink && !isScript) || (isLink && !css) || (isScript && !js)) return true;
							if (t != 'queryAttribute' || Ext.fly(file).getAttribute(a, 'ext') == 'true') {
								html += file.outerHTML;
							}
						});
						break;
				}
				if (inc) {
					inc = Ext.isArray(inc) ? inc : [inc];
					Ext.each(inc, function(f) {
						switch (f.substring(f.lastIndexOf('.') + 1).toLowerCase()) {
							case 'js':
								html += String.format(jsTag, f);
								break;
							case 'css':
								html += String.format(cssTag, f);
								break;
						}
					});
				}
				// use html string and include all queried file tags
				if (!Ext.isEmpty(html)) {
					this.html = '<html><head>' + html + '</head><body></body></html>';
					this.trusted = true;
				}
			}
		}
	}
});

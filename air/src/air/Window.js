/**
 * @class Ext.air.Window
 * @extends Ext.air.NativeWindow
 * A class that creates a new Ext.air.NativeWindow with a Ext.air.Viewport in it.
 * This allows you, to create a NativeWindows like an Ext.Window.
 * Make sure, that you define a {@link #file}, in which the ExtJS framework becomes loaded,
 * otherwise the viewport won't create!<br /><br />
 * <b>Note:</b> Although they are not listed here, this class accepts also all config options of
 * {@link Ext.air.Viewport}.<br />
 * Please consider, that only lazy rendering is possible. That means, only config objects,
 * NOT instances of components are allowed to be specified in the {@link #items} option.
 * If you specify component instances anyway, a new instance of this component based on its
 * {@link Ext.Component#initialConfig} is created in the new NativeWindow. You cannot acces it via its reference anymore.
 * @constructor
 * @param {Object} config A config object containing config options of Ext.air.NativeWindow and Ext.air.Viewport
 */
Ext.air.Window = function(config) {
	this.initialConfig = config || {};
	Ext.copyTo(this, this.initialConfig, 'bodyHtml');
	this.addEvents(
		/**
		 * @event init
		 * Fires once after the window has been loaded but BEFORE the {@link Ext.air.Viewport} is built.
		 * Fires only if Ext Framework is available in the new window, e.g. specify a proper {@link #fileQuery}.
		 * Use this to execute custom initialization code for this window like <code>Ext.QuickTips.init();</code>.
		 * @param {Ext.air.NativeWindow} this
		 * @param {window} window the JavaScript window object of this NativeWindow
		 * @param {Object} Ext The Ext Framework within this window. Use it for all your init code.
		 */
		'init'
		/**
		 * @event complete
		 * Fires once after the window has been loaded completely and AFTER the {@link Ext.air.Viewport} is built.
		 * This doesn't include that the Viewport is rendered. Listen to the
		 * {@link Ext.air.Viewport#render Viewport's render event} in that case.
		 * @param {Ext.air.NativeWindow} this
		 */
	);
	Ext.air.Window.superclass.constructor.call(this, config);
};
Ext.extend(Ext.air.Window, Ext.air.NativeWindow, {
	/**
	 * @cfg {String} bodyHtml
	 * An HTML fragment, or a DomHelper specification to use as the window element content
	 * (defaults to ''). The HTML content is added after the Viewport is rendered, so the
	 * document will not contain this HTML at the time the render event is fired.
	 * This content is inserted into the body before any configured contentEl is appended.<br />
	 * This property is applied to the {@link Ext.air.Viewport#html} property of the Ext.air.Viewport.
	 */
	/**
	 * @cfg {String} systemChrome
	 * The NativeWindow chrome (defaults to 'none', can also be 'standard').
	 */
	systemChrome: air.NativeWindowSystemChrome.NONE,
	/**
	 * @cfg {Boolean} transparent
	 * True if the window should have a transparent background. Could only be true,
	 * if {@link #systemChrome} is <code>none</code> (defaults to <code>true</code>).
	 */
	transparent: true,
	// private
	onComplete: function() {
		var win = this.getWindow();
		if (win && win.Ext) {
			if (win.Ext != window.Ext) this.prepareItems();
			this.onInit.call(this, win, win.Ext);
			this.createViewport(win.Ext);
		}
		Ext.air.Window.superclass.onComplete.apply(this, arguments);
	},
	// private
	onInit: function(win, X) {
		this.fireEvent('init', this, win, X);
	},
	/**
	 * Creates the viewport if the NativeWindow has loaded and Ext is available in the new window.
	 * @private
	 */
	createViewport: function(X) {
		//if (X != window.Ext) this.prepareItems();
		var o = Ext.applyIf({
			id: X.id(),
			stateId: null,
			stateful: false,
			hidden: false,
			html: this.bodyHtml
		}, this.getOwnProperties());
		this.viewport = new X.air.Viewport(o);
	},
	/**
	 * <p>Sets the title for this window and optionally the {@link Ext.air.Viewport#iconCls icon class}.</p>
	 * @param {String} title The title text to set
	 * @param {String} iconCls (optional) {@link Ext.air.Viewport#iconCls iconCls} A user-defined CSS
	 * class that provides the icon image for this window (only useful if systemChrome is 'none').
	 */
	setTitle: function(title, iconCls) {
		Ext.air.Window.superclass.setTitle.call(this, title);
		if (this.viewport) this.viewport.setTitle(title, iconCls);
	},
	/**
	 * Prepares the items so, that they are all config option objects. No instances are allowed
	 * to be passed to the viewport's items property.
	 * @private
	 */
	prepareItems: function() {
		this.items = Ext.isArray(this.items) ? this.items : (this.items ? [this.items] : []);
		Ext.each(this.items, function(t, i) {
			this.items[i] = t.initialConfig ? t.initialConfig : t;
		}, this); 
	},
	/**
	 * Returns the viewport instance. Use it to access all members of the viewport class
	 * and to access child items via <code>this.getViewport().get('myChildItemId');</code>.
	 */
	getViewport: function() {
		return this.viewport;
	},
	// private
	getOwnProperties: function() {
		var o = {},
			skip = ['events', 'stateEvents', 'initialConfig', 'win', 'loader', 'html', 'fileQuery', 'file'];
		for (var i in this) {
			if (!Ext.isFunction(this[i]) && skip.indexOf(i) == -1) {
				o[i] = this[i];
			}
		}
		Ext.apply(o, this.initialConfig);
		return o;
	}
});

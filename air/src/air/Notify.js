/**
 * @class Ext.air.Notify
 * @extends Ext.air.NativeWindow
 * A special lightweight {@link Ext.air.NativeWindow} which displays in the bottom right
 * corner of your desktop and is used to show small notification messages.
 * @constructor
 * @param {Object} config Config options
 */
Ext.air.Notify = function(config) {
	/**
	 * @cfg {String} msg
	 * The message to display
	 */
	config = config || {};
	Ext.apply(this, config);
	// search for ext-all.css if it is not defined
	if (!this.extAllCSS) {
		var cssLink = Ext.DomQuery.selectNode("link[href$=ext-all.css]", Ext.air.App.getRootHtmlWindow().document);
		if (cssLink) this.extAllCSS = cssLink.href;
	}
	config.html = this.xtpl.apply(this);
	Ext.air.Notify.superclass.constructor.call(this, config);
	
	try {
		this.stack = Ext.air.App.getRootHtmlWindow().Ext.air.NotifyManager;
	} catch(e) {
		this.stack = Ext.air.NotifyManager;
	}
	if (this.stack) this.stack.add(this);
};
Ext.extend(Ext.air.Notify, Ext.air.NativeWindow, {
	type: 'lightweight',
	minHeight: 0,
	destroyOnParentClose: false,
	notify: false,
	parent: false,
	alwaysInFront: true,
	/**
	 * @cfg {Number} width
	 * The width of the window in pixels (defaults to <code>400</code>).
	 * The height depends on the content.
	 */
	width: 400,
	height: 50,
	hidden: false,
	systemChrome: 'none',
	transparent: true,
	trusted: true,
	stateful: false,
	extraHeight: 22,
	/**
	 * @cfg {Object} fileQuery
	 * @hide
	 */
	/**
	 * @cfg {Number/Boolean} hideDelay
	 * The number of milliseconds to wait till hiding the notify window
	 * (defaults to <code>3000</code>). It can also be <code>false</code>
	 * to not hide the window automatically (see also {@link #clickToClose}).
	 */
	hideDelay: 3000,
	/**
	 * @cfg {Boolean} clickToClose
	 * True, if the Notify window should be closed if it becomes clicked
	 * (defaults to <code>false</code>).
	 */
	clickToClose: false,
	/**
	 * @cfg {String} msgId
	 * The id of the message element
	 * (defaults to <code>'msg'</code>).
	 */
	msgId: 'msg',
	/**
	 * @cfg {String} iconId
	 * The id of the icon element
	 * (defaults to <code>'icon'</code>).
	 */
	iconId: 'icon',
	/**
	 * @cfg {String} icon
	 * (optional) a path to an icon to display in the top right corner of the notify window
	 * (defaults to <code>Ext.BLANK_IMAGE_URL</code>).
	 */
	icon: Ext.BLANK_IMAGE_URL,
	/**
	 * @cfg {String} boxCls
	 * A css class to apply to the box wrapping elements
	 * (defaults to <code>'x-box'</code>).
	 */
	boxCls: 'x-box',
	/**
	 * @cfg {String} extAllCSS	 
	 * The path to the ext-all.css file (defaults to <code>null</code>).
	 * If it is left empty, it is tried to use the ext-all.css of the current window.
	 * It is searched by <code>Ext.DomQuery.selectNode("link[href$=ext-all.css]");</code>.
	 */
	extAllCSS: null,
	/**
	 * @cfg {Boolean} stackable
	 * True to display the Ext.air.Notify upon all other visible notifiers, false to always show it
	 * always in the bottom right corner (defaults to <code>false</code>).
	 */
	stackable: false,
	/**
	 * @cfg {String} stackPosition
	 * The position to stack this notifier according to the others.
	 * Defaults to <code>'top'</code>, which means that it is shown above the other notifiers and
	 * moves down, if notifiers below become closed. Can also be <code>'bottom'</code>, which means
	 * that all other notifiers are moved up, so that this notifier can be displayed in the very
	 * bottom right corner.
	 */
	stackPosition: 'top',
	/**
	 * @cfg {Ext.XTemplate} xtpl
	 * (optional) A XTemplate to load as html string in the native window.
	 * It should have a html, head and body element and
	 * can contain all properties and config options of this class.
	 */
	xtpl: new Ext.XTemplate(
		'<html><head><link rel="stylesheet" href="{extAllCSS}"></head>',
			'<body>',
				'<div class="{boxCls}-tl"><div class="{boxCls}-tr"><div class="{boxCls}-tc"></div></div></div><div class="{boxCls}-ml"><div class="{boxCls}-mr"><div class="{boxCls}-mc">',
					'<div id="{msgId}">',
						'<span>{msg}</span>',
						'<div id="{iconId}" style="float: right;"><img src="{icon}"></div>',
					'</div>',
				'</div></div></div><div class="{boxCls}-bl"><div class="{boxCls}-br"><div class="{boxCls}-bc"></div></div></div>',
			'</body>',
		'</html>'
	),
	// private
	onShow: function() {
		var doc = this.getDocument(),
			br = air.Screen.mainScreen.visibleBounds.bottomRight,
			h = doc.getElementById(this.msgId).clientHeight + this.extraHeight;
		this.setHeight(h);
		if (this.stack) {
			this.stack.arrange();
		} else this.setPosition(br.x - this.getWidth(), br.y - h);

		Ext.air.Notify.superclass.onShow.call(this);

		if (this.clickToClose === true) {
			doc.addEventListener('click', (function() {
				this.close();
			}).createDelegate(this), true);
		}
		if (this.hideDelay !== false) {
			this.close.defer(this.hideDelay, this);
		}
	},
	onHide: function() {
		if (this.stack) this.stack.arrange();
		Ext.air.Notify.superclass.onHide.call(this);
	},
	onClose: function() {
		if (this.stack) this.stack.remove(this);
		Ext.air.Notify.superclass.onClose.call(this);
	}
});
/**
 * @class Ext.air.NotifyManager
 * Class to manage all Ext.air.Notifiers and arrange their position if they are stackable
 * @singleton
 * @private
 */
Ext.air.NotifyManager = function() {
	var list = [],
		unstackedCount = 0;
	return {
		add: function(w) {
			if (w.stackable && w.stackPosition != 'bottom') {
				list.push(w);
			} else {
				// make sure, all unstacked notifiers are on top of list
				list.splice(unstackedCount, 0, w);
				if (!w.stackable) unstackedCount++;
			}
		},
		remove: function(w) {
			list.remove(w);
		},
		arrange: function() {
			var h = 0, wh = 0,
				b = air.Screen.mainScreen.visibleBounds.bottomRight;
			Ext.each(list, function(w) {
				if (!w.isVisible()) return;
				wh = w.getHeight();
				if (w.stackable) {
					h += wh;
					w.setPosition(b.x - w.getWidth(), b.y - h);
				} else {
					// calculate the maximum height of all unstacked notifiers
					// no difficult code necessary, because all unstacked notifiers are at top of list
					h = Math.max(h, wh);
					w.setPosition(b.x - w.getWidth(), b.y - wh);
				}
			});
		}
	};
}();

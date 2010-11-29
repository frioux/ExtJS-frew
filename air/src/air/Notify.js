/**
 * @class Ext.air.Notify
 * @extends Ext.air.NativeWindow
 * A special lightweight {@link Ext.air.NativeWindow} which displays in the bottom right
 * corner of your desktop and is used to show small notification messages.
 * @constructor
 * @param {Object} config Config options
 */
Ext.air.Notify = function(config) {
	config = config || {};
	Ext.apply(this, config);

	var html = this.tpl.apply({
		msg: this.msg,
		iconCls: this.iconCls,
		icon: this.icon || Ext.BLANK_IMAGE_URL,
		title: this.title,
		msgId: this.msgId,
		boxCls: this.boxCls,
		cls: this.cls,
		style: this.style
	});
	// boxWrap it
	if (this.boxCls !== false) {
		var d = Ext.fly(document.createElement('div')),
			c = d.insertHtml('afterBegin', html, true);
		c.boxWrap(this.boxCls);
		html = d.dom.innerHTML;
		d.remove();
	}
	this.fileQuery.bodyHtml = html;
	
	if (this.height == 'auto') {
		this.height = undefined;
		this.autoHeight = true;
	} else this.autoHeight = false;
	
	Ext.air.Notify.superclass.constructor.call(this, config);
	
	// register with NotifyManager to handle stacking
	try {
		this.stack = Ext.air.App.getRootHtmlWindow().Ext.air.NotifyManager;
	} catch(e) {
		this.stack = Ext.air.NotifyManager;
	}
	if (this.stack) this.stack.add(this);
};
Ext.extend(Ext.air.Notify, Ext.air.NativeWindow, {
	hidden: false,
	systemChrome: 'none',
	transparent: true,
	stateful: false,
	extraHeight: 22,
	type: 'lightweight',
	minHeight: 0,
	destroyOnParentClose: false,
	notify: false,
	parent: false,
	alwaysInFront: true,
	/**
	 * @cfg {Boolean} draggable
	 * @hide
	 */
	draggable: false,
	/**
	 * @cfg {String} msg
	 * The message to display
	 */
	/**
	 * @cfg {String} css
	 * An additional css class to add to the message element.
	 */
	css: '',
	/**
	 * @cfg {Number} width
	 * The width of the window in pixels (defaults to <code>400</code>).
	 * The height depends on the content.
	 */
	width: 400,
	/**
	 * @cfg {Number/String} height
	 * The height of the window in pixels or <code>'auto'</code> if
	 * the height should fit to the content. Defaults to <code>'auto'</code>.
	 */
	height: 'auto',
	/**
	 * @cfg {Object} fileQuery
	 * See {@link Ext.air.NativeWindow#fileQuery} for more information. Defaults to <pre><code>
{
	type: 'queryExt',
	root: Ext.air.App.getRootHtmlWindow().document,
	js: false
}
	 * </code></pre>
	 * This includes ext-all.css and ext-air.css by default.
	 * Change this, if you need additional css files.
	 */
	fileQuery: {
		type: 'queryExt',
		root: Ext.air.App.getRootHtmlWindow().document,
		js: false
	},
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
	 * @cfg {String} icon
	 * (optional) a path to an icon to display in the top right corner of the notify window
	 * (defaults to <code>Ext.BLANK_IMAGE_URL</code>).
	 */
	icon: undefined,
	/**
	 * @cfg {String} iconCls
	 * (optional) The CSS class selector that specifies a background image to be used as
	 * the header icon (defaults to <code>''</code>). If set, the {@link #icon} config
	 * option should not be set.
	 */
	iconCls: '',
	/**
	 * @cfg {String/Boolean} boxCls
	 * A css class to apply to the box wrapping elements or <code>false</code> to not wrap
	 * the message into a box frame (defaults to <code>'x-box'</code>).
	 */
	boxCls: 'x-box',
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
	 * @cfg {Ext.XTemplate} tpl
	 * (optional) A XTemplate to load as html body in the native window.
	 */
	tpl: new Ext.XTemplate(
		'<div id="{msgId}" class="notify {cls}" style="{style}">',
			'<img src="{icon}" class="notify-icon {iconCls}" />',
			'<tpl if="title">',
				'<div class="notify-title">{title}</div>',
			'</tpl>',
			'<div class="notify-msg">{msg}</div>',
		'</div>'
	),
	/**
	 * @cfg {Boolean} closable
	 * @hide
	 */
	/**
	 * @cfg {Boolean} closeAction
	 * @hide
	 */
	/**
	 * @cfg {String} file
	 * @hide
	 */
	/**
	 * @cfg {String} html
	 * @hide
	 */
	/**
	 * @cfg {Number} x
	 * @hide
	 */
	/**
	 * @cfg {Number} y
	 * @hide
	 */
	/**
	 * @cfg {Boolean} trusted
	 * @hide
	 */
	/**
	 * @cfg {air.NativeWindow} win
	 * @hide
	 */
	// private
	onShow: function() {
		var doc = this.getDocument(),
			br = air.Screen.mainScreen.visibleBounds.bottomRight,
			bh = doc.body.childNodes[0].clientHeight,
			me = doc.getElementById(this.msgId),
			dh = me.clientHeight,
			h = this.autoHeight ? dh + this.extraHeight : parseInt(this.height, 10);
		
		if (!this.autoHeight != 'auto') {
			me.style.height = (h - bh + dh) + 'px';
		}
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

CodeWindow = Ext.extend(Ext.air.Window, {
	hidden: false,
	autoScroll: true,
	title: 'new Ext.air.Window',
	buttonAlign: 'center',
	trayIcon: '/lib/extair/resources/icons/extlogo16.png',
	trayTip: "Window is minimized to tray\nClick to open",
	fileQuery: {
		type: 'queryAttribute',
		root: Ext.air.App.getRootHtmlWindow().document,
		attribute: 'query'
	},
	bodyCfg: {
		tag: 'pre',
		cls: 'prettyprint linenums lang-js x-window-body' // add default class, too, since it is not added on custom elements
	},
	onInit: function(win, X) {
		this.createBodyHtml();
		this.tbar = [{
			text: 'Copy to Clipboard',
			handler: this.copyToClipboard,
			scope: this
		}];
		this.fbar = [{
			text: 'Close',
			handler: function() {
				this[this.closeAction || 'close']();
			},
			scope: this
		}];
		CodeWindow.superclass.onInit.call(this, win, X);
	},
	onComplete: function() {
		CodeWindow.superclass.onComplete.call(this);
		var w = this.getWindow(),
			v = this.getViewport();
		if (v.rendered) {
			w.prettyPrint();
		} else {
			v.on('render', function() {
				w.prettyPrint();
			}, this, {single: true});
		}
	},
	createBodyHtml: function() {
		var c = "",
			cfg = this.source || this.initialConfig || {},
			d,
			s;
		Ext.iterate(cfg, function(k, v) {
			if (!Ext.isEmpty(v)) {
				d = Ext.air.Window.prototype[k] === v ? " // default value" : "";
				s = Ext.isString(v) ? "'" : "";
				c += ["\t", k, ": ", s, String(v), s, ",", d, "\n"].join("");
			}
		});
		this.bodyHtml = ["new Ext.air.Window({\n", c, "\thidden: false\n});"].join("");
	},
	copyToClipboard: function() {
		Ext.air.Clipboard.setData(air.ClipboardFormats.TEXT_FORMAT, this.bodyHtml);
	}
});

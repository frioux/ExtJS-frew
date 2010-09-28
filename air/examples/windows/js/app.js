Ext.onReady(function() {
	var codeWin,
		form = new WinForm(),
		// this should definitely be changed into official extjs docs site -> air docs should be available there!
		docs = 'http://darmsalad.ohost.de/?class=Ext.air.NativeWindow';

	new Ext.air.Window({
		win: window.nativeWindow,
		width: 800,
		height: 600,
		autoScroll: true,
		items: [
			form
		],
		tbar: [{
			text: 'Show source',
			handler: function() {
				if (!codeWin) {
					codeWin = new CodeWindow({
						closeAction: 'hide',
						width: 600,
						height: 300,
						title: 'Source of root window',
						source: {
							win: {
								toString: function() {
									return "window.nativeWindow, // wrap this around the native root window, use this always on root windows";
								}
							},
							width: 800,
							height: 600
						}
					});
				}
				codeWin.show();
			}
		},'-',{
			text: 'Open Docs',
			clickEvent: 'mousedown',
			handler: function() {
				var f = form.find('hasFocus', true)[0];
				air.navigateToURL(new air.URLRequest(docs + (f ? '&member=' + f.name : '')), "_blank");
			}
		}],
		buttonAlign: 'center',
		fbar: [{
			text: 'Create new window',
			handler: function() {
				var o = Ext.apply({}, form.getForm().getFieldValues());
				new CodeWindow(o);
			}
		}]
	});
}, window, {single: true});

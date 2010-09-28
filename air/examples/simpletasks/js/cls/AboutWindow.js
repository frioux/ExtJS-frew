Ext.air.NativeWindowManager.getAboutWindow = function() {
	var win,
		winId = 'about';
	if (win = this.get(winId)) {
		win.setActive(true);
	} else {
		win = new Ext.air.Window({
			id: winId,
			title: 'About Simple Tasks',
			html: [
				'<div style="float:left;width:128px;padding:20px;">',
					'<img src="/lib/extair/resources/icons/extlogo128.png"/>',
				'</div>',
				'<div style="float:left;width:160px;padding-top:40px;">',
					'<span style="font-size:16px;">Simple Tasks v3.3+</span><br/><br/>',
					'Copyright &copy; 2010 - Sencha Inc.<br/>',
					'<a href="http://www.sencha.com/" target="_blank">http://www.sencha.com/</a><br/><br/>',
				'</div>',
				'<div style="clear:left;padding:0 20px 20px;">',
					'Simple Tasks and associated source code is licensed under the GNU General Public License version 3 (GPL v3).<br/>',
					'<a href="http://www.gnu.org/copyleft/gpl.html" target="_blank">http://www.gnu.org/copyleft/gpl.html</a>',
				'</div>'
			].join(''),
			buttonAlign: 'center',
			buttons: [{
				text: 'OK',
				width: 70,
				handler: function() {
					win.hide();
				}
			}],
			width: 350,
			height: 350,
			resizable: false,
			type: 'utility',
			closeAction: 'hide',
			alwaysInFront: true
		});
	}
	return win;
};

Ext.air.NativeWindowManager.getPrefWindow = function(){
	var win,
		winId = 'prefs',
		timeField;
	if (win = this.get(winId)) {
		win.setActive(true);
	} else {
		var d = new Date().clearTime(true);
		d = d.add('mi', Ext.state.Manager.get('defaultReminder'));

		win = new Ext.air.Window({
			id: winId,
			title: 'Set Reminder Time',
			width: 300,
			height: 180,
			resizable: false,
			type: 'utility',
			layout: 'vbox',
			layoutConfig: {
				align: 'stretch',
				pack: 'center',
				padding: '2 20'
			},
			buttonAlign: 'center',
			minButtonWidth: 80,
			hidden: false,
			buttons: [{
				text: 'OK',
				handler: function() {
					var t = timeField.parseDate(timeField.getValue()),
						m = t.getMinutes() + (t.getHours() * 60);
					Ext.state.Manager.set('defaultReminder', m);
					win.hide();
				}
			},{
				text: 'Cancel',
				handler: function() {
					win.hide();
				}
			}],
			listeners: {
				'init': function(w, win, X) {
					var text = new X.BoxComponent({
						autoEl: {
							html: 'When setting quick reminders, default the time to:'
						}
					});
					timeField = new X.form.TimeField({
						allowBlank: false,
						forceSelection: true,
						editable: false,
						value: d
					});
					w.items = [
						text,
						timeField
					]
				}
			}
		});
	}
	return win;
};

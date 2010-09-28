Ext.air.NativeWindowManager.getReminderWindow = function(taskId) {
	var win,
		winId = 'reminder' + taskId;
	
	var onComplete = function() {
		tx.data.tasks.lookup(taskId, function(task) {
			var d = task.get('dueDate');
			win.setTitle('Reminder - ' + Ext.util.Format.ellipsis(task.get('title'), 40));
			win.titleField.setValue(Ext.util.Format.ellipsis(task.get('title'), 80));
			win.dueField.setValue(d ? d.format('F d, Y') : 'None');
			win.getNative().notifyUser('informational');
			Ext.air.Sound.play('resources/sound/beep.mp3', 5000);
		});
	};
	
	if (win = this.get(winId)) {
		// do not activate visible windows every 10s
		if (!win.isVisible()) {
			win.setActive(true);
			onComplete();
		}
	} else {
		win = new Ext.air.Window({
			id: winId,
			width: 400,
			height: 200,
			maximizable: false,
			resizable: false,
			title: 'Reminder',
			closeAction: 'hide',
			fileQuery: {
				type: 'queryExt',
				include: [
					'/resources/css/reminder.css'
				]
			},
			layout: 'form',
			defaults: {
				anchor: '0'
			},
			labelWidth: 150,
			hidden: false,
			minButtonWidth: 80,
			buttonAlign: 'center',
			buttons: [{
				text: 'Dismiss',
				handler: function() {
					win.hide();
				}
			},{
				text: 'Snooze',
				handler: function() {
					var min = parseInt(win.reminderField.getValue(), 10),
						reminder = new Date().add('mi', min),
						o = tx.data.tasks.getById(taskId);
					if (o) {
						o.set('reminder', reminder);
					} else {
						tx.data.tasks.table.updateBy({
							reminder: reminder
						}, "taskId = ?", [taskId]);
					}
					win.hide();
				}
			}],
			listeners: {
				'init': function(w, win, X) {
					w.titleField = new X.form.DisplayField({
						hideLabel: true,
						id: 'task-title'
					});
					w.dueField = new X.form.DisplayField({
						fieldLabel: 'Due'
					});
					w.reminderField = new X.form.ComboBox({
						forceSelection: true,
						editable: false,
						allowBlank: false,
						fieldLabel: 'Remind me again in',
						mode: 'local',
						triggerAction: 'all',
						value: 5,
						store: [
							[5, '5 minutes'],
							[10, '10 minutes'],
							[15, '15 minutes'],
							[30, '30 minutes'],
							[60, '1 hour'],
							[120, '2 hours'],
							[240, '4 hours'],
							[480, '8 hours'],
							[720, '12 hours'],
							[1440, '1 day'],
							[2880, '2 days'],
							[4320, '3 days'],
							[5760, '4 days'],
							[10080, '1 week'],
							[20160, '2 weeks'],
							[30240, '3 weeks'],
							[40320, '4 weeks']
						]
					});
					w.items = [
						w.titleField,
						w.dueField,
						w.reminderField
					];
				},
				'complete': onComplete
			}
		});
	}
	return win;
};

// Grid column plugin that does the complete/active button in the left-most column
tx.grid.CompleteColumn = Ext.extend(Ext.grid.Column, {
	width: 22,
	header: '<div class="task-col-hd"></div>',
	fixed: true,
	id: 'task-col',
	menuDisabled: true,
	renderer: function() {
		return '<div class="task-check"></div>';
	},
	// it is a plugin
	init: function(grid) {
		this.grid = grid;
		grid.on('render', function(){
			var view = grid.getView();
			view.mainBody.on({
				'mousedown': this.onMouseDown,
				'mouseover': this.onMouseOver,
				'mouseout': this.onMouseOut,
				scope: this
			});
		}, this, {single: true});
	},
	// custom methods
	className: 'task-check',
	isEl: function(t) {
		return Ext.fly(t).hasClass(this.className);
	},
	getRecord: function(t) {
		return this.grid.getStore().getAt(this.grid.getView().findRowIndex(t));
	},
	onMouseDown: function(e, t) {
		if (this.isEl(t)) {
			e.stopEvent();
			var r = this.getRecord(t);
			r.set('completed', !r.data.completed);
			this.grid.getStore().applyFilter();
		}
	},
	onMouseOver: function(e, t) {
		if (this.isEl(t)) {
			Ext.fly(t.parentNode).addClass(this.className + '-over');
		}
	},
	onMouseOut: function(e, t) {
		if (this.isEl(t)) {
			Ext.fly(t.parentNode).removeClass(this.className + '-over');
		}
	}
});


tx.grid.ReminderColumn = Ext.extend(tx.grid.CompleteColumn, {
	id: 'reminder-col',
	dataIndex: 'reminder',
	header: '<div class="reminder-col-hd"></div>',
	className: 'reminder',
	renderer: function(v) {
		return '<div class="reminder '+(v ? 'reminder-active' : '')+'"></div>';
	},
	// custom methods
	onMouseDown: function(e, t) {
		if (this.isEl(t)) {
			e.stopEvent();
			this.record = this.getRecord(t);
			if (!this.record.data.completed) {
				this.showMenu(t);
			}
		}
	},
	onMenuCheck: function(item) {
		if (item.reminder === false) {
			this.record.set('reminder', '');
		} else {
			var s = this.record.data.dueDate ? this.record.data.dueDate.clearTime(true) : new Date().clearTime();
			s = s.add(Date.MINUTE, Ext.state.Manager.get('defaultReminder')).add(Date.MINUTE, item.reminder * -1);
			this.record.set('reminder', s);
		}
	},
	showMenu: function(t) {
		if (!this.menu) {
			this.menu = new Ext.menu.Menu({
				items: [{
					text: 'No Reminder',
					reminder: false,
					handler: this.onMenuCheck,
					scope: this
				},'-',{
					text: 'On the Due Date',
					reminder: 0,
					handler: this.onMenuCheck,
					scope: this
				},'-',{
					text: '1 day before',
					reminder: 24*60,
					handler: this.onMenuCheck,
					scope: this
				},{
					text: '2 days before',
					reminder: 48*60,
					handler: this.onMenuCheck,
					scope: this
				},{
					text: '3 days before',
					reminder: 72*60,
					handler: this.onMenuCheck,
					scope: this
				},{
					text: '1 week before',
					reminder: 7*24*60,
					handler: this.onMenuCheck,
					scope: this
				},{
					text: '2 weeks before',
					reminder: 14*24*60,
					handler: this.onMenuCheck,
					scope: this
				},'-',{
					text: 'Set Default Time...',
					handler: function(){
						Ext.air.NativeWindowManager.getPrefWindow();
					}
				}]
			});
		}
		this.menu.show(t, 'tr-br?');
	}
});

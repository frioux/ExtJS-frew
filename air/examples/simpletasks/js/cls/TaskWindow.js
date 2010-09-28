Ext.air.NativeWindowManager.getTaskWindow = function(taskId){
	var win,
		winId = 'task',
		isNew = !taskId,
		completed = false;
	
	var getTask = function(callback, scope) {
		tx.data.tasks.lookup(taskId, function(task) {
			if (task) {
				//workaround WebKit cross-frame date issue
				fixDateMember(task.data, 'completedDate');
				fixDateMember(task.data, 'reminder');
				fixDateMember(task.data, 'dueDate');
				if (Ext.isFunction(callback)) {
					callback.call(scope || window, task);
				}
			}
		});
	};
	
	var setCompleted = function(value) {
		completed = !!value;
		win.completeBtn.setText(completed ? 'Mark Active' : 'Mark Complete');
		win.completeBtn.setIconClass(completed ? 'icon-mark-active' : 'icon-mark-complete');
		win.hasReminder.setDisabled(completed);
		win.reminder.setDisabled(completed || !win.hasReminder.checked);
		if (!completed) {
			setMsg(null);
		}
	};
	
	var refreshData = function() {
		if (!isNew) {
			getTask(function(task) {
				win.hasReminder.setValue(!!task.get('reminder'));
				win.form.getForm().loadRecord(task);
				setCompleted(task.get('completed'));
				win.setTitle('Task - ' + Ext.util.Format.ellipsis(task.get('title'), 40));
			});
		}
	};
	
	var setMsg = function(msgText) {
		var last;
		if (!msgText) {
			win.msg.hide();
		} else {
			win.msg.show();
			win.msg.update(msgText);
		}
		win.description.anchorSpec.bottom = function(v) {
			if (v !== last) {
				last = v;
				var h = win.msg.getHeight();
				return v - 110 - (h ? h + 8 : 0);
			}
		};
		win.form.doLayout();
	};

	var validate = function() {
		if (Ext.isEmpty(win.title.getValue(), false)) {
			Ext.air.Msg.alert('Warning', 'Unable to save changes. A subject is required.', function(){
				win.title.focus();
			});
			return false;
		}
		return true;
	};
	
	var saveData = function() {
		var task;
		if (isNew) {
			task = tx.data.tasks.createTask(
				win.title.getValue(), 
				win.list.getRawValue(), 
				win.dueDate.getValue(), 
				win.description.getValue(),
				completed
			);
			win.form.getForm().updateRecord(task);
		} else {
			getTask(function(task) {
				task.set('completed', completed);
				win.form.getForm().updateRecord(task);
			});
		}
		if(!win.hasReminder.getValue()){
			win.reminder.setValue('');
		}
	};

	
	var onComplete = function() {
		refreshData.defer(10);
		win.title.focus();
	};

	
	if(win = this.get(winId)) {
		win.setActive(true);
		onComplete();
	} else {
		win = new Ext.air.Window({
			id: winId,
			width: 600,
			height: 350,
			hidden: false,
			title: 'Task',
			layout: 'fit',
			fileQuery: {
				type: 'queryExt',
				include: [
					'/resources/css/main.css',
					'/resources/css/task.css',
					'/js/cls/ext-config.js',
					'/js/cls/SelectBox.js',
					'/js/cls/DateTimeField.js',
					'/js/cls/ListLoader.js',
					'/js/cls/TreeSelector.js',
					'/js/cls/ListSelector.js'
				]
			},
			buttonAlign: 'center',
			minButtonWidth: 80,
			buttons:[{
				text: 'OK',
				handler: function(){
					if(validate()) {
						saveData();
						win.hide();
					}
				}
			},{
				text: 'Cancel',
				handler: function() {
					win.hide();
				}
			}],
			listeners: {
				'beforeclose': function() {
					tx.data.lists.unbindTree(win.list.tree);
				},
				'complete': function() {
					// to have a correct task list value the first time
					win.list.tree.getRootNode().reload(function() {
						onComplete();
					});
				},
				'init': function(w, win, X) {
					w.completeBtn = new X.Button({
						id:'cpl-btn', 
						iconCls: 'icon-mark-complete', 
						text: 'Mark Complete',
						handler: function(){
							setCompleted(!completed);
							if(completed) {
								setMsg('This task was completed on ' + new Date().format('l, F d, Y'));
							}
							if(validate()) {
								(function(){
									saveData();
									if (completed) {
										win.close();
									}
								}).defer(250);
							}
						}
					});
					var tb = new X.Toolbar({
						id:'main-tb',
						items:[w.completeBtn,{
						},'-',{
							iconCls: 'icon-delete-task',
							text: 'Delete',
							handler: function(){
								Ext.air.Msg.confirm('Confirm Delete', 'Are you sure you want to delete this task?', function(btn){
									if(btn == 'yes'){
										tx.data.tasks.remove(getTask());
										win.hide();
									}
								});
							}}
						]
					});
					w.title = new X.form.TextField({
						fieldLabel: 'Task Subject',
				        name: 'title',
				        anchor: '0'
				    });
						
					w.dueDate = new X.form.DateField({
						fieldLabel: 'Due Date',
						name: 'dueDate',
						width: 135,
						format: 'm/d/Y'
					});
					
					w.list = new win.tx.form.ListSelector({
				        fieldLabel: 'Task List',
						name: 'listId',
						store: tx.data.lists,
						anchor: '0',
						listeners: {
							'render': function() {
								this.menu.on('beforeshow', function(m) {
									w.list.tree.setWidth(Math.max(180, w.list.getSize().width));
								});
							},
							single: true
						}
				    });
					
					w.hasReminder = new X.form.Checkbox({
						boxLabel: 'Reminder:',
						checked: false,
						listeners: {
							'check': function(cb, checked) {
								w.reminder.setDisabled(!checked);
								if (checked) {
									getTask(function(task) {
										w.reminder.setValue(tx.data.getDefaultReminder(task));
									});
								}
							}
						}
					});
					
					w.reminder = new X.ux.form.DateTime({
						name: 'reminder',
						disabled: true,
						timeFormat: 'g:i A',
						dateFormat: 'm/d/Y',
						timeConfig: {
							listClass:'x-combo-list-small',
							maxHeight: 100
						}
					});
					
					w.description = new X.form.HtmlEditor({
				        hideLabel: true,
				        name: 'description',
				        anchor: '0 -110',  // anchor width by percentage and height by raw adjustment
				        onEditorEvent : function(e){
					        var t;
					        if(e.browserEvent.type == 'mousedown' && (t = e.getTarget('a', 3))){
					            t.target = '_blank';
					        }
					        this.updateToolbar();
					    }
				    });
				    w.msg = new X.BoxComponent({
						autoEl: {id:'msg'}
					});
					
					w.form = new X.form.FormPanel({
						region:'center',
				        unstyled: true,
				        labelWidth: 75,
				        bodyStyle: 'padding:10px 10px 5px 10px',
				        items: [w.msg,
						w.title,
						{
							layout: 'column',
							anchor: '100%',
							baseCls: 'x-plain',
							items: [{
								width: 250,
								layout: 'form',
								baseCls: 'x-plain',
								items: w.dueDate
							}, {
								columnWidth: 1,
								layout: 'form',
								baseCls: 'x-plain',
								labelWidth:55,
								items: w.list
							}]
						},{
							xtype:'box',
							autoEl: {cls:'divider'}
						},{
							layout: 'column',
							anchor: '100%',
							baseCls: 'x-plain',
							items: [{
								width: 80,
								layout: 'form',
								baseCls: 'x-plain',
								hideLabels: true,
								items: w.hasReminder
							}, {
								columnWidth: 1,
								layout: 'form',
								baseCls: 'x-plain',
								hideLabels: true,
								items: w.reminder
							}]
						}, 
						w.description]
					});
					w.items = [
						w.form
					];
					w.tbar = tb;
					X.QuickTips.init();
				}
			}
		});
	}
	return win;
};

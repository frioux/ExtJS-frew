tx.ReminderManager = function(){
	var table;
	
	var run = function(){
		table.selectBy("WHERE completed = 0 AND reminder != '' AND reminder <= ?", [new Date()], function(type, success, result) {
			if (success === true) {
				Ext.each(result.records, function(r) {
					showReminder.defer(10, window, [r]);
				});
			}
		});
	};
	
	var showReminder = function(task){
		var o;
		if (o = tx.data.tasks.getById(task.taskId)) { // if currently loaded
			o.set('reminder', '');
		}
		else {   // else update db directly
			table.update({
				taskId: task.taskId,
				reminder: ''
			});
		}
		Ext.air.NativeWindowManager.getReminderWindow(task.taskId);
	}
	
	return {
		init : function(){
			table = tx.data.conn.getTable('task', 'taskId');
			setInterval(run, 10000);
		}
	}	
}();

tx.data.TaskStore = Ext.extend(Ext.data.GroupingSQLiteStore, {
	autoSave: true,
	autoCreateTable: true,
	batch: true,
	constructor: function() {
		tx.data.TaskStore.superclass.constructor.call(this, {
			conn: tx.data.conn,
			tableName: 'task',
			idProperty: 'taskId',
			sortInfo: {
				field: 'dueDate',
				direction: 'ASC'
			},
			groupField: 'dueDate',
			taskFilter: 'all',
			fields: tx.data.Task,
			autoSave: true
		});
	},
	applyFilter : function(filter){
		if(filter !== undefined){
			this.taskFilter = filter;
		}
		var value = this.taskFilter;
		if(value == 'all'){
			return this.clearFilter();
		}
		return this.filterBy(function(item){
			return item.data.completed === value;
		});
	},

	addTask : function(data){
		this.suspendEvents();
		this.clearFilter();
		this.resumeEvents();
		var t = new tx.data.Task(data);
		this.add(t);
		this.suspendEvents();
		this.applyFilter();
		this.applyGrouping(true);
		this.resumeEvents();
		this.fireEvent('datachanged', this);
		return t;
	},

	loadList: function(listId){
		var multi = Ext.isArray(listId);
		this.activeList = multi ? listId[0] : listId;
		this.suspendEvents();
		if(multi){
			var ps = [];
			for(var i = 0, len = listId.length; i < len; i++){
				ps.push('?');
			}
			this.load({
				params: {
					where: 'where listId in (' + ps.join(',') + ')',
					args: listId,
					callback: function() {
						this.applyFilter();
						this.applyGrouping(true);
					},
					scope: this
				}
			});
		}else{
			this.load({params: {
				where: 'where listId = ?',
				args: [listId],
				callback: function() {
					this.applyFilter();
					this.applyGrouping(true);
				},
				scope: this
			}});
		}		
		this.resumeEvents();
		this.fireEvent('datachanged', this);
	},
	
	removeList: function(listId) {
		this.table.removeBy("listId = ?", [listId], function() {
			this.reload();
		}, this);
	},
	
	prepareTable : function(){
		try {
			this.createTable({
				name: 'task',
				key: 'taskId',
				fields: tx.data.Task.prototype.fields
			});
		} catch (e) {
			console.log(e);
		}
	},
		
	createTask : function(title, listId, dueDate, description, completed){
		if(!Ext.isEmpty(title)){
			return this.addTask({
				taskId: Ext.uniqueId(),
				title: Ext.util.Format.htmlEncode(title),
				dueDate: dueDate||'',
				description: description||'',
				listId: listId,
				completed: completed || false
			});
		}
	},
	
	afterEdit : function(r){
		if(r.isModified(this.getGroupState())){
			this.applyGrouping();
		}
		//workaround WebKit cross-frame date issue
		fixDateMember(r.data, 'completedDate');
		fixDateMember(r.data, 'reminder');
		fixDateMember(r.data, 'dueDate');
		if(r.isModified('completed')){
			r.editing = true;
			r.set('completedDate', r.data.completed ? new Date() : '');
			r.editing = false;
		}
		tx.data.TaskStore.superclass.afterEdit.apply(this, arguments);
	},
	
	init : function(){
		tx.data.lists.load({
			callback: function() {
				this.load({
					callback: function(){
						// first time?
						if(this.getCount() < 1){
							Ext.air.Msg.confirm('Create Tasks?', 'Your database is currently empty. Would you like to insert some demo data?', 
								function(btn){
									if (btn == 'yes') {
										tx.data.lists.autoSave = false;
										tx.data.lists.loadDemoLists();
										tx.data.lists.on('save', function() {
											tx.data.lists.autoSave = true;
											this.autoSave = false;
											this.loadDemoTasks();
											this.save();
											this.autoSave = true;
										}, this, {single: true});
										tx.data.lists.save();	
									}
								}, this);
						}
					},
					scope: this
				});
			},
			scope: this
		});
	},
	
	lookup : function(id, callback, scope){
		var task;
		if(task = this.getById(id)){
			if (Ext.isFunction(callback)) {
				callback.call(scope || window, task);
			}
		}
		this.table.selectBy("where taskId = ?", [id], function(success, result) {
			if (success === true) {
				var res = this.reader.readRecords(result.records);
				if (Ext.isFunction(callback)) {
					console.lof(res);
					return;
					callback.call(scope || window, res.records[0] || null);
				}
			}
		}, this);
	},
	
	/* This is used to laod some demo tasks if the task database is empty */
	loadDemoTasks: function(){
		var s = new Date();
		// hardcoded demo tasks
		this.addTask({taskId: Ext.uniqueId(), title:'Update Ext 2.0 documentation', listId:'ext2', description:'', dueDate: s.add('d', 21), completed: false, reminder: ''});
		this.addTask({taskId: Ext.uniqueId(), title:'Release Ext 2.l Beta 1', listId:'ext2', description:'', dueDate:s.add('d', 2), completed: false, reminder: s.add('d', 2).clearTime(true).add('h', 9)});
		this.addTask({taskId: Ext.uniqueId(), title:'Take wife to see movie', listId:'family', description:'', dueDate:s.add('d', 2), completed: false, reminder: ''});
		this.addTask({taskId: Ext.uniqueId(), title:'Finish Simple Tasks v2 sample app', listId:'ext2', description:'', dueDate:s.add('d', 2), completed: false, reminder: ''});
		this.addTask({taskId: Ext.uniqueId(), title:'Do something other than work', listId:'fun', description:'', dueDate:s.add('d', -1), completed: false, reminder: ''});
		this.addTask({taskId: Ext.uniqueId(), title:'Go to the grocery store', listId:'family', description:'', dueDate:s.add('d', -1), completed: true, reminder: '', completedDate: new Date()});
		this.addTask({taskId: Ext.uniqueId(), title:'Reboot my computer', listId:'personal-misc', description:'', dueDate:s, completed: false, reminder: ''});
		this.addTask({taskId: Ext.uniqueId(), title:'Respond to emails', listId:'work-misc', description:'', dueDate:s, completed: true, reminder: '', completedDate: new Date()});
	}
});

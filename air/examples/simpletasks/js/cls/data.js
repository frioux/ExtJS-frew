// Unique task ids, if the time isn't unique enough, the addition 
// of random chars should be
Ext.uniqueId = function(){
	var t = String(new Date().getTime()).substr(4);
	var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i = 0; i < 4; i++){
		t += s.charAt(Math.floor(Math.random()*26));
	}
	return t;
}

// Grab a SQL connection instance
tx.data.conn = new Ext.data.SQLiteDB({
	mode: air.SQLMode.CREATE // autoCreate Database file
});

// Define the Task data type
tx.data.Task = Ext.data.Record.create([
    {name: 'taskId', type:'string'},
    {name: 'listId', type:'string'},
    {name: 'title', type:'string'},
    {name: 'description', type:'string'},
    {name: 'dueDate', type:'date', dateFormat: tx.data.conn.dateFormat, defaultValue: ''},
    {name: 'completed', type:'boolean'},
    {name: 'completedDate', type:'date', dateFormat: tx.data.conn.dateFormat, defaultValue: ''},
    {name: 'reminder', type:'date', dateFormat: tx.data.conn.dateFormat, defaultValue: ''}
]);

// Define the List data type
tx.data.List = Ext.data.Record.create([
    {name: 'listId', type:'string'},
    {name: 'parentId', type:'string'},
    {name: 'listName', type:'string'},
    {name: 'isFolder', type:'boolean'}
]);



tx.data.tasks = new tx.data.TaskStore();
tx.data.lists = new tx.data.ListStore();


tx.data.getDefaultReminder = function(task){
	var s = task.data.dueDate ? task.data.dueDate.clearTime(true) : new Date().clearTime();
	s = s.add('mi', Ext.state.Manager.get('defaultReminder'));
	return s;
};


tx.data.getActiveListId = function(){
    var id = tx.data.tasks.activeList;
    if (!id || tx.data.lists.getById(id).get('isFolder')) {
    	var first = tx.data.lists.findExact('isFolder', false);
        if (first != -1) {
            id = tx.data.lists.getAt(first).id;
        } else {
            id = tx.data.lists.newList().id;
        }
    }
    return id;
};


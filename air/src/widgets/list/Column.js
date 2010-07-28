// Define the whole columns, because overriding the constructor doesn't work in safari (webkit) (?)
// http://www.extjs.com/forum/showthread.php?t=18362
Ext.list.Column = Ext.extend(Object, {
	isColumn: true,
	align: 'left',
	header: '',
	width: null,
	cls: '',
	constructor : function(c){
		if(!c.tpl){
			c.tpl = new Ext.Template('{' + c.dataIndex + '}');
		}
		else if(Ext.isString(c.tpl)){
			c.tpl = new Ext.Template(c.tpl);
		}
		
		Ext.apply(this, c);
	}
});
Ext.reg('lvcolumn', Ext.list.Column);
Ext.list.NumberColumn = Ext.extend(Ext.list.Column, {
	format: '0,000.00',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.Template('{' + c.dataIndex + ':number("' + (c.format || this.format) + '")}');       
		Ext.list.NumberColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvnumbercolumn', Ext.list.NumberColumn);
Ext.list.DateColumn = Ext.extend(Ext.list.Column, {
	format: 'm/d/Y',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.Template('{' + c.dataIndex + ':date("' + (c.format || this.format) + '")}');      
		Ext.list.DateColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvdatecolumn', Ext.list.DateColumn);
Ext.list.BooleanColumn = Ext.extend(Ext.list.Column, {
	trueText: 'true',
	falseText: 'false',
	undefinedText: '&#160;',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.Template('{' + c.dataIndex + ':bool("' + (c.trueText || this.trueText) + '","' + (c.falseText || this.falseText) + '","' + (c.undefinedText || this.undefinedText) + '")}');
		Ext.list.BooleanColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvbooleancolumn', Ext.list.BooleanColumn);

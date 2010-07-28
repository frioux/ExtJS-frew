Ext.grid.GroupingView.prototype.startGroup = new Ext.XTemplate(
	'<div id="{groupId}" class="x-grid-group {cls}">',
		'<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div class="x-grid-group-title">{groupTextTpl}</div></div>',
		'<div id="{groupId}-bd" class="x-grid-group-body">'
);
Ext.grid.GroupingView.prototype.groupTextTpl = new Ext.XTemplate('{text}');

Ext.override(Ext.grid.GroupingView, {
	doGroupStart : function(buf, g, cs, ds, colCount){
		buf[buf.length] = this.startGroup.apply(Ext.apply({
			groupTextTpl: this.groupTextTpl.apply(g)
		}, g));
	}
});

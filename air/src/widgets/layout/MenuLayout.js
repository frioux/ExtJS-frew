Ext.layout.MenuLayout.prototype.itemTpl = new Ext.XTemplate(
	'<li id="{itemId}" class="{itemCls}">',
		'<tpl if="needsIcon">',
			'<img src="{icon}" class="{iconCls}">',
		'</tpl>',
	'</li>'
);

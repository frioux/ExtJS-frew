Ext.menu.Item.prototype.itemTpl = new Ext.XTemplate(
	'<a id="{id}" class="{cls}" hidefocus="true" unselectable="on" href="{href}"',
		'<tpl if="hrefTarget">',
			' target="{hrefTarget}"',
		'</tpl>',
	 '>',
		 '<img src="{icon}" class="x-menu-item-icon {iconCls}">',
		 '<span class="x-menu-item-text">{text}</span>',
	 '</a>'
);

Ext.list.ListView.prototype.internalTpl = new Ext.XTemplate(
	'<div class="x-list-header"><div class="x-list-header-inner">',
		'<tpl for="columns">',
		'<div style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on" id="{parent.id}-xlhd-{#}">',
			'{header}',
		'</em></div>',
		'</tpl>',
		'<div class="x-clear"></div>',
	'</div></div>',
	'<div class="x-list-body"><div class="x-list-body-inner">',
	'</div></div>'
);
Ext.list.ListView.prototype.tpl = new Ext.XTemplate(
	'<tpl for="rows">',
		'<dl>',
			'<tpl for="parent.columns">',
			'<dt style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on"',
				'<tpl if="cls"> class="{cls}"</tpl>',
				'>{[values.tpl.apply(parent)]}',
			'</em></dt>',
			'</tpl>',
			'<div class="x-clear"></div>',
		'</dl>',
	'</tpl>'
);
Ext.override(Ext.list.ListView, {
	collectData : function(){
		var rs = Ext.list.ListView.superclass.collectData.apply(this, arguments);
		return {
			columns: this.columns,
			rows: rs,
			id: this.id
		}
	}
});

Ext.override(Ext.tree.TreePanel, {
	// make the TreePanel show it's hover highlighting correctly in all scroll positions
	initEvents: Ext.tree.TreePanel.prototype.initEvents.createSequence(function() {
		this.on('resize', this.setRootCtWidth, this);
		this.on('collapsenode', this.setRootCtWidth, this);
		this.on('expandnode', this.setRootCtWidth, this);
	}),
	setRootCtWidth: function() {
		var rct = this.getTreeEl().child('.x-tree-root-ct');
		rct.applyStyles({
			width: 'auto'
		});
		var w = rct.getWidth();
		if (w < this.getEl().getWidth()) {
			rct.applyStyles({
				width: '100%'
			});
			if (rct.getWidth() < w) {
				rct.applyStyles({
					width:  'auto'
				});
			}
		}
	}
});

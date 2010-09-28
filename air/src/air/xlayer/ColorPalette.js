Ext.override(Ext.ColorPalette, {
	// OMG what a stupid hack
	select: Ext.ColorPalette.prototype.select.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && this.ownerCt instanceof Ext.menu.Menu) {
			this.xEl = this.el;
			this.el = Ext.get(document.importNode(this.ownerCt.el.dom, true));
		}
	}).createSequence(function() {
		if (this.xEl) {
			Ext.removeNode(this.el.dom);
			this.el = this.xEl;
		}
	})
});

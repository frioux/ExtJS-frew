Ext.override(Ext.util.ClickRepeater, {
	handleMouseDown: Ext.util.ClickRepeater.prototype.handleMouseDown.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			Ext.air.XWindow.getWindow().Ext.getDoc().on('mouseup', this.handleMouseUp, this);
		}
	}),
	handleMouseUp: Ext.util.ClickRepeater.prototype.handleMouseUp.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			Ext.air.XWindow.getWindow().Ext.getDoc().un('mouseup', this.handleMouseUp, this);
		}
	})
});

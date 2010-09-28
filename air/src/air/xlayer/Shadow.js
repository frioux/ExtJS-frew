Ext.override(Ext.Shadow, {
	show : function(target) {
		var win;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && target instanceof Ext.Layer) {
			win = Ext.air.XWindow.getWindow();
			target = Ext.get(target.dom);
		} else {
			win = window;
			target = Ext.get(target);
		}
		if (!this.el) {
			this.el = win.Ext.Shadow.Pool.pull();
			if (this.el.dom.nextSibling != target.dom) {
				this.el.insertBefore(target);
			}
		}
		this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
		if(Ext.isIE){
			this.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+(this.offset)+")";
		}
		this.realign(
			target.getLeft(true),
			target.getTop(true),
			target.getWidth(),
			target.getHeight()
		);
		this.el.dom.style.display = "block";
	}
});

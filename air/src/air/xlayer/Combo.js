Ext.override(Ext.form.ComboBox, {
	restrictHeight: function(){
		this.innerList.dom.style.height = '';
		var inner = this.innerList.dom,
			xl = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
			pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight,
			h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight),
			ha = this.getPosition()[1]-Ext.getBody().getScroll().top + (xl ? Ext.air.XWindow.getPosition()[1] : 0),
			hv = xl ? Ext.air.XWindow.getHeight() : Ext.lib.Dom.getViewHeight(),
			hb = hv-ha-this.getSize().height,
			space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;
		h = Math.min(h, space, this.maxHeight);

		this.innerList.setHeight(h);
		this.list.beginUpdate();
		this.list.setHeight(h+pad);
		this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
		this.list.endUpdate();
	},
	initEvents: Ext.form.ComboBox.prototype.initEvents.createSequence(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			this.on({
				'expand': this.onExpandX,
				'collapse': this.onCollapseX,
				scope: this
			});
		}
	}),
	onExpandX: function() {
		this.mon(Ext.air.XWindow.getWindow().Ext.getDoc(), {
			'mousewheel': this.collapseIfX,
			'mousedown': this.collapseIfX,
			scope: this
		});
	},
	onCollapseX: function() {
		var d = Ext.air.XWindow.getWindow().Ext.getDoc();
		this.mun(d, 'mousewheel', this.collapseIfX, this);
		this.mun(d, 'mousedown', this.collapseIfX, this);
	},
	collapseIfX: function(e) {
		var wl = e.within(this.list);
		if (!this.isDestroyed) {
			if (!wl) {
				this.collapse();
			} else {
				window.nativeWindow.activate();
				this.el.focus();
			}
		}
	},
	collapseIf: function(e) {
		if (!this.isDestroyed && !e.within(this.wrap)) {
			if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && e.type == 'mousewheel') {
				Ext.air.XWindow.setActive(true);
				this.list.focus();
			} else if (!e.within(this.list)) {
				this.collapse();
			}
		}
	}
});

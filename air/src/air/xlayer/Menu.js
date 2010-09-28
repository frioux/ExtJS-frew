Ext.override(Ext.menu.Menu, {
	constrainScroll: function(y) {
		var max, full = this.ul.setHeight('auto').getHeight(),
			returnY = y, normalY, parentEl, scrollTop, viewHeight;
		if(this.floating){
			if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
				viewHeight = Ext.air.XWindow.getHeight();
				scrollTop = 0;
			} else {
				parentEl = Ext.fly(this.el.dom.parentNode);
				scrollTop = parentEl.getScroll().top;
				viewHeight = parentEl.getViewSize().height;
			}
			//Normalize y by the scroll position for the parent element.  Need to move it into the coordinate space
			//of the view.
			normalY = y - scrollTop;
			max = this.maxHeight ? this.maxHeight : viewHeight - normalY;
			if(full > viewHeight) {
				max = viewHeight;
				//Set returnY equal to (0,0) in view space by reducing y by the value of normalY
				returnY = y - normalY;
			} else if(max < full) {
				returnY = y - (full - max);
				max = full;
			}
		}else{
			max = this.getHeight();
		}
		// Always respect maxHeight 
		if (this.maxHeight){
			max = Math.min(this.maxHeight, max);
		}
		if(full > max && max > 0){
			this.activeMax = max - this.scrollerHeight * 2 - this.el.getFrameWidth('tb') - Ext.num(this.el.shadowOffset, 0);
			this.ul.setHeight(this.activeMax);
			this.createScrollers();
			this.el.select('.x-menu-scroller').setDisplayed('');
		}else{
			this.ul.setHeight(full);
			this.el.select('.x-menu-scroller').setDisplayed('none');
		}
		this.ul.dom.scrollTop = 0;
		return returnY;
	}
});

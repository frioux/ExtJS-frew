Ext.override(Ext.Layer, {
	anim: function() { // no animation
		return this;
	},
	isVisible: function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			return Ext.air.XWindow.isVisible() && this.visible;
		}
		return this.visible;
	},
	showAction: Ext.Layer.prototype.showAction.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			var d = Ext.air.XWindow.getDocument();
			this.xParent = this.dom.parentNode;
			this.dom = d.adoptNode(this.dom, true);
			d.body.appendChild(this.dom);
			Ext.air.XWindow.show();
		}
	}),
	hideAction: Ext.Layer.prototype.hideAction.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && this.xParent) {
			this.dom = document.adoptNode(this.dom, true);
			this.xParent.appendChild(this.dom);
			Ext.air.XWindow.hide();
		}
	}),
	getX: function() {
		return this.getXY()[0];
	},
	getY: function() {
		return this.getXY()[1];
	},
	getXY: function() {
		var xy = Ext.Element.prototype.getXY.call(this);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			xy[0] -= window.nativeWindow.x;
			xy[1] -= window.nativeWindow.y;
		}
		return xy;
	},
	setXY : function(xy, a, d, c, e) {
		var nxy = [xy[0],xy[1]];
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			nxy[0] += window.nativeWindow.x;
			nxy[1] += window.nativeWindow.y;
		}
		this.fixDisplay();
		this.beforeAction();
		this.storeXY(nxy);
		var cb = this.createCB(c);
		Ext.Element.prototype.setXY.call(this, nxy, a, d, cb, e);
		if(!a){
			cb();
		}
		return this;
	},
	setLeftTop : function(left, top){
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			left += window.nativeWindow.x;
			top += window.nativeWindow.y;
		}
		this.storeLeftTop(left, top);
		Ext.Element.prototype.setLeftTop.apply(this, arguments);
		this.sync();
		return this;
	},
	getTop: function(local) {
		var t = Ext.Element.prototype.getTop.call(this, local);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && local) {
			t -= window.nativeWindow.y;
		}
		return t;
	},
	getLeft: function(local) {
		var l = Ext.Element.prototype.getLeft.call(this, local);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && local) {
			l -= window.nativeWindow.x;
		}
		return l;
	},
	getPositioning: function() {
		var p = Ext.Element.prototype.getPositioning.call(this);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			p[p.top ? 'top' : 'bottom'] -= window.nativeWindow.y;
			p[p.left ? 'left' : 'right'] -= window.nativeWindow.x;
		}
		return p;
	},
	constrainXY: function() {
		return this;
	},
	setBounds: function(x, y, w, h, a, d, c, e) {
		this.beforeAction();
		var cb = this.createCB(c);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			x += window.nativeWindow.x;
			y += window.nativeWindow.y;
		}
		if (!a) {
			this.storeXY([x, y]);
			Ext.Element.prototype.setXY.call(this, [x, y]);
			Ext.Element.prototype.setSize.call(this, w, h, a, d, cb, e);
			cb();
		} else {
			Ext.Element.prototype.setBounds.call(this, x, y, w, h, a, d, cb, e);
		}
		return this;
	},
	getBox: function(contentBox, local) {
		var b = Ext.Element.prototype.getBox.call(this, contentBox, local),
			x = window.nativeWindow.x,
			y = window.nativeWindow.y;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && local) {
			b.x -= x;
			b[0] -= x;
			b.y -= y;
			b[1] -= y;
			b.right -= x;
			b.bottom -= y;
		}
		return b;
	},
	getRegion: function() {
		var r = Ext.Element.prototype.getRegion.call(this),
			x = window.nativeWindow.x,
			y = window.nativeWindow.y;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			r.left -= x;
			r.right -= x;
			r[0] -= x;
			r.top -= y;
			r.bottom -= y;
			r[1] -= y;
		}
		return r;
	},
	setRegion: function(region, animate) {
		var r = region,
			x = window.nativeWindow.x,
			y = window.nativeWindow.y;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			r = Ext.copyTo({}, r, 'left,right,top,bottom');
			r.left += x;
			r.right += x;
			r.top += y;
			r.bottom += y;
		}
		return Ext.Element.prototype.setRegion.call(this, r, animate);
	},
	translatePoints: function(x, y) {
		y = isNaN(x[1]) ? y : x[1];
		x = isNaN(x[0]) ? x : x[0];
		var me = this,
			relative = me.isStyle('position', 'relative'),
			o = me.getXY(),
			e = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
			wx = e ? window.nativeWindow.x : 0,
			wy = e ? window.nativeWindow.y : 0,
			l = parseInt(me.getStyle('left'), 10),
			t = parseInt(me.getStyle('top'), 10);
		l = !isNaN(l) ? l - wx : (relative ? 0 : me.dom.offsetLeft - wx);
		t = !isNaN(t) ? t - wy : (relative ? 0 : me.dom.offsetTop - wy);
		
		return {left: (x - o[0] + l), top: (y - o[1] + t)};
	},
	getConstrainToXY : function(el, local, offsets, proposedXY){   
		var os = {top:0, left:0, bottom:0, right: 0};
		
		return function(el, local, offsets, proposedXY) {
			el = Ext.get(el);
			var vw, vh, vx = 0, vy = 0;
			offsets = offsets ? Ext.applyIf(offsets, os) : os;
			
			if (el.dom == document.body || el.dom == document) {
				if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
					vw = Ext.air.XWindow.getWidth();
					vh = Ext.air.XWindow.getHeight();
				} else {
					vw = Ext.lib.Dom.getViewWidth();
					vh = Ext.lib.Dom.getViewHeight();
				}
			} else {
				vw = el.dom.clientWidth;
				vh = el.dom.clientHeight;
				if (!local) {
					var vxy = el.getXY();
					vx = vxy[0];
					vy = vxy[1];
				}
			}

			var s = el.getScroll();

			vx += offsets.left + s.left;
			vy += offsets.top + s.top;

			vw -= offsets.right;
			vh -= offsets.bottom;

			var vr = vx + vw,
				vb = vy + vh,
				xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]),
				x = xy[0], y = xy[1],
				offset = this.getConstrainOffset(),
				w = this.dom.offsetWidth + offset, 
				h = this.dom.offsetHeight + offset;

			// only move it if it needs it
			var moved = false;

			// first validate right/bottom
			if((x + w) > vr){
				x = vr - w;
				moved = true;
			}
			if((y + h) > vb){
				y = vb - h;
				moved = true;
			}
			// then make sure top/left isn't negative
			if(x < vx){
				x = vx;
				moved = true;
			}
			if(y < vy){
				y = vy;
				moved = true;
			}
			return moved ? [x, y] : false;
		};
	}(),
	getAlignToXY: function(el, p, o) {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			p = (!p || p == "?" ? "tl-bl?" : (!(/-/).test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();
			var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/),
				c = !!m[3],
				xy, w, h, r, p1y, p1x, p2y, p2x, swapY, swapX,
				p1 = "",
				p2 = "",
				wx = window.nativeWindow.x,
				wy = window.nativeWindow.y,
				dw = Ext.air.XWindow.getWidth(),
				dh = Ext.air.XWindow.getHeight();
			if (c) {
				p = p.substr(0, p.length - 1);
				r = el.getRegion();
			}
			xy = Ext.Element.prototype.getAlignToXY.call(this, el, p, o);
			if (el.dom && el.dom.ownerDocument == Ext.air.XWindow.getDocument()) {
				xy[0] -= wx;
				xy[1] -= wy;
				r.left -= wx;
				r[0] -= wx;
				r.right -= wx;
				r.top -= wy;
				r[1] -= wy;
				r.bottom -= wy;
			}
			if (c) {
				p1 = m[1],
				p2 = m[2],
				w = this.getWidth();
				h = this.getHeight();
				//If we are at a viewport boundary and the aligned el is anchored on a target border that is
				//perpendicular to the vp border, allow the aligned el to slide on that border,
				//otherwise swap the aligned el to the opposite border of the target.
				p1y = p1.charAt(0);
				p1x = p1.charAt(p1.length-1);
				p2y = p2.charAt(0);
				p2x = p2.charAt(p2.length-1);
				swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
				swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));
				if (xy[0] + w + wx > dw) {
					xy[0] = swapX ? r.left - w : dw - w;
				}
				if (xy[0] + wx < 0) {
					xy[0] = swapX ? r.right : 0;
				}
				if (xy[1] + h + wy > dh) {
					xy[1] = swapY ? r.top - h : dh - h;
				}
				if (xy[1] + wy < 0) {
					xy[1] = swapY ? r.bottom : 0;
				}
			}
			return xy;
		}
		return Ext.Element.prototype.getAlignToXY.apply(this, arguments);
	},
	constrainXY : function(){
		if(true || this.constrain){
			var e = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
				vw = e ? Ext.air.XWindow.getWidth() : Ext.lib.Dom.getViewWidth(),
				vh = e ? Ext.air.XWindow.getHeight() : Ext.lib.Dom.getViewHeight(),
				s = e ? {left: 0,top: 0} : Ext.getDoc().getScroll(),
				wx = e ? window.nativeWindow.x : 0,
				wy = e ? window.nativeWindow.y : 0,

				xy = this.getXY(),
				x = xy[0], y = xy[1],
				so = this.shadowOffset,
				w = this.dom.offsetWidth+so, h = this.dom.offsetHeight+so,
			// only move it if it needs it
				moved = false;
			// first validate right/bottom
			if((x + w + wx) > vw+s.left){
				x = vw - w - so - wx;
				moved = true;
			}
			if((y + h + wy) > vh+s.top){
				y = vh - h - so - wy;
				moved = true;
			}
			// then make sure top/left isn't negative
			if(x + wx < s.left){
				x = s.left;
				moved = true;
			}
			if(y + wy < s.top){
				y = s.top;
				moved = true;
			}
			if(moved){
				if(this.avoidY){
					var ay = this.avoidY;
					if(y <= ay && (y+h) >= ay){
						y = ay-h-5;
					}
				}
				x += wx;
				y += wy;
				xy = [x, y];
				this.storeXY(xy);
				Ext.Element.prototype.setXY.call(this, xy);
				this.sync();
			}
		}
		return this;
	},
	// private
	// this code can execute repeatedly in milliseconds (i.e. during a drag) so
	// code size was sacrificed for effeciency (e.g. no getBox/setBox, no XY calls)
	sync : function(doShow){
		var shadow = this.shadow,
			e = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
			x = e ? window.nativeWindow.x : 0,
			y = e ? window.nativeWindow.y : 0;
		if(!this.updating && this.isVisible() && (shadow || this.useShim)){
			var shim = this.getShim(),
				w = this.getWidth(),
				h = this.getHeight(),
				l = this.getLeft(true) + x,
				t = this.getTop(true) + y;

			if(shadow && !this.shadowDisabled){
				if(doShow && !shadow.isVisible()){
					shadow.show(this);
				}else{
					shadow.realign(l, t, w, h);
				}
				if(shim){
					if(doShow){
					   shim.show();
					}
					// fit the shim behind the shadow, so it is shimmed too
					var shadowAdj = shadow.el.getXY(), shimStyle = shim.dom.style,
						shadowSize = shadow.el.getSize();
					shimStyle.left = (shadowAdj[0])+'px';
					shimStyle.top = (shadowAdj[1])+'px';
					shimStyle.width = (shadowSize.width)+'px';
					shimStyle.height = (shadowSize.height)+'px';
				}
			}else if(shim){
				if(doShow){
				   shim.show();
				}
				shim.setSize(w, h);
				shim.setLeftTop(l, t);
			}
		}
	}
});

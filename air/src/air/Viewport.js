/**
 * @class Ext.air.Viewport
 * @extends Ext.Panel
 * A Panel which provides the look and feel of an {@link Ext.Window} in none-systemChrome NativeWindows.
 * It should be used as the outermost container of all elements in a window.
 * The Viewport always fits into the NativeWindow, even if it becomes resized.
 * It provides the functionality of a window, such like resizing, maximizing, fullscreen etc. .
 * It doesn't matter if the NativeWindow is <code>systemChrome:'standard'</code> or <code>systemChrome:'none'</code>.
 * If it is <code>standard</code>, the header and borders of this panel are not shown and the body element fits to the NativeWindow
 */
Ext.air.Viewport = Ext.extend(Ext.Panel, {
	monitorResize: false,
	/**
	 * @cfg {String} baseCls
	 * The base CSS class to apply to this panel's element (defaults to <code>'x-window'</code>).
	 */
	baseCls: 'x-window',
	/**
	 * @cfg {Boolean} frame
	 * <code>false</code> to render with plain 1px square borders. Defaults to <code>true</code> to render with 9 elements, complete with custom rounded corners (also see {@link Ext.Element#boxWrap}).
	 */
	frame: true,
	/**
	 * @cfg {Boolean} collapsible
	 * True to make the panel collapsible and have the expand/collapse toggle button automatically rendered
	 * into the header tool button area, false to keep the panel statically sized with no button (defaults to <code>false</code>).
	 */
	collapsible: false,
	/**
	 * @cfg {Boolean} closable
	 * True to display the 'close' tool button and allow the user to close the window,
	 * false to hide the button and disallow closing the window (defaults to <code>true</code>).
	 * By default, when close is requested by clicking the close button in the header,
	 * the close method will be called. This will {@link Ext.Component#destroy destroy} the Window
	 * and its content meaning that it may not be reused.
	 * To make closing a Window hide the Window so that it may be reused, set {@link #closeAction} to <code>'hide'</code>.
	 * In standard chrome mode, the close button always is displayed and this option doesn't have any effect to the window look.
	 * But also in modes, the window doesn't close, if the user hits the close-button.
	 */
	closable: true,
	/**
	 * @cfg {Boolean} pinnable
	 * True to display the 'pin' tool button and allow the user to switch {@link #alwaysInFront}
	 * with this button (defaults to <code>false</code>).
	 * This option only applies to none-systemChrome windows.
	 */
	pinnable: false,
	/**
	 * @cfg {Boolean} draggable
	 * False to prevent the user from moving the window by dragging the header
	 * (defaults to <code>true</code>).
	 */
	draggable: true,
	/**
	 * @cfg {String} closeText
	 * The text to display at the close item of the header menu
	 * (defaults to <code>Close</code>).
	 */
	closeText: 'Close',
	/**
	 * @cfg {String} restoreText
	 * The text to display at the restore item of the header menu
	 * (defaults to <code>Restore</code>).
	 */
	restoreText: 'Restore',
	/**
	 * @cfg {String} minimizeText
	 * The text to display at the minimize item of the header menu
	 * (defaults to <code>Minimize</code>).
	 */
	minimizeText: 'Minimize',
	/**
	 * @cfg {String} maximizeText
	 * The text to display at the maximize item of the header menu
	 * (defaults to <code>Maximize</code>).
	 */
	maximizeText: 'Maximize',
	/**
	 * @cfg {String} closeAction
	 * <p>The action to take when the close header button is clicked:
	 * <div class="mdetail-params"><ul>
	 * <li><b><code>'{@link #close}'</code></b> : <b>Default</b><div class="sub-desc">
	 * {@link #close} the window, so that it will <b>not</b> be available to be
	 * redisplayed via the {@link #show} method.
	 * </div></li>
	 * <li><b><code>'{@link #hide}'</code></b> : <div class="sub-desc">
	 * {@link #hide} the window by setting air.NativeWindow.visible to false.
	 * The window will be available to be redisplayed via the {@link #show} method.
	 * </div></li>
	 * </ul></div>
	 */
	closeAction: 'close',
	//private
	initComponent: function() {
		// make it a viewport -> fill whole window
		document.getElementsByTagName('html')[0].className += ' x-viewport';
		var body = Ext.getBody();
		body.setHeight = Ext.emptyFn;
		body.setWidth = Ext.emptyFn;
		body.setSize = Ext.emptyFn;
		body.dom.scroll = 'no';
		Ext.EventManager.onWindowResize(this.setSize, this);

		this.win = window.nativeWindow;
		
		this.win.title = this.title = this.title || this.win.title;
		
		if (this.win.systemChrome != air.NativeWindowSystemChrome.NONE) {
			this.frame = false;
			this.header = false;
		} else this.header = true;
		
		this.renderTo = body;
		
		Ext.air.Viewport.superclass.initComponent.call(this);
	},
	// private
	onRender: function(ct, position) {
		Ext.air.Viewport.superclass.onRender.call(this, ct, position);
		this.setSize(Ext.getBody().getSize());
		this.setPosition(0, 0);
		if(this.plain){
			this.el.addClass(this.baseCls+'-plain');
		}
		this.initTools();
		this.setIcon(this.icon);
		this.setHeaderMenu();
		delete this.icon;
		this.addClass('x-nativewindow-' + this.win.type.toLowerCase());
		if(this.win.resizable && this.win.systemChrome == air.NativeWindowSystemChrome.NONE){
			this.resizer = new Ext.Resizable(this.el, {
				minWidth: this.minWidth,
				minHeight:this.minHeight,
				handles: this.resizeHandles || "all",
				pinned: true,
				startSizing: this.startSizing.createDelegate(this),
				handleCls: 'x-window-handle'
			});
		}
		if(this.draggable && this.header){
			this.header.addClass('x-window-draggable');
		}
	},
	/**
	 * Sets the window icon on the top left corner of the header to a given one.
	 * This only applies to none-systemChrome windows.
	 * @param {String} icon The url to the icon file
	 */	 	
	setIcon: function(icon) {
		if(this.rendered && this.header && icon){
			if(this.frame){
				this.header.removeClass(this.iconCls);
				this.header.addClass('x-panel-icon');
				this.header.setStyle('backgroundImage', 'url('+icon+')');
			} else{
				var hd = this.header.dom;
				var img = hd.firstChild && String(hd.firstChild.tagName).toLowerCase() == 'img' ? hd.firstChild : null;
				if (img){
					Ext.fly(img).removeClass(this.iconCls).setStyle('backgroundImage', 'url('+icon+')');
				} else {
					Ext.DomHelper.insertBefore(hd.firstChild, {
						tag:'img', src: Ext.BLANK_IMAGE_URL, cls: 'x-panel-inline-icon', style: 'background-image: url('+icon+');'
					});
				}
			}
		}
	},
	// private
	setHeaderMenu: function() {
		if (this.header && !this.headerMenu) {
			this.headerMenu = new Ext.menu.Menu({
				cls: 'x-nativewindow-headermenu',
				items: [{
					itemId: 'restore',
					text: this.restoreText,
					iconCls: 'restore',
					handler: function() {
						this.win.restore();
					},
					scope: this
				},{
					itemId: 'minimize',
					text: this.minimizeText,
					iconCls: 'minimize',
					handler: function() {
						this.win.minimize();
					},
					scope: this
				},{
					itemId: 'maximize',
					text: this.maximizeText,
					iconCls: 'maximize',
					handler: function() {
						this.win.maximize();
					},
					scope: this
				},'-',{
					itemId: 'close',
					text: this.closeText,
					iconCls: 'close',
					handler: this.doClose,
					scope: this
				}]
			});
			this.mon(this.header, 'mousedown', function(e, t) {
				var l = (this.dd) ? this.dd.isLocked() : false;
				if (e.getPageX() < this.header.getHeight()) { // ein Quadrat am linken Rand als Click-Zone zulassen
					this.headerMenu.show(this.header);
					if (this.dd) this.dd.lock();
				} else if (this.dd && l) this.dd.unlock();
			}, this);
			this.updateHeaderMenu();
		}
	},
	// private
	updateHeaderMenu: function() {
		var hm = this.headerMenu;
		if (!hm) return;
		var nwds = air.NativeWindowDisplayState;
		var wds = this.win.displayState;
		var sds = this.win.stage.displayState;
		var sdsn = air.StageDisplayState.NORMAL;
		hm.getComponent('minimize').setDisabled(!this.win.minimizable);
		hm.getComponent('restore').setDisabled(!(sds != sdsn || (this.win.maximizable && wds == nwds.MAXIMIZED)));
		hm.getComponent('maximize').setDisabled(!(this.win.maximizable && wds == nwds.NORMAL && sds == sdsn));
	},
	// private
	initEvents : function(){
		Ext.air.Viewport.superclass.initEvents.call(this);
		this.win.addEventListener(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGE, this.onDisplayStateChange.createDelegate(this));
		this.win.addEventListener(air.Event.ACTIVATE, this.onActivate.createDelegate(this));
		this.win.addEventListener(air.Event.DEACTIVATE, this.onDeactivate.createDelegate(this));
		this.win.stage.addEventListener(air.Event.FULLSCREEN, this.onFullscreen.createDelegate(this));
		
		if (this.header) this.mon(this.header, 'dblclick', function(e) {
			if (e.getPageX() < this.header.getHeight()) {
				if (this.closable) this.win.close();
			} else if (this.win.maximizable) this.toggleMaximize();
		}, this);
	},
	// private
	initDraggable : function() {
		if (this.header) this.dd = new Ext.air.ViewportDD(this);
	},
	// private
	onDestroy : function(){
		if (this.resizer) this.resizer.destroy(true);
		if (this.headerMenu) this.headerMenu.destroy();
		Ext.air.Viewport.superclass.onDestroy.call(this);
	},
	// private
	initTools : function(){
		if (this.win.type == air.NativeWindowType.NORMAL && this.header) {
			if (this.pinnable) {
				this.addTool({
					id: 'unpin',
					hidden: !!this.win.alwaysInFront,
					handler: this.toggleAlwaysInFront.createDelegate(this, [true])
				});
				this.addTool({
					id: 'pin',
					hidden: !this.win.alwaysInFront,
					handler: this.toggleAlwaysInFront.createDelegate(this, [false])
				});
			}
			if(this.win.minimizable){
				this.addTool({
					id: 'minimize',
					handler: function() {
						// dispatch Event for none systemChrome windows, since it is not done automatically
						if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
							var e = new air.NativeWindowDisplayStateEvent(
								air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
								false,
								true,
								this.win.displayState,
								air.NativeWindowDisplayState.MINIMIZED
							);
							if (this.win.dispatchEvent(e) === false) return;
						}
						this.win.minimize();
					},
					scope: this
				});
			}
			if(this.win.maximizable){
				this.addTool({
					id: 'maximize',
					handler: function() {
						// dispatch Event for none systemChrome windows, since it is not done automatically
						if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
							var e = new air.NativeWindowDisplayStateEvent(
								air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
								false,
								true,
								this.win.displayState,
								air.NativeWindowDisplayState.MAXIMIZED
							);
							if (this.win.dispatchEvent(e) === false) return;
						}
						this.win.maximize();
					},
					scope: this
				});
				this.addTool({
					id: 'restore',
					handler: function() {
						// dispatch Event for none systemChrome windows, since it is not done automatically
						if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
							var e = new air.NativeWindowDisplayStateEvent(
								air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
								false,
								true,
								this.win.displayState,
								air.NativeWindowDisplayState.NORMAL
							);
							if (this.win.dispatchEvent(e) === false) return;
						}
						this.win.restore();
					},
					scope: this,
					hidden: true
				});
			}
		}
		if(this.closable && this.header){
			this.addTool({
				id: 'close',
				handler: this.doClose,
				scope: this
			});
		}
	},
	// private
	startSizing : function(e, h) {
		var pos = {north:'TOP',east:'RIGHT',south:'BOTTOM',west:'LEFT',northeast:'TOP_RIGHT',southeast:'BOTTOM_RIGHT',southwest:'BOTTOM_LEFT',nothwest:'TOP_LEFT'};
		var rh = pos[h.position];
		if (rh) this.win.startResize(air.NativeWindowResize[rh]);
	},
	// private
	toggleMaximize: function() {
		this.win[this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED ? 'restore' : 'maximize']();
	},
	/**
	 * A shortcut method for toggling between alwaysInFront:true and alwaysInFront:false based on the current state of the window.
	 * @private
	 */
	toggleAlwaysInFront: function(aif) {
		if (!Ext.isDefined(aif)) aif = !this.win.alwaysInFront;
		this.win.alwaysInFront = !!aif;
		this.getTool('unpin').setVisible(!aif);
		this.getTool('pin').setVisible(!!aif);
	},
	// private
	onDisplayStateChange: function(e) {
		var nwds = air.NativeWindowDisplayState;
		switch (e.afterDisplayState) {
			case nwds.MINIMIZED:
				this.onMinimize();
				break;
			case nwds.MAXIMIZED:
				this.onMaximize();
				break;
			default:
				this.onRestore();
				break;
		}
		this.updateHeaderMenu();
		return true;
	},
	// private
	onMaximize : function() {
		this.expand(false);
		if (this.win.maximizable && this.header){
			this.tools.maximize.hide();
			this.tools.restore.show();
		}
		if(this.dd){
			this.dd.lock();
		}
		if(this.collapsible && this.header){
			this.tools.toggle.hide();
		}
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) this.on('resize', this.fitWindow, this, {single: true});
		this.el.addClass('x-nativewindow-maximized');
	},
	// private
	fitWindow: function() {
		var b = air.Screen.mainScreen.visibleBounds;
		var x = this.getWidth() - b.width;
		var y = this.getHeight() - b.height;
		this.setPosition(x / 2, y / 2);
		this.setSize(b.width, b.height);
	},
	// private
	onRestore : function(){
		this.el.removeClass('x-nativewindow-maximized');
		if (this.header) {
			if (this.win.maximizable) {
				this.tools.restore.hide();
				this.tools.maximize.show();
			}
			if(this.collapsible){
				this.tools.toggle.show();
			}
		}
		if(this.dd){
			this.dd.unlock();
		}
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) this.setPosition(0, 0);
	},
	// private
	onMinimize: Ext.emptyFn,
	// private
	onActivate: function() {
		if (this.el && this.el.dom) this.removeClass('x-nativewindow-inactive');
	},
	// private
	onDeactivate: function() {
		if (this.el && this.el.dom) this.addClass('x-nativewindow-inactive');
	},
	// private
	onFullscreen: function(e) {
		if (e.fullScreen) {
			this.expand(false);
			if (this.header) {
				if (this.collapsible) {
					this.tools.toggle.hide();
				}
				if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
					this.on('resize', function(c, aw, ah, rw, rh) {
						var mc = this.body.parent('.' + this.baseCls  + '-mc'),
							w = this.body.getWidth(true),
							h = mc.getHeight(true);
						this.suspendEvents();
						this.setPosition(-this.body.getX(), -mc.getY());
						this.setSize(2 * this.getWidth() - w, 2 * this.getHeight() - h);
						this.resumeEvents();
					}, this, {single: true});
				}
			}
			if (this.dd) this.dd.lock();
			this.el.addClass('x-nativewindow-maximized');
		} else {
			if (this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED) {
				this.onMaximize();
			} else this.onRestore();
		}
		this.updateHeaderMenu();
	},
	doClose: function() {
		var ce = new air.Event(air.Event.CLOSING, false, true);
		if (this.win.dispatchEvent(ce) !== false) this.win.close();
	},
	/**
	 * Returns the air.NativeWindow for this window
	 */
	getNative: function() {
		return this.win;
	},
	/**
	 * Collapses the window body so that it becomes hidden.
	 * Fires the {@link #beforecollapse} event which will cancel the collapse action if it returns false.
	 * @return {Ext.air.Viewport} this
	 */
	collapse : function(){
		if(this.collapsed || this.fireEvent('beforecollapse', this) === false){
			return;
		}
 		this.winHeight = this.getHeight();
		this.onCollapse(false);
		return this;
	},
	// private
	afterCollapse : function(){
		this.collapsed = true;
		this.el.addClass(this.collapsedCls);
		var h = this.getHeight();
		this.winMinSize = this.win.minSize;

		this.win.minSize = new air.Point(this.winMinSize.x, h);
		this.win.height = this.getHeight();
		this.fireEvent('collapse', this);
	},
	/**
	 * Expands the panel window so that it becomes visible.
	 * Fires the {@link #beforeexpand} event which will cancel the expand action if it returns false.
	 * @return {Ext.air.Viewport} this
	 */
	expand : function(){
		if(!this.collapsed || this.fireEvent('beforeexpand', this) === false){
			return;
		}
		this.win.minSize = this.winMinSize;
		this.win.height = this.winHeight;
		this.el.removeClass(this.collapsedCls);
		this.onExpand(false);
		return this;
	},
	// private
	afterExpand: function(){
		this.collapsed = false;
		if(this.deferLayout !== undefined){
			this.doLayout(true);
		}
		this.fireEvent('expand', this);
	}
});
// private
Ext.air.ViewportDD = Ext.extend(Ext.Window.DD, {
	startDrag : function(){
		this.win.win.startMove();
	},
	onDrag : Ext.emptyFn,
	endDrag : function(e){
		this.win.saveState();
	}
});
Ext.reg('airviewport', Ext.air.Viewport);

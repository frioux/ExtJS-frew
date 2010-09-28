Ext.ns('Xp','Xp.ui');
/**
 * @class Xp.ui.Main
 * @extends Ext.air.Window
 * Main window class that holds the player
 */
Xp.ui.Main = Ext.extend(Ext.air.Window, {
	layout: 'anchor',
	title: 'ExtPlayer',
	ctCls: 'xplayer-main',
	alwaysInFront: true,
	pinnable: true,
	id: 'main',
	// private
	paused: false,
	activeUrl: null,
	/**
	 * @cfg {Ext.Template} titleTpl
	 * The Template for formatting of the window title.
	 * Every Sound.id3 info properties can be used as variables.
	 */
	titleTpl: Xp.ui.Templates.mainTitle,
	// init widgets
	onInit: function(win, X) {
		this.currInfo = new win.Xp.ui.CurrentInfo({
			anchor: '0'
		});
		this.slider = new X.slider.SingleSlider({
			value: this.pausePosition,
			anchor: '0',
			increment: 1,
			minValue: 0,
			maxValue: 100
		});
		this.mp = new X.air.MusicPlayer();
		// PlayList Window
		this.playListWin = new Ext.air.Window({
			id: 'playlistwin',
			chrome: 'none',
			transparent: true,
			closeAction: 'hide', // only hide it
			fileQuery: { // use all ExtJS and AIR files plus includes within the window's dom context
				type: 'queryExt',
				include: [
					'/js/Xp.ui.Playlist.js',
					'/resources/css/xplayer.css'
				]
			},
			items: [{
				xtype: 'xp:ui:playlist' // include the playlist grid
			}],
			layout: 'fit',
			border: false,
			title: 'Playlist Manager',
			width: 600,
			height: 300
		});
		this.items = [
			this.currInfo,
			this.slider
		];
		// command buttons
		this.bbar = [{
			tooltip: 'Previous',
			icon: '/resources/images/control_start_blue.png',
			cls: 'x-btn-icon',
			handler: this.prev,
			scope: this			
		},{
			tooltip: 'Pause',
			icon: '/resources/images/control_pause_blue.png',
			cls: 'x-btn-icon',
			handler: this.pause,
			scope: this
		},{
			tooltip: 'Stop',
			icon: '/resources/images/control_stop_blue.png',
			cls: 'x-btn-icon',
			handler: this.stop,
			scope: this
		},{
			tooltip: 'Play',
			icon: '/resources/images/control_play_blue.png',
			cls: 'x-btn-icon',
			handler: this.onPlayBtnPress,
			scope: this
		},{
			tooltip: 'Next',
			icon: '/resources/images/control_end_blue.png',
			cls: 'x-btn-icon',
			handler: this.next,
			scope: this
		},{
			tooltip: 'Adjust Volume',
			icon: '/resources/images/sound_low.png',
			cls: 'x-btn-icon',
			menu: new Ext.menu.Menu({
				items: new Ext.Slider({
					vertical: true,
					height: 80,
					value: 100,
					minValue: 0,
					maxValue: 100,
					listeners: {
						change: this.adjustVolume,
						scope: this
					} 
				})
			})
		},'->',{
			tooltip: 'Playlist Manager',
			icon: '/resources/images/bullet_arrow_bottom.png',
			handler: this.openPlayList,
			scope: this,
			cls: 'x-btn-icon'
		}];
		// add some listeners
		this.slider.on({
			'changecomplete': this.onSliderChange,
			'beforechange': this.beforeSliderChange,
			'dragstart': this.onSliderDragStart,
			'dragend': this.onSliderDragEnd,
			scope: this
		});
		this.mp.on({
			'id3info': this.setId3Info,
			'progress': this.updateUI,
			'complete': this.next,
			scope: this
		});
		// hide the playlist window when minimizing
		// since this window is minimized to tray
		this.on('minimize', function() {
			this.playListWin.hide();
		}, this);
		
		Xp.ui.Main.superclass.onInit.call(this, win, X);
	},
	onActivate: function() {
		var root = Ext.air.App.getRootHtmlWindow() || window;
		root.Ext.air.NativeWindowManager.each(function(win) {
			win.toFront();
		});
		Xp.ui.Main.superclass.onActivate.call(this);	
	},
	onClosing: function(closeEvent) {
		this.stop();
		Xp.ui.Main.superclass.onClosing.call(this, closeEvent);
	},
	// private
	getCurrRecordInfo: function() {
		if (this.playListWin) {
			var win = this.playListWin.getWindow(),
				ds = win.Ext.StoreMgr.lookup('playlistDs'),
				max = ds.getCount();
			return {
				idx: ds.indexOfId(this.activeUrl),
				max: max,
				ds: ds
			};
		}
		return {};		
	},
	prev: function() {
		var rInfo = this.getCurrRecordInfo(),
			prevIdx = rInfo.idx === 0 ? rInfo.max - 1 : rInfo.idx - 1,
			r = rInfo.ds.getAt(prevIdx);
		this.play(r.get('url'));		
	},
	next: function() {
		var rInfo = this.getCurrRecordInfo(),
			nextIdx = rInfo.idx >= (rInfo.max - 1) ? 0 : rInfo.idx + 1,
			r = rInfo.ds.getAt(nextIdx);
		this.play(r.get('url'));
	},
	pause: function() {
		this.mp.pause();
		this.paused = true;
	},
	stop: function() {
		this.mp.stop();
		this.moveSliderUI(0);
	},
	onPlayBtnPress: function(btn) {
		this.play();
	},
	play: function(url){
		if (!url) {
			if (this.paused) {
				this.paused = false;
				this.mp.play();
			} else {
				var s = this.playListWin.getWindow().Ext.StoreMgr.lookup('playlistDs'),
					r = s ? s.getAt(0) : null;
				if (r) {
					this.play(r.get('url'));
				}
			}
		} else {
			this.moveSliderUI(0);
			this.mp.play(url);
			this.activeUrl = url;
		}
	},
	showNotify: function(id3info) {
		var msg = 'Title: {0}<br/>Artist: {1}';
		if (id3info && id3info.songName && id3info.artist) {
			var sample = new Ext.air.Notify({
				msg: String.format(msg, id3info.songName, id3info.artist),
				icon: '/resources/images/music.png'
			});						
		}
	},
	adjustVolume: function(slider, value) {
		this.mp.adjustVolume(value / 100);
	},
	openPlayList: function() {		
		this.playListWin.show();
	},
	setId3Info: function(id3Info) {
		this.currInfo.setId3Info(id3Info);
		this.setTitle(this.titleTpl.apply(id3Info));
		this.showNotify(id3Info);
	},
	updateUI: function(activeChannel, activeSound) {
		var playbackPercent = 100 * (activeChannel.position / activeSound.length);
		this.moveSliderUI(playbackPercent);
		this.currInfo.update({
			position: activeChannel.position,
			length: activeSound.length
		});
	},
	moveSliderUI: function(value) {
		if (this.sliderDragging !== true) {
			this.slider.setValue(value, true);
		}
	},
	
	beforeSliderChange: function() {
		return this.mp.hasActiveChannel();
	},
	onSliderDragStart: function() {
		this.sliderDragging = true;
	},
	onSliderDragEnd: function() {
		this.sliderDragging = false;
	},
	
	// skip forward
	onSliderChange: function(slider, newValue){
		var pos = (newValue / 100) * this.mp.activeSound.length;
		this.mp.skipTo(pos);
	}
});
Ext.reg('xp:ui:main', Xp.ui.Main);

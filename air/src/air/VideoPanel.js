/**
 * @class Ext.air.VideoPanel
 * @extends Ext.Panel
 * A Panel, which loads a video from a specified url
 * @constructor
 * Creates a new VideoPanel.
 * @param {Object} config A config object containing config properties.
 */
Ext.air.VideoPanel = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Boolean} autoResize
	 * <code>true</code> to auto resize the video if the panel is resized
	 * (defaults to <code>true</code>).
	 */
	autoResize: true,
	/**
	 * @cfg {String} url
	 * The url to load the video from
	 */

	// private
	initComponent: function() {
		var connection = new air.NetConnection();
		connection.connect(null);
	
		this.stream = new air.NetStream(connection);
		this.stream.client = {
			onMetaData: Ext.emptyFn
		};
		Ext.air.VideoPanel.superclass.initComponent.call(this);
		this.on('bodyresize', this.onVideoResize, this);
	},
	// private
	afterRender: function() {
		Ext.air.VideoPanel.superclass.afterRender.call(this);
		(function() {
				var box = this.body.getBox();
				this.video = new air.Video(this.getInnerWidth(), this.getInnerHeight());
				if (this.url) {
					this.video.attachNetStream(this.stream);
					this.stream.play(this.url);
				}
				nativeWindow.stage.addChild(this.video);
				this.video.x = box.x;
				this.video.y = box.y;
		}).defer(500, this);
	},
	
	// private
	onVideoResize: function(pnl, w, h) {
		if (this.video && this.autoResize) {
				var iw = this.getInnerWidth();
				var ih = this.getInnerHeight();
				this.video.width = iw
				this.video.height = ih;
				var xy = this.body.getXY();
				if (xy[0] !== this.video.x) {
						this.video.x = xy[0];
				}
				if (xy[1] !== this.video.y) {
						this.video.y = xy[1];
				}
		}
	},
	/**
	 * Loads a video from a given url
	 * @param {String} url The url to load the video from
	 */
	loadVideo: function(url) {
		this.stream.close();
		this.video.attachNetStream(this.stream);
		this.stream.play(url);		
	}
});
Ext.reg('videopanel', Ext.air.VideoPanel);

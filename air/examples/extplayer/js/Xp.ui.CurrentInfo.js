Ext.ns('Xp','Xp.ui');

Xp.ui.CurrentInfo = Ext.extend(Ext.Panel, {
	tpl: Xp.ui.Templates.currentInfo,
	ctCls: 'xplayer-current',
	currInfo: {
		position: 0,
		length: 0
	},
	// this is applied into currInfo
	id3Info: {artist:'----------', songName: '----------'},
	afterRender: function() {
		Xp.ui.CurrentInfo.superclass.afterRender.apply(this, arguments);
		this.update(this.currInfo);
	},
	update: function(info) {
		Ext.applyIf(info, this.id3Info);
		this.tpl.overwrite(this.body, info);
	},
	setId3Info: function(id3Info) {
		Ext.copyTo(this.id3Info, id3Info, 'album,artist,comment,genre,songName,track,year');
	}
});
Ext.reg('xp:ui:currentinfo', Xp.ui.CurrentInfo);

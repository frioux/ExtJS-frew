// workaround for DD dataTransfer Clipboard not having hasFormat
Ext.apply(Ext.EventObjectImpl.prototype, {
	hasFormat : function(format){
		if (this.browserEvent.dataTransfer) {
			for (var i = 0, len = this.browserEvent.dataTransfer.types.length; i < len; i++) {
				if(this.browserEvent.dataTransfer.types[i] == format) {
					return true;
				}
			}
		}
		return false;
	},
	
	getData : function(type){
		return this.browserEvent.dataTransfer.getData(type);
	}
});

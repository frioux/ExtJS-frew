/**
 * @class Ext
 * @singleton 
 */
/**
 * True if the detected platform is Adobe Air version < 1.5
 * @property isAir1
 * @type Boolean
 */
/** 
 * True if the detected platform is Adobe Air version 1.5
 * @property isAir15
 * @type Boolean
 */
/**
 * True if the detected platform is Adobe Air version 2
 * @property isAir2
 * @type Boolean
 */
if (Ext) {
	var ua = window.navigator.userAgent.toLowerCase();
	Ext.isAir2 = Ext.isAir && /adobeair\/2/.test(ua);
	Ext.isAir15 = Ext.isAir && /adobeair\/1\.5/.test(ua);
	Ext.isAir1 = Ext.isAir && !Ext.isAir15 && !Ext.isAir2;
	
	Ext.isArray = function(v) {
		return v && typeof v.length == 'number' && typeof v.splice == 'function';
	};
	
	Ext.onReady(function() {
		Ext.getBody().addClass('ext-air').addClass('ext-air' + (Ext.isAir2 ? '2' : (Ext.isAir15 ? '15' : '1')));
	});
}
if (air) {
	Ext.applyIf(air, {
		StageDisplayState: window.runtime.flash.display.StageDisplayState,
		EncryptionKeyGenerator: null
	});
	try {
		Ext.apply(air, {
			NativeProcessStartEvent: window.runtime.flash.events.NativeProcessStartEvent,
			EncryptionKeyGenerator: window.runtime.com.adobe.data.encryption.EncryptionKeyGenerator
		});
	} catch(e) {
	}
}
Ext.ns('Ext.air');

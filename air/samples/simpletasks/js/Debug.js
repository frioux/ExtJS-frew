Ext.ns('Ext.air')
Ext.air.Debug = {
	traceEvents: function(observable) {
		Ext.util.Observable.capture(observable, function(en) {
			air.trace('Id: ' + observable.id + ' Event: ' + en);
		});
	},
	dir: function(obj) {
		for (var a in obj) {
			air.trace(a + ': ' + obj[a]);
		}			
	}	
};

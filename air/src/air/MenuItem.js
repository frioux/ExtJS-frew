/**
 * @class Ext.air.MenuItem
 * Ability to bind native menu items to an Ext.Action
 * @constructor
 * Creates a new NativeMenuItem based on a given Ext.Action
 * 
 * @method
 * @param {Object} action An Ext.Action instance
 * or an Ext.action config object, if a new Ext.Action should be created
 */
Ext.air.MenuItem = function(action){
	if(!action.isAction){
		action = new Ext.Action(action);
	}
	var cfg = action.initialConfig;
	var nativeItem = new air.NativeMenuItem(cfg.itemText || cfg.text);
	
	nativeItem.enabled = !cfg.disabled;

	if(!Ext.isEmpty(cfg.checked)){
		nativeItem.checked = cfg.checked;
	}

	var handler = cfg.handler;
	var scope = cfg.scope;
	
	nativeItem.addEventListener(air.Event.SELECT, function(){
		handler.call(scope || window, cfg);
	});
	
	action.addComponent({
		setDisabled : function(v){
			nativeItem.enabled = !v;
		},
		
		setText : function(v){
			nativeItem.label = v;
		},
		
		setVisible : function(v){
			// could not find way to hide in air so disable?
			nativeItem.enabled = !v;
		},
		
		setHandler : function(newHandler, newScope){
			handler = newHandler;
			scope = newScope;
		},
		// empty function
		on : function(){}
	});
	
	return nativeItem;
};

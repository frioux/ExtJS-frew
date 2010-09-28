WinForm = Ext.extend(Ext.form.FormPanel, {
	unstyled: true,
	defaults: {
		anchor: '0'
	},
	labelWidth: 150,
	bodyStyle: 'padding: 10px',
	initComponent: function() {
		this.items = [{
			xtype: 'combo',
			name: 'type',
			store: [air.NativeWindowType.NORMAL, air.NativeWindowType.UTILITY, air.NativeWindowType.LIGHTWEIGHT],
			triggerAction: 'all',
			mode: 'local',
			forceSelection: true,
			editable: false
		},{
			xtype: 'combo',
			name: 'systemChrome',
			store: [air.NativeWindowSystemChrome.STANDARD, air.NativeWindowSystemChrome.NONE],
			triggerAction: 'all',
			mode: 'local',
			forceSelection: true,
			editable: false
		},{
			xtype: 'checkbox',
			name: 'transparent'
		},{
			xtype: 'textfield',
			name: 'title'
		},{
			xtype: 'numberfield',
			name: 'width'
		},{
			xtype: 'numberfield',
			name: 'height'
		},{
			xtype: 'numberfield',
			name: 'x'
		},{
			xtype: 'numberfield',
			name: 'y'
		},{
			xtype: 'textfield',
			name: 'id'
		},{
			xtype: 'checkbox',
			name: 'maximizable'
		},{
			xtype: 'checkbox',
			name: 'maximized'
		},{
			xtype: 'checkbox',
			name: 'minimizable'
		},{
			xtype: 'checkbox',
			name: 'minimizeToTray'
		},{
			xtype: 'checkbox',
			name: 'resizable'
		},{
			xtype: 'numberfield',
			name: 'minWidth'
		},{
			xtype: 'numberfield',
			name: 'minHeight'
		},{
			xtype: 'numberfield',
			name: 'maxWidth'
		},{
			xtype: 'numberfield',
			name: 'maxHeight'
		},{
			xtype: 'checkbox',
			name: 'draggable'
		},{
			xtype: 'checkbox',
			name: 'closable'
		},{
			xtype: 'combo',
			name: 'closeAction',
			store: ['close', 'hide'],
			triggerAction: 'all',
			mode: 'local',
			forceSelection: true,
			editable: false
		},{
			xtype: 'checkbox',
			name: 'alwaysInFront'
		},{
			xtype: 'checkbox',
			name: 'pinnable'
		},{
			xtype: 'checkbox',
			name: 'modal'
		},{
			xtype: 'combo',
			name: 'notify',
			store: [
				[undefined, 'undefined'],
				[true, 'true'],
				[false, 'false'],
				[air.NotificationType.CRITICAL, air.NotificationType.CRITICAL],
				[air.NotificationType.INFORMATIONAL, air.NotificationType.INFORMATIONAL]
			],
			triggerAction: 'all',
			mode: 'local',
			forceSelection: true,
			editable: false
		},{
			xtype: 'checkbox',
			name: 'stateful'
		},{
			xtype: 'textfield',
			name: 'stateId'
		}];
		WinForm.superclass.initComponent.call(this);
	},
	lookupComponent: function(comp) {
		if (!Ext.isString(comp) && !comp.events) {
			comp.fieldLabel = comp.name;
			comp[comp.xtype == 'checkbox' ? 'checked' : 'value'] = Ext.air.Window.prototype[comp.name];
		}
		return WinForm.superclass.lookupComponent.call(this, comp);
	}
});

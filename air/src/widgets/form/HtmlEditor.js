// Build a font combo in HtmlEditor, because the default select list has messy scrollbars in Air 2.0
(function() {
	var tpl = new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item" style="font-family: {text}">{text}</div></tpl>');
	Ext.override(Ext.form.HtmlEditor, {
		createToolbar: Ext.form.HtmlEditor.prototype.createToolbar.createSequence(function() {
			if (this.enableFont && !Ext.isSafari2) {
				this.tb.get(0).hide();
				var fontCombo = this.tb.insert(0, this.createFontCombo());
				fontCombo.on('select', function(c, r, i) {
					this.relayCmd('fontname', this.fontFamilies[i]);
					this.deferFocus();
				}, this);
				this.tb.doLayout();
			}
		}),
		createFontCombo: function() {
			var lc = [];
			Ext.each(this.fontFamilies, function(f) {
				lc.push(f.toLowerCase());
			});
			return new Ext.form.ComboBox({
				store: new Ext.data.ArrayStore({
					autoDestroy: true,
					idIndex: 0,
					data: Ext.zip(lc, this.fontFamilies),
					fields: ['value', 'text']
				}),
				triggerAction: 'all',
				mode: 'local',
				editable: false,
				forceSelection: true,
				autoWidth: true,
				value: this.defaultFont,
				tpl: tpl,
				valueField: 'value',
				displayField: 'text'
			});
		}
	});
})();

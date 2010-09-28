Ext.ns('Ext.air', 'Ext.form.htmleditor');
if (Ext.air.Viewport) {
	Ext.apply(Ext.air.Viewport.prototype, {
		closeText: 'Schließen',
		restoreText: 'Wiederherstellen',
		minimizeText: 'Minimieren',
		maximizeText: 'Maximieren',
	});
}
if (Ext.air.MessageBox) {
	Ext.apply(Ext.air.MessageBox.buttonCfg, {
		ok: {
			text: 'OK'
		},
		cancel: {
			text: 'Abbrechen'
		},
		yes: {
			text: 'Ja'
		},
		no: {
			text: 'Nein'
		}
	});
}
if (typeof Date.precompileFormats == "function") {
	Date.precompileFormats("d.m.Y");
}
if (Ext.form.htmleditor.AlignmentPlugin) {
	Ext.apply(Ext.form.htmleditor.AlignmentPlugin.prototype.tips, {
		justifyLeft: {
			title: 'Linksbündig',
			text: 'Setzt den Text linksbündig.'
		},
		justifyCenter: {
			title: 'Zentrieren',
			text: 'Zentriert den Text im Editor.'
		},
		justifyRight: {
			title: 'Rechtsbündig',
			text: 'Setzt den Text rechtsbündig.'
		},
		justifyFull: {
			title: 'Blocksatz',
			text: 'Richtet den Text im Blocksatz aus.'
		}
	});
}
if (Ext.form.htmleditor.ClipboardPlugin) {
	Ext.apply(Ext.form.htmleditor.ClipboardPlugin.prototype.tips, {
		cut: {
			title: 'Ausschneiden',
			text: 'Markierten Text ausschneiden und in die Zwischenablage kopieren.'
		},
		copy: {
			title: 'Kopieren',
			text: 'Markierten Text in die Zwischenablage kopieren.'
		},
		paste: {
			title: 'Einfügen',
			text: 'Text aus der Zwischenablage einfügen.'
		}
	});
}
if (Ext.form.htmleditor.ColorPlugin) {
	Ext.apply(Ext.form.htmleditor.ColorPlugin.prototype.tips, {
		forecolor: {
			title: 'Schrift',
			text: 'Farbe des ausgewählten Textes ändern.'
		},
		backcolor: {
			title: 'Text farblich hervorheben',
			text: 'Hintergrundfarbe des ausgewählten Textes ändern.'
		}
	});
}
if (Ext.form.htmleditor.EraserPlugin) {
	Ext.apply(Ext.form.htmleditor.EraserPlugin.prototype.tips, {
		removeFormat: {
			title: 'Formatierungen löschen',
			text: 'Entfernt alle Formatierungen des ausgewählten Textes.'
		}
	});
}
if (Ext.form.htmleditor.FontSizePlugin) {
	Ext.apply(Ext.form.htmleditor.FontSizePlugin.prototype.tips, {
		increasefontsize: {
			title: 'Text vergrößern',
			text: 'Erhöht die Schriftgröße.'
		},
		decreasefontsize: {
			title: 'Text verkleinern',
			text: 'Verringert die Schriftgröße.'
		}
	});
}
if (Ext.form.htmleditor.FormatPlugin) {
	Ext.apply(Ext.form.htmleditor.FormatPlugin.prototype.tips, {
		bold: {
			title: 'Fett',
			text: 'Erstellt den ausgewählten Text in Fettschrift.'
		},
		italic: {
			title: 'Kursiv',
			text: 'Erstellt den ausgewählten Text in Schrägschrift.'
		},
		underline: {
			title: 'Unterstrichen',
			text: 'Unterstreicht den ausgewählten Text.'
		},
		strikeThrough: {
			title: 'Durchgestrichen',
			text: 'Streicht den ausgewählten Text durch.'
		}
	});
}
if (Ext.form.htmleditor.HorizontalRulePlugin) {
	Ext.apply(Ext.form.htmleditor.HorizontalRulePlugin.prototype.tips, {
		insertHorizontalRule: {
			title: 'Horizontale Linie',
			text: 'Fügt eine horizontale Linie ein.'
		}
	});
}
if (Ext.form.htmleditor.ImagePlugin) {
	Ext.apply(Ext.form.htmleditor.ImagePlugin.prototype.tips, {
		insertImage: {
			title: 'Bild einfügen',
			text: 'Fügt ein Bild an der Cursorposition ein.'
		}
	});
}
if (Ext.form.htmleditor.IndentPlugin) {
	Ext.apply(Ext.form.htmleditor.IndentPlugin.prototype.tips, {
		indent: {
			title: 'Einzug vergrößern',
			text: 'Vergrößert die Einzugsebene des Absatzes.'
		},
		outdent: {
			title: 'Einzug verringern',
			text: 'Verkleinert die Einzugsebene des Absatzes.'
		}
	});
}
if (Ext.form.htmleditor.LinkPlugin) {
	Ext.apply(Ext.form.htmleditor.LinkPlugin.prototype.tips, {
		createLink: {
			title: 'Hyperlink einfügen',
			text: 'Eine URL mit dem ausgewählten Text verlinken.'
		},
		unlink: {
			title: 'Hyperlink entfernen',
			text: 'Entfernt den Hyperlink für den markierten Text.'
		}
	});
}
if (Ext.form.htmleditor.ListPlugin) {
	Ext.apply(Ext.form.htmleditor.ListPlugin.prototype.tips, {
		insertUnorderedList: {
			title: 'Aufzählung',
			text: 'Beginnt eine Aufzählungsliste.'
		},
		insertOrderedList: {
			title: 'Nummerierung',
			text: 'Beginnt eine Nummerierungsliste.'
		}
	});
}
if (Ext.form.htmleditor.SourceEditPlugin) {
	Ext.apply(Ext.form.htmleditor.SourceEditPlugin.prototype.tips, {
		sourceedit: {
			title: 'Quelltext bearbeiten',
			text: 'Schaltet zwischen WYSIWYG- und Quelltextmodus um.'
		}
	});
}
if (Ext.form.htmleditor.SuperscriptPlugin) {
	Ext.apply(Ext.form.htmleditor.SuperscriptPlugin.prototype.tips, {
		superscript: {
			title: 'Hochgestellt',
			text: 'Den ausgewählten Text hochstellen.'
		},
		subscript: {
			title: 'Tiefgestellt',
			text: 'Den ausgewählten Text tiefstellen.'
		}
	});
}
if (Ext.form.htmleditor.UndoPlugin) {
	Ext.apply(Ext.form.htmleditor.UndoPlugin.prototype.tips, {
		undo: {
			title: 'Rückgängig',
			text: 'Macht die letzte Aktion rückgängig.'
		},
		redo: {
			title: 'Wiederherstellen',
			text: 'Stellt die letzte rückgängig gemachte Aktion wieder her.'
		}
	});
}

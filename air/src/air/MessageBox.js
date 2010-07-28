/**
 * @class Ext.air.MessageBox
 * <p>Utility class for generating different styles of message boxes.  The alias Ext.air.Msg can also be used.<p/>
 * <p>Note that the MessageBox is asynchronous.  Unlike a regular JavaScript <code>alert</code> (which will halt
 * browser execution), showing a MessageBox will not cause the code to stop.  For this reason, if you have code
 * that should only run <em>after</em> some user feedback from the MessageBox, you must use a callback function
 * (see the <code>function</code> parameter for {@link #show} for more details).</p>
 * <p>Example usage:</p>
 *<pre><code>
// Basic alert:
Ext.air.Msg.alert('Status', 'Changes saved successfully.');

// Prompt for user data and process the result using a callback:
Ext.air.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value and close...
    }
});

// Show a dialog using config options:
Ext.air.Msg.show({
   title:'Save Changes?',
   msg: 'You are closing a tab that has unsaved changes. Would you like to save your changes?',
   buttons: Ext.air.Msg.YESNOCANCEL,
   fn: processResult,
   icon: Ext.air.MessageBox.QUESTION
});
</code></pre>
 * @singleton
 */
Ext.air.MessageBox = function() {
	var dlg, vp, opt, btnHandled = false,
		bodyEl, iconEl, textboxEl, textareaEl, progressBar,
		bufferIcon = '', iconCls = '', keyMap, bwidth = null;
	
	// private
	var handleButton = function(button) {
		if (!button) {
			button = (opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel) ? 'no' : 'cancel';
		}
		
		var btn = vp.fbar.getComponent(button);
		if (btn) btn.blur();
		if (btnHandled) return false;
		btnHandled = true;
		if (dlg.isVisible()) {
			dlg.hide();
			handleHide();
		}
		Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.getValue(), opt], 1);
	};
	// private
	var handleHide = function() {
		if(opt && opt.cls){
			dlg.el.removeClass(opt.cls);
		}
		progressBar.reset();
	};
	// private
	var updateButtons = function(buttons) {
		var f = vp.fbar,
			cfg, btn;
		f.removeAll();
		Ext.iterate(buttons, function(name, b) {
			cfg = Ext.isObject(b) ? b : this.buttonCfg[name];
			if (cfg) {
				btn = f.addButton(Ext.apply({},{
					itemId: name,
					handler: handleButton.createCallback(name)
				}, cfg));
			}
		}, this);
		f.doLayout();
		return null;
	};
	// private
	var buildDialog = function(fn) {
		if (!dlg) {
			dlg = new Ext.air.Window({
				type: air.NativeWindowType.NORMAL,
				transparent: true,
				systemChrome: air.NativeWindowSystemChrome.NONE,
				cls: 'x-window-dlg',
				resizable: false,
				minimizable: false,
				maximizable: false,
				stateful: false,
				modal: false,
				buttonAlign: 'center',
				width: 400,
				height:100,
				minHeight: 80,
				plain: true,
				footer: true,
				closable: true,
				draggable: true,
				fbar: {
					enableOverflow: false,
					items: []
				},
				// query ExtJS and ExtAIR files from main window
				fileQuery: {
					type: 'queryExt',
					root: Ext.air.App.getRootHtmlWindow().document
				},
				closeAction: 'hide',
				hidden: false,
				listeners: {
					'complete': function(w) {
						// build body content
						var win = w.getWindow();
						vp = w.getViewport();
						bodyEl = vp.body.createChild({
							html: '<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"></div></div><div class="x-clear"></div>'
						});
						iconEl = bodyEl.first('.ext-mb-icon');
						msgEl = bodyEl.child('.ext-mb-text');
						if (win && win.Ext) {
							textboxEl = new win.Ext.form.TextField({
								listeners: {
									'keydown': function(e) {
										if (e.getKey() = Ext.EventObject.ENTER && dlg.isVisible() && opt && opt.buttons) {
											if (opt.buttons.ok) {
												handleButton("ok");
											} else if (opt.buttons.yes) {
												handleButton("yes");
											}
										}
									}
								},
								renderTo: bodyEl,
								cls: 'ext-mb-input'
							});
							textareaEl = new win.Ext.form.TextArea({
								renderTo: bodyEl,
								cls: 'ext-mb-textarea'
							});
							progressBar = new win.Ext.ProgressBar({
								renderTo: bodyEl
							});
							keyMap = new win.Ext.KeyMap(win.Ext.getDoc(), {
								key: 27,
								handler: function() {
									dlg.hide();
								}
							});
						}
						fn.call(this, dlg);
					},
					'hide': handleButton.createCallback(null),
					scope: this
				}
			});
		} else {
			fn.call(this, dlg);
		}
	};
	
	return {
		/**
		 * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
		 * initiated via {@link Ext.air.MessageBox#progress} or {@link Ext.air.MessageBox#wait},
		 * or by calling {@link Ext.air.MessageBox#show} with progress: true.
		 * @param {Number} value Any number between 0 and 1 (e.g., .5, defaults to 0)
		 * @param {String} progressText The progress text to display inside the progress bar (defaults to '')
		 * @param {String} msg The message box's body text is replaced with the specified string (defaults to undefined
		 * so that any existing body text will not get overwritten by default unless a new value is passed in)
		 * @return {Ext.MessageBox} this
		 */
		updateProgress: function(value, progressText, msg) {
			if (progressBar) progressBar.updateProgress(value, progressText);
			if(msg){
				this.updateText(msg);
			}
			return this;
		},
		/**
		 * Updates the message box body text
		 * @param {String} text (optional) Replaces the message box element's innerHTML with the specified string (defaults to
		 * the XHTML-compliant non-breaking space character '&amp;#160;')
		 * @return {Ext.air.MessageBox} this
		 */
		updateText: function(text) {
			if(!dlg.isVisible() && !opt.width){
				dlg.setSize(this.maxWidth, 100); // resize first so content is never clipped from previous shows
			}
			msgEl.update(text || '&#160;');

			var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0,
				mw = msgEl.getWidth() + msgEl.getMargins('lr'),
				fw = vp.getFrameWidth('lr'),
				bw = vp.body.getFrameWidth('lr'),
				w;
			
			if (!Ext.isNumber(bwidth)) {
				bwidth = 0;
				vp.fbar.items.each(function(b) {
					bwidth += b.getWidth() + 15;
				});
			}
			
			w = Math.max(Math.min(opt.width || iw+mw+fw+bw, opt.maxWidth || this.maxWidth),
					Math.max(opt.minWidth || this.minWidth, bwidth || 0));

			if(opt.prompt === true){
				activeTextEl.setWidth(w-iw-fw-bw);
			}
			if(opt.progress === true || opt.wait === true){
				progressBar.setSize(w-iw-fw-bw);
			}
			vp.setSize(w, 'auto');
			dlg.setSize(vp.getSize()).center();
			return this;
		},
		/**
		 * Returns true if the message box is currently displayed
		 * @return {Boolean} True if the message box is visible, else false
		 */
		isVisible: function() {
			return dlg && dlg.isVisible();
		},
		/**
		 * Hides the message box if it is displayed
		 * @return {Ext.air.MessageBox} this
		 */
		hide: function() {
			if (this.isVisible()) {
				dlg.hide();
				handleHide();
			}
			return this;
		},
		/**
		 * Displays a new message box, or reinitializes an existing message box, based on the config options
		 * passed in. All display functions (e.g. prompt, alert, etc.) on MessageBox call this function internally,
		 * although those calls are basic shortcuts and do not support all of the config options allowed here.
		 * @param {Object} config The following config options are supported: <ul>
		 * <li><b>buttons</b> : Object/Boolean<div class="sub-desc">A button config object (e.g., Ext.MessageBox.OKCANCEL or {ok:{text:'Foo'},
		 * cancel:{text:'Bar'}}), or false to not show any buttons (defaults to false)</div></li>
		 * <li><b>closable</b> : Boolean<div class="sub-desc">False to hide the top-right close button (defaults to true). Note that
		 * progress and wait dialogs will ignore this property and always hide the close button as they can only
		 * be closed programmatically.</div></li>
		 * <li><b>cls</b> : String<div class="sub-desc">A custom CSS class to apply to the message box's container element</div></li>
		 * <li><b>defaultTextHeight</b> : Number<div class="sub-desc">The default height in pixels of the message box's multiline textarea
		 * if displayed (defaults to 75)</div></li>
		 * <li><b>fn</b> : Function<div class="sub-desc">A callback function which is called when the dialog is dismissed either
		 * by clicking on the configured buttons, or on the dialog close button, or by pressing
		 * the return button to enter input.
		 * <p>Progress and wait dialogs will ignore this option since they do not respond to user
		 * actions and can only be closed programmatically, so any required function should be called
		 * by the same code after it closes the dialog. Parameters passed:<ul>
		 * <li><b>buttonId</b> : String<div class="sub-desc">The ID of the button pressed, one of:<div class="sub-desc"><ul>
		 * <li><tt>ok</tt></li>
		 * <li><tt>yes</tt></li>
		 * <li><tt>no</tt></li>
		 * <li><tt>cancel</tt></li>
		 * <li>any other custom index of the <i>buttons</i> config object</li>		 
		 * </ul></div></div></li>
		 * <li><b>text</b> : String<div class="sub-desc">Value of the input field if either <tt><a href="#show-option-prompt" ext:member="show-option-prompt" ext:cls="Ext.MessageBox">prompt</a></tt>
		 * or <tt><a href="#show-option-multiline" ext:member="show-option-multiline" ext:cls="Ext.MessageBox">multiline</a></tt> is true</div></li>
		 * <li><b>opt</b> : Object<div class="sub-desc">The config object passed to show.</div></li>
		 * </ul></p></div></li>
		 * <li><b>scope</b> : Object<div class="sub-desc">The scope of the callback function</div></li>
		 * <li><b>icon</b> : String<div class="sub-desc">A CSS class that provides a background image to be used as the body icon for the
		 * dialog (e.g. Ext.MessageBox.WARNING or 'custom-class') (defaults to '')</div></li>
		 * <li><b>iconCls</b> : String<div class="sub-desc">The standard {@link Ext.air.Viewport#iconCls} to
		 * add an optional header icon (defaults to '')</div></li>
		 * <li><b>maxWidth</b> : Number<div class="sub-desc">The maximum width in pixels of the message box (defaults to 600)</div></li>
		 * <li><b>minWidth</b> : Number<div class="sub-desc">The minimum width in pixels of the message box (defaults to 100)</div></li>
		 * <li><b>modal</b> : Boolean<div class="sub-desc">False to allow user interaction with the page while the message box is
		 * displayed (defaults to true)</div></li>
		 * <li><b>parent</b> : air.NativeWindow/Boolean<div class="sub-desc">The parent window that should be applied to this window.
		 * See {@link Ext.air.NativeWindow#applyParentWindow} for more information. Defaults to <code>undefined</code>.</div></li>
		 * <li><b>msg</b> : String<div class="sub-desc">A string that will replace the existing message box body text (defaults to the
		 * XHTML-compliant non-breaking space character '&amp;#160;')</div></li>
		 * <li><a id="show-option-multiline"></a><b>multiline</b> : Boolean<div class="sub-desc">
		 * True to prompt the user to enter multi-line text (defaults to false)</div></li>
		 * <li><b>progress</b> : Boolean<div class="sub-desc">True to display a progress bar (defaults to false)</div></li>
		 * <li><b>progressText</b> : String<div class="sub-desc">The text to display inside the progress bar if progress = true (defaults to '')</div></li>
		 * <li><a id="show-option-prompt"></a><b>prompt</b> : Boolean<div class="sub-desc">True to prompt the user to enter single-line text (defaults to false)</div></li>
		 * <li><b>title</b> : String<div class="sub-desc">The title text</div></li>
		 * <li><b>value</b> : String<div class="sub-desc">The string value to set into the active textbox element if displayed</div></li>
		 * <li><b>wait</b> : Boolean<div class="sub-desc">True to display a progress bar (defaults to false)</div></li>
		 * <li><b>waitConfig</b> : Object<div class="sub-desc">A {@link Ext.ProgressBar#waitConfig} object (applies only if wait = true)</div></li>
		 * <li><b>width</b> : Number<div class="sub-desc">The width of the dialog in pixels</div></li>
		 * </ul>
		 * Example usage:
		 * <pre><code>
Ext.air.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Ext.air.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   icon: Ext.air.MessageBox.INFO
});
</code></pre>
		 * @return {Ext.air.MessageBox} this
		 */
		show: function(options) {
			if(this.isVisible()){
				this.hide();
			}
			opt = options || {};
			// build dialog and call function on complete
			// call function immediately if a msg dialog is already built
			buildDialog.call(this, function() {
				dlg.setTitle(opt.title || "");
				var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
				vp.getTool('close').setDisplayed(allowClose);
				btnHandled = false; // reset button handler
				activeTextEl = textboxEl;
				opt.prompt = opt.prompt || (opt.multiline ? true : false);
				if(opt.prompt){
					if(opt.multiline){
						textboxEl.hide();
						textareaEl.show();
						textareaEl.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline : this.defaultTextHeight);
						activeTextEl = textareaEl;
					}else{
						textboxEl.show();
						textareaEl.hide();
					}
				}else{
					textboxEl.hide();
					textareaEl.hide();
				}
				activeTextEl.setValue(opt.value || "");
				if(opt.iconCls){
					vp.setIconClass(opt.iconCls);
				}
				dlg.on('activate', function() {
					if (opt.prompt) {
						activeTextEl.focus(true);
					} else if (opt && opt.buttons) {
						if (opt.buttons.ok) {
							vp.fbar.getComponent('ok').focus();
						} else if (opt.buttons.yes) {
							vp.fbar.getComponent('yes').focus();
						}
					}
				}, this, {single: true, delay: 10});
				// set icon
				this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
				// init buttons and reset bwidth
				bwidth = updateButtons.call(this, opt.buttons);
				progressBar.setVisible(opt.progress === true || opt.wait === true);
				this.updateProgress(0, opt.progressText);
				this.updateText(opt.msg);
				if(opt.cls){
					vp.addClass(opt.cls);
				}
				// do modal=false, so that the 'activate' event is fired correctly if dlg is not active
				// set modal, when dlg becomes first activated
				//dlg.modal = false;
				dlg.modal = opt.modal !== false;
				dlg.applyParentWindow(opt.parent);
				if (!this.isVisible()) {
					if (keyMap) dlg.on('show', function() {
						keyMap.setDisabled(!allowClose);
					}, this, {single: true});
					// notify user, if window is not active
					// aw was window.nativeWindow before -> it is better to use the current active window
					// because it can be an Ext.air.Window and window.nativeWindow is the root window in that case.
					/*if (Ext.air.App.getActiveWindow() != aw) {
						dlg.show();
						dlg.getNative().notifyUser(air.NotificationType.CRITICAL);
						var fn = function() {
							dlg.modal = opt.modal !== false;
							aw.activate();
							dlg.setActive(true);
							dlg.un('activate', fn, window);
							aw.removeEventListener('activate', fn);
						};
						// activate msg, if dlg OR former active window becomes activated
						dlg.on('activate', fn, window, {single: true});
						aw.addEventListener('activate', fn);
					} else {
						dlg.modal = opt.modal !== false;
						dlg.setActive(true);
					}*/
					dlg.ensureActive();
				}
				if(opt.wait === true){
					progressBar.wait(opt.waitConfig);
				}
			});
			return this;
		},
		/**
		 * Adds the specified icon to the dialog.  By default, the class 'ext-mb-icon' is applied for default
		 * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
		 * to clear any existing icon. This method must be called before the MessageBox is shown.
		 * The following built-in icon classes are supported, but you can also pass in a custom class name:
		 * <pre>
Ext.air.MessageBox.INFO
Ext.air.MessageBox.WARNING
Ext.air.MessageBox.QUESTION
Ext.air.MessageBox.ERROR
		 *</pre>
		 * @param {String} icon A CSS classname specifying the icon's background image url, or empty string to clear the icon
		 * @return {Ext.air.MessageBox} this
		 */
		setIcon: function(icon) {
			if(!dlg){
				bufferIcon = icon;
				return;
			}
			bufferIcon = undefined;
			if(icon && icon != ''){
				iconEl.removeClass('x-hidden');
				iconEl.replaceClass(iconCls, icon);
				bodyEl.addClass('x-dlg-icon');
				iconCls = icon;
			}else{
				iconEl.replaceClass(iconCls, 'x-hidden');
				bodyEl.removeClass('x-dlg-icon');
				iconCls = '';
			}
			return this;
		},
		/**
		 * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
		 * the user.  You are responsible for updating the progress bar as needed via {@link Ext.air.MessageBox#updateProgress}
		 * and closing the message box when the process is complete.
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {String} progressText (optional) The text to display inside the progress bar (defaults to '')
		 * @return {Ext.air.MessageBox} this
		 */
		progress: function(title, msg, progressText) {
			this.show({
				title: title,
				msg: msg,
				buttons: false,
				progress: true,
				closable: false,
				minWidth: this.minProgressWidth,
				progressText: progressText
			});
			return this;
		},
		/**
		 * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
		 * interaction while waiting for a long-running process to complete that does not have defined intervals.
		 * You are responsible for closing the message box when the process is complete.
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Object} config (optional) A {@link Ext.ProgressBar#waitConfig} object
		 * @return {Ext.air.MessageBox} this
		 */
		wait: function(title, msg, config) {
			this.show({
				title: title,
				msg: msg,
				buttons: false,
				closable: false,
				wait: true,
				modal: true,
				minWidth:  this.minProgressWidth,
				waitConfig: config
			});
			return this;
		},
		/**
		 * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt).
		 * If a callback function is passed it will be called after the user clicks the button, and the
		 * id of the button that was clicked will be passed as the only parameter to the callback
		 * (could also be the top-right close button).
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Function} fn (optional) The callback function invoked after the message box is closed
		 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to the current window.
		 * @return {Ext.air.MessageBox} this
		 */
		alert: function(title, msg, fn, scope) {
			this.show({
				title: title,
				msg: msg,
				buttons: this.OK,
				fn: fn,
				scope: scope,
				minWidth: this.minWidth
			});
			return this;
		},
		/**
		 * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm).
		 * If a callback function is passed it will be called after the user clicks either button,
		 * and the id of the button that was clicked will be passed as the only parameter to the callback
		 * (could also be the top-right close button).
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Function} fn (optional) The callback function invoked after the message box is closed
		 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to the current wnidow.
		 * @return {Ext.air.MessageBox} this
		 */
		confirm: function(title, msg, fn, scope) {
			this.show({
				title: title,
				msg: msg,
				buttons: this.YESNO,
				fn: fn,
				scope: scope,
				icon: this.QUESTION,
				minWidth: this.minWidth
			});
			return this;
		},
		/**
		 * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
		 * The prompt can be a single-line or multi-line textbox. If a callback function is passed it will be called after the user
		 * clicks either button, and the id of the button that was clicked (could also be the top-right
		 * close button) and the text that was entered will be passed as the two parameters to the callback.
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Function} fn (optional) The callback function invoked after the message box is closed
		 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to the current window.
		 * @param {Boolean/Number} multiline (optional) True to create a multiline textbox using the defaultTextHeight
		 * property, or the height in pixels to create the textbox (defaults to false / single-line)
		 * @param {String} value (optional) Default value of the text input element (defaults to '')
		 * @return {Ext.air.MessageBox} this
		 */
		prompt: function(title, msg, fn, scope, multiline, value) {
			this.show({
				title: title,
				msg: msg,
				buttons: this.OKCANCEL,
				fn: fn,
				minWidth: this.minPromptWidth,
				scope: scope,
				prompt: true,
				multiline: multiline,
				value: value
			});
			return this;
		},
		/**
		 * An object containing the default button config objects that can be overriden for localized language support.
		 * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
		 * resource file for handling language support across the framework.
		 * Customize the default text like so: Ext.air.MessageBox.buttonText.yes = {text:"oui"}; //french
		 * @type Object
		 */
		buttonCfg: {
			ok: {
				text: 'OK'
			},
			cancel: {
				text: 'Cancel'
			},
			yes: {
				text: 'Yes'
			},
			no: {
				text: 'No'
			}
		},
		/**
		 * Button config that displays a single OK button
		 * @type Object
		 */
		OK: {ok:true},
		/**
		 * Button config that displays a single Cancel button
		 * @type Object
		 */
		CANCEL: {cancel:true},
		/**
		 * Button config that displays OK and Cancel buttons
		 * @type Object
		 */
		OKCANCEL: {ok:true, cancel:true},
		/**
		 * Button config that displays Yes and No buttons
		 * @type Object
		 */
		YESNO: {yes:true, no:true},
		/**
		 * Button config that displays Yes, No and Cancel buttons
		 * @type Object
		 */
		YESNOCANCEL: {yes:true, no:true, cancel:true},
		/**
		 * The CSS class that provides the INFO icon image
		 * @type String
		 */
		INFO: 'ext-mb-info',
		/**
		 * The CSS class that provides the WARNING icon image
		 * @type String
		 */
		WARNING: 'ext-mb-warning',
		/**
		 * The CSS class that provides the QUESTION icon image
		 * @type String
		 */
		QUESTION: 'ext-mb-question',
		/**
		 * The CSS class that provides the ERROR icon image
		 * @type String
		 */
		ERROR: 'ext-mb-error',
		/**
		 * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
		 * @type Number
		 */
		defaultTextHeight: 75,
		/**
		 * The maximum width in pixels of the message box (defaults to 600)
		 * @type Number
		 */
		maxWidth: 600,
		/**
		 * The minimum width in pixels of the message box (defaults to 100)
		 * @type Number
		 */
		minWidth: 100,
		/**
		 * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
		 * for setting a different minimum width than text-only dialogs may need (defaults to 250).
		 * @type Number
		 */
		minProgressWidth: 250,
		/**
		 * The minimum width in pixels of the message box if it is a prompt dialog.  This is useful
		 * for setting a different minimum width than text-only dialogs may need (defaults to 250).
		 * @type Number
		 */
		minPromptWidth: 250
	};
}();
/**
 * Shorthand for {@link Ext.air.MessageBox}
 */
Ext.air.Msg = Ext.air.MessageBox;

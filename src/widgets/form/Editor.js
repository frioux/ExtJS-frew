Ext.form.HtmlEditor = Ext.extend(Ext.form.Field, {

    validationEvent : false,

    deferHeight: true,

    editorTbEnabled : false,

    enableFormat : true,
    enableFontSize : true,
    enableColors : true,
    enableAlignments : true,
    enableLists : true,
    enableSourceEdit : true,

    sourceEditMode : false,

    onFocus : Ext.emptyFn,

    defaultAutoCreate : {
        tag: "textarea",
        style:"width:500px;height:300px;",
        autocomplete: "off"
    },

    initialized : false,

    onRender : function(ct, position){
        Ext.form.HtmlEditor.superclass.onRender.call(this, ct, position);
        this.el.dom.style.border = '0 none';
        this.el.addClass('x-hidden');
        if(Ext.isIE){ // fix IE 1px bogus margin
            this.el.applyStyles('margin-top:-1px;margin-bottom:-1px;')
        }
        this.wrap = this.el.wrap({
            cls:'x-html-editor-wrap', cn:{cls:'x-html-editor-tb'}
        });



        var editor = this; // closure it in
        function btn(id, toggle, handler){
            return {
                id : id,
                cls : 'x-btn-icon x-edit-'+id,
                enableToggle:toggle !== false,
                scope: editor,
                handler:handler||editor.relayCmd,
                clickEvent:'mousedown',
                tooltip: editor.buttonTips[id] || undefined
            };
        }

        // build the toolbar
        var tb = new Ext.Toolbar(this.wrap.dom.firstChild);

        if(this.enableFormat){
            tb.add(
                btn('bold'),
                btn('italic'),
                btn('underline')
            );
        };

        if(this.enableFontSize){
            tb.add(
                '-',
                btn('increasefontsize', false, this.adjustFont),
                btn('decreasefontsize', false, this.adjustFont)
            );
        };

        if(this.enableColors){
            tb.add(
                '-', {
                    id:'forecolor',
                    cls:'x-btn-icon x-edit-forecolor',
                    clickEvent:'mousedown',
                    tooltip: editor.buttonTips['forecolor'] || undefined,
                    menu : new Ext.menu.ColorMenu({
                        focus: Ext.emptyFn,
                        value:'000000',
                        plain:true,
                        selectHandler: function(cp, color){
                            this.execCmd('forecolor', Ext.isSafari || Ext.isIE ? '#'+color : color);
                            this.deferFocus();
                        },
                        scope: this,
                        clickEvent:'mousedown'
                    })
                }, {
                    id:'backcolor',
                    cls:'x-btn-icon x-edit-backcolor',
                    clickEvent:'mousedown',
                    tooltip: editor.buttonTips['backcolor'] || undefined,
                    menu : new Ext.menu.ColorMenu({
                        focus: Ext.emptyFn,
                        value:'FFFFFF',
                        plain:true,
                        selectHandler: function(cp, color){
                            if(Ext.isGecko){
                                this.execCmd('useCSS', false);
                                this.execCmd('hilitecolor', color);
                                this.execCmd('useCSS', true);
                                this.deferFocus();
                            }else{
                                this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isSafari || Ext.isIE ? '#'+color : color);
                                this.deferFocus();
                            }
                        },
                        scope:this,
                        clickEvent:'mousedown'
                    })
                }
            );
        };

        if(this.enableAlignments){
            tb.add(
                '-',
                btn('justifyleft'),
                btn('justifycenter'),
                btn('justifyright')
            );
        };

        if(!Ext.isSafari){
            if(this.enableLists){
                tb.add(
                    '-',
                    btn('insertorderedlist'),
                    btn('insertunorderedlist')
                );
            }
            if(this.enableSourceEdit){
                tb.add(
                    '-',
                    btn('sourceedit', true, this.toggleSourceEdit)
                );
            }
        }

        tb.items.each(function(item){
           if(item.id != 'sourceedit'){
                item.disable();
            }
        });

        this.tb = tb;

        var iframe = document.createElement('iframe');
        iframe.name = Ext.id();
        iframe.frameBorder = 'no';

        iframe.src="javascript:false";

        this.wrap.dom.appendChild(iframe);

        this.iframe = iframe;

        this.doc = Ext.isIE ?
                  iframe.contentWindow.document :
                  (iframe.contentDocument || window.frames[iframe.name].document);

        this.win = Ext.isIE ?
                  iframe.contentWindow :
                  window.frames[iframe.name];

        this.doc.designMode = 'on';
        this.doc.open();
        this.doc.write('<html><head><style type="text/css">body{border:0;margin:0;padding:3px;cursor:text;}</style></head><body></body></html>')
        this.doc.close();

        var task = { // must defer to wait for browser to be ready
            run : function(){
                if(this.doc.body || this.doc.readyState == 'complete'){
                    this.doc.designMode="on";
                    Ext.TaskMgr.stop(task);
                    this.initEditor.defer(10, this);
                }
            },
            interval : 10,
            duration:10000,
            scope: this
        };
        Ext.TaskMgr.start(task);

        if(!this.width){
            this.setSize(this.el.getSize());
        }
    },

    // private
    onResize : function(w, h){
        Ext.form.HtmlEditor.superclass.onResize.apply(this, arguments);
        if(this.el && this.iframe){
            if(typeof w == 'number'){
                var aw = w - this.wrap.getFrameWidth('lr');
                this.el.setWidth(this.adjustWidth('textarea', aw));
                this.iframe.style.width = aw + 'px';
            }
            if(typeof h == 'number'){
                var ah = h - this.wrap.getFrameWidth('tb') - this.tb.el.getHeight();
                this.el.setHeight(this.adjustWidth('textarea', ah));
                this.iframe.style.height = ah + 'px';
            }
        }
    },

    toggleSourceEdit : function(btn){
        this.sourceEditMode = btn.pressed;
        if(btn.pressed){
            this.tb.items.each(function(item){
                if(item.id != 'sourceedit'){
                    item.disable();
                }
            });
            this.syncValue();
            this.iframe.className = 'x-hidden';
            this.el.removeClass('x-hidden');
            this.el.focus();
        }else{
            if(this.initialized){
                this.tb.items.each(function(item){
                    item.enable();
                });
            }
            this.pushValue();
            this.iframe.className = '';
            this.el.addClass('x-hidden');
            this.deferFocus();
        }
        this.setSize(this.wrap.getSize());
    },

    adjustSize : Ext.BoxComponent.prototype.adjustSize,

    getResizeEl : function(){
        return this.wrap;
    },

    getPositionEl : function(){
        return this.wrap;
    },

    initEvents : function(){
        this.originalValue = this.getValue();
    },

    markInvalid : Ext.emptyFn,
    clearInvalid : Ext.emptyFn,

    setValue : function(v){
        Ext.form.HtmlEditor.superclass.setValue.call(this, v);
        this.pushValue();
    },

    cleanHtml : function(html){
        html = String(html);
        if(html.length > 5){
            var lhtml = html.toLowerCase();
            if(Ext.isSafari){ // strip safari nonsense
                html = html.replace(/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi, '');
            }
        }
        if(html == '&nbsp;'){
            html = '';
        }
        return html;
    },

    syncValue : function(){
        if(this.initialized){
            var bd = (this.doc.body || this.doc.documentElement);
            var html = bd.innerHTML;
            if(Ext.isSafari){
                var bs = bd.getAttribute('style'); // Safari puts text-align styles on the body element!
                var m = bs.match(/text-align:(.*?);/i);
                if(m && m[1]){
                    html = '<div style="'+m[0]+'">' + html + '</div>';
                }
            }
            this.el.dom.value = this.cleanHtml(html);
        }
    },

    pushValue : function(){
        if(this.initialized){
            var v = this.el.dom.value;
            if(v.length < 1){
                v = '&nbsp;';
            }
            (this.doc.body || this.doc.documentElement).innerHTML = v;
        }
    },

    deferFocus : function(){
        this.focus.defer(10, this);
    },

    focus : function(){
        if(this.win){
            this.win.focus();
        }else{
            this.el.focus();
        }
    },

    initEditor : function(){
        var dbody = (this.doc.body || this.doc.documentElement);
        var ss = this.el.getStyles('font-size', 'font-family', 'background-image', 'background-repeat');
        ss['background-attachment'] = 'fixed'; // w3c
        dbody.bgProperties = 'fixed'; // ie
        Ext.DomHelper.applyStyles(dbody, ss);
        Ext.EventManager.on(this.doc, {
            'mousedown': this.updateTb,
            'dblclick': this.updateTb,
            'click': this.updateTb,
            //'keydown': updateTb,
            'keyup': this.updateTb,
            buffer:100,
            scope: this
        });
        if(Ext.isGecko){
            Ext.EventManager.on(this.doc, 'keypress', this.applyCommand, this);
        }
        if(Ext.isIE || Ext.isSafari || Ext.isOpera){
            Ext.EventManager.on(this.doc, 'keydown', this.fixTab, this);
        }
        this.initialized = true;
        this.pushValue();
    },

    onDestroy : function(){
        if(this.rendered){
            this.tb.items.each(function(item){
                if(item.menu){
                    item.menu.removeAll();
                    if(item.menu.el){
                        item.menu.el.destroy();
                    }
                }
                item.destroy();
            });
            this.wrap.dom.innerHTML = '';
            this.wrap.remove();
        }
    },

    initEditorTb : function(){
        this.editorTbEnabled = true;
        this.tb.items.each(function(item){
           item.enable();
        });
        if(Ext.isGecko){ // prevent silly gecko errors
            var s = this.win.getSelection();
            if(!s.focusNode || s.focusNode.nodeType != 3){
                var r = s.getRangeAt(0);
                r.selectNodeContents((this.doc.body || this.doc.documentElement));
                r.collapse(true);
                this.deferFocus();
            }
            try{
                this.execCmd('useCSS', true);
                this.execCmd('styleWithCSS', false);
            }catch(e){}
        }
    },

    adjustFont: function(btn){
        var adjust = btn.id == 'increasefontsize' ? 1 : -1;
        if(Ext.isSafari){ // safari
            adjust *= 2;
        }
        var v = parseInt(this.doc.queryCommandValue('FontSize')|| 3, 10);
        v = Math.max(1, v+adjust);
        this.execCmd('FontSize', v + (Ext.isSafari ? 'px' : 0));
    },

    updateTb: function(){

        if(!this.editorTbEnabled){
            this.initEditorTb();
            return;
        }

        var btns = this.tb.items.map, doc = this.doc;

        btns.bold.toggle(doc.queryCommandState('bold'));
        btns.italic.toggle(doc.queryCommandState('italic'));
        btns.underline.toggle(doc.queryCommandState('underline'));
        btns.justifyleft.toggle(doc.queryCommandState('justifyleft'));
        btns.justifycenter.toggle(doc.queryCommandState('justifycenter'));
        btns.justifyright.toggle(doc.queryCommandState('justifyright'));

        if(!Ext.isSafari){
            btns.insertorderedlist.toggle(doc.queryCommandState('insertorderedlist'));
            btns.insertunorderedlist.toggle(doc.queryCommandState('insertunorderedlist'));
        }

        this.syncValue();
    },

    relayCmd : function(btn){
        this.win.focus();
        this.execCmd(btn.id, null);
        this.updateTb();
        this.deferFocus();
    },

    execCmd : function(cmd, value){
        this.doc.execCommand(cmd, false, value === undefined ? null : value);
    },

    applyCommand : function(e){
        if(e.ctrlKey){
            var c = e.getCharCode(), cmd;
            if(c > 0){
                c = String.fromCharCode(c);
                switch(c){
                    case 'b':
                        cmd = 'bold';
                    break;
                    case 'i':
                        cmd = 'italic';
                    break;
                    case 'u':
                        cmd = 'underline';
                    break;
                }
                if(cmd){
                    this.win.focus();
                    this.execCmd(cmd);
                    this.deferFocus();
                    e.preventDefault();
                }
            }
        }
    },

    fixTab : function(e){
        if(e.getKey() == e.TAB){
            e.stopEvent();
            if(Ext.isIE){
                var r = this.doc.selection.createRange();
                if(r){
                    r.collapse(true);
                    r.pasteHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                    this.deferFocus();
                }
            }else if(Ext.isOpera){
                this.win.focus();
                this.execCmd('InsertHTML','&nbsp;&nbsp;&nbsp;&nbsp;');
                this.deferFocus();
            }else{
                this.execCmd('InsertText','\t');
                this.deferFocus();
            }
        }
    },

    getToolbar : function(){
        return this.tb;
    },

    buttonTips : {
        bold : {
            title: 'Bold (Ctrl+B)',
            text: 'Make the selected text bold.',
            cls: 'x-html-editor-tip'
        },
        italic : {
            title: 'Italic (Ctrl+I)',
            text: 'Make the selected text italic.',
            cls: 'x-html-editor-tip'
        },
        underline : {
            title: 'Underline (Ctrl+U)',
            text: 'Underline the selected text.',
            cls: 'x-html-editor-tip'
        },
        increasefontsize : {
            title: 'Grow Text',
            text: 'Increase the font size.',
            cls: 'x-html-editor-tip'
        },
        decreasefontsize : {
            title: 'Shrink Text',
            text: 'Decrease the font size.',
            cls: 'x-html-editor-tip'
        },
        backcolor : {
            title: 'Text Highlight Color',
            text: 'Change the background color of the selected text.',
            cls: 'x-html-editor-tip'
        },
        forecolor : {
            title: 'Font Color',
            text: 'Change the color of the selected text.',
            cls: 'x-html-editor-tip'
        },
        justifyleft : {
            title: 'Align Text Left',
            text: 'Align text to the left.',
            cls: 'x-html-editor-tip'
        },
        justifycenter : {
            title: 'Center Text',
            text: 'Center text in the editor.',
            cls: 'x-html-editor-tip'
        },
        justifyright : {
            title: 'Align Text Right',
            text: 'Align text to the right.',
            cls: 'x-html-editor-tip'
        },
        insertunorderedlist : {
            title: 'Bullet List',
            text: 'Start a bulleted list.',
            cls: 'x-html-editor-tip'
        },
        insertorderedlist : {
            title: 'Numbered List',
            text: 'Start a numbered list.',
            cls: 'x-html-editor-tip'
        },
        sourceedit : {
            title: 'Source Edit',
            text: 'Switch to source editing mode.',
            cls: 'x-html-editor-tip'
        }
    }
});
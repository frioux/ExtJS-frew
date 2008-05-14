(function(){
    var transactions = {}, TID = 0, impl, d, pollStartTimer = 0,
            callBuffer = [], callTask;

    var get = function(id){
        return transactions[id] || {};
    }

    var createEvent = function(t, data, xhr, success, hs){
        return Ext.apply(t || {}, {
            xhr: xhr,
            success: success,
            data: data,
            arg: hs
        });
    }

    var doCallback = function(data, t, success, xhr){
        var fn = success ? 'success' : 'failure';
        if(t && t.cb){
            var hs = t.cb;
            var e = createEvent(t, data, xhr, success, hs);
            if(typeof hs == 'function'){
                delete e.arg;
                hs(data, e);
            } else{
                Ext.callback(hs[fn], hs.scope, [data, e]);
                Ext.callback(hs.callback, hs.scope, [data, e]);
            }
        }
    }

    var handleEvent = function(data, xhr){
        if(!data){
            return;
        }
        var t = get(data.tid);
        switch(data.type){
            case 'rpc':
                if(t){
                    doCallback(data.result, t, true, xhr);
                    data.xhr = xhr;
                    d.fireEvent('event', data);
                    delete transactions[data.tid];
                } else{
                    data.xhr = xhr;
                    d.fireEvent('event', data);
                }
                break;
            case 'event':
                data.xhr = xhr;
                d.fireEvent(data.name, data);
                d.fireEvent('event', data);
                break;
            case 'exception':
                if(t){
                    t.code = data.code;
                    t.message = data.message;
                    t.trace = data.where;
                    doCallback(data.result, t, false, xhr);
                    data.xhr = xhr;
                    d.fireEvent('exception', data);
                    delete transactions[data.tid];
                } else{
                    data.xhr = xhr;
                    d.fireEvent('exception', data);
                }
                if(data.where && d.enableDebug){ // testing
                    Ext.Msg.maxWidth = 800;
                    Ext.Msg.show({
                        title: 'Exception occurred while making a remote call to the server',
                        msg: 'Stack trace from the server:',
                        buttons: Ext.MessageBox.OK,
                        multiline: 400,
                        width:800,
                        value: data.message + '\n'  + data.where
                    });
                }
                break;
        }
    }

    var handleException = function(opt, xhr, type){
        var t = get(opt.tid);
        if(t){
            t.xhr = xhr;
            t.type = type || d.exceptions.TRANSPORT;
            doCallback(null, t, false, xhr);
            d.fireEvent('exception', t);
            delete transactions[opt.tid];
        } else{
            d.fireEvent('exception', {
                tid: opt.tid,
                xhr: xhr,
                code: type || d.exceptions.TRANSPORT
            });
        }
    }

    var cb = function(opt, success, xhr){
        if(opt && opt.poll){
            Ext.Direct.fireEvent('poll', xhr, success);
        }
        if(success){
            var data = null;
            if(!Ext.isEmpty(xhr.responseText)){
                try{
                    data = Ext.decode(xhr.responseText);
                } catch(e){
                    return handleException(opt, xhr, d.exceptions.PARSE);
                }
                if(Ext.isArray(data)){
                    for(var i = 0, len = data.length; i < len; i++){
                        handleEvent(data[i], xhr);
                    }
                } else{
                    handleEvent(data, xhr);
                }
            } else if(opt.ts){
                for(var j = 0, len = opt.ts.length; j < len; j++){
                    doCallback(null, transactions[opt.ts[j].tid], true, xhr);
                }
            }
        } else{
            handleException(opt, xhr);
        }
    }

    var doSend = function(data){
        if(d.enableUrlEncode){
            var params = {};
            params[typeof d.enableUrlEncode == 'string' ? d.enableUrlEncode : 'data'] = Ext.encode(data);
            Ext.Ajax.request({
                url: d.remoteUrl,
                params: params,
                callback: cb,
                ts: data
            });
        }else{
            Ext.Ajax.request({
                url: d.remoteUrl,
                jsonData: data,
                callback: cb,
                ts: data
            });
        }
    }

    var combineAndSend = function(){
        var len = callBuffer.length;
        if(len > 0){
            doSend(len == 1 ? callBuffer[0] : callBuffer);
            callBuffer = [];
        }
    }

    var doCall = function(c, m, args){
        var data = null, hs = args[m.len], scope = args[m.len+1];
        var t = {
            tid: ++TID,
            args: args,
            action: c,
            method: m,
            cb: scope && typeof hs == 'function' ? hs.createDelegate(scope) : hs
        };
        if(d.fireEvent('beforecall', t) !== false){
            transactions[t.tid] = t;

            if(m.len !== 0){
                data = args.slice(0, m.len);
            }

            callBuffer.push({
                action: c,
                method: m.name,
                tid: t.tid,
                data: data
            });

            if(d.enableBuffer){
                if(!callTask){
                    callTask = new Ext.util.DelayedTask(combineAndSend);
                }
                callTask.delay(typeof d.enableBuffer == 'number' ? d.enableBuffer : 10);
            }else{
                combineAndSend();
            }
            d.fireEvent('call', t);
        }
    }

    var doForm = function(c, m, form, callback, scope){
        var t = {
            tid: ++TID,
            action: c,
            method: m,
            args:[form, callback, scope],
            cb: scope && typeof callback == 'function' ? callback.createDelegate(scope) : callback
        };
        transactions[t.tid] = t;

        form = Ext.getDom(form);
        var isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data';

        var params = {
            extTID: t.tid,
            extAction: c,
            extMethod: m.name,
            extUpload: String(isUpload)
        };
        if(callback && typeof callback == 'object'){
            Ext.apply(params, callback.params);
        }
        Ext.Ajax.request({
            url: d.remoteUrl,
            params: params,
            callback: cb,
            form: form,
            isUpload: isUpload,
            ts: {
                action: c,
                method: m.name,
                tid: t.tid,
                data: null
            }
        });
    }

    var createMethod = function(c, m){
        var f;
        if(!m.formHandler){
            f = function(){
                doCall(c, m, Array.prototype.slice.call(arguments, 0));
            };
        }else{
            f = function(form, callback, scope){
                doForm(c, m, form, callback, scope);
            };
        }
        f.directCfg = {
            action: c,
            method: m
        };
        return f;        
    }

    impl = Ext.extend(Ext.util.Observable, {
        exceptions: {
            TRANSPORT: 'xhr',
            PARSE: 'parse',
            LOGIN: 'login',
            SERVER: 'exception'
        },

        constructor: function(){
            impl.superclass.constructor.call(this);
            this.addEvents('beforecall', 'call', 'beforeevent', 'event', 'exception', 'connect', 'disconnect', 'pollstart', 'pollstop');
        },

        defineAPI : function(data){
            d.remoteUrl = data.url;
            var o = data.actions || data.cls;
            for(var c in o){
                var cls = window[c] || (window[c] = {});
                var ms = o[c];
                for(var i = 0, len = ms.length; i < len; i++){
                    var m = ms[i];
                    cls[m.name] = createMethod(c, m);
                }
            }
        },

        startPoll : function(){
            clearTimeout(pollStartTimer);
            if(!this.poller){
                this.poller = Ext.TaskMgr.start({
                    run: function(){
                        if(Ext.Direct.fireEvent('beforepoll') !== false){
                            Ext.Ajax.request({
                                url: d.remoteUrl + d.pollUrlFragment,
                                callback: cb,
                                poll: true
                            });
                        }
                    },
                    interval: this.pollInterval,
                    scope: this
                });
                Ext.Direct.fireEvent('startpolling');
            }
        },

        stopPoll : function(){
            clearTimeout(pollStartTimer);
            if(this.poller){
                Ext.TaskMgr.stop(this.poller);
                delete this.poller;
                Ext.Direct.fireEvent('stoppolling');
            }
        },

        inject : function(stringData, opt){
            cb(opt || {}, true, {responseText: stringData});
        },

        injectTransaction : function(callback){
            var t = {
                tid: ++TID,
                action: c,
                method: m,
                cb: callback
            };
            transactions[t.tid] = t;
            return t;
        },

        startStreaming : function(startKeepAlive){
            pollStartTimer = this.startPoll.defer(10000, this);
            if(startKeepAlive === true){
                this.startKeepAlive();
            }
        },

        startKeepAlive : function(){
            (function(){
            this.keepAlive = Ext.TaskMgr.start({
                run: function(){
                    Ext.Ajax.request({
                        url: d.remoteUrl + d.pingUrlFragment,
                        callback: cb
                    });
                    var flash;
                    if(d.Flash && (flash = d.Flash.getFlash())){
                        try{flash.send('ping');}catch(e){try{flash.reconnect();}catch(e){}}
                    }
                },
                interval: this.keepAliveInterval,
                scope: this
            });
            }).defer(100, this);
        },

        autoReconnect: true,
        pollInterval: 3000,
        keepAliveInterval: 60000,
        pollUrlFragment: '/poll',
        pingUrlFragment: '/ping',
        enableBuffer: 10
    });
    Ext.Direct = d = new impl();


    var reconnId = 0;
    var retryId = 0;

    var clear = function(){
        clearTimeout(reconnId);
        clearTimeout(retryId);
    }

    d.Flash = {
        onData : function(strData){
            // setTimeout to avoid flash crash bug
            setTimeout(function(){
                d.inject(strData);
            }, 10);
        },

        onConnect : function(success){
            if(success){
                clear();
                d.stopPoll();
                d.fireEvent('connect');
            }else{
                d.startPoll();
                if(d.autoReconnect){
                    d.Flash.reconnect();
                }
            }
        },

        getFlash : function(){
            return Ext.isIE ? window.xflashDirect : document.xflashDirect;
        },

        reconnect : function(){
            clear();
            var flash = d.Flash.getFlash();
            if(flash){
                reconnId = setTimeout(function(){
                    flash.reconnect();
                }, 1000);
                retryId = setInterval(function(){
                    flash.reconnect();
                }, 30000);
            }
        },

        onClose : function(){
            d.fireEvent('disconnect');
            d.startPoll();
            if(d.autoReconnect){
                d.Flash.reconnect();
            }
        }
    };
})();


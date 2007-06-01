/**
 * @class Ext.data.Connection
 * @extends Ext.util.Observable
 * The class encapsulates a connection to the page's originating domain, allowing requests to be made
 * either to a configured URL, or to a URL specified at request time.<br>
 * <p>
 * Requests made by this class are asynchronous, and will return immediately. No data from
 * the server will be available to the statement immediately following the {@link #request} call.
 * To process returned data, use a callback in the request options object.
 * @constructor
 * @param config {Object} a configuration object.
 */
Ext.data.Connection = function(config){
    Ext.apply(this, config);
    this.addEvents({
        /**
         * @event beforerequest
         * Fires before a network request is made to retrieve a data object.
         * @param {Connection} conn This Connection object.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "beforerequest" : true,
        /**
         * @event requestcomplete
         * Fires before a network request is made to retrieve a data object.
         * @param {Connection} conn This Connection object.
         * @param {Object} response The XHR object containing the response data.
         * See http://www.w3.org/TR/XMLHttpRequest/ for details.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "requestcomplete" : true,
        /**
         * @event requestexception
         * Fires if an error HTTP status was returned from the server.
         * See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html for details of HTTP status codes.
         * @param {Connection} conn This Connection object.
         * @param {Object} response The XHR object containing the response data.
         * See http://www.w3.org/TR/XMLHttpRequest/ for details.
         * @param {Object} options The options config object passed to the {@link #request} method.
         */
        "requestexception" : true
    });
    Ext.data.Connection.superclass.constructor.call(this);
};

Ext.extend(Ext.data.Connection, Ext.util.Observable, {
    /**
     * @cfg {String} url (Optional) The default URL to be used for requests to the server.
     */
    /**
     * @cfg {Object} extraParams (Optional) An object containing properties which are used as
     * extra parameters to each request made by this object.
     */
    /**
     * @cfg {Object} defaultHeaders (Optional) An object containing request headers which are added
     *  to each request made by this object.
     */
    /**
     * @cfg {String} method (Optional) The default HTTP method to be used for requests.
     */
    /**
     * @cfg  {Number} timeout (Optional) The timeout in milliseconds to be used for requests. Defaults
     * to 30000.
     */
    timeout : 30000,

    /**
     * Sends an HTTP request to a remote server.
     * @param {Object} options An object which may contain the following properties:<ul>
     * <li>url {String} (Optional) The URL to which to send the request. Defaults to configured URL</li>
     * <li>params {Object/String/Function} (Optional) An object containing properties which are used as extra parameters to the
     * request, or a url encoded string and function to call to get either.</li>
     * <li>method {String} (Optional) The HTTP method to use for the request. Defaults to the configured method, or
     * if no method was configured, "GET" if no parameters are being sent, and "POST" if parameters are being sent.</li>
     * <li>callback {Function} (Optional) The function to be called upon receipt of the HTTP response.
     * The callback is passed the following parameters:<ul>
     * <li>options {Object} The parameter to the request call.</li>
     * <li>success {Boolean} True if the request succeeded.</li>
     * <li>response {Object} The XMLHttpRequest object containing the response data.</li>
     * </ul></li>
     * <li>success {Function} (Optional) The function to be called upon success of the request.
     * The callback is passed the following parameters:<ul>
     * <li>response {Object} The XMLHttpRequest object containing the response data.</li>
     * <li>options {Object} The parameter to the request call.</li>
     * </ul></li>
     * <li>failure {Function} (Optional) The function to be called upon failure of the request.
     * The callback is passed the following parameters:<ul>
     * <li>response {Object} The XMLHttpRequest object containing the response data.</li>
     * <li>options {Object} The parameter to the request call.</li>
     * </ul></li>
     * <li>scope {Object} (Optional) The scope in which to execute the callbacks: The "this" object
     * for the callback function. Defaults to the browser window.</li>
     * <li>form {Object/String} (Optional) A form object or id to pull parameters from.</li>
     * <li>isUpload {Boolean} (Optional) True if the form object is a file upload.</li>
     * <li>headers {Object} (Optional) Request headers to set for the request.</li>
     * </ul>
     * @return {Number} transactionId
     */
    request : function(o){
        if(this.fireEvent("beforerequest", this, o) !== false){
            var p = o.params;

            if(typeof p == "function"){
                p = p.call(o.scope||window, o);
            }
            if(typeof p == "object"){
                p = Ext.urlEncode(o.params);
            }
            if(this.extraParams){
                var extras = Ext.urlEncode(this.extraParams);
                p = p ? (p + '&' + extras) : extras;
            }

            var url = o.url || this.url;
            if(typeof url == 'function'){
                url = url.call(o.scope||window, o);
            }

            if(o.form){
                var form = Ext.getDom(o.form);
                url = url || form.action;

                var enctype = form.getAttribute("enctype");
                if(o.isUpload || (enctype && enctype.toLowerCase() == 'multipart/form-data')){
                    return this.doFormUpload(o, p, url);
                }
                var f = Ext.lib.Ajax.serializeForm(form);
                p = p ? (p + '&' + f) : f;


            }
            
            var hs = o.headers;
            if(this.defaultHeaders){
                hs = Ext.apply(hs || {}, this.defaultHeaders);
            }

            var cb = {
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
        		argument: {options: o},
        		timeout : this.timeout
            };

            var method = o.method||this.method||(p ? "POST" : "GET");

            if(typeof o.autoAbort == 'boolean'){ // options gets top priority
                if(o.autoAbort){
                    this.abort();
                }
            }else if(this.autoAbort !== false){
                this.abort();
            }

            if(method == 'GET' && p){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
                p = '';
            }
            this.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
            return this.transId;
        }else{
            Ext.callback(o.callback, o.scope, [o, null, null]);
            return null;
        }
    },

    /**
     * Determine whether this object has a request outstanding.
     * @param {Number} transactionId (Optional) defaults to the last transaction
     * @return {Boolean} True if there is an outstanding request.
     */
    isLoading : function(transId){
        if(transId){
            return Ext.lib.Ajax.isCallInProgress(transId);
        }else{
            return this.transId ? true : false;
        }
    },

    /**
     * Aborts any outstanding request.
     * @param {Number} transactionId (Optional) defaults to the last transaction
     */
    abort : function(transId){
        if(transId || this.isLoading()){
            Ext.lib.Ajax.abort(transId || this.transId);
        }
    },

    // private
    handleResponse : function(response){
        this.transId = false;
        var options = response.argument.options;
        this.fireEvent("requestcomplete", this, response, options);
        Ext.callback(options.success, options.scope, [response, options]);
        Ext.callback(options.callback, options.scope, [options, true, response]);
    },

    // private
    handleFailure : function(response, e){
        this.transId = false;
        var options = response.argument.options;
        this.fireEvent("requestexception", this, response, options, e);
        Ext.callback(options.failure, options.scope, [response, options]);
        Ext.callback(options.callback, options.scope, [options, false, response]);
    },

    // private
    doFormUpload : function(o, ps, url){
        var id = Ext.id();
        var frame = document.createElement('iframe');
        frame.id = id;
        frame.name = id;
        frame.className = 'x-hidden';
        if(Ext.isIE){
            frame.src = Ext.SSL_SECURE_URL;
        }
        document.body.appendChild(frame);


        var form = Ext.getDom(o.form);
        form.target = id;
        form.method = 'POST';
        form.enctype = form.encoding = 'multipart/form-data';
        if(url){
            form.action = url;
        }

        var hiddens, hd;
        if(ps){ // add dynamic params
            hiddens = [];
            ps = Ext.urlDecode(ps, false);
            for(var k in ps){
                if(ps.hasOwnProperty(k)){
                    hd = document.createElement('input');
                    hd.type = 'hidden';
                    hd.name = k;
                    hd.value = ps[k];
                    form.appendChild(hd);
                    hiddens.push(hd);
                }
            }
        }

        function cb(){
            var r = {  // bogus response object
                responseText : '',
                responseXML : null
            };

            try { //
                var doc;
                if(Ext.isIE){
                    doc = frame.contentWindow.document;
                }else {
                    doc = (frame.contentDocument || window.frames[id].document);
                }
                if(doc && doc.body){
                    r.responseText = doc.body.innerHTML;
                }
                if(doc && doc.XMLDocument){
                    r.responseXML = doc.XMLDocument;
                }else {
                    r.responseXML = doc;
                }
            }
            catch(e) {
                // ignore
            }

            Ext.EventManager.removeListener(frame, 'load', cb, this);

            this.fireEvent("requestcomplete", this, r, o);
            Ext.callback(o.success, o.scope, [r, o]);
            Ext.callback(o.callback, o.scope, [o, true, r]);

            setTimeout(function(){document.body.removeChild(frame);}, 100);
        }

        Ext.EventManager.on(frame, 'load', cb, this);
        form.submit();

        if(hiddens){ // remove dynamic params
            for(var i = 0, len = hiddens.length; i < len; i++){
                form.removeChild(hiddens[i]);
            }
        }
    }
});

/**
 * @class Ext.Ajax
 * @extends Ext.data.Connection
 * Global Ajax request class.
 * @singleton
 */
Ext.Ajax = new Ext.data.Connection({
    autoAbort : false,
    
    /**
     * Serialize the passed form into a url encoded string
     * return {String}
     */
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});
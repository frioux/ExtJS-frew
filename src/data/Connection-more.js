/**
 * @class Ext.data.Connection
 */
Ext.apply(Ext.data.Connection, 
function(){
	var BEFOREREQUEST = "beforerequest",
		REQUESTCOMPLETE = "requestcomplete",
		REQUESTEXCEPTION = "requestexception",
		LOAD = 'load',
		POST = 'POST',
		GET = 'GET',
		WINDOW = window;
		
	// private
    function doFormUpload(o, ps, url){
        var id = Ext.id(),
        	doc = document,
        	frame = doc.createElement('iframe'),
        	form = Ext.getDom(o.form),
        	hiddens = [],
        	hd;
        	
        frame.id = frame.name = id;         
        frame.className = 'x-hidden';        
        frame.src = Ext.SSL_SECURE_URL; // for IE        
        doc.body.appendChild(frame);

        if(Ext.isIE){
        	doc.frames[id].name = id;
        }
        
        form.target = id;
        form.method = POST;
        form.enctype = form.encoding = 'multipart/form-data';        
        form.action = url || "";
        
        // add dynamic params            
        ps = Ext.urlDecode(ps, false);
        for(var k in ps){
            if(ps.hasOwnProperty(k)){
                hd = doc.createElement('input');
                hd.type = 'hidden';                    
                hd.value = ps[hd.name = k];
                form.appendChild(hd);
                hiddens.push(hd);
            }
        }        

        function cb(){
            var me = this,
            	// bogus response object
            	r = {responseText : '',
	                 responseXML : null,
	                 argument : o.argument},
            	doc,
            	firstChild;

            try { 
                doc = frame.contentWindow.document || frame.contentDocument || WINDOW.frames[id].document;
                if (doc) {
	            	if (doc.body) {
		            	if (/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)) { // json response wrapped in textarea	                    
                        	r.responseText = firstChild.value;
	                    } else {
	                        r.responseText = doc.body.innerHTML;
	                    }
	            	} else {
		            	responseXML = doc.XMLDocument || doc;
		           	}
                }
            }
            catch(e) {}

            Ext.EventManager.removeListener(frame, LOAD, cb, me);

            me.fireEvent(REQUESTCOMPLETE, me, r, o);

            Ext.callback(o.success, o.scope, [r, o]);
            Ext.callback(o.callback, o.scope, [o, true, r]);

            if(!me.debugUploads){
                setTimeout(function(){Ext.removeNode(frame);}, 100);
            }
        }

        Ext.EventManager.on(frame, LOAD, cb, this);
        form.submit();
        
        Ext.each(hiddens, function(h) {
	        Ext.removeNode(h);
        });
    }
	
	return {
		/**
	     * <p>Sends an HTTP request to a remote server.</p>
	     * <p><b>Important:</b> Ajax server requests are asynchronous, and this call will
	     * return before the response has been received. Process any returned data
	     * in a callback function.</p>
	     * <p>To execute a callback function in the correct scope, use the <tt>scope</tt> option.</p>
	     * @param {Object} options An object which may contain the following properties:<ul>
	     * <li><b>url</b> : String/Function (Optional)<div class="sub-desc">The URL to
	     * which to send the request, or a function to call which returns a URL string. The scope of the
	     * function is specified by the <tt>scope</tt> option. Defaults to configured URL.</div></li>
	     * <li><b>params</b> : Object/String/Function (Optional)<div class="sub-desc">
	     * An object containing properties which are used as parameters to the
	     * request, a url encoded string or a function to call to get either. The scope of the function
	     * is specified by the <tt>scope</tt> option.</div></li>
	     * <li><b>method</b> : String (Optional)<div class="sub-desc">The HTTP method to use
	     * for the request. Defaults to the configured method, or if no method was configured,
	     * "GET" if no parameters are being sent, and "POST" if parameters are being sent.  Note that
	     * the method name is case-sensitive and should be all caps.</div></li>
	     * <li><b>callback</b> : Function (Optional)<div class="sub-desc">The
	     * function to be called upon receipt of the HTTP response. The callback is
	     * called regardless of success or failure and is passed the following
	     * parameters:<ul>
	     * <li><b>options</b> : Object<div class="sub-desc">The parameter to the request call.</div></li>
	     * <li><b>success</b> : Boolean<div class="sub-desc">True if the request succeeded.</div></li>
	     * <li><b>response</b> : Object<div class="sub-desc">The XMLHttpRequest object containing the response data. 
	     * See <a href="http://www.w3.org/TR/XMLHttpRequest/">http://www.w3.org/TR/XMLHttpRequest/</a> for details about 
	     * accessing elements of the response.</div></li>
	     * </ul></div></li>
	     * <li><a id="request-option-success"></a><b>success</b> : Function (Optional)<div class="sub-desc">The function
	     * to be called upon success of the request. The callback is passed the following
	     * parameters:<ul>
	     * <li><b>response</b> : Object<div class="sub-desc">The XMLHttpRequest object containing the response data.</div></li>
	     * <li><b>options</b> : Object<div class="sub-desc">The parameter to the request call.</div></li>
	     * </ul></div></li>
	     * <li><b>failure</b> : Function (Optional)<div class="sub-desc">The function
	     * to be called upon failure of the request. The callback is passed the
	     * following parameters:<ul>
	     * <li><b>response</b> : Object<div class="sub-desc">The XMLHttpRequest object containing the response data.</div></li>
	     * <li><b>options</b> : Object<div class="sub-desc">The parameter to the request call.</div></li>
	     * </ul></div></li>
	     * <li><b>scope</b> : Object (Optional)<div class="sub-desc">The scope in
	     * which to execute the callbacks: The "this" object for the callback function. If the <tt>url</tt>, or <tt>params</tt> options were
	     * specified as functions from which to draw values, then this also serves as the scope for those function calls.
	     * Defaults to the browser window.</div></li>
	     * <li><b>form</b> : Element/HTMLElement/String (Optional)<div class="sub-desc">The <tt>&lt;form&gt;</tt>
	     * Element or the id of the <tt>&lt;form&gt;</tt> to pull parameters from.</div></li>
	     * <li><a id="request-option-isUpload"></a><b>isUpload</b> : Boolean (Optional)<div class="sub-desc"><b>Only meaningful when used 
	     * with the <tt>form</tt> option</b>.
	     * <p>True if the form object is a file upload (will be set automatically if the form was
	     * configured with <b><tt>enctype</tt></b> "multipart/form-data").</p>
	     * <p>File uploads are not performed using normal "Ajax" techniques, that is they are <b>not</b>
	     * performed using XMLHttpRequests. Instead the form is submitted in the standard manner with the
	     * DOM <tt>&lt;form></tt> element temporarily modified to have its
	     * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
	     * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
	     * but removed after the return data has been gathered.</p>
	     * <p>The server response is parsed by the browser to create the document for the IFRAME. If the
	     * server is using JSON to send the return object, then the
	     * <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.17">Content-Type</a> header
	     * must be set to "text/html" in order to tell the browser to insert the text unchanged into the document body.</p>
	     * <p>The response text is retrieved from the document, and a fake XMLHttpRequest object
	     * is created containing a <tt>responseText</tt> property in order to conform to the
	     * requirements of event handlers and callbacks.</p>
	     * <p>Be aware that file upload packets are sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form</a>
	     * and some server technologies (notably JEE) may require some custom processing in order to
	     * retrieve parameter names and parameter values from the packet content.</p>
	     * </div></li>
	     * <li><b>headers</b> : Object (Optional)<div class="sub-desc">Request
	     * headers to set for the request.</div></li>
	     * <li><b>xmlData</b> : Object (Optional)<div class="sub-desc">XML document
	     * to use for the post. Note: This will be used instead of params for the post
	     * data. Any params will be appended to the URL.</div></li>
	     * <li><b>jsonData</b> : Object/String (Optional)<div class="sub-desc">JSON
	     * data to use as the post. Note: This will be used instead of params for the post
	     * data. Any params will be appended to the URL.</div></li>
	     * <li><b>disableCaching</b> : Boolean (Optional)<div class="sub-desc">True
	     * to add a unique cache-buster param to GET requests.</div></li>
	     * </ul></p>
	     * <p>The options object may also contain any other property which might be needed to perform
	     * postprocessing in a callback because it is passed to callback functions.</p>
	     * @return {Number} transactionId The id of the server transaction. This may be used
	     * to cancel the request.
	     */
	    request : function(o){
		    var me = this;
	        if(me.fireEvent(BEFOREREQUEST, me, o)){
	            var p = o.params,
	            	url = o.url || me.url,            	
	            	method,
	            	cb = {success: handleResponse,
		                  failure: handleFailure,
		                  scope: me,
		                  argument: {options: o},
		                  timeout : o.timeout || me.timeout
		            },
		            form,		            
		            serForm;		            
		          
		             
	            if (Ext.isFunction(p)) {
	                p = p.call(o.scope||WINDOW, o);
	            }
	            	               	                    
	            p = Ext.urlEncode(me.extraParams, Ext.urlEncode(p));
	
	            if (Ext.isFunction(url)) {
	                url = url.call(o.scope || WINDOW, o);
	            }
	
	            if(form = Ext.getDom(o.form)){
	                url = url || form.action;
	
	                if(o.isUpload || /multipart\/form-data/i.test(form.getAttribute("enctype"))) { 
	                    return doFormUpload.call(me, o, p, url);
	                }
	                serForm = Ext.lib.Ajax.serializeForm(form);	                
	                p = p ? (p + '&' + serForm) : serForm;
	            }
	            
	            method = o.method || me.method || ((p || o.xmlData || o.jsonData) ? POST : GET);
	            
	            if(method == GET && (me.disableCaching && o.disableCaching !== false) || o.disableCaching === true){
	                var dcp = o.disableCachingParam || me.disableCachingParam;
	                url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
	            }
	            
	            o.headers = Ext.apply(o.headers || {}, me.defaultHeaders || {});
	            
				if((Ext.isEmpty(o.autoAbort) && me.autoAbort) || o.autoAbort) {
					me.abort();
				}
				 
	            if((method == GET || o.xmlData || o.jsonData) && p){
	                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
	                p = '';
	            }
	            
	            return me.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
	        }else{	            
	            return Ext.callback(o.callback, o.scope, [o,,]);
	        }
	    }
	}
}());


/**
 * @class Ext.Ajax
 * @extends Ext.data.Connection
 * Global Ajax request class.  Provides a simple way to make Ajax requests with maximum flexibility.  Example usage:
 * <pre><code>
// Basic request
Ext.Ajax.request({
   url: 'foo.php',
   success: someFn,
   failure: otherFn,
   headers: {
       'my-header': 'foo'
   },
   params: { foo: 'bar' }
});

// Simple ajax form submission
Ext.Ajax.request({
    form: 'some-form',
    params: 'foo=bar'
});

// Default headers to pass in every request
Ext.Ajax.defaultHeaders = {
    'Powered-By': 'Ext'
};

// Global Ajax events can be handled on every request!
Ext.Ajax.on('beforerequest', this.showSpinner, this);
</code></pre>
 * @singleton
 */
Ext.Ajax = new Ext.data.Connection({
    /**
     * @cfg {String} url @hide
     */
    /**
     * @cfg {Object} extraParams @hide
     */
    /**
     * @cfg {Object} defaultHeaders @hide
     */
    /**
     * @cfg {String} method (Optional) @hide
     */
    /**
     * @cfg {Number} timeout (Optional) @hide
     */
    /**
     * @cfg {Boolean} autoAbort (Optional) @hide
     */

    /**
     * @cfg {Boolean} disableCaching (Optional) @hide
     */

    /**
     * @property  disableCaching
     * True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
    /**
     * @property  url
     * The default URL to be used for requests to the server. (defaults to undefined)
     * @type String
     */
    /**
     * @property  extraParams
     * An object containing properties which are used as
     * extra parameters to each request made by this object. (defaults to undefined)
     * @type Object
     */
    /**
     * @property  defaultHeaders
     * An object containing request headers which are added to each request made by this object. (defaults to undefined)
     * @type Object
     */
    /**
     * @property  method
     * The default HTTP method to be used for requests. Note that this is case-sensitive and should be all caps (defaults
     * to undefined; if not set but parms are present will use "POST," otherwise "GET.")
     * @type String
     */
    /**
     * @property  timeout
     * The timeout in milliseconds to be used for requests. (defaults to 30000)
     * @type Number
     */

    /**
     * @property  autoAbort
     * Whether a new request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
    autoAbort : false,

    /**
     * Serialize the passed form into a url encoded string
     * @param {String/HTMLElement} form
     * @return {String}
     */
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});
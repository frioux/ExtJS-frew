Ext.apply(Ext.Updater.prototype, function() {
	var BEFOREUPDATE = "beforeupdate",
		UPDATE = "update",
		FAILURE = "failure";
		
	// private
    function processSuccess(response){	    
	    var me = this;
        me.transaction = null;
        if (response.argument.form && response.argument.reset) {
            try { // put in try/catch since some older FF releases had problems with this
                response.argument.form.reset();
            } catch(e){}
        }
        if (me.loadScripts) {
            me.renderer.render(me.el, response, me,
               updateComplete.createDelegate(me, [response]));
        } else {
            me.renderer.render(me.el, response, me);
            updateComplete(response);
        }
    }
    
    // private
    function updateComplete(response, type, success){
        this.fireEvent(type || UPDATE, this.el, response);
        if(Ext.isFunction(response.argument.callback)){
            response.argument.callback.call(response.argument.scope, this.el, Ext.isEmpty(success) ? true : false, response, response.argument.options);
        }
    }

    // private
    function processFailure(response){	            
        updateComplete.call(this, response, FAILURE, !!(this.transaction = null));
    }
     
	return {
		/**
	     * Performs an <b>asynchronous</b> request, updating this element with the response.
	     * If params are specified it uses POST, otherwise it uses GET.<br><br>
	     * <b>Note:</b> Due to the asynchronous nature of remote server requests, the Element
	     * will not have been fully updated when the function returns. To post-process the returned
	     * data, use the callback option, or an <b><tt>update</tt></b> event handler.
	     * @param {Object} options A config object containing any of the following options:<ul>
	     * <li>url : <b>String/Function</b><p class="sub-desc">The URL to request or a function which
	     * <i>returns</i> the URL (defaults to the value of {@link Ext.Ajax#url} if not specified).</p></li>
	     * <li>method : <b>String</b><p class="sub-desc">The HTTP method to
	     * use. Defaults to POST if the <tt>params</tt> argument is present, otherwise GET.</p></li>
	     * <li>params : <b>String/Object/Function</b><p class="sub-desc">The
	     * parameters to pass to the server (defaults to none). These may be specified as a url-encoded
	     * string, or as an object containing properties which represent parameters,
	     * or as a function, which returns such an object.</p></li>
	     * <li>scripts : <b>Boolean</b><p class="sub-desc">If <tt>true</tt>
	     * any &lt;script&gt; tags embedded in the response text will be extracted
	     * and executed (defaults to {@link Ext.Updater.defaults#loadScripts}). If this option is specified,
	     * the callback will be called <i>after</i> the execution of the scripts.</p></li>
	     * <li>callback : <b>Function</b><p class="sub-desc">A function to
	     * be called when the response from the server arrives. The following
	     * parameters are passed:<ul>
	     * <li><b>el</b> : Ext.Element<p class="sub-desc">The Element being updated.</p></li>
	     * <li><b>success</b> : Boolean<p class="sub-desc">True for success, false for failure.</p></li>
	     * <li><b>response</b> : XMLHttpRequest<p class="sub-desc">The XMLHttpRequest which processed the update.</p></li>
	     * <li><b>options</b> : Object<p class="sub-desc">The config object passed to the update call.</p></li></ul>
	     * </p></li>
	     * <li>scope : <b>Object</b><p class="sub-desc">The scope in which
	     * to execute the callback (The callback's <tt>this</tt> reference.) If the
	     * <tt>params</tt> argument is a function, this scope is used for that function also.</p></li>
	     * <li>discardUrl : <b>Boolean</b><p class="sub-desc">By default, the URL of this request becomes
	     * the default URL for this Updater object, and will be subsequently used in {@link #refresh}
	     * calls.  To bypass this behavior, pass <tt>discardUrl:true</tt> (defaults to false).</p></li>
	     * <li>timeout : <b>Number</b><p class="sub-desc">The number of seconds to wait for a response before
	     * timing out (defaults to {@link Ext.Updater.defaults#timeout}).</p></li>
	     * <li>text : <b>String</b><p class="sub-desc">The text to use as the innerHTML of the
	     * {@link Ext.Updater.defaults#indicatorText} div (defaults to 'Loading...').  To replace the entire div, not
	     * just the text, override {@link Ext.Updater.defaults#indicatorText} directly.</p></li>
	     * <li>nocache : <b>Boolean</b><p class="sub-desc">Only needed for GET
	     * requests, this option causes an extra, auto-generated parameter to be appended to the request
	     * to defeat caching (defaults to {@link Ext.Updater.defaults#disableCaching}).</p></li></ul>
	     * <p>
	     * For example:
	<pre><code>
	um.update({
	    url: "your-url.php",
	    params: {param1: "foo", param2: "bar"}, // or a URL encoded string
	    callback: yourFunction,
	    scope: yourObject, //(optional scope)
	    discardUrl: true,
	    nocache: true,
	    text: "Loading...",
	    timeout: 60,
	    scripts: false // Save time by avoiding RegExp execution.
	});
	</code></pre>
	     */
	    update : function(url, params, callback, discardUrl){
		    var me = this,
		    	cfg, 
		    	callerScope;
		    	
	        if(me.fireEvent(BEFOREUPDATE, me.el, url, params) !== false){	            
	            if(Ext.isObject(url)){ // must be config object
	                cfg = url;
	                url = cfg.url;
	                params = params || cfg.params;
	                callback = callback || cfg.callback;
	                discardUrl = discardUrl || cfg.discardUrl;
	                callerScope = cfg.scope;	                
	                if(!Ext.isEmpty(cfg.nocache)){me.disableCaching = cfg.nocache;};
	                if(!Ext.isEmpty(cfg.text)){me.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
	                if(!Ext.isEmpty(cfg.scripts)){me.loadScripts = cfg.scripts;};
	                if(!Ext.isEmpty(cfg.timeout)){me.timeout = cfg.timeout;};
	            }
	            me.showLoading();
	
	            if(!discardUrl){
	                me.defaultUrl = url;
	            }
	            if(Ext.isFunction(url)){
	                url = url.call(me);
	            }
	
	            var o = Ext.apply({}, {
	                url : url,
	                params: (Ext.isFunction(params) && callerScope) ? params.createDelegate(callerScope) : params,
	                success: processSuccess,
	                failure: processFailure,
	                scope: me,
	                callback: undefined,
	                timeout: (me.timeout*1000),
	                disableCaching: me.disableCaching,
	                argument: {
	                    "options": cfg,
	                    "url": url,
	                    "form": null,
	                    "callback": callback,
	                    "scope": callerScope || window,
	                    "params": params
	                }
	            }, cfg);
	
	            me.transaction = Ext.Ajax.request(o);
	        }
	    },	    
	    
		/**
	     * <p>Performs an async form post, updating this element with the response. If the form has the attribute
	     * enctype="<a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form-data</a>", it assumes it's a file upload.
	     * Uses this.sslBlankUrl for SSL file uploads to prevent IE security warning.</p>
	     * <p>File uploads are not performed using normal "Ajax" techniques, that is they are <b>not</b>
	     * performed using XMLHttpRequests. Instead the form is submitted in the standard manner with the
	     * DOM <tt>&lt;form></tt> element temporarily modified to have its
	     * <a href="http://www.w3.org/TR/REC-html40/present/frames.html#adef-target">target</a> set to refer
	     * to a dynamically generated, hidden <tt>&lt;iframe></tt> which is inserted into the document
	     * but removed after the return data has been gathered.</p>
	     * <p>Be aware that file upload packets, sent with the content type <a href="http://www.faqs.org/rfcs/rfc2388.html">multipart/form-data</a>
	     * and some server technologies (notably JEE) may require some custom processing in order to
	     * retrieve parameter names and parameter values from the packet content.</p>
	     * @param {String/HTMLElement} form The form Id or form element
	     * @param {String} url (optional) The url to pass the form to. If omitted the action attribute on the form will be used.
	     * @param {Boolean} reset (optional) Whether to try to reset the form after the update
	     * @param {Function} callback (optional) Callback when transaction is complete. The following
	     * parameters are passed:<ul>
	     * <li><b>el</b> : Ext.Element<p class="sub-desc">The Element being updated.</p></li>
	     * <li><b>success</b> : Boolean<p class="sub-desc">True for success, false for failure.</p></li>
	     * <li><b>response</b> : XMLHttpRequest<p class="sub-desc">The XMLHttpRequest which processed the update.</p></li></ul>
	     */
	    formUpdate : function(form, url, reset, callback){
		    var me = this;
	        if(me.fireEvent(BEFOREUPDATE, me.el, form, url) !== false){
	            if(Ext.isFunction(url)){
	                url = url.call(me);
	            }
	            form = Ext.getDom(form)
	            me.transaction = Ext.Ajax.request({
	                form: form,
	                url:url,
	                success: processSuccess,
	                failure: processFailure,
	                scope: me,
	                timeout: (me.timeout*1000),
	                argument: {
	                    "url": url,
	                    "form": form,
	                    "callback": callback,
	                    "reset": reset
	                }
	            });
	            me.showLoading.defer(1, me);
	        }
	    },
	
		/**
	     * Sets the content renderer for this Updater. See {@link Ext.Updater.BasicRenderer#render} for more details.
	     * @param {Object} renderer The object implementing the render() method
	     */
	    setRenderer : function(renderer){
	        this.renderer = renderer;
	    },
	
	    /**
	     * Returns the current content renderer for this Updater. See {@link Ext.Updater.BasicRenderer#render} for more details.
	     * @return {Object}
	     */
	    getRenderer : function(){
	       return this.renderer;
	    },
	
	    /**
	     * Sets the default URL used for updates.
	     * @param {String/Function} defaultUrl The url or a function to call to get the url
	     */
	    setDefaultUrl : function(defaultUrl){
	        this.defaultUrl = defaultUrl;
	    }
	}
}());

/**
 * @class Ext.Updater.defaults
 * The defaults collection enables customizing the default properties of Updater
 */
Ext.apply(Ext.Updater.defaults, {   
     /**
     * True to process scripts by default (defaults to false).
     * @type Boolean
     */
    loadScripts : false,
    /**
    * Blank page URL to use with SSL file uploads (defaults to {@link Ext#SSL_SECURE_URL} if set, or "javascript:false").
    * @type String
    */
    sslBlankUrl : (Ext.SSL_SECURE_URL || "javascript:false")    
});


/**
 * Static convenience method. <b>This method is deprecated in favor of el.load({url:'foo.php', ...})</b>.
 * Usage:
 * <pre><code>Ext.Updater.updateElement("my-div", "stuff.php");</code></pre>
 * @param {Mixed} el The element to update
 * @param {String} url The url
 * @param {String/Object} params (optional) Url encoded param string or an object of name/value pairs
 * @param {Object} options (optional) A config object with any of the Updater properties you want to set - for
 * example: {disableCaching:true, indicatorText: "Loading data..."}
 * @static
 * @deprecated
 * @member Ext.Updater
 */
Ext.Updater.updateElement = function(el, url, params, options){
    var um = Ext.get(el).getUpdater();
    Ext.apply(um, options);
    um.update(url, params, options ? options.callback : null);
};


Ext.Updater.BasicRenderer.prototype = {
    /**
     * This is called when the transaction is completed and it's time to update the element - The BasicRenderer
     * updates the elements innerHTML with the responseText - To perform a custom render (i.e. XML or JSON processing),
     * create an object with a "render(el, response)" method and pass it to setRenderer on the Updater.
     * @param {Ext.Element} el The element being rendered
     * @param {Object} response The XMLHttpRequest object
     * @param {Updater} updateManager The calling update manager
     * @param {Function} callback A callback that will need to be called if loadScripts is true on the Updater
     */
     render : function(el, response, updateManager, callback){	     
        el.update(response.responseText, updateManager.loadScripts, callback);
    }
};
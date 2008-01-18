/**
 * @class Ext.QuickTips
 * <p>Provides attractive and customizable tooltips for any element.  Quicktips can be configured via tag attributes
 * directly in markup, or by registering quick tips programmatically via the {@link #register} method.</p>
 * <p>Although all of the available config values are listed on the QuickTips singleton API, some are only
 * valid on the singleton while others are only valid for specific quick tip target elements.  Here is the summary
 * of how the configs can be used:</p>
 * <p><b>QuickTips singleton configs (all are optional)</b></p>
 * <ul><li>animate</li>
 * <li>autoDismiss</li>
 * <li>autoDismissDelay</li>
 * <li>autoHide</li>
 * <li>hideDelay</li>
 * <li>hideOnClick</li>
 * <li>interceptTitles</li>
 * <li>maxWidth</li>
 * <li>minWidth</li>
 * <li>showDelay</li>
 * <li>trackMouse</li></ul>
 * <p><b>Target element configs (optional unless otherwise noted)</b></p>
 * <ul><li>autoHide: When set to false at this level, a clickable close tool button will display in the quick tip.</li>
 * <li>cls</li>
 * <li>target (required)</li>
 * <li>text (required)</li>
 * <li>title</li>
 * <li>width</li></ul>
 * <p>Here is an example showing how some of these config options could be used:</p>
 * <pre><code>
var q = Ext.QuickTips;
// Init the singleton.  Any tag-based quick tips will start working.
q.init();

// Singleton properties shared by all quick tips:
q.animate = true;
q.maxWidth = 200;
q.minWidth = 100;
q.showDelay = 50;
q.trackMouse = true;

// Manually register a quick tip for a specific element
q.register({
    target: 'my-div',
    title: 'My Tooltip',
    text: 'This tooltip was added in code',
    width: 100
});
</code></pre>
 * <p>To register a quick tip in markup, you simply add one or more of the valid QuickTip attributes prefixed with
 * the <b>ext:</b> namespace.  The HTML element itself is automatically set as the quick tip target. Here is the summary
 * of supported attributes (optional unless otherwise noted):</p>
 * <ul><li><b>hide</b>: Specifying "user" is equivalent to setting autoHide = false for target elements above and a close
 * button will be added to the quick tip.  Any other value will be the same as autoHide = true.</li>
 * <li><b>qclass</b>: A CSS class to be applied to the quick tip (equivalent to the 'cls' target element config).</li>
 * <li><b>qtip (required)</b>: The quick tip text (equivalent to the 'text' target element config).</li>
 * <li><b>qtitle</b>: The quick tip title (equivalent to the 'title' target element config).</li>
 * <li><b>width</b>: The quick tip width (equivalent to the 'width' target element config).</li></ul>
 * <p>Here is an example of configuring an HTML element to display a tooltip from markup:</p>
 * <pre><code>
// Add a quick tip to an HTML button
&lt;input type="button" value="OK" ext:qtitle="OK Button"
     ext:qtip="This is a quick tip from markup!">&lt;/input>
</code></pre>
 * @singleton
 */
Ext.QuickTips = function(){
    var el, tipBody, tipBodyText, tipTitle, tm, cfg, close, tagEls = {}, esc, removeCls = null, bdLeft, bdRight;
    var ce, bd, xy, dd;
    var visible = false, disabled = true, inited = false;
    var showProc = 1, hideProc = 1, dismissProc = 1, locks = [];
    
    var onOver = function(e){
        if(disabled){
            return;
        }
        var t = e.getTarget();
        if(!t || t.nodeType !== 1 || t == document || t == document.body){
            return;
        }
        if(ce && t == ce.el){
            clearTimeout(hideProc);
            return;
        }
        if(t && tagEls[t.id]){
            tagEls[t.id].el = t;
            showProc = show.defer(tm.showDelay, tm, [tagEls[t.id]]);
            return;
        }
        var ttp, et = Ext.fly(t);
        var ns = cfg.namespace;
        if(tm.interceptTitles && t.title){
            ttp = t.title;
            t.qtip = ttp;
            t.removeAttribute("title");
            e.preventDefault();
        }else{
            ttp = t.qtip || et.getAttributeNS(ns, cfg.attribute);
        }
        if(ttp){
            showProc = show.defer(tm.showDelay, tm, [{
                el: t, 
                text: ttp, 
                width: et.getAttributeNS(ns, cfg.width),
                autoHide: et.getAttributeNS(ns, cfg.hide) != "user",
                title: et.getAttributeNS(ns, cfg.title),
           	    cls: et.getAttributeNS(ns, cfg.cls)
            }]);
        }
    };
    
    var onOut = function(e){
        clearTimeout(showProc);
        var t = e.getTarget();
        if(t && ce && ce.el == t && (tm.autoHide && ce.autoHide !== false)){
            hideProc = setTimeout(hide, tm.hideDelay);
        }
    };
    
    var onMove = function(e){
        if(disabled){
            return;
        }
        xy = e.getXY();
        xy[1] += 18;
        if(tm.trackMouse && ce){
            el.setXY(xy);
        }
    };
    
    var onDown = function(e){
        clearTimeout(showProc);
        clearTimeout(hideProc);
        if(!e.within(el)){
            if(tm.hideOnClick){
                hide();
                tm.disable();
                tm.enable.defer(100, tm);
            }
        }
    };
    
    var getPad = function(){
        return bdLeft.getPadding('l')+bdRight.getPadding('r');
    };

    var show = function(o){
        if(disabled){
            return;
        }
        clearTimeout(dismissProc);
        ce = o;
        if(removeCls){ // in case manually hidden
            el.removeClass(removeCls);
            removeCls = null;
        }
        if(ce.cls){
            el.addClass(ce.cls);
            removeCls = ce.cls;
        }
        if(ce.title){
            tipTitle.update(ce.title);
            tipTitle.show();
        }else{
            tipTitle.update('');
            tipTitle.hide();
        }
        el.dom.style.width  = tm.maxWidth+'px';
        //tipBody.dom.style.width = '';
        tipBodyText.update(o.text);
        var p = getPad(), w = ce.width;
        if(!w){
            var td = tipBodyText.dom;
            var aw = Math.max(td.offsetWidth, td.clientWidth, td.scrollWidth);
            if(aw > tm.maxWidth){
                w = tm.maxWidth;
            }else if(aw < tm.minWidth){
                w = tm.minWidth;
            }else{
                w = aw;
            }
        }
        //tipBody.setWidth(w);
        el.setWidth(parseInt(w, 10) + p);
        if(ce.autoHide === false){
            close.setDisplayed(true);
            if(dd){
                dd.unlock();
            }
        }else{
            close.setDisplayed(false);
            if(dd){
                dd.lock();
            }
        }
        if(xy){
            el.avoidY = xy[1]-18;
            el.setXY(xy);
        }
        if(tm.animate){
            el.setOpacity(.1);
            el.setStyle("visibility", "visible");
            el.fadeIn({callback: afterShow});
        }else{
            afterShow();
        }
    };
    
    var afterShow = function(){
        if(ce){
            el.show();
            esc.enable();
            if(tm.autoDismiss && ce.autoHide !== false){
                dismissProc = setTimeout(hide, tm.autoDismissDelay);
            }
        }
    };
    
    var hide = function(noanim){
        clearTimeout(dismissProc);
        clearTimeout(hideProc);
        ce = null;
        if(el.isVisible()){
            esc.disable();
            if(noanim !== true && tm.animate){
                el.fadeOut({callback: afterHide});
            }else{
                afterHide();
            } 
        }
    };
    
    var afterHide = function(){
        el.hide();
        if(removeCls){
            el.removeClass(removeCls);
            removeCls = null;
        }
    };
    
    return {
        /**
        * @cfg {Number} minWidth
        * The minimum width of the quick tip (defaults to 40)
        */
       minWidth : 40,
        /**
        * @cfg {Number} maxWidth
        * The maximum width of the quick tip (defaults to 300). The maximum supported value is 500.
        */
       maxWidth : 300,
        /**
        * @cfg {Boolean} interceptTitles
        * True to automatically use the element's DOM title value if available (defaults to false)
        */
       interceptTitles : false,
        /**
        * @cfg {Boolean} trackMouse
        * True to have the quick tip follow the mouse as it moves over the target element (defaults to false)
        */
       trackMouse : false,
        /**
        * @cfg {Boolean} hideOnClick
        * True to hide the quick tip if the user clicks anywhere in the document (defaults to true)
        */
       hideOnClick : true,
        /**
        * @cfg {Number} showDelay
        * Delay in milliseconds before the quick tip displays after the mouse enters the target element (defaults to 500)
        */
       showDelay : 500,
        /**
        * @cfg {Number} hideDelay
        * Delay in milliseconds before the quick tip hides when autoHide = true (defaults to 200)
        */
       hideDelay : 200,
        /**
        * @cfg {Boolean} autoHide
        * True to automatically hide the quick tip after the mouse exits the target element (defaults to true).
        * Used in conjunction with hideDelay.
        */
       autoHide : true,
        /**
        * @cfg {Boolean} autoDismiss
        * True to automatically hide the quick tip after a set period of time, regardless of the user's actions
        * (defaults to true).  Used in conjunction with autoDismissDelay.  When set to false at the target element
        * level (as opposed to at the singleton level), a clickable close tool button will display in the quick tip
        * for that target element.
        */
       autoDismiss : true,
        /**
        * @cfg {Number} autoDismissDelay
        * Delay in milliseconds before the quick tip hides when autoDismiss = true (defaults to 5000)
        */
       autoDismissDelay : 5000,
       /**
        * @cfg {Boolean} animate
        * True to turn on fade animation. Defaults to false (ClearType/scrollbar flicker issues in IE7).
        */
       animate : false,

       /**
        * @cfg {String} title
        * Title text to display (defaults to '').  This can be any valid HTML markup.
        */
       /**
        * @cfg {String} text
        * Body text to display (defaults to '').  This can be any valid HTML markup.
        */
       /**
        * @cfg {String} cls
        * A CSS class to apply to the base quick tip element (defaults to '').
        */
       /**
        * @cfg {Number} width
        * Width in pixels of the quick tip (defaults to auto).  Width will be ignored if it exceeds the bounds of
        * minWidth or maxWidth.
        */

    /**
     * Initialize and enable QuickTips for first use.  This should be called once before the first attempt to access
     * or display QuickTips in a page.
     */
       init : function(){
          tm = Ext.QuickTips;
          cfg = tm.tagConfig;
          if(!inited){
              if(!Ext.isReady){ // allow calling of init() before onReady
                  Ext.onReady(Ext.QuickTips.init, Ext.QuickTips);
                  return;
              }
              el = new Ext.Layer({cls:"x-tip", shadow:"drop", shim: true, constrain:true, shadowOffset:4});
              el.fxDefaults = {stopFx: true};
              // maximum custom styling
              el.update('<div class="x-tip-top-left"><div class="x-tip-top-right"><div class="x-tip-top"></div></div></div><div class="x-tip-bd-left"><div class="x-tip-bd-right"><div class="x-tip-bd"><div class="x-tip-close"></div><h3></h3><div class="x-tip-bd-inner"></div><div class="x-clear"></div></div></div></div><div class="x-tip-ft-left"><div class="x-tip-ft-right"><div class="x-tip-ft"></div></div></div>');
              tipTitle = el.child('h3');
              tipTitle.enableDisplayMode("block");
              tipBody = el.child('div.x-tip-bd');
              tipBodyText = el.child('div.x-tip-bd-inner');
              bdLeft = el.child('div.x-tip-bd-left');
              bdRight = el.child('div.x-tip-bd-right');
              close = el.child('div.x-tip-close');
              close.enableDisplayMode("block");
              close.on("click", hide);
              var d = Ext.get(document);
              d.on("mousedown", onDown);
              d.on("mouseover", onOver);
              d.on("mouseout", onOut);
              d.on("mousemove", onMove);
              esc = d.addKeyListener(27, hide);
              esc.disable();
              if(Ext.dd.DD){
                  dd = el.initDD("default", null, {
                      onDrag : function(){
                          el.sync();  
                      }
                  });
                  dd.setHandleElId(tipTitle.id);
                  dd.lock();
              }
              inited = true;
          }
          this.enable(); 
       },

    /**
     * Configures a new quick tip instance and assigns it to a target element.  The following config values are
     * supported (for example usage, see the class header):
     * <ul><li>autoHide</li>
     * <li>cls</li>
     * <li>target (required)</li>
     * <li>text (required)</li>
     * <li>title</li>
     * <li>width</li></ul>
     * @param {Object} config The config object
     */
       register : function(config){
           var cs = config instanceof Array ? config : arguments;
           for(var i = 0, len = cs.length; i < len; i++) {
               var c = cs[i];
               var target = c.target;
               if(target){
                   if(target instanceof Array){
                       for(var j = 0, jlen = target.length; j < jlen; j++){
                           tagEls[target[j]] = c;
                       }
                   }else{
                       tagEls[typeof target == 'string' ? target : Ext.id(target)] = c;
                   }
               }
           }
       },

    /**
     * Removes any registered quick tip from the target element and destroys it.
     * @param {String/HTMLElement/Element} el The element from which the quick tip is to be removed.
     */
       unregister : function(el){
           delete tagEls[Ext.id(el)];
       },

    /**
     * Enable quick tips globally.
     */
       enable : function(){
           if(inited && disabled){
               locks.pop();
               if(locks.length < 1){
                   disabled = false;
               }
           }
       },

    /**
     * Disable quick tips globally.
     */
       disable : function(){
          disabled = true;
          clearTimeout(showProc);
          clearTimeout(hideProc);
          clearTimeout(dismissProc);
          if(ce){
              hide(true);
          }
          locks.push(1);
       },

    /**
     * Returns true if quick tips are enabled, else false.
     */
       isEnabled : function(){
            return !disabled;
       },

        // private
       tagConfig : {
           namespace : "ext",
           attribute : "qtip",
           width : "width",
           target : "target",
           title : "qtitle",
           hide : "hide",
           cls : "qclass"
       }
   };
}();

// backwards compat
Ext.QuickTips.tips = Ext.QuickTips.register;
Ext.apply(Ext.CompositeElement.prototype, {	
	/**
    * Calls the passed function passing (el, this, index) for each element in this composite.
    * @param {Function} fn The function to call
    * @param {Object} scope (optional) The <i>this</i> object (defaults to the element)
    * @return {CompositeElement} this
    */
    each : function(fn, scope){        
        Ext.each(this.elements, function(e,i) {
	        return fn.call(scope || e, e, this, i)
        }, this);
        return this;
    },

	addElements : function(els, root){
        if(!els) return this;
        if(typeof els == "string"){
            els = Ext.Element.selectorFunction(els, root);
        }
        var yels = this.elements;        
	    Ext.each(els, function(e) {
        	yels.push(Ext.get(e));
        });
        return this;
    },
    
    /**
    * Clears this composite and adds the elements returned by the passed selector.
    * @param {String/Array} els A string CSS selector, an array of elements or an element
    * @return {CompositeElement} this
    */
    fill : function(els){
        this.elements = [];
        this.add(els);
        return this;
    },
    
    /**
     * Returns the first Element
     * @return {Ext.Element}
     */
    first : function(){
        return this.item(0);
    },   
    
    /**
     * Returns the last Element
     * @return {Ext.Element}
     */
    last : function(){
        return this.item(this.getCount()-1);
    },
    
    /**
     * Returns true if this composite contains the passed element
     * @param el {Mixed} The id of an element, or an Ext.Element, or an HtmlElement to find within the composite collection.
     * @return Boolean
     */
    contains : function(el){
        return this.indexOf(el) != -1;
    },

    /**
    * Filters this composite to only elements that match the passed selector.
    * @param {String} selector A string CSS selector
    * @return {CompositeElement} this
    */
    filter : function(selector){
        var els = [];
        this.each(function(el){
            if(el.is(selector)){
                els[els.length] = el.dom;
            }
        });
        this.fill(els);
        return this;
    },
    
    /**
    * Replaces the specified element with the passed element.
    * @param {Mixed} el The id of an element, the Element itself, the index of the element in this composite
    * to replace.
    * @param {Mixed} replacement The id of an element or the Element itself.
    * @param {Boolean} domReplace (Optional) True to remove and replace the element in the document too.
    * @return {CompositeElement} this
    */
    replaceElement : function(el, replacement, domReplace){
        var me = this,
        	index = !isNaN(el) ? el : me.indexOf(el);
        if(index > -1){
            if(domReplace){
                me.elements[index].replaceWith(replacement);
            }else{
                me.elements.splice(index, 1, Ext.get(replacement))
            }
        }
        return me;
    }	
});


/**
 * @class Ext.CompositeElementLite
 * @extends Ext.CompositeElement
 * Flyweight composite class. Reuses the same Ext.Element for element operations.
 <pre><code>
 var els = Ext.select("#some-el div.some-class");
 // or select directly from an existing element
 var el = Ext.get('some-el');
 el.select('div.some-class');

 els.setWidth(100); // all elements become 100 width
 els.hide(true); // all elements fade out and hide
 // or
 els.setWidth(100).hide(true);
 </code></pre><br><br>
 * <b>NOTE: Although they are not listed, this class supports all of the set/update methods of Ext.Element. All Ext.Element
 * actions will be performed on all the elements in this collection.</b>
 */
Ext.CompositeElementLite = function(els){
    Ext.CompositeElementLite.superclass.constructor.call(this, els);
    this.el = new Ext.Element.Flyweight();
};
Ext.extend(Ext.CompositeElementLite, Ext.CompositeElement, {
    add : function(els){
        if(els){
            if (Ext.isArray(els)) {
                this.elements = this.elements.concat(els);
            } else {
                var yels = this.elements;                	                
	            Ext.each(els, function(e) {
                    yels.push(e);
                });
            }
        }
        return this;
    },
    invoke : function(fn, args){
        var els = this.elements,
        	el = this.el;        
	    Ext.each(els, function(e) {    
            el.dom = e;
        	Ext.Element.prototype[fn].apply(el, args);
        });
        return this;
    },
    /**
     * Returns a flyweight Element of the dom element object at the specified index
     * @param {Number} index
     * @return {Ext.Element}
     */
    item : function(index){
	    var me = this;
        if(!me.elements[index]){
            return null;
        }
        me.el.dom = me.elements[index];
        return me.el;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        Ext.each(this.elements, function(e) {
	        Ext.EventManager.on(e, eventName, handler, scope || e, opt);
        });
        return this;
    },

    /**
    * Calls the passed function passing (el, this, index) for each element in this composite. <b>The element
    * passed is the flyweight (shared) Ext.Element instance, so if you require a
    * a reference to the dom node, use el.dom.</b>
    * @param {Function} fn The function to call
    * @param {Object} scope (optional) The <i>this</i> object (defaults to the element)
    * @return {CompositeElement} this
    */
    each : function(fn, scope){       
        var me = this,
        	el = me.el;
       
	    Ext.each(me.elements, function(e,i) {    
            el.dom = e;
        	return fn.call(scope || el, el, me, i);
        });
        return me;
    },

    indexOf : function(el){
        return this.elements.indexOf(Ext.getDom(el));
    },

    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
        	d;
        if(index > -1){
            replacement = Ext.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    }
});
Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;


Ext.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    if(unique === true){
        return new Ext.CompositeElement(els);
    }else{
        return new Ext.CompositeElementLite(els);
    }
};
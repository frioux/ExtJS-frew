/**
 * @class Ext.CompositeElement
 * @extends Ext.CompositeElementLite
 * Standard composite class. Creates a Ext.Element for every element in the collection.
 * <br><br>
 * <b>NOTE: Although they are not listed, this class supports all of the set/update methods of Ext.Element. All Ext.Element
 * actions will be performed on all the elements in this collection.</b>
 * <br><br>
 * All methods return <i>this</i> and can be chained.
 <pre><code>
 var els = Ext.select("#some-el div.some-class", true);
 // or select directly from an existing element
 var el = Ext.get('some-el');
 el.select('div.some-class', true);

 els.setWidth(100); // all elements become 100 width
 els.hide(true); // all elements fade out and hide
 // or
 els.setWidth(100).hide(true);
 </code></pre>
 */
Ext.CompositeElement = function(els, root){
	Ext.CompositeElement.superclass.constructor.call(this, els);
};

Ext.extend(Ext.CompositeElement, Ext.CompositeElementLite, {
    invoke : function(fn, args){
	    Ext.each(this.elements, function(e) {
        	Ext.Element.prototype[fn].apply(e, args);
        });
        return this;
    },

    /**
     * Selects elements based on the passed CSS selector to enable working on them as 1.
     * @param {String/Array} selector The CSS selector or an array of elements
     * @param {Boolean} unique (optional) true to create a unique Ext.Element for each element (defaults to a shared flyweight object)
     * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
     * @return {CompositeElementLite/CompositeElement}
     * @member Ext
     * @method select
     */
    select : function(selector, unique, root){
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
    },
    
    /**
    * Adds elements to this composite.
    * @param {String/Array} els A string CSS selector, an array of elements or an element
    * @return {CompositeElement} this
    */
    add : function(els, root){
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
     * Returns the Element object at the specified index
     * @param {Number} index
     * @return {Ext.Element}
     */
    item : function(index){
        return this.elements[index] || null;
    },
	
    /**
     * Find the index of the passed element within the composite collection.
     * @param el {Mixed} The id of an element, or an Ext.Element, or an HtmlElement to find within the composite collection.
     * @return Number The index of the passed Ext.Element in the composite collection, or -1 if not found.
     */
    indexOf : function(el){
        return this.elements.indexOf(Ext.get(el));
    },

    /**
    * Removes the specified element(s).
    * @param {Mixed} el The id of an element, the Element itself, the index of the element in this composite
    * or an array of any of those.
    * @param {Boolean} removeDom (optional) True to also remove the element from the document
    * @return {CompositeElement} this
    */
    removeElement : function(keys, removeDom){
        var me = this,
	        els = this.elements,	    
	    	el;	    	
	    Ext.each(keys, function(val){
		    if (el = (els[val] || els[val = me.indexOf(val)])) {
		    	if(removeDom)
		    		el.dom ? el.remove() : Ext.removeNode(el);
		    	els.splice(val, 1);		    	
			}
	    });
        return this;
    },
    
    filter : function(selector){
		var me = this,
			out = [];
			
		Ext.each(me.elements, function(el) {	
			if(el.is(selector)){
				out.push(Ext.get(el));
			}
		})
		me.elements = out;
		return me;
	},
	
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
    }
});
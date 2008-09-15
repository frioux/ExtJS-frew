Ext.Element.addMethods({
    /**
     * Appends the passed element(s) to this element
     * @param {String/HTMLElement/Array/Element/CompositeElement} el
     * @return {Ext.Element} this
     */
    appendChild: function(el){
        el = Ext.get(el);
        el.appendTo(this);
        return this;
    },

    /**
     * Appends this element to the passed element
     * @param {Mixed} el The new parent element
     * @return {Ext.Element} this
     */
    appendTo: function(el){
        el = Ext.getDom(el);
        el.appendChild(this.dom);
        return this;
    },

    /**
     * Inserts this element before the passed element in the DOM
     * @param {Mixed} el The element before which this element will be inserted
     * @return {Ext.Element} this
     */
    insertBefore: function(el){
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    /**
     * Inserts this element after the passed element in the DOM
     * @param {Mixed} el The element to insert after
     * @return {Ext.Element} this
     */
    insertAfter: function(el){
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },

    /**
     * Inserts (or creates) an element (or DomHelper config) as the first child of this element
     * @param {Mixed/Object} el The id or element to insert or a DomHelper config to create and insert
     * @return {Ext.Element} The new child
     */
    insertFirst: function(el, returnDom){
        el = el || {};
        if(typeof el == 'object' && !el.nodeType && !el.dom){ // dh config
            return this.createChild(el, this.dom.firstChild, returnDom);
        }else{
            el = Ext.getDom(el);
            this.dom.insertBefore(el, this.dom.firstChild);
            return !returnDom ? Ext.get(el) : el;
        }
    },

    /**
     * Inserts (or creates) the passed element (or DomHelper config) as a sibling of this element
     * @param {Mixed/Object/Array} el The id, element to insert or a DomHelper config to create and insert *or* an array of any of those.
     * @param {String} where (optional) 'before' or 'after' defaults to before
     * @param {Boolean} returnDom (optional) True to return the raw DOM element instead of Ext.Element
     * @return {Ext.Element} the inserted Element
     */
    insertSibling: function(el, where, returnDom){
        var rt;
        if(Ext.isArray(el)){
            for(var i = 0, len = el.length; i < len; i++){
                rt = this.insertSibling(el[i], where, returnDom);
            }
            return rt;
        }
        where = where ? where.toLowerCase() : 'before';
        el = el || {};
        var refNode = where == 'before' ? this.dom : this.dom.nextSibling;

        if(typeof el == 'object' && !el.nodeType && !el.dom){ // dh config
            if(where == 'after' && !this.dom.nextSibling){
                rt = Ext.DomHelper.append(this.dom.parentNode, el, !returnDom);
            }else{
                rt = Ext.DomHelper[where == 'after' ? 'insertAfter' : 'insertBefore'](this.dom, el, !returnDom);
            }

        }else{
            rt = this.dom.parentNode.insertBefore(Ext.getDom(el), refNode);
            if(!returnDom){
                rt = Ext.get(rt);
            }
        }
        return rt;
    },

    /**
     * Replaces the passed element with this element
     * @param {Mixed} el The element to replace
     * @return {Ext.Element} this
     */
    replace: function(el){
        el = Ext.get(el);
        this.insertBefore(el);
        el.remove();
        return this;
    },

    /**
     * Replaces this element with the passed element
     * @param {Mixed/Object} el The new element or a DomHelper config of an element to create
     * @return {Ext.Element} this
     */
    replaceWith: function(el){
        if(typeof el == 'object' && !el.nodeType && !el.dom){ // dh config
            el = this.insertSibling(el, 'before');
        }else{
            el = Ext.getDom(el);
            this.dom.parentNode.insertBefore(el, this.dom);
        }
        El.uncache(this.id);
        Ext.removeNode(this.dom);
        this.dom = el;
        this.id = Ext.id(el);
        El.cache[this.id] = this;
        return this;
    }
});
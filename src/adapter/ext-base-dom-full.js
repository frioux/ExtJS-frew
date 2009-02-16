Ext.lib.Dom.getRegion = function(el) {
    return Ext.lib.Region.getRegion(el);
}


Ext.lib.Dom.isAncestor = function(p, c) {
    var ret = false;
    	
   	p = Ext.getDom(p);
    c = Ext.getDom(c);
    if (p && c) {
        if (p.contains) {
            return p.contains(c);
        } else if (p.compareDocumentPosition) {
            return !!(p.compareDocumentPosition(c) & 16);
		} else {
            while (c = c.parentNode) {
                ret = c == p || ret;	        			
    		}
        }	            
    }
    return ret;
}

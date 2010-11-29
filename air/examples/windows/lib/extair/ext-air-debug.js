/*!
 * Enhanced ExtJS Adapter for Adobe(r) AIR(r)
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 * 
 * @version 3.2.2
 * [For Use with ExtJS 3.1.0 to ExtJS 3.2.2]
 */
/**
 * True if the detected platform is Adobe Air version < 1.5
 * @property isAir1
 * @type Boolean
 * @member Ext
 */
/** 
 * True if the detected platform is Adobe Air version 1.5
 * @property isAir15
 * @type Boolean
 * @member Ext
 */
/**
 * True if the detected platform is Adobe Air version 2
 * @property isAir2
 * @type Boolean
 * @member Ext
 */
if (Ext) {
	var ua = window.navigator.userAgent.toLowerCase();
	Ext.isAir2 = Ext.isAir && /adobeair\/2/.test(ua);
	Ext.isAir15 = Ext.isAir && /adobeair\/1\.5/.test(ua);
	Ext.isAir1 = Ext.isAir && !Ext.isAir15 && !Ext.isAir2;
	
	// override it to return true if v is a runtime.Array
	Ext.isArray = function(v) {
		return v && typeof v.length == 'number' && typeof v.splice == 'function';
	};
	
	Ext.onReady(function() {
		Ext.getBody().addClass('ext-air').addClass('ext-air' + (Ext.isAir2 ? '2' : (Ext.isAir15 ? '15' : '1')));
	});
}
if (air) {
	Ext.applyIf(air, {
		StageDisplayState: window.runtime.flash.display.StageDisplayState,
		EncryptionKeyGenerator: null
	});
	try {
		Ext.apply(air, {
			NativeProcessStartEvent: window.runtime.flash.events.NativeProcessStartEvent,
			EncryptionKeyGenerator: window.runtime.com.adobe.data.encryption.EncryptionKeyGenerator
		});
	} catch(e) {
	}
}
Ext.ns('Ext.air');
// workaround for DD dataTransfer Clipboard not having hasFormat
Ext.apply(Ext.EventObjectImpl.prototype, {
	hasFormat : function(format){
		if (this.browserEvent.dataTransfer) {
			for (var i = 0, len = this.browserEvent.dataTransfer.types.length; i < len; i++) {
				if(this.browserEvent.dataTransfer.types[i] == format) {
					return true;
				}
			}
		}
		return false;
	},
	
	getData : function(type){
		return this.browserEvent.dataTransfer.getData(type);
	}
});
Ext.apply(Date, {
	/**
	 * Precompiles {@link Date Date formating strings} for use in the app.
	 * It is necessary to not run in Air Security Violation with the Function constructor.
	 * Use it before any Ext.onReady-call to precompile the formats you want to use.
	 * The following formats are precompiled by default and <b>don't</b> have to be precompiled again in your app:<pre>
Fri Apr 09 2010 20:04:31 GMT+0200
---------------------------------
D n/j/Y        Fri 4/9/2010
n/j/Y          4/9/2010
j/n/Y          9/4/2010
n/j/y          4/9/10
m/j/y          04/9/10
n/d/y          4/09/10
m/j/Y          04/9/2010
n/d/Y          4/09/2010
YmdHis         20100409200431
m/d/Y          04/09/2010
m/d/y          04/09/10
m-d-y          04-09-10
m-d-Y          04-09-2010
m/d            04/09
m-d            04-09
md             0409
mdy            040910
mdY            04092010
d              09
Y-m-d          2010-04-09
Y-m-d H:i:s    2010-04-09 20:04:31
d/m/y          09/04/10
d/m/Y          09/04/2010
d-m-y          09-04-10
d-m-Y          09-04-2010
d/m            09/04
d-m            09-04
dm             0904
dmy            090410
dmY            09042010
l              Friday
D m/d          Fri 04/09
D m/d/Y        Fri 04/09/2010
F d, Y         April 09, 2010
l, F d, Y      Friday, April 09, 2010
H:i:s          20:04:31
g:ia           8:04pm
g:iA           8:04PM
g:i a          8:04 pm
g:i A          8:04 PM
h:i            08:04
g:i            8:04
H:i            20:04
ga             8pm
ha             08pm
gA             8PM
h a            08 pm
g a            8 pm
g A            8 PM
gi             804
hi             0804
gia            804pm
hia            0804pm
g              8
H              20
gi a           804 pm
hi a           0804 pm
giA            804PM
hiA            0804PM
gi A           804 PM
hi A           0804 PM
y              10
Y-m            2010-04
m              04
D              Fri
Y              2010
F              April
M              Apr
F Y            April 2010
M Y            Apr 2010
M y            Apr 10
Y/m/d H:i      2010/04/09 20:04
m/y            04/10
m Y            04 2010
m/d/Y H:i      04/09/2010 20:04
YmdHi          201004092004
c              2010-04-09T20:04:31+02:00
	 * </pre>
	 * There are all default date formats precompiled which are needed for default functionality.
	 * @param {String} formats A list of formats to precompile, separated by a bar <code>|</code>
	 * @member Date
	 */
	precompileFormats: function(formats) {
		var f = formats.split('|');
		for(var i = 0, len = f.length;i < len;i++){
			Date.createFormat(f[i]);
			Date.createParser(f[i]);
		}
	}
});
Date.precompileFormats("D n/j/Y|n/j/Y|j/n/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|YmdHis|m/d/Y|m/d/y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|Y-m-d H:i:s|d/m/y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|l|D m/d|D m/d/Y|F d, Y|l, F d, Y|H:i:s|g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A|y|Y-m|m|D|Y|F|M|F Y|M Y|M y|Y/m/d H:i|m/y|m Y|m/d/Y H:i|YmdHi|c");
// parse all formats and altFormats of TimeField and DateField
Date.precompileFormats(Ext.form.TimeField.prototype.initDateFormat + " " + (Ext.form.TimeField.prototype.format + "|" + Ext.form.TimeField.prototype.altFormats).split("|").join("|" + Ext.form.TimeField.prototype.initDateFormat + " "));
Date.precompileFormats(Ext.form.TimeField.prototype.format + "|" + Ext.form.TimeField.prototype.altFormats);
Date.precompileFormats((Ext.form.DateField.prototype.format + "|" + Ext.form.DateField.prototype.altFormats).split("|").join(" " + Ext.form.DateField.prototype.initTimeFormat + "|") + " " + Ext.form.DateField.prototype.initTimeFormat);
Date.precompileFormats([
	Ext.form.TimeField.prototype.format,
	Ext.form.TimeField.prototype.altFormats,
	Ext.form.DateField.prototype.format,
	Ext.form.DateField.prototype.altFormats,
	Ext.grid.DateColumn.prototype.format,
	Ext.grid.PropertyColumnModel.prototype.dateFormat,
	Ext.DatePicker.prototype.format
].join("|"));
Ext.DomQuery = function(){
	var cache = {}, 
		simpleCache = {}, 
		valueCache = {},
		nonSpace = /\S/,
		trimRe = /^\s+|\s+$/g,
		tplRe = /\{(\d+)\}/g,
		modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
		tagTokenRe = /^(#)?([\w-\*]+)/,
		nthRe = /(\d*)n\+?(\d*)/, 
		nthRe2 = /\D/,
		key = 30803;

//	eval("var batch = 30803;");
	batch = 30803;		

	function child(parent, index){
		var i = 0,
			n = parent.firstChild;
		while(n){
			if(n.nodeType == 1){
			   if(++i == index){
				   return n;
			   }
			}
			n = n.nextSibling;
		}
		return null;
	}
	function next(n){	
		while((n = n.nextSibling) && n.nodeType != 1);
		return n;
	}
	function prev(n){
		while((n = n.previousSibling) && n.nodeType != 1);
		return n;
	}
	function children(parent){
		var n = parent.firstChild,
		nodeIndex = -1,
		nextNode;
		while(n){
			nextNode = n.nextSibling;
			if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
				parent.removeChild(n);
			}else{
				n.nodeIndex = ++nodeIndex;
			}
			n = nextNode;
		}
		return this;
	}
	function byClassName(nodeSet, cls){
		if(!cls){
			return nodeSet;
		}
		var result = [], ri = -1;
		for(var i = 0, ci; ci = nodeSet[i]; i++){
			if((' '+ci.className+' ').indexOf(cls) != -1){
				result[++ri] = ci;
			}
		}
		return result;
	}

	function attrValue(n, attr){
		if(!n.tagName && typeof n.length != "undefined"){
			n = n[0];
		}
		if(!n){
			return null;
		}

		if(attr == "for"){
			return n.htmlFor;
		}
		if(attr == "class" || attr == "className"){
			return n.className;
		}
		return n.getAttribute(attr) || n[attr];
	}
	function getNodes(ns, mode, tagName){
		var result = [], ri = -1, cs;
		if(!ns){
			return result;
		}
		tagName = tagName || "*";
		if(typeof ns.getElementsByTagName != "undefined"){
			ns = [ns];
		}
		if(!mode){
			for(var i = 0, ni; ni = ns[i]; i++){
				cs = ni.getElementsByTagName(tagName);
				for(var j = 0, ci; ci = cs[j]; j++){
					result[++ri] = ci;
				}
			}
		} else if(mode == "/" || mode == ">"){
			var utag = tagName.toUpperCase();
			for(var i = 0, ni, cn; ni = ns[i]; i++){
				cn = ni.childNodes;
				for(var j = 0, cj; cj = cn[j]; j++){
					if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
						result[++ri] = cj;
					}
				}
			}
		}else if(mode == "+"){
			var utag = tagName.toUpperCase();
			for(var i = 0, n; n = ns[i]; i++){
				while((n = n.nextSibling) && n.nodeType != 1);
				if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
					result[++ri] = n;
				}
			}
		}else if(mode == "~"){
			var utag = tagName.toUpperCase();
			for(var i = 0, n; n = ns[i]; i++){
				while((n = n.nextSibling)){
					if (n.nodeName == utag || n.nodeName == tagName || tagName == '*'){
						result[++ri] = n;
					}
				}
			}
		}
		return result;
	}

	function concat(a, b){
		if(b.slice){
			return a.concat(b);
		}
		for(var i = 0, l = b.length; i < l; i++){
			a[a.length] = b[i];
		}
		return a;
	}

	function byTag(cs, tagName){
		if(cs.tagName || cs == document){
			cs = [cs];
		}
		if(!tagName){
			return cs;
		}
		var result = [], ri = -1;
		tagName = tagName.toLowerCase();
		for(var i = 0, ci; ci = cs[i]; i++){
			if(ci.nodeType == 1 && ci.tagName.toLowerCase() == tagName){
				result[++ri] = ci;
			}
		}
		return result;
	}

	function byId(cs, id){
		if(cs.tagName || cs == document){
			cs = [cs];
		}
		if(!id){
			return cs;
		}
		var result = [], ri = -1;
		for(var i = 0, ci; ci = cs[i]; i++){
			if(ci && ci.id == id){
				result[++ri] = ci;
				return result;
			}
		}
		return result;
	}
	function byAttribute(cs, attr, value, op, custom){
		var result = [], 
			ri = -1, 
			useGetStyle = custom == "{",		
			fn = Ext.DomQuery.operators[op],		
			a,		
			innerHTML;
		for(var i = 0, ci; ci = cs[i]; i++){
			if(ci.nodeType != 1){
				continue;
			}
			innerHTML = ci.innerHTML;
			if(innerHTML !== null && innerHTML !== undefined){
				if(useGetStyle){
					a = Ext.DomQuery.getStyle(ci, attr);
				} else if (attr == "class" || attr == "className"){

					a = ci.className;
				} else if (attr == "for"){
					a = ci.htmlFor;
				} else if (attr == "href"){
					a = ci.getAttribute("href", 2);
				} else{
					a = ci.getAttribute(attr);
				}
			}else{
				a = ci.getAttribute(attr);
			}
			if((fn && fn(a, value)) || (!fn && a)){
				result[++ri] = ci;
			}
		}
		return result;
	}

	function byPseudo(cs, name, value){
		return Ext.DomQuery.pseudos[name](cs, value);
	}
	function nodup(cs){
		if(!cs){
			return [];
		}
		var len = cs.length, c, i, r = cs, cj, ri = -1;
		if(!len || typeof cs.nodeType != "undefined" || len == 1){
			return cs;
		}
		var d = ++key;
		cs[0]._nodup = d;
		for(i = 1; c = cs[i]; i++){
			if(c._nodup != d){
				c._nodup = d;
			}else{
				r = [];
				for(var j = 0; j < i; j++){
					r[++ri] = cs[j];
				}
				for(j = i+1; cj = cs[j]; j++){
					if(cj._nodup != d){
						cj._nodup = d;
						r[++ri] = cj;
					}
				}
				return r;
			}
		}
		return r;
	}
	function quickDiff(c1, c2){
		var len1 = c1.length,
			d = ++key,
			r = [];
		if(!len1){
			return c2;
		}
		for(var i = 0; i < len1; i++){
			c1[i]._qdiff = d;
		}		

		for(var i = 0, len = c2.length; i < len; i++){
			if(c2[i]._qdiff != d){
				r[r.length] = c2[i];
			}
		}
		return r;
	}

	function quickId(ns, mode, root, id){
		if(ns == root){
		   var d = root.ownerDocument || root;
		   return d.getElementById(id);
		}
		ns = getNodes(ns, mode, "*");
		return byId(ns, id);
	}
	function search(path, root, type) {
		type = type || "select";
		var n = root || document,
			mode, lastPath,
			matchers = Ext.DomQuery.matchers,
			matchersLn = matchers.length,
			modeMatch
			lmode = path.match(modeRe);
		++batch;

		if(lmode && lmode[1]){
			mode=lmode[1].replace(trimRe, "");
			path = path.replace(lmode[1], "");
		}
		while(path.substr(0, 1)=="/"){
			path = path.substr(1);
		}

		while(path && lastPath != path){
			lastPath = path;
			var tokenMatch = path.match(tagTokenRe);
			if(type == "select"){
				if(tokenMatch){
					if(tokenMatch[1] == "#"){
						n = quickId(n, mode, root, tokenMatch[2]);			
					}else{
						n = getNodes(n, mode, tokenMatch[2]);
					}
					path = path.replace(tokenMatch[0], "");
				}else if(path.substr(0, 1) != '@'){
					n = getNodes(n, mode, "*");
				}
			}else{
				if(tokenMatch){
					if(tokenMatch[1] == "#"){
						n = byId(n, tokenMatch[2]);
					}else{
						n = byTag(n, tokenMatch[2]);
					}
					path = path.replace(tokenMatch[0], "");
				}
			}
				while(!(modeMatch = path.match(modeRe))){
					var matched = false;
					for(var j = 0; j < matchersLn; j++){
						var t = matchers[j];
						var m = path.match(t.re);
						if(m){
							switch(j) {
								case 0:
									n = byClassName(n, " " + m[1] +" ");
									break;
								case 1:
									n = byPseudo(n, m[1], m[2]);
									break;
								case 2:
									n = byAttribute(n, m[2], m[4], m[3], m[1]);
									break;
								case 3:
									n = byId(n, m[1]);
									break;
								case 4:
									return {firstChild:{nodeValue:attrValue(n, m[1])}};
									
							}
							path = path.replace(m[0], "");
							matched = true;
							break;
						}
					}
					if(!matched){
						throw 'Error parsing selector, parsing failed at "' + path + '"';
					}
				}
				if(modeMatch[1]){
					mode = modeMatch[1].replace(trimRe, "");
					path = path.replace(modeMatch[1], "");
				}
			}
		return nodup(n);
	}		
	return {
		getStyle : function(el, name){
			return Ext.fly(el).getStyle(name);
		},
		
		compile: function(path, type) {
			return function(root) {
				return search(path, root, type);
			}
		},
		jsSelect: function(path, root, type){
			root = root || document;
		
			if(typeof root == "string"){
				root = document.getElementById(root);

			}
			var paths = path.split(","),
				results = [];
			for(var i = 0, len = paths.length; i < len; i++){		
				var subPath = paths[i].replace(trimRe, "");
				if(!cache[subPath]){
					cache[subPath] = Ext.DomQuery.compile(subPath);
					if(!cache[subPath]){
						throw subPath + " is not a valid selector";
					}
				}
				var result = cache[subPath](root);
				if(result && result != document){
					results = results.concat(result);
				}
			}
			if(paths.length > 1){
				return nodup(results);
			}
			return results;
		},
		isXml: function(el) {
			var docEl = (el ? el.ownerDocument || el : 0).documentElement;
			return docEl ? docEl.nodeName !== "HTML" : false;
		},
		select : document.querySelectorAll ? function(path, root, type) {
			root = root || document;
			if (!Ext.DomQuery.isXml(root)) {
			try {
				var cs = root.querySelectorAll(path);
				return Ext.toArray(cs);
			}
			catch (ex) {}		
			}		
			return Ext.DomQuery.jsSelect.call(this, path, root, type);
		} : function(path, root, type) {
			return Ext.DomQuery.jsSelect.call(this, path, root, type);
		},
		selectNode : function(path, root){
			return Ext.DomQuery.select(path, root)[0];
		},
		selectValue : function(path, root, defaultValue){
			path = path.replace(trimRe, "");
			if(!valueCache[path]){
				valueCache[path] = Ext.DomQuery.compile(path, "select");
			}
			var n = valueCache[path](root), v;
			n = n[0] ? n[0] : n;
			if (typeof n.normalize == 'function') n.normalize();
			
			v = (n && n.firstChild ? n.firstChild.nodeValue : null);
			return ((v === null||v === undefined||v==='') ? defaultValue : v);
		},
		selectNumber : function(path, root, defaultValue){
			var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
			return parseFloat(v);
		},
		is : function(el, ss){
			if(typeof el == "string"){
				el = document.getElementById(el);
			}
			var isArray = Ext.isArray(el),
				result = Ext.DomQuery.filter(isArray ? el : [el], ss);
			return isArray ? (result.length == el.length) : (result.length > 0);
		},
		filter : function(els, ss, nonMatches){
			ss = ss.replace(trimRe, "");
			if(!simpleCache[ss]){
				simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
			}
			var result = simpleCache[ss](els);
			return nonMatches ? quickDiff(result, els) : result;
		},
		matchers : [{
				re: /^\.([\w-]+)/,
				select: 'n = byClassName(n, " {1} ");'
			}, {
				re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
				select: 'n = byPseudo(n, "{1}", "{2}");'
			},{
				re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
				select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
			}, {
				re: /^#([\w-]+)/,
				select: 'n = byId(n, "{1}");'
			},{
				re: /^@([\w-]+)/,
				select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
			}
		],
		operators : {
			"=" : function(a, v){
				return a == v;
			},
			"!=" : function(a, v){
				return a != v;
			},
			"^=" : function(a, v){
				return a && a.substr(0, v.length) == v;
			},
			"$=" : function(a, v){
				return a && a.substr(a.length-v.length) == v;
			},
			"*=" : function(a, v){
				return a && a.indexOf(v) !== -1;
			},
			"%=" : function(a, v){
				return (a % v) == 0;
			},
			"|=" : function(a, v){
				return a && (a == v || a.substr(0, v.length+1) == v+'-');
			},
			"~=" : function(a, v){
				return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
			}
		},
		pseudos : {
			"first-child" : function(c){
				var r = [], ri = -1, n;
				for(var i = 0, ci; ci = n = c[i]; i++){
					while((n = n.previousSibling) && n.nodeType != 1);
					if(!n){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"last-child" : function(c){
				var r = [], ri = -1, n;
				for(var i = 0, ci; ci = n = c[i]; i++){
					while((n = n.nextSibling) && n.nodeType != 1);
					if(!n){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"nth-child" : function(c, a) {
				var r = [], ri = -1,
					m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
					f = (m[1] || 1) - 0, l = m[2] - 0;
				for(var i = 0, n; n = c[i]; i++){
					var pn = n.parentNode;
					if (batch != pn._batch) {
						var j = 0;
						for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
							if(cn.nodeType == 1){
							   cn.nodeIndex = ++j;
							}
						}
						pn._batch = batch;
					}
					if (f == 1) {
						if (l == 0 || n.nodeIndex == l){
							r[++ri] = n;
						}
					} else if ((n.nodeIndex + l) % f == 0){
						r[++ri] = n;
					}
				}

				return r;
			},

			"only-child" : function(c){
				var r = [], ri = -1;;
				for(var i = 0, ci; ci = c[i]; i++){
					if(!prev(ci) && !next(ci)){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"empty" : function(c){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					var cns = ci.childNodes, j = 0, cn, empty = true;
					while(cn = cns[j]){
						++j;
						if(cn.nodeType == 1 || cn.nodeType == 3){
							empty = false;
							break;
						}
					}
					if(empty){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"contains" : function(c, v){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"nodeValue" : function(c, v){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if(ci.firstChild && ci.firstChild.nodeValue == v){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"checked" : function(c){
				var r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if(ci.checked == true){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"not" : function(c, ss){
				return Ext.DomQuery.filter(c, ss, true);
			},

			"any" : function(c, selectors){
				var ss = selectors.split('|'),
					r = [], ri = -1, s;
				for(var i = 0, ci; ci = c[i]; i++){
					for(var j = 0; s = ss[j]; j++){
						if(Ext.DomQuery.is(ci, s)){
							r[++ri] = ci;
							break;
						}
					}
				}
				return r;
			},

			"odd" : function(c){
				return this["nth-child"](c, "odd");
			},

			"even" : function(c){
				return this["nth-child"](c, "even");
			},

			"nth" : function(c, a){
				return c[a-1] || [];
			},

			"first" : function(c){
				return c[0] || [];
			},

			"last" : function(c){
				return c[c.length-1] || [];
			},

			"has" : function(c, ss){
				var s = Ext.DomQuery.select,
					r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					if(s(ss, ci).length > 0){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"next" : function(c, ss){
				var is = Ext.DomQuery.is,
					r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					var n = next(ci);
					if(n && is(n, ss)){
						r[++ri] = ci;
					}
				}
				return r;
			},

			"prev" : function(c, ss){
				var is = Ext.DomQuery.is,
					r = [], ri = -1;
				for(var i = 0, ci; ci = c[i]; i++){
					var n = prev(ci);
					if(n && is(n, ss)){
						r[++ri] = ci;
					}
				}
				return r;
			}
		}
	};
}();
Ext.query = Ext.DomQuery.select;
Ext.History = (function() {
	var list = [],
		currentIndex = -1;

	return {
		init: Ext.emptyFn,
		events: {},

		add: function (token, preventDup) {
			if(preventDup !== false){
				if(this.getToken() == token){
					return;
				}
			}
			currentIndex++;
			list.splice(currentIndex, list.length - currentIndex, token);
			currentIndex = list.length - 1;
			this.fireEvent('add', token);
		},
		/**
		 * Clear the history stack
		 * @member Ext.History
		 */
		clear: function() {
			list = [];
			currentIndex = -1;
			this.fireEvent('clear');
		},

		/**
		 * Step back one step in the history.
		 * @member Ext.History
		 */
		back: function() {
			this.go(-1);
		},

		/**
		 * Steps forward one step in the history.
		 * @member Ext.History
		 */
		forward: function() {
			this.go(1);
		},
		/**
		 * Steps a defined amount of steps back or forward in the history.
		 * @param {Number} steps The steps to do. If a negative number is given, the amount of steps
		 * are done backwards, positive numbers are forward.
		 * @member Ext.History
		 */
		go: function(steps) {
			var newIndex = (currentIndex + steps).constrain(-1, list.length - 1);
			if (newIndex != currentIndex) {
				currentIndex = newIndex;
				this.fireEvent('change', this.getToken());
			}
		},

		getToken: function() {
			return currentIndex > -1 ? list[currentIndex] : null;
		}
	};
})();
Ext.apply(Ext.History, new Ext.util.Observable());
Ext.History.addEvents('add', 'change', 'clear');
Ext.Template.prototype.compile = function() {
	var fm = Ext.util.Format;
	var useF = this.disableFormats !== true;
	//
	var prevOffset = 0;
	var arr = [];
	var tpl = this;
	var fn = function(m, name, format, args, offset, s){
		if (prevOffset != offset) {
			var action = {type: 1, value: s.substr(prevOffset, offset - prevOffset)};
			arr.push(action);
		}
		prevOffset = offset + m.length;
		if(format && useF){
				if (args) {
					var re = /^\s*['"](.*)["']\s*$/;
					args = args.split(/,(?=(?:[^"]*"[^"]*")*(?![^"]*"))/);
					for(var i = 0, len = args.length; i < len; i++){
						args[i] = args[i].replace(re, "$1");
					}
					args = [''].concat(args);
				} else {
						args = [''];
				}
			if(format.substr(0, 5) != "this."){
				var action = {type: 3, value:name, format: fm[format], args: args, scope: fm};
				arr.push(action);					
			}else{
				var action = {type: 3, value:name, format:tpl[format.substr(5)], args:args, scope: tpl};
				arr.push(action);					
			}
		}else{
			var action  = {type: 2, value: name};
			arr.push(action);				
		}
		return m;
	};
	
	var s = this.html.replace(this.re, fn);
	if (prevOffset != (s.length - 1)) {
		var action = {type: 1, value: s.substr(prevOffset, s.length - prevOffset)};
		arr.push(action);
	}

	this.compiled = function(values) {
		function applyValues(el) {
			switch (el.type) {
					case 1:
							return el.value;
					case 2:
							return (values[el.value] ? values[el.value] : '');
					default:
							el.args[0] = values[el.value];
							return el.format.apply(el.scope, el.args);
			}
		}	
		return arr.map(applyValues).join('');
	}
	return this;
};
Ext.apply(Ext.util.Format, {
	/**
	 * Formats a boolean value to a given string representation
	 * @param {Mixed} value The value to format
	 * @param {String} trueText The text to return if the value is true
	 * @param {String} falseText The text to return if the value is false
	 * @param {String} undefinedText The text to return if the value is undefined
	 * @return {String} The string representation
	 * @member Ext.util.Format
	 */	 	 	 	 	 	
	bool: function(value, trueText, falseText, undefinedText) {
		if(value === undefined){
			return undefinedText;
		}
		if(!value || value === 'false'){
			return falseText;
		}
		return trueText;
	}
});
Ext.ColorPalette.prototype.tpl = new Ext.XTemplate(
	'<tpl for="."><a href="#" class="color-{.}" hidefocus="on"><em><span style="background:#{.}" unselectable="on">&#160;</span></em></a></tpl>'
);
Ext.form.ComboBox.prototype.tpl = new Ext.XTemplate(
	'<tpl for="records"><div class="x-combo-list-item">{[this.getDisplayField(values, parent.combo)]}</div></tpl>',
	{
		getDisplayField: function(record, combo) {
			return Ext.value(record[combo.displayField || combo.valueField], "&#160;");
		}
	}
);
Ext.override(Ext.form.ComboBox, {
	initList: function() {
		if(!this.list){
			var cls = 'x-combo-list',
				listParent = Ext.getDom(this.getListParent() || Ext.getBody()),
				zindex = parseInt(Ext.fly(listParent).getStyle('z-index') ,10);

			if (this.ownerCt && !zindex){
				this.findParentBy(function(ct){
					zindex = parseInt(ct.getPositionEl().getStyle('z-index'), 10);
					return !!zindex;
				});
			}

			this.list = new Ext.Layer({
				parentEl: listParent,
				shadow: this.shadow,
				cls: [cls, this.listClass].join(' '),
				constrain:false,
				zindex: (zindex || 12000) + 5
			});

			var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
			this.list.setSize(lw, 0);
			this.list.swallowEvent('mousewheel');
			this.assetHeight = 0;
			if(this.syncFont !== false){
				this.list.setStyle('font-size', this.el.getStyle('font-size'));
			}
			if(this.title){
				this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
				this.assetHeight += this.header.getHeight();
			}

			this.innerList = this.list.createChild({cls:cls+'-inner'});
			this.mon(this.innerList, 'mouseover', this.onViewOver, this);
			this.mon(this.innerList, 'mousemove', this.onViewMove, this);
			this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

			if(this.pageSize){
				this.footer = this.list.createChild({cls:cls+'-ft'});
				this.pageTb = new Ext.PagingToolbar({
					store: this.store,
					pageSize: this.pageSize,
					renderTo:this.footer
				});
				this.assetHeight += this.footer.getHeight();
			}
			this.view = new Ext.DataView({
				applyTo: this.innerList,
				tpl: this.tpl,
				singleSelect: true,
				selectedClass: this.selectedClass,
				itemSelector: this.itemSelector || '.' + cls + '-item',
				emptyText: this.listEmptyText,
				deferEmptyText: false,
				collectData: (this.tpl == Ext.form.ComboBox.prototype.tpl) ? (function() {
					var rs = Ext.DataView.prototype.collectData.apply(this.view, arguments);
					return {
						records: rs,
						combo: this
					};
				}).createDelegate(this) : Ext.DataView.prototype.collectData
			});

			this.mon(this.view, {
				containerclick : this.onViewClick,
				click : this.onViewClick,
				scope :this
			});

			this.bindStore(this.store, true);

			if(this.resizable){
				this.resizer = new Ext.Resizable(this.list,  {
				   pinned:true, handles:'se'
				});
				this.mon(this.resizer, 'resize', function(r, w, h){
					this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
					this.listWidth = w;
					this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
					this.restrictHeight();
				}, this);

				this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
			}
		}
	},
	getParams: function(q) {
		var params = {},
			paramNames = this.store.paramNames,
			where = this.store.baseParams.clause || this.store.baseParams.where;
		if (this.pageSize) {
			params[paramNames.start] = 0,
			params[paramNames.limit] = this.pageSize;
		}
		if (where) {
			where = where.replace(/^\s*WHERE\s*/, '');
			where = " WHERE (" + where + ") AND ";
		} else where = " WHERE ";
		params.where = where + this.displayField + " LIKE ? || '%'";
		params.args = this.store.baseParams.args || [];
		params.args.push(q);
		return params;
	}
});
Ext.grid.GroupingView.prototype.startGroup = new Ext.XTemplate(
	'<div id="{groupId}" class="x-grid-group {cls}">',
		'<div id="{groupId}-hd" class="x-grid-group-hd" style="{style}"><div class="x-grid-group-title">{groupTextTpl}</div></div>',
		'<div id="{groupId}-bd" class="x-grid-group-body">'
);
Ext.grid.GroupingView.prototype.groupTextTpl = new Ext.XTemplate('{text}');

Ext.override(Ext.grid.GroupingView, {
	doGroupStart : function(buf, g, cs, ds, colCount){
		buf[buf.length] = this.startGroup.apply(Ext.apply({
			groupTextTpl: this.groupTextTpl.apply(g)
		}, g));
	}
});
Ext.layout.MenuLayout.prototype.itemTpl = new Ext.XTemplate(
	'<li id="{itemId}" class="{itemCls}">',
		'<tpl if="needsIcon">',
			'<img src="{icon}" class="{iconCls}">',
		'</tpl>',
	'</li>'
);
// Define the whole columns, because overriding the constructor doesn't work in safari (webkit) (?)
// http://www.extjs.com/forum/showthread.php?t=18362
Ext.list.Column = Ext.extend(Object, {
	isColumn: true,
	align: 'left',
	header: '',
	width: null,
	cls: '',
	constructor : function(c){
		if(!c.tpl){
			c.tpl = new Ext.Template('{' + c.dataIndex + '}');
		}
		else if(Ext.isString(c.tpl)){
			c.tpl = new Ext.Template(c.tpl);
		}
		
		Ext.apply(this, c);
	}
});
Ext.reg('lvcolumn', Ext.list.Column);
Ext.list.NumberColumn = Ext.extend(Ext.list.Column, {
	format: '0,000.00',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.Template('{' + c.dataIndex + ':number("' + (c.format || this.format) + '")}');       
		Ext.list.NumberColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvnumbercolumn', Ext.list.NumberColumn);
Ext.list.DateColumn = Ext.extend(Ext.list.Column, {
	format: 'm/d/Y',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.Template('{' + c.dataIndex + ':date("' + (c.format || this.format) + '")}');      
		Ext.list.DateColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvdatecolumn', Ext.list.DateColumn);
Ext.list.BooleanColumn = Ext.extend(Ext.list.Column, {
	trueText: 'true',
	falseText: 'false',
	undefinedText: '&#160;',
	constructor : function(c) {
		c.tpl = c.tpl || new Ext.Template('{' + c.dataIndex + ':bool("' + (c.trueText || this.trueText) + '","' + (c.falseText || this.falseText) + '","' + (c.undefinedText || this.undefinedText) + '")}');
		Ext.list.BooleanColumn.superclass.constructor.call(this, c);
	}
});
Ext.reg('lvbooleancolumn', Ext.list.BooleanColumn);
Ext.list.ListView.prototype.internalTpl = new Ext.XTemplate(
	'<div class="x-list-header"><div class="x-list-header-inner">',
		'<tpl for="columns">',
		'<div style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on" id="{parent.id}-xlhd-{#}">',
			'{header}',
		'</em></div>',
		'</tpl>',
		'<div class="x-clear"></div>',
	'</div></div>',
	'<div class="x-list-body"><div class="x-list-body-inner">',
	'</div></div>'
);
Ext.list.ListView.prototype.tpl = new Ext.XTemplate(
	'<tpl for="rows">',
		'<dl>',
			'<tpl for="parent.columns">',
			'<dt style="width:{[values.width*100]}%;text-align:{align};"><em unselectable="on"',
				'<tpl if="cls"> class="{cls}"</tpl>',
				'>{[values.tpl.apply(parent)]}',
			'</em></dt>',
			'</tpl>',
			'<div class="x-clear"></div>',
		'</dl>',
	'</tpl>'
);
Ext.override(Ext.list.ListView, {
	collectData : function(){
		var rs = Ext.list.ListView.superclass.collectData.apply(this, arguments);
		return {
			columns: this.columns,
			rows: rs,
			id: this.id
		}
	}
});
Ext.menu.Item.prototype.itemTpl = new Ext.XTemplate(
	'<a id="{id}" class="{cls}" hidefocus="true" unselectable="on" href="{href}"',
		'<tpl if="hrefTarget">',
			' target="{hrefTarget}"',
		'</tpl>',
	 '>',
		 '<img src="{icon}" class="x-menu-item-icon {iconCls}">',
		 '<span class="x-menu-item-text">{text}</span>',
	 '</a>'
);
Ext.override(Ext.tree.TreePanel, {
	// make the TreePanel show it's hover highlighting correctly in all scroll positions
	initEvents: Ext.tree.TreePanel.prototype.initEvents.createSequence(function() {
		this.on('resize', this.setRootCtWidth, this);
		this.on('collapsenode', this.setRootCtWidth, this);
		this.on('expandnode', this.setRootCtWidth, this);
	}),
	setRootCtWidth: function() {
		var rct = this.getTreeEl().child('.x-tree-root-ct');
		rct.applyStyles({
			width: 'auto'
		});
		var w = rct.getWidth();
		if (w < this.getEl().getWidth()) {
			rct.applyStyles({
				width: '100%'
			});
			if (rct.getWidth() < w) {
				rct.applyStyles({
					width:  'auto'
				});
			}
		}
	}
});
/**
 * This override is needed for the custom styled checkbox in Ext.form.Fieldset with checkboxToggle=true.
 * For some reason, the checkbox look doesn't change if it is clicked. So we have to set the checked
 * attribute manually. This is the only override that is needed for styled checkboxes and radios.
 * Hopefully it can be left out sometime.
 * @hide 
 */
Ext.override(Ext.form.FieldSet, {
	onRender : Ext.form.FieldSet.prototype.onRender.createSequence(function() {
		if (this.checkbox && !this.collapsed) this.checkbox.dom.setAttribute('checked', 'checked');
	}),
	onCollapse : function(){
		if (this.checkbox) this.checkbox.dom.removeAttribute('checked');
		Ext.form.FieldSet.superclass.onCollapse.apply(this, arguments);
	},
	onExpand : function(){
		if (this.checkbox) this.checkbox.dom.setAttribute('checked', 'checked');
		Ext.form.FieldSet.superclass.onExpand.apply(this, arguments);
	}
});
// Build a font combo in HtmlEditor, because the default select list has messy scrollbars in Air 2.0
(function() {
	var tpl = new Ext.XTemplate('<tpl for="."><div class="x-combo-list-item" style="font-family: {text}">{text}</div></tpl>');
	Ext.override(Ext.form.HtmlEditor, {
		createToolbar: Ext.form.HtmlEditor.prototype.createToolbar.createSequence(function() {
			if (this.enableFont && !Ext.isSafari2) {
				this.tb.get(0).hide();
				var fontCombo = this.tb.insert(0, this.createFontCombo());
				fontCombo.on('select', function(c, r, i) {
					this.relayCmd('fontname', this.fontFamilies[i]);
					this.deferFocus();
				}, this);
				this.tb.doLayout();
			}
		}),
		createFontCombo: function() {
			var lc = [];
			Ext.each(this.fontFamilies, function(f) {
				lc.push(f.toLowerCase());
			});
			return new Ext.form.ComboBox({
				store: new Ext.data.ArrayStore({
					autoDestroy: true,
					idIndex: 0,
					data: Ext.zip(lc, this.fontFamilies),
					fields: ['value', 'text']
				}),
				triggerAction: 'all',
				mode: 'local',
				editable: false,
				forceSelection: true,
				autoWidth: true,
				value: this.defaultFont,
				tpl: tpl,
				valueField: 'value',
				displayField: 'text'
			});
		}
	});
})();
/**
 * @class Ext.state.FileProvider
 * @extends Ext.state.Provider
 * A Provider implementation which saves state to a json file in the users application storage directory.
 * <br />Usage:
 <pre><code>
   var cp = new Ext.state.FileProvider({
       file: "myState.json"
   });
   Ext.state.Manager.setProvider(cp);
 </code></pre>
 * @constructor
 * Creates a new FileProvider
 * @param {Object} config The configuration object
 */
Ext.state.FileProvider = function(config){
	Ext.state.FileProvider.superclass.constructor.call(this);
	
	Ext.apply(this, config);
	this.state = this.readState();
	
	air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, this.saveState.createDelegate(this));
};
Ext.extend(Ext.state.FileProvider, Ext.state.Provider, {
	/**
	 * @cfg {String} file
	 * The file name to use for the state file in the application storage directory
	 * (defaults to <code>extstate.json</code>).	 
	 */
	file: 'extstate.json',
	/**
	 * @cfg {Object} defaultState
	 * Default state information that is applied if there's no state information within the state file.
	 */
	defaultState: {},
	// private
	readState : function(){
		var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file),
			stateData;
		if(stateFile.exists) {
			var stream = new air.FileStream();
			stream.open(stateFile, air.FileMode.READ);
			stateData = Ext.decode(stream.readUTFBytes(stream.bytesAvailable));
			stream.close();
		}
		return Ext.apply({}, stateData || {}, this.defaultState || {});
	},
	// private
	saveState : function() {
		var stateFile = air.File.applicationStorageDirectory.resolvePath(this.file);
		var stream = new air.FileStream();
		stream.open(stateFile, air.FileMode.WRITE);
		stream.writeUTFBytes(Ext.encode(this.state));
		stream.close();
	}
});
// backwards compat
Ext.air.FileProvider = Ext.state.FileProvider;
/**
 * @class Ext.data.DB
 * @extends Ext.util.Observable
 * A base class to buid up connections to local databases 
 * @constructor
 * Creates a new database connection
 * @param {Object} config The configuration object
 */
Ext.data.DB = function(config){
	this.addEvents(
		/**
		 * @event open
		 * Fires when the database connection is established.
		 * @param {Ext.data.DB} this
		 */
		'open',
		/**
		 * @event error
		 * Fires if the connection to the database causes an error and cannot be established
		 * @param {Ext.data.DB} this
		 * @param {Object} error The error object. It can be air.SQLError, ArgumentError or IllegalOperationError
		 */
		'error',
		/**
		 * @event close
		 * Fires when the database connection becomes closed.
		 * @param {Ext.data.DB} this
		 */
		'close'
	);
	
	Ext.apply(this, config);
	Ext.data.DB.superclass.constructor.call(this);
};

Ext.extend(Ext.data.DB, Ext.util.Observable, {
	/**
	 * @cfg {Number} maxResults
	 * The maximum number of records that should be loaded in one query
	 * (defaults to <code>-1</code> which means no maximum).
	 */
	maxResults: -1,
	// private
	openState: false,

	// abstract methods
	open: Ext.emptyFn,
	close: Ext.emptyFn,
	exec: Ext.emptyFn,
	execBy: Ext.emptyFn,
	query: Ext.emptyFn,
	queryBy: Ext.emptyFn,
	createTable: Ext.emptyFn,

	/**
	 * Returns if the database connection is established.
	 * @return {Boolean}
	 */	 	 	
	isOpen: function(){
		return this.openState;
	},
	// private
	getTable : function(name, keyName){
		return new Ext.data.Table(this, name, keyName);
	}
});
// deprecated
Ext.data.DB.getInstance = function(config){
	return new Ext.data.SQLiteDB(config);
};
/**
 * @class Ext.data.SQLiteDB
 * @extends Ext.data.DB
 * A class to buid up connections to local SQLite databases 
 * @constructor
 * Creates a new connection to a SQLite database
 * @param {Object} config The configuration object
 */
Ext.data.SQLiteDB = function(config) {
	config = config || {};
	this.addEvents(
		/**
		 * @event sqlresult
		 * Fires if a sql statement executes successfully
		 * @param {Ext.data.SQLiteDB} this
		 * @param {Array} records The returned records on SELECT statements
		 * @param {Number} insertId The last auto generated row id generated by an INSERT statement
		 * @param {Number} affectedRows The number of rows affected by the last operation
		 * @param {air.SQLStatement} stmt The air SQLStatement object
		 */
		'sqlresult',
		/**
		 * @event sqlerror
		 * Fires if a sql statement causes an error and cannot be executed successfully
		 * @param {Ext.data.SQLiteDB} this
		 * @param {air.SQLError} error The air SQLError object
		 * @param {air.SQLStatement} stmt The air SQLStatement object
		 */
		'sqlerror'
	);
	
	/**
	 * @cfg {String} dbFile
	 * Define a database file, if the connection should be build up immediately
	 * (see {@link #open} for more information).
	 */
	Ext.data.SQLiteDB.superclass.constructor.call(this, config);
	this.conn = new air.SQLConnection();
	if (config.dbFile) this.open(config.dbFile);
};
Ext.extend(Ext.data.SQLiteDB, Ext.data.DB, {
	/**
	 * @cfg {String} mode
	 * An air.SQLMode to open the database.
	 * This can be <ul>
	 * <li><code>air.SQLMode.READ</code> to open a read-only connection</li>
	 * <li><code>air.SQLMode.CREATE</code> to open a connection for updates, auto creating
	 * the database file if it does not exist</li>
	 * <li><code>air.SQLMode.UPDATE</code> to open a connection for updates, but don't create
	 * the database file if it does not exist</li>
	 * </ul> Defaults to <code>air.SQLMode.UPDATE</code>.
	 */
	mode: air.SQLMode.UPDATE,
	/**
	 * @cfg {String} dateFormat
	 * The date format which is used to store dates in the database
	 * (defaults to <code>Y-m-d H:i:s</code>).
	 * It is used to format dates with {@link Date#format} before writing it to DB.	 
	 */
	dateFormat: 'Y-m-d H:i:s',
	/**
	 * @cfg {String} encryptionKey
	 * The encryption key for the database.
	 * (defaults to <code>null</code>).
	 * Set it to a string to use encryption. This string must contain 8-32 characters with
	 * at least one uppercase character, at least one lowercase letter and at least one number or symbol.<br />
	 * Make sure, you have the EncryptionKeyGenerator.swf file included.
	 * It can be found in the resources/swf directory.
	 */
	encryptionKey: null,
	/**
	 * @cfg {Number} pageSize
	 * Indicates the page size (in bytes) for the database.
	 * This parameter is only valid when creating a new database file or opening a database file
	 * in which no tables have been created. The value must be a power of two greater than or
	 * equal to 512 and less than or equal to 32768. The default value is <code>1024</code> bytes.
	 * This value can only be set before any tables are created.
	 * Once the tables are created attempting to change this value results in an error.
	 */
	pageSize: 1024,
	/**
	 * @cfg {Boolean} autoCompact
	 * Indicates whether unused space in the database is reclaimed automatically.
	 * This parameter is only valid when creating a new database file or opening
	 * a database file in which no tables have been created. By default,
	 * the space taken up by removed data is left in the database file and reused when needed.
	 * Setting this parameter to <code>true</code> causes the database to automatically
	 * reclaim unused space. This can negatively affect performance because it requires
	 * additional processing each time data is written to the database and can also cause
	 * the database data to become fragmented over time.
	 * To force the database to reclaim unused space in a database file at any time
	 * and to defragment the database file, use the compact() method on this.conn.<br />
	 * This parameter is ignored when {@link #mode} is <code>'read'</code>.
	 */
	autoCompact: false,	 
	/**
	 * Opens the connection to the specified file
	 * @param {String} dbFile The path to the database file to open. By default it is
	 * relatively to the application directory. Example usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	// relatively to the application directory
	dbFile: 'myDb.sqlite'
});
	 * </code></pre>But you can use database files in any other directory, too:<pre><code>
var conn = new Ext.data.SQLiteDB({
	// relatively to the application storage directory
	dbFile: air.File.applicationStorageDirectory.resolvePath('myDb.sqlite').nativePath
});
	 * </code></pre>
	 */
	open : function(dbFile){
		var file = Ext.isString(dbFile) ? air.File.applicationDirectory.resolvePath(dbFile) : dbFile,
			encKey = null;
		if (this.encryptionKey && !Ext.isEmpty(air.EncryptionKeyGenerator)) {
			if (Ext.isString(this.encryptionKey)) {
				var keyGen = new air.EncryptionKeyGenerator();
				if (keyGen.validateStrongPassword(this.encryptionKey)) {
					encKey = keyGen.getEncryptionKey(file, this.encryptionKey);
				}
			// this.encryptionKey is already a valid ByteArray
			} else if (typeof this.encryptionKey == 'object' && this.encryptionKey.bytesAvailable === 0 && this.encryptionKey.length === 16) {
				encKey = this.encryptionKey;
			}
		}
		this.openState = false;
		
		var openHandler = (function() {
			this.openState = true;
			this.fireEvent('open', this);
		}).createDelegate(this),
			errorHandler = (function(e) {
			this.fireEvent('error', this, e);
		}).createDelegate(this);
		this.conn.openAsync(file, this.mode, new air.Responder(openHandler, errorHandler), this.autoCompact, this.pageSize, encKey);
	},
	/**
	 * Closes the connection
	 */
	close: function() {
		this.conn.addEventListener(air.SQLEvent.CLOSE, (function(e) {
			this.openState = false;
			this.fireEvent('close', this);
		}).createDelegate(this));
		this.conn.close();
	},
	// private
	createCallback: function(type, stmt, callback, scope) {
		var _this = this;
		return function(e) {
			var success = !e.error,
				res = stmt.getResult(),
				o = {
					records: _this.readResults(res),
					insertId: res ? res.lastInsertRowID : null,
					affectedRows: res ? res.rowsAffected : null,
					error: e.error
				};
			if (Ext.isFunction(callback)) {
				callback.call(scope || _this, type, success, o, stmt, _this);
			}
			if (success) {
				_this.fireEvent('sqlresult', _this, o.records, o.insertId, o.affectedRows, stmt);
			} else _this.fireEvent('sqlerror', _this, o.error, stmt);
		};
	},
	/**
	 * Creates a new air.SQLStatement and applies a callback to it
	 * @param {String} type (optional) a type to identify the statement in the callback function
	 * @param {Function} callback (optional) a callback function to call on every execution success
	 * or error, which is done with the statement. The callback is called with the following arguments:<ul>
	 * <li><b>type</b>: {String}<div class="sub-desc">the defined type</div></li>
	 * <li><b>success</b>: {Boolean}<div class="sub-desc">true if the execution succeeded.</div></li>
	 * <li><b>result</b>: {Object}<div class="sub-desc">An object with the following properties:<ul>
	 * <li><b>records</b>: {Array}<div class="sub-desc">The requested records of a query</div></li>
	 * <li><b>insertId</b>: {Number}<div class="sub-desc">The id of an inserted record</div></li>
	 * <li><b>affectedRows</b>: {Number}<div class="sub-desc">The number of the affected rows</div></li>
	 * <li><b>error</b>: {Object}<div class="sub-desc">An air.SQLError object, if the request didn't succeed</div></li></ul></div>	 	 	 	 	 
	 * <li><b>stmt</b>: {Object}<div class="sub-desc">the air.SQLStatement object</div></li>
	 * <li><b>db</b>: {Object}<div class="sub-desc">this, the Ext.data.SQLiteDB instance</div></li></ul>
	 * @param {Object} scope (optional) the scope in which the callback should be called (default to <code>this</code>)
	 * @return {Object} The air.SQLStatement
	 */
	createStatement : function(type, callback, scope){
		var stmt = new air.SQLStatement();
		stmt.sqlConnection = this.conn;
		var cb = this.createCallback(type, stmt, callback, scope);
		stmt.addEventListener(air.SQLEvent.RESULT, cb);
		stmt.addEventListener(air.SQLErrorEvent.ERROR, cb);
		return stmt;
	},
	/**
	 * Executes a sql statement and calls the specified callback on success or error.
	 * Uses type 'exec'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.exec("SELECT * FROM myTable", function(type, success, result) {
	if (success) console.info(result.recods);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	exec: function(sql, callback, scope) {
		return this.execBy(sql, null, callback, scope);
	},
	/**
	 * Executes a sql statement with arguments and calls the specified callback on success or error.
	 * Uses type 'exec'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.execBy("SELECT * FROM myTable WHERE id = ?", [100], function(type, success, result) {
	if (success) console.info(result.records);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Array} args The arguments to use for the sql (in the right order)	 
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	execBy : function(sql, args, callback, scope) {
		var stmt = this.createStatement('exec', callback, scope);
		stmt.text = sql;
		this.addParams(stmt, args);
		stmt.execute();
		return stmt;
	},
	
	/**
	 * Executes a sql statement and calls the specified callback on success or error.
	 * this.maxResults is considered. Uses type 'query'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.exec("SELECT * FROM myTable", function(type, success, result) {
	if (success) console.info(result.recods);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	query : function(sql, callback, scope) {
		return this.queryBy(sql, null, callback, scope);
	},
	/**
	 * Executes a sql statement with arguments and calls the specified callback on success or error.
	 * this.maxResults is considered. Uses type 'query'.
	 * Usage:<pre><code>
var conn = new Ext.data.SQLiteDB({
	dbFile: 'myDb.sqlite'
});
conn.exec("SELECT * FROM myTable WHERE id = ?", [100], function(type, success, result) {
	if (success) console.info(result.recods);
});
	 * </code></pre>
	 * @param {String} sql The sql statement to execute
	 * @param {Array} args The arguments to use for the sql (in the right order)	 
	 * @param {Function} callback The callback function to call (see {@link Ext.data.SQLiteDB#createStatement})
	 * @param {Object} scope The scope of the callback
	 * @return {Object} the air.SQLStatement object
	 */
	queryBy : function(sql, args, callback, scope){
		var stmt = this.createStatement('query', callback, scope);
		stmt.text = sql;
		this.addParams(stmt, args);
		stmt.execute(this.maxResults);
		return stmt;
	},
	// private
	addParams : function(stmt, args){
		if(!args){ return; }
		for(var key in args){
			if(args.hasOwnProperty(key)){
				if(!isNaN(key)){
					var v = args[key];
					if(Ext.isDate(v)){
						v = v.format(this.dateFormat);
					}
					stmt.parameters[parseInt(key)] = v;
				}else{
					stmt.parameters[':' + key] = args[key];
				}
			}
		}
		return stmt;
	},
	// private
	readResults : function(rs){
		var r = [];
		if(rs && rs.data){
			var len = rs.data.length;
			for(var i = 0; i < len; i++) {
				r[r.length] = rs.data[i];
			}
		}
		return r;
	},
	// pivate
	createTable : function(o){
		var tableName = o.name,
			keyName = o.key,
			fs = o.fields,
			buf = [];
		if(!Ext.isArray(fs)) { // Ext fields collection
			fs = fs.items;
		}
		for (var i = 0, len = fs.length; i < len; i++) {
			var f = fs[i],
				m = s = f.mapping ? f.mapping : f.name,
				d = f.defaultValue,
				t = Ext.isObject(f.type) ? f.type.type : f.type;
			switch (t) {
				case "bool":
				case "boolean":
					if (d === 'false') d = false;
				case "int":
				case "integer":
					s += " INTEGER";
					break;
				case "float":
					s += " REAL";
					break;
				default:
					s += " TEXT";
					break;
			}
			if (f.allowNull === false || m == keyName) {
				s += " NOT NULL";
			}
			if (!Ext.isEmpty(d) || (d === "" && t == "string")) {
				s += " DEFAULT ";
				if (Ext.isString(d)) {
					s += "'" + d.split("'").join("''") + "'";
				} else if (Ext.isBoolean(d)) {
					s += (!d) ? "0" : "1";
				} else s += d;
			}
			if (m == keyName) {
				s += " PRIMARY KEY";
				if (f.autoIncrement === true && (t == "int" || t == "integer")) {
					s += " AUTOINCREMENT";
				}
			}
			if (f.unique === true) {
				s += " UNIQUE";
			}

			buf[buf.length] = s;
		}
		var sql = ["CREATE TABLE IF NOT EXISTS ", tableName, " (", buf.join(","), ")"].join("");
		this.exec(sql);
	}
});
/**
 * @class Ext.data.Table
 * A class to wrap a database table or view
 * @constructor
 * Creates a new Table instance
 * @param {Object} conn the database connection instance
 * @param {String} name the table or view name
 * @param {String} keyName the name of the table's or view's primary key field
 */
Ext.data.Table = function(conn, name, keyName){
	this.conn = conn;
	this.name = name;
	this.keyName = keyName;
};
Ext.data.Table.prototype = {
	/**
	 * Selects recordsets from the table filtered by the given clause.
	 * @param {String} clause A where clause (without "WHERE ").
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	select: function(clause, callback, scope) {
		return this.selectBy(clause, null, callback, scope);
	},
	/**
	 * Selects recordsets from the table filtered by the given clause.
	 * @param {String} clause A where clause (without "WHERE "). Use "?" to use an arguments of passed array.
	 * @param {Array} args An array of values that should be used with the clause
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	selectBy: function(clause, args, callback, scope) {
		var sql = "SELECT * FROM " + this.name;
		if(clause){
			sql += ' ' + clause;
		}
		args = args || [];
		return this.conn.queryBy(sql, args, callback, scope);
	},
	/**
	 * Inserts a new record with the specified values into the table.
	 * @param {Object} The data to add
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	insert: function(o, callback, scope) {
		var sql = "INSERT INTO " + this.name + " ";
		var fs = [], vs = [], a = [];
		for(var key in o){
			if(o.hasOwnProperty(key)){
				fs[fs.length] = key;
				vs[vs.length] = "?";
				a[a.length] = o[key];
			}
		}
		sql = [sql, "(", fs.join(","), ") VALUES (", vs.join(","), ")"].join("");
		return this.conn.execBy(sql, a, callback, scope);
	},
	/**
	 * Updates a recordset with the specified values.
	 * @param {Object} The data to apply (should contain the value of the table's keyName)
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	update: function(o, callback, scope) {
		var clause = this.keyName + " = ?";
		return this.updateBy(o, clause, [o[this.keyName]], callback, scope);
	},
	/**
	 * Updates a recordset with the specified values, clause and args.
	 * @param {Object} The data to apply
	 * @param {String} clause A where clause (without "WHERE "). Use "?" to use an arguments of passed array.
	 * @param {Array} args An array of values that should be used with the clause
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	updateBy : function(o, clause, args, callback, scope){
		var sql = "UPDATE " + this.name + " SET ";
		var fs = [], a = [];
		for(var key in o){
			if(o.hasOwnProperty(key)){
				fs[fs.length] = key + " = ?";
				a[a.length] = o[key];
			}
		}
		for(var key in args){
			if(args.hasOwnProperty(key)){
				a[a.length] = args[key];
			}
		}
		sql = [sql, fs.join(","), " WHERE ", clause].join("");
		return this.conn.execBy(sql, a, callback, scope);
	},
	/**
	 * Deletes recordsets from the table queried by the given clause.
	 * @param {String} clause A where clause (without "WHERE ").
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	remove: function(clause, callback, scope) {
		this.removeBy(clause, null, callback, scope);
	},
	/**
	 * Deletes recordsets from the table queried by the given clause.
	 * @param {String} clause A where clause (without "WHERE "). Use "?" to use an arguments of passed array.
	 * @param {Array} args An array of values that should be used with the clause
	 * @param {Function} callback (optional) see {@link Ext.data.SQLiteDB#createStatement}
	 * @param {Object} scope (optional) the callback's scope
	 * @return {Object} the air.SQLStatement instance for this insert
	 */
	removeBy: function(clause, args, callback, scope) {
		var sql = "DELETE FROM " + this.name;
		if(clause){
			sql += " WHERE " + clause;
		}
		args = args || {};
		this.conn.execBy(sql, args, callback, scope);
	}
};
/**
 * @class Ext.data.SQLiteProxy
 * @extends Ext.data.DataProxy
 * An implementation of {@link Ext.data.DataProxy} that reads from a SQLLite
 * database.
 * @constructor
 * Creates a new SQLiteProxy. 
 * @param {Object} config The configuration object 
 */
Ext.data.SQLiteProxy = function(config){
	/**
	 * @cfg {Object} conn
	 * An {@link Ext.data.SQLiteDB} database connection instance
	 */
	/**
	 * @cfg {String} dbFile
	 * A database file to open, if conn is not set
	 */
	/**
	 * @cfg {Object} api
	 * Specify, which CRUD action methods should be forwarded directly to the DB.
	 * Defaults to.<pre><code>
api: {
	read: true,
	create: true,
	update: true,
	destroy: true
}
	 * </code></pre>
	 * It is only needed to specify the actions, which should <u>not</u> be forwarded to the DB.
	 * <br /><br />
	 * If an action is set to <code>true</code> and a {@link Ext.data.DataWriter} is set to the store,
	 * inserted, updated or deleted store's records are also inserted/updated/deleted in the database.
	 */
	/**
	 * @cfg {Boolean} restful
	 * @hide
	 */
	config = config || {};
	Ext.apply(config, {
		restful: false,
		url: undefined,
		api: Ext.copyTo({
			read: true, create: true, update: true, destroy: true
		}, config.api || {}, 'read,create,update,destroy')
	});
	Ext.data.SQLiteProxy.superclass.constructor.call(this, config);
	if (!config.conn || config.dbFile) {
		this.conn = new Ext.data.SQLiteDB({
			dbFile: config.dbFile
		});
	} else this.conn = config.conn;
	
};
Ext.extend(Ext.data.SQLiteProxy, Ext.data.DataProxy, {
	/**
	 * SQLiteProxy implementation of DataProxy#doRequest
	 * @param {String} action The crud action type (create, read, update, destroy)
	 * @param {Ext.data.Record/Ext.data.Record[]} rs If action is load, rs will be null
	 * @param {Object} params An object containing properties which are used to buid up the
	 * sql query string, if action is load
	 * @param {Ext.data.DataReader} reader The Reader object which converts the data
	 * object into a block of Ext.data.Records.
	 * @param {Function} callback
	 * <div class="sub-desc"><p>A function to be called after the request.
	 * The <tt>callback</tt> is passed the following arguments:<ul>
	 * <li><tt>rs</tt> : Ext.data.Record[] The block of Ext.data.Records.</li>
	 * <li><tt>options</tt>: Options object from the action request</li>
	 * <li><tt>success</tt>: Boolean success indicator</li></ul></p></div>
	 * @param {Object} store The scope (<code>this</code> reference) in which the callback function is executed. It's the SQLiteStore.
	 * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
	 * @protected
	 */
	doRequest: function(action, rs, params, reader, callback, store, options) {
		// make sure, the connection is open
		if (!this.api[action]) return;
		if (!this.conn.isOpen()) {
			this.conn.on('open', function() {
				this.doRequest.call(this, action, rs, params, reader, callback, store, options);
			}, this, {single: true});
			return;
		}
		rs = (Ext.isArray(rs)) ? rs : [rs];
		
		this.dataStack = [];
		
		// reverse records since the batch queue in Ext.data.Store starts with the last record,
		// so ids would be vice-versa on inserts
		rs.reverse();
		
		switch (action) {
			// inserts
			case Ext.data.Api.actions.create:
			// updates
			case Ext.data.Api.actions.update:
				this.recordCounter = 0;
				var beginHandler = this.processNextRow.createDelegate(this, [action, rs, reader, callback, store, options]),
					errorHandler = this.handleError.createDelegate(this, [action, null, null, null, options, callback, store]);
				// handle insert and update statements within a transaction
				this.inTransaction = this.conn.conn.inTransaction;
				this.conn.conn[this.inTransaction ? 'setSavepoint' : 'begin'](null, new air.Responder(beginHandler, errorHandler));
				break;
			// deletes
			case Ext.data.Api.actions.destroy:
				var kn = store.table.keyName,
					i, len;
				for (i = 0, len = rs.length; i < len; i++) {
					this.recordCounter = rs.length;
					store.table.removeBy(kn + " = ?", [rs[i].id], this.createCallback(action, rs, {}, reader, callback, store, options), this);
				}
				break;
			// selects
			default:
				var sort = params[store.paramNames.sort],
					dir = params[store.paramNames.dir],
					start = params[store.paramNames.start],
					limit = params[store.paramNames.limit],
					group = params.groupBy,
					groupDir = params.groupDir,
					clause = params.clause || params.where || '',
					args = params.args || [],
					response = {};
				// do sorting by groupField and sort field
				if (group || sort) {
					clause += " ORDER BY ";
					if (group && group != sort) {
						clause += group + ' ' + groupDir + ', ';
					}
					clause += sort + ' ' + (dir || "ASC");
				}
				// limit the result
				if (limit) {
					this.conn.query("SELECT count(*) as count FROM " + store.table.name + clause, function(type, success, result, stmt, db) {
						if (!success) {
							this.handleError(action, result, stmt, db, options, callback, store);
							return;
						}
						clause += " LIMIT ";
						if (Ext.isNumber(start)) clause += start + ",";
						clause += limit;
						store.table.selectBy(clause, args, this.createCallback(action, result.records[0].count, null, reader, callback, store, options), this);
					}, this);
				} else store.table.selectBy(clause, args, this.createCallback(action, null, null, reader, callback, store, options), this);
				break;
		}
	},
	/**
	 * Inserts or updates the next record within a transaction
	 * @private
	 */
	processNextRow: function(action, rs, reader, callback, store, options) {
		var r = rs[this.recordCounter++],
			data,
			kn = store.table.keyName,
			changes;
		switch(action) {
			// insert
			case Ext.data.Api.actions.create:
				data = this.processData(r.data, reader);
				store.table.insert(data, this.createCallback(action, rs, r.data, reader, callback, store, options), this);
				break;
			// update
			case Ext.data.Api.actions.update:
				if (r.dirty) {
					changes = r.getChanges();
					data = this.processData(changes, reader);
					store.table.updateBy(data, kn + " = ?", [r.id], this.createCallback(action, rs, r.data, reader, callback, store, options), this);
				// skip un-dirty records
				} else processNextRow(action, store);
				break;
		}
	},
	// private
	handleError: function(action, result, stmt, db, options, callback, scope) {
		var fn = (function() {
			this.fireEvent('exception', this, 'response', action, result, stmt, db);
			callback.call(scope, null, options, false);
		}).createDelegate(this);
		// rollback the active transaction
		if (this.conn.conn.inTransaction) {
			if (this.inTransaction) {
				this.conn.conn.rollbackToSavepoint(null, new air.Responder(fn, fn));
			} else this.conn.conn.rollback(new air.Responder(fn, fn));
		} else fn();
	},
	// private
	createCallback : function(action, rs, data, reader, callback, scope, arg) {
		return function(type, success, result, stmt, db) {
			if (!success) {
				this.handleError(action, result, stmt, db, arg, callback, scope);
				return;
			}
			if (action === Ext.data.Api.actions.read) {
				var response = {};
				response[reader.meta.root] = result.records;
				// give total records to rs
				if (Ext.isNumber(rs)) response[reader.meta.totalProperty] = rs;
				this.onRead(action, response, reader, callback, scope, arg);
			} else {
				if (action === Ext.data.Api.actions.create) {
					data[reader.meta.idProperty] = result.insertId;
				}
				this.dataStack.push(data);
				if (this.recordCounter < rs.length) {
					this.processNextRow(action, rs, reader, callback, scope, arg);
				} else {
					var commitHandler = this.onWrite.createDelegate(this, [action, result, rs, this.dataStack, reader, callback, scope, arg]),
						errorHandler = this.handleError.createDelegate(this, [action, null, null, null, arg, callback, scope]);
					// commit the active transaction
					if (this.conn.conn.inTransaction) {
						if (this.inTransaction) {
							this.conn.conn.releaseSavepoint(null, new air.Responder(commitHandler, errorHandler));
						} else this.conn.conn.commit(new air.Responder(commitHandler, errorHandler));
					} else commitHandler();
				}
			}
		};
	},
	/**
	 * Callback for read action
	 * @param {String} action Action name as per {@link Ext.data.Api.actions#read}.
	 * @param {Object} response A build-up response object containing the records and totalProperty
	 * @param {Object} reader The Reader object which converts the data
	 * @param {Function} callback
	 * @param {Object} scope of the callback
	 * @param {Object} arg args to pass to the callback	 	 	 
	 * @fires load
	 * @protected
	 */
	onRead : function(action, response, reader, callback, scope, arg) {
		var result = reader.readRecords(response);
		this.fireEvent('load', this, response, arg);
		callback.call(scope, result, arg, true);
	},
	/**
	 * Callback for write actions
	 * @param {String} action [Ext.data.Api.actions.create|update|destroy]
	 * @param {Object} result The result object of the query
	 * @param {Ext.data.Record/Ext.data.Records[]} rs The record or an array of records being inserted/updated/deleted	 	 
	 * @param {Object} The data to apply to the records
	 * @param {Object} reader The Reader object which converts the data
	 * @param {Function} callback
	 * @param {Object} scope of the callback
	 * @param {Object} arg args to pass to the event listener	 	 	 
	 * @fires write
	 * @protected
	 */
	onWrite : function(action, result, rs, data, reader, callback, scope, arg) {
		var o = reader.extractData([].concat(data), false);
		this.fireEvent('write', this, action, o, result, rs, arg);
		callback.call(scope, o, result, true);
	},
	// private
	processData : function(data, reader) {
		var fs = reader.recordType.prototype.fields,
			r = {};
		for(var key in data) {
			var f = fs.key(key),
				k, v, t;
			if(f) {
				k = f.mapping ? f.mapping : f.name,
				v = data[key],
				t = Ext.isObject(f.type) ? f.type.type : f.type;
				switch (t) {
					case 'date':
						r[k] = v ? v.format(this.conn.dateFormat || 'Y-m-d H:i:s') : null;
						break;
					case 'bool':
					case 'boolean':
						r[k] = (!v || v === 'false') ? 0 : 1;
						break;
					case 'int':
					case 'integer':
						r[k] = parseInt(v);
						break;
					case 'float':
						r[k] = parseFloat(v);
						break;
					default:
						r[k] = v;
						break;
				}
			}
		}
		return r;
	},
	/**
	 * load
	 * @hide
	 */	 	 	
	load: Ext.emptyFn,
	/**
	 * buildUrl	
	 * @hide
	 */
	buildUrl: Ext.emptyFn
});
/**
 * @class Ext.data.SQLiteStore
 * @extends Ext.data.Store
 * Convenience class which assists in setting up SQLiteStore's.
 * This class stores recordsets from the given database table or view and writes
 * changes automatically to it, if {@link Ext.data.SQLiteStore#autoSave} is <code>true</code>.
 * This class requires that all fields stored in the database will also be kept
 * in the Ext.data.Store.
 * @constructor
 * Creates a new Ext.data.SQLiteStore
 * @param {Object} config The configuration object
 */
Ext.data.SQLiteStore = Ext.extend(Ext.data.Store, {
	/**
	 * @cfg {Boolean} autoSave
	 * <p>Defaults to <tt>true</tt> causing the store to automatically {@link #save} records to
	 * the database when a record is modified (ie: becomes 'dirty'). Specify <tt>false</tt> to manually call {@link #save}
	 * to send all modifiedRecords to the database.</p>
	 * <br><p><b>Note</b>: each CRUD action will be sent as a separate request.</p>
	 */
	autoSave: true,
	/**
	 * @cfg {String} idProperty
	 * This is the primary key for the table and the id for the Ext.data.Record
	 */
	/**
	 * @cfg {String} key
	 * <b>*deprecated</b> Backwards compat for {@link Ext.data.SQLiteStore#idProperty}
	 */
	/**
	 * @cfg {Array} fields
	 * An Array of {@link Ext.data.Field Field} definition objects
	 * (which will be passed to {@link Ext.data.Record#create}
	 */
	/**
	 * @cfg {Ext.data.JsonReader} reader
	 * (optional) A customized {@link Ext.data.JsonReader}
	 */
	/**
	 * @cfg {Ext.data.JsonWriter} writer
	 * (optional) A customized (@link Ext.data.JsonWriter}
	 */
	/**
	 * @cfg {Ext.data.SQLiteProxy} proxy
	 * (optional) A customized {@link Ext.data.SQLiteProxy}
	 */
	/**
	 * @cfg {Ext.data.SQLiteDB} conn
	 * (optional) A SQLiteDB connection instance
	 */
	/**
	 * @cfg {String} dbFile
	 * (optional) A database file to open with the SQLiteDB connection.
	 * Should be defined, if {@link Ext.data.SQLiteStore#conn} is not defined.
	 */
	/**
	 * @cfg {Object} api
	 * An {Ext.data.SQLiteProxy#api} object, which defines the CRUD actions to handle with the db
	 * Only the false properties need to be defined.
	 */
	/**
	 * @cfg {String} tableName
	 * The name of the database table or view, from which to read the records or from which to write changes.
	 */
	/**
	 * @cfg {Boolean} autoCreateTable
	 * <code>true</code> to automatically create the database table with the given {@link #tableName}
	 * if it does not exist (defaults to <code>false</code>).
	 */
	/**
	 * @cfg {Boolean} remoteSort
	 * @hide
	 */
	/**
	 * @cfg {Boolean} batch
	 * @hide
	 */
	/**
	 * @cfg {Boolean} restful
	 * @hide
	 */
	constructor: function(config) {
		config = config || {};
		var idProperty = config.idProperty || config.key || this.idProperty || this.key;
		
		// always use batch:true since we're using database transactions
		config.batch = true;
		config.restful = false;
		
		if (!config.reader) {
			config.reader = new Ext.data.JsonReader({
				idProperty: idProperty,
				fields: config.fields || this.fields,
				root: '__root__',
				totalProperty: '__total__',
			});
		}
		
		if (!config.writer) {
			config.writer = new Ext.data.JsonWriter({
				encode: false
			});
		}
		
		if (!config.proxy) {
			config.proxy = new Ext.data.SQLiteProxy(Ext.copyTo({}, config, 'conn,dbFile,api'));
		}
		delete config.conn;
		delete config.dbFile;
		
		Ext.data.SQLiteStore.superclass.constructor.call(this, config);
		
		if (this.autoCreateTable === true) {
			var ct = function() {
				this.proxy.conn.createTable({
					name: this.tableName,
					key: idProperty,
					fields: this.reader.recordType.prototype.fields
				});
			};
			if (this.proxy.conn.isOpen()) {
				ct.call(this);
			} else this.proxy.conn.on('open', ct, this, {single: true});
		}
		
		this.table = this.proxy.conn.getTable(this.tableName, idProperty);
		
		// prevent temporary removed records from being loaded on store reload
		this.on('beforeload', function(s, o) {
			if (!Ext.isEmpty(this.removed)) {
				var rIds = [];
				Ext.each(this.removed, function(r) {
					rIds.push(r.id);
				});
				var q = String.leftPad('', rIds.length, "?");
				q = q.split("").join(",");
				Ext.apply(o.params, {
					where: idProperty + " NOT IN (" + q + ")",
					args: rIds
				});
			}
		}, this);
	}
});
/**
 * @class Ext.data.GroupingSQLiteStore
 * @extends Ext.data.GroupingStore
 * A specialized store implementation that provides for grouping records by one of the available fields.
 * The records are returned by a SQLite database. 
 * This is usually used in conjunction with an {@link Ext.grid.GroupingView} to proved the data model for
 * a grouped GridPanel.
 * @constructor
 * Creates a new GroupingSQLiteStore.
 * @param {Object} config A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
Ext.data.GroupingSQLiteStore = Ext.extend(Ext.data.GroupingStore, {
	/**
	 * @cfg {Boolean} autoSave
	 * <p>Defaults to <tt>true</tt> causing the store to automatically {@link #save} records to
	 * the database when a record is modified (ie: becomes 'dirty'). Specify <tt>false</tt> to manually call {@link #save}
	 * to send all modifiedRecords to the database.</p>
	 * <br><p><b>Note</b>: each CRUD action will be sent as a separate request.</p>
	 */
	autoSave: true,
	/**
	 * @cfg {String} idProperty
	 * This is the primary key for the table and the id for the Ext.data.Record
	 */
	/**
	 * @cfg {String} key
	 * <b>*deprecated</b> Backwards compat for {@link Ext.data.SQLiteStore#idProperty}
	 */
	/**
	 * @cfg {Array} fields
	 * An Array of {@link Ext.data.Field Field} definition objects
	 * (which will be passed to {@link Ext.data.Record#create}
	 */
	/**
	 * @cfg {Ext.data.JsonReader} reader
	 * (optional) A customized {@link Ext.data.JsonReader}
	 */
	/**
	 * @cfg {Ext.data.JsonWriter} writer
	 * (optional) A customized (@link Ext.data.JsonWriter}
	 */
	/**
	 * @cfg {Ext.data.SQLiteProxy} proxy
	 * (optional) A customized {@link Ext.data.SQLiteProxy}
	 */
	/**
	 * @cfg {Ext.data.SQLiteDB} conn
	 * (optional) A SQLiteDB connection instance
	 */
	/**
	 * @cfg {String} dbFile
	 * (optional) A database file to open with the SQLiteDB connection.
	 * Should be defined, if {@link Ext.data.SQLiteStore#conn} is not defined.
	 */
	/**
	 * @cfg {Object} api
	 * An {Ext.data.SQLiteProxy#api} object, which defines the CRUD actions to handle with the db
	 * Only the false properties need to be defined.
	 */
	/**
	 * @cfg {String} tableName
	 * The name of the database table or view, from which to read the records or from which to write changes.
	 */
	/**
	 * @cfg {Boolean} autoCreateTable
	 * <code>true</code> to automatically create the database table with the given {@link #tableName}
	 * if it does not exist (defaults to <code>false</code>).
	 */
	/**
	 * @cfg {Boolean} remoteSort
	 * @hide
	 */
	/**
	 * @cfg {Boolean} batch
	 * @hide
	 */
	/**
	 * @cfg {Boolean} restful
	 * @hide
	 */
	constructor: function(config) {
		config = config || {};

		//We do some preprocessing here to massage the grouping + sorting options into a single
		//multi sort array. If grouping and sorting options are both presented to the constructor,
		//the sorters array consists of the grouping sorter object followed by the sorting sorter object
		//see Ext.data.Store's sorting functions for details about how multi sorting works
		this.hasMultiSort  = true;
		this.multiSortInfo = this.multiSortInfo || {sorters: []};

		var sorters	= this.multiSortInfo.sorters,
			groupField = config.groupField || this.groupField,
			sortInfo   = config.sortInfo || this.sortInfo,
			groupDir   = config.groupDir || this.groupDir;

		//add the grouping sorter object first
		if(groupField){
			sorters.push({
				field	: groupField,
				direction: groupDir
			});
		}

		//add the sorting sorter object if it is present
		if (sortInfo) {
			sorters.push(sortInfo);
		}

		Ext.data.SQLiteStore.prototype.constructor.call(this, config);

		this.addEvents(
			'groupchange'
		);

		this.applyGroupField();
	}
});
/**
 * @class Ext.tree.LocalTreeLoader
 * @extends Ext.tree.TreeLoader
 * A TreeLoader, that provides for lazy loading of {@link Ext.tree.TreeNode}'s child
 * nodes via a specified function  
 * @constructor
 * Creates a new LocalTreeloader.
 * @param {Object} config A config object containing config properties.
 */
Ext.tree.LocalTreeLoader = Ext.extend(Ext.tree.TreeLoader, {
	/**
	 * @cfg {Function} dataFn
	 * Method that should be overridden to load child nodes on the current node.
	 * @param {Object} node The current node, on which the function is called
	 * @return {Array} Array of child nodes	 
	 */
	dataFn: Ext.emptyFn,
	// private
	requestData: function(node, callback, scope) {
		if (this.fireEvent("beforeload", this, node, callback) !== false) {
			var response = (this.dataFn || this.fn).call(this, node);
			this.processResponse(response, node, callback, scope);
			this.fireEvent("load", this, node, response);
		} else this.runCallback(callback, scope || node, []);
	},
	// private
	processResponse: function(response, node, callback, scope) {
		// response is an array!
		try {
			node.beginUpdate();
			for (var i = 0, len = response.length; i < len; i++) {
				var n = this.createNode(response[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [node]);
		} catch(e) {
			this.handleFailure({
				argument: {
					node: node,
					callback: callback,
					scope: scope
				},
				response: response
			});
		}
	},
	// private
	load: function(node, callback, scope){
		if (this.clearOnLoad) {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
		}
		if (this.doPreload(node)) { // preloaded json children
			this.runCallback(callback, scope || node, [node]);
		} else if (this.dataFn || this.fn) {
			this.requestData(node, callback, scope || node);
		}
	}		
});
/**
 * @class Ext.tree.FileTreeLoader
 * @extends Ext.tree.LocalTreeLoader
 * A TreeLoader, that provides lazy loading of {@link Ext.tree.TreeNode}'s child
 * nodes from a specified directory on the file system.  
 * @constructor
 * Creates a new FileTreeloader.
 * @param {Object} config A config object containing config properties.
 */
Ext.tree.FileTreeLoader = function(config) {
	Ext.tree.FileTreeLoader.superclass.constructor.call(this, config);
	if (!this.directory) this.directory = air.File.desktopDirectory;
};
Ext.extend(Ext.tree.FileTreeLoader, Ext.tree.LocalTreeLoader, {
	/**
	 * @cfg {air.File} directory
	 * An air.File instance which specifies the root folder of the tree.
	 * Can be null, if you define the attribute "url" of the root node
	 * (what is recommended). Set it to <code>'root'</code> if you want to load the
	 * air.File.getRootDirectories() as first level. On Windows, these directories
	 * are applied under the root node. On Linux and Max, there's only one root directory '/'.
	 * That's why setting directory to <code>'root'</code> will display the first level
	 * under '/' as first level under the root directory.
	 */
	/**
	 * @cfg {Boolean} showHidden
	 * True to show hidden files and directories, false to not show them
	 * (defaults to <code>false</code>).
	 */
	showHidden: false,
	/**
	 * @cfg {Array/String/Boolean} extensionFilter
	 * An extension or an array of extensions (lowercase), that files should have,
	 * if they should be displayed, or false, if all files should be displayed
	 * (defaults to <code>false</code>).
	 */
	extensionFilter: false,
	/**
	 * @cfg {Boolean} dirOnly
	 * <code>true</code> to allow only directories to be displayed
	 * (defaults to <code>false</code>).
	 */
	dirOnly: false,
	/**
	 * @cfg {Array/String} skipNames
	 * A file or directory name or an array of file or directory names,
	 * that should not be displayed (defaults to <code>[]</code>).
	 * e.g.:	 
	 * <pre><code>['System Volume Information', 'RECYCLER', '$RECYCLE.BIN']</code></pre>
	 */
	skipNames: [],
	/**
	 * @cfg {Boolean} checkLeaf
	 * <code>true</code> to check directories for child nodes and hide the expand icon,
	 * if there aren't childs (defaults to <code>false</code>, which alwasy displays
	 * the expand icon initially, but increases performance).
	 */
	checkLeaf: false,
	/**
	 * Override this method to apply custom attributes to the given Ext.tree.TreeNode config option object.
	 * This is called for every node that becomes loaded by this Loader.
	 * By default this returns an object with the following properties:<div class="mdetail-params"><ul>
	 * <li><b>text</b>: The filename/directory name of this node</li>
	 * <li><b>url</b>: The url to this file/directory</li>
	 * <li><b>cls</b>: <code>'hidden'</code> if this file/directory is hidden, otherwise <code>''</code></li>
	 * <li><b>iconCls</b>:<ul>
	 * <li><code>'drive'</code> if it is a windows root directory</li>
	 * <li><code>'folder'</code> if it is a directory</li>
	 * <li><code>'file-&lt;extension&gt;'</code> for each file with its extension (lowercase)</li>
	 * <li><code>'file'</code> for files without extension</li></ul>
	 * <li><b>extension</b>: The file extension</li>
	 * <li><b>leaf</b>: True if it is a file or leaf directory (and {@link #checkLeaf} is true), otherwise false</li>
	 * </ul></div>
	 * @param {Object} node The node config option object to which you can apply custom attributes.
	 * This object already contains the attributes described above.
	 * @param {air.File} file The file/directory instance of this node
	 * @return {Object} The new config option object	 
	 */
	applyAttributes: function(node, file) {
		return node;
	},
	// private
	getNodeConfig: function(file, isWinRoot) {
		return this.applyAttributes({
			text: file.name,
			url: file.url,
			cls: file.isHidden ? 'hidden' : '',
			iconCls: isWinRoot ? 'drive' : (file.isDirectory ? 'folder' : 'file' + (file.extension ? '-' + file.extension.toLowerCase() : '')), // set icon to "folder" or "file-..." (e.g. "file-mp3") to allow easy custom icon css
			extension: file.extension,
			leaf: !file.isDirectory
		}, file);
	},
	// private
	onDirectoryListing: function(o, e) {
		var c = e.files,
			i,
			len = c.length,
			files = [];
		o.total = len;
		for (i = 0; i < len; i++) {
			if (this.isValidFile(c[i], o.isWinRoot)) {
				if (this.checkLeaf === true && c[i].isDirectory) {
					c[i].addEventListener(air.FileListEvent.DIRECTORY_LISTING, this.onCheckLeafListing.createDelegate(this, [o, files, c[i]], 0));
					c[i].getDirectoryListingAsync();
				} else {
					files.push(this.getNodeConfig(c[i], o.isWinRoot));
					if (files.length >= o.total) this.fireLoad(files, o.node, o.callback, o.scope);
				}
			} else {
				o.total--;
				if (files.length >= o.total) this.fireLoad(files, o.node, o.callback, o.scope);
			}
		}
	},
	// private
	onCheckLeafListing: function(o, files, file, e) {
		var c = e.files,
			len = c.length,
			j, leaf = true;
		for (j = 0; j < len; j++) {
			if (this.isValidFile(c[j], o.isWinRoot)) {
				leaf = false;
				break;
			}
		}
		files.push(Ext.apply(this.getNodeConfig(file, o.isWinRoot), {
			leaf: leaf
		}));
		if (files.length >= o.total) this.fireLoad(files, o.node, o.callback, o.scope);
	},
	/**
	 * checks, if the file or directory should be displayed
	 * @private		 
	 */
	isValidFile: function(file, isWinRoot) {
		return this.skipNames.indexOf(file.name) == -1 && (file.isDirectory || ((this.extensionFilter === false || this.extensionFilter.indexOf(Ext.value(file.extension, '').toLowerCase()) != -1) && this.dirOnly === false)) && (!file.isHidden || isWinRoot || this.showHidden === true);
	},
	// private
	requestData: function(node, callback, scope) {
		if (this.fireEvent("beforeload", this, node, callback) !== false) {
			(this.dataFn || this.fn).call(this, node, callback, scope);
		} else this.runCallback(callback, scope || node, []);
	},
	// private
	fireLoad: function(files, node, callback, scope) {
		this.processResponse(files, node, callback, scope);
		this.fireEvent("load", this, node, files);
	},
	// private
	dataFn: function(currNode, callback, scope) {
		var currDir,
			o = { // Object since it is needed for total (Objects are references, Numbers not)
				node: currNode,
				callback: callback,
				scope: scope,
				isWinRoot: false
			};
		
		if (currNode.attributes.url === '/' || currNode.attributes.url === 'file:///' || (Ext.isEmpty(currNode.attributes.url) && this.directory === '/')) {
			if (Ext.isWindows) {
				o.isWinRoot = true;
			} else currDir = air.File.getRootDirectories()[0];
		} else {
			if (currNode.attributes.url) {
				currDir = new air.File(currNode.attributes.url);
			} else currDir = this.directory.clone();
		}
		// make sure, extensionFilter and skipNames are arrays
		if (!Ext.isArray(this.extensionFilter) && this.extensionFilter !== false) this.extensionFilter = [this.extensionFilter];
		if (!Ext.isArray(this.skipNames)) this.skipNames = [this.skipNames];
		
		if (o.isWinRoot) {
			c = air.File.getRootDirectories();
			this.onDirectoryListing(o, {
				files: c
			});
		} else {
			currDir.addEventListener(air.FileListEvent.DIRECTORY_LISTING, this.onDirectoryListing.createDelegate(this, [o], 0));
			currDir.getDirectoryListingAsync();
		}
	}
});
/**
 * @class Ext.air.App
 * Provides quick access to application functions and objects
 * @singleton
 */
Ext.air.App = function() {
	return {
		/**
		 * Define, if the Application should autostart at os login.
		 * @param {Boolean} launch <code>true</code> to autostart the app at next os login,
		 * <code>false</code> to not autostart it
		 */
		launchOnStartup: function(launch) {
			air.NativeApplication.nativeApplication.startAtLogin = !!launch;
		},
		/**
		 * Define, if the Application should automatically exit, if the last window is closed.
		 * @param {Boolean} autoExit <code>true</code> to autoExit, if all windows are closed,
		 * <code>false</code> to not keep the app open
		 */
		autoExit: function(autoExit) {
			air.NativeApplication.nativeApplication.autoExit = !!autoExit;
		},
		/**
		 * Returns the active NativeWindow
		 * @return {Object} The active NativeWindow
		 */
		getActiveWindow: function() {
			return air.NativeApplication.nativeApplication.activeWindow;
		},
		/**
		 * Returns the NativeApplication object of the current app
		 * @return {Object} NativeApplication
		 */
		getNativeApplication: function() {
			return air.NativeApplication.nativeApplication;
		},
		/**
		 * Returns the first opened window in your application (main window)
		 * @return {Object} air.NativeWindow
		 */
		getRootWindow: function() {
			return air.NativeApplication.nativeApplication.openedWindows[0];
		},
		/**
		 * Returns the javascript "window" object of the first opened window in your application
		 * @return {Object} window
		 */
		getRootHtmlWindow: function() {
			return Ext.air.App.getRootWindow().stage.getChildAt(0).window;
		}
	};
}();
/**
 * @class Ext.air.DragType
 * Drag drop type constants
 * @singleton
 */
Ext.air.DragType = {
	/**
	 * Constant for text data
	 */
	TEXT : 'text/plain',
	/**
	 * Constant for html data
	 */
	HTML : 'text/html',
	/**
	 * Constant for url data
	 */
	URL : 'text/uri-list',
	/**
	 * Constant for bitmap data
	 */
	BITMAP : 'image/x-vnd.adobe.air.bitmap',
	/**
	 * Constant for file list data
	 */
	FILES : 'application/x-vnd.adobe.air.file-list'
};
/**
 * @class Ext.air.Clipboard
 * @singleton
 * Allows you to manipulate the native system clipboard and handle various formats.
 * This class is essentially a passthrough to air.Clipboard.generalClipboard at this
 * time, but may get more Ext-like functions in the future.
 *
 * The Clipboard has different types which it can hold:
 * CONSTANT - value
 * air.ClipboardFormats.TEXT_FORMAT - air:text
 * air.ClipboardFormats.HTML_FORMAT - air:html
 * air.ClipboardFormats.RICH_TEXT_FORMAT - air:rtf
 * air.ClipboardFormats.URL_FORMAT - air:url
 * air.ClipboardFormats.FILE_LIST_FORMAT - air:file list
 * air.ClipboardFormats.BITMAP_FORMAT - air:bitmap
 */
Ext.air.Clipboard = function() {
	var clipboard = air.Clipboard.generalClipboard;
	
	return {
		/**
		 * Determine if there is any data in a particular format clipboard.
		 * @param {String} format Use the air.ClipboardFormats CONSTANT or the string value
		 */
		hasData: function(format) {
			return clipboard.hasFormat(format);
		},
		/**
		 * Set the data for a particular format clipboard.
		 * @param {String} format Use the air.ClipboardFormats CONSTANT or the string value
		 * @param {Mixed} data Data to set 
		 */
		setData: function(format, data) {
			clipboard.setData(format, data);
		},
		/**
		 * Set the data handler for a particular format clipboard.
		 * @param {String} format Use the air.ClipboardFormats CONSTANT or the string value
		 * @param {Function} fn The function to evaluate when getting the clipboard data
		 */
		setDataHandler: function(format, fn) {
			clipboard.setDataHandler(format, fn);
		},
		/**
		 * Get the data for a particular format.
		 * @param {String} format Use the air.ClipboardFormats CONSTANT or the string value
		 * @param {String} transferMode 
		 */
		getData: function(format, transferMode) {
			clipboard.getData(format, transferMode);
		},
		/**
		 * Clear the clipboard for all formats.
		 */
		clear: function() {
			clipboard.clear();
		},
		/**
		 * Clear the data for a particular format.
		 * @param {String} format Use the air.ClipboardFormats CONSTANT or the string value
		 */
		clearData: function(format) {
			clipboard.clearData(format);
		}
	};
}();
/**
 * @class Ext.air.MenuItem
 * Ability to bind native menu items to an Ext.Action
 * @constructor
 * Creates a new NativeMenuItem based on a given Ext.Action
 * 
 * @method
 * @param {Object} action An Ext.Action instance
 * or an Ext.action config object, if a new Ext.Action should be created
 */
Ext.air.MenuItem = function(action){
	if(!action.isAction){
		action = new Ext.Action(action);
	}
	var cfg = action.initialConfig;
	var nativeItem = new air.NativeMenuItem(cfg.itemText || cfg.text);
	
	nativeItem.enabled = !cfg.disabled;

	if(!Ext.isEmpty(cfg.checked)){
		nativeItem.checked = cfg.checked;
	}

	var handler = cfg.handler;
	var scope = cfg.scope;
	
	nativeItem.addEventListener(air.Event.SELECT, function(){
		handler.call(scope || window, cfg);
	});
	
	action.addComponent({
		setDisabled : function(v){
			nativeItem.enabled = !v;
		},
		
		setText : function(v){
			nativeItem.label = v;
		},
		
		setVisible : function(v){
			// could not find way to hide in air so disable?
			nativeItem.enabled = !v;
		},
		
		setHandler : function(newHandler, newScope){
			handler = newHandler;
			scope = newScope;
		},
		// empty function
		on : function(){}
	});
	
	return nativeItem;
};
/**
 * @class Ext.air.SystemMenu
 * 
 * Provides platform independent handling of adding item to the application menu, creating the menu or 
 * items as needed. <br/><br/>
 * 
 * This class also provides the ability to bind standard Ext.Action instances with NativeMenuItems
 * 
 * @singleton
 */
Ext.air.SystemMenu = function(){
	var menu;
	// windows
	if(air.NativeWindow.supportsMenu && nativeWindow.systemChrome != air.NativeWindowSystemChrome.NONE) {
		menu = new air.NativeMenu();
		nativeWindow.menu = menu;
	}
	
	// mac
	if(air.NativeApplication.supportsMenu) {
		menu = air.NativeApplication.nativeApplication.menu;
	}

	function find(menu, text){
		for(var i = 0, len = menu.items.length; i < len; i++){
			if(menu.items[i]['label'] == text){
				return menu.items[i];
			}
		}
		return null;
	}

	return {
		/**
		 * Add items to one of the application menus
		 * @param {String} text The application menu to add the actions to (e.g. 'File' or 'Edit').
		 * @param {Array} actions An array of Ext.Action objects or menu item configs
		 * @param {Number} mindex The index of the character in "text" which should be used for 
		 * keyboard access
		 * @return air.NativeMenu The raw submenu
		 */
		add: function(text, actions, mindex){

			var item = find(menu, text);
			if(!item){
				item = menu.addItem(new air.NativeMenuItem(text));
				item.mnemonicIndex = mindex || 0;

				item.submenu = new air.NativeMenu();
			}
			for (var i = 0, len = actions.length; i < len; i++) {
				item.submenu.addItem(actions[i] == '-' ? new air.NativeMenuItem("", true) : Ext.air.MenuItem(actions[i]));
			}
			return item.submenu;
		},
		
		/**
		 * Returns the application menu
		 */
		get : function(){
			return menu;
		}
	};	
}();
/**
 * @class Ext.air.SystemTray
 * A class to provide functions to handle the appearance
 * of the system tray icon for this app.
 * @singleton
 */
Ext.air.SystemTray = function(){
	var app = air.NativeApplication.nativeApplication;
	var icon, isWindows = false, bitmaps;
	
	// windows
	if(air.NativeApplication.supportsSystemTrayIcon) {
		icon = app.icon;
		isWindows = true;
	}
	
	// mac
	if(air.NativeApplication.supportsDockIcon) {
		icon = app.icon;
	}
	
	return {
		/**
		 * Sets the Icon and tooltip for the currently running application in the
		 * SystemTray or Dock depending on the operating system.
		 * @param {String} icon Icon to load with a URLRequest
		 * @param {String} tooltip Tooltip to use when mousing over the icon
		 * @param {Boolean} initWithIcon Boolean to initialize with icon immediately
		 */
		setIcon : function(trayIcon, tooltip, initWithIcon){
			if(!icon || !trayIcon){ // not supported OS
				return;
			}
			var loader = new air.Loader();
			loader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, function(e){
				bitmaps = new runtime.Array(e.target.content.bitmapData);
				if (initWithIcon) {
					icon.bitmaps = bitmaps;
				}
			});
			loader.load(new air.URLRequest(trayIcon));
			if(tooltip && air.NativeApplication.supportsSystemTrayIcon) {
				app.icon.tooltip = tooltip;
			}
		},
		/**
		 * Bounce the OS X dock icon. Accepts a priority to notify the user
		 * whether the event which has just occurred is informational (single bounce)
		 * or critcal (continual bounce).
		 * @param priority {air.NotificationType} The priorities are air.NotificationType.INFORMATIONAL and air.NotificationType.CRITICAL.
		 */
		bounce : function(priority){
			icon.bounce(priority);
		},
		
		on : function(eventName, fn, scope){
			icon.addEventListener(eventName, function(){
				fn.apply(scope || this, arguments);
			});
		},
		/**
		 * Hide the custom icon
		 */
		hideIcon : function(){
			if(!icon){ // not supported OS
				return;
			}
			icon.bitmaps = [];
		},
		/**
		 * Show the custom icon
		 */
		showIcon : function(){
			if(!icon){ // not supported OS
				return;
			}
			icon.bitmaps = bitmaps;
		},
		/**
		 * Sets a menu for the icon
		 * @param {Array} actions Configurations for Ext.air.MenuItem's
		 */
		setMenu: function(actions, _parentMenu){
			if(!icon){ // not supported OS
				return;
			}
			var menu = new air.NativeMenu();
			
			for (var i = 0, len = actions.length; i < len; i++) {
				var a = actions[i];
				if(a == '-'){
					menu.addItem(new air.NativeMenuItem("", true));
				}else{
					var item = menu.addItem(Ext.air.MenuItem(a));
					if(a.menu || (a.initialConfig && a.initialConfig.menu)){
						item.submenu = Ext.air.SystemTray.setMenu(a.menu || a.initialConfig.menu, menu);
					}
				}
				
				if(!_parentMenu){
					icon.menu = menu;
				}
			}
			
			return menu;
		}
	};	
}();
/**
 * @class Ext.air.Sound
 * 
 * @singleton
 */
Ext.air.Sound = {
	/**
	 * Play a sound.
	 * @param {String} file The file to be played. The path is resolved against applicationDirectory
	 * @param {Number} startAt (optional) A time in the sound file to skip to before playing 
	 */
	play : function(file, startAt){
		var soundFile = air.File.applicationDirectory.resolvePath(file);
		var sound = new air.Sound();
		sound.load(new air.URLRequest(soundFile.url));
		sound.play(startAt);
	}
};
/**
 * @class Ext.air.MusicPlayer
 * @extends Ext.util.Observable
 * A class, which provides methods to play music files
 * @constructor
 * Creates a new MusicPlayer instance.
 * @param {Object} config A config object containing config properties.
 */
Ext.air.MusicPlayer = function(config) {
	config = config || {};
	Ext.apply(this, config);
	
	this.addEvents(
		/**
		 * @event stop
		 * Fires when the sound playing was stopped
		 * @param {Object} this
		 */
		'stop',
		/**
		 * @event pause
		 * Fires when the sound pauses
		 * @param {air.SoundChannel} activeChannel {@link #activeChannel}
		 * @param {air.Sound} activeSound {@link #activeSound}
		 * @param {Number} pos The position in milliseconds where the sound was paused
		 */
		'pause',
		/**
		 * @event play
		 * Fires when the sound starts playing
		 * @param {air.SoundChannel} activeChannel {@link #activeChannel}
		 * @param {air.Sound} activeSound {@link #activeSound}
		 */
		'play',
		/**
		 * @event load
		 * Fires when the sound is loaded
		 * @param {air.SoundChannel} activeChannel {@link #activeChannel}
		 * @param {air.Sound} activeSound {@link #activeSound}
		 */
		'load',
		/**
		 * @event id3info
		 * Fires when new ID3-Information is available on sound load
		 * @param {air.Sound.id3} id3 ID3 information object
		 */
		'id3info',
		/**
		 * @event complete
		 * Fires when the sound finished playing
		 * @param {Object} event The air soundComplete event object
		 */
		'complete',
		/**
		 * @event progress
		 * Fires when the sound plays and a new progress operation is executed (see {@link #progressInterval})
		 * @param {air.SoundChannel} activeChannel {@link #activeChannel}
		 * @param {air.Sound} activeSound {@link #activeSound}
		 */
		'progress',
		/**
		 * @event skip
		 * Fires when the sound position is skipped
		 */
		'skip'
	);
	
	Ext.air.MusicPlayer.superclass.constructor.call(this, config);
	this.onSoundFinishedDelegate = this.onSoundFinished.createDelegate(this);
	this.onSoundLoadDelegate = this.onSoundLoad.createDelegate(this);
	this.onSoundID3LoadDelegate = this.onSoundID3Load.createDelegate(this);

	Ext.TaskMgr.start({
		run: this.notifyProgress,
		scope: this,
		interval: this.progressInterval
	});
};
Ext.extend(Ext.air.MusicPlayer, Ext.util.Observable, {
	/**
	 * The currently active Sound. Read-only.
	 * @type air.Sound
	 * @property activeSound
	 */
	activeSound: null,
	/**
	 * The currently active SoundChannel. Read-only.
	 * @type air.SoundChannel
	 * @property activeChannel
	 */
	activeChannel: null,
	/**
	 * The currently active Transform. Read-only.
	 * @type air.SoundTransform
	 * @property activeTransform
	 */
	activeTransform: new air.SoundTransform(1, 0),
	// private 
	pausePosition: 0,
	/**
	 * @cfg {Number} progressInterval
	 * How often to fire the progress event when playing music in milliseconds
	 * Defaults to 500.
	 */
	progressInterval: 500,

	/**
	 * Adjust the volume
	 * @param {Number} percent
	 * Ranges from 0 to 1 specifying volume of sound.
	 */
	adjustVolume: function(percent) {
		this.activeTransform.volume = percent;
		if (this.activeChannel) {
			this.activeChannel.soundTransform = this.activeTransform;
		}
	},
	/**
	 * Stop the player
	 */
	stop: function() {
		this.pausePosition = 0;
		if (this.activeChannel) {
			this.activeChannel.stop();
			this.activeChannel = null;
		}
		if (this.activeSound) {
			this.activeSound.removeEventListener(air.Event.COMPLETE, this.onSoundLoadDelegate);
			this.activeSound.removeEventListener(air.Event.ID3, this.onSoundID3LoadDelegate);
			this.activeSound.removeEventListener(air.Event.SOUND_COMPLETE, this.onSoundFinishedDelegate);
		}
		this.fireEvent('stop', this);
	},
	/**
	 * Pause the player if there is an activeChannel
	 */
	pause: function() {
		if (this.activeChannel) {
			this.pausePosition = this.activeChannel.position;
			this.activeChannel.stop();
			this.fireEvent('pause', this.activeChannel, this.activeSound, this.pausePosition);
		}
	},
	/**
	 * Play a sound, if no url is specified will attempt to resume the activeSound
	 * @param {String} url (optional)
	 * Url resource to play
	 */
	play: function(url) {
		if (url) {
			this.stop();
			var req = new air.URLRequest(url);
			this.activeSound = new air.Sound();
			this.activeSound.addEventListener(air.Event.SOUND_COMPLETE, this.onSoundFinishedDelegate);
			this.activeSound.addEventListener(air.Event.COMPLETE, this.onSoundLoadDelegate);
			this.activeSound.addEventListener(air.Event.ID3, this.onSoundID3LoadDelegate);
			this.activeSound.load(req);
		} else {
			this.onSoundLoad();
		}
		this.fireEvent('play', this.activeChannel, this.activeSound);
	},
	
	/**
	 * Skip to a specific position in the song currently playing.
	 * @param {Object} pos
	 */
	skipTo: function(pos) {
		if (this.activeChannel) {
			this.activeChannel.stop();
			this.activeChannel = this.activeSound.play(pos);
			this.activeChannel.soundTransform = this.activeTransform;
			this.fireEvent('skip', this.activeChannel, this.activeSound, pos);
		}
	},
	
	/**
	 * Returns whether or not there is an active SoundChannel.
	 */
	hasActiveChannel: function() {
		return !!this.activeChannel;
	},
	
	// private
	onSoundLoad: function(event) {
		if (this.activeSound) {
			if (this.activeChannel) {
				this.activeChannel.stop();
			}
			this.activeChannel = this.activeSound.play(this.pausePosition);
			this.activeChannel.soundTransform = this.activeTransform;
			this.fireEvent('load', this.activeChannel, this.activeSound);
		}
	},
	// private
	onSoundFinished: function(event) {
		// relay AIR event
		this.fireEvent('complete', event);
	},
	// private
	onSoundID3Load: function(event) {
		this.activeSound.removeEventListener(air.Event.ID3, this.onSoundID3LoadDelegate);
		var id3 = event.target.id3;		
		this.fireEvent('id3info', id3);
	},
	// private
	notifyProgress: function() {
		if (this.activeChannel && this.activeSound) {
			var playbackPercent = 100 * (this.activeChannel.position / this.activeSound.length);
			// SOUND_COMPLETE does not seem to work consistently.
			if (playbackPercent > 99.7) {
				this.onSoundFinished();
			} else {
				this.fireEvent('progress', this.activeChannel, this.activeSound);
			}
		}
	}
});
/**
 * @class Ext.air.VideoPanel
 * @extends Ext.Panel
 * A Panel, which loads a video from a specified url
 * @constructor
 * Creates a new VideoPanel.
 * @param {Object} config A config object containing config properties.
 */
Ext.air.VideoPanel = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {Boolean} autoResize
	 * <code>true</code> to auto resize the video if the panel is resized
	 * (defaults to <code>true</code>).
	 */
	autoResize: true,
	/**
	 * @cfg {String} url
	 * The url to load the video from
	 */

	// private
	initComponent: function() {
		var connection = new air.NetConnection();
		connection.connect(null);
	
		this.stream = new air.NetStream(connection);
		this.stream.client = {
			onMetaData: Ext.emptyFn
		};
		Ext.air.VideoPanel.superclass.initComponent.call(this);
		this.on('bodyresize', this.onVideoResize, this);
	},
	// private
	afterRender: function() {
		Ext.air.VideoPanel.superclass.afterRender.call(this);
		(function() {
				var box = this.body.getBox();
				this.video = new air.Video(this.getInnerWidth(), this.getInnerHeight());
				if (this.url) {
					this.video.attachNetStream(this.stream);
					this.stream.play(this.url);
				}
				nativeWindow.stage.addChild(this.video);
				this.video.x = box.x;
				this.video.y = box.y;
		}).defer(500, this);
	},
	
	// private
	onVideoResize: function(pnl, w, h) {
		if (this.video && this.autoResize) {
				var iw = this.getInnerWidth();
				var ih = this.getInnerHeight();
				this.video.width = iw
				this.video.height = ih;
				var xy = this.body.getXY();
				if (xy[0] !== this.video.x) {
						this.video.x = xy[0];
				}
				if (xy[1] !== this.video.y) {
						this.video.y = xy[1];
				}
		}
	},
	/**
	 * Loads a video from a given url
	 * @param {String} url The url to load the video from
	 */
	loadVideo: function(url) {
		this.stream.close();
		this.video.attachNetStream(this.stream);
		this.stream.play(url);		
	}
});
Ext.reg('videopanel', Ext.air.VideoPanel);
/**
 * @class Ext.air.NativeObservable
 * @extends Ext.util.Observable
 * Adds ability for Ext Observable functionality to proxy events for native (AIR) object wrappers
 * @deprecated 
 * @constructor
 */
Ext.air.NativeObservable = Ext.extend(Ext.util.Observable, {
	addListener : function(name){
		this.proxiedEvents = this.proxiedEvents || {};
		if(!this.proxiedEvents[name]){
			var instance = this;
			var f = function(){
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(name);
				instance.fireEvent.apply(instance, args);
			};
			this.proxiedEvents[name] = f;
			this.getNative().addEventListener(name, f);
		}
		Ext.air.NativeObservable.superclass.addListener.apply(this, arguments);
	}
});
Ext.air.NativeObservable.prototype.on = Ext.air.NativeObservable.prototype.addListener;
/**
 * @class Ext.air.NativeWindow
 * @extends Ext.util.Observable
 * Wraps the AIR NativeWindow class to give an Ext friendly API. <br/><br/>This class also adds 
 * automatic state management (position and size) for the window (by id) and it can be used 
 * for easily creating "minimize to system tray" for the main window in your application.<br/><br/>
 * Note: Many of the config options for this class can only be applied to NEW windows. Passing 
 * in an existing instance of a window along with those config options will have no effect.
 * @constructor
 * @param {Object} config Config options for the window
 */
Ext.air.NativeWindow = function(config) {
	config = config || {};
	Ext.apply(this, config);

	this.id = this.id || Ext.id();
	this.openedWindows = [];
	
	this.addEvents(
		/**
		 * @event complete
		 * Fires once after the window has been loaded completely
		 * @param {Ext.air.NativeWindow} this
		 */
		'complete',
		/**
		 * @event activate
		 * Fires after the window has been activated
		 * @param {Ext.air.NativeWindow} this
		 */
		'activate',
		/**
		 * @event deactivate
		 * Fires after the window has been deactivated
		 * @param {Ext.air.NativeWindow} this
		 */
		'deactivate',
		/**
		 * @event beforeclose
		 * Fires before the window is closed. If a handler returns false, the close operation is canceled.
		 * @param {Ext.air.NativeWindow} this
		 */
		'beforeclose',
		/**
		 * @event close
		 * Fires after the window is closed.
		 * @param {Ext.air.NativeWindow} this
		 */
		'close',
		/**
		 * @event beforehide
		 * Fires before the window is hidden. If a handler returns false, the hide operation is canceled.
		 * @param {Ext.air.NativeWindow} this
		 */
		'beforehide',
		/**
		 * @event hide
		 * Fires after the window is hidden.
		 * @param {Ext.air.NativeWindow} this
		 */
		'hide',
		/**
		 * @event beforeshow
		 * Fires before the window is shown. If a handler returns false, the show operation is canceled.
		 * @param {Ext.air.NativeWindow} this
		 */
		'beforeshow',
		/**
		 * @event show
		 * Fires after the window is shown.
		 * @param {Ext.air.NativeWindow} this
		 */
		'show',
		/**
		 * @event maximize
		 * Fires after the window has been maximized.
		 * @param {Ext.air.NativeWindow} this
		 */
		'maximize',
		/**
		 * @event minimize
		 * Fires after the window has been minimized.
		 * @param {Ext.air.NativeWindow} this
		 */
		'minimize',
		/**
		 * @event restore
		 * Fires after the window has been restored to its original size after being maximized.
		 * @param {Ext.air.NativeWindow} this
		 */
		'restore',
		/**
		 * @event titlechange
		 * Fires after the window title has changed.
		 * @param {Ext.air.NativeWindow} this
		 * @param {String} title The new window title
		 */
		'titlechange',
		/**
		 * @event move
		 * Fires after the window has moved.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Number} x the new x position
		 * @param {Number} y the new y position	
		 */
		'move',
		/**
		 * @event resize
		 * Fires after the window has been resized.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Number} width the new width of this window
		 * @param {Number} height the new height of this window	
		 */
		'resize',
		/**
		 * @event beforestaterestore
		 * Fires before the state of the window is restored. Return false from an event handler to stop the restore.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values returned from the StateProvider. If this
		 * event is not vetoed, then the state object is passed to <b><tt>applyState</tt></b>. By default,
		 * that simply copies property values into this Component. The method maybe overriden to
		 * provide custom state restoration.
		 */
		'beforestaterestore',
		/**
		 * @event staterestore
		 * Fires after the state of the window is restored.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values returned from the StateProvider. This is passed
		 * to <b><tt>applyState</tt></b>. By default, that simply copies property values into this
		 * Component. The method maybe overriden to provide custom state restoration.
		 */
		'staterestore',
		/**
		 * @event beforestatesave
		 * Fires before the state of the window is saved to the configured state provider. Return false to stop the save.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values. This is determined by calling
		 * <b><tt>getState()</tt></b> on the Ext.air.NativeWindow.
		 */
		'beforestatesave',
		/**
		 * @event statesave
		 * Fires after the state of the window is saved to the configured state provider.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Object} state The hash of state values. This is determined by calling
		 * <b><tt>getState()</tt></b> on the Ext.air.NativeWindow.
		 */
		'statesave',
		/**
		 * @event fullscreen
		 * Fires after the the window entered or left fullscreen mode.
		 * @param {Ext.air.NativeWindow} this
		 * @param {Boolean} fullscreen True, if the window entered fullscreen mode, false if it left fullscreen mode.
		 */
		'fullscreen'
	);
	
	Ext.air.NativeWindow.superclass.constructor.call(this, config);
	
	// creating new NativeWindow
	if(!this.win){
		
		if (!Ext.isDefined(this.file) && !Ext.isDefined(this.html)) {
			this.queryFiles();
		}
		
		var options = new air.NativeWindowInitOptions();
		options.systemChrome = (this.type == air.NativeWindowType.LIGHTWEIGHT) ? air.NativeWindowSystemChrome.NONE : this.systemChrome;
		options.type = this.type;
		options.resizable = !!this.resizable;
		options.minimizable = !!this.minimizable;
		options.maximizable = !!this.maximizable;
		options.transparent = !!this.transparent && (this.systemChrome != air.NativeWindowSystemChrome.STANDARD);
		this.loader = air.HTMLLoader.createRootWindow(false, options, false);
		// if trusted and Air >= 1.5, allow css and script access
		if (this.trusted === true && !Ext.isAir1) this.loader.placeLoadStringContentInApplicationSandbox = true;
		if (this.file) {
			this.loader.load(new air.URLRequest(this.file));	
		} else {
			this.loader.loadString(this.html || '');
		}
		this.win = this.loader.window.nativeWindow;
	} else {
		Ext.apply(this, {
			loader: this.win.stage.getChildAt(0),
			maximizable: this.win.maximizable,
			minimizable: this.win.minimizable,
			resizable: this.win.resizable,
			minWidth: Ext.isNumber(config.minWidth) ? config.minWidth : this.win.minSize.x,
			minHeight: Ext.isNumber(config.minHeight) ? config.minHeight : this.win.minSize.y,
			maxWidth: Ext.isNumber(config.maxWidth) ? config.maxWidth : this.win.maxSize.x,
			maxHeight: Ext.isNumber(config.maxHeight) ? config.maxHeight : this.win.maxSize.y
		});
		Ext.applyIf(this, {
			width: this.win.width,
			height: this.win.height,
			x: this.win.x,
			y: this.win.y
		});
	}

	// restore state
	if (this.stateful !== false) {
		this.initState();
	}
	
	this.toggleAlwaysInFront(this.alwaysInFront);
	
	// set min and max sizes
	this.win.minSize = new air.Point(
		Ext.isNumber(this.minWidth) ? Math.max(0, this.minWidth) : 200,
		Ext.isNumber(this.minHeight) ? Math.max(0, this.minHeight) : 100
	);
	this.win.maxSize = new air.Point(
		Ext.isNumber(this.maxWidth) ? Math.max(0, this.maxWidth) : air.NativeWindow.systemMaxSize.x,
		Ext.isNumber(this.maxHeight) ? Math.max(0, this.maxHeight) : air.NativeWindow.systemMaxSize.y
	);
	
	// restore saved position and size
	var width = (this.width || 0).constrain(this.win.minSize.x, this.win.maxSize.x),
		height = (this.height || 0).constrain(this.win.minSize.y, this.win.maxSize.y);
	this.setSize(width, height);
	this.center().setPosition(this.x || this.win.x, this.y || this.win.y);
	
	this.on('complete', this.ensureActive, this, {single: true});
	
	// Functions for applyParentWindow
	this.closeOnParentFn = (function() {
		this.parentWin.removeEventListener(air.Event.CLOSE, this.closeOnParentFn);
		this.close();
	}).createDelegate(this);
	this.activateModalOnParentFn = (function() {
		if (this.modal && this.isVisible()) this.setActive(true);
	}).createDelegate(this);
	this.activateParentOnCloseFn = (function() {
		this.parentWin.removeEventListener(air.Event.ACTIVATE, this.activateModalOnParentFn);
		if (this.modal) this.parentWin.activate();
	}).createDelegate(this);
	this.parentWin = null;
	this.applyParentWindow(this.parent);
	
	this.initEvents();
	// register in manager
	if (!this.manager) {
		try { // try to use one Manager for all windows, no matter in what window they were opened
			this.manager = Ext.air.App.getRootHtmlWindow().Ext.air.NativeWindowManager;
		} catch(e) {
			this.manager = Ext.air.NativeWindowManager;
		}
	}
	this.manager.register(this);
	
	if(this.minimizeToTray) {
		this.initMinimizeToTray(this.trayIcon, this.trayMenu);
	}
};
Ext.extend(Ext.air.NativeWindow, Ext.util.Observable, {
	/**
	 * @cfg {air.NativeWindow/Boolean} parent
	 * The parent window that should be applied to this window. See {@link #applyParentWindow} for more information.
	 * Defaults to <code>undefined</code>.
	 */
	/**
	 * @cfg {Boolean} destroyOnParentClose
	 * True to destroy this window, if its parent window (current active window when this window is created)
	 * is closed (defaults to <code>true</code>). This is useful for windows with {@link #closeAction} 'hide'.
	 */
	/**
	 * @cfg {Number} height
	 * The height of this window.
	 */
	/**
	 * @cfg {Number} width
	 * The width of this window.
	 */
	/**
	 * @cfg {Number} x
	 * The X position of the left edge of the window on initial showing.
	 * Defaults to centering the Window within the width of the desktop.
	 */
	/**
	 * @cfg {Number} y
	 * The Y position of the top edge of the window on initial showing.
	 * Defaults to centering the Window within the height of the desktop.
	 */
	/**
	 * @cfg {String} title
	 * The title to display in the window header and taskbar button.
	 */
	/**
	 * @cfg {String} html
	 * A html string, that should be used as the window's content, if {@link #file}
	 * is not defined. Defaults to an empty string <code>''</code>.
	 */
	/**
	 * @cfg {String} file
	 * (optional) An url to a file, that should be loaded as the window's content.
	 */
	/**
	 * @cfg {Object} fileQuery
	 * If you don't specify the config options {@link #file} and {@link #html}, you have the possibility
	 * to query for default JavaScript and CSS files from the current document and include them
	 * in the new window's document. fileQuery is expected as Object with the following properties:
	 * <div class="mdetail-params"><ul>
	 * <li><b>type</b>: String (required)<div class="sub-desc">The type of functionality to query for the files.
	 * It can be:<ul>
	 * <li><code>main</code><div class="sub-desc">Use the current main file from application.xml as {@link #file}
	 * property and add the current window id as "window" property in querystring (e.g. main.html?window=myWindowId).</div></li>
	 * <li><code>queryExtJS</code><div class="sub-desc">Include all CSS and JavaScript files which belong
	 * to the ExtJS Framework. It includes ext-base.js, ext-basex.js, ext-all.js, ext-all.css and all debug versions
	 * of these files as well as ext-lang files.</div></li>
	 * <li><code>queryExtAIR</code><div class="sub-desc">Include all CSS and JavaScript files which belong
	 * to the ExtAir adapter. It includes AIRAliases.js, AIRIntrospector.js, ext-air.js, ext-air-debug.js, ext-air.css
	 * and all ext-air language files.</div></li>
	 * <li><code>queryExt</code><div class="sub-desc">Like "queryExtJS" AND "queryExtAIR".</div></li>
	 * <li><code>queryRegex</code><div class="sub-desc">Include all CSS and JavaScript files that match the
	 * given regular expression. This requires a "regex" property.</div></li>
	 * <li><code>queryAttribute</code><div class="sub-desc">Include all CSS and JavaScript files that contain the
	 * given attribute in "ext" namespace. This requires an "attribute" property.<br />
	 * E.g. if attribute is <code>'window_required'</code>, all files with <code>ext:window_required="true"</code>
	 * are included, like<br />
	 * <code>&lt;script type="text/javascript" src="ext-all.js" ext:window_required="true"&gt;&lt;/script&gt;</code>.</div></li>
	 * <li><code>querySelector</code><div class="sub-desc">Include all CSS and JavaScript files that match the
	 * given {@link Ext.DomQuery} selector. This requires a "selector" property.</div></li>
	 * <li><code>queryAll</code><div class="sub-desc">Includes all CSS and JavaScript files from the current document.</div></li>
	 * </ul></li>
	 * <li><b>regex</b>: RegExp (required if type is "queryRegex")<div class="sub-desc">A regular expression, that files should
	 * match, if they should be included.</div></li>
	 * <li><b>attribute</b>: String	 (required if type is "queryAttribute")<div class="sub-desc">An attribute name
	 * that all files should have in the "ext" namespace with a "true" value if they should be included
	 * (see <code>type</code> for more information).</div></li>
	 * <li><b>selector</b>: String (required if type is "querySelector")<div class="sub-desc">An {@link Ext.DomQuery} selector
	 * that files should match, if they should be included.</div></li>
	 * <li><b>css</b>: Boolean<div class="sub-desc"><code>false</code> if CSS files should not be included
	 * (defaults to <code>true</code>).</div></li>
	 * <li><b>js</b>: Boolean<div class="sub-desc"><code>false</code> if JavaScript files should not be included
	 * (defaults to <code>true</code>).</div></li>
	 * <li><b>root</b>: Node/String<div class="sub-desc">An optional start node (or id) for all query-types
	 * (defaults to the current document).</div></li>
	 * <li><b>include</b>: Array/String<div class="sub-desc">An optinal single or an array of additional
	 * js and css files to include after the queried files (if type != 'main').</div></li>
	 * <li><b>bodyHtml</b>: String<div class="sub-desc">An optional html string to load load as content
	 * into the the &lt;body&gt;-tag (Defaults to <code>''</code>)</div></li></ul></div>
	 * Defaults to <pre><code>
{
	type: 'queryExt',
	root: Ext.air.App.getRootHtmlWindow().document
}
	 * </code></pre>
	 */
	// do not include this in docs currently, it is used for XLayer, maybe the fileQuery option there can be changed in a better way
	// <li><b>includeAllCSS</b>: Boolean (for "queryExtJS", "queryExtAIR", "queryExt" or "queryRegex")<div class="sub-desc"><code>true</code> to include all CSS files and style tags regardless of the given regex or Ext belonging</div></li>
	fileQuery: {
		type: 'queryExt',
		root: Ext.air.App.getRootHtmlWindow().document
	},
	/**
	 * @cfg {air.NativeWindow} win
	 * (optional) You can define a native window instance, if you want to wrap an existing one into
	 * an Ext.air.Window. Use this especially for the root window. If you define this property, you have
	 * to make sure, that the ext library is already loaded. There's no need for the {@link #file} property
	 * in that case. Example Usage:<pre><code>
var win = new Ext.air.Window({
	win: window.nativeWindow,
	stateId: 'mainwindow',
	border: true,
	title: 'Main Window',
	html: 'This is my little window.'
});
	 * </code></pre>
	 */
	/**
	 * @cfg {String} id
	 * The unique id of this window (defaults to an auto-assigned id).
	 * You should assign an id if you need to be able to access the window later
	 * via its manager and you do not have an object reference available.
	 */
	/**
	 * @cfg {Ext.air.NativeWindowGroup} manager
	 * A reference to the NativeWindowGroup that should manage this window
	 * (defaults to {@link Ext.air.NativeWindowManager}).
	 */
	/**
	 * @cfg {Number} minHeight
	 * The minimum height in pixels allowed for this window (defaults to 100).
	 */
	minHeight: 100,
	/**
	 * @cfg {Number} minWidth
	 * The minimum width in pixels allowed for this window (defaults to 200).
	 */
	minWidth: 200,
	/**
	 * @cfg {Number} maxHeight
	 * The maximum height in pixels allowed for this window (defaults to air.NativeWindow.systemMaxSize.y).
	 */
	maxHeight: air.NativeWindow.systemMaxSize.y,
	/**
	 * @cfg {Number} maxWidth
	 * The maximum width in pixels allowed for this window (defaults to air.NativeWindow.systemMaxSize.x).
	 */
	maxWidth: air.NativeWindow.systemMaxSize.x,
	/**
	 * @cfg {Boolean} alwaysInFront
	 * True if this window should always stay in front of other windows (including other applications)
	 * (defaults to <code>false</code>)
	 */
	alwaysInFront: false,
	/**
	 * @cfg {Boolean} closable
	 * True to allow the user to close the window, false to disallow it (defaults to <code>true</code>).
	 * This can not disable or hide the close button in standard-chrome windows.
	 * However, calling the Window's '{@link #close}'-method will close the window.
	 * To make closing a Window <i>hide</i> the Window so that it may be reused,
	 * set {@link #closeAction} to <code>'hide'</code>.
	 */
	closable: true,
	/**
	 * @cfg {String} closeAction
	 * <p>The action to take when the close header button is clicked:
	 * <div class="mdetail-params"><ul>
	 * <li><b><code>'{@link #close}'</code></b> : <b>Default</b><div class="sub-desc">
	 * {@link #close} the window, so that it will <b>not</b> be available to be
	 * redisplayed via the {@link #show} method.
	 * </div></li>
	 * <li><b><code>'{@link #hide}'</code></b> : <div class="sub-desc">
	 * {@link #hide} the window by setting air.NativeWindow.visible to false.
	 * The window will be available to be redisplayed via the {@link #show} method.
	 * </div></li>
	 * </ul></div>
	 * <p><b>Note:</b> This setting does not affect the {@link #close} method
	 * which will always {@link #close} the window. To
	 * programatically <i>hide</i> a window, call {@link #hide}.</p>
	 */
	closeAction: 'close',
	/**
	 * @cfg {Boolean} draggable
	 * False to prevent the user from moving the window by dragging the header
	 * (defaults to <code>true</code>).
	 */
	draggable: true,
	/**
	 * @cfg {Boolean} hidden
	 * True to init this window hidden, false to show it immediately after it is available.
	 * (defaults to <code>true</code>).
	 */
	hidden: true,
	/**
	 * @cfg {Boolean} maximizable
	 * True to allow the user to maximize the window, false to disallow it (defaults to <code>false</code>).
	 */
	maximizable: false,
	/**
	 * @cfg {Boolean} maximized
	 * True to initially display the window in a maximized state. (Defaults to <code>false</code>).
	 */
	maximized: false,
	/**
	 * @cfg {Boolean} minimizable
	 * True to allow the user to minimize the window, false to disallow it (defaults to <code>false</code>).
	 */
	minimizable: false,
	/**
	 * @cfg {Boolean} modal
	 * True to make the window modal and do not allow the user to click any other element on the desktop.
	 * False to display it without restricting access to other UI elements (defaults to false).
	 */
	modal: false,
	/**
	 * @cfg {Boolean} resizable
	 * True to allow user resizing at each edge and corner of the window,
	 * false to disable resizing (defaults to <code>true</code>).
	 */
	resizable: true,
	/**
	 * @cfg {String} systemChrome
	 * The NativeWindow chrome (defaults to 'standard', can also be 'none').
	 */
	systemChrome: air.NativeWindowSystemChrome.STANDARD,
	/**
	 * @cfg {String} type
	 * The NativeWindow type (defaults to 'normal', can also be 'utility' or 'lightweight').
	 */
	type: air.NativeWindowType.NORMAL,
	/**
	 * @cfg {Boolean} transparent
	 * True if the window should have a transparent background. Could only be true,
	 * if {@link #systemChrome} is <code>none</code> (defaults to <code>false</code>).
	 */
	transparent: false,
	/**
	 * @cfg {Boolean} minimizeToTray
	 * True to enable minimizing to the system tray. Note: this should only be applied
	 * to the primary window in your application. A trayIcon is required.<br />
	 * If you use this on the root window, specify &lt;visible&gt;false&lt;/visible&gt; in your application descriptor file
	 * and show it programmatically via {@link #setActive setActive(true)}. Otherwise, for some reason, the window pops up again,
	 * if it is minimized the first time. Currently there's no other workaroung for this.
	 */
	minimizeToTray: false,
	/**
	 * @cfg {String} trayIcon
	 * The url to an icon to display in the system tray if {@link #minimizeToTray} is true.
	 */
	trayIcon: null,
	/**
	 * @cfg {Ext.air.SystemMenu} trayMenu
	 * (optional) A menu to display on system tray click.
	 */
	trayMenu: null,
	/**
	 * @cfg {String} trayTip
	 * (optional) A tooltip to display, if the user hovers the system tray icon,
	 * if the window is minimized and {@link minimizeToTray} is true.
	 */
	trayTip: null,
	/**
	 * @cfg {Boolean} stateful
	 * <p>A flag which causes the window to attempt to restore the state of
	 * internal properties from a saved state on startup. The window must have
	 * either a <code>{@link #stateId}</code> or <code>{@link #id}</code> assigned
	 * for state to be managed. Auto-generated ids are not guaranteed to be stable
	 * across page loads and cannot be relied upon to save and restore the same
	 * state for this window.<p>
	 * <p>For state saving to work, the state manager's provider must have been
	 * set to an implementation of {@link Ext.state.Provider} which overrides the
	 * {@link Ext.state.Provider#set set} and {@link Ext.state.Provider#get get}
	 * methods to save and recall name/value pairs. An implementation for AIR,
	 * {@link Ext.state.FileProvider} is available.</p>
	 * <p>To set the state provider for the current page:</p>
	 * <pre><code>
Ext.state.Manager.setProvider(new Ext.state.FileProvider());
	 * </code></pre>
	 * <p>A stateful window attempts to save state when one of the events
	 * listed in the <code>{@link #stateEvents}</code> configuration fires.</p>
	 * <p>To save state, a stateful window first serializes its state by
	 * calling <b><code>getState</code></b>. By default, this function returns the
	 * window size and position and its maximized state. You can override this method
	 * to return other/additional information which represents the window's
	 * restorable state.</p>
	 * <p>The value yielded by getState is passed to {@link Ext.state.Manager#set}
	 * which uses the configured {@link Ext.state.Provider} to save the object
	 * keyed by the Component's <code>{@link stateId}</code>, or, if that is not
	 * specified, its <code>{@link #id}</code>.</p>
	 * <p>During construction, a stateful widnow attempts to <i>restore</i>
	 * its state by calling {@link Ext.state.Manager#get} passing the
	 * <code>{@link #stateId}</code>, or, if that is not specified, the
	 * <code>{@link #id}</code>.</p>
	 * <p>The resulting object is passed to <b><code>applyState</code></b>.
	 * The default implementation of <code>applyState</code> simply copies
	 * properties into the object, but a developer may override this to support
	 * more behaviour.</p>
	 * <p>You can perform extra processing on state save and restore by attaching
	 * handlers to the {@link #beforestaterestore}, {@link #staterestore},
	 * {@link #beforestatesave} and {@link #statesave} events.</p>
	 */
	stateful: true,
	/**
	 * @cfg {String} stateId
	 * The unique id for this window to use for state management purposes
	 * (defaults to the window's {@link #id} if one was set, otherwise null if the
	 * window is using a generated id).
	 * <p>See <code>{@link #stateful}</code> for an explanation of saving and
	 * restoring a window state.</p>
	 */
	/**
	 * @cfg {Array} stateEvents
	 * <p>An array of events that, when fired, should trigger this window to
	 * save its state (defaults to ['{@link #move}', '{@link #resize}']).
	 * <code>stateEvents</code> may be any type of event supported by this window,
	 * including browser or custom events (e.g., <tt>['click', 'customerchange']</tt>).</p>
	 * <p>See <code>{@link #stateful}</code> for an explanation of saving and
	 * restoring a window state.</p>
	 */
	stateEvents: ['move', 'resize'],
	/**
	 * @cfg {Boolean} trusted
	 * True to allow filesystem access (e.g. load css files) and access to the window.runtime
	 * object, if it is needed in the content loaded via the {@link #html} config option.
	 * If true, this sets <code>true</code> to the HTMLLoader's placeLoadStringContentInApplicationSandbox
	 * property and the content loaded via the loadString() method is put in the application sandbox.
	 * If false, ths content is put in a non-application sandbox. Defaults to <code>false</code>.
	 */
	trusted: false,
	/**
	 * @cfg {String/Boolean} notify
	 * Can be <code>'critical'</code> or <code>'informational'</code>, if you want the user to be notified
	 * (doing a taskbar blink) if the current window is not the active one when it is loaded. Can also be a
	 * Boolean. <code>true</code> means the same like 'critical', <code>false</code> means do not notify.
	 * (Defaults to 'critical' on {@link #modal} windows, 'informational' on non modal windows)
	 */
	notify: undefined,
	/**
	 * Applies a parent window to this window. Parent windows are mostly useful for modal windows or windows with
	 * {@link #closeAction} 'hide' and have the following functions:<div class="mdetail-params"><ul>
	 * <li>They can make THIS window getting closed, if they are closed (see {@link #destroyOnParentClose}).</li>
	 * <li>Modal windows are activated if they are activated and vice versa.</li>
	 * <li>They are activated if THIS window is modal and is closed.</li></ul></div>
	 * @param {air.NativeWindow/Boolean} parent A native window that should be applied as parent window.
	 * Or <code>false</code> if no parent window should be applied. Or <code>null/undefined</code> if the current
	 * active window should be applied.
	 */
	applyParentWindow: function(parent) {
		// remove listeners from previous parent window (it can change, e.g. in Ext.air.MessageBox)
		if (this.parentWin) {
			this.parentWin.removeEventListener(air.Event.CLOSE, this.closeOnParentFn);
			this.parentWin.removeEventListener(air.Event.ACTIVATE, this.activateModalOnParentFn);
			this.un('close', this.activateParentOnCloseFn);
		}
		
		this.parentWin = parent !== false ? (Ext.isObject(parent) ? parent.win || parent : Ext.air.App.getActiveWindow() || window.nativeWindow) : null;
		
		if (this.parentWin) {
			// destroy this window if its parent window is closed (extremly useful for windows with closeAction 'hide')
			if (this.destroyOnParentClose !== false) this.parentWin.addEventListener(air.Event.CLOSE, this.closeOnParentFn);
			// check modal within these functions and add listener always, because modal can change (Ext.air.MessageBox)
			this.parentWin.addEventListener(air.Event.ACTIVATE, this.activateModalOnParentFn);
			this.on('close', this.activateParentOnCloseFn);
		}
	},
	/**
	 * Wrap all air.NativeWindow events to Ext.air.NativeWindow events
	 * @private
	 */
	initEvents: function() {
		var events = ['activate', 'deactivate', 'close', 'closing', 'displayStateChange', 'displayStateChanging', 'move', 'moving', 'resize', 'resizing'];
		Ext.each(events, function(evt) {
			this.win.addEventListener(evt, this['on' + Ext.util.Format.capitalize(evt)].createDelegate(this));
		}, this);
		this.win.stage.addEventListener(air.Event.FULLSCREEN, this.onFullscreen.createDelegate(this));
		if (this.stateful !== false) {
			this.initStateEvents();
		}
		// maybe the loader is already complete?
		if (this.loader.loaded) {
			this.onComplete();
		} else {
			var fn = (function() {
				this.loader.removeEventListener(air.Event.COMPLETE, fn);
				this.onComplete();
			}).createDelegate(this);
			this.loader.addEventListener(air.Event.COMPLETE, fn);
		}
	},
	/**
	 * Fires once, when loading the window is complete.
	 * @private
	 */
	onComplete: function() {
		this.fireEvent('complete', this);
	},
	/**
	 * Fires, if the window has been activated.
	 * @private
	 */
	onActivate: function() {
		this.fireEvent('activate', this);
	},
	/**
	 * Fires, if the window has been deactivated.
	 * Activates it again immediately, if this window is modal.	 
	 * @private
	 */
	onDeactivate: function(e) {
		var aw = Ext.air.App.getActiveWindow();
		// do modal functionality only on windows that were opened before this window was opened
		// this also prevents modal functionality on FileBrowse dialogs etc.
		if (this.modal && this.isVisible() && aw !== null && this.openedWindows.indexOf(aw) != -1) {
			this.setActive(true);
		}
		this.fireEvent('deactivate', this);
	},
	/**
	 * Fires before the window is closed.
	 * Prevents closing the window, if {@link #closable} is false.
	 * @private
	 */
	onClosing: function(e) {
		var bc = !this.closable ? false : this.fireEvent('beforeclose', this);
		if ((this.closeAction == 'hide' || bc === false) && e.cancelable) {
			e.preventDefault();
			if (bc !== false && this.closeAction == 'hide') this.hide();
		}
	},
	/**
	 * Fires after the window has been closed.
	 * @private
	 */
	onClose: function() {
		this.manager.unregister(this);
		this.fireEvent('close', this);
	},
	/**
	 * Fires before the window display state changes.
	 * Prevents the changing, if {@link #maximizable} is false and the window should be maximized.
	 * Prevents the changing, if {@link #minimizable} is false or {@link #minimizeToTray} is true
	 * and the window should be maximized.
	 * @private
	 */
	onDisplaystatechanging: function(e) {
		//if (e.cancelable && ((e.afterDisplayState == air.NativeWindowDisplayState.MAXIMIZED && !this.maximizable) || (e.afterDisplayState == air.NativeWindowDisplayState.MINIMIZED && (!this.minimizable || this.minimizeToTray)))) {
		if (e.cancelable && ((e.afterDisplayState == air.NativeWindowDisplayState.MAXIMIZED && !this.maximizable) || (e.afterDisplayState == air.NativeWindowDisplayState.MINIMIZED && !this.minimizable))) {
			e.preventDefault();
		}
		if (e.afterDisplayState == air.NativeWindowDisplayState.MAXIMIZED) {
			this.stateBounds = this.win.bounds;
		}
	},
	/**
	 * Fires after the window display state has changed.
	 * @private
	 */
	onDisplaystatechange: function() {
		if (this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED) {
			this.fireEvent('maximize', this);
		} else if (this.win.displayState == air.NativeWindowDisplayState.MINIMIZED) {
			this.fireEvent('minimize', this);
		} else this.fireEvent('restore', this);
	},
	/**
	 * Fires before the window's position changes.
	 * Prevents moving, if {@link #draggable} is false.
	 * @private
	 */
	onMoving: function(e) {
		if (!this.draggable && e.cancelable) {
			e.preventDefault();
		}
	},
	/**
	 * Fires after the window's position has changed.
	 * @private
	 */
	onMove: function(e) {
		this.fireEvent('move', this, e.afterBounds.x, e.afterBounds.y);
	},
	/**
	 * Fires before the window's size changes.
	 * Prevents resizing, if {@link #resizable} is false or the new size
	 * is smaller than the specified {@link #minWidth} or {@link #minHeight}.
	 * @private
	 */
	onResizing: function(e) {
		if (e.cancelable && (!this.resizable || e.afterBounds.width < this.minWidth || e.afterBounds.height < this.minHeight)) {
			e.preventDefault();
		}
	},
	/**
	 * Fires after the window has been resized.
	 * @private
	 */
	onResize: function(e) {
		this.fireEvent('resize', this, e.afterBounds.width, e.afterBounds.height);
	},
	/**
	 * Fires after the window entered or left fullscreen mode
	 * @private
	 */
	onFullscreen: function(e) {
		this.fireEvent('fullscreen', this, !!e.fullScreen);
	},
	// private
	initState: Ext.Component.prototype.initState,
	// private
	getStateId: Ext.Component.prototype.getStateId,
	// private
	initStateEvents: Ext.Component.prototype.initStateEvents,
	// private
	applyState: Ext.Component.prototype.applyState,
	// private
	saveState: Ext.Component.prototype.saveState,
	// private
	getState: function() {
		var m = (this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED),
			s = this.stateBounds; 
		return {
			maximized: m,
			width: m && s ? s.width : this.win.width,
			height: m && s ? s.height : this.win.height,
			x: m && s ? s.x : this.win.x,
			y: m && s ? s.y : this.win.y
		};
	},
	/**
	 * Centers the window on the desktop
	 * @return {Ext.air.NativeWindow} this
	 */
	center: function() {
		var b = air.Screen.mainScreen.visibleBounds;
		this.win.x = b.x + (b.width - this.win.width) / 2;
		this.win.y = b.y + (b.height - this.win.height) / 2;
		return this; 
	},
	/**
	 * Closes the window.<br />
	 * Note: This method is not affected by the {@link #closeAction} setting
	 * which only affects the action triggered when clicking the 'close' button
	 * in the header. To only hide the Window, call {@link #hide}.
	 */
	close: function() {
		if (!this.isVisible()) {
			this.doClose();
		} else this.hide(this.doClose, this);
	},
	// private
	doClose: function() {
		// prepare so, that onClosing will not prevent closing the window
		this.purgeListeners();
		this.closable = true;
		this.closeAction = 'close';
		this.win.close();
	},
	/**
	 * Returns the window's id.
	 * @return {String} id
	 */
	getId: function() {
		return this.id;
	},
	/**
	 * Returns the current height of the window.
	 * @return {Number} height
	 */
	getHeight: function() {
		return this.win.height;
	},
	/**
	 * Returns the current width of the window.
	 * @return {Number} width
	 */
	getWidth: function() {
		return this.win.width;
	},
	/**
	 * Returns the height of the window's content.
	 * @return {Number} height
	 */
	getInnerHeight: function() {
		return this.win.stage.stageHeight;
	},
	/**
	 * Returns the width of the window's content.
	 * @return {Number} width
	 */
	getInnerWidth: function() {
		return this.win.stage.stageWidth;
	},
	/**
	 * Returns the current XY position of the window as Array
	 * [width, height].
	 * @return {Array} The XY position of the window (e.g., [100, 200])
	 */
	getPosition: function() {
		return [this.win.x, this.win.y];
	},
	/**
	 * Returns the current size of the window.
	 * @return {Object} An object containing the window's size {width: (window width), height: (window height)}
	 */
	getSize: function() {
		return {
			width: this.win.width,
			height: this.win.height
		};
	},
	/**
	 * Hides the window by setting its visible-property to false.
	 * @param {Function} callback (optional) A callback function to call after the window is hidden
	 * @param {Object} scope (optional) The scope (<code>this</code> reference)
	 * the callback is executed (defaults to this window).
	 */
	hide: function(callback, scope) {
		if (!this.isVisible() || this.fireEvent('beforehide', this) === false) {
			return this;
		}
		this.win.visible = false;
		this.onHide();
		if (window.nativeWindow && !window.nativeWindow.closed && window.nativeWindow.displayState != air.NativeWindowDisplayState.MINIMIZED && window.nativeWindow != this.win) {
			window.nativeWindow.activate(); // activate the parent Window
		}
		this.fireEvent('hide', this);
		if (Ext.isFunction(callback)) callback.call(scope || this);
	},
	/**
	 * A method that is called immediately before the <code>hide</code> event is fired
	 * (defaults to <code>Ext.emptyFn</code>).
	 */
	onHide: Ext.emptyFn,
	/**
	 * Returns <code>true</code> if the window is currently visible, <code>false</code> if it is hidden.
	 */
	isVisible: function() {
		return !this.win.closed && this.win.visible;
	},
	/**
	 * Maximizes the window, if {@link #maximizable} is true.
	 */
	maximize: function() {
		// dispatch Event for none systemChrome windows, since it is not done automatically
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			var e = new air.NativeWindowDisplayStateEvent(
				air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
				false,
				true,
				this.win.displayState,
				air.NativeWindowDisplayState.MAXIMIZED
			);
			if (this.win.dispatchEvent(e) === false) return this;
		}
		this.win.maximize();
		return this;
	},
	/**
	 * Minimizes the window, if {@link #minimizable} is true.
	 */
	minimize: function() {
		// dispatch Event for none systemChrome windows, since it is not done automatically
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			var e = new air.NativeWindowDisplayStateEvent(
				air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
				false,
				true,
				this.win.displayState,
				air.NativeWindowDisplayState.MINIMIZED
			);
			if (this.win.dispatchEvent(e) === false) return this;
		}
		this.win.minimize();
		return this;
	},
	/**
	 * Restores a maximized window back to its original size and position prior to being maximized.
	 */
	restore: function() {
		// dispatch Event for none systemChrome windows, since it is not done automatically
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			var e = new air.NativeWindowDisplayStateEvent(
				air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
				false,
				true,
				this.win.displayState,
				air.NativeWindowDisplayState.NORMAL
			);
			if (this.win.dispatchEvent(e) === false) return this;
		}
		this.win.restore();
		return this;
	},
	/**
	 * Makes the window active or deactivates it.
	 * A deactive status cannot be applied directly to the window, so if active is false, this method
	 * only fires the {@link #deactivate} event.
	 * @param {Boolean} active True to activate the window, false to deactivate it (defaults to false).
	 */
	setActive: function(active) {
		if (active) {
			this.show();
			this.win.activate();
		} else this.fireEvent('deactivate', this);
	},
	/**
	 * Sets the height of the window. This method fires the {@link #resize} event.
	 * @param {Number} height The new height of the window
	 * @return {Ext.air.NativeWindow} this
	 */
	setHeight: function(height) {
		this.win.height = parseInt(height);
		return this;
	},
	/**
	 * Sets the width of the window. This method fires the {@link #resize} event.
	 * @param {Number} width The new width of the window
	 * @return {Ext.air.NativeWindow} this
	 */
	setWidth: function(width) {
		this.win.width = parseInt(width);
		return this;
	},
	/**
	 * Sets the page XY position of the window. This method fires the {@link #move} event.
	 * @param {Number} x The new left position
	 * @param {Number} y The new top position
	 * @return {Ext.air.NativeWindow} this
	 */
	setPosition: function(x, y) {
		if (Ext.isDefined(x)) this.win.x = parseInt(x);
		if (Ext.isDefined(y)) this.win.y = parseInt(y);
		return this;
	},
	/**
	 * Sets the width and height of this window. This method fires the {@link #resize} event.
	 * This method can accept either width and height as separate arguments,
	 * or you can pass a size object like <code>{width:200, height:100}</code>.
	 * @param {Mixed} width The new width to set. This may be one of:<div class="mdetail-params"><ul>
	 * <li>A Number specifying the new width in pixels.</li>
	 * <li>A size object in the format <code>{width: widthValue, height: heightValue}</code>.</li>
	 * <li><code>undefined</code> to leave the width unchanged.</li>
	 * </ul></div>
	 * @param {Mixed} height The new height to set (not required if a size object is passed as the first arg).
	 * This may be one of:<div class="mdetail-params"><ul>
	 * <li>A Number specifying the new height in pixels.</li>
	 * <li><code>undefined</code> to leave the height unchanged.</li>
	 * </ul></div>
	 * @return {Ext.air.NativeWindow} this
	 */
	setSize: function(w, h) {
		if (Ext.isObject(w)) {
			h = w.height;
			w = w.width;
		}
		if (Ext.isDefined(w)) this.win.width = parseInt(w);
		if (Ext.isDefined(h)) this.win.height = parseInt(h);
		return this;
	},
	/**
	 * Sets the title text for this window.
	 * @param {String} title The title text to set
	 */
	setTitle: function(title) {
		this.win.title = title;
		this.fireEvent('titlechange', this, title);
	},
	/**
	 * Convenience function to hide or show this window by boolean.
	 * @param {Boolean} visible True to show, false to hide the window.
	 * @return {Ext.air.NativeWindow} this
	 */
	setVisible: function(visible) {
		if (!visible) {
			this.hide();
		} else this.show();
		return this;
	},
	/**
	 * Shows the window, activates it and brings it to front if hidden.
	 * @param {Function} callback (optional) A callback function to call after the window is displayed
	 * @param {Object} scope (optional) The scope (<code>this</code> reference)
	 * in which the callback is executed. Defaults to this window.
	 */
	show: function(callback, scope) {
		if(this.trayed){
			Ext.air.SystemTray.hideIcon();
			this.trayed = false;
		}
		if (this.isVisible()) {
			this.toFront();
			return this;
		}
		if (this.fireEvent('beforeshow', this) === false) {
			return this;
		}
		this.win.visible = true;
		
		this.memorizeOpenedWindows();
		
		this.toFront();
		this.onShow();
		this.fireEvent('show', this);
		if (Ext.isFunction(callback)) callback.call(scope || this);
	},
	/**
	 * A method that is called immediately before the <code>show</code> event is fired
	 * (defaults to <code>Ext.emptyFn</code>).
	 */
	onShow: Ext.emptyFn,
	/**
	 * Sends this window to the back of any other visible windows.
	 * @return {Ext.air.NativeWindow} this
	 */
	toBack: function() {
		this.win.orderToBack();
		return this;
	},
	/**
	 * Brings this window to the front of any other visible windows.
	 * @return {Ext.air.NativeWindow} this
	 */
	toFront: function() {
		this.win.orderToFront();
		return this;
	},
	/**
	 * Sends this window directly to the back of the specified window.
	 * @param {Ext.air.NativeWindow/air.NativeWindow} NativeWindow
	 * @return {Ext.air.NativeWindow} this
	 */
	inBackOf: function(win) {
		this.win.orderInBackOf(win.win ? win.win : win);
		return this;
	},
	/**
	 * Brings this window directly to the front of the specified window.
	 * @param {Ext.air.NativeWindow/air.NativeWindow} NativeWindow
	 * @return {Ext.air.NativeWindow} this
	 */
	inFrontOf: function(win) {
		this.win.orderInFrontOf(win.win ? win.win : win);
		return this;
	},
	/**
	 * Enter full-screen mode for the window.
	 * @param {Boolean} nonInteractive (optional) Boolean flag to allow the full screen window to be interactive or not.
	 * By default this is <code>false</code>.
	 */
	fullscreen: function(nonInteractive) {
		this.win.stage.displayState = nonInteractive ? air.StageDisplayState.FULL_SCREEN : air.StageDisplayState.FULL_SCREEN_INTERACTIVE; 
	},
	/**
	 * Returns the air.NativeWindow instance
	 * @return {air.NativeWindow} NativeWindow
	 */
	getNative: function() {
		return this.win;
	},
	/**
	 * A shortcut method for toggling between {@link #maximize} and {@link #restore}
	 * based on the current maximized state of the window.
	 * @return {Ext.air.NativeWindow} this	 
	 */
	toggleMaximize: function() {
		this[this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED ? 'restore' : 'maximize'];
		return this;
	},
	/**
	 * Toggles the full-screen mode for this window based on the current state.
	 * @param {Boolean} nonInteractive (optional) Boolean flag to allow the full screen window to be interactive or not.
	 * By default this is false.
	 */
	toggleFullscreen: function(nonInteractive) {
		var sdsn = air.StageDisplayState.NORMAL;
		if (this.win.stage.displayState == sdsn) {
			this.fullscreen(nonInteractive);
		} else {
			this.win.stage.displayState = air.StageDisplayState.NORMAL;
		}
	},
	/**
	 * Define, if this window should stay always in front of all other windows.
	 * @param {Boolean} alwaysInFront True to display this window always in front of all other windows,
	 * false to disable this functionality, undefined to toggle this state (defaults to <code>undefined</code>).
	 * @return {Ext.air.NativeWindow} this
	 */
	toggleAlwaysInFront: function(alwaysInFront) {
		this.win.alwaysInFront = (Ext.isBoolean(alwaysInFront)) ? alwaysInFront : !this.win.alwaysInFront;
		return this;
	},
	// private
	ensureActive: function() {
		var aw = Ext.air.App.getActiveWindow();
		// opened window has to be the active one
		if (aw != this.parentWin && aw != this.win) {
			// if not, notify (taskbar blink)
			if (this.notify === true || !Ext.isDefined(this.notify)) {
				this.notify = air.NotificationType[this.notify === true || this.modal ? 'CRITICAL' : 'INFORMATIONAL'];
			}
			if (this.notify == air.NotificationType.CRITICAL || this.notify == air.NotificationType.INFORMATIONAL) {
				this.win.notifyUser(this.notify);
			}
			// if modal, make sure, that this window becomes the active one, if its parent window becomes activated, too
			if (this.modal && this.parentWin) {
				this.on('activate', function() {
					this.parentWin.activate();
					this.setActive(true);
				}, this, {single: true,delay:10});
				if (this.hidden === false) {
					this.win.visible = true;
				}
			}
		}
		// show if it is not initially hidden
		if (!this.win.visible && this.hidden === false) {
			this.setActive(true);
		}
		if (this.maximized) this.maximize();
	},
	/**
	 * Memorize opened windows (excluding this one) to do modal functionality only on these windows
	 * @private
	 */
	memorizeOpenedWindows: function() {
		this.openedWindows = Ext.toArray(air.NativeApplication.nativeApplication.openedWindows) || [];
		this.openedWindows.remove(this.win);
	},		
	/**
	 * Returns the window object of the window content.
	 * @return {Object} window
	 */
	getWindow: function() {
		return this.win.stage.getChildAt(0).window;
	},
	/**
	 * Returns the document object of the window content.
	 * @return {Object} document
	 */
	getDocument: function() {
		return this.getWindow().document;
	},
	// private
	initMinimizeToTray : function(icon, menu){
		var tray = Ext.air.SystemTray;
		
		tray.setIcon(icon, this.trayTip);
		
		this.on('minimize', function() {
			tray.showIcon();
			this.hide();
			this.trayed = true;
		}, this);
		
		tray.on('click', function(){
			this.setActive(true);
		}, this);
		
		if(menu){
			tray.setMenu(menu);
		}
		this.trayed = false;
	},
	/**
	 * Queries the current document for files to include, if {@link #file} and {@link #html} are undefined.
	 * It depends on the current {@link #fileQuery} config object.
	 * @private
	 */
	queryFiles: function() {
		var t;
		if (Ext.isObject(this.fileQuery) && (t = this.fileQuery.type)) {
			// use the main file from application.xml
			if (t == 'main') {
				var ad = air.NativeApplication.nativeApplication.applicationDescriptor,
					dp = new DOMParser(),
					xml = dp.parseFromString(ad, "text/xml"),
					f = Ext.DomQuery.selectValue("initialWindow/content", xml, "");
				if (!Ext.isEmpty(f)) {
					// add window id
					var q = f.indexOf('?');
					if (q != -1) f = f.substring(0, q);
					this.file = f + '?window=' + this.id;
				}
			} else {
				var html = '',
					r = this.fileQuery.regex,
					js = this.fileQuery.js !== false,
					css = this.fileQuery.css !== false,
					isLink, isScript, h, f, a,
					aJs = '[type=text/javascript]',
					aCss = '[type=text/css]',
					jsTag = '<script language="JavaScript" type="text/javascript" src="{0}"></script>',
					cssTag = '<link rel="stylesheet" type="text/css" href="{0}" />',
					inc = this.fileQuery.include;
				// at least css OR js must be true
				if (!js && !css) return;
				
				// build regex for Ext queries -> same routine as queryRegex
				if (t == 'queryExtJS') {
					r = /\/ext\-(basex?|all|lang)(\-[a-z_\-]+)?\.(css|js)$/i;
				} else if (t == 'queryExtAIR') {
					r = /\/(AIRAliases\.js)|(AIRIntrospector\.js)|(AIRLocalizer\.js)|(AIRMenuBuilder\.js)|(AIRSourceViewer\.js)|(ext\-air(\-[a-z_\-]+)?\.(css|js))$/i;
				} else if (t == 'queryExt') {
					r = /\/(AIRAliases\.js)|(AIRIntrospector\.js)|(AIRLocalizer\.js)|(AIRMenuBuilder\.js)|(AIRSourceViewer\.js)|(ext\-(basex?|all|lang|air)(\-[a-z_\-]+)?\.(css|js))$/i;
				}
				
				switch (t) {
					// query by regex
					case 'queryExtJS':
					case 'queryExtAIR':
					case 'queryExt':
					case 'queryRegex':
						if (!Ext.isDefined(r)) return;

						f = Ext.DomQuery.select(js && css ? 'link' + aCss + ',style' + aCss + ',script' + aJs : (css ? 'link' + aCss + ',style' + aCss: 'script' + aJs), this.fileQuery.root);
						Ext.each(f, function(file) {
							isLink = file.tagName == 'LINK';
							if (this.fileQuery.includeAllCSS === true && (isLink || file.tagName == 'STYLE')) {
								html += file.outerHTML;
							} else if (file.tagName != 'STYLE') {
								h = isLink ? file.href : file.src;
								if (r.test(h)) html += file.outerHTML;
							}
						}, this);
						break;
					// query by attribute -> same routine as queryAll/querySelector
					// namespace attribute can't be queried with Ext.DomQuery, has to be filtered afterwards
					case 'queryAttribute':
						if (!Ext.isString(this.fileQuery.attribute)) return;
						a = this.fileQuery.attribute;
					// query all -> same routine as querySelector
					case 'queryAll':
						this.fileQuery.selector = js && css ? 'link' + aCss + ',style' + aCss + ',script' + aJs : (css ? 'link' + aCss + ',style' + aCss : 'script' + aJs);
					// query by selector
					case 'querySelector':
						if (!Ext.isString(this.fileQuery.selector)) return;
						
						f = Ext.DomQuery.select(this.fileQuery.selector, this.fileQuery.root);
						Ext.each(f, function(file) {
							isLink = (file.tagName == 'LINK' || file.tagName == 'STYLE') && file.type == 'text/css';
							isScript = file.tagName == 'SCRIPT' && file.type == 'text/javascript';
							// skip file if it isn't a javascript or css file
							if ((!isLink && !isScript) || (isLink && !css) || (isScript && !js)) return true;
							if (t != 'queryAttribute' || Ext.fly(file).getAttribute(a, 'ext') == 'true') {
								html += file.outerHTML;
							}
						});
						break;
				}
				if (inc) {
					inc = Ext.isArray(inc) ? inc : [inc];
					Ext.each(inc, function(f) {
						switch (f.substring(f.lastIndexOf('.') + 1).toLowerCase()) {
							case 'js':
								html += String.format(jsTag, f);
								break;
							case 'css':
								html += String.format(cssTag, f);
								break;
						}
					});
				}
				// use html string and include all queried file tags
				if (!Ext.isEmpty(html)) {
					this.html = '<html><head>' + html + '</head><body>' + (this.fileQuery.bodyHtml || '') + '</body></html>';
					this.trusted = true;
				}
			}
		}
	}
});
/**
 * @class Ext.air.NativeWindowGroup
 * A collection of NativeWindows.
 */
Ext.air.NativeWindowGroup = function(){
	var list = {};
	return {
		/**
		 * Registers a window with its id
		 * @param {Object} win
		 */
		register : function(win) {
			list[win.id] = win;
		},
		/**
		 * Unregisters a window
		 * @param {Object} win
		 */
		unregister : function(win){
			delete list[win.id];
		},
		/**
		 * Returns the Ext.air.NativeWindow with the given id or nativeWindow object
		 * @param {String/air.NativeWindow/window} id The id of the window or if it is a
		 * window/nativeWindow this function returns the corresponding Ext.air.NativeWindow
		 * @return {Ext.air.NativeWindow}
		 */
		get : function(id) {
			if (Ext.isString(id)) {
				return list[id];
			} else {
				id = id.nativeWindow || id;
				for (var key in list) {
					if (list.hasOwnProperty(key) && list[key].win == id) {
						return list[key];
					}
				}
			}
			return undefined;
		},
		/**
		 * Closes all windows
		 */
		closeAll : function(){
			for(var id in list){
				if(list.hasOwnProperty(id)){
					list[id].close();
				}
			}
		},
		/**
		 * Executes the specified function once for every window in the group, passing each
		 * window as the only parameter. Returning false from the function will stop the iteration.
		 * @param {Function} fn The function to execute for each item
		 * @param {Object} scope (optional) The scope in which to execute the function
		 */
		each : function(fn, scope){
			for(var id in list){
				if(list.hasOwnProperty(id)){
					if(fn.call(scope || list[id], list[id]) === false){
						return;
					}
				}
			}
		}
	};
};

/**
 * @class Ext.air.NativeWindowManager
 * @extends Ext.air.NativeWindowGroup
 * Collection of all NativeWindows created.
 * @singleton
 */
Ext.air.NativeWindowManager = new Ext.air.NativeWindowGroup();
/**
 * @class Ext.air.Notify
 * @extends Ext.air.NativeWindow
 * A special lightweight {@link Ext.air.NativeWindow} which displays in the bottom right
 * corner of your desktop and is used to show small notification messages.
 * @constructor
 * @param {Object} config Config options
 */
Ext.air.Notify = function(config) {
	config = config || {};
	Ext.apply(this, config);

	var html = this.tpl.apply({
		msg: this.msg,
		iconCls: this.iconCls,
		icon: this.icon || Ext.BLANK_IMAGE_URL,
		title: this.title,
		msgId: this.msgId,
		boxCls: this.boxCls,
		cls: this.cls,
		style: this.style
	});
	// boxWrap it
	if (this.boxCls !== false) {
		var d = Ext.fly(document.createElement('div')),
			c = d.insertHtml('afterBegin', html, true);
		c.boxWrap(this.boxCls);
		html = d.dom.innerHTML;
		d.remove();
	}
	this.fileQuery.bodyHtml = html;
	
	if (this.height == 'auto') {
		this.height = undefined;
		this.autoHeight = true;
	} else this.autoHeight = false;
	
	Ext.air.Notify.superclass.constructor.call(this, config);
	
	// register with NotifyManager to handle stacking
	try {
		this.stack = Ext.air.App.getRootHtmlWindow().Ext.air.NotifyManager;
	} catch(e) {
		this.stack = Ext.air.NotifyManager;
	}
	if (this.stack) this.stack.add(this);
};
Ext.extend(Ext.air.Notify, Ext.air.NativeWindow, {
	hidden: false,
	systemChrome: 'none',
	transparent: true,
	stateful: false,
	extraHeight: 22,
	type: 'lightweight',
	minHeight: 0,
	destroyOnParentClose: false,
	notify: false,
	parent: false,
	alwaysInFront: true,
	/**
	 * @cfg {String} msg
	 * The message to display
	 */
	/**
	 * @cfg {Number} width
	 * The width of the window in pixels (defaults to <code>400</code>).
	 * The height depends on the content.
	 */
	width: 400,
	/**
	 * @cfg {Number/String width}
	 * The height of the window in pixels or <code>'auto'</code> if
	 * the height should fit to the content. Defaults to <code>'auto'</code>.
	 */
	height: 'auto',
	/**
	 * @cfg {Object} fileQuery
	 * See {@link Ext.air.NativeWindow#fileQuery} for more information. Defaults to <pre><code>
{
	type: 'queryExt',
	root: Ext.air.App.getRootHtmlWindow().document,
	js: false
}
	 * </code></pre>
	 * This includes ext-all.css and ext-air.css by default.
	 * Change this, if you need additional css files.
	 */
	fileQuery: {
		type: 'queryExt',
		root: Ext.air.App.getRootHtmlWindow().document,
		js: false
	},
	/**
	 * @cfg {Number/Boolean} hideDelay
	 * The number of milliseconds to wait till hiding the notify window
	 * (defaults to <code>3000</code>). It can also be <code>false</code>
	 * to not hide the window automatically (see also {@link #clickToClose}).
	 */
	hideDelay: 3000,
	/**
	 * @cfg {Boolean} clickToClose
	 * True, if the Notify window should be closed if it becomes clicked
	 * (defaults to <code>false</code>).
	 */
	clickToClose: false,
	/**
	 * @cfg {String} msgId
	 * The id of the message element
	 * (defaults to <code>'msg'</code>).
	 */
	msgId: 'msg',
	/**
	 * @cfg {String} icon
	 * (optional) a path to an icon to display in the top right corner of the notify window
	 * (defaults to <code>Ext.BLANK_IMAGE_URL</code>).
	 */
	icon: undefined,
	/**
	 * @cfg {String} iconCls
	 * (optional) The CSS class selector that specifies a background image to be used as
	 * the header icon (defaults to <code>''</code>). If set, the {@link #icon} config
	 * option should not be set.
	 */
	iconCls: '',
	/**
	 * @cfg {String/Boolean} boxCls
	 * A css class to apply to the box wrapping elements or <code>false</code> to not wrap
	 * the message into a box frame (defaults to <code>'x-box'</code>).
	 */
	boxCls: 'x-box',
	/**
	 * @cfg {Boolean} stackable
	 * True to display the Ext.air.Notify upon all other visible notifiers, false to always show it
	 * always in the bottom right corner (defaults to <code>false</code>).
	 */
	stackable: false,
	/**
	 * @cfg {String} stackPosition
	 * The position to stack this notifier according to the others.
	 * Defaults to <code>'top'</code>, which means that it is shown above the other notifiers and
	 * moves down, if notifiers below become closed. Can also be <code>'bottom'</code>, which means
	 * that all other notifiers are moved up, so that this notifier can be displayed in the very
	 * bottom right corner.
	 */
	stackPosition: 'top',
	/**
	 * @cfg {Ext.XTemplate} tpl
	 * (optional) A XTemplate to load as html body in the native window.
	 */
	tpl: new Ext.XTemplate(
		'<div id="{msgId}" class="notify {cls}" style="{style}">',
			'<img src="{icon}" class="notify-icon {iconCls}" />',
			'<tpl if="title">',
				'<div class="notify-title">{title}</div>',
			'</tpl>',
			'<div class="notify-msg">{msg}</div>',
		'</div>'
	),
	// private
	onShow: function() {
		var doc = this.getDocument(),
			br = air.Screen.mainScreen.visibleBounds.bottomRight,
			bh = doc.body.childNodes[0].clientHeight,
			me = doc.getElementById(this.msgId),
			dh = me.clientHeight,
			h = this.autoHeight ? dh + this.extraHeight : parseInt(this.height, 10);
		
		if (!this.autoHeight != 'auto') {
			me.style.height = (h - bh + dh) + 'px';
		}
		this.setHeight(h);
		
		if (this.stack) {
			this.stack.arrange();
		} else this.setPosition(br.x - this.getWidth(), br.y - h);

		Ext.air.Notify.superclass.onShow.call(this);

		if (this.clickToClose === true) {
			doc.addEventListener('click', (function() {
				this.close();
			}).createDelegate(this), true);
		}
		if (this.hideDelay !== false) {
			this.close.defer(this.hideDelay, this);
		}
	},
	onHide: function() {
		if (this.stack) this.stack.arrange();
		Ext.air.Notify.superclass.onHide.call(this);
	},
	onClose: function() {
		if (this.stack) this.stack.remove(this);
		Ext.air.Notify.superclass.onClose.call(this);
	}
});
/**
 * @class Ext.air.NotifyManager
 * Class to manage all Ext.air.Notifiers and arrange their position if they are stackable
 * @singleton
 * @private
 */
Ext.air.NotifyManager = function() {
	var list = [],
		unstackedCount = 0;
	return {
		add: function(w) {
			if (w.stackable && w.stackPosition != 'bottom') {
				list.push(w);
			} else {
				// make sure, all unstacked notifiers are on top of list
				list.splice(unstackedCount, 0, w);
				if (!w.stackable) unstackedCount++;
			}
		},
		remove: function(w) {
			list.remove(w);
		},
		arrange: function() {
			var h = 0, wh = 0,
				b = air.Screen.mainScreen.visibleBounds.bottomRight;
			Ext.each(list, function(w) {
				if (!w.isVisible()) return;
				wh = w.getHeight();
				if (w.stackable) {
					h += wh;
					w.setPosition(b.x - w.getWidth(), b.y - h);
				} else {
					// calculate the maximum height of all unstacked notifiers
					// no difficult code necessary, because all unstacked notifiers are at top of list
					h = Math.max(h, wh);
					w.setPosition(b.x - w.getWidth(), b.y - wh);
				}
			});
		}
	};
}();
/**
 * @class Ext.air.Viewport
 * @extends Ext.Panel
 * A Panel which provides the look and feel of an {@link Ext.Window} in none-systemChrome NativeWindows.
 * It should be used as the outermost container of all elements in a window.
 * The Viewport always fits into the NativeWindow, even if it becomes resized.
 * It provides the functionality of a window, such like resizing, maximizing, fullscreen etc. .
 * It doesn't matter if the NativeWindow is <code>systemChrome:'standard'</code> or <code>systemChrome:'none'</code>.
 * If it is <code>standard</code>, the header and borders of this panel are not shown and the body element fits to the NativeWindow
 */
Ext.air.Viewport = Ext.extend(Ext.Panel, {
	monitorResize: false,
	/**
	 * @cfg {String} baseCls
	 * The base CSS class to apply to this panel's element (defaults to <code>'x-window'</code>).
	 */
	baseCls: 'x-window',
	/**
	 * @cfg {Boolean} frame
	 * <code>false</code> to render with plain 1px square borders. Defaults to <code>true</code> to render with 9 elements, complete with custom rounded corners (also see {@link Ext.Element#boxWrap}).
	 */
	frame: true,
	/**
	 * @cfg {Boolean} collapsible
	 * True to make the panel collapsible and have the expand/collapse toggle button automatically rendered
	 * into the header tool button area, false to keep the panel statically sized with no button (defaults to <code>false</code>).
	 */
	collapsible: false,
	/**
	 * @cfg {Boolean} closable
	 * True to display the 'close' tool button and allow the user to close the window,
	 * false to hide the button and disallow closing the window (defaults to <code>true</code>).
	 * By default, when close is requested by clicking the close button in the header,
	 * the close method will be called. This will {@link Ext.Component#destroy destroy} the Window
	 * and its content meaning that it may not be reused.
	 * To make closing a Window hide the Window so that it may be reused, set {@link #closeAction} to <code>'hide'</code>.
	 * In standard chrome mode, the close button always is displayed and this option doesn't have any effect to the window look.
	 * But also in modes, the window doesn't close, if the user hits the close-button.
	 */
	closable: true,
	/**
	 * @cfg {Boolean} pinnable
	 * True to display the 'pin' tool button and allow the user to switch {@link #alwaysInFront}
	 * with this button (defaults to <code>false</code>).
	 * This option only applies to none-systemChrome windows.
	 */
	pinnable: false,
	/**
	 * @cfg {Boolean} draggable
	 * False to prevent the user from moving the window by dragging the header
	 * (defaults to <code>true</code>).
	 */
	draggable: true,
	/**
	 * @cfg {String} closeText
	 * The text to display at the close item of the header menu
	 * (defaults to <code>Close</code>).
	 */
	closeText: 'Close',
	/**
	 * @cfg {String} restoreText
	 * The text to display at the restore item of the header menu
	 * (defaults to <code>Restore</code>).
	 */
	restoreText: 'Restore',
	/**
	 * @cfg {String} minimizeText
	 * The text to display at the minimize item of the header menu
	 * (defaults to <code>Minimize</code>).
	 */
	minimizeText: 'Minimize',
	/**
	 * @cfg {String} maximizeText
	 * The text to display at the maximize item of the header menu
	 * (defaults to <code>Maximize</code>).
	 */
	maximizeText: 'Maximize',
	/**
	 * @cfg {String} closeAction
	 * <p>The action to take when the close header button is clicked:
	 * <div class="mdetail-params"><ul>
	 * <li><b><code>'{@link #close}'</code></b> : <b>Default</b><div class="sub-desc">
	 * {@link #close} the window, so that it will <b>not</b> be available to be
	 * redisplayed via the {@link #show} method.
	 * </div></li>
	 * <li><b><code>'{@link #hide}'</code></b> : <div class="sub-desc">
	 * {@link #hide} the window by setting air.NativeWindow.visible to false.
	 * The window will be available to be redisplayed via the {@link #show} method.
	 * </div></li>
	 * </ul></div>
	 */
	closeAction: 'close',
	//private
	initComponent: function() {
		// make it a viewport -> fill whole window
		document.getElementsByTagName('html')[0].className += ' x-viewport';
		var body = Ext.getBody();
		body.setHeight = Ext.emptyFn;
		body.setWidth = Ext.emptyFn;
		body.setSize = Ext.emptyFn;
		body.dom.scroll = 'no';
		Ext.EventManager.onWindowResize(this.setSize, this);

		this.win = window.nativeWindow;
		
		this.win.title = this.title = this.title || this.win.title;
		// no header and frame if standard systemChrome or lightweight window
		if (this.win.systemChrome != air.NativeWindowSystemChrome.NONE || this.win.type == air.NativeWindowType.LIGHTWEIGHT) {
			this.frame = false;
			this.header = false;
		} else this.header = true;
		
		this.renderTo = body;
		
		Ext.air.Viewport.superclass.initComponent.call(this);
	},
	// private
	onRender: function(ct, position) {
		Ext.air.Viewport.superclass.onRender.call(this, ct, position);
		this.setSize(Ext.getBody().getSize());
		this.setPosition(0, 0);
		if(this.plain){
			this.el.addClass(this.baseCls+'-plain');
		}
		this.initTools();
		this.setIcon(this.icon);
		this.setHeaderMenu();
		delete this.icon;
		this.addClass('x-nativewindow-' + this.win.type.toLowerCase());
		if (this.win.resizable && this.win.systemChrome == air.NativeWindowSystemChrome.NONE && this.win.type != air.NativeWindowType.LIGHTWEIGHT) {
			this.resizer = new Ext.Resizable(this.el, {
				minWidth: this.minWidth,
				minHeight:this.minHeight,
				handles: this.resizeHandles || "all",
				pinned: true,
				startSizing: this.startSizing.createDelegate(this),
				handleCls: 'x-window-handle'
			});
		}
		if(this.draggable && this.header){
			this.header.addClass('x-window-draggable');
		}
	},
	/**
	 * Sets the window icon on the top left corner of the header to a given one.
	 * This only applies to none-systemChrome windows.
	 * @param {String} icon The url to the icon file
	 */	 	
	setIcon: function(icon) {
		if(this.rendered && this.header && icon){
			if(this.frame){
				this.header.removeClass(this.iconCls);
				this.header.addClass('x-panel-icon');
				this.header.setStyle('backgroundImage', 'url('+icon+')');
			} else{
				var hd = this.header.dom;
				var img = hd.firstChild && String(hd.firstChild.tagName).toLowerCase() == 'img' ? hd.firstChild : null;
				if (img){
					Ext.fly(img).removeClass(this.iconCls).setStyle('backgroundImage', 'url('+icon+')');
				} else {
					Ext.DomHelper.insertBefore(hd.firstChild, {
						tag:'img', src: Ext.BLANK_IMAGE_URL, cls: 'x-panel-inline-icon', style: 'background-image: url('+icon+');'
					});
				}
			}
		}
	},
	// private
	setHeaderMenu: function() {
		if (this.header && !this.headerMenu) {
			this.headerMenu = new Ext.menu.Menu({
				cls: 'x-nativewindow-headermenu',
				items: [{
					itemId: 'restore',
					text: this.restoreText,
					iconCls: 'restore',
					handler: function() {
						this.win.restore();
					},
					scope: this
				},{
					itemId: 'minimize',
					text: this.minimizeText,
					iconCls: 'minimize',
					handler: function() {
						this.win.minimize();
					},
					scope: this
				},{
					itemId: 'maximize',
					text: this.maximizeText,
					iconCls: 'maximize',
					handler: function() {
						this.win.maximize();
					},
					scope: this
				},'-',{
					itemId: 'close',
					text: this.closeText,
					iconCls: 'close',
					handler: this.doClose,
					scope: this
				}]
			});
			this.mon(this.header, 'mousedown', function(e, t) {
				var l = (this.dd) ? this.dd.isLocked() : false;
				if (e.getPageX() < this.header.getHeight()) { // ein Quadrat am linken Rand als Click-Zone zulassen
					this.headerMenu.show(this.header);
					if (this.dd) this.dd.lock();
				} else if (this.dd && l) this.dd.unlock();
			}, this);
			this.updateHeaderMenu();
		}
	},
	// private
	updateHeaderMenu: function() {
		var hm = this.headerMenu;
		if (!hm) return;
		var nwds = air.NativeWindowDisplayState;
		var wds = this.win.displayState;
		var sds = this.win.stage.displayState;
		var sdsn = air.StageDisplayState.NORMAL;
		hm.getComponent('minimize').setDisabled(!this.win.minimizable);
		hm.getComponent('restore').setDisabled(!(sds != sdsn || (this.win.maximizable && wds == nwds.MAXIMIZED)));
		hm.getComponent('maximize').setDisabled(!(this.win.maximizable && wds == nwds.NORMAL && sds == sdsn));
	},
	// private
	initEvents : function(){
		Ext.air.Viewport.superclass.initEvents.call(this);
		this.win.addEventListener(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGE, this.onDisplayStateChange.createDelegate(this));
		this.win.addEventListener(air.Event.ACTIVATE, this.onActivate.createDelegate(this));
		this.win.addEventListener(air.Event.DEACTIVATE, this.onDeactivate.createDelegate(this));
		this.win.stage.addEventListener(air.Event.FULLSCREEN, this.onFullscreen.createDelegate(this));
		
		if (this.header) this.mon(this.header, 'dblclick', function(e) {
			if (e.getPageX() < this.header.getHeight()) {
				if (this.closable) this.win.close();
			} else if (this.win.maximizable) this.toggleMaximize();
		}, this);
	},
	// private
	initDraggable : function() {
		if (this.header) this.dd = new Ext.air.ViewportDD(this);
	},
	// private
	onDestroy : function(){
		if (this.resizer) this.resizer.destroy(true);
		if (this.headerMenu) this.headerMenu.destroy();
		Ext.air.Viewport.superclass.onDestroy.call(this);
	},
	// private
	initTools : function(){
		if (this.win.type == air.NativeWindowType.NORMAL && this.header) {
			if (this.pinnable) {
				this.addTool({
					id: 'unpin',
					hidden: !!this.win.alwaysInFront,
					handler: this.toggleAlwaysInFront.createDelegate(this, [true])
				});
				this.addTool({
					id: 'pin',
					hidden: !this.win.alwaysInFront,
					handler: this.toggleAlwaysInFront.createDelegate(this, [false])
				});
			}
			if(this.win.minimizable){
				this.addTool({
					id: 'minimize',
					handler: function() {
						// dispatch Event for none systemChrome windows, since it is not done automatically
						if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
							var e = new air.NativeWindowDisplayStateEvent(
								air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
								false,
								true,
								this.win.displayState,
								air.NativeWindowDisplayState.MINIMIZED
							);
							if (this.win.dispatchEvent(e) === false) return;
						}
						this.win.minimize();
					},
					scope: this
				});
			}
			if(this.win.maximizable){
				this.addTool({
					id: 'maximize',
					handler: function() {
						// dispatch Event for none systemChrome windows, since it is not done automatically
						if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
							var e = new air.NativeWindowDisplayStateEvent(
								air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
								false,
								true,
								this.win.displayState,
								air.NativeWindowDisplayState.MAXIMIZED
							);
							if (this.win.dispatchEvent(e) === false) return;
						}
						this.win.maximize();
					},
					scope: this
				});
				this.addTool({
					id: 'restore',
					handler: function() {
						// dispatch Event for none systemChrome windows, since it is not done automatically
						if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
							var e = new air.NativeWindowDisplayStateEvent(
								air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGING,
								false,
								true,
								this.win.displayState,
								air.NativeWindowDisplayState.NORMAL
							);
							if (this.win.dispatchEvent(e) === false) return;
						}
						this.win.restore();
					},
					scope: this,
					hidden: true
				});
			}
		}
		if(this.closable && this.header){
			this.addTool({
				id: 'close',
				handler: this.doClose,
				scope: this
			});
		}
	},
	// private
	addTool: function() {
		switch (this.win.type) {
			case air.NativeWindowType.NORMAL:
				Ext.air.Viewport.superclass.addTool.apply(this, arguments);
				break;
			case air.NativeWindowType.UTILITY:
				Ext.each(arguments, function(a) {
					if (!(a.id && a.id != 'close' && a.id != 'help')) {
						Ext.air.Viewport.superclass.addTool.call(this, a);
					}
				}, this);
				break;
			// no tools for lightweight windows
		}
	},
	// private
	startSizing : function(e, h) {
		var pos = {north:'TOP',east:'RIGHT',south:'BOTTOM',west:'LEFT',northeast:'TOP_RIGHT',southeast:'BOTTOM_RIGHT',southwest:'BOTTOM_LEFT',nothwest:'TOP_LEFT'};
		var rh = pos[h.position];
		if (rh) this.win.startResize(air.NativeWindowResize[rh]);
	},
	// private
	toggleMaximize: function() {
		this.win[this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED ? 'restore' : 'maximize']();
	},
	/**
	 * A shortcut method for toggling between alwaysInFront:true and alwaysInFront:false based on the current state of the window.
	 * @private
	 */
	toggleAlwaysInFront: function(aif) {
		if (!Ext.isDefined(aif)) aif = !this.win.alwaysInFront;
		this.win.alwaysInFront = !!aif;
		this.getTool('unpin').setVisible(!aif);
		this.getTool('pin').setVisible(!!aif);
	},
	// private
	onDisplayStateChange: function(e) {
		var nwds = air.NativeWindowDisplayState;
		switch (e.afterDisplayState) {
			case nwds.MINIMIZED:
				this.onMinimize();
				break;
			case nwds.MAXIMIZED:
				this.onMaximize();
				break;
			default:
				this.onRestore();
				break;
		}
		this.updateHeaderMenu();
		return true;
	},
	// private
	onMaximize : function() {
		this.expand(false);
		if (this.header && this.win.type == air.NativeWindowType.NORMAL) {
			if (this.win.maximizable) {
				this.tools.maximize.hide();
				this.tools.restore.show();
			}
			if (this.collapsible) {
				this.tools.toggle.hide();
			}
		}
		if(this.dd){
			this.dd.lock();
		}
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			this.on('resize', this.fitWindow, this, {single: true});
		}
		this.el.addClass('x-nativewindow-maximized');
	},
	// private
	fitWindow: function() {
		var b = air.Screen.mainScreen.visibleBounds;
		var x = this.getWidth() - b.width;
		var y = this.getHeight() - b.height;
		this.setPosition(x / 2, y / 2);
		this.setSize(b.width, b.height);
	},
	// private
	onRestore : function(){
		this.el.removeClass('x-nativewindow-maximized');
		if (this.header && this.win.type == air.NativeWindowType.NORMAL) {
			if (this.win.maximizable) {
				this.tools.restore.hide();
				this.tools.maximize.show();
			}
			if(this.collapsible){
				this.tools.toggle.show();
			}
		}
		if(this.dd){
			this.dd.unlock();
		}
		if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
			this.setPosition(0, 0);
		}
	},
	// private
	onMinimize: Ext.emptyFn,
	// private
	onActivate: function() {
		if (this.el && this.el.dom) this.removeClass('x-nativewindow-inactive');
	},
	// private
	onDeactivate: function() {
		if (this.el && this.el.dom) this.addClass('x-nativewindow-inactive');
	},
	// private
	onFullscreen: function(e) {
		if (e.fullScreen) {
			this.expand(false);
			if (this.header) {
				if (this.collapsible && this.win.type == air.NativeWindowType.NORMAL) {
					this.tools.toggle.hide();
				}
				if (this.win.systemChrome == air.NativeWindowSystemChrome.NONE) {
					this.on('resize', function(c, aw, ah, rw, rh) {
						var mc = this.body.parent('.' + this.baseCls  + '-mc'),
							w = this.body.getWidth(true),
							h = mc.getHeight(true);
						this.suspendEvents();
						this.setPosition(-this.body.getX(), -mc.getY());
						this.setSize(2 * this.getWidth() - w, 2 * this.getHeight() - h);
						this.resumeEvents();
					}, this, {single: true});
				}
			}
			if (this.dd) this.dd.lock();
			this.el.addClass('x-nativewindow-maximized');
		} else {
			if (this.win.displayState == air.NativeWindowDisplayState.MAXIMIZED) {
				this.onMaximize();
			} else this.onRestore();
		}
		this.updateHeaderMenu();
	},
	doClose: function() {
		var ce = new air.Event(air.Event.CLOSING, false, true);
		if (this.win.dispatchEvent(ce) !== false) this.win.close();
	},
	/**
	 * Returns the air.NativeWindow for this window
	 */
	getNative: function() {
		return this.win;
	},
	/**
	 * Collapses the window body so that it becomes hidden.
	 * Fires the {@link #beforecollapse} event which will cancel the collapse action if it returns false.
	 * @return {Ext.air.Viewport} this
	 */
	collapse : function(){
		if(this.collapsed || this.win.type != air.NativeWindowType.NORMAL || this.fireEvent('beforecollapse', this) === false){
			return;
		}
 		this.winHeight = this.getHeight();
		this.onCollapse(false);
		return this;
	},
	// private
	afterCollapse : function(){
		this.collapsed = true;
		this.el.addClass(this.collapsedCls);
		var h = this.getHeight();
		this.winMinSize = this.win.minSize;

		this.win.minSize = new air.Point(this.winMinSize.x, h);
		this.win.height = this.getHeight();
		this.fireEvent('collapse', this);
	},
	/**
	 * Expands the panel window so that it becomes visible.
	 * Fires the {@link #beforeexpand} event which will cancel the expand action if it returns false.
	 * @return {Ext.air.Viewport} this
	 */
	expand : function(){
		if(!this.collapsed || this.win.type != air.NativeWindowType.NORMAL || this.fireEvent('beforeexpand', this) === false){
			return;
		}
		this.win.minSize = this.winMinSize;
		this.win.height = this.winHeight;
		this.el.removeClass(this.collapsedCls);
		this.onExpand(false);
		return this;
	},
	// private
	afterExpand: function(){
		this.collapsed = false;
		if(this.deferLayout !== undefined){
			this.doLayout(true);
		}
		this.fireEvent('expand', this);
	}
});
// private
Ext.air.ViewportDD = Ext.extend(Ext.Window.DD, {
	startDrag : function(){
		this.win.win.startMove();
	},
	onDrag : Ext.emptyFn,
	endDrag : function(e){
		this.win.saveState();
	}
});
Ext.reg('airviewport', Ext.air.Viewport);
/**
 * @class Ext.air.Window
 * @extends Ext.air.NativeWindow
 * A class that creates a new Ext.air.NativeWindow with a Ext.air.Viewport in it.
 * This allows you, to create a NativeWindows like an Ext.Window.
 * Make sure, that you define a {@link #file}, in which the ExtJS framework becomes loaded,
 * otherwise the viewport won't create!<br /><br />
 * <b>Note:</b> Although they are not listed here, this class accepts also all config options of
 * {@link Ext.air.Viewport}.<br />
 * Please consider, that only lazy rendering is possible. That means, only config objects,
 * NOT instances of components are allowed to be specified in the {@link #items} option.
 * If you specify component instances anyway, a new instance of this component based on its
 * {@link Ext.Component#initialConfig} is created in the new NativeWindow. You cannot acces it via its reference anymore.
 * @constructor
 * @param {Object} config A config object containing config options of Ext.air.NativeWindow and Ext.air.Viewport
 */
Ext.air.Window = function(config) {
	this.initialConfig = Ext.apply({}, config);
	// remember html config option since html is replaced with complete page content later
	config.bodyHtml = this.initialConfig.html;
	delete config.html;
	// delete html property from prototype
	this.bodyHtml = this.html;
	delete this.html;

	this.addEvents(
		/**
		 * @event init
		 * Fires once after the window has been loaded but BEFORE the {@link Ext.air.Viewport} is built.
		 * Fires only if Ext Framework is available in the new window, e.g. specify a proper {@link #fileQuery}.
		 * Use this to execute custom initialization code for this window like <code>Ext.QuickTips.init();</code>.
		 * @param {Ext.air.NativeWindow} this
		 * @param {window} window the JavaScript window object of this NativeWindow
		 * @param {Object} Ext The Ext Framework within this window. Use it for all your init code.
		 */
		'init'
		/**
		 * @event complete
		 * Fires once after the window has been loaded completely and AFTER the {@link Ext.air.Viewport} is built.
		 * This doesn't include that the Viewport is rendered. Listen to the
		 * {@link Ext.air.Viewport#render Viewport's render event} in that case.
		 * @param {Ext.air.NativeWindow} this
		 */
	);
	Ext.air.Window.superclass.constructor.call(this, config);
};
Ext.extend(Ext.air.Window, Ext.air.NativeWindow, {
	/**
	 * @cfg {String} html
	 * An HTML fragment, or a DomHelper specification to use as the window element content
	 * (defaults to ''). The HTML content is added after the Viewport is rendered, so the
	 * document will not contain this HTML at the time the render event is fired.
	 * This content is inserted into the body before any configured contentEl is appended.<br />
	 * This property is applied to the {@link Ext.air.Viewport#html} property of the Ext.air.Viewport.
	 */
	/**
	 * @cfg {String} systemChrome
	 * The NativeWindow chrome (defaults to 'none', can also be 'standard').
	 */
	systemChrome: air.NativeWindowSystemChrome.NONE,
	/**
	 * @cfg {Boolean} transparent
	 * True if the window should have a transparent background. Could only be true,
	 * if {@link #systemChrome} is <code>none</code> (defaults to <code>true</code>).
	 */
	transparent: true,
	// private
	onComplete: function() {
		var win = this.getWindow();
		if (win && win.Ext) {
			if (win.Ext != window.Ext) this.prepareItems();
			// "html" was already processed in constructor, delete it for that case, s.o. defines it in "init" listener
			delete this.html;
			this.onInit.call(this, win, win.Ext);
			this.createViewport(win.Ext);
		}
		Ext.air.Window.superclass.onComplete.apply(this, arguments);
	},
	// private
	onInit: function(win, X) {
		this.fireEvent('init', this, win, X);
	},
	/**
	 * Creates the viewport if the NativeWindow has loaded and Ext is available in the new window.
	 * @private
	 */
	createViewport: function(X) {
		var o = Ext.apply(this.getOwnProperties(), {
			id: X.id(),
			stateId: null,
			stateful: false,
			hidden: false,
			html: this.html || this.bodyHtml // this.html if s.o. defines it in "init" listener
		});
		this.viewport = new X.air.Viewport(o);
	},
	/**
	 * <p>Sets the title for this window and optionally the {@link Ext.air.Viewport#iconCls icon class}.</p>
	 * @param {String} title The title text to set
	 * @param {String} iconCls (optional) {@link Ext.air.Viewport#iconCls iconCls} A user-defined CSS
	 * class that provides the icon image for this window (only useful if systemChrome is 'none').
	 */
	setTitle: function(title, iconCls) {
		Ext.air.Window.superclass.setTitle.call(this, title);
		if (this.viewport) this.viewport.setTitle(title, iconCls);
	},
	/**
	 * Prepares the items so, that they are all config option objects. No instances are allowed
	 * to be passed to the viewport's items property.
	 * @private
	 */
	prepareItems: function() {
		this.items = Ext.isArray(this.items) ? this.items : (this.items ? [this.items] : []);
		Ext.each(this.items, function(t, i) {
			this.items[i] = t.initialConfig ? t.initialConfig : t;
		}, this); 
	},
	/**
	 * Returns the viewport instance. Use it to access all members of the viewport class
	 * and to access child items via <code>this.getViewport().get('myChildItemId');</code>.
	 */
	getViewport: function() {
		return this.viewport;
	},
	// private
	getOwnProperties: function() {
		var o = {},
			skip = ['events', 'stateEvents', 'initialConfig', 'win', 'loader', 'html', 'fileQuery', 'file'];
		for (var i in this) {
			if (!Ext.isFunction(this[i]) && skip.indexOf(i) == -1) {
				o[i] = this[i];
			}
		}
		Ext.apply(o, this.initialConfig);
		return o;
	}
});
/**
 * @class Ext.air.MessageBox
 * <p>Utility class for generating different styles of message boxes.  The alias Ext.air.Msg can also be used.<p/>
 * <p>Note that the MessageBox is asynchronous.  Unlike a regular JavaScript <code>alert</code> (which will halt
 * browser execution), showing a MessageBox will not cause the code to stop.  For this reason, if you have code
 * that should only run <em>after</em> some user feedback from the MessageBox, you must use a callback function
 * (see the <code>function</code> parameter for {@link #show} for more details).</p>
 * <p>Example usage:</p>
 *<pre><code>
// Basic alert:
Ext.air.Msg.alert('Status', 'Changes saved successfully.');

// Prompt for user data and process the result using a callback:
Ext.air.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value and close...
    }
});

// Show a dialog using config options:
Ext.air.Msg.show({
   title:'Save Changes?',
   msg: 'You are closing a tab that has unsaved changes. Would you like to save your changes?',
   buttons: Ext.air.Msg.YESNOCANCEL,
   fn: processResult,
   icon: Ext.air.MessageBox.QUESTION
});
</code></pre>
 * @singleton
 */
Ext.air.MessageBox = function() {
	var dlg, vp, opt, btnHandled = false,
		bodyEl, iconEl, textboxEl, textareaEl, progressBar,
		bufferIcon = '', iconCls = '', keyMap, bwidth = null;
	
	// private
	var handleButton = function(button) {
		if (!button) {
			button = (opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel) ? 'no' : 'cancel';
		}
		
		var btn = vp.fbar.getComponent(button);
		if (btn) btn.blur();
		if (btnHandled) return false;
		btnHandled = true;
		if (dlg.isVisible()) {
			dlg.hide();
			handleHide();
		}
		Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.getValue(), opt], 1);
	};
	// private
	var handleHide = function() {
		if(opt && opt.cls){
			dlg.el.removeClass(opt.cls);
		}
		progressBar.reset();
	};
	// private
	var updateButtons = function(buttons) {
		var f = vp.fbar,
			cfg, btn;
		f.removeAll();
		Ext.iterate(buttons, function(name, b) {
			cfg = Ext.isObject(b) ? b : this.buttonCfg[name];
			if (cfg) {
				btn = f.addButton(Ext.apply({},{
					itemId: name,
					handler: handleButton.createCallback(name)
				}, cfg));
			}
		}, this);
		f.doLayout();
		return null;
	};
	// private
	var buildDialog = function(fn) {
		if (!dlg) {
			dlg = new Ext.air.Window({
				type: air.NativeWindowType.NORMAL,
				transparent: true,
				systemChrome: air.NativeWindowSystemChrome.NONE,
				cls: 'x-window-dlg',
				resizable: false,
				minimizable: false,
				maximizable: false,
				stateful: false,
				modal: false,
				buttonAlign: 'center',
				width: 400,
				height:100,
				minHeight: 80,
				plain: true,
				footer: true,
				closable: true,
				draggable: true,
				fbar: {
					enableOverflow: false,
					items: []
				},
				// query ExtJS and ExtAIR files from main window
				fileQuery: {
					type: 'queryExt',
					root: Ext.air.App.getRootHtmlWindow().document
				},
				closeAction: 'hide',
				hidden: false,
				listeners: {
					'complete': function(w) {
						// build body content
						var win = w.getWindow();
						vp = w.getViewport();
						bodyEl = vp.body.createChild({
							html: '<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"></div></div><div class="x-clear"></div>'
						});
						iconEl = bodyEl.first('.ext-mb-icon');
						msgEl = bodyEl.child('.ext-mb-text');
						if (win && win.Ext) {
							textboxEl = new win.Ext.form.TextField({
								listeners: {
									'keydown': function(e) {
										if (e.getKey() = Ext.EventObject.ENTER && dlg.isVisible() && opt && opt.buttons) {
											if (opt.buttons.ok) {
												handleButton("ok");
											} else if (opt.buttons.yes) {
												handleButton("yes");
											}
										}
									}
								},
								renderTo: bodyEl,
								cls: 'ext-mb-input'
							});
							textareaEl = new win.Ext.form.TextArea({
								renderTo: bodyEl,
								cls: 'ext-mb-textarea'
							});
							progressBar = new win.Ext.ProgressBar({
								renderTo: bodyEl
							});
							keyMap = new win.Ext.KeyMap(win.Ext.getDoc(), {
								key: 27,
								handler: function() {
									dlg.hide();
								}
							});
						}
						fn.call(this, dlg);
					},
					'hide': handleButton.createCallback(null),
					scope: this
				}
			});
		} else {
			fn.call(this, dlg);
		}
	};
	
	return {
		/**
		 * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
		 * initiated via {@link Ext.air.MessageBox#progress} or {@link Ext.air.MessageBox#wait},
		 * or by calling {@link Ext.air.MessageBox#show} with progress: true.
		 * @param {Number} value Any number between 0 and 1 (e.g., .5, defaults to 0)
		 * @param {String} progressText The progress text to display inside the progress bar (defaults to '')
		 * @param {String} msg The message box's body text is replaced with the specified string (defaults to undefined
		 * so that any existing body text will not get overwritten by default unless a new value is passed in)
		 * @return {Ext.MessageBox} this
		 */
		updateProgress: function(value, progressText, msg) {
			if (progressBar) progressBar.updateProgress(value, progressText);
			if(msg){
				this.updateText(msg);
			}
			return this;
		},
		/**
		 * Updates the message box body text
		 * @param {String} text (optional) Replaces the message box element's innerHTML with the specified string (defaults to
		 * the XHTML-compliant non-breaking space character '&amp;#160;')
		 * @return {Ext.air.MessageBox} this
		 */
		updateText: function(text) {
			if(!dlg.isVisible() && !opt.width){
				dlg.setSize(this.maxWidth, 100); // resize first so content is never clipped from previous shows
			}
			msgEl.update(text || '&#160;');

			var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0,
				mw = msgEl.getWidth() + msgEl.getMargins('lr'),
				fw = vp.getFrameWidth('lr'),
				bw = vp.body.getFrameWidth('lr'),
				w;
			
			if (!Ext.isNumber(bwidth)) {
				bwidth = 0;
				vp.fbar.items.each(function(b) {
					bwidth += b.getWidth() + 15;
				});
			}
			
			w = Math.max(Math.min(opt.width || iw+mw+fw+bw, opt.maxWidth || this.maxWidth),
					Math.max(opt.minWidth || this.minWidth, bwidth || 0));

			if(opt.prompt === true){
				activeTextEl.setWidth(w-iw-fw-bw);
			}
			if(opt.progress === true || opt.wait === true){
				progressBar.setSize(w-iw-fw-bw);
			}
			vp.setSize(w, 'auto');
			dlg.setSize(vp.getSize()).center();
			return this;
		},
		/**
		 * Returns true if the message box is currently displayed
		 * @return {Boolean} True if the message box is visible, else false
		 */
		isVisible: function() {
			return dlg && dlg.isVisible();
		},
		/**
		 * Hides the message box if it is displayed
		 * @return {Ext.air.MessageBox} this
		 */
		hide: function() {
			if (this.isVisible()) {
				dlg.hide();
				handleHide();
			}
			return this;
		},
		/**
		 * Displays a new message box, or reinitializes an existing message box, based on the config options
		 * passed in. All display functions (e.g. prompt, alert, etc.) on MessageBox call this function internally,
		 * although those calls are basic shortcuts and do not support all of the config options allowed here.
		 * @param {Object} config The following config options are supported: <ul>
		 * <li><b>buttons</b> : Object/Boolean<div class="sub-desc">A button config object (e.g., Ext.MessageBox.OKCANCEL or {ok:{text:'Foo'},
		 * cancel:{text:'Bar'}}), or false to not show any buttons (defaults to false)</div></li>
		 * <li><b>closable</b> : Boolean<div class="sub-desc">False to hide the top-right close button (defaults to true). Note that
		 * progress and wait dialogs will ignore this property and always hide the close button as they can only
		 * be closed programmatically.</div></li>
		 * <li><b>cls</b> : String<div class="sub-desc">A custom CSS class to apply to the message box's container element</div></li>
		 * <li><b>defaultTextHeight</b> : Number<div class="sub-desc">The default height in pixels of the message box's multiline textarea
		 * if displayed (defaults to 75)</div></li>
		 * <li><b>fn</b> : Function<div class="sub-desc">A callback function which is called when the dialog is dismissed either
		 * by clicking on the configured buttons, or on the dialog close button, or by pressing
		 * the return button to enter input.
		 * <p>Progress and wait dialogs will ignore this option since they do not respond to user
		 * actions and can only be closed programmatically, so any required function should be called
		 * by the same code after it closes the dialog. Parameters passed:<ul>
		 * <li><b>buttonId</b> : String<div class="sub-desc">The ID of the button pressed, one of:<div class="sub-desc"><ul>
		 * <li><tt>ok</tt></li>
		 * <li><tt>yes</tt></li>
		 * <li><tt>no</tt></li>
		 * <li><tt>cancel</tt></li>
		 * <li>any other custom index of the <i>buttons</i> config object</li>		 
		 * </ul></div></div></li>
		 * <li><b>text</b> : String<div class="sub-desc">Value of the input field if either <tt><a href="#show-option-prompt" ext:member="show-option-prompt" ext:cls="Ext.MessageBox">prompt</a></tt>
		 * or <tt><a href="#show-option-multiline" ext:member="show-option-multiline" ext:cls="Ext.MessageBox">multiline</a></tt> is true</div></li>
		 * <li><b>opt</b> : Object<div class="sub-desc">The config object passed to show.</div></li>
		 * </ul></p></div></li>
		 * <li><b>scope</b> : Object<div class="sub-desc">The scope of the callback function</div></li>
		 * <li><b>icon</b> : String<div class="sub-desc">A CSS class that provides a background image to be used as the body icon for the
		 * dialog (e.g. Ext.MessageBox.WARNING or 'custom-class') (defaults to '')</div></li>
		 * <li><b>iconCls</b> : String<div class="sub-desc">The standard {@link Ext.air.Viewport#iconCls} to
		 * add an optional header icon (defaults to '')</div></li>
		 * <li><b>maxWidth</b> : Number<div class="sub-desc">The maximum width in pixels of the message box (defaults to 600)</div></li>
		 * <li><b>minWidth</b> : Number<div class="sub-desc">The minimum width in pixels of the message box (defaults to 100)</div></li>
		 * <li><b>modal</b> : Boolean<div class="sub-desc">False to allow user interaction with the page while the message box is
		 * displayed (defaults to true)</div></li>
		 * <li><b>parent</b> : air.NativeWindow/Boolean<div class="sub-desc">The parent window that should be applied to this window.
		 * See {@link Ext.air.NativeWindow#applyParentWindow} for more information. Defaults to <code>undefined</code>.</div></li>
		 * <li><b>msg</b> : String<div class="sub-desc">A string that will replace the existing message box body text (defaults to the
		 * XHTML-compliant non-breaking space character '&amp;#160;')</div></li>
		 * <li><a id="show-option-multiline"></a><b>multiline</b> : Boolean<div class="sub-desc">
		 * True to prompt the user to enter multi-line text (defaults to false)</div></li>
		 * <li><b>progress</b> : Boolean<div class="sub-desc">True to display a progress bar (defaults to false)</div></li>
		 * <li><b>progressText</b> : String<div class="sub-desc">The text to display inside the progress bar if progress = true (defaults to '')</div></li>
		 * <li><a id="show-option-prompt"></a><b>prompt</b> : Boolean<div class="sub-desc">True to prompt the user to enter single-line text (defaults to false)</div></li>
		 * <li><b>title</b> : String<div class="sub-desc">The title text</div></li>
		 * <li><b>value</b> : String<div class="sub-desc">The string value to set into the active textbox element if displayed</div></li>
		 * <li><b>wait</b> : Boolean<div class="sub-desc">True to display a progress bar (defaults to false)</div></li>
		 * <li><b>waitConfig</b> : Object<div class="sub-desc">A {@link Ext.ProgressBar#waitConfig} object (applies only if wait = true)</div></li>
		 * <li><b>width</b> : Number<div class="sub-desc">The width of the dialog in pixels</div></li>
		 * </ul>
		 * Example usage:
		 * <pre><code>
Ext.air.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Ext.air.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   icon: Ext.air.MessageBox.INFO
});
</code></pre>
		 * @return {Ext.air.MessageBox} this
		 */
		show: function(options) {
			if(this.isVisible()){
				this.hide();
			}
			opt = options || {};
			// build dialog and call function on complete
			// call function immediately if a msg dialog is already built
			buildDialog.call(this, function() {
				dlg.setTitle(opt.title || "");
				var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
				vp.getTool('close').setDisplayed(allowClose);
				btnHandled = false; // reset button handler
				activeTextEl = textboxEl;
				opt.prompt = opt.prompt || (opt.multiline ? true : false);
				if(opt.prompt){
					if(opt.multiline){
						textboxEl.hide();
						textareaEl.show();
						textareaEl.setHeight(Ext.isNumber(opt.multiline) ? opt.multiline : this.defaultTextHeight);
						activeTextEl = textareaEl;
					}else{
						textboxEl.show();
						textareaEl.hide();
					}
				}else{
					textboxEl.hide();
					textareaEl.hide();
				}
				activeTextEl.setValue(opt.value || "");
				if(opt.iconCls){
					vp.setIconClass(opt.iconCls);
				}
				dlg.on('activate', function() {
					if (opt.prompt) {
						activeTextEl.focus(true);
					} else if (opt && opt.buttons) {
						if (opt.buttons.ok) {
							vp.fbar.getComponent('ok').focus();
						} else if (opt.buttons.yes) {
							vp.fbar.getComponent('yes').focus();
						}
					}
				}, this, {single: true, delay: 10});
				// set icon
				this.setIcon(Ext.isDefined(opt.icon) ? opt.icon : bufferIcon);
				// init buttons and reset bwidth
				bwidth = updateButtons.call(this, opt.buttons);
				progressBar.setVisible(opt.progress === true || opt.wait === true);
				this.updateProgress(0, opt.progressText);
				this.updateText(opt.msg);
				if(opt.cls){
					vp.addClass(opt.cls);
				}
				// do modal=false, so that the 'activate' event is fired correctly if dlg is not active
				// set modal, when dlg becomes first activated
				//dlg.modal = false;
				dlg.modal = opt.modal !== false;
				dlg.applyParentWindow(opt.parent);
				if (!this.isVisible()) {
					if (keyMap) dlg.on('show', function() {
						keyMap.setDisabled(!allowClose);
					}, this, {single: true});
					// notify user, if window is not active
					// aw was window.nativeWindow before -> it is better to use the current active window
					// because it can be an Ext.air.Window and window.nativeWindow is the root window in that case.
					/*if (Ext.air.App.getActiveWindow() != aw) {
						dlg.show();
						dlg.getNative().notifyUser(air.NotificationType.CRITICAL);
						var fn = function() {
							dlg.modal = opt.modal !== false;
							aw.activate();
							dlg.setActive(true);
							dlg.un('activate', fn, window);
							aw.removeEventListener('activate', fn);
						};
						// activate msg, if dlg OR former active window becomes activated
						dlg.on('activate', fn, window, {single: true});
						aw.addEventListener('activate', fn);
					} else {
						dlg.modal = opt.modal !== false;
						dlg.setActive(true);
					}*/
					dlg.ensureActive();
				}
				if(opt.wait === true){
					progressBar.wait(opt.waitConfig);
				}
			});
			return this;
		},
		/**
		 * Adds the specified icon to the dialog.  By default, the class 'ext-mb-icon' is applied for default
		 * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
		 * to clear any existing icon. This method must be called before the MessageBox is shown.
		 * The following built-in icon classes are supported, but you can also pass in a custom class name:
		 * <pre>
Ext.air.MessageBox.INFO
Ext.air.MessageBox.WARNING
Ext.air.MessageBox.QUESTION
Ext.air.MessageBox.ERROR
		 *</pre>
		 * @param {String} icon A CSS classname specifying the icon's background image url, or empty string to clear the icon
		 * @return {Ext.air.MessageBox} this
		 */
		setIcon: function(icon) {
			if(!dlg){
				bufferIcon = icon;
				return;
			}
			bufferIcon = undefined;
			if(icon && icon != ''){
				iconEl.removeClass('x-hidden');
				iconEl.replaceClass(iconCls, icon);
				bodyEl.addClass('x-dlg-icon');
				iconCls = icon;
			}else{
				iconEl.replaceClass(iconCls, 'x-hidden');
				bodyEl.removeClass('x-dlg-icon');
				iconCls = '';
			}
			return this;
		},
		/**
		 * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
		 * the user.  You are responsible for updating the progress bar as needed via {@link Ext.air.MessageBox#updateProgress}
		 * and closing the message box when the process is complete.
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {String} progressText (optional) The text to display inside the progress bar (defaults to '')
		 * @return {Ext.air.MessageBox} this
		 */
		progress: function(title, msg, progressText) {
			this.show({
				title: title,
				msg: msg,
				buttons: false,
				progress: true,
				closable: false,
				minWidth: this.minProgressWidth,
				progressText: progressText
			});
			return this;
		},
		/**
		 * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
		 * interaction while waiting for a long-running process to complete that does not have defined intervals.
		 * You are responsible for closing the message box when the process is complete.
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Object} config (optional) A {@link Ext.ProgressBar#waitConfig} object
		 * @return {Ext.air.MessageBox} this
		 */
		wait: function(title, msg, config) {
			this.show({
				title: title,
				msg: msg,
				buttons: false,
				closable: false,
				wait: true,
				modal: true,
				minWidth:  this.minProgressWidth,
				waitConfig: config
			});
			return this;
		},
		/**
		 * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt).
		 * If a callback function is passed it will be called after the user clicks the button, and the
		 * id of the button that was clicked will be passed as the only parameter to the callback
		 * (could also be the top-right close button).
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Function} fn (optional) The callback function invoked after the message box is closed
		 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to the current window.
		 * @return {Ext.air.MessageBox} this
		 */
		alert: function(title, msg, fn, scope) {
			this.show({
				title: title,
				msg: msg,
				buttons: this.OK,
				fn: fn,
				scope: scope,
				minWidth: this.minWidth
			});
			return this;
		},
		/**
		 * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm).
		 * If a callback function is passed it will be called after the user clicks either button,
		 * and the id of the button that was clicked will be passed as the only parameter to the callback
		 * (could also be the top-right close button).
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Function} fn (optional) The callback function invoked after the message box is closed
		 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to the current wnidow.
		 * @return {Ext.air.MessageBox} this
		 */
		confirm: function(title, msg, fn, scope) {
			this.show({
				title: title,
				msg: msg,
				buttons: this.YESNO,
				fn: fn,
				scope: scope,
				icon: this.QUESTION,
				minWidth: this.minWidth
			});
			return this;
		},
		/**
		 * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
		 * The prompt can be a single-line or multi-line textbox. If a callback function is passed it will be called after the user
		 * clicks either button, and the id of the button that was clicked (could also be the top-right
		 * close button) and the text that was entered will be passed as the two parameters to the callback.
		 * @param {String} title The title bar text
		 * @param {String} msg The message box body text
		 * @param {Function} fn (optional) The callback function invoked after the message box is closed
		 * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the callback is executed. Defaults to the current window.
		 * @param {Boolean/Number} multiline (optional) True to create a multiline textbox using the defaultTextHeight
		 * property, or the height in pixels to create the textbox (defaults to false / single-line)
		 * @param {String} value (optional) Default value of the text input element (defaults to '')
		 * @return {Ext.air.MessageBox} this
		 */
		prompt: function(title, msg, fn, scope, multiline, value) {
			this.show({
				title: title,
				msg: msg,
				buttons: this.OKCANCEL,
				fn: fn,
				minWidth: this.minPromptWidth,
				scope: scope,
				prompt: true,
				multiline: multiline,
				value: value
			});
			return this;
		},
		/**
		 * An object containing the default button config objects that can be overriden for localized language support.
		 * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
		 * resource file for handling language support across the framework.
		 * Customize the default text like so: Ext.air.MessageBox.buttonText.yes = {text:"oui"}; //french
		 * @type Object
		 */
		buttonCfg: {
			ok: {
				text: 'OK'
			},
			cancel: {
				text: 'Cancel'
			},
			yes: {
				text: 'Yes'
			},
			no: {
				text: 'No'
			}
		},
		/**
		 * Button config that displays a single OK button
		 * @type Object
		 */
		OK: {ok:true},
		/**
		 * Button config that displays a single Cancel button
		 * @type Object
		 */
		CANCEL: {cancel:true},
		/**
		 * Button config that displays OK and Cancel buttons
		 * @type Object
		 */
		OKCANCEL: {ok:true, cancel:true},
		/**
		 * Button config that displays Yes and No buttons
		 * @type Object
		 */
		YESNO: {yes:true, no:true},
		/**
		 * Button config that displays Yes, No and Cancel buttons
		 * @type Object
		 */
		YESNOCANCEL: {yes:true, no:true, cancel:true},
		/**
		 * The CSS class that provides the INFO icon image
		 * @type String
		 */
		INFO: 'ext-mb-info',
		/**
		 * The CSS class that provides the WARNING icon image
		 * @type String
		 */
		WARNING: 'ext-mb-warning',
		/**
		 * The CSS class that provides the QUESTION icon image
		 * @type String
		 */
		QUESTION: 'ext-mb-question',
		/**
		 * The CSS class that provides the ERROR icon image
		 * @type String
		 */
		ERROR: 'ext-mb-error',
		/**
		 * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
		 * @type Number
		 */
		defaultTextHeight: 75,
		/**
		 * The maximum width in pixels of the message box (defaults to 600)
		 * @type Number
		 */
		maxWidth: 600,
		/**
		 * The minimum width in pixels of the message box (defaults to 100)
		 * @type Number
		 */
		minWidth: 100,
		/**
		 * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
		 * for setting a different minimum width than text-only dialogs may need (defaults to 250).
		 * @type Number
		 */
		minProgressWidth: 250,
		/**
		 * The minimum width in pixels of the message box if it is a prompt dialog.  This is useful
		 * for setting a different minimum width than text-only dialogs may need (defaults to 250).
		 * @type Number
		 */
		minPromptWidth: 250
	};
}();
/**
 * Shorthand for {@link Ext.air.MessageBox}
 */
Ext.air.Msg = Ext.air.MessageBox;
/**
 * EXPERIMENTAL - True to use a lightweight transparent fullscreen alwaysInFront window to display menus,
 * tooltips etc. (Layers in general) to allow overlapping of the current window size. Set this
 * <b>before</b> any <code>Ext.onReady</code> calls. Defaults to <code>false</code>.
 * Setting this to true can cause performance issues, especially when the app starts,
 * because Ext.onReady fires not until both, the current window and the layer window are ready.
 * @property USE_EXTENDED_LAYER
 * @type Boolean
 * @member Ext
 */
Ext.USE_EXTENDED_LAYER = false;

(function() {
	var root = Ext.air.App.getRootHtmlWindow(),
		count = 0; // counter, e.g. for submenus to not hide the XWindow if parent menu is still open
	// Only execute this function in root window
	
	window.nativeWindow.addEventListener('deactivate', function() {
		if (!Ext.air.App.getActiveWindow() && Ext.air.XWindow && !Ext.air.XWindow.getNative().closed) {
			Ext.air.XWindow.hide();
		}
	});
	
	if (root != window) {
		window.Ext.air.XWindow = root.Ext.air.XWindow;
		return;
	}

	if (!Ext.air.XWindow) {
		Ext.air.XWindow = new Ext.air.NativeWindow({
			type: air.NativeWindowType.LIGHTWEIGHT,
			parent: root.nativeWindow,
			systemChrome: air.NativeWindowSystemChrome.NONE,
			transparent: true,
			complete: false,
			maximizable: false,
			resizable: false,
			minimizable: false,
			draggable: false,
			hidden: true,
			alwaysInFront: true,
			closeAction: 'hide',
			fileQuery: {
				type: 'queryExt',
				root: root.document,
				includeAllCSS: true
			},
			manager: { // do not use a manager on this window, apply a pseudo
				register: Ext.emptyFn,
				unregister: Ext.emptyFn
			},
			show: function() {
				count++;
				Ext.air.NativeWindow.prototype.show.apply(this, arguments);
			},
			hide: function() {
				count--;
				if (count < 1) {
					count = 0;
					Ext.air.NativeWindow.prototype.hide.apply(this, arguments);
				}
			},
			listeners: {
				'complete': function(w) {
					var b = w.getDocument().body;
					b.scroll = 'no';
					b.style.overflow = 'hidden';
					w.fullscreen(true);
					w.complete = true;
				}
			}
		});
	}
		
	Ext.apply(Ext.EventManager, {
		onDocumentReady: Ext.EventManager.onDocumentReady.createInterceptor(function(fn, scope, options) {
			if (root.Ext.USE_EXTENDED_LAYER === true) {
				if (root.Ext.air.XWindow.complete) {
					root.Ext.air.XWindow.getWindow().Ext.EventManager.onDocumentReady(fn, scope || window, options);
				} else {
					root.Ext.air.XWindow.on('complete', function(w) {
						w.getWindow().Ext.EventManager.onDocumentReady(fn, scope || window, options);
					}, this, {single: true});
				}
				return false;
			}
		})
	});
	Ext.onReady(function() {
		// if we do not use XWindow, close it
		if (Ext.USE_EXTENDED_LAYER !== true && Ext.air.XWindow) {
			Ext.air.XWindow.close();
		}
	}, root, {single: true});
	
	Ext.onReady = Ext.EventManager.onDocumentReady;
})();
Ext.override(Ext.Layer, {
	anim: function() { // no animation
		return this;
	},
	isVisible: function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			return Ext.air.XWindow.isVisible() && this.visible;
		}
		return this.visible;
	},
	showAction: Ext.Layer.prototype.showAction.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			var d = Ext.air.XWindow.getDocument();
			this.xParent = this.dom.parentNode;
			this.dom = d.adoptNode(this.dom, true);
			d.body.appendChild(this.dom);
			Ext.air.XWindow.show();
		}
	}),
	hideAction: Ext.Layer.prototype.hideAction.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && this.xParent) {
			this.dom = document.adoptNode(this.dom, true);
			this.xParent.appendChild(this.dom);
			Ext.air.XWindow.hide();
		}
	}),
	getX: function() {
		return this.getXY()[0];
	},
	getY: function() {
		return this.getXY()[1];
	},
	getXY: function() {
		var xy = Ext.Element.prototype.getXY.call(this);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			xy[0] -= window.nativeWindow.x;
			xy[1] -= window.nativeWindow.y;
		}
		return xy;
	},
	setXY : function(xy, a, d, c, e) {
		var nxy = [xy[0],xy[1]];
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			nxy[0] += window.nativeWindow.x;
			nxy[1] += window.nativeWindow.y;
		}
		this.fixDisplay();
		this.beforeAction();
		this.storeXY(nxy);
		var cb = this.createCB(c);
		Ext.Element.prototype.setXY.call(this, nxy, a, d, cb, e);
		if(!a){
			cb();
		}
		return this;
	},
	setLeftTop : function(left, top){
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			left += window.nativeWindow.x;
			top += window.nativeWindow.y;
		}
		this.storeLeftTop(left, top);
		Ext.Element.prototype.setLeftTop.apply(this, arguments);
		this.sync();
		return this;
	},
	getTop: function(local) {
		var t = Ext.Element.prototype.getTop.call(this, local);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && local) {
			t -= window.nativeWindow.y;
		}
		return t;
	},
	getLeft: function(local) {
		var l = Ext.Element.prototype.getLeft.call(this, local);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && local) {
			l -= window.nativeWindow.x;
		}
		return l;
	},
	getPositioning: function() {
		var p = Ext.Element.prototype.getPositioning.call(this);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			p[p.top ? 'top' : 'bottom'] -= window.nativeWindow.y;
			p[p.left ? 'left' : 'right'] -= window.nativeWindow.x;
		}
		return p;
	},
	constrainXY: function() {
		return this;
	},
	setBounds: function(x, y, w, h, a, d, c, e) {
		this.beforeAction();
		var cb = this.createCB(c);
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			x += window.nativeWindow.x;
			y += window.nativeWindow.y;
		}
		if (!a) {
			this.storeXY([x, y]);
			Ext.Element.prototype.setXY.call(this, [x, y]);
			Ext.Element.prototype.setSize.call(this, w, h, a, d, cb, e);
			cb();
		} else {
			Ext.Element.prototype.setBounds.call(this, x, y, w, h, a, d, cb, e);
		}
		return this;
	},
	getBox: function(contentBox, local) {
		var b = Ext.Element.prototype.getBox.call(this, contentBox, local),
			x = window.nativeWindow.x,
			y = window.nativeWindow.y;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && local) {
			b.x -= x;
			b[0] -= x;
			b.y -= y;
			b[1] -= y;
			b.right -= x;
			b.bottom -= y;
		}
		return b;
	},
	getRegion: function() {
		var r = Ext.Element.prototype.getRegion.call(this),
			x = window.nativeWindow.x,
			y = window.nativeWindow.y;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			r.left -= x;
			r.right -= x;
			r[0] -= x;
			r.top -= y;
			r.bottom -= y;
			r[1] -= y;
		}
		return r;
	},
	setRegion: function(region, animate) {
		var r = region,
			x = window.nativeWindow.x,
			y = window.nativeWindow.y;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			r = Ext.copyTo({}, r, 'left,right,top,bottom');
			r.left += x;
			r.right += x;
			r.top += y;
			r.bottom += y;
		}
		return Ext.Element.prototype.setRegion.call(this, r, animate);
	},
	translatePoints: function(x, y) {
		y = isNaN(x[1]) ? y : x[1];
		x = isNaN(x[0]) ? x : x[0];
		var me = this,
			relative = me.isStyle('position', 'relative'),
			o = me.getXY(),
			e = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
			wx = e ? window.nativeWindow.x : 0,
			wy = e ? window.nativeWindow.y : 0,
			l = parseInt(me.getStyle('left'), 10),
			t = parseInt(me.getStyle('top'), 10);
		l = !isNaN(l) ? l - wx : (relative ? 0 : me.dom.offsetLeft - wx);
		t = !isNaN(t) ? t - wy : (relative ? 0 : me.dom.offsetTop - wy);
		
		return {left: (x - o[0] + l), top: (y - o[1] + t)};
	},
	getConstrainToXY : function(el, local, offsets, proposedXY){   
		var os = {top:0, left:0, bottom:0, right: 0};
		
		return function(el, local, offsets, proposedXY) {
			el = Ext.get(el);
			var vw, vh, vx = 0, vy = 0;
			offsets = offsets ? Ext.applyIf(offsets, os) : os;
			
			if (el.dom == document.body || el.dom == document) {
				if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
					vw = Ext.air.XWindow.getWidth();
					vh = Ext.air.XWindow.getHeight();
				} else {
					vw = Ext.lib.Dom.getViewWidth();
					vh = Ext.lib.Dom.getViewHeight();
				}
			} else {
				vw = el.dom.clientWidth;
				vh = el.dom.clientHeight;
				if (!local) {
					var vxy = el.getXY();
					vx = vxy[0];
					vy = vxy[1];
				}
			}

			var s = el.getScroll();

			vx += offsets.left + s.left;
			vy += offsets.top + s.top;

			vw -= offsets.right;
			vh -= offsets.bottom;

			var vr = vx + vw,
				vb = vy + vh,
				xy = proposedXY || (!local ? this.getXY() : [this.getLeft(true), this.getTop(true)]),
				x = xy[0], y = xy[1],
				offset = this.getConstrainOffset(),
				w = this.dom.offsetWidth + offset, 
				h = this.dom.offsetHeight + offset;

			// only move it if it needs it
			var moved = false;

			// first validate right/bottom
			if((x + w) > vr){
				x = vr - w;
				moved = true;
			}
			if((y + h) > vb){
				y = vb - h;
				moved = true;
			}
			// then make sure top/left isn't negative
			if(x < vx){
				x = vx;
				moved = true;
			}
			if(y < vy){
				y = vy;
				moved = true;
			}
			return moved ? [x, y] : false;
		};
	}(),
	getAlignToXY: function(el, p, o) {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			p = (!p || p == "?" ? "tl-bl?" : (!(/-/).test(p) && p !== "" ? "tl-" + p : p || "tl-bl")).toLowerCase();
			var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/),
				c = !!m[3],
				xy, w, h, r, p1y, p1x, p2y, p2x, swapY, swapX,
				p1 = "",
				p2 = "",
				wx = window.nativeWindow.x,
				wy = window.nativeWindow.y,
				dw = Ext.air.XWindow.getWidth(),
				dh = Ext.air.XWindow.getHeight();
			if (c) {
				p = p.substr(0, p.length - 1);
				r = el.getRegion();
			}
			xy = Ext.Element.prototype.getAlignToXY.call(this, el, p, o);
			if (el.dom && el.dom.ownerDocument == Ext.air.XWindow.getDocument()) {
				xy[0] -= wx;
				xy[1] -= wy;
				r.left -= wx;
				r[0] -= wx;
				r.right -= wx;
				r.top -= wy;
				r[1] -= wy;
				r.bottom -= wy;
			}
			if (c) {
				p1 = m[1],
				p2 = m[2],
				w = this.getWidth();
				h = this.getHeight();
				//If we are at a viewport boundary and the aligned el is anchored on a target border that is
				//perpendicular to the vp border, allow the aligned el to slide on that border,
				//otherwise swap the aligned el to the opposite border of the target.
				p1y = p1.charAt(0);
				p1x = p1.charAt(p1.length-1);
				p2y = p2.charAt(0);
				p2x = p2.charAt(p2.length-1);
				swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
				swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));
				if (xy[0] + w + wx > dw) {
					xy[0] = swapX ? r.left - w : dw - w;
				}
				if (xy[0] + wx < 0) {
					xy[0] = swapX ? r.right : 0;
				}
				if (xy[1] + h + wy > dh) {
					xy[1] = swapY ? r.top - h : dh - h;
				}
				if (xy[1] + wy < 0) {
					xy[1] = swapY ? r.bottom : 0;
				}
			}
			return xy;
		}
		return Ext.Element.prototype.getAlignToXY.apply(this, arguments);
	},
	constrainXY : function(){
		if(true || this.constrain){
			var e = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
				vw = e ? Ext.air.XWindow.getWidth() : Ext.lib.Dom.getViewWidth(),
				vh = e ? Ext.air.XWindow.getHeight() : Ext.lib.Dom.getViewHeight(),
				s = e ? {left: 0,top: 0} : Ext.getDoc().getScroll(),
				wx = e ? window.nativeWindow.x : 0,
				wy = e ? window.nativeWindow.y : 0,

				xy = this.getXY(),
				x = xy[0], y = xy[1],
				so = this.shadowOffset,
				w = this.dom.offsetWidth+so, h = this.dom.offsetHeight+so,
			// only move it if it needs it
				moved = false;
			// first validate right/bottom
			if((x + w + wx) > vw+s.left){
				x = vw - w - so - wx;
				moved = true;
			}
			if((y + h + wy) > vh+s.top){
				y = vh - h - so - wy;
				moved = true;
			}
			// then make sure top/left isn't negative
			if(x + wx < s.left){
				x = s.left;
				moved = true;
			}
			if(y + wy < s.top){
				y = s.top;
				moved = true;
			}
			if(moved){
				if(this.avoidY){
					var ay = this.avoidY;
					if(y <= ay && (y+h) >= ay){
						y = ay-h-5;
					}
				}
				x += wx;
				y += wy;
				xy = [x, y];
				this.storeXY(xy);
				Ext.Element.prototype.setXY.call(this, xy);
				this.sync();
			}
		}
		return this;
	},
	// private
	// this code can execute repeatedly in milliseconds (i.e. during a drag) so
	// code size was sacrificed for effeciency (e.g. no getBox/setBox, no XY calls)
	sync : function(doShow){
		var shadow = this.shadow,
			e = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
			x = e ? window.nativeWindow.x : 0,
			y = e ? window.nativeWindow.y : 0;
		if(!this.updating && this.isVisible() && (shadow || this.useShim)){
			var shim = this.getShim(),
				w = this.getWidth(),
				h = this.getHeight(),
				l = this.getLeft(true) + x,
				t = this.getTop(true) + y;

			if(shadow && !this.shadowDisabled){
				if(doShow && !shadow.isVisible()){
					shadow.show(this);
				}else{
					shadow.realign(l, t, w, h);
				}
				if(shim){
					if(doShow){
					   shim.show();
					}
					// fit the shim behind the shadow, so it is shimmed too
					var shadowAdj = shadow.el.getXY(), shimStyle = shim.dom.style,
						shadowSize = shadow.el.getSize();
					shimStyle.left = (shadowAdj[0])+'px';
					shimStyle.top = (shadowAdj[1])+'px';
					shimStyle.width = (shadowSize.width)+'px';
					shimStyle.height = (shadowSize.height)+'px';
				}
			}else if(shim){
				if(doShow){
				   shim.show();
				}
				shim.setSize(w, h);
				shim.setLeftTop(l, t);
			}
		}
	}
});
Ext.override(Ext.Shadow, {
	show : function(target) {
		var win;
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && target instanceof Ext.Layer) {
			win = Ext.air.XWindow.getWindow();
			target = Ext.get(target.dom);
		} else {
			win = window;
			target = Ext.get(target);
		}
		if (!this.el) {
			this.el = win.Ext.Shadow.Pool.pull();
			if (this.el.dom.nextSibling != target.dom) {
				this.el.insertBefore(target);
			}
		}
		this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
		if(Ext.isIE){
			this.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+(this.offset)+")";
		}
		this.realign(
			target.getLeft(true),
			target.getTop(true),
			target.getWidth(),
			target.getHeight()
		);
		this.el.dom.style.display = "block";
	}
});
Ext.override(Ext.menu.Menu, {
	constrainScroll: function(y) {
		var max, full = this.ul.setHeight('auto').getHeight(),
			returnY = y, normalY, parentEl, scrollTop, viewHeight;
		if(this.floating){
			if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
				viewHeight = Ext.air.XWindow.getHeight();
				scrollTop = 0;
			} else {
				parentEl = Ext.fly(this.el.dom.parentNode);
				scrollTop = parentEl.getScroll().top;
				viewHeight = parentEl.getViewSize().height;
			}
			//Normalize y by the scroll position for the parent element.  Need to move it into the coordinate space
			//of the view.
			normalY = y - scrollTop;
			max = this.maxHeight ? this.maxHeight : viewHeight - normalY;
			if(full > viewHeight) {
				max = viewHeight;
				//Set returnY equal to (0,0) in view space by reducing y by the value of normalY
				returnY = y - normalY;
			} else if(max < full) {
				returnY = y - (full - max);
				max = full;
			}
		}else{
			max = this.getHeight();
		}
		// Always respect maxHeight 
		if (this.maxHeight){
			max = Math.min(this.maxHeight, max);
		}
		if(full > max && max > 0){
			this.activeMax = max - this.scrollerHeight * 2 - this.el.getFrameWidth('tb') - Ext.num(this.el.shadowOffset, 0);
			this.ul.setHeight(this.activeMax);
			this.createScrollers();
			this.el.select('.x-menu-scroller').setDisplayed('');
		}else{
			this.ul.setHeight(full);
			this.el.select('.x-menu-scroller').setDisplayed('none');
		}
		this.ul.dom.scrollTop = 0;
		return returnY;
	}
});
Ext.override(Ext.ColorPalette, {
	// OMG what a stupid hack
	select: Ext.ColorPalette.prototype.select.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && this.ownerCt instanceof Ext.menu.Menu) {
			this.xEl = this.el;
			this.el = Ext.get(document.importNode(this.ownerCt.el.dom, true));
		}
	}).createSequence(function() {
		if (this.xEl) {
			Ext.removeNode(this.el.dom);
			this.el = this.xEl;
		}
	})
});
Ext.override(Ext.form.ComboBox, {
	restrictHeight: function(){
		this.innerList.dom.style.height = '';
		var inner = this.innerList.dom,
			xl = Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow,
			pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight,
			h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight),
			ha = this.getPosition()[1]-Ext.getBody().getScroll().top + (xl ? Ext.air.XWindow.getPosition()[1] : 0),
			hv = xl ? Ext.air.XWindow.getHeight() : Ext.lib.Dom.getViewHeight(),
			hb = hv-ha-this.getSize().height,
			space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;
		h = Math.min(h, space, this.maxHeight);

		this.innerList.setHeight(h);
		this.list.beginUpdate();
		this.list.setHeight(h+pad);
		this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
		this.list.endUpdate();
	},
	initEvents: Ext.form.ComboBox.prototype.initEvents.createSequence(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			this.on({
				'expand': this.onExpandX,
				'collapse': this.onCollapseX,
				scope: this
			});
		}
	}),
	onExpandX: function() {
		this.mon(Ext.air.XWindow.getWindow().Ext.getDoc(), {
			'mousewheel': this.collapseIfX,
			'mousedown': this.collapseIfX,
			scope: this
		});
	},
	onCollapseX: function() {
		var d = Ext.air.XWindow.getWindow().Ext.getDoc();
		this.mun(d, 'mousewheel', this.collapseIfX, this);
		this.mun(d, 'mousedown', this.collapseIfX, this);
	},
	collapseIfX: function(e) {
		var wl = e.within(this.list);
		if (!this.isDestroyed) {
			if (!wl) {
				this.collapse();
			} else {
				window.nativeWindow.activate();
				this.el.focus();
			}
		}
	},
	collapseIf: function(e) {
		if (!this.isDestroyed && !e.within(this.wrap)) {
			if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow && e.type == 'mousewheel') {
				Ext.air.XWindow.setActive(true);
				this.list.focus();
			} else if (!e.within(this.list)) {
				this.collapse();
			}
		}
	}
});
Ext.override(Ext.util.ClickRepeater, {
	handleMouseDown: Ext.util.ClickRepeater.prototype.handleMouseDown.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			Ext.air.XWindow.getWindow().Ext.getDoc().on('mouseup', this.handleMouseUp, this);
		}
	}),
	handleMouseUp: Ext.util.ClickRepeater.prototype.handleMouseUp.createInterceptor(function() {
		if (Ext.USE_EXTENDED_LAYER === true && Ext.air.XWindow) {
			Ext.air.XWindow.getWindow().Ext.getDoc().un('mouseup', this.handleMouseUp, this);
		}
	})
});

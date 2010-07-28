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

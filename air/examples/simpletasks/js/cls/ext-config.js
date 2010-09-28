Ext.BLANK_IMAGE_URL = '/lib/extjs/resources/images/default/s.gif';

tx = {data:{}, ui: {}, grid: {}, tree: {}, form: {}};

// work around for broken cross frame Dates in Safari
function fixDate(d){
	return d ? new Date(d.getTime()) : d;
}

function fixDateMember(o, name){
	if(o[name]){
		o[name] = new Date(o[name].getTime());
	}
}


/**
 * @class Ext.data.DirectStore
 * @extends Ext.data.Store
 * A pre-configured convenience class of Ext.data.Store which makes interacting
 * with an Ext.Direct Server-side Provider easier.
 *
 * Makes the assumption that you will always use an Ext.data.DirectProxy and an
 * Ext.data.JsonReader.
 */
/**
 * @cfg paramOrder {Array/String} An array of params and the order which they must be executed on the server-side. Can also be specified as a comma or pipe delimited list. Examples ['arg1','arg2'] or 'arg1|arg2' or 'arg1,arg2'
 */
/**
 * @cfg paramsAsHash {Boolean}
 * Send parameters as a collection of named arguments. Defaults to true. Providing a paramOrder immediately overrides this configuration.
 */
/**
 * @cfg directFn {Function}
 * The Ext.Direct function which has been imported from the server-side
 */
Ext.data.DirectStore = function(c){
	var pcfg = Ext.copyTo({}, c, 'paramOrder,paramsAsHash,directFn');
	Ext.data.DirectStore.superclass.constructor.call(this, Ext.apply(c, {
		proxy: new Ext.data.DirectProxy(pcfg),
		reader: new Ext.data.JsonReader(c, c.fields)
	}));
};
Ext.extend(Ext.data.DirectStore, Ext.data.Store);
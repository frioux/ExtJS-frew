/**
 * @class Ext.data.XmlReader
 * @extends Ext.data.DataReader
 * Data reader class to create an Array of {@link Ext.data.Record} objects from an XML document
 * based on mappings in a provided Ext.data.Record constructor.
 * <p>
 * The code below lists all configuration options.
 * <pre><code>
var myReader = new Ext.data.XmlReader({
   record: "row",           // The repeated element which contains record information
   totalRecords: "results", // The element which contains the number of returned records (optional)
   id: "id"                 // The element within the record that provides an ID for the record (optional)
}, myRecordDefinition);
</code></pre>
 * <p>
 * This would consume an XML file like this:
 * <pre><code>
<?xml?>
<dataset>
 <results>2</results>
 <row>
   <id>1</id>
   <name>Bill</name>
 </row>
 <row>
   <id>2</id>
   <name>Ben</name>
 </row>
</dataset>
</code></pre>
 * @cfg {String} totalRecords The DomQuery path from which to retrieve the total number of records
 * in the dataset. This is only needed if the whole dataset is not passed in one go, but is being
 * paged from the remote server.
 * @cfg {String} record The DomQuery path to the repeated element which contains record information.
 * @cfg {String} id The DomQuery path relative from the record element to the element that contains
 * a record identifier value.
 * @constructor
 * Create a new XmlReader
 * @param {Object} meta Metadata configuration options
 * @param {Mixed} recordType The definition of the data record type to produce.  This can be either a valid
 * Record subclass created with {@link Ext.data.Record#create}, or an array of objects with which to call
 * Ext.data.Record.create.  See the {@link Ext.data.Record} class for more details.
 */
Ext.data.XmlReader = function(meta, recordType){
    Ext.data.XmlReader.superclass.constructor.call(this, meta, recordType);
};
Ext.extend(Ext.data.XmlReader, Ext.data.DataReader, {
    /**
     * This method is only used by a DataProxy which has retrieved data from a remote server.
	 * @param {Object} response The XHR object which contains the parsed XML document.  The response is expected
	 * to contain a method called 'responseXML' that returns an XML document object.
     * @return {Object} records A data block which is used by an {@link Ext.data.Store} as
     * a cache of Ext.data.Records.
     */
    read : function(response){
        var doc = response.responseXML;
        if(!doc) {
            throw {message: "XmlReader.read: XML Document not available"};
        }
        return this.readRecords(doc);
    },

    /**
     * Create a data block containing Ext.data.Records from an XML document.
	 * @param {Object} doc A parsed XML document.
     * @return {Object} records A data block which is used by an {@link Ext.data.Store} as
     * a cache of Ext.data.Records.
     */
    readRecords : function(doc){
        this.xmlData = doc;
        var root = doc.documentElement || doc;
    	var q = Ext.DomQuery;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var sid = this.meta.id;
    	var totalRecords = 0;
    	if(this.meta.totalRecords){
    	    totalRecords = q.selectNumber(this.meta.totalRecords, root, 0);
    	}
    	var records = [];
    	var ns = q.select(this.meta.record, root);
        for(var i = 0, len = ns.length; i < len; i++) {
	        var n = ns[i];
	        var values = {};
	        var id = sid ? q.selectValue(sid, n) : undefined;
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
	            var f = fields.items[j];
                var v = q.selectValue(f.mapping || f.name, n, f.defaultValue);
	            v = f.convert(v);
	            values[f.name] = v;
	        }
	        var record = new recordType(values, id);
	        record.node = n;
	        records[records.length] = record;
	    }

	    return {
	        records : records,
	        totalRecords : totalRecords || records.length
	    };
    }
});
// Base class for reading structured data from a data source.  This class is intended to be
// extended (see ArrayReader, JsonReader and XmlReader) and should not be created directly.
Ext.data.DataReader = function(meta, recordType){
    this.meta = meta;
    this.recordType = recordType instanceof Array ? 
        Ext.data.Record.create(recordType) : recordType;
};

Ext.data.DataReader.prototype = {
    
};
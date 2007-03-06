Ext.data.DataReader = function(meta, recordType){
    this.meta = meta;
    this.recordType = recordType instanceof Array ? 
        Ext.data.Record.create(recordType) : recordType;
};

Ext.data.DataReader.prototype = {
    
};
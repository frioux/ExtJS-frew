/**
 * @class Ext.data.XmlWriter
 * @extends Ext.data.DataWriter
 * DataWriter extension for writing an array or single {@link Ext.data.Record} object(s) in preparation for executing a remote CRUD action via XML.
 */
Ext.data.XmlWriter = Ext.extend(Ext.data.DataWriter, {
    /**
     * @cfg {String} root [records] The name of the root element when writing <b>multiple</b> records to the server.  Each
     * xml-record written to the server will be wrapped in an element named after {@link Ext.data.XmlReader#record} property.
     * eg:
<code><pre>
&lt;?xml version="1.0" encoding="UTF-8"?>
&lt;user>&lt;first>Barney&lt;/first>&lt;/user>
</code></pre>
     * However, when <b>multiple</b> records are written in a batch-operation, these records must be wrapped in a containing
     * Element.
     * eg:
<code><pre>
&lt;?xml version="1.0" encoding="UTF-8"?>
    &lt;records>
        &lt;first>Barney&lt;/first>&lt;/user>
        &lt;records>&lt;first>Barney&lt;/first>&lt;/user>
    &lt;/records>
</code></pre>
     * Defaults to <tt>records</tt>
     */
    root: 'records',

    /**
     * @cfg {String} xmlHeader [<?xml version="1.0" encoding="ISO-8859-15"?>]
     */
    xmlHeader: '<?xml version="1.0" encoding="ISO-8859-15"?>',

    /**
     * Final action of a write event.  Apply the written data-object to params.
     * @param {String} action [Ext.data.Api.create|read|update|destroy]
     * @param {Ext.data.Record/Ext.data.Record[]} rs
     * @param {Object} http params
     * @param {Object/Object[]} rendered data.
     */
    render : function(action, rs, params, data) {
        var doc = [this.xmlHeader];
        if (Ext.isArray(rs)) {
            doc.push(this.element(this.root, data.join('')));
        } else {
            doc.push(data);
        }
        params.xmlData = doc.join('');
    },

    /**
     * Converts an Ext.data.Record to xml
     * @param {Ext.data.Record} rec
     * @return {String} rendered xml-element
     * @private
     */
    toXml : function(rec) {
        var output = [];
        Ext.iterate(this.toHash(rec), function(k, v) {
            if (k != this.meta.idProperty) {
                output.push(this.element(k, v));
            }
        },this);
        if (!rec.phantom) {
            output.push(this.element(this.meta.idProperty, rec.id));
        }
        return this.element(this.meta.record, output.join(''));
    },

    /**
     * createRecord
     * @param {Ext.data.Record} rec
     * @return {String} xml element
     * @private
     */
    createRecord : function(rec) {
        return this.toXml(rec);
    },

    /**
     * updateRecord
     * @param {Ext.data.Record} rec
     * @return {String} xml element
     * @private
     */
    updateRecord : function(rec) {
        return this.toXml(rec);

    },
    /**
     * destroyRecord
     * @param {Ext.data.Record} rec
     * @return {String} xml element
     */
    destroyRecord : function(rec) {
        return this.element(this.meta.record, this.element(this.meta.idProperty, rec.id));
    },

    /**
     * Simple Xml element builder
     * @param {String} tag
     * @param {Mixed} data
     * @return {String} xml element
     * @private
     */
    element : function(tag, data) {
        return ['<',tag,'>',data,'</',tag,'>'].join('');
    }
});
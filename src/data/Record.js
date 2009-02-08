/**
* @class Ext.data.Record
 * <p>Instances of this class encapsulate both Record <em>definition</em> information, and Record
 * <em>value</em> information for use in {@link Ext.data.Store} objects, or any code which needs
 * to access Records cached in an {@link Ext.data.Store} object.</p>
 * <p>Constructors for this class are generated by passing an Array of field definition objects to {@link #create}.
 * Instances are usually only created by {@link Ext.data.Reader} implementations when processing unformatted data
 * objects.</p>
 * <p>Note that an instance of a Record class may only belong to one {@link Ext.data.Store Store} at a time.
 * In order to copy data from one Store to another, use the {@link #copy} method to create an exact
 * copy of the Record, and insert the new instance into the other Store.</p>
 * <p>When serializing a Record for submission to the server, be aware that it contains many private
 * properties, and also a reference to its owning Store which in turn holds references to its Records.
 * This means that a whole Record may not be encoded using {@link Ext.util.JSON.encode}. Instead, use the
 * {@link data} and {@link id} properties.</p>
 * Record objects generated by this constructor inherit all the methods of Ext.data.Record listed below.
 * @constructor
 * This constructor should not be used to create Record objects. Instead, use {@link #create} to
 * generate a subclass of Ext.data.Record configured with information about its consituent fields. 
 * @param {Object} data An object, the properties of which provide values for the new Record's fields.
 * @param {Object} id (Optional) The id of the Record. This id should be unique, and is used by the
 * {@link Ext.data.Store} object which owns the Record to index its collection of Records. If
 * not specified an integer id is generated.
 */
Ext.data.Record = function(data, id){
    this.id = (id || id === 0) ? id : ++Ext.data.Record.AUTO_ID;
    this.data = data;
};

/**
 * Generate a constructor for a specific Record layout.
 * @param {Array} o An Array of field definition objects which specify field names, and optionally,
 * data types, and a mapping for an {@link Ext.data.Reader} to extract the field's value from a data object.
 * Each field definition object may contain the following properties: <ul>
 * <li><b>name</b> : String<div class="sub-desc">The name by which the field is referenced within the Record. This is referenced by,
 * for example, the <tt>dataIndex</tt> property in column definition objects passed to {@link Ext.grid.ColumnModel}</div></li>
 * <li><b>mapping</b> : String/Number<div class="sub-desc">(Optional) A path specification for use by the {@link Ext.data.Reader}
 * implementation that is creating the Record to select the field value from the data object.<ul>
 * <li>If an {@link Ext.data.JsonReader} is being used, then this is a string containing the javascript expression to
 * reference the data relative to the Record item's root. Defaults to the field name.</li>
 * <li>If an {@link Ext.data.XmlReader} is being used, this is an {@link Ext.DomQuery} path to the data item relative to the
 * DOM element that represents the Record. Defaults to the field name.</li>
 * <li>If an {@link Ext.data.ArrayReader} is being used, this may be a number indicating the Array index of the field's value.
 * Defaults to the field specification's Array position.</li>
 * </ul></div></li>
 * <li><b>type</b> : String<div class="sub-desc">(Optional) The data type for conversion to displayable value. Possible values are
 * <ul><li>auto (Default, implies no conversion)</li>
 * <li>string</li>
 * <li>int</li>
 * <li>float</li>
 * <li>boolean</li>
 * <li>date</li></ul></div></li>
 * <li><b>sortType</b> : Function<div class="sub-desc">(Optional) A function which converts a Field's value to a comparable value
 * in order to ensure correct sort ordering. Predefined functions are provided in {@link Ext.data.SortTypes}.</div></li>
 * <li><b>sortDir</b> : String<div class="sub-desc">(Optional) Initial direction to sort. "ASC" or "DESC"</div></li>
 * <li><b>convert</b> : Function<div class="sub-desc">(Optional) A function which converts the value provided
 * by the Reader into an object that will be stored in the Record. It is passed the
 * following parameters:<ul>
 * <li><b>v</b> : Mixed<div class="sub-desc">The data value as read by the Reader.</div></li>
 * <li><b>rec</b> : Mixed<div class="sub-desc">The data object containing the row as read by the Reader.
 * Depending on Reader type, this could be an Array, an object, or an XML element.</div></li>
 * </ul></div></li>
 * <li><b>dateFormat</b> : String<div class="sub-desc">(Optional) A format string for the {@link Date#parseDate Date.parseDate} function,
 * or "timestamp" if the value provided by the Reader is a UNIX timestamp, or "time" if the value provided by the Reader is a 
 * javascript millisecond timestamp.</div></li>
 * <li><b>defaultValue</b> : Mixed<div class="sub-desc">(Optional) The default value used <b>when a Record is being created by a
 * {@link Ext.data.Reader Reader}</b> when the item referenced by the <b><tt>mapping</tt></b> does not exist in the data object
 * (i.e. undefined). (defaults to "")</div></li>
 * </ul>
 * The constructor generated by this method may be used to create new Record instances. The data object must contain properties
 * named after the field <b>names</b>. 
 * <br>usage:<br><pre><code>
var TopicRecord = Ext.data.Record.create([
    {name: 'title', mapping: 'topic_title'},
    {name: 'author', mapping: 'username'},
    {name: 'totalPosts', mapping: 'topic_replies', type: 'int'},
    {name: 'lastPost', mapping: 'post_time', type: 'date'},
    {name: 'lastPoster', mapping: 'user2'},
    {name: 'excerpt', mapping: 'post_text'}
]);

var myNewRecord = new TopicRecord({
    title: 'Do my job please',
    author: 'noobie',
    totalPosts: 1,
    lastPost: new Date(),
    lastPoster: 'Animal',
    excerpt: 'No way dude!'
});
myStore.add(myNewRecord);
</code></pre>
 * <p>In the simplest case, if no properties other than <tt>name</tt> are required, a field definition
 * may consist of just a field name string.</p>
 * @method create
 * @return {function} A constructor which is used to create new Records according
 * to the definition. The constructor has the same signature as {@link #Ext.data.Record}.
 * @static
 */
Ext.data.Record.create = function(o){
    var f = Ext.extend(Ext.data.Record, {});
    var p = f.prototype;
    p.fields = new Ext.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Ext.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);
    };
    return f;
};

Ext.data.Record.AUTO_ID = 1000;
Ext.data.Record.EDIT = 'edit';
Ext.data.Record.REJECT = 'reject';
Ext.data.Record.COMMIT = 'commit';

Ext.data.Record.prototype = {
    /**
     * <p><b>This property is stored in the Record definition's <u>prototype</u></b></p>
     * A MixedCollection containing the defined {@link Ext.data.Field Field}s for this Record.  Read-only.
     * @property fields
     * @type Ext.util.MixedCollection
     */
    /**
     * An object hash representing the data for this Record. Every field name in the Record definition
     * is represented by a property of that name in this object. Note that unless you specified a field
     * with name "id" in the Record definition, this will <b>not</b> contain an <tt>id</tt> property.
     * @property data
     * @type {Object}
     */
    /**
     * The unique ID of the Record as specified at construction time.
     * @property id
     * @type {Object}
     */
    /**
     * Readonly flag - true if this Record has been modified.
     * @type Boolean
     */
    dirty : false,
    editing : false,
    error: null,
    /**
     * This object contains a key and value storing the original values of all modified fields or is null if no fields have been modified.
     * @property modified
     * @type {Object}
     */
    modified: null,

    // private
    join : function(store){
        /**
         * The {@link Ext.data.Store} to which this Record belongs.
         * @property store
         * @type {Ext.data.Store}
         */
        this.store = store;
    },

    /**
     * Set the named field to the specified value.
     * @param {String} name The name of the field to set.
     * @param {Object} value The value to set the field to.
     */
    set : function(name, value){
        if(String(this.data[name]) == String(value)){
            return;
        }
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(typeof this.modified[name] == 'undefined'){
            this.modified[name] = this.data[name];
        }
        this.data[name] = value;
        if(!this.editing && this.store){
            this.store.afterEdit(this);
        }
    },

    /**
     * Get the value of the named field.
     * @param {String} name The name of the field to get the value of.
     * @return {Object} The value of the field.
     */
    get : function(name){
        return this.data[name];
    },

    /**
     * Begin an edit. While in edit mode, no events are relayed to the containing store.
     */
    beginEdit : function(){
        this.editing = true;
        this.modified = this.modified || {};
    },

    /**
     * Cancels all changes made in the current edit operation.
     */
    cancelEdit : function(){
        this.editing = false;
        delete this.modified;
    },

    /**
     * End an edit. If any data was modified, the containing store is notified.
     */
    endEdit : function(){
        this.editing = false;
        if(this.dirty && this.store){
            this.store.afterEdit(this);
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the Record.
     * Rejects all changes made to the Record since either creation, or the last commit operation.
     * Modified fields are reverted to their original values.
     * <p>
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified
     * of reject operations.
     * @param {Boolean} silent (optional) True to skip notification of the owning store of the change (defaults to false)
     */
    reject : function(silent){
        var m = this.modified;
        for(var n in m){
            if(typeof m[n] != "function"){
                this.data[n] = m[n];
            }
        }
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store && silent !== true){
            this.store.afterReject(this);
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the Record.
     * Commits all changes made to the Record since either creation, or the last commit operation.
     * <p>
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified
     * of commit operations.
     * @param {Boolean} silent (optional) True to skip notification of the owning store of the change (defaults to false)
     */
    commit : function(silent){
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store && silent !== true){
            this.store.afterCommit(this);
        }
    },

    /**
     * Gets a hash of only the fields that have been modified since this Record was created or commited.
     * @return Object
     */
    getChanges : function(){
        var m = this.modified, cs = {};
        for(var n in m){
            if(m.hasOwnProperty(n)){
                cs[n] = this.data[n];
            }
        }
        return cs;
    },

    // private
    hasError : function(){
        return this.error != null;
    },

    // private
    clearError : function(){
        this.error = null;
    },

    /**
     * Creates a copy of this Record.
     * @param {String} id (optional) A new Record id if you don't want to use this Record's id
     * @return {Record}
     */
    copy : function(newId) {
        return new this.constructor(Ext.apply({}, this.data), newId || this.id);
    },

    /**
     * Returns true if the field passed has been modified since the load or last commit.
     * @param {String} fieldName
     * @return {Boolean}
     */
    isModified : function(fieldName){
        return !!(this.modified && this.modified.hasOwnProperty(fieldName));
    }
};
/**
 * @class Ext.data.DirectStore
 * @extends Ext.data.Store
 * <p>Small helper class to create an {@link Ext.data.Store} configured with an
 * {@link Ext.data.DirectProxy} and {@link Ext.data.JsonReader} to make interacting
 * with an {@link Ext.Direct} Server-side {@link Ext.direct.Provider Provider} easier.
 * To create a different proxy/reader combination create a basic {@link Ext.data.Store}
 * configured as needed.</p>
 *
 * <p><b>*Note:</b> Although they are not listed, this class inherits all of the config options of:</p>
 * <div><ul class="mdetail-params">
 * <li><b>{@link Ext.data.Store Store}</b></li>
 * <div class="sub-desc"><ul class="mdetail-params">
 *
 * </ul></div>
 * <li><b>{@link Ext.data.JsonReader JsonReader}</b></li>
 * <div class="sub-desc"><ul class="mdetail-params">
 * <li><tt><b>{@link Ext.data.JsonReader#root root}</b></tt></li>
 * <li><tt><b>{@link Ext.data.JsonReader#idProperty idProperty}</b></tt></li>
 * <li><tt><b>{@link Ext.data.JsonReader#totalProperty totalProperty}</b></tt></li>
 * </ul></div>
 *
 * <li><b>{@link Ext.data.DirectProxy DirectProxy}</b></li>
 * <div class="sub-desc"><ul class="mdetail-params">
 * <li><tt><b>{@link Ext.data.DirectProxy#directFn directFn}</b></tt></li>
 * <li><tt><b>{@link Ext.data.DirectProxy#paramOrder paramOrder}</b></tt></li>
 * <li><tt><b>{@link Ext.data.DirectProxy#paramsAsHash paramsAsHash}</b></tt></li>
 * </ul></div>
 * </ul></div>
 *
 * @xtype directstore
 *
 * @constructor
 * @param {Object} config
 */
Ext.data.DirectStore = function(c){
    Ext.data.DirectStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: (typeof(c.proxy) == 'undefined') ? new Ext.data.DirectProxy(Ext.copyTo({}, c, 'paramOrder,paramsAsHash,directFn,api')) : c.proxy,
        reader: (typeof(c.reader) == 'undefined' && typeof(c.fields) == 'object') ? new Ext.data.JsonReader(Ext.copyTo({}, c, 'totalProperty,root,idProperty'), c.fields) : c.reader
    }));
};
Ext.extend(Ext.data.DirectStore, Ext.data.Store, {
    /**
     * Send all {@link #getModifiedRecords modifiedRecords}, removed records and phantom records to the server using the
     * api's configured save url.
     */
    save : function(options) {
        if (!this.writer) {
            throw new Ext.data.Store.Error('writer-undefined', 'Store.js');
        }

        // First check for removed records.  Records in this.removed are guaranteed non-phantoms.  @see Store#remove
        if (this.removed.length) {
            for (var i = 0, len = this.removed.length; i < len; i++) {
                try {
                    this.execute(Ext.data.Api.DESTROY, this.removed[i]);
                }
                catch (e) {
                    this.handleException(e);
                }
            }
        }

        // Check for modified records.  Bail-out if empty...
        var rs = this.getModifiedRecords();
        if (!rs.length) {
            return true;
        }

        // Next create phantoms within rs...
        for (var i = rs.length-1; i >= 0; i--) {
            if (rs[i].phantom === true) {
                var rec = rs.splice(i, 1).shift();
                if (rec.isValid()) {
                    try {
                        this.execute(Ext.data.Api.CREATE, rec);
                    } catch (e) {
                        this.handleException(e);
                    }
                }
            }
            else if (!rs[i].isValid()) { // <-- while we're here, splice-off any !isValid real records
                rs.splice(i,1);
            }
        }
        // And finally, if we're still here after splicing-off phantoms and !isValid real records, update the rest...
        if (rs.length) {
            for (var i = 0, len = rs.length; i < len; i++) {
                try {
                    this.execute(Ext.data.Api.UPDATE, rs[i]);
                }
                catch (e) {
                    this.handleException(e);
                }
            }
        }
        return true;
    }
});
Ext.reg('directstore', Ext.data.DirectStore);

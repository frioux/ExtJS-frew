Imgorg.UploadQueue = Ext.extend(Ext.Panel,{
    swfu: '',
    autoRemove: false,
    
    initComponent: function() {
        Ext.apply(this,{
            layout: 'fit',
            autoScroll: true,
            items: [{
                xtype: 'dataview',
                id: 'img-uploaddv',
                autoWidth: true,
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                        '<div class="upload-file" id="{id}">',
                            '<div class="upload-name">{name}</div>',
                            '<div id="{id}-pb" class="upload-pb"></div>',
                            '<div class="x-clear"></div>',
                            '<div class="upload-info">{size:fileSize}</div>',
                        '</div>',
                    '</tpl>'
                ),
                store: new Ext.data.JsonStore({
                    root: '',
                    id: 'id',
                    fields: [
                        {name: 'creationdate', type: 'date'},
                        {name: 'modificationdate', type: 'date'},
                        'filestatus','id','index','name','size','type'
                    ]
                }),
                itemSelector: 'div.upload-file',
                selectedClass: 'upload-file-selected',
                singleSelect: true
            }],
            tbar:[{
                text: 'Start Upload',
                handler: this.startUpload,
                scope: this
            },{
                text: 'Cancel All',
                handler: this.cancelUpload,
                scope: this
            },{
                text: 'Remove File',
                handler: this.removeFile,
                scope: this
            }]
        });
        Imgorg.UploadQueue.superclass.initComponent.call(this);
        
        this.progressBars = {};
        
        Ext.ux.SwfuMgr.on('filequeued', this.addFile, this);
        Ext.ux.SwfuMgr.on('uploadprogress', this.updateProgress, this);
        Ext.ux.SwfuMgr.on('uploadsuccess', this.uploadSuccess, this);
    },
    
    getDv: function() {
        if (!this.imgUplDv) {
            this.imgUplDv = this.getComponent('img-uploaddv');
        }
        return this.imgUplDv;
    },
    
    startUpload: function() {
        this.swfu.startUpload();
    },
    
    cancelUpload: function() {
        this.swfu.cancelUpload();
        for (var pb in this.progressBars) {
            this.progressBars[pb].destroy();
        }
        this.getDv().store.removeAll();
    },
    
    addFile: function(swfu, file) {
        this.getDv().store.loadData([file], true);
    },
    
    removeFile: function() {
        var dv = this.getDv();
        var recs = dv.getSelectedRecords();
        for (var i = 0;i < recs.length;i++) {
            var r = recs[i];
            this.swfu.cancelUpload(r.data.id);
            if (this.progressBars[r.data.id]) {
                this.progressBars[r.data.id].destroy();
            }
            dv.store.remove(r);
        }
    },
    
    updateProgress: function(swfu, file, complete, total) {
        if (this.progressBars[file.id]) {
            this.progressBars[file.id].updateProgress(file.percentUploaded/100,Math.round(file.percentUploaded)+'% Completed... '+Ext.util.Format.fileSize(file.currentSpeed)+'s');
        } else {
            this.progressBars[file.id] = new Ext.ProgressBar({
                text:'0% Completed...',
                renderTo: file.id+'-pb'
            });
        }
    },
    
    uploadSuccess: function(swfu, file, data) {
        var store = this.getDv().store;
        var rec = store.getById(file.id);
        if (this.progressBars[file.id]) {
            this.progressBars[file.id].updateProgress(1, '100% Completed...');
        }
        if (this.autoRemove) {
            store.remove(rec);
        }
    }
});
Ext.reg('img-uploadqueue', Imgorg.UploadQueue);

Ext.ux.SwfuManager = Ext.extend(Ext.util.Observable, {
    constructor: function(config) {
        Ext.ux.SwfuManager.superclass.constructor.call(this, config);
        this.addEvents(
            'filequeued',
            'uploadstart',
            'uploadprogress',
            'uploaderror',
            'uploadsuccess'
        );
    }
});

Ext.ux.SwfuMgr = new Ext.ux.SwfuManager();

Ext.onReady(function(){
    Ext.QuickTips.init();



    // Change field to default to validation message "under" instead of tooltips
    Ext.form.Field.prototype.msgTarget = 'under';


    var date = new Ext.form.DateField({
        allowBlank:false
    });

    date.applyTo('markup-date');

    // simple array store
    var store = new Ext.data.SimpleStore({
        'id': 0,
        fields: ['abbr', 'state'],
        data : exampleData
    });

    var combo = new Ext.form.ComboBox({
        store: store,
        valueField:'abbr',
        displayField:'state',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        value:'OH'
    });

    combo.applyTo('combo-local');


    var selectionOnly = new Ext.form.ComboBox({
        store: new Ext.data.SimpleStore({
            'id': 0,
            fields: ['abbr', 'state'],
            data : exampleData
        }),
        valueField:'abbr',
        displayField:'state',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        editable:false  // selection only
    });

    selectionOnly.applyTo('combo-selection');


    var tranny = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        transform:'light',
        width:120,
        forceSelection:true
    });

    var required = new Ext.form.TextField({
        allowBlank:false
    });
    required.applyTo('required');

    var alpha = new Ext.form.TextField({
        vtype:'alpha'
    });
    alpha.applyTo('alpha');

    var alpha2 = new Ext.form.TextField({
        vtype:'alpha',
        disableKeyFilter:true
    });
    alpha2.applyTo('alpha2');

    var alphanum = new Ext.form.TextField({
        vtype:'alphanum'
    });
    alphanum.applyTo('alphanum');

    var email = new Ext.form.TextField({
        allowBlank:false,
        vtype:'email'
    });
    email.applyTo('email');

    var url = new Ext.form.TextField({
        vtype:'url'
    });
    url.applyTo('url');

    var grow = new Ext.form.TextArea({
        width:200, grow:true
    });
    grow.applyTo('grow');




    return;


var ds = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: '/forum2/topics-remote.php'
    }),

    // create reader that reads the Topic records
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount',
        id: 'topic_id'
    }, [
        {name: 'title', mapping: 'topic_title'},
        {name: 'postId', mapping: 'post_id'},
        {name: 'author', mapping: 'author'},
        {name: 'excerpt', mapping: 'post_text'}
    ])
});

var combo = new Ext.form.ComboBox({
    store: ds,
    displayField:'title',
    typeAhead: false,
    loadingText: 'Searching...',
    listWidth:600,
    pageSize:10,
    width:150,
    tpl: '<div class="search-item"><h3><span>{lastPost:date("M j, Y")}<br />by {author}</span>{title}</h3>{excerpt}</div>',
    title: 'Search Results',
    onSelect: function(record, item){ // override default onSelect to do redirect
        window.location = 'http://www.yui-ext.com/forum/viewtopic.php?t='+record.id+'#'+record.data.postId;
    }
});

combo.applyTo('markup-combo');


    Ext.get('container').insertHtml('beforeEnd', '<br/><br/>');


    var d = new Ext.form.DateField({allowBlank:false, msgTarget:'my-date-msg'});
    d.applyTo('my-date');

    var d2 = new Ext.form.DateField({disabledDays:[0,6]});
    d2.render('container');

    Ext.get('container').insertHtml('beforeEnd', '<br/><br/>');

    var n = new Ext.form.TextField({allowBlank:false});
    n.render('container');

    Ext.get('container').insertHtml('beforeEnd', '<br/><br/>');

    var s = new Ext.form.Field({autoCreate: {tag: 'select', children: [
            {tag: 'option', value:'in', html: 'Slide In'},
            {tag: 'option', value:'out', html: 'Slide Out'}
            ]}});
    s.render('container');


    return;

    var d1 = new Ext.form.DateField({
        target: 'test'

    });

    return;

    var text = new Ext.form.TextArea({
        allowBlank:false,
        disabled:false,
        grow: true
    });

    var editor = new Ext.Editor(text, {
        updateEl : true,
        shadow: true,
        allowBlur: true
    });

    /*Ext.get('edit-link').on('click', function(e){
        e.stopEvent();
        editor.startEdit(this);
    });*/
    
    var combo = new Ext.form.ComboBox({allowBlank:false});
    combo.render('container');


    Ext.get('container').insertHtml('beforeEnd', '<br/>');
    var tf = new Ext.form.TextField({allowBlank:false});
    tf.render('container');

    var s = new Ext.form.Field({autoCreate: {tag: 'select', children: [
            {tag: 'option', value:'in', html: 'Slide In'},
            {tag: 'option', value:'out', html: 'Slide Out'}
            ]}});
    s.render('container');

    var d = new Ext.form.DateField({disabledDays:[0,6]});
    d.render('container');

    var n = new Ext.form.TextField();
    n.render('container');

    var b = new Ext.Button('container', {text: 'Slide', handler: function(){
        var ct = Ext.get('container');
        //ct.hide();
        ct.move('left', 100, {remove:true});//.slideOut('r');
        return;

        ct[s.getValue() == 'out' ? 'slideOut' : 'slideIn'](n.getValue(), {
            callback: function(){ct.show.defer(1000, ct);}
        });
    }});



});
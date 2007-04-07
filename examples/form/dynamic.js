Ext.onReady(function(){

    /*
     * ================  Simple form  =======================
     */
    var simple = new Ext.Form({
        labelWidth: 75, // label settings here cascade unless overridden
        buttonAlign:'right'
    });
    simple.add(
        new Ext.form.TextField({
            fieldLabel: 'First Name',
            name: 'first',
            width:185
        }),

        new Ext.form.TextField({
            fieldLabel: 'Last Name',
            name: 'last',
            width:185
        }),

        new Ext.form.TextField({
            fieldLabel: 'Company',
            name: 'company',
            width:185
        }),

        new Ext.form.TextField({
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email',
            width:185
        })
    );

    simple.addButton('Save');
    simple.addButton('Cancel');

    simple.render('form-ct');


    /*
     * ================  Form 2  =======================
     */
    var top = new Ext.Form({
        labelAlign: 'top'
    });

    top.column(
        {width:232}, // precise column sizes or percentages or straight CSS
        new Ext.form.TextField({
            fieldLabel: 'First Name',
            name: 'first',
            width:200
        }),

        new Ext.form.TextField({
            fieldLabel: 'Company',
            name: 'company',
            width:200
        })
    );

    top.column(
        {width:222, style:'margin-left:10px', clear:true}, // apply custom css, clear:true means it is the last column
        new Ext.form.TextField({
            fieldLabel: 'Last Name',
            name: 'last',
            width:200
        }),

        new Ext.form.TextField({
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email',
            width:200
        })
    );

    top.addButton('Save');
    top.addButton('Cancel');

    top.render('form-ct2');


    /*
     * ================  Form 3  =======================
     */
    var fs = new Ext.Form({
        labelAlign: 'right',
        labelWidth: 75
    });

    fs.fieldset(
        {legend:'Contact Information'},
        new Ext.form.TextField({
            fieldLabel: 'First Name',
            name: 'first',
            width:190
        }),

        new Ext.form.TextField({
            fieldLabel: 'Last Name',
            name: 'last',
            width:190
        }),

        new Ext.form.TextField({
            fieldLabel: 'Company',
            name: 'company',
            width:190
        }),

        new Ext.form.TextField({
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email',
            width:190
        })
    );

    fs.addButton('Save');
    fs.addButton('Cancel');

    fs.render('form-ct3');

    /*
     * ================  Form 4  =======================
     */
    var form = new Ext.Form({
        labelAlign: 'right',
        labelWidth: 75,
        buttonAlign: 'right'
    });

    form.column({width:342, labelWidth:75}); // open column, without auto close
    form.fieldset(
        {legend:'Contact Information'},
        new Ext.form.TextField({
            fieldLabel: 'Full Name',
            name: 'fullName',
            allowBlank:false,
            msgTarget:'under'
        }),

        new Ext.form.TextField({
            fieldLabel: 'Job Title',
            name: 'title'
        }),

        new Ext.form.TextField({
            fieldLabel: 'Company',
            name: 'company'
        }),

        new Ext.form.TextArea({
            fieldLabel: 'Address',
            name: 'address',
            grow: true,
            preventScrollbars:true
        })
    );
    form.fieldset(
        {legend:'Phone Numbers'},
        new Ext.form.TextField({
            fieldLabel: 'Home',
            name: 'home'
        }),

        new Ext.form.TextField({
            fieldLabel: 'Business',
            name: 'business'
        }),

        new Ext.form.TextField({
            fieldLabel: 'Mobile',
            name: 'mobile'
        }),

        new Ext.form.TextField({
            fieldLabel: 'Fax',
            name: 'fax'
        })
    );
    form.end(); // closes the last container element (column, layout, fieldset, etc) and moves up 1 level in the stack


    form.column({width:202, style:'margin-left:10px', clear:true});
    form.fieldset(
        {id:'photo', legend:'Photo'}
    );
    form.end();
    form.fieldset(
        {legend:'Options', hideLabels:true},
        new Ext.form.Checkbox({
            boxLabel:'Ext 1.0 User',
            name:'likes',
            checked:true
        }),
        new Ext.form.Checkbox({
            boxLabel:'Ext Commercial User',
            name:'likes'
        }),
        new Ext.form.Checkbox({
            boxLabel:'Ext Premium Member',
            name:'likes'
        }),
        new Ext.form.Checkbox({
            boxLabel:'Ext Team Member',
            name:'likes'
        })
    );
    form.end();

    
    form.applyIfToFields({
        width:230
    });

    form.addButton('Save');
    form.addButton('Cancel');

    form.render('form-ct4');

    // The form elements are standard HTML elements. By assigning an id (as we did above)
    // we can manipulate them like any other element
    var photo = Ext.get('photo');
    var c = photo.createChild({
        tag:'center', 
        cn: {
            tag:'img',
            src: 'http://extjs.com/forum/image.php?u=2&dateline=1175747336',
            style:'margin-bottom:5px;'
        }
    });
    new Ext.Button(c, {
        text: 'Change Photo'
    });
});
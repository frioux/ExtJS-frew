Ext.ns('Ext.app');
Ext.app.DutchForm = Ext.extend(Ext.FormPanel, {
    locale: {
        formTitle: 'Contact Informatie (Dutch)',
        firstName: 'Voornaam',
        lastName: 'Achternaam',
        surnamePrefix: 'Tussenvoegsel',
        company: 'Bedrijf',
        state: 'Provincie',
        stateEmptyText: 'Kies een provincie...',
        email: 'E-mail',
        birth: 'Geb. Datum',
        save: 'Opslaan',
        cancel: 'Annuleren'
    },
    
    initComponent : function(config) {
        Ext.apply(this, {
            labelWidth: 100, // label settings here cascade unless overridden
            url:'save-form.php',
            frame:true,
            title: this.locale.formTitle,
            bodyStyle:'padding:5px 5px 0',
            width: 350,
            defaults: {width: 220},
            defaultType: 'textfield',
    
            items: [{
                    fieldLabel: this.locale.firstName,
                    name: 'firstname',
                    allowBlank:false
                },{
                    fieldLabel: this.locale.lastName,
                    name: 'lastName'
                },{
                    fieldLabel: this.locale.surnamePrefix,
                    width: 50,
                    name: 'surnamePrefix'
                },{
                    fieldLabel: this.locale.company,
                    name: 'company'
                },  new Ext.form.ComboBox({
                    fieldLabel: this.locale.province,
                    hiddenName: 'state',
                    store: new Ext.data.ArrayStore({
                        fields: ['provincie'],
                        data : Ext.exampledata.dutch_provinces // from dutch-provinces.js
                    }),
                    displayField: 'provincie',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    emptyText: this.locale.stateEmtyText,
                    selectOnFocus:true,
                    width:190
                }), {
                    fieldLabel: this.locale.email,
                    name: 'email',
                    vtype:'email'
                }, new Ext.form.DateField({
                    fieldLabel: this.locale.birth,
                    name: 'birth'
                })
            ],
    
            buttons: [{
                text: this.locale.save
            },{
                text: this.locale.cancel
            }]
        });
        
        Ext.app.DutchForm.superclass.initComponent.apply(this, arguments);
    }
});

Ext.onReady(function(){

    Ext.QuickTips.init();

    // turn on validation errors beside the field globally
    Ext.form.Field.prototype.msgTarget = 'side';
    
    var bd = Ext.getBody();
    
    bd.createChild({tag: 'h2', html: 'Dutch Form'})
    
    // simple form
    var simple = new Ext.app.DutchForm();
    simple.render(document.body);
});
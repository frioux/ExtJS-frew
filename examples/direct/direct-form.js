// This example illustrates how to load a FormPanel or BasicForm through Ext.Direct.

Ext.onReady(function(){
    // Notice that Direct requests will batch together if they occur
    // within the enableBuffer delay period (in milliseconds).
    // Slow the buffering down from the default of 10ms to 100ms
    Ext.app.REMOTING_API.enableBuffer = 100;
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    
    var basicInfo = new Ext.form.FormPanel({
        // configs for FormPanel
        title: 'Basic Information',
        border: false,
        padding: 10,
        buttons:[{
            text: 'Submit',
            handler: function(){
                basicInfo.getForm().submit({
                    params: {
                        uid: 5
                    }
                });
            }
        }],
        
        // configs apply to child items
        defaults: {anchor: '100%'},
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Name',
            name: 'name'
        },{
            fieldLabel: 'Email',
            name: 'email'        
        },{
            fieldLabel: 'Company',
            name: 'company'
        }],
        
        // configs for BasicForm
        api: {
            load: Profile.getBasicInfo,
            // The server-side must mark the submit handler as a 'formHandler'
            submit: Profile.updateBasicInfo
        },    
        paramOrder: ['uid']
    });
    
    var phoneInfo = new Ext.form.FormPanel({
        title: 'Phone Numbers',
        border: false,
        api: {
            load: Profile.getPhoneInfo
        },    
        padding: 10,
        paramOrder: ['uid'],
        defaultType: 'textfield',
        defaults: {anchor: '100%'},
        items: [{
            fieldLabel: 'Office',
            name: 'office'
        },{
            fieldLabel: 'Cell',
            name: 'cell'        
        },{
            fieldLabel: 'Home',
            name: 'home'
        }]
    });
    
     var locationInfo = new Ext.form.FormPanel({
        title: 'Location Information',
        border: false,
        padding: 10,
        api: {
            load: Profile.getLocationInfo
        },    
        paramOrder: ['uid'],
        defaultType: 'textfield',
        defaults: {anchor: '100%'},
        items: [{
            fieldLabel: 'Street',
            name: 'street'
        },{
            fieldLabel: 'City',
            name: 'city'            
        },{
            fieldLabel: 'State',
            name: 'state'
        },{
            fieldLabel: 'Zip',
            name: 'zip'
        }]
    });    

     var accordion = new Ext.Panel({
        layout: 'accordion',
        renderTo: Ext.getBody(),
        title: 'My Profile',
        width: 300,
        height: 220,    
        items: [basicInfo, phoneInfo, locationInfo]
    });
        
    
    basicInfo.getForm().load({
        params: {
            uid: 5
        }
    });
    phoneInfo.getForm().load({
        params: {
            uid: 5
        }
    });    
    locationInfo.getForm().load({
        params: {
            uid: 5
        }
    });
    TestAction.doEcho('sample');
   
});

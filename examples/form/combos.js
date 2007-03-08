Ext.onReady(function(){

    // some data used in the examples
    var exampleData = [
        ['AL', 'Alabama'],
        ['AL', 'Alaska'],
        ['AZ', 'Arizona'],
        ['AR', 'Arkansas'],
        ['CA', 'California'],
        ['CO', 'Colorado'],
        ['CN', 'Connecticut'],
        ['DE', 'Delaware'],
        ['DC', 'District of Columbia'],
        ['FL', 'Florida'],
        ['GA', 'Georgia'],
        ['HW', 'Hawaii'],
        ['ID', 'Idaho'],
        ['IL', 'Illinois'],
        ['IN', 'Indiana'],
        ['IA', 'Iowa'],
        ['KS', 'Kansas'],
        ['KY', 'Kentucky'],
        ['LA', 'Louisiana'],
        ['MA', 'Maine'],
        ['MD', 'Maryland'],
        ['MS', 'Massachusetts'],
        ['MI', 'Michigan'],
        ['MN', 'Minnesota'],
        ['MS', 'Mississippi'],
        ['MO', 'Missouri'],
        ['MT', 'Montana'],
        ['NE', 'Nebraska'],
        ['NV', 'Nevada'],
        ['NH', 'New Hampshire'],
        ['NJ', 'New Jersey'],
        ['NM', 'New Mexico'],
        ['NY', 'New York'],
        ['NC', 'North Carolina'],
        ['ND', 'North Dakota'],
        ['OH', 'Ohio'],
        ['OK', 'Oklahoma'],
        ['OR', 'Oregon'],
        ['PA', 'Pennsylvania'],
        ['RH', 'Rhode Island'],
        ['SC', 'South Carolina'],
        ['SD', 'South Dakota'],
        ['TE', 'Tennessee'],
        ['TX', 'Texas'],
        ['UT', 'Utah'],
        ['VE', 'Vermont'],
        ['VA', 'Virginia'],
        ['WA', 'Washington'],
        ['WV', 'West Virginia'],
        ['WI', 'Wisconsin'],
        ['WY', 'Wyoming']
    ];



    // simple array store
    var store = new Ext.data.SimpleStore({
        fields: ['abbr', 'state'],
        data : exampleData
    });
    var combo = new Ext.form.ComboBox({
        store: store,
        displayField:'state',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        value:'Ohio'
    });
    combo.applyTo('local-states');



    var converted = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        transform:'state',
        width:135,
        forceSelection:true
    });
});
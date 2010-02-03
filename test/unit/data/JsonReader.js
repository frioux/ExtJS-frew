var suite = new Y.Test.Suite('JsonReader');

suite.add(new Y.Test.Case({
    name: 'readRecords',
    setUp: function() {
        this.reader = new Ext.data.JsonReader({
            root: 'data',
            idProperty: 'id',
            totalProperty: 'totalProp',
            messageProperty: 'Hello World',
            successProperty: 'successProp',
            fields: [
               {name: 'id'},
               {name: 'floater', type: 'float'},
               {name: 'bool', type: 'boolean'},
               {name: 'inter', type: 'integer'}
            ]
        });
        this.data1 = {
            id: 1,
            floater: 1.23,
            bool: true,
            inter: 8675
        };
        this.rec1 = this.reader.readRecords({
            data: [this.data1],
            successProp: true,
            totalProp: 2
        });
        this.rec2 = this.reader.readRecords({
            data: [{
                id: 2,
                floater: 4.56,
                bool: false,
                inter: 309
            }],
            successProp: false,
            totalProp: 6
        });
    },
    tearDown: function() {
        delete this.reader;
        delete this.data1;
        delete this.rec1;
        delete this.rec2;
    },
    testSuccessProperty: function() {
        Y.Assert.areSame(this.rec1.success, true);
        Y.Assert.areSame(this.rec2.success, false);
    },
    testTotalRecords: function() {
        Y.Assert.areSame(this.rec1.totalRecords, 2);
        Y.Assert.areSame(this.rec2.totalRecords, 6);
    },
    testRecords: function() {
        Y.Assert.areSame(this.rec1.records[0].data.id, this.data1.id);
        Y.Assert.areSame(this.rec1.records[0].data.floater, this.data1.floater);
        Y.Assert.areSame(this.rec1.records[0].data.bool, this.data1.bool);
        Y.Assert.areSame(this.rec1.records[0].data.inter, this.data1.inter);
    }
}));

suite.add(new Y.Test.Case({
    name: 'readResponse',
    setUp: function() {
        this.reader = new Ext.data.JsonReader({
            root: 'data',
            idProperty: 'id',
            totalProperty: 'totalProp',
            messageProperty: 'messageProp',
            successProperty: 'successProp',
            fields: [
               {name: 'id'},
               {name: 'floater', type: 'float'},
               {name: 'bool', type: 'boolean'},
               {name: 'inter', type: 'integer'}
            ]
        });
        this.data1 = {
            id: 1,
            floater: 1.23,
            bool: true,
            inter: 8675
        };
        this.rec1 = this.reader.readResponse('read', {
            data: [this.data1],
            successProp: true,
            totalProp: 2,
            messageProp: 'Hello'
        });
        this.rec2 = this.reader.readResponse('read', {
            data: [{
                id: 2,
                floater: 4.56,
                bool: false,
                inter: 309
            }],
            successProp: false,
            totalProp: 6
        });
    },
    tearDown: function() {
        delete this.reader;
        delete this.data1;
        delete this.rec1;
        delete this.rec2;
    },
    testSuccessProperty: function() {
        Y.Assert.areSame(this.rec1.success, true);
        Y.Assert.areSame(this.rec2.success, false);
    },
    testRecords: function() {
        Y.Assert.areSame(this.rec1.data[0].id, this.data1.id);
        Y.Assert.areSame(this.rec1.data[0].floater, this.data1.floater);
        Y.Assert.areSame(this.rec1.data[0].bool, this.data1.bool);
        Y.Assert.areSame(this.rec1.data[0].inter, this.data1.inter);
    },
    testActionProperty: function() {
        Y.Assert.areSame(this.rec1.action, 'read');
    },
    testMessageProperty: function() {
        Y.Assert.areSame(this.rec1.message, 'Hell');
    },
    testRawProperty: function() {
        Y.Assert.areSame(this.rec1.raw.data[0].id, this.data1.id);
    }
}));

Ext.tests.push(suite);

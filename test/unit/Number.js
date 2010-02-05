var suite = new Y.Test.Suite('Number');

suite.add(new Y.Test.Case({

    name: 'Global Number Decorators',

    planned: 15,

    // 15
    test_constrain: function() {
        Y.Assert.areEqual( ( 1 ).constrain( 1, 1 ), 1, 'Test where the number being constrained is equal to both the min and the max' );
        Y.Assert.areEqual( ( 5 ).constrain( 1, 5 ), 5, 'Test where the number being constrained is equal to the max' );
        Y.Assert.areEqual( ( 3 ).constrain( 3, 5 ), 3, 'Test where the number being constrained is equal to the min' );

        Y.Assert.areEqual( ( 3 ).constrain( 1, 5 ), 3, 'Test with an integer within the constraints' );
        Y.Assert.areEqual( ( -3 ).constrain( -5, -1 ), -3, 'Test with a negative integer within the constraints' );
        Y.Assert.areEqual( ( 3.3 ).constrain( 3.1, 3.5 ), 3.3, 'Test with a float within the constraints' );
        Y.Assert.areEqual( ( -3.3 ).constrain( -3.5, -3.1 ), -3.3, 'Test with a negative float within the constraints' );

        Y.Assert.areEqual( ( 100 ).constrain( 1, 5 ), 5, 'Test with an integer over the maximum of the constraint' );
        Y.Assert.areEqual( ( 1 ).constrain( 3, 5 ), 3, 'Test with an integer under the maximum of the constraint' );
        Y.Assert.areEqual( ( -5 ).constrain( -100, -50 ), -50, 'Test with a negative integer over the maximum of the constraint' );
        Y.Assert.areEqual( ( -100 ).constrain( -5, -3 ), -5, 'Test with a negative integer under the maximum of the constraint' );

        Y.Assert.areEqual( ( 6.7 ).constrain( 3.1, 4.1 ), 4.1, 'Test with a float over the maximum of the constraint' );
        Y.Assert.areEqual( ( 3.1 ).constrain( 6.7, 12.4 ), 6.7, 'Test with a float under the maximum of the constraint' );
        Y.Assert.areEqual( ( -3.1 ).constrain( -100.5, -50.5 ), -50.5, 'Test with a negative float over the maximum of the constraint' );
        Y.Assert.areEqual( ( -100.7 ).constrain( -5.4, -3.1 ), -5.4, 'Test with a negative float under the maximum of the constraint' );
    }

}));

Ext.tests.push(suite);

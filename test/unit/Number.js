Ext.tests.push(new Y.Test.Case({

    name: 'Global Number Decorators',

    test_constrain: function() {
        var n = 5;

        var rt = n.constrain( 4, 6 );
        // within contraint
        Y.Assert.areEqual( rt, 5 );

        rt = n.constrain( 10, 20 );
        // < 10
        Y.Assert.areEqual( rt, 10 );

        rt = n.constrain( 1, 2 );
        // > 2
        Y.Assert.areEqual( rt, 2 );
    }

}));

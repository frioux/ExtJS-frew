var suite = new Y.Test.Suite('Array');

suite.add(new Y.Test.Case({

    name: 'Global Array Decorators',

    planned: 7,

    // 3
    test_indexOf: function() {
        var arr = [ 'a', 'b', 'c' ];

        var rt = arr.indexOf( 'b' );
        Y.Assert.areEqual( 1, rt );
        
        rt = arr.indexOf( 'z' );
        Y.Assert.areEqual( -1, rt );

        rt = arr.indexOf( 'b', 2 );
        Y.Assert.areEqual( -1, rt );
    },

    // 4
    test_remove: function() {
        var arr = [ 'a', 'b', 'c' ];

        arr.remove( 'b' );
        Y.Assert.areEqual( 'a', arr[ 0 ] );
        Y.Assert.areEqual( 'c', arr[ 1 ] );

        arr.remove( 'z' ); // no change to arr
        Y.Assert.areEqual( 'a', arr[ 0 ] );
        Y.Assert.areEqual( 'c', arr[ 1 ] );
    }

}));

Ext.tests.push(suite);

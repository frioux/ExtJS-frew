var suite = new Y.Test.Suite('Array');

suite.add(new Y.Test.Case({

    name: 'Global Array Decorators',

    planned: 17,
    
    setUp : function(){
        this.Cls = Ext.extend( Object, {} );
    },

    // 12
    test_indexOf: function() {
        Y.Assert.areEqual( [].indexOf( 1 ), -1, 'Test with an empty array' );
        Y.Assert.areEqual( [ 0, 1, 2 ].indexOf( 3 ), -1, 'Test with numbers where the item should not exist' );
        Y.Assert.areEqual( [ 0, 1, 2 ].indexOf( 1 ), 1, 'Test with numbers where the item should exist' );
        Y.Assert.areEqual( [ 0, 3, 2, 1, 4, 5, 6, 7, 1, 2 ].indexOf( 1 ), 3, 'Test with numbers where the item exists a number of times' );
        Y.Assert.areEqual( [ 'x', 'y', 'z' ].indexOf( 'X' ), -1, 'Test with strings where the item should not exist' );
        Y.Assert.areEqual( [ 'a', 'x', 'y', 'z' ].indexOf( 'a' ), 0, 'Test with strings where the item should exist' );
        Y.Assert.areEqual( [ 0, 1, 2 ].indexOf( '1' ), -1, 'Test to ensure type coercion doesn\'t occur' );
            
        var c1 = new this.Cls(),
            c2 = new this.Cls(),
            c3 = new this.Cls(),
            c4 = new this.Cls();
        
        Y.Assert.areEqual( [ c1, c2, c3, c4 ].indexOf( new this.Cls() ), -1, 'Test with object instances, item should not exist' );
        Y.Assert.areEqual( [ c1, c2, c3, c4 ].indexOf( c3 ), 2, 'Test with object instances, item should exist');
            
        //test the from parameter
        Y.Assert.areEqual( [ 1, 2, 3, 4, 5 ].indexOf( 1, 3 ), -1, 'Test where the item exists past the from parameter' );
        Y.Assert.areEqual( [ 1, 2, 3, 4, 5 ].indexOf( 1, 50 ), -1, 'Test where the item exists, but the index is greater than the array' );
        Y.Assert.areEqual( [ 1, 2, 3, 4, 5, 6, 7, 3 ].indexOf( 3, 4 ), 7, 'Test where the item more than once, the from should refer to the second item' );
    },

    // 5
    test_remove: function() {
        var arr = [];
            
        arr.remove( 1 );
        Y.ArrayAssert.isEmpty( arr, 'Test with an empty array' );
        
        arr = [ 1, 2, 3 ];
        arr.remove( 1 );
        Y.ArrayAssert.itemsAreEqual( arr, [ 2, 3 ], 'Test with a simple removal' );
        
        arr = [ 1, 2, 3, 1 ];
        arr.remove( 1 );
        Y.ArrayAssert.itemsAreEqual( arr, [ 2, 3, 1 ], 'Test where the item exists more than once' );
        
        arr = [ 1, 2, 3, 4 ];
        arr.remove( 100 );
        Y.ArrayAssert.itemsAreEqual( arr, [ 1, 2, 3, 4 ], 'Test where the item doesn\'t exist' );
        
        var c1 = new this.Cls(),
            c2 = new this.Cls(),
            c3 = new this.Cls();
            
        arr = [ c1, c2, c3 ];
        arr.remove( c2 );
        Y.ArrayAssert.itemsAreEqual( arr, [ c1, c3 ], 'Test with object instances' );
    }

}));

Ext.tests.push(suite);

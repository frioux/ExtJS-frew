Ext.tests.push(new Y.Test.Case({

    name: 'Global Function Decorators',

    test_createCallback: function() {
        var fn = function( a, b ) {
            Y.Assert.areEqual( 'a', a );
            Y.Assert.areEqual( 'b', b );
            return 'x';
        };

        var cb = fn.createCallback( 'a', 'b' );

        var rt = cb(); // does not accept params

        Y.Assert.areEqual( 'x', rt );
    },

    test_createDelegate: function() {
        var scope = { foo: 'bar' };

        var fn = function( a, b, c ) {
            Y.Assert.areEqual( scope, this );
            Y.Assert.isString( this.foo );
            Y.Assert.areEqual( 'bar', this.foo );
            Y.Assert.areEqual( 'a', a );
            Y.Assert.areEqual( 'b', b );
            Y.Assert.areEqual( 'c', c );
            return 'x';
        };

        var cb = fn.createDelegate( scope, [ 'b', 'c' ], true /* appendArgs: true appends these to passed params */ );

        var rt = cb( 'a' ); // a b c

        Y.Assert.areEqual( 'x', rt );


        var cbTwo = fn.createDelegate( scope, [ 'a', 'b' ], 0 );

        rt = cbTwo( 'c' ); // a b c

        Y.Assert.areEqual( 'x', rt );


        var cbThree = fn.createDelegate( scope, [ 'b' ], 1 /* this replaces at pos 1 */ );

        rt = cbThree( 'a', 'c' ); // a b c

        Y.Assert.areEqual( 'x', rt );

        var cbFour = fn.createDelegate( scope, [ 'a', 'b', 'c' ] );

        rt = cbFour( 'x', 'y' ); // overridden with a b c

        Y.Assert.areEqual( 'x', rt );
    },

    test_createInterceptor: function() {
        var scope = { foo: 'bar', n: 0 };

        var fn = function( a, b ) {
            Y.Assert.areEqual( scope, this );
            Y.Assert.isString( this.foo );
            Y.Assert.areEqual( 'bar', this.foo );
            Y.Assert.areEqual( 'a', a );
            Y.Assert.areEqual( 'b', b );
            this.n++;
            return 'x';
        };

        var cb = fn.createDelegate( scope ).createInterceptor(function( a, b, z ) {
            Y.Assert.areEqual( scope, this );
            Y.Assert.isString( this.foo );
            Y.Assert.areEqual( 'bar', this.foo );
            Y.Assert.areEqual( 'a', a );
            Y.Assert.areEqual( 'b', b );
            return z === undefined;
        }, scope);

        // normal
        var rt = fn.call( scope, 'a', 'b' ); // n 1

        Y.Assert.areEqual( 'x', rt );

        // intercepted, but allowed to continue
        rt = cb( 'a', 'b' ); // n 2

        Y.Assert.areEqual( 'x', rt );

        // intercepted, and cancelled
        cb( 'a', 'b', 'z' );
        
        Y.Assert.areEqual( 2, scope.n );
    },

    test_createSequence: function() {
        var scope = { foo: 'bar', seq: 0 };

        var fn = function( a, b ) {
            Y.Assert.areEqual( scope, this );
            Y.Assert.isString( this.foo );
            Y.Assert.areEqual( 'bar', this.foo );
            Y.Assert.areEqual( 'a', a );
            Y.Assert.areEqual( 'b', b );
            this.seq++;
            return 'x';
        };

        var cb = fn.createDelegate( scope ).createSequence( fn, scope );

        var rt = fn.call( scope, 'a', 'b' ); // seq 1
        
        Y.Assert.areEqual( 'x', rt );

        Y.Assert.areEqual( 1, scope.seq );

        rt = cb( 'a', 'b' ); // seq 2, 3

        Y.Assert.areEqual( 'x', rt );
        
        Y.Assert.areEqual( 3, scope.seq );
    },

    test_defer: function() {
        var scope = { foo: 'bar', n: 0 };

        var fn = function( a, b ) {
            Y.Assert.areEqual( scope, this );
            Y.Assert.isString( this.foo );
            Y.Assert.areEqual( 'bar', this.foo );
            Y.Assert.areEqual( 'a', a );
            Y.Assert.areEqual( 'b', b );
            this.n++;
        };

        fn.defer( 100, scope, [ 'a', 'b' ] );
        fn.defer( 200, scope, [ 'a', 'b' ] );

        setTimeout(function() {
            Y.Assert.areEqual( 2, scope.n );
        }, 400);
    }

}));

Ext.tests.push(new Y.Test.Case({

    name: 'Ext Core Utils',

    planned: 20,

    // addBehaviors

    // 6
    test_apply: function() {
        var obj1 = { apple: 'red' };
        var obj2 = { plum: 'purple', apple: 'green' };

        Ext.apply( obj1, obj2, { lemon: 'yellow' } );

        Y.Assert.areEqual( 'purple', obj1.plum );
        Y.Assert.areEqual( 'green', obj1.apple );
        Y.Assert.areEqual( 'yellow', obj1.lemon );
        
        Ext.apply( obj2, { orange: 'orange' }, { apple: 'green' } );

        Y.Assert.areEqual( 'purple', obj2.plum );
        Y.Assert.areEqual( 'green', obj2.apple );
        Y.Assert.areEqual( 'orange', obj2.orange );
    },

    // 2
    test_applyIf: function() {
        var obj1 = { apple: 'red' };
        var obj2 = { plum: 'purple', apple: 'green' };

        Ext.applyIf( obj1, obj2 );

        Y.Assert.areEqual( 'purple', obj1.plum );
        Y.Assert.areEqual( 'red', obj1.apple );
    },

    // 3
    test_clean: function() {
        var arr = [ 1, 0, -1, '', 2, 3, 4 ];
        arr = Ext.clean( arr );

        Y.Assert.areEqual( 1, arr[ 0 ] );
        Y.Assert.areEqual( -1, arr[ 1 ] );
        Y.Assert.areEqual( 2, arr[ 2 ] );
    },

    // 6
    test_copyTo: function() {
        var obj = Ext.copyTo( { c: null }, { a: 'a', b: 'b', c: 'c' }, 'a,b' );

        Y.Assert.areEqual( 'a', obj.a );
        Y.Assert.areEqual( 'b', obj.b );
        Y.Assert.isNull( obj.c );
        
        obj = Ext.copyTo( { c: null }, { a: 'a', b: 'b', c: 'c' }, [ 'a', 'b' ] );

        Y.Assert.areEqual( 'a', obj.a );
        Y.Assert.areEqual( 'b', obj.b );
        Y.Assert.isNull( obj.c );
    },
    
    // create
    // decode
    // destroy
    // destroyMembers

    // 3
    test_destroyMembers: function() {
        var obj = { a: 'a', b: 'b', c: 'c' };

        Ext.destroyMembers( obj, 'b', 'c' );
        Y.Assert.isUndefined( obj.b );
        Y.Assert.isUndefined( obj.c );
        Y.Assert.areEqual( 'a', obj.a );
    }

    // each
    // encode
    // escapeRe
    // extend
    // flatten
    // fly
    // get
    // getBody
    // getCmp
    // getDoc
    // getDom
    // getScrollBarWidth
    // id
    // invoke
    // isArray
    // isBoolean
    // isDate
    // isDefined
    // isElement
    // isEmpty
    // isFunction
    // isNumber
    // isObject
    // isPrimitive
    // isString
    // iterate
    // max
    // mean
    // min
    // namespace
    // ns
    // num
    // onReady
    // override
    // partition
    // pluck
    // preg
    // query
    // reg
    // removeNode
    // select
    // sum
    // toArray
    // type
    // unique
    // urlAppend
    // urlDecode
    // urlEncode
    // value
    // zip
}));

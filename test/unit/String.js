Ext.tests.push(new Y.Test.Case({

    name: 'Global String Decorators',

    test_escape: function() {
        var s = String.escape( "'test' \\" );
        Y.Assert.areEqual( "\\'test\\' \\\\", s );
    },

    test_format: function() {
        var s = String.format( '<div class="{0}">{1}</div>', 'foo', 'bar' );
        Y.Assert.areEqual( '<div class="foo">bar</div>', s );

        s = String.format( '{4}{3}{2}{1}{0}', 'a', 'b', 'c', 'd', 'e' );
        Y.Assert.areEqual( 'edcba', s );
    }

}));

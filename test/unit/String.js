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
    },

    test_leftPad: function() {
        var s = String.leftPad( '123', 5, '0' );
        Y.Assert.areEqual( '00123', s );
    },

    test_toggle: function() {
        var sort = 'ASC';

        sort = sort.toggle('ASC', 'DESC');
        Y.Assert.areEqual( 'DESC', sort );
        
        sort = sort.toggle('ASC', 'DESC');
        Y.Assert.areEqual( 'ASC', sort );
    },

    test_trim: function() {
        var s = '  foo bar  ';

        s = s.trim();
        Y.Assert.areEqual( 'foo bar', s );
    }

}));

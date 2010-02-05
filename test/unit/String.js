var suite = new Y.Test.Suite('String');

suite.add(new Y.Test.Case({

    name: 'Global String Decorators',

    planned: 30,

    // 5
    test_escape: function() {
        Y.Assert.areEqual( String.escape( '' ), '', 'Test with an empty string' );
        Y.Assert.areEqual( String.escape( 'foo' ), 'foo', 'Test with an non-empty string, no escape characters' );
        Y.Assert.areEqual( String.escape( '\\' ), '\\\\', 'Test with a string with a single \\' );
        Y.Assert.areEqual( String.escape( '\'' ), '\\\'', 'Test with a string with a single \'' );
        Y.Assert.areEqual( String.escape( '\'foo\\' ), '\\\'foo\\\\', 'Test with a mix of escape and non escape characters' );
    },


    // 6
    test_format: function() {
        Y.Assert.areEqual( String.format( 'foo' ), 'foo', 'Test with no format parameters, no function parameters' );
        Y.Assert.areEqual( String.format( 'foo', 'x' ), 'foo', 'Test with no format parameters, 1 argument parameter' );
        Y.Assert.areEqual( String.format( '{0}', 'foo' ), 'foo', 'Test with only a format parameter' );
        Y.Assert.areEqual( String.format( '{0}{1}{2}', 'x', 'y', 'z' ), 'xyz', 'Test with several format parameters' );
        Y.Assert.areEqual( String.format( '{0}{1}', 'x', 'y', 'z' ), 'xy', 'Test with several format parameters, extra format parameters' );
        Y.Assert.areEqual( String.format( '{0}foo{1}', 'x', 'y' ), 'xfooy', 'Test with a mix of a string and format parameters' );
    },

    // 7
    test_leftPad: function() {
        Y.Assert.areEqual( String.leftPad( '', 5 ), '     ', 'Test with empty string' );
        Y.Assert.areEqual( String.leftPad( 'foo', 5 ), '  foo', 'Test with string smaller than the padding size' );
        Y.Assert.areEqual( String.leftPad( 'foofoo', 5 ), 'foofoo', 'Test with string bigger than the padding size' );
        Y.Assert.areEqual( String.leftPad( 'foo', 0 ), 'foo', 'Test with a padding size of 0' );
        Y.Assert.areEqual( String.leftPad( 'foo', -5 ), 'foo', 'Test with a padding size of less than 0' );
        Y.Assert.areEqual( String.leftPad( '', 5, '0' ), '00000', 'Test with empty string, different padding character' );
        Y.Assert.areEqual( String.leftPad( 'foo', 5, '0' ), '00foo', 'Test with string smaller than the padding size, different padding character' );
    },

    // 2
    test_toggle: function() {
        Y.Assert.areEqual( 'baz'.toggle( 'foo', 'bar' ), 'foo', 'Test with a starting string that doesn\'t match either' );
        Y.Assert.areEqual( 'foo'.toggle( 'foo', 'bar' ), 'bar', 'Test with a starting string that doesn\'t match either' );
    },

    // 10
    test_trim: function() {
        Y.Assert.areEqual( ''.trim(), '', 'Test with empty string' );
        Y.Assert.areEqual( 'foo'.trim(), 'foo', 'Test with string with no whitespace' );
        Y.Assert.areEqual( '    '.trim(), '', 'Test with string with only whitespace' );
        Y.Assert.areEqual( '  bar  '.trim(), 'bar', 'Test with string with leading and trailing whitespace' );
        Y.Assert.areEqual( 'foo   '.trim(), 'foo', 'Test with only trailing spaces' );
        Y.Assert.areEqual( '   bar'.trim(), 'bar', 'Test with only leading spaces' );
        Y.Assert.areEqual( 'foo bar'.trim(), 'foo bar', 'Test with spaces in between words' );
        Y.Assert.areEqual( '  foo bar baz   '.trim(), 'foo bar baz', 'Test with mixtures of different spaces' );
        Y.Assert.areEqual( '\tfoo'.trim(), 'foo', 'Test with tabs, as opposed to spaces' );
        Y.Assert.areEqual( '\ttext    '.trim(), 'text', 'Test with mixture of spaces and tabs' );
     }

}));

Ext.tests.push(suite);

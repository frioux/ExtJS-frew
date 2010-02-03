Ext.tests.push(new Y.Test.Case({
  name: 'Some test case',
  
  testEdIsCool: function() {
    Y.Assert.areEqual(5, 2 + 3);
  },
  
  testTommyIsCrazy: function() {
    Y.Assert.areNotEqual('Tommy', 'crazy');
  },
  
  testAbeIsTall: function() {
    var abe = {
      height: 6.8
    };
    
    Y.Assert.isTrue(abe.height >= 6.5);   
  }
}));

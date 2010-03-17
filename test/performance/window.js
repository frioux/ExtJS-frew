/**
 * Creates a window with 40 tabs, profiles initial rendering speed and resize rendering speed
 */
Ext.onReady(function() {
  // Ext.test.profiler.add({
  //   name      : 'Show Window',
  //   iterations: 10,
  //   execute   : function() {
  //     console.log(this.win);
  //     console.log(this.win.el);
  //     console.log(this.win.rendered);
  //     console.log(this.win.el.dom);
  //     this.win.show();
  //   },
  //
  //   // beforeEach: function() {
  //   //   this.win.hide();
  //   // },
  //
  //   afterEach: function() {
  //     this.win.hide();
  //   },
  //
  //   beforeAll: function() {
  //     var tabs    = [],
  //         numTabs = 40;
  //
  //     for (var i=1; i < numTabs; i++) {
  //       tabs.push({
  //         title: 'Tab ' + i,
  //         html : 'Tab ' + i + ' content'
  //       });
  //     }
  //
  //     this.win = new Ext.Window({
  //       height: 400,
  //       width : 500,
  //       title : 'Test rendering with a large number of tabs',
  //       items : {
  //         xtype: 'tabpanel',
  //         items: tabs,
  //         activeItem: 0
  //       }
  //     });
  //
  //     console.log('rendered');
  //     console.log(this.win);
  //
  //     this.win.show();
  //     this.win.hide();
  //   },
  //
  //   afterAll: function() {
  //     this.win.destroy();
  //   }
  // });

  Ext.test.profiler.add({
    name      : 'Create and resize hbox within a Window',
    skipVersions: ['2.2.0'],
    iterations: 5,
    newWindow : true,

    beforeAll : function() {
        this.previousBuffer = Ext.Container.bufferResize;
        Ext.Container.bufferResize = false;
    },

    afterAll : function() {
         Ext.Container.bufferResize = this.previousBuffer;
    },

    execute   : function() {


    this.win = new Ext.Window({
        layout: 'fit',
        width: 800,
        height: 600,
        items: [{
            xtype: 'tabpanel',
            activeTab: 1,
            deferredRender: false,
            layoutOnTabChange: true,
            items: [{
                    title: 'Empty',
                    layout: 'fit',
                    items: [{
                        html: 'Blank'
                    }]
                }, {
                    title: 'HBox',
                    layout: 'form',
                    items: [{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    },{
                        layout: 'hbox',
                        xtype: 'container',
                        defaults: {
                            flex: 1
                        },
                        items: [{
                            xtype: 'label',
                            text: 'label1',
                            width: 100
                        },
                        {
                            xtype: 'combo',
                            store: [
                                ['y', 'yes'],
                                ['n', 'no']
                            ],
                            name: 'o1',
                            mode: 'local',
                            hideLabel: true
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Left',
                            hideLabel: true,
                            name: 'n1',
                            maxLength: 40
                        },
                        {
                            xtype: 'textfield',
                            emptyText: 'Test Field Right',
                            hideLabel: true,
                            name: 'n2',
                            maxLength: 40
                        }]
                    }]
                }]
            }]
    });
        this.win.show();
        this.win.setSize(700, 700);
        this.win.setSize(800, 600);
    },

    afterEach: function() {
      this.win.destroy();
    }
  });

/*
  Ext.test.profiler.add({
    name      : 'Resize 40-tab Window',
    iterations: 30,
    newWindow : true,
    beforeAll : function() {
      var tabs    = [],
          numTabs = 40;

      for (var i=1; i < numTabs; i++) {
        tabs.push({
          title: 'Tab ' + i,
          html : 'Tab ' + i + ' content'
        });
      }

      this.win = new Ext.Window({
        height: 500,
        width : 500,
        title : 'Test rendering with a large number of tabs',
        items : {
          xtype: 'tabpanel',
          items: tabs,
          activeItem: 0
        }
      });

      this.win.show();
    },

    execute: function() {
      this.win.setSize(300, 300);
    },

    afterEach: function() {
      this.win.setSize(500, 500);
    }
  });

  Ext.test.profiler.add({
    name      : 'Create Border Window',
    iterations: 30,
    newWindow : true,

    skipVersions: ['2.3.0'],

    beforeAll: function() {
      var con = Ext.version == "2.3.0" ? 'SimpleStore' : 'ArrayStore';

      this.store = new Ext.data[con]({
        fields: ['name', 'eliteness'],
        proxy: new Ext.data.MemoryProxy()
      });

      this.store.loadData([
        ['Ed', 100000],
        ['Tommy', 10],
        ['Darrell', 4],
        ['Abe', -15],
        ['Aaron', 1]
      ]);
    },

    execute   : function() {
      this.win = new Ext.Window({
        height: 500,
        width : 700,
        title : 'Test rendering a border layout inside a window',
        layout: 'border',
        items : [
          {
            xtype  : 'listview',
            store  : this.store,
            region : 'east',
            width  : 200,
            columns: [
              {
                header: 'Name',
                dataIndex: 'name'
              }
            ]
          },
          {
            xtype : 'grid',
            store : this.store,
            region: 'center',
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {header: 'Name',      dataIndex: 'name'},
                {header: 'Eliteness', dataIndex: 'eliteness'}
              ]
            })
          }
        ]
      });

      this.win.show();
    },

    afterEach: function() {
      this.win.destroy();
    }
  });

  Ext.test.profiler.add({
    name      : 'Border Window Resize',
    iterations: 30,
    newWindow : true,

    skipVersions: ['2.3.0'],

    beforeAll: function() {
      var con = Ext.version == "2.3.0" ? 'SimpleStore' : 'ArrayStore';

      this.store = new Ext.data[con]({
        fields: ['name', 'eliteness'],
        proxy: new Ext.data.MemoryProxy()
      });

      this.store.loadData([
        ['Ed', 100000],
        ['Tommy', 10],
        ['Darrell', 4],
        ['Abe', -15],
        ['Aaron', 1]
      ]);

      this.win = new Ext.Window({
        height: 500,
        width : 700,
        title : 'Test rendering a border layout inside a window',
        layout: 'border',
        items : [
          {
            xtype  : 'listview',
            store  : this.store,
            region : 'east',
            width  : 200,
            columns: [
              {
                header: 'Name',
                dataIndex: 'name'
              }
            ]
          },
          {
            xtype : 'grid',
            store : this.store,
            region: 'center',
            colModel: new Ext.grid.ColumnModel({
              columns: [
                {header: 'Name',      dataIndex: 'name'},
                {header: 'Eliteness', dataIndex: 'eliteness'}
              ]
            })
          }
        ]
      });

      this.win.show();
    },

    execute: function() {
      this.win.setSize(900, 700);
    },

    afterEach: function() {
      this.win.setSize(700, 500);
    }
  });
*/
});
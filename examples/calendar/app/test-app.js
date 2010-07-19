App = function() {
    return {
        init: function() {

            this.calendarStore = new Ext.data.JsonStore({
                storeId: 'calendarStore',
                root: 'calendars',
                idProperty: 'id',
                data: calendarList,
                // defined in calendar-list.js
                proxy: new Ext.data.MemoryProxy(),
                autoLoad: true,
                fields: [
                {
                    name: 'CalendarId',
                    mapping: 'id',
                    type: 'int'
                },
                {
                    name: 'Title',
                    mapping: 'title',
                    type: 'string'
                }
                ],
                sortInfo: {
                    field: 'CalendarId',
                    direction: 'ASC'
                }
            });

            this.eventStore = new Ext.data.JsonStore({
                id: 'eventStore',
                root: 'evts',
                data: eventList,
                // defined in event-list.js
                proxy: new Ext.data.MemoryProxy(),
                fields: Ext.calendar.EventRecord.prototype.fields.getRange(),
                sortInfo: {
                    field: 'StartDate',
                    direction: 'ASC'
                }
            });

            new Ext.Viewport({
                layout: 'border',
                renderTo: 'calendar-ct',
                items: [{
                    id: 'app-header',
                    region: 'north',
                    height: 35,
                    border: false,
                    contentEl: 'app-header-content'
                },
                {
                    id: 'app-center',
                    title: '...',
                    // will be updated to view date range
                    region: 'center',
                    layout: 'border',
                    items: [{
                        id: 'app-west',
                        region: 'west',
                        width: 176,
                        border: false,
                        items: [{
                            xtype: 'datepicker',
                            id: 'app-nav-picker',
                            cls: 'ext-cal-nav-picker',
                            listeners: {
                                'select': {
                                    fn: function(dp, dt) {
                                        Ext.getCmp('app-calendar').setStartDate(dt);
                                    },
                                    scope: this
                                }
                            }
                        }]
                    },
                    {
                        xtype: 'calendarpanel',
                        eventStore: this.eventStore,
                        calendarStore: this.calendarStore,
                        border: false,
                        id: 'app-calendar',
                        region: 'center',
                        activeItem: 2,
                        // month view
                        listeners: {
                            'eventclick': {
                                fn: function(vw, rec, el) {
                                    this.showEditWindow(rec, el);
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventover': function(vw, rec, el) {
                                //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                                },
                            'eventout': function(vw, rec, el) {
                                //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                                },
                            'eventadd': {
                                fn: function(cp, rec) {
                                    this.showMsg('Event ' + rec.data.Title + ' was added');
                                },
                                scope: this
                            },
                            'eventupdate': {
                                fn: function(cp, rec) {
                                    this.showMsg('Event ' + rec.data.Title + ' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(cp, rec) {
                                    this.showMsg('Event ' + rec.data.Title + ' was deleted');
                                },
                                scope: this
                            },
                            'eventcancel': {
                                fn: function(cp, rec) {
                                    // edit canceled
                                    },
                                scope: this
                            },
                            'viewchange': {
                                fn: function(p, vw, dateInfo) {
                                    if (this.editWin) {
                                        this.editWin.hide();
                                    };
                                    if (dateInfo !== null) {
                                        // will be null when switching to the event edit form so ignore
                                        Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                        this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                    }
                                },
                                scope: this
                            },
                            'dayclick': {
                                fn: function(vw, dt, ad, el) {
                                    this.showEditWindow({
                                        StartDate: dt,
                                        IsAllDay: ad
                                    },
                                    el);
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'rangeselect': {
                                fn: function(win, dates, onComplete) {
                                    this.showEditWindow(dates);
                                    this.editWin.on('hide', onComplete, this, {
                                        single: true
                                    });
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventmove': {
                                fn: function(vw, rec) {
                                    rec.commit();
                                    var time = rec.data.IsAllDay ? '': ' \\a\\t g:i a';
                                    this.showMsg('Event ' + rec.data.Title + ' was moved to ' + rec.data.StartDate.format('F jS' + time));
                                },
                                scope: this
                            },
                            'eventresize': {
                                fn: function(vw, rec) {
                                    rec.commit();
                                    this.showMsg('Event ' + rec.data.Title + ' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(win, rec) {
                                    this.eventStore.remove(rec);
                                    this.showMsg('Event ' + rec.data.Title + ' was deleted');
                                },
                                scope: this
                            },
                            'initdrag': {
                                fn: function(vw) {
                                    if (this.editWin && this.editWin.isVisible()) {
                                        this.editWin.hide();
                                    }
                                },
                                scope: this
                            }
                        }
                    }]
                }]
            });
        },

        showEditWindow: function(rec, animateTarget) {
            if (!this.editWin) {
                this.editWin = new Ext.calendar.EventEditWindow({
                    calendarStore: this.calendarStore,
                    listeners: {
                        'eventadd': {
                            fn: function(win, rec) {
                                win.hide();
                                rec.data.IsNew = false;
                                this.eventStore.add(rec);
                                this.showMsg('Event ' + rec.data.Title + ' was added');
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function(win, rec) {
                                win.hide();
                                rec.commit();
                                this.showMsg('Event ' + rec.data.Title + ' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function(win, rec) {
                                this.eventStore.remove(rec);
                                win.hide();
                                this.showMsg('Event ' + rec.data.Title + ' was deleted');
                            },
                            scope: this
                        },
                        'editdetails': {
                            fn: function(win, rec) {
                                win.hide();
                                Ext.getCmp('app-calendar').showEditForm(rec);
                            }
                        }
                    }
                });
            }
            this.editWin.show(rec, animateTarget);
        },

        updateTitle: function(startDt, endDt) {
            var p = Ext.getCmp('app-center');

            if (startDt.clearTime().getTime() == endDt.clearTime().getTime()) {
                p.setTitle(startDt.format('F j, Y'));
            }
            else if (startDt.getFullYear() == endDt.getFullYear()) {
                if (startDt.getMonth() == endDt.getMonth()) {
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
                }
                else {
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
                }
            }
            else {
                p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
            }
        },

        showMsg: function(msg) {
            Ext.fly('app-msg').update(msg).removeClass('x-hidden');
        },

        clearMsg: function() {
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }
    };
}();

Ext.onReady(App.init, App);

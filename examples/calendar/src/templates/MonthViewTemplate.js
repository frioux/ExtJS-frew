Ext.calendar.MonthViewTemplate = function(config){
    
    Ext.apply(this, config);
    
    this.weekTpl = new Ext.calendar.BoxLayoutTemplate(config);
    this.weekTpl.compile();
    
    Ext.calendar.MonthViewTemplate.superclass.constructor.call(this,
	    '<div class="ext-cal-inner-ct">',
            '<div class="ext-cal-hd-ct" style="display:none;">',
		        '<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">',
		            '<tbody>',
                        '<tr>',
                            '<tpl for="days">',
		                        '<th class="ext-cal-hd-day" title="{.:date("l, F j, Y")}">{.:date("D")}</th>',
		                    '</tpl>',
                        '</tr>',
		            '</tbody>',
		        '</table>',
            '</div>',
	        '<div class="ext-cal-body-ct">{weeks}</div>',
        '</div>'
    );
};

Ext.extend(Ext.calendar.MonthViewTemplate, Ext.XTemplate, {
    applyTemplate : function(o){
        var days = [],
            weeks = this.weekTpl.apply(o),
            dt = o.viewStart;
        
        for(var i = 0; i < 7; i++){
            days.push(dt.add(Date.DAY, i));
        }
        return Ext.calendar.MonthViewTemplate.superclass.applyTemplate.call(this, {
            days: days,
            weeks: weeks
        });
    }
});

Ext.calendar.MonthViewTemplate.prototype.apply = Ext.calendar.MonthViewTemplate.prototype.applyTemplate;

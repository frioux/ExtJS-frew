
Ext.calendar.DayViewDragZone = Ext.extend(Ext.calendar.DragZone, {
    ddGroup : 'DayViewDD',
    resizeSelector : '.ext-evt-rsz',
    
    getDragData : function(e){
        var t = e.getTarget(this.resizeSelector, 2, true);
        if(t){
            var p = t.parent(this.eventSelector), 
                rec = this.view.getEventRecordFromEl(p);
            
            return {
                type: 'eventresize',
                ddel: p.dom,
                eventStart: rec.data.StartDate,
                eventEnd: rec.data.EndDate,
                proxy: this.proxy
            };
        }
        var t = e.getTarget(this.eventSelector, 3);
        if(t){
            var rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data.StartDate,
                eventEnd: rec.data.EndDate,
                proxy: this.proxy
            };
        }
        return null;
    }
});


Ext.calendar.DayViewDropZone = Ext.extend(Ext.calendar.DropZone, {
    ddGroup : 'DayViewDD',
    
    onNodeOver : function(n, dd, e, data){
        var dt, text = this.createText,
            evtEl = Ext.get(data.ddel),
            dayCol = evtEl.parent().parent(),
            box = evtEl.getBox();
        
        box.width = dayCol.getWidth();
        
        if(data.type == 'eventdrag'){
            if(this.dragOffset === undefined){
                this.dragOffset = n.top-box.y;
            }
            var day = this.view.getDayAt(e.getPageX(), e.getPageY()-this.dragOffset);
            dt = day.date.format('n/j g:ia');
            box.x = n.el.getLeft();
            box.y = n.top-this.dragOffset;
            this.shim(n.overDate, box);
            text = this.moveText;
        }
        if(data.type == 'eventresize'){
            if(!this.resizeDt){
                this.resizeDt = n.overDate;
            }
            box.x = dayCol.getLeft();
            box.height = Math.abs(e.xy[1] - box.y);
            box.y = Math.min(e.xy[1], box.y);
            this.shim(this.resizeDt, box);
            
            var curr = Ext.calendar.Date.copyTime(n.overDate, this.resizeDt),
                start = Ext.calendar.Date.min(data.eventStart, curr),
                end = Ext.calendar.Date.max(data.eventStart, curr);
                
            data.resizeDates = {
                StartDate: start,
                EndDate: end
            }
            dt = start.format('g:ia-') + end.format('g:ia');
            text = this.resizeText;
        }
        
        data.proxy.updateMsg(String.format(text, dt));
        return this.dropAllowed;
    },
    
    shim : function(dt, box){
        Ext.each(this.shims, function(shim){
            if(shim){
                shim.isActive = false;
                shim.hide();
            }
        });
        
        var shim = this.shims[0];
        if(!shim){
            shim = this.createShim();
            this.shims[0] = shim;
        }
        
        shim.isActive = true;
        shim.show();
        shim.setBox(box);
    },
    
    onNodeDrop : function(n, dd, e, data){
        if(n && data){
            var rec = this.view.getEventRecordFromEl(data.ddel);
            
            if(data.type == 'eventdrag'){
                var day = this.view.getDayAt(e.getPageX(), e.getPageY()-this.dragOffset);
                this.view.onEventDrop(rec, day.date);
                this.onCalendarDragComplete();
                delete this.dragOffset;
                return true;
            }
            if(data.type == 'eventresize'){
                this.view.onEventResize(rec, data.resizeDates);
                this.onCalendarDragComplete();
                delete this.resizeDt;
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    }
});

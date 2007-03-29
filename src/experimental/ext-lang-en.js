Ext.View.prototype.emptyText = "";
Ext.grid.Grid.prototype.ddText = "%0 selected row(s)";
Ext.TabPanelItem.prototype.closeText = "Close this tab";
Ext.form.Field.prototype.invalidText = "The value in this field is invalid";
Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Loading...</div>';

Date.monthNames = [
   "January",
   "February",
   "March",
   "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December"
];

Date.dayNames = [
   "Sunday",
   "Monday",
   "Tuesday",
   "Wednesday",
   "Thursday",
   "Friday",
   "Saturday"
];

Ext.MessageBox.buttonText = {
   ok     : "OK",
   cancel : "Cancel",
   yes    : "Yes",
   no     : "No"
};

Ext.util.Format.date = function(v, format){
   if(!v) return "";
   if(!(v instanceof Date)) v = new Date(Date.parse(v));
   return v.dateFormat(format || "m/d/Y");
};

Ext.apply(Ext.DatePicker.prototype, {
   todayText         : "Today",
   minText           : "This date is before the minimum date",
   maxText           : "This date is after the maximum date",
   disabledDaysText  : "",
   disabledDatesText : "",
   nextText          : 'Next Month (Control+Right)',
   prevText          : 'Previous Month (Control+Left)',
   monthYearText     : 'Choose a month (Control+Up/Down to move years)',
   todayTip          : "{0} (Spacebar)",
   format            : "m/d/y"
});

Ext.apply(Ext.PagingToolbar.prototype, {
   beforePageText : "Page",
   afterPageText  : "of {0}",
   firstText      : "First Page",
   prevText       : "Previous Page",
   nextText       : "Next Page",
   lastText       : "Last Page",
   refreshText    : "Refresh",
   displayMsg     : "Displaying {0} - {1} of {2}",
   emptyMsg       : 'No data to display'
});

Ext.apply(Ext.form.TextField.prototype, {
   minLengthText : "The minimum length for this field is {0}",
   maxLengthText : "The maximum length for this field is {0}",
   blankText     : "This field is required",
   regexText     : "",
   emptyText     : null
});

Ext.apply(Ext.form.NumberField.prototype, {
   minText : "The minimum value for this field is {0}",
   maxText : "The maximum value for this field is {0}",
   nanText : "{0} is not a valid number"
});

Ext.apply(Ext.form.DateField.prototype, {
   disabledDaysText  : "Disabled",
   disabledDatesText : "Disabled",
   minText           : "The date in this field must be after {0}",
   maxText           : "The date in this field must be before {0}",
   invalidText       : "{0} is not a valid date - it must be in the format {1}",
   format            : "m/d/y"
});

Ext.apply(Ext.form.ComboBox.prototype, {
   loadingText       : "Loading...",
   valueNotFoundText : undefined
});

Ext.apply(Ext.form.VTypes, {
   emailText    : 'This field should be an e-mail address in the format "user@domain.com"',
   urlText      : 'This field should be a URL in the format "http:/'+'/www.domain.com"',
   alphaText    : 'This field should only contain letters and _',
   alphanumText : 'This field should only contain letters, numbers and _'
});

Ext.apply(Ext.grid.GridView.prototype, {
   sortAscText  : "Sort Ascending",
   sortDescText : "Sort Descending",
   lockText     : "Lock Column",
   unlockText   : "Unlock Column",
   columnsText  : "Columns"
});

Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
   nameText   : "Name",
   valueText  : "Value",
   dateFormat : "m/j/Y"
});

Ext.apply(Ext.SplitLayoutRegion.prototype, {
   splitTip            : "Drag to resize.",
   collapsibleSplitTip : "Drag to resize. Double click to hide."
});
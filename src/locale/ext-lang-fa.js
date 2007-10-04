/*
 * Farsi (Persian) translation
 * By Mohaqa
 * 03-10-2007, 06:23 PM
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">در حال بارگذاری ...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
   Ext.grid.Grid.prototype.ddText = "{0} رکورد انتخاب شده";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "بستن";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "مقدار فیلد صحیح نیست";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "در حال بارگذاری ...";
}

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
   "یکشنبه",
   "دوشنبه",
   "سه شنبه",
   "چهارشنبه",
   "پنجشنبه",
   "جمعه",
   "شنبه"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "تایید",
      cancel : "بازگشت",
      yes    : "بله",
      no     : "خیر"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "Y/m/d");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "امروز",
      minText           : "این تاریخ قبل از محدوده مجاز است",
      maxText           : "این تاریخ پس از محدوده مجاز است",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames                : Date.dayNames,
      nextText          : 'ماه بعد (Control + Right)',
      prevText          : 'ماه قبل (Control+Left)',
      monthYearText     : 'یک ماه را انتخاب کنید (Control+Up/Down برای انتقال در سال)',
      todayTip          : "{0} (Spacebar)",
      format            : "y/m/d"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "صفحه",
      afterPageText  : "از {0}",
      firstText      : "صفحه اول",
      prevText       : "صفحه قبل",
      nextText       : "صفحه بعد",
      lastText       : "صفحه آخر",
      refreshText    : "بازخوانی",
      displayMsg     : "نمایش {0} - {1} of {2}",
      emptyMsg       : 'داده ای برای نمایش وجود ندارد'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "حداقل طول این فیلد برابر است با {0}",
      maxLengthText : "حداکثر طول این فیلد برابر است با {0}",
      blankText     : "این فیلد باید مقداری داشته باشد",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "حداقل مقدار این فیلد برابر است با {0}",
      maxText : "حداکثر مقدار این فیلد برابر است با {0}",
      nanText : "{0} یک عدد نیست"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "غیرفعال",
      disabledDatesText : "غیرفعال",
      minText           : "تاریخ باید پس از {0} باشد",
      maxText           : "تاریخ باید پس از {0} باشد",
      invalidText       : "{0} تاریخ صحیحی نیست - فرمت صحیح {1}",
      format            : "y/m/d"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "در حال بارگذاری ...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'مقدار این فیلد باید یک ایمیل با این فرمت باشد "user@domain.com"',
      urlText      : 'مقدار این آدرس باید یک آدرس سایت با این فرمت باشد "http:/'+'/www.domain.com"',
      alphaText    : 'مقدار این فیلد باید فقط از حروف الفبا و _ تشکیل شده باشد ',
      alphanumText : 'مقدار این فیلد باید فقط از حروف الفبا، اعداد و _ تشکیل شده باشد'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "مرتب سازی افزایشی",
      sortDescText : "مرتب سازی کاهشی",
      lockText     : "قفل ستون ها",
      unlockText   : "بازکردن ستون ها",
      columnsText  : "ستون ها"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "نام",
      valueText  : "مقدار",
      dateFormat : "Y/m/d"
   });
}

if(Ext.SplitLayoutRegion){
   Ext.apply(Ext.SplitLayoutRegion.prototype, {
      splitTip            : "Drag to resize.",
      collapsibleSplitTip : "Drag to resize. Double click to hide."
   });
}

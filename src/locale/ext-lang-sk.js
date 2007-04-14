/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 */
 
 /*  Translation to Slovak by Michal Thomka
  *  14 April 2007
  */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Nahr·vam...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
   Ext.grid.Grid.prototype.ddText = "%0 oznaËen˝ch riadkov";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zavrieù t˙to z·loûku";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Hodnota v tomto poli je nespr·vna";
}

Date.monthNames = [
   "Janu·r",
   "Febru·r",
   "Marec",
   "AprÌl",
   "M·j",
   "J˙n",
   "J˙l",
   "August",
   "September",
   "OktÛber",
   "November",
   "December"
];

Date.dayNames = [
   "Nedeæa",
   "Pondelok",
   "Utorok",
   "Streda",
   "ätvrtok",
   "Piatok",
   "Sobota"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Zruöiù",
      yes    : "¡no",
      no     : "Nie"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "m/d/R");
   };
}


if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "Dnes",
      minText           : "Tento d·tum je menöÌ ako minim·lny moûn˝ d·tum",
      maxText           : "Tento d·tum je v‰ËöÌ ako maxim·lny moûn˝ d·tum",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : 'œalöÌ Mesiac (Control+Doprava)',
      prevText          : 'Predch. Mesiac (Control+Doæava)',
      monthYearText     : 'Vyberte Mesiac (Control+Hore/Dole pre posun rokov)',
      todayTip          : "{0} (MedzernÌk)",
      format            : "m/d/r"
   });
}


if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Strana",
      afterPageText  : "z {0}",
      firstText      : "Prv· Strana",
      prevText       : "Predch. Strana",
      nextText       : "œalöia Strana",
      lastText       : "Posledn· strana",
      refreshText    : "Obnoviù",
      displayMsg     : "Zobrazujem {0} - {1} z {2}",
      emptyMsg       : 'éiadne d·ta'
   });
}


if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minim·lna dÂûka pre toto pole je {0}",
      maxLengthText : "Maxim·lna dÂûka pre toto pole je {0}",
      blankText     : "Toto pole je povinnÈ",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minim·lna hodnota pre toto pole je {0}",
      maxText : "Maxim·lna hodnota pre toto pole je {0}",
      nanText : "{0} je nespr·vne ËÌslo"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "ZablokovanÈ",
      disabledDatesText : "ZablokovanÈ",
      minText           : "D·tum v tomto poli musÌ byù aû po {0}",
      maxText           : "D·tum v tomto poli musÌ byù pred {0}",
      invalidText       : "{0} nie je spr·vny d·tum - musÌ byù vo form·te {1}",
      format            : "m/d/r"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Nahr·vam...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Toto pole musÌ byù e-mailov· adresa vo form·te "user@domain.com"',
      urlText      : 'Toto pole musÌ byù URL vo form·te "http:/'+'/www.domain.com"',
      alphaText    : 'Toto poæe moûe obsahovaù iba pÌsmen· a znak _',
      alphanumText : 'Toto poæe moûe obsahovaù iba pÌsmen·,ËÌsla a znak _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Zoradiù vzostupne",
      sortDescText : "Zoradiù zostupne",
      lockText     : "Zamkn˙ù stÂpec",
      unlockText   : "Odomkn˙ù stæpec",
      columnsText  : "StÂpce"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "N·zov",
      valueText  : "Hodnota",
      dateFormat : "m/j/Y"
   });
}

if(Ext.SplitLayoutRegion){
   Ext.apply(Ext.SplitLayoutRegion.prototype, {
      splitTip            : "Potiahnite pre zmenu rozmeru",
      collapsibleSplitTip : "Potiahnite pre zmenu rozmeru. Dvojklikom schov·te."
   });
}

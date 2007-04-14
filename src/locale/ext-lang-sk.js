/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 */
 
 /*  Translation to Slovak by Michal Thomka
  *  14 April 2007
  */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Nahr�vam...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
   Ext.grid.Grid.prototype.ddText = "%0 ozna�en�ch riadkov";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zavrie� t�to z�lo�ku";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "Hodnota v tomto poli je nespr�vna";
}

Date.monthNames = [
   "Janu�r",
   "Febru�r",
   "Marec",
   "Apr�l",
   "M�j",
   "J�n",
   "J�l",
   "August",
   "September",
   "Okt�ber",
   "November",
   "December"
];

Date.dayNames = [
   "Nede�a",
   "Pondelok",
   "Utorok",
   "Streda",
   "�tvrtok",
   "Piatok",
   "Sobota"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Zru�i�",
      yes    : "�no",
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
      minText           : "Tento d�tum je men�� ako minim�lny mo�n� d�tum",
      maxText           : "Tento d�tum je v��� ako maxim�lny mo�n� d�tum",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : '�al�� Mesiac (Control+Doprava)',
      prevText          : 'Predch. Mesiac (Control+Do�ava)',
      monthYearText     : 'Vyberte Mesiac (Control+Hore/Dole pre posun rokov)',
      todayTip          : "{0} (Medzern�k)",
      format            : "m/d/r"
   });
}


if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Strana",
      afterPageText  : "z {0}",
      firstText      : "Prv� Strana",
      prevText       : "Predch. Strana",
      nextText       : "�al�ia Strana",
      lastText       : "Posledn� strana",
      refreshText    : "Obnovi�",
      displayMsg     : "Zobrazujem {0} - {1} z {2}",
      emptyMsg       : '�iadne d�ta'
   });
}


if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "Minim�lna d�ka pre toto pole je {0}",
      maxLengthText : "Maxim�lna d�ka pre toto pole je {0}",
      blankText     : "Toto pole je povinn�",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "Minim�lna hodnota pre toto pole je {0}",
      maxText : "Maxim�lna hodnota pre toto pole je {0}",
      nanText : "{0} je nespr�vne ��slo"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Zablokovan�",
      disabledDatesText : "Zablokovan�",
      minText           : "D�tum v tomto poli mus� by� a� po {0}",
      maxText           : "D�tum v tomto poli mus� by� pred {0}",
      invalidText       : "{0} nie je spr�vny d�tum - mus� by� vo form�te {1}",
      format            : "m/d/r"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Nahr�vam...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Toto pole mus� by� e-mailov� adresa vo form�te "user@domain.com"',
      urlText      : 'Toto pole mus� by� URL vo form�te "http:/'+'/www.domain.com"',
      alphaText    : 'Toto po�e mo�e obsahova� iba p�smen� a znak _',
      alphanumText : 'Toto po�e mo�e obsahova� iba p�smen�,��sla a znak _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Zoradi� vzostupne",
      sortDescText : "Zoradi� zostupne",
      lockText     : "Zamkn�� st�pec",
      unlockText   : "Odomkn�� st�pec",
      columnsText  : "St�pce"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "N�zov",
      valueText  : "Hodnota",
      dateFormat : "m/j/Y"
   });
}

if(Ext.SplitLayoutRegion){
   Ext.apply(Ext.SplitLayoutRegion.prototype, {
      splitTip            : "Potiahnite pre zmenu rozmeru",
      collapsibleSplitTip : "Potiahnite pre zmenu rozmeru. Dvojklikom schov�te."
   });
}

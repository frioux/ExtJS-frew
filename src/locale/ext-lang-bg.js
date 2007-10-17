/*
 * Bulgarian Translations
 * By Георги Костадинов, Калгари, Канада
 * 10 October 2007
 * (utf-8 encoding)
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Зарежда се...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
  Ext.grid.Grid.prototype.ddText = "{0} Селектирани ред(ове)";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "Затворете тази отметка";
}

if(Ext.form.Field){
  Ext.form.Field.prototype.invalidText = "Стойността в тов поле е невалидна";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Зарежда се...";
}

Date.monthNames = [
  "Януари",
  "Февруари",
  "Март",
  "Април",
  "Май",
  "Юни",
  "Юли",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември"
];

Date.monthNumbers = {
  Jan : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  May : 4,
  Jun : 5,
  Jul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Nov : 10,
  Dec : 11
};

Date.dayNames = [
  "Неделя",
  "Понеделник",
  "Вторник",
  "Сряда",
  "Четвъртък",
  "Петък",
  "Събота"
];

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "Потвърди",
    cancel : "Отмяна",
    yes    : "Да",
    no     : "Не"
  };
}

if(Ext.util.Format){
  Ext.util.Format.date = function(v, format){
    if(!v) return "";
    if(!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "m/d/Y");
  };
}

if(Ext.DatePicker){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "Днес",
    minText           : "Тази дата е преди минималната дата",
    maxText           : "Тази дата е след максималната дата",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Date.monthNames,
    dayNames          : Date.dayNames,
    nextText          : 'Следващ Месец (Control+Дясна Стрелка)',
    prevText          : 'Предишен Месец (Control+Лява Стрелка)',
    monthYearText     : 'Изберете Месец (Control+Горна Стрелка/Долна Стрелка за да изберете година)',
    todayTip          : "{0} (Шпация)",
    format            : "m/d/y",
    okText            : "&#160;Потвърди&#160;",
    cancelText        : "Отмени",
    startDay          : 0
  });
}

if(Ext.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Страница",
    afterPageText  : "от {0}",
    firstText      : "Първа Страница",
    prevText       : "Предишна Страница",
    nextText       : "Следваща Страница",
    lastText       : "Последна Страница",
    refreshText    : "Опресни",
    displayMsg     : "Показване на запис {0} - {1} от {2}",
    emptyMsg       : 'Няма данни за показване'
  });
}

if(Ext.form.TextField){
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText : "Минималната дължина на това поле е {0}",
    maxLengthText : "Максималната дължина на това поле е {0}",
    blankText     : "Това поле е задължително",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.NumberField){
  Ext.apply(Ext.form.NumberField.prototype, {
    minText : "Минималната стойност за това поле е {0}",
    maxText : "Максималната стойност за това поле е {0}",
    nanText : "{0} е невалидно число"
  });
}

if(Ext.form.DateField){
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText  : "Недостъпно",
    disabledDatesText : "Недостъпно",
    minText           : "Датата в това поле трябва да е след {0}",
    maxText           : "Датата в това поле трябва да е преди {0}",
    invalidText       : "{0} е невалидна дата - трябва да бъде указана в следния формат {1}",
    format            : "m/d/y"
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Зарежда се...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : 'Това поле трябва да съдържа адрес на електронна поща в следния формат "user@domain.com"',
    urlText      : 'Това поле трябва да съдържа URL в следния формат "http:/'+'/www.domain.com"',
    alphaText    : 'Това поле трябва да съдържа букви и _',
    alphanumText : 'Това поле трябва да съдържа букви, цифри и _'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Please enter the URL for the link:',
    buttonTips : {
      bold : {
        title: 'Bold (Ctrl+B)',
        text: 'Make the selected text bold.',
        cls: 'x-html-editor-tip'
      },
      italic : {
        title: 'Italic (Ctrl+I)',
        text: 'Make the selected text italic.',
        cls: 'x-html-editor-tip'
      },
      underline : {
        title: 'Underline (Ctrl+U)',
        text: 'Underline the selected text.',
        cls: 'x-html-editor-tip'
      },
      increasefontsize : {
        title: 'Grow Text',
        text: 'Increase the font size.',
        cls: 'x-html-editor-tip'
      },
      decreasefontsize : {
        title: 'Shrink Text',
        text: 'Decrease the font size.',
        cls: 'x-html-editor-tip'
      },
      backcolor : {
        title: 'Text Highlight Color',
        text: 'Change the background color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      forecolor : {
        title: 'Font Color',
        text: 'Change the color of the selected text.',
        cls: 'x-html-editor-tip'
      },
      justifyleft : {
        title: 'Align Text Left',
        text: 'Align text to the left.',
        cls: 'x-html-editor-tip'
      },
      justifycenter : {
        title: 'Center Text',
        text: 'Center text in the editor.',
        cls: 'x-html-editor-tip'
      },
      justifyright : {
        title: 'Align Text Right',
        text: 'Align text to the right.',
        cls: 'x-html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Bullet List',
        text: 'Start a bulleted list.',
        cls: 'x-html-editor-tip'
      },
      insertorderedlist : {
        title: 'Numbered List',
        text: 'Start a numbered list.',
        cls: 'x-html-editor-tip'
      },
      createlink : {
        title: 'Hyperlink',
        text: 'Make the selected text a hyperlink.',
        cls: 'x-html-editor-tip'
      },
      sourceedit : {
        title: 'Source Edit',
        text: 'Switch to source editing mode.',
        cls: 'x-html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "Сортиране във Възходящ Ред",
    sortDescText : "Сортиране в Низзходящ Ред",
    lockText     : "Заключи Колона",
    unlockText   : "Отключи Колона",
    columnsText  : "Колони"
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Име",
    valueText  : "Стойност",
    dateFormat : "m/j/Y"
  });
}

if(Ext.SplitLayoutRegion){
  Ext.apply(Ext.SplitLayoutRegion.prototype, {
    splitTip            : "Влачете с мишката за да промените размера.",
    collapsibleSplitTip : "Влачете с мишката за да промените размера. Чукнете два пъти за да скриете."
  });
}

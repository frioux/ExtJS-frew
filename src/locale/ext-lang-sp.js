/*
 * Español/Latinoamerica Translation by genius551v
 * 04-08-2007, 05:58 AM
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Cargando...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
   Ext.grid.Grid.prototype.ddText = "{0} fila(s) seleccionadas";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Cerrar este tab";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "El valor en este campo es invalido";
}

Date.monthNames = [
   "Enero",
   "Febrero",
   "Marzo",
   "Abril",
   "Mayo",
   "Junio",
   "Julio",
   "Agosto",
   "Septiembre",
   "Octubre",
   "Noviembre",
   "Diciembre"
];

Date.dayNames = [
   "Domingo",
   "Lunes",
   "Martes",
   "Miercoles",
   "Jueves",
   "Viernes",
   "Sabado"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Cancelar",
      yes    : "Si",
      no     : "No"
   };
}

if(Ext.util.Format){
   Ext.util.Format.date = function(v, format){
      if(!v) return "";
      if(!(v instanceof Date)) v = new Date(Date.parse(v));
      return v.dateFormat(format || "d/m/Y");
   };
}

if(Ext.DatePicker){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "Hoy",
      minText           : "Esta fecha es antes de la fecha mínima",
      maxText           : "Esta fecha es despues de la fecha máxima",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Date.monthNames,
      dayNames		: Date.dayNames,
      nextText          : 'Mes Siguiente (Control+Right)',
      prevText          : 'Mes Anterior(Control+Left)',
      monthYearText     : 'Seleccione un mes (Control+Up/Down para desplazar el año)',
      todayTip          : "{0} (Barra espaciadora)",
      format            : "d/m/Y"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Página",
      afterPageText  : "de {0}",
      firstText      : "Primera página",
      prevText       : "Página anterior",
      nextText       : "Página siguiente",
      lastText       : "Ultima página",
      refreshText    : "Actualizar",
      displayMsg     : "Ver {0} - {1} de {2}",
      emptyMsg       : 'Sin datos para mostrar'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "El tamaño mínimo para este campo es de {0}",
      maxLengthText : "El tamaño máximo para este campo es de {0}",
      blankText     : "Campo obligatorio",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "El valor mínimo para este campo es de {0}",
      maxText : "El valor máximo para este campo es de {0}",
      nanText : "{0} no es un número válido"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Deshabilitado",
      disabledDatesText : "Deshabilitado",
      minText           : "La fecha para este campo debe ser despues de {0}",
      maxText           : "La fecha para este campo debe ser antes de {0}",
      invalidText       : "{0} no es una fecha válida - debe ser en formato {1}",
      format            : "d/m/Y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Cargando...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Este campo debe ser en formato e-mail "usuario@email.com"',
      urlText      : 'Este campo debe ser en formato URL "http:/'+'/www.midireccionurl.com"',
      alphaText    : 'Este campo solo puede contener letras y _',
      alphanumText : 'Este campo solo puede contener letras, números y _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Ordenar Ascendente",
      sortDescText : "Ordenar Descendente",
      lockText     : "Bloquear Columna",
      unlockText   : "Desbloquear Columna",
      columnsText  : "Columnas"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Nombre",
      valueText  : "Valor",
      dateFormat : "j/m/Y"
   });
}

if(Ext.SplitLayoutRegion){
   Ext.apply(Ext.SplitLayoutRegion.prototype, {
      splitTip            : "Arrastre para redimensionar.",
      collapsibleSplitTip : "Arrastre para redimensionar. Doble click para ocultar."
   });
}

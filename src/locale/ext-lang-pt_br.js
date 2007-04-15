/*
 * Portuguese/Brazil Translation by Weber Souza
 * 08 April 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Carregando...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.Grid){
   Ext.grid.Grid.prototype.ddText = "{0} linha(s) selecionada(s)";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Fechar Regi�o";
}

if(Ext.form.Field){
   Ext.form.Field.prototype.invalidText = "O valor para este campo � inv�lido";
}

Date.monthNames = [
   "Janeiro",
   "Fevereiro",
   "Mar�o",
   "Abril",
   "Maio",
   "Junho",
   "Julho",
   "Agosto",
   "Setembro",
   "Outubro",
   "Novembro",
   "Dezembro"
];

Date.dayNames = [
   "Domingo",
   "Segunda",
   "Ter�a",
   "Quarta",
   "Quinta",
   "Sexta",
   "S�bado"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Cancelar",
      yes    : "Sim",
      no     : "N�o"
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
      todayText         : "Hoje",
      minText           : "Esta data � anterior a menor data",
      maxText           : "Esta data � posterior a maior data",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Date.monthNames,
      dayNames          : Date.dayNames,
      nextText          : 'Pr�ximo M�s (Control+Direito)',
      prevText          : 'Previous Month (Control+Esquerdo)',
      monthYearText     : 'Choose a month (Control+Cima/Baixo para mover entre os anos)',
      todayTip          : "{0} (Espa�o)",
      format            : "m/d/y"
   });
}

if(Ext.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "P�gina",
      afterPageText  : "de {0}",
      firstText      : "Primeira P�gina",
      prevText       : "P�gina Anterior",
      nextText       : "Pr�xima P�gina",
      lastText       : "�ltima P�gina",
      refreshText    : "Atualizar Listagem",
      displayMsg     : "<b>{0} a {1} de {2} registro(s)</b>",
      emptyMsg       : 'Sem registros para exibir'
   });
}

if(Ext.form.TextField){
   Ext.apply(Ext.form.TextField.prototype, {
      minLengthText : "O tamanho m�nimo permitido para este campo � {0}",
      maxLengthText : "O tamanho m�ximo para este campo � {0}",
      blankText     : "Este campo � obrigat�rio, favor preencher.",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.NumberField){
   Ext.apply(Ext.form.NumberField.prototype, {
      minText : "O valor m�nimo para este campo � {0}",
      maxText : "O valor m�ximo para este campo � {0}",
      nanText : "{0} n�o � um n�mero v�lido"
   });
}

if(Ext.form.DateField){
   Ext.apply(Ext.form.DateField.prototype, {
      disabledDaysText  : "Desabilitado",
      disabledDatesText : "Desabilitado",
      minText           : "A data deste campo deve ser posterior a {0}",
      maxText           : "A data deste campo deve ser anterior a {0}",
      invalidText       : "{0} n�o � uma data v�lida - deve ser informado no formato {1}",
      format            : "m/d/y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Carregando...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Este campo deve ser um endere�o de e-mail v�lido no formado "usuario@dominio.com"',
      urlText      : 'Este campo deve ser uma URL no formato "http:/'+'/www.dominio.com"',
      alphaText    : 'Este campo deve conter apenas letras e _',
      alphanumText : 'Este campo devve conter apenas letras, n�meros e _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Ordenar Ascendente",
      sortDescText : "Ordenar Descendente",
      lockText     : "Bloquear Coluna",
      unlockText   : "Desbloquear Coluna",
      columnsText  : "Colunas"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Nome",
      valueText  : "Valor",
      dateFormat : "m/j/Y"
   });
}

if(Ext.SplitLayoutRegion){
   Ext.apply(Ext.SplitLayoutRegion.prototype, {
      splitTip            : "Arraste para redimencionar.",
      collapsibleSplitTip : "Arraste para redimencionar. Duplo clique para esconder."
   });
}

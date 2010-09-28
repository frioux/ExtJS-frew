Ext.apply(Ext.util.Format, {
	/**
	 * Formats a boolean value to a given string representation
	 * @param {Mixed} value The value to format
	 * @param {String} trueText The text to return if the value is true
	 * @param {String} falseText The text to return if the value is false
	 * @param {String} undefinedText The text to return if the value is undefined
	 * @return {String} The string representation
	 * @member Ext.util.Format
	 */	 	 	 	 	 	
	bool: function(value, trueText, falseText, undefinedText) {
		if(value === undefined){
			return undefinedText;
		}
		if(!value || value === 'false'){
			return falseText;
		}
		return trueText;
	}
});

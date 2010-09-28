Ext.History = (function() {
	var list = [],
		currentIndex = -1;

	return {
		init: Ext.emptyFn,
		events: {},

		add: function (token, preventDup) {
			if(preventDup !== false){
				if(this.getToken() == token){
					return;
				}
			}
			currentIndex++;
			list.splice(currentIndex, list.length - currentIndex, token);
			currentIndex = list.length - 1;
			this.fireEvent('add', token);
		},
		/**
		 * Clear the history stack
		 * @member Ext.History
		 */
		clear: function() {
			list = [];
			currentIndex = -1;
			this.fireEvent('clear');
		},

		/**
		 * Step back one step in the history.
		 * @member Ext.History
		 */
		back: function() {
			this.go(-1);
		},

		/**
		 * Steps forward one step in the history.
		 * @member Ext.History
		 */
		forward: function() {
			this.go(1);
		},
		/**
		 * Steps a defined amount of steps back or forward in the history.
		 * @param {Number} steps The steps to do. If a negative number is given, the amount of steps
		 * are done backwards, positive numbers are forward.
		 * @member Ext.History
		 */
		go: function(steps) {
			var newIndex = (currentIndex + steps).constrain(-1, list.length - 1);
			if (newIndex != currentIndex) {
				currentIndex = newIndex;
				this.fireEvent('change', this.getToken());
			}
		},

		getToken: function() {
			return currentIndex > -1 ? list[currentIndex] : null;
		}
	};
})();
Ext.apply(Ext.History, new Ext.util.Observable());
Ext.History.addEvents('add', 'change', 'clear');

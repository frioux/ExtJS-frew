/**
 * @class Ext.History
 * @extends Ext.util.Observable
 * History management component that allows you to register arbitrary tokens that signify application
 * history state on navigation actions. You can then handle the history {@link #change} event in order
 * to reset your application UI to the appropriate state when the user navigates through the history stack.
 * @singleton
 */
Ext.History = (function() {
	var list = [],
		currentIndex = -1;

	return {
		init: Ext.emptyFn,
		/**
		 * @event add
		 * Fires when a tolen is added to the history stack.
		 * @param {String} token The added token
		 */
		/**
		 * @event change
		 * Fires when navigation back or forwards within the local page's history occurs.
		 * @param {String} token An identifier associated with the page state at that point in its history.
		 */
		/**
		 * @event clear
		 * Fires when the history stack is cleared.
		 */
		events: {},

		/**
		 * Add a new token to the history stack. This can be any arbitrary value, although it would
		 * commonly be the concatenation of a component id and another id marking the specifc history
		 * state of that component. Example usage:
		 * <pre><code>
// Handle tab changes on a TabPanel
tabPanel.on('tabchange', function(tabPanel, tab){
	Ext.History.add(tabPanel.id + ':' + tab.id);
});
</code></pre>
		 * @param {String} token The value that defines a particular application-specific history state
		 * @param {Boolean} preventDuplicates When true, if the passed token matches the current token
		 * it will not save a new history step. Set to false if the same state can be saved more than once
		 * at the same history stack location (defaults to true).
		 */
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
		 */
		clear: function() {
			list = [];
			currentIndex = -1;
			this.fireEvent('clear');
		},

		/**
		 * Step back one step in the history.
		 */
		back: function() {
			this.go(-1);
		},

		/**
		 * Steps forward one step in the history.
		 */
		forward: function() {
			this.go(1);
		},
		/**
		 * Steps a defined amount of steps back or forward in the history.
		 * @param {Number} steps The steps to do. If a negative number is given, the amount of steps
		 * are done backwards, positive numbers are forward.
		 */
		go: function(steps) {
			var newIndex = (currentIndex + steps).constrain(-1, list.length - 1);
			if (newIndex != currentIndex) {
				currentIndex = newIndex;
				this.fireEvent('change', this.getToken());
			}
		},
		/**
		 * Retrieves the currently-active history token.
		 * @return {String} The token
		 */
		getToken: function() {
			return currentIndex > -1 ? list[currentIndex] : null;
		}
	};
})();
Ext.apply(Ext.History, new Ext.util.Observable());
Ext.History.addEvents('add', 'change', 'clear');

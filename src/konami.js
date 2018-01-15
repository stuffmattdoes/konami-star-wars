const Konami = {};

(function(Konami, window) {
	/**
	 * Creates an event handler responding to the specified sequence.
	 * @param {...number|function()} arguments
	 * @return {function(Event)}
	 */
	let sequence = Konami.sequence = function() {
		let sequence = Array.prototype.slice.call(arguments),
			state = 0;

		/**
		 * Event handler
		 * @param {Event|number} e
		 */
		return function(e) {
			// patch legacy IE

			e = (e || window.event);
			e = (e.keyCode || e.which || e);

			if (e === sequence[state] || e === sequence[(state = 0)]) {
				// move next and peek
				const action = sequence[++state];

				// sequence complete when a function is reached
				if (typeof action !== 'function') {
					return;
				}

				// fire action
				action();

				// reset when sequence completed
				state = 0;
			}
		};
	};

	/**
	 * Creates an event handler responding to the Konami Code.
	 * @param {function()} action completed sequence callback
	 * @return {function(Event)}
	 */
	Konami.code = function(action) {
		return sequence(38, 38, 40, 40, 37, 39, 37, 39, 66, 65, action);
	};

})(Konami, window);

export default Konami;

Object.assign(sogqb, function () {
    'use strict';

    /**
     * @constructor
     * @name sogqb.State
     * @classdesc Query Builder State.
     * @description Init State.
     * @param {Object} state Query builder state.
     * @param {Object} scheme Query builder scheme.
     * @example
     * var State = new sogqb.State([{
     *     {
     *         type: 'expression',
     *         field: 'user.first_name',
     *         label: 'Alexey',
     *         value: 'id:1',
     *         operator: 'equal'
     *     }, {
     *         type: 'conjunction',
     *         operator: 'and'
     *     }, {
     *         type: 'expression',
     *         field: 'user.last_name',
     *         label: 'Bob',
     *         value: 'id:1',
     *         operator: 'equal'
     *     }
     * ], scheme);
     */

        // PROPERTIES

    var State = function (state, scheme) {

            this.__state = state || null;
            this.__scheme = scheme || null;

            if (null !== this.__state) {
                this.__validate();
            }

            this.name = 'State';
        };

    State.prototype.constructor = State;

    Object.defineProperties(State.prototype, {
        'state': {
            get: function () {
                return this.__state;
            }
        }
    });

    Object.assign(State.prototype, {
        /**
         * @private
         * @function
         * @name sogqb.State#__validate
         * @description
         * <p>Validate State.</p>
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validate: function () {
            // Check query builder scheme
            if ('Scheme' !== this.__scheme) {
                throw new Error ('Invalid query builder scheme');
            }


            console.log(this.__state);

            return true;
        }
    });

    return {
        State: State
    };
}());
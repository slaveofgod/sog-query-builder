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
     *         value: 1,
     *         operator: 'equal'
     *     }, {
     *         type: 'conjunction',
     *         operator: 'and'
     *     }, {
     *         type: 'expression',
     *         field: 'user.last_name',
     *         label: 'Bob',
     *         value: 1,
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
            this.__validateFields();
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
         * @function
         * @name sogqb.State#draw
         * @description
         * <p>Draw query search state.</p>
         * @param {sogqb.BaseTheme} theme Theme object.
         */
        draw: function (theme) {
            var fieldButton = theme.fieldButton;
            var fieldValueButton = theme.fieldValueButton;
            var expressionOperatorButton = theme.expressionOperatorButton;
            var conjunctionOperatorButton = theme.conjunctionOperatorButton;

            for (var i = 0; i < this.__state.length; i ++) {
                switch (this.__state[i].type) {
                    case 'expression':
                        var field =  this.__state[i].field.split('.');
                        theme.appendChild('field', {
                            value: this.__state[i].field,
                            label: this.__scheme.getEntityFieldLabel(this.__state[i].field),
                        });
                        theme.appendChild('expressionOperator', {
                            label: this.__state[i].operator
                        });
                        theme.appendChild('fieldValue', {
                            value: this.__state[i].value,
                            label: this.__scheme.getEntityFieldFormattedValue(this.__state[i].field, this.__state[i].value)
                        });
                        break;
                    case 'conjunction':
                        theme.appendChild('conjunctionOperator', {
                            label: this.__state[i].operator
                        });
                        break;
                }
            }
        },
        /**
         * @private
         * @function
         * @name sogqb.State#__validate
         * @description
         * <p>Validate state.</p>
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validate: function () {
            sogqb.isValidException('State', this.__state, 'required|array|count:1,100');
            for (var i = 0; i < this.__state.length; i ++) {
                sogqb.isValidException('State > Type', this.__state[i].type, 'required|alnum|in:' + sogqb.config.stateElementTypes.join(';'));

                var validationEngine = new sogv.Application({
                    lang: 'en'
                });
                var data = {};
                var rules = {};

                switch (this.__state[i].type) {
                    case 'expression':
                        data = {
                            field: this.__state[i].field,
                            value: this.__state[i].value,
                            operator: this.__state[i].operator
                        };

                        rules = {
                            field: 'required|regex:^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$',
                            value: 'required|scalar',
                            operator: 'required|alnum|in:' + sogqb.config.expressionOperators.map(function (data) {
                                return data.key;
                            }).join(';'),
                        };
                        break;
                    case 'conjunction':
                        data = {
                            operator: this.__state[i].operator
                        };

                        rules = {
                            operator: 'required|alnum|in:' + sogqb.config.conjunctionOperators.map(function (data) {
                                return data.key;
                            }).join(';'),
                        };
                        break;
                }

                var form = validationEngine.make(data, rules);
                if (false === form.isValid()) {
                    for (var key in data) {
                        if (!data.hasOwnProperty(key)) continue;

                        if (false === form.get(key).isValid()) {
                            throw new Error(sogh.camelCase(this.__state[i].type) + " '" + key + "' = '" + data[key] + "': " + form.get(key).errors().first());
                        }
                    }
                }
            }

            return true;
        },

        /**
         * @private
         * @function
         * @name sogqb.State#__validateFields
         * @description
         * <p>Validate state fields.</p>
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validateFields: function () {
            for (var i = 0; i < this.__state.length; i ++) {
                if('expression' === this.__state[i].type) {
                    var field =  this.__state[i].field.split('.');
                    if (false === this.__scheme.exist(this.__state[i].field)) {
                        throw new Error('Model "' + field[0] + '" or field "' + field[1] + '" for model "' + field[0] + '" does not exist.');
                    }
                }
            }

            return true;
        }
    });

    return {
        State: State
    };
}());
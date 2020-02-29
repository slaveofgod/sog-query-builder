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

        this.__state = state || [];
        this.__scheme = scheme || [];

        if (null !== this.__state) {
            this.__validate();
            this.__validateFields();
            this.__init();
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
         * @name sogqb.State#add
         * @description
         * <p>Add new state item.</p>
         * @param {Object} options New state options.
         * @param {Boolean} strict Strict validation mode.
         */
        add: function (options, strict) {
            strict = strict || true;

            this.__state.push(options);

            this.__validate(strict);
        },

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

                        if (null != this.__state[i].field) {
                            theme.appendChild('field', {
                                value: this.__state[i].field,
                                label: this.__scheme.getEntityFieldLabel(this.__state[i].field),
                            });
                        }

                        if (null != this.__state[i].operator) {
                            theme.appendChild('expressionOperator', {
                                value: this.__state[i].operator,
                                label: this.__scheme.getFormattedExpressionOperator(this.__state[i].operator)
                            });
                        }

                        if (null != this.__state[i].value) {
                            theme.appendChild('fieldValue', {
                                value: this.__state[i].value,
                                label: this.__scheme.getEntityFieldFormattedValue(this.__state[i].field, this.__state[i].value)
                            });
                        }
                        break;
                    case 'conjunction':
                        theme.appendChild('conjunctionOperator', {
                            value: this.__state[i].operator,
                            label: this.__scheme.getFormattedConjunctionOperator(this.__state[i].operator)
                        });
                        break;
                }
            }
        },

        /**
         * @function
         * @name sogqb.State#removeLatestBlock
         * @description
         * <p>Remove latest block.</p>
         */
        removeLatestBlock: function () {
            var blockIndex = this.latestBlockIndex();

            if (null !== blockIndex) {
                this.__state.splice(blockIndex, 1);
            }
        },

        /**
         * @function
         * @name sogqb.State#nextElementType
         * @description
         * <p>Next element type.</p>
         * @returns {String} The element type.
         */
        nextElementType: function () {
            var block = this.latestBlock();

            if (
                null === block
                || (
                    'complete' === block.status
                    && 'conjunction' === block.type
                )
            ) {
                return 'field';
            }

            switch (block.status) {
                case 'complete':
                    return 'conjunction';
                    break;
                case 'field':
                    return 'operator';
                    break;
                case 'operator':
                    return 'value';
                    break;
            }
        },

        /**
         * @private
         * @function
         * @name sogqb.State#__init
         * @description
         * <p>Initialize state.</p>
         */
        __init: function () {
            for (var i = 0; i < this.__state.length; i ++) {
                this.__state[i].status = 'complete';
            }
        },

        /**
         * @private
         * @function
         * @name sogqb.State#latestBlockIndex
         * @description
         * <p>Latest block index.</p>
         * @returns {Integer|Null}
         */
        latestBlockIndex: function () {
            if (this.__state.length == 0) {
                return null;
            }

            return this.__state.length - 1;
        },

        /**
         * @function
         * @name sogqb.State#latestBlock
         * @description
         * <p>Latest block.</p>
         * * @returns {Object|Null}
         */
        latestBlock: function () {
            var blockIndex = this.latestBlockIndex();
            if (null === blockIndex) {
                return null;
            }

            return this.__state[blockIndex];
        },

        /**
         * @private
         * @function
         * @name sogqb.State#__validate
         * @description
         * <p>Validate state.</p>
         * @param {Boolean} strict Strict validation mode.
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validate: function (strict) {
            strict = strict || true;

            sogqb.isValidException('State', this.__state, 'required|array');
            for (var i = 0; i < this.__state.length; i ++) {
                sogqb.isValidException('State > Type', this.__state[i].type, 'required|alnum|in:' + sogqb.config.stateElementTypes.join(';'));

                var validationEngine = new sogv.Application({
                    lang: 'en'
                });

                var data = {};
                var rules = {};
                var required = (false === strict || 'complete' !== this.__state[i].status) ? '' : 'required|';

                switch (this.__state[i].type) {
                    case 'expression':
                        data = {
                            field: this.__state[i].field,
                            value: this.__state[i].value,
                            operator: this.__state[i].operator
                        };

                        rules = {
                            field: 'required|regex:^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$',
                            value: required + 'scalar',
                            operator: required + 'alnum|in:' + sogqb.config.expressionOperators.map(function (data) {
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
                if(
                    'expression' === this.__state[i].type
                    && 'complete' === this.__state[i].status
                ) {
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
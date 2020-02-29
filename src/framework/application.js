Object.assign(sogqb, function () {
    'use strict';

    /**
     * @constructor
     * @name sogqb.Application
     * @classdesc Query Builder Application.
     * @description Init Application.
     * @param {String} container The container of query string.
     * @param {String} entity The current entity.
     * @param {Object} scheme The scheme of query.
     * @param {Object} state=null Query builder state. If this value is null, it will be used data from url.
     * @param {String} theme=material Theme.
     * @example
     * var queryBuilder = new sogqb.Application('user-query-builder', 'user');
     */

    // PROPERTIES

    var Application = function (container, entity, scheme, state, theme) {

        var __this = this;

        this.__container = container || null;
        this.__entity = entity || null;
        this.__scheme = scheme || null;
        this.__state = state || null;
        this.__theme = theme || 'material';

        this.initialized = false;

        sogqb.isValidException('Container', this.__container, 'required|string|length:5,255'); // Validate container
        sogqb.isValidException('Entity', this.__entity, 'required|string|length:2,50'); // Validate entity name

        this.setScheme(this.__scheme);
        this.setTheme(this.__theme);
        this.setState(this.__state, this.__scheme);

        this.name = 'Application';

        window.addEventListener("resize", function () {
            __this.draw();
        });
    };

    Application.prototype.constructor = Application;

    Object.defineProperties(Application.prototype, {
        'container': {
            get: function () {
                return this.__container;
            }
        },
        'entity': {
            get: function () {
                return this.__entity;
            }
        },
        'scheme': {
            get: function () {
                return this.__scheme;
            }
        },
        'state': {
            get: function () {
                return this.__state;
            }
        },
        'theme': {
            get: function () {
                return this.__theme;
            }
        }
    });

    Object.assign(Application.prototype, {
        /**
         * @function
         * @name sogqb.Application#setScheme
         * @description
         * <p>Set query scheme.</p>
         * @param {Object} scheme The scheme of query.
         * @example
         * ...
         * queryBuilder.setScheme([{
         *     entity: 'user',
         *     columns: [
         *         {
         *             name: 'first_name',
         *             title: 'First Name',
         *             type: 'entity',
         *             data: [
         *                 {
         *                     id: 1,
         *                     label: 'Alexey'
         *                 }, {
         *                     id: 2,
         *                     label: 'Vasili'
         *                 }, {
         *                     id: 10,
         *                     label: 'Dmitry'
         *                 }, {
         *                     id: 16,
         *                     label: 'Oleg'
         *                 }, {
         *                     id: 22,
         *                     label: 'Andrew'
         *                 }
         *             ]
         *         }, {
         *             name: 'last_name',
         *             title: 'Last Name',
         *             type: 'entity',
         *             data: [
         *                 {
         *                     id: 1,
         *                     label: 'Bob'
         *                 }, {
         *                     id: 2,
         *                     label: 'Pupkin'
         *                 }, {
         *                     id: 10,
         *                     label: 'Ivanov'
         *                 }, {
         *                     id: 16,
         *                     label: 'Overiev'
         *                 }, {
         *                     id: 22,
         *                     label: 'Kalinin'
         *                 }
         *             ]
         *         }, {
         *             name: 'email',
         *             title: 'Email',
         *             type: 'email'
         *         }, {
         *             name: 'age',
         *             title: 'Age',
         *             type: 'integer'
         *         }, {
         *             name: 'country',
         *             title: 'Country',
         *             type: 'string'
         *         }, {
         *             name: 'city',
         *             title: 'City',
         *             type: 'string'
         *         }, {
         *             name: 'birthday',
         *             title: 'Birthday',
         *             type: 'date'
         *         }, {
         *             name: 'tax',
         *             title: 'Tax',
         *             type: 'numeric'
         *         }
         *     ]
         * }]);
         */
        setScheme: function (scheme) {
            this.__scheme = sogqb.makeScheme(scheme);
        },

        /**
         * @function
         * @name sogqb.Application#setState
         * @description
         * <p>Set query builder state.</p>
         * @param {Object} state Query builder state.
         * @param {Object} scheme Query builder scheme.
         * @example
         * ...
         * queryBuilder.setState([
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
        setState: function (state, scheme) {
            if ('undefined' !== typeof state) {
                scheme = this.__state;
            }

            if (null !== typeof scheme) {
                scheme = this.__scheme;
            }

            this.__state = sogqb.makeState(state, scheme);
        },

        /**
         * @function
         * @name sogqb.Application#setTheme
         * @description
         * <p>Build theme and apply it to the application.</p>
         * @param {Object} theme Theme name.
         * @example
         * ...
         * queryBuilder.setTheme('material');
         */
        setTheme: function (theme) {
            this.__theme = sogqb.makeTheme(theme, {
                container: this.container
            }, {});
        },

        /**
         * @function
         * @name sogqb.Application#draw
         * @description
         * <p>Draw query search container.</p>
         */
        draw: function () {
            var builder = sogqb.QueryBuilderFactory.create(this.__scheme, this.__theme, this.__state);

            builder.draw();

            this.__init();
        },

        /**
         * @function
         * @name sogqb.Application#__init
         * @description
         * <p>Initialization the new application.</p>
         */
        __init: function () {
            var __this = this;
            var queryButton = document.querySelector("#" + this.container + " .query-button");

            var container = document.getElementById(this.container);
            if (null !== container) {
                // Field button
                document.querySelectorAll("#" + this.container + " .field-button").forEach(function (element) {
                    element.addEventListener("click", function(e){
                        queryButton.focus();
                    });
                });

                // Expression operator button
                document.querySelectorAll("#" + this.container + " .expression-operator-button").forEach(function (element) {
                    element.addEventListener("click", function(e){
                        queryButton.focus();
                    });
                });

                // Field value button
                document.querySelectorAll("#" + this.container + " .field-value-button").forEach(function (element) {
                    element.addEventListener("click", function(e){
                        queryButton.focus();
                    });
                });

                // Conjunction operator button
                document.querySelectorAll("#" + this.container + " .conjunction-operator-button").forEach(function (element) {
                    element.addEventListener("click", function(e){
                        queryButton.focus();
                    });
                });

                // Query button
                queryButton.addEventListener("focus", function(e){
                    __this.__addQueryItem();
                });
                queryButton.addEventListener("keydown", function(e){
                    switch (e.code) {
                        case 'Backspace':
                            __this.__state.removeLatestBlock();
                            __this.draw();
                            document.querySelector("#" + __this.container + " .query-button").focus();
                            break;
                        default:
                            break;
                    }
                }, { passive: true });
                queryButton.addEventListener("blur", function(e){
                    document.querySelector("#" + __this.container + " .query-button").innerHTML = '';
                });
            }

            this.initialized = true;
        },

        __addQueryItem: function () {
            var __this = this;
            var type = this.__state.nextElementType();
            var queryContainer =  document.querySelector("#" + this.container + " .query-button");
            queryContainer.innerHTML = '';

            switch (type) {
                case 'conjunction':
                    var dropdown = this.__theme.createDropdownElement(sogqb.config.conjunctionOperators, function (e) {
                        __this.__state.add({
                            type: 'conjunction',
                            operator: e.target.getAttribute('data-value'),
                            status: 'complete'
                        });

                        __this.draw();
                    }, true);

                    queryContainer.appendChild(dropdown);
                    break;

                case 'field':
                    var columns = this.__scheme.getEntityColumnsList(this.__entity);
                    var dropdown = this.__theme.createDropdownElement(columns, function (e) {
                        __this.__state.add({
                            type: 'expression',
                            field: e.target.getAttribute('data-value'),
                            value: null,
                            operator: null,
                            status: 'field'
                        }, false);

                        __this.draw();
                    }, true);

                    queryContainer.appendChild(dropdown);
                    break;

                case 'operator':
                    var block = this.__state.latestBlock();
                    var type = this.__scheme.getEntityFieldType(block.field);
                    var list = sogqb.operatorsList(type);
                    var dropdown = this.__theme.createDropdownElement(list, function (e) {
                        var block = __this.__state.latestBlock();

                        block.operator = e.target.getAttribute('data-value');
                        block.status = 'operator';

                        __this.draw();
                    }, true);

                    queryContainer.appendChild(dropdown);
                    break;

                case 'value':
                    var block = this.__state.latestBlock();
                    var type = this.__scheme.getEntityFieldType(block.field);

                    switch (type) {
                        case 'entity':
                            var data = this.__scheme.getEntityFieldValueList(block.field);
                            var dropdown = this.__theme.createDropdownElement(data, function (e) {
                                var block = __this.__state.latestBlock();

                                block.value = __this.__scheme.getEntityFieldFormattedValue(block.field, e.target.getAttribute('data-value'));
                                block.status = 'completed';

                                __this.draw();
                            }, true);

                            queryContainer.appendChild(dropdown);
                            break;
                    }
                    break;
            }
        }
    });

    return {
        Application: Application
    };
}());
Object.assign(sogqb, function () {
    'use strict';

    /**
     * @constructor
     * @name sogqb.Application
     * @classdesc Query Builder Application.
     * @description Init Application.
     * @param {String} container The container of query string.
     * @param {String} entity The current entity.
     * @param {Object} scheme=null The scheme of query.
     * @param {Object} state=null Query builder state. If this value is null, it will be used data from url.
     * @param {String} theme=material Theme.
     * @example
     * var queryBuilder = new sogqb.Application('user-query-builder', 'user');
     */

    // PROPERTIES

    var Application = function (container, entity, scheme, state, theme) {

        this.__container = container || null;
        this.__entity = entity || null;
        this.__scheme = scheme || null;
        this.__state = state || null;
        this.__theme = theme || 'material';

        sogqb.validateContainer(this.__container);
        sogqb.validateEntity(this.__entity);
        sogqb.validateState(this.__state);

        var __this = this;

        this.setScheme(this.__scheme);
        this.setTheme(this.__theme);

        this.name = 'Application';

        window.addEventListener("resize", function () {
            __this.update();
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
         *             type: 'string',
         *             data: {
         *                 1: 'Alexey',
         *                 2: 'Vasili',
         *                 10: 'Dmitry',
         *                 16: 'Oleg',
         *                 22: 'Andrew',
         *             }
         *         }, {
         *             name: 'last_name',
         *             title: 'Last Name',
         *             type: 'string',
         *             data: {
         *                 1: 'Bob',
         *                 2: 'Pupkin',
         *                 10: 'Ivanov',
         *                 16: 'Overiev',
         *                 22: 'Kalinin',
         *             }
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
         * @param {Object} scheme Query builder state.
         * @example
         * ...
         * queryBuilder.setState([
         *     {
         *         type: 'expression',
         *         field: 'first_name',
         *         value: 1,
         *         operator: 'like'
         *     }, {
         *         type: 'expression',
         *         operator: 'and'
         *     }, {
         *         type: 'expression',
         *         field: 'last_name',
         *         value: 1,
         *         operator: 'like'
         *     }
         * ]);
         */
        setState: function (state) {
            sogqb.validateState(state, 'required');
            this.__state = state;
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
            this.__theme.draw();
            /**
             * @todo Check that scheme is defined.
             */
        },

        /**
         * @function
         * @name sogqb.Application#update
         * @description
         * <p>Update query search container.</p>
         */
        update: function () {
            this.__theme.update();
        }
    });

    return {
        Application: Application
    };
}());
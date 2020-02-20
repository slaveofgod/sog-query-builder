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
     * @param {Object} settings=null Query builder settings. If this value is null, it will be used data from url.
     * @param {String} theme=material Theme.
     * @example
     * var queryBuilder = new sogqb.Application('user-query-builder', 'user');
     */

    // PROPERTIES

    var Application = function (container, entity, scheme, settings, theme) {

        this.__container = container || null;
        this.__entity = entity || null;
        this.__scheme = scheme || null;
        this.__settings = settings || null;
        this.__theme = theme || 'material';

        sogqb.validateContainer(this.__container);
        sogqb.validateEntity(this.__entity);
        sogqb.validateScheme(this.__scheme);
        sogqb.validateSettings(this.__settings);

        var __this = this;

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
        'settings': {
            get: function () {
                return this.__settings;
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
         * @description Set query scheme.
         * @param {Object} scheme The scheme of query.
         * @example
         * ...
         * queryBuilder.setScheme({
         *     user: {
         *         entity: 'user',
         *         columns: {
         *             first_name: {
         *                 name: 'first_name',
         *                 title: 'First Name',
         *                 type: 'string',
         *                 data: {
         *                     1: 'Alexey',
         *                     2: 'Vasili',
         *                     10: 'Dmitry',
         *                     16: 'Oleg',
         *                     22: 'Andrew',
         *                 }
         *             },
         *             second_name: {
         *                 name: 'last_name',
         *                 title: 'Last Name',
         *                 type: 'string',
         *                 data: {
         *                     1: 'Bob',
         *                     2: 'Pupkin',
         *                     10: 'Ivanov',
         *                     16: 'Overiev',
         *                     22: 'Kalinin',
         *                 }
         *             }
         *         }
         *     }
         * });
         */
        setScheme: function (scheme) {
            sogqb.validateScheme(scheme, 'required');
            this.__scheme = scheme;
        },

        /**
         * @function
         * @name sogqb.Application#setSettings
         * @description Set query builder settings.
         * @param {Object} scheme Query builder settings.
         * @example
         * ...
         * queryBuilder.setSettings([
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
        setSettings: function (settings) {
            sogqb.validateSettings(settings, 'required');
            this.__settings = settings;
        },

        /**
         * @function
         * @name sogqb.Application#setTheme
         * @description Build theme and apply it to the application.
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
         * @description Draw query search container.
         */
        draw: function () {
            this.__theme.draw();
        },

        /**
         * @function
         * @name sogqb.Application#update
         * @description Update query search container.
         */
        update: function () {
            this.__theme.update();
        }
    });

    return {
        Application: Application
    };
}());

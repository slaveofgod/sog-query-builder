Object.assign(sogqb, function () {
    'use strict';

    /**
     * @constructor
     * @name sogqb.Scheme
     * @classdesc Query Builder Scheme.
     * @description Init Scheme.
     * @param {String} scheme Scheme settings.
     * @example
     * var scheme = new sogqb.Scheme([{
     *     entity: 'user',
     *     columns: [
     *         {
     *             name: 'first_name',
     *             title: 'First Name',
     *             type: 'string',
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
     *             type: 'string',
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

    // PROPERTIES

    var Scheme = function (scheme) {

        this.__scheme = scheme || null;

        if (null !== this.__scheme) {
            this.__validate();
        }

        this.name = 'Scheme';
    };

    Scheme.prototype.constructor = Scheme;

    Object.defineProperties(Scheme.prototype, {
        'scheme': {
            get: function () {
                return this.__scheme;
            }
        }
    });

    Object.assign(Scheme.prototype, {
        /**
         * @private
         * @function
         * @name sogqb.Scheme#__validate
         * @description
         * <p>Validate scheme.</p>
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validate: function () {
            for (var i = 0; i < this.__scheme.length; i ++) {
                this.__validateEntity(this.__scheme[i].entity);
                this.__validateColumns(this.__scheme[i].columns);
            }

            return true;
        },

        /**
         * @private
         * @function
         * @name sogqb.Scheme#__validateEntity
         * @description
         * <p>Validate scheme entity name.</p>
         * @param {String} entity Entity name.
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validateEntity: function (entity) {
            var message = sogv.isValidWithErrorMessage(entity, 'required|string|alpha-dash|length:2,50');
            if(null !== message) {
                throw new Error("Entity: [" + entity + "] " + message);
            }

            return true;
        },

        /**
         * @private
         * @function
         * @name sogqb.Scheme#__validateColumns
         * @description
         * <p>Validate scheme columns.</p>
         * @param {Object} columns Entity columns.
         * @exception Validation error message.
         * @returns {Boolean}
         */
        __validateColumns: function (columns) {
            var message = sogv.isValidWithErrorMessage(columns, 'required|array|between:1,1000');
            if(null !== message) {
                throw new Error("Columns: " + message);
            }

            columns.forEach(function(element) {
                var validationEngine = new sogv.Application({
                    lang: 'en'
                });

                var data = {
                    name: element.name,
                    title: element.title,
                    type: element.type,
                    data: element.data
                };

                var rules = {
                    name: 'required|string|alpha-dash|length:2,50',
                    title: 'required|string|print|length:2,100',
                    type: 'required|in:email;integer;numeric;string;date',
                    /**
                     * @todo Add deeper checking and [data: function] or [data: url]
                     */
                    data: 'array'
                };

                var form = validationEngine.make(data, rules);
                if (false === form.isValid()) {
                    for (var key in data) {
                        if (!data.hasOwnProperty(key)) continue;

                        if (false === form.get(key).isValid()) {
                            throw new Error("Column '" + key + "' = '" + data[key] + "': " + form.get(key).errors().first());
                        }
                    }
                }
            });

            return true;
        }
    });

    return {
        Scheme: Scheme
    };
}());
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

    // PROPERTIES

    var Scheme = function (scheme) {

        this.__scheme = scheme || null;

        this.__validate();

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
         * @function
         * @name sogqb.Scheme#getEntity
         * @description
         * <p>Get entity by entity name.</p>
         * @param {String} entityName Entity name.
         * @returns {Object|Null}
         */
        getEntity: function (entityName) {
            var entity = null;
            for (var i = 0; i < this.__scheme.length; i ++) {
                if (entityName === this.__scheme[i].entity) {
                    entity = this.__scheme[i];
                    break;
                }
            }

            return entity;
        },

        /**
         * @function
         * @name sogqb.Scheme#exist
         * @description
         * <p>Check that model or field for the model exists in the scheme.</p>
         * @param {String} field Checked field.
         * @returns {Boolean}
         */
        exist: function (field) {
            var field =  field.split('.');

            var entity = this.getEntity(field[0]);
            if (null === entity) {
                return false;
            }

            for (var i = 0; i < entity.columns.length; i ++) {
                if (field[1] === entity.columns[i].name) {
                    return true;
                }
            }

            return false;
        },

        /**
         * @function
         * @name sogqb.Scheme#getEntityFields
         * @description
         * <p>Get entity fields by entity name.</p>
         * @param {String} entityName Entity name.
         * @returns {Object}
         */
        getEntityFields: function (entityName) {
            var entity = this.getEntity(entityName);
            var columns = [];
            if (null === entity) {
                return [];
            }

            for (var i = 0; i < entity.columns.length; i ++) {
                columns.push({
                    name: entity.columns[i].name,
                    title: entity.columns[i].title
                });
            }

            return columns;
        },

        /**
         * @function
         * @name sogqb.Scheme#getEntityFieldLabel
         * @description
         * <p>Get entity field label.</p>
         * @param {String} field The field.
         * @returns {Object}
         */
        getEntityFieldLabel: function (field) {
            var field =  field.split('.');
            var entity = this.getEntity(field[0]);
            var label = field[1];

            for (var i = 0; i < entity.columns.length; i ++) {
                if (field[1] === entity.columns[i].name) {
                    label = entity.columns[i].title;
                    break;
                }
            }

            return label;
        },

        /**
         * @function
         * @name sogqb.Scheme#getEntityFieldFormattedValue
         * @description
         * <p>Get entity field formatted value.</p>
         * @param {String} field The field.
         * @param {String|Integer} value The value.
         * @returns {String}
         */
        getEntityFieldFormattedValue: function (field, value) {
            var field =  field.split('.');
            var entity = this.getEntity(field[0]);
            var data = value;

            for (var i = 0; i < entity.columns.length; i ++) {
                if (field[1] === entity.columns[i].name) {
                    switch (entity.columns[i].type) {
                        case 'entity':
                            for (var j = 0; j < entity.columns[i].data.length; j ++) {
                                if (value === entity.columns[i].data[j].id) {
                                    data = entity.columns[i].data[j].label;
                                    break;
                                }
                            }
                            break;
                    }

                    break;
                }
            }

            return data;
        },

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
            sogqb.isValidException('Scheme', this.__scheme, 'required|array|count:1,100');

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
            sogqb.isValidException('Entity', entity, 'required|string|alpha-dash|length:2,50');

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
            sogqb.isValidException('Columns', columns, 'required|array|between:1,1000');

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
                    type: 'required|in:email;integer;numeric;string;date;entity',
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
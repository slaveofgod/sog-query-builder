Object.assign(sogqb, function () {
    'use strict';

    /**
     * @constructor
     * @name sogqb.Application
     * @classdesc Query Builder Application.
     * @description Init Application.
     * @param {Object} entity The current entity.
     * @param {Object} scheme The scheme of query.
     * @example
     * var queryBuilder = new sogqb.Application({
     *     scheme: 'scheme'
     * });
     */

    // PROPERTIES

    var Application = function (entity, scheme) {

        entity = entity || null;
        scheme = scheme || null;

        sogqb.validateEntity(entity);
        sogqb.validateScheme(scheme);

        /**
         * @private
         * @static
         * @type {sogqb.Application|Undefined}
         * @name sogqb.app
         * @description Gets the current application, if any.
         */
        sogqb.app = this;

        this.name = 'Application';
    };
    Application.prototype.constructor = Application;

    Object.assign(Application.prototype, {
        // /**
        //  * @function
        //  * @name sogqb.Application#make
        //  * @description Create validators for all the fields
        //  * @param {Object} data The data which needs to be validated
        //  * @param {Object} rules The validation rules
        //  * @returns {sogqb.ValidatorHandler}
        //  */
        // make: function (data, rules) {
        //     var validators = new sogqb.ValidatorHandler();
        //
        //     for (var key in rules) {
        //         if (!rules.hasOwnProperty(key)) continue;
        //
        //         validators.add(key, new sogqb.AllValidator(data[key], rules[key], {
        //             lang: this.lang,
        //             internal: this.internal
        //         }));
        //     }
        //
        //     return validators;
        // }
    });

    return {
        Application: Application
    };
}());

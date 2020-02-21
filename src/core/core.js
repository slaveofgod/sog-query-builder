/**
 * @private
 * @function
 * @name _typeLookup
 * @description Create look up table for types
 */
var _typeLookup = function () {
    var result = { };
    var names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];

    for (var i = 0; i < names.length; i++)
        result["[object " + names[i] + "]"] = names[i].toLowerCase();

    return result;
}();

/**
 * @name sogqb
 * @namespace
 * @description Root namespace for the SOG Query Builder Library
 */
var sogqb = {
    version: "__CURRENT_SDK_VERSION__",
    revision: "__REVISION__",
    config: { },
    common: { },
    themes: { },

    /**
     * @function
     * @name sogqb.registerTheme
     * @description
     * <p>Register theme.</p>
     * @param {Function} theme The theme.
     */
    registerTheme: function (theme) {
        var __t = [theme];
        var __theme = new __t[0]({}, {}, true);
        var alias = __theme.alias;

        // Check that "alias" property exist
        if ('undefined' === typeof alias) {
            throw new Error('The theme has to have "alias" property');
        }

        // Check that the validator extend from "sogqb.AbstractTheme" abstract class
        if ('AbstractTheme' !== __theme.base) {
            throw new Error('The theme has to extend "sogqb.AbstractTheme" abstract class');
        }

        // Check that "draw" method is implemented
        if ('undefined' === typeof __theme.__draw) {
            throw new Error('The theme has to implement "__draw" method');
        }

        // Check that alias is type of "string" or "array"
        if (
            false === sogv.isType('string', alias)
            && false === sogv.isType('array', alias)
        ) {
            throw new Error('The alias must be type of "string" or "array", "' + sogv.getType(alias) + '" given');
        }

        if ('string' === typeof alias) {
            alias = [alias];
        }

        alias.forEach(function (element) {
            if ('undefined' === typeof sogqb.themes[theme]) {
                sogqb.themes[element] = theme;
            }
        });
    },

    /**
     * @function
     * @name sogqb.makeTheme
     * @description
     * <p>Create object of the theme.</p>
     * @param {String} theme Theme name.
     * @param {Object} options The setting options.
     * @param {Object} optionRules The validation rules for setting options.
     * @param {Boolean} internal If this parameter is true, it means, that validation called from core.
     * @returns {Object} The object of theme.
     */
    makeTheme: function (theme, options, optionRules, internal) {
        if ('undefined' === typeof sogqb.themes[theme]) {
            throw new Error('Theme with alias "' + theme + '" is not registered.');
        }

        return new sogqb.themes[theme](options, optionRules, internal);
    },

    /**
     * @function
     * @name sogqb.makeScheme
     * @description
     * <p>Create object of the scheme.</p>
     * @param {String} scheme Scheme settings.
     * @returns {Object} The object of scheme.
     */
    makeScheme: function (scheme) {
        return new sogqb.Scheme(scheme);
    },

    /**
     * @function
     * @name sogqb.validateContainer
     * @param {String} container Container.
     * @description
     * <p>Validate container.</p>
     * @exception
     * <p>The validation error message.</p>
     * @returns {Boolean}
     */
    validateContainer: function (container) {
        var message = sogv.isValidWithErrorMessage(container, 'required|string|length:5,255');
        if(null !== message) {
            throw new Error("Container: " + message);
        }

        return true;
    },

    /**
     * @function
     * @name sogqb.validateEntity
     * @param {String} entity Entity name.
     * @description
     * <p>Validate entity name.</p>
     * @exception
     * <p>The validation error message.</p>
     * @returns {Boolean}
     */
    validateEntity: function (entity) {
        var message = sogv.isValidWithErrorMessage(entity, 'required|string|length:2,50');
        if(null !== message) {
            throw new Error("Entity: " + message);
        }

        return true;
    },

    /**
     * @todo Needs to be implemented.
     * @function
     * @name sogqb.validateState
     * @param {Object} state Query builder state.
     * @param {Object} rules=null Additional validation rules.
     * @description
     * <p>Validate query builder state.</p>
     * @exception
     * <p>The validation error message.</p>
     * @returns {Boolean}
     */
    validateState: function (state, rules) { }
};

if (typeof exports !== 'undefined')
    exports.sogqb = sogqb;

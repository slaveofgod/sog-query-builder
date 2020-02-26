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
 * @description
 * <p>Root namespace for the SOG Query Builder Library.</p>
 */
var sogqb = {
    version: "__CURRENT_SDK_VERSION__",
    revision: "__REVISION__",
    config: {
        stateElementTypes: [
            'expression',
            'conjunction'
        ],
        expressionOperators: [
            {
                key: 'equal',
                label: 'Equal'
            }, {
                key: 'not_equal',
                label: 'Not Equal'
            }, {
                key: 'more',
                label: 'More'
            }, {
                key: 'more_or_equal',
                label: 'More or Equal'
            }, {
                key: 'less',
                label: 'Less'
            }, {
                key: 'less_or_equal',
                label: 'less_or_equal'
            }, {
                key: 'like',
                label: 'Like'
            }
        ],
        conjunctionOperators: [
            {
                key: 'or',
                label: 'Or'
            }, {
                key: 'and',
                label: 'And'
            }
        ]
    },
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

        // Check that the validator extend from "sogqb.BaseTheme" abstract class
        if ('BaseTheme' !== __theme.base) {
            throw new Error('The theme has to extend "sogqb.BaseTheme" abstract class');
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
     * @name sogqb.makeState
     * @description
     * <p>Create object of the state.</p>
     * @param {Object} state Query builder state.
     * @param {Object} scheme Query builder scheme.
     * @returns {Object} The object of theme.
     */
    makeState: function (state, scheme) {
        return new sogqb.State(state, scheme);
    },

    /**
     * @function
     * @name sogqb.isValidException
     * @param {String} prefix Validation error message prefix.
     * @param {*} data Validation data.
     * @param {String} rules Validation rules.
     * @description
     * <p>Validating data.</p>
     * @exception
     * <p>The validation error message.</p>
     * @returns {Boolean}
     */
    isValidException: function (prefix, data, rules) {
        var message = sogv.isValidWithErrorMessage(data, rules);
        if(null !== message) {
            throw new Error(prefix + ": " + message);
        }

        return true;
    }
};

if (typeof exports !== 'undefined')
    exports.sogqb = sogqb;

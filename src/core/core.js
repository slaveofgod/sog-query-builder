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

    validateEntity: function (entity) {
        console.log(entity);
    },

    validateScheme: function (scheme) {
        console.log(scheme);
    }
};

if (typeof exports !== 'undefined')
    exports.sogqb = sogqb;

Object.assign(sogqb, function () {
    'use strict';

    /**
     * @constructor
     * @name sogqb.MaterialTheme
     * @extends sogqb.AbstractTheme
     * @classdesc
     * <p>Material admin theme.</p>
     * @description
     * <p>Create a new theme.</p>
     * @property {Array} alias
     * <p>The aliases for the current theme.</p>
     * <p>Defined aliases: ['<code>material</code>'].</p>
     * @param {Object} options The setting options
     * @param {Object} optionRules The validation rules for setting options
     * @param {Boolean} internal If this parameter is true, it means, that validation called from core.
     * @example
     * var theme = new sogqb.MaterialTheme({
     *     container: 'container-id'
     * });
     * theme.draw();
     */

    // PROPERTIES

    /**
     * @name sogqb.MaterialTheme#container
     * @type {String}
     * @description
     * <p>The container where the theme will be applied.</p>
     */

    var MaterialTheme = function (options, optionRules, internal) {
        sogqb.AbstractTheme.call(this, options, {
            container: optionRules.container || 'required|string|length:5,255'
        }, internal);

        this.__queryButton = '<div class="query" contentEditable=true data-text="Searching Filter"></div>';
        this.__searchButton = '<button class="btn btn-default waves-effect btn-super-sm float-right search"><i class="zmdi zmdi-search"></i></button>';
        this.__clearButton = '<button class="btn btn-default waves-effect btn-super-sm float-right clear"><i class="zmdi zmdi-close"></i></button>';

        this.container = this.__options.container;
        this.cssStyles = this.__prepareCssStyles('#%%container%%{height:36px;border:1px solid #5E5E5E;font-size:16px;}#%%container%% .query{height:34px;float:left;width:10px;padding:4px 0 4px 6px;}#%%container%% button.float-left{margin:3px 0 3px 3px;float:left;}#%%container%% button.float-right{margin:3px 3px 3px 0;float:right;}#%%container%% .btn-group-sm > .btn, .btn-super-sm{padding:3px 10px;font-size:14px;line-height:1.5;border-radius:2px;text-transform:none;}#%%container%% [contentEditable=true]:empty:not(:focus):before{content:attr(data-text);opacity:.5;}');
        this.name = 'MaterialTheme';
    };
    MaterialTheme.prototype = Object.create(sogqb.AbstractTheme.prototype);
    MaterialTheme.prototype.constructor = MaterialTheme;

    Object.defineProperty(MaterialTheme.prototype, 'alias', {
        get: function () {
            return [
                'material'
            ];
        }
    });

    Object.assign(MaterialTheme.prototype, {
        /**
         * @private
         * @function
         * @name sogqb.MaterialTheme#__draw
         * @description
         * <p>Draw query search container.</p>
         */
        __draw: function () {
            this.__buildStyleElement();
            this.__buildContainerElement();
        }
    });

    return {
        MaterialTheme: MaterialTheme
    };
}());

sogqb.registerTheme(sogqb.MaterialTheme);
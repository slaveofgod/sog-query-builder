Object.assign(sogqb, (function () {
    'use strict';

    /**
     * @abstract
     * @constructor
     * @name sogqb.AbstractTheme
     * @classdesc Abstract base class that implements functionality for theme.
     * @description Create a new theme extension.
     * @param {Object} options The setting options
     * @param {Object} optionRules The validation rules for setting options
     * @param {Boolean} internal If this parameter is true, it means, that validation called from core.
     * @constructor
     */

    var AbstractTheme = function (options, optionRules, internal) {
        this.__options = options || {};
        this.__internal = (true === internal);
        this.__skipDrawing = false;

        if (false === this.__internal) {
            this.__validateOptions(optionRules);
        }

        this.name = 'AbstractTheme';
        this.base = 'AbstractTheme';
    };

    Object.assign(AbstractTheme.prototype, {
        /**
         * @function
         * @name sogqb.AbstractTheme#draw
         * @description
         * <p>Draw query search container.</p>
         */
        draw: function () {
            this.__beforeDraw();
            if (false === this.__skipDrawing) {
                console.info('Drawing this container with the id "' + this.container + '" ...');
                this.__draw();
            }
            this.__afterDraw();
        },

        update: function () {
            console.info('Updating this container with the id "' + this.container + '" ...');

            var container = document.getElementById(this.container);
            var queryWidth = container.clientWidth - 10;
            container.childNodes.forEach(function (element) {
                if (false === element.classList.contains('query')) {
                    queryWidth -= element.clientWidth;
                }
            });

            var queryElement = container.querySelector('.query');
            queryElement.style.width = queryWidth + 'px';
        },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__draw
         * @description
         * <p>Draw query search container.</p>
         */
        __draw: function () {
            throw new Error('The theme has to implement "__draw" method');
        },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__beforeDraw
         * @description
         * <p>Execute before draw.</p>
         */
        __beforeDraw: function () {
            var container = document.getElementById(this.container);
            if(null === container) {
                this.__skipDrawing = true;
                console.info('This container with the id "' + this.container + '" does not exist.');
            }
        },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__afterDraw
         * @description
         * <p>Execute before after.</p>
         */
        __afterDraw: function () { },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__validateOptions
         * @description
         * <p>Validate options.</p>
         * @param {Object} rules Validation rules
         */
        __validateOptions: function (rules) {
            if ('undefined' === typeof rules || null === rules) {
                return ;
            }

            for (var key in rules) {
                if (!rules.hasOwnProperty(key)) continue;

                var message = sogv.isValidWithErrorMessage(this.__options[key], rules[key], true);
                if (null !== message) {
                    throw new Error("[option:" + key + "]: " +  message);
                }
            }
        },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__prepareCssStyles
         * @description
         * <p>Prepare CSS styles.</p>
         * @returns {String} Prepared CSS styles.
         */
        __prepareCssStyles: function (styles) {
            var parameters = {
                container: this.container
            };

            for (var key in parameters) {
                if (!parameters.hasOwnProperty(key)) continue;
                styles = styles.replace(new RegExp("%%" + key + "%%", 'gm'), parameters[key]);
            }

            return styles;
        },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__buildStyleElement
         * @description
         * <p>Build style element.</p>
         */
        __buildStyleElement: function () {
            var container = document.getElementById(this.container);
            var style = document.createElement('style');
            style.innerHTML = this.cssStyles;
            container.appendChild(style);
        },

        /**
         * @private
         * @function
         * @name sogqb.AbstractTheme#__buildContainerElement
         * @description
         * <p>Build container element.</p>
         */
        __buildContainerElement: function () {
            var container = document.getElementById(this.container);

            var query = this.__buildElement('query');
            var search = this.__buildElement('search');
            var clear = this.__buildElement('clear');

            container.appendChild(query);
            container.appendChild(search);
            container.appendChild(clear);

            this.update();
        },

        __buildElement: function (type) {
            var template = document.createElement('template');
            var html = '';

            switch (type) {
                case 'query':
                    html = this.__queryButton.trim();
                    break;
                case 'search':
                    html = this.__searchButton.trim();
                    break;
                case 'clear':
                    html = this.__clearButton.trim();
                    break;
            }

            template.innerHTML = html;
            return template.content.firstChild;
        }
    });

    return {
        AbstractTheme: AbstractTheme
    };
}()));

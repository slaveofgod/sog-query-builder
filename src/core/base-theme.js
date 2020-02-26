Object.assign(sogqb, (function () {
    'use strict';

    /**
     * @abstract
     * @constructor
     * @name sogqb.BaseTheme
     * @classdesc Abstract base class that implements functionality for theme.
     * @description Create a new theme extension.
     * @param {Object} options The setting options
     * @param {Object} optionRules The validation rules for setting options
     * @param {Boolean} internal If this parameter is true, it means, that validation called from core.
     * @constructor
     */

    var BaseTheme = function (options, optionRules, internal) {
        this.__options = options || {};
        this.__internal = (true === internal);
        this.__skipDrawing = false;

        if (false === this.__internal) {
            this.__validateOptions(optionRules);
        }

        this.name = 'BaseTheme';
        this.base = 'BaseTheme';
    };

    Object.assign(BaseTheme.prototype, {
        /**
         * @function
         * @name sogqb.BaseTheme#draw
         * @description
         * <p>Draw query search container.</p>
         */
        draw: function () {
            this.__beforeDraw();
            if (false === this.__skipDrawing) {
                this.__destroy();
                console.info('Drawing this container with the id "' + this.container + '" ...');
                this.__draw();
            }
            this.__afterDraw();
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__draw
         * @description
         * <p>Draw query search container.</p>
         */
        __draw: function () {
            throw new Error('The theme has to implement "__draw" method');
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__beforeDraw
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
         * @name sogqb.BaseTheme#__afterDraw
         * @description
         * <p>Execute before after.</p>
         */
        __afterDraw: function () { },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__destroy
         * @description
         * <p>Destroy query search container.</p>
         */
        __destroy: function () {
            document.getElementById(this.container).innerHTML = '';
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__validateOptions
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

                sogqb.isValidException("[option: " + key + "]", this.__options[key], rules[key]);
            }
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__prepareCssStyles
         * @description
         * <p>Prepare CSS styles.</p>
         * @param {String} styles CSS styles
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
         * @name sogqb.BaseTheme#__buildStyleElement
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
         * @name sogqb.BaseTheme#__buildContainerElement
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
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__prettify
         * @description
         * <p>Prettify container element.</p>
         */
        __prettify: function () {
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
         * @name sogqb.BaseTheme#__prettify
         * @description
         * <p>Build html element.</p>
         * @param {String} type The element type.
         * @returns {ChildNode}
         */
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
        BaseTheme: BaseTheme
    };
}()));

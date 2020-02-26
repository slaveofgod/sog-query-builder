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
         * @name sogqb.BaseTheme#appendChild
         * @description
         * <p>Add element to the query search container.</p>
         */
        appendChild: function (type, options) {
            var container = document.getElementById(this.container);
            var element = this.__buildElement(type, options);
            container.appendChild(element);
        },

        /**
         * @function
         * @name sogqb.BaseTheme#destroy
         * @description
         * <p>Destroy query search container.</p>
         */
        destroy: function () {
            document.getElementById(this.container).innerHTML = '';
        },

        /**
         * @function
         * @name sogqb.BaseTheme#draw
         * @description
         * <p>Draw query search container.</p>
         */
        draw: function () {
            this.__beforeDraw();
            if (false === this.__skipDrawing) {
                console.info('Drawing this container with the id "' + this.container + '" ...');
                this.__draw();

                this.__buildStyleElement();
                this.__buildContainerElement();
                this.__prettify();
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
            style.innerHTML = this.__prepareCssStyles(this.cssStyles);
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
            var queryWidth = container.clientWidth;
            container.childNodes.forEach(function (element) {
                if (false === element.classList.contains('query')) {
                    queryWidth -= parseInt(element.clientWidth + 3);
                }
            });

            var queryElement = container.querySelector('.query');
            queryElement.style.width = queryWidth + 'px';
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__buildElement
         * @description
         * <p>Build html element.</p>
         * @param {String} type The element type.
         * @param {String} options The element options.
         * @returns {ChildNode}
         */
        __buildElement: function (type, options) {
            var template = document.createElement('template');
            var html = '';

            switch (type) {
                case 'query':
                    html = this.queryButton.trim();
                    break;
                case 'search':
                    html = this.searchButton.trim();
                    break;
                case 'clear':
                    html = this.clearButton.trim();
                    break;
                case 'field':
                    html = this.fieldButton.trim();
                    break;
                case 'expressionOperator':
                    html = this.expressionOperatorButton.trim();
                    break;
                case 'fieldValue':
                    html = this.fieldValueButton.trim();
                    break;
                case 'conjunctionOperator':
                    html = this.conjunctionOperatorButton.trim();
                    break;
            }

            template.innerHTML = this.__prepareElement(html, options);
            var element = template.content.firstChild;

            switch (type) {
                case 'search':
                case 'clear':
                    element.className += " " + this.cssControlClasses;
                    break;
                case 'field':
                case 'expressionOperator':
                case 'fieldValue':
                case 'conjunctionOperator':
                    element.className += " " + this.cssQueryClasses;
                    break;
            }

            return element;
        },

        /**
         * @private
         * @function
         * @name sogqb.BaseTheme#__prepareElement
         * @description
         * <p>Prepare element.</p>
         * @param {String} element The element.
         * @param {String} options The element options.
         * @returns {String}
         */
        __prepareElement: function (element, options) {
            options = options || {};
            for (var key in options) {
                if (!options.hasOwnProperty(key)) {
                    continue;
                }
                element = element.replace("%%" + key + "%%", options[key]);
            }

            return element;
        }
    });

    return {
        BaseTheme: BaseTheme
    };
}()));

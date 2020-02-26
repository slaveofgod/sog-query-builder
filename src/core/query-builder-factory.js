/**
 * @private
 * @name sogqb.QueryBuilderFactory
 * @namespace
 * @description
 * <p>Root namespace for query builder factory.</p>
 */

sogqb.QueryBuilderFactory = {
    /**
     * @function
     * @name sogqb.QueryBuilderFactory.create
     * @description
     * <p>Create query builder factory.</p>
     * @param {sogqb.Scheme} scheme Scheme object.
     * @param {sogqb.BaseTheme} theme Theme object.
     * @param {sogqb.State} state State object.
     */
    create: function (scheme, theme, state) {
        var __function = function (scheme, theme, state) {
            this.__scheme = scheme;
            this.__theme = theme;
            this.__state = state;

            this.draw = function () {
                this.__theme.destroy();
                this.__state.draw(theme);
                this.__theme.draw();
            };
        };

        return new __function(scheme, theme, state);
    }
};
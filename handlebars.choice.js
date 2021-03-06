(function (moduleFactory) {
    if(typeof exports === "object") {
        module.exports = moduleFactory(require("lodash"));
    } else if (typeof define === "function" && define.amd) {
        define(["lodash"], moduleFactory);
    }
}(function (_) {
/**
 * @module handlebars%choice
 * @description  Helpers to provide pluralisation/inflection choices
 *
 *     var Handlebars = require("handlebars");
 *     var Choice = require("handlebars.choice");
 *     Choice.registerHelpers(Handlebars);
 * 
 * @returns {object} Choice instance
 */
    var Handlebars;

    var locale = "default";

    var choiceRegister = {};
    /**
     * @method  registerChoice
     * @param {object} options
     * @param {string} options.name Name of choice bundle
     * @param {function} options.fn Choice function
     * @param {string} [options.locale=default] Bundle’s locale 
     * @description Register a function to use for returning keywords
     */
    function registerChoice (options) {
        options.locale = options.locale || locale;
        choiceRegister[options.locale] = choiceRegister[options.locale] || {};
        choiceRegister[options.locale][options.name] = options.fn;
    }
    /**
     * @method  unregisterChoice
     * @param {string} name Name of choice bundle
     * @param {string} loc Bundle’s locale
     * @description Remove a choice bundle from register
     */
    function unregisterChoice (name, loc) {
        delete choiceRegister[loc][name];
    }

    /**
     * @method  getPluralKeyword
     * @param {number} num Variable to be converted to keyword
     * @description Default method to return pluralisation keyword 
     * @return {string} keyword (zero|one|other)
     */
    var getPluralKeyword = function (num) {
        var keyword;
        if (num === 0) {
            keyword = "zero";
        } else if (num === 1) {
            keyword = "one";
        } else {
            keyword = "other";
        }
        return keyword;
    };
    /**
     * @member  getPluralKeywordOptions
     * @prop {string} name=getPluralKeyword
     * @prop {function} fn=getPluralKeyword
     * @description Returns a keyword reflecting variable’s amount
     */
    var getPluralKeywordOptions = {
        name: "getPluralKeyword",
        fn: getPluralKeyword
    };
    /**
     * @method  getBoolean
     * @param {boolean} bool Variable to be converted to keyword
     * @description Returns a keyword whether variable was true or not
     * @return {string} keyword (true|false)
     */
    var getBoolean = function (bool) {
        return bool === true ? "true" : "false";
    };
    registerChoice(getPluralKeywordOptions);
    getPluralKeywordOptions.locale = "en";
    registerChoice(getPluralKeywordOptions);

    var ChoiceHelpers = function() {
        /**
         * @template choose
         * @block helper
         * @description  Outputs a choice matching the variable passed in
         * 
         *     {{#choose x}}
         *         {{#choice "a"}} A {{/choice}}
         *         {{#choice "b"}} B {{/choice}}
         *     {{/choose}
         *
         *     {{#choose x}}
         *         This gets output whaver the value of x
         *         {{#choice "a"}} A {{/choice}}
         *         {{#choice "b"}} B {{/choice}}
         *     {{/choose}
         *     
         *     {{#choose x}}
         *         {{#choice "a"}} A {{/choice}}
         *         {{#choice "b c d e"}} BCDE {{/choice}}
         *     {{/choose}
         *     
         *     {{#choose x}}
         *         {{#choice "a b c"}} ABC {{/choice}}
         *         {{#choice "b d"}} BD {{/choice}}
         *         {{#choice "e"}} E {{/choice}}
         *     {{/choose}
         *
         * Numbers are processed as inflection keywords
         * 
         *     {{#choose x}}
         *         {{x}}
         *         {{#choice "zero other"}} ducks {{/choice}}
         *         {{#choice "one"}} duck {{/choice}}
         *     {{/choose}
         *
         * Booleans are processed as boolean keywords
         * 
         *     {{#choose x}}
         *         {{#choice "true"}} TRUE {{/choice}}
         *         {{#choice "false"}} FALSE {{/choice}}
         *     {{/choose}}
         *
         * Non-booleans can be forced to be processed as booleans
         * 
         *     {{#choose x type="boolean"}}
         *         {{#choice "true"}} TRUE {{/choice}}
         *         {{#choice "false"}} FALSE {{/choice}}
         *     {{/choose}}
         *     
         * Alternative choosing functions can be passed in - the following three examples are functionally equivalent
         * 
         *     {{#choose fn x=x}}
         *         {{#choice "a"}} A {{/choice}}
         *         {{#choice "b"}} B {{/choice}}
         *     {{/choose}}
         *     
         *     {{#choose x function=fn}}
         *         {{#choice "a"}} A {{/choice}}
         *         {{#choice "b"}} B {{/choice}}
         *     {{/choose}}
         *     
         *     {{#choose x=x function=fn}}
         *         {{#choice "a"}} A {{/choice}}
         *         {{#choice "b"}} B {{/choice}}
         *     {{/choose}}
         *
         * Keyword choices can be provided as attributes rather than as nested choice helpers
         *
         *     {{choose x foo="Option Foo" bar="Option Bar"}}
         *
         * Captured content provides fallback option if no attributes matched
         *  
         *     {{#choose x foo="Option Foo" bar="Option Bar"}} Fallback option {{/choose}}
         *
         */
        Handlebars.registerHelper("choose", function() {
            var args = Array.prototype.slice.call(arguments),
                options = args.pop();

            var choiceOperationVar = args.shift();
            var that = _.extend({}, this || {});
            var choiceOperationType = options.hash && options.hash.type ? options.hash.type : undefined;
            if (typeof choiceOperationVar === "function") {
                that.helperChoice = choiceOperationVar(options.hash);
            } else if (options.hash["function"]) {
                var fn = options.hash["function"];
                that.helperChoice = choiceOperationVar ? fn(choiceOperationVar, options.hash) : fn(options.hash);
            } else if (typeof choiceOperationVar === "boolean" || choiceOperationType === "boolean") {
                that.helperChoice = getBoolean(choiceOperationVar);
            } else if (typeof choiceOperationVar === "number") {
                var getPluralKeyword = choiceRegister[locale].getPluralKeyword || choiceRegister["default"].getPluralKeyword;
                that.helperChoice = getPluralKeyword(choiceOperationVar);
            } else {
                that.helperChoice = choiceOperationVar;
            }
            var helperChoiceOption = options.hash[that.helperChoice];
            var chosenStr = helperChoiceOption !== undefined ? helperChoiceOption : options.fn(that);
            if (options.hash.trim !== false) {
                chosenStr = chosenStr.replace(/^\s*(.*)/, "$1").replace(/(.*)\s*$/, "$1");
            }
            return chosenStr;
        });
        /**
         * @template choice
         * @block helper
         * @description  Outputs a phrase using an i18n key
         * @see template:choose
         */
        Handlebars.registerHelper("choice", function() {
            var args = Array.prototype.slice.call(arguments),
                options = args.pop();
            var choiceVar = args.shift();
            if (!_.isArray(choiceVar)) {
                choiceVar = choiceVar.split(" ");
            }

            return choiceVar.indexOf(this.helperChoice) !== -1 ? options.fn(this) : "";
        });
    };

    var Choice = (function () {
        var external = {
            /**
             * @method locale
             * @static
             * @param {string} [loc] Locale to change to
             * @description Get or set default locale used by Choice
             *
             * If called without loc parameter, returns locale
             *
             * If called with loc parameter, sets locale
             *
             * @returns {string} Choice’s locale
             */
            locale: function (loc) {
                if (loc) {
                    locale = loc;
                    if (!choiceRegister[locale]) {
                        choiceRegister[locale] = {};
                    }
                }
                return locale;
            },
            /**
             * @method registerHelpers
             * @static
             * @param {object} hbars Handlebars instance
             * @description Register Choice helpers with Handlebars
             *
             * - {@link template:choice}
             * - {@link template:choose}
             */
            registerHelpers: function (hbars) {
                Handlebars = hbars;
                ChoiceHelpers();
            }
        };
        return external;
    })();

    return Choice;

}));
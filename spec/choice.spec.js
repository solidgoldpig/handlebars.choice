var Log = require("log");
var log = new Log(process.env.loglevel || "error");

var Handlebars = require("handlebars");
var Choice = require("../handlebars.choice");
Choice.registerHelpers(Handlebars);


function template (tmpl, data) {
    var urtemplate = Handlebars.compile(tmpl);
    var output = urtemplate(data || {}).trim().replace(/\s+/g, " ");
    log.info("\n================================", "\n"+tmpl, "\n---------------------------------\n", output, "\n");
    return output;
}


describe("Choice helper", function() {

    it("should output choice", function () {
        var choices = '\
            {{#choose x}}\
                {{#choice "foo"}}Choice foo{{/choice}}\
                {{#choice "bar"}}Choice bar{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {x: "foo"})).toBe("Choice foo");
        expect(template(choices, {x: "bar"})).toBe("Choice bar");
        expect(template(choices, {x: "baz"})).toBe("");
    });

    it("should output non-choice content", function () {
        var choices = '\
            {{#choose x}}\
                Output whatever the value \
                {{#choice "foo"}}Choice foo{{/choice}}\
                {{#choice "bar"}}Choice bar{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {x: "foo"})).toBe("Output whatever the value Choice foo");
        expect(template(choices, {x: "bar"})).toBe("Output whatever the value Choice bar");
    });

    it("should output choice when multiple options", function () {
        var choices = '\
            {{#choose place}}\
                {{#choice "pile"}}Pile 42{{/choice}}\
                {{#choice "xocoa opera cantrevinou postal"}}Xocoa et al{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {place: "pile"})).toBe("Pile 42");
        expect(template(choices, {place: "xocoa"})).toBe("Xocoa et al");
        expect(template(choices, {place: "opera"})).toBe("Xocoa et al");
        expect(template(choices, {place: "laparra"})).toBe("");
    });

    it("should output choices when multiple matches", function () {
        var choices = '\
            {{#choose zone}}\
                {{#choice "a b c"}}1{{/choice}}\
                {{#choice "a"}}2{{/choice}}\
                {{#choice "a c"}}3{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {zone: "a"})).toBe("1 2 3");
        expect(template(choices, {zone: "b"})).toBe("1");
        expect(template(choices, {zone: "c"})).toBe("1 3");
        expect(template(choices, {zone: "d"})).toBe("");
    });

    it("should output boolean choice", function () {
        var choices = '\
            {{#choose x}}\
                {{#choice "true"}}Choice true{{/choice}}\
                {{#choice "false"}}Choice false{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {x: true})).toBe("Choice true");
        expect(template(choices, {x: false})).toBe("Choice false");
        expect(template(choices, {x: "baz"})).toBe("");
        choices = '\
            {{#choose x type="boolean"}}\
                {{#choice "true"}}Choice true{{/choice}}\
                {{#choice "false"}}Choice false{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {x: true})).toBe("Choice true");
        expect(template(choices, {x: false})).toBe("Choice false");
        expect(template(choices, {x: "baz"})).toBe("Choice false");
        expect(template(choices, {x: 1})).toBe("Choice false");
        expect(template(choices, {x: "true"})).toBe("Choice false");
    });

    it("should output choice from options", function () {
        var options = '{{#choose x foo="Option Foo" bar="Option Bar"}}Fallback option{{/choose}}';
        expect(template(options, {x: "foo"})).toBe("Option Foo");
        expect(template(options, {x: "bar"})).toBe("Option Bar");
        expect(template(options, {x: "baz"})).toBe("Fallback option");
    });

    it("should output choice using number map", function () {
        var choices = '\
            {{#choose x}}\
                {{#choice "zero other"}}Choice zero/other{{/choice}}\
                {{#choice "one"}}Choice one{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {x: 0})).toBe("Choice zero/other");
        expect(template(choices, {x: 1})).toBe("Choice one");
        expect(template(choices, {x: 2})).toBe("Choice zero/other");
        expect(template(choices, {x: 5})).toBe("Choice zero/other");
        expect(template(choices, {x: "zero"})).toBe("Choice zero/other");
        expect(template(choices, {x: "other"})).toBe("Choice zero/other");
        expect(template(choices, {x: "one"})).toBe("Choice one");
        expect(template(choices, {x: "two"})).toBe("");
    });

    it("should output choice using supplied function", function () {
        var fn = function (x, params) {
            if (arguments.length === 1 && typeof x === "object") {
                params = x;
                x = params.x;
            }
            return x < 10 ? "a" : "b";
        };
        var choices = '\
            {{#choose fn x=x}}\
                {{#choice "a"}}Choice a{{/choice}}\
                {{#choice "b"}}Choice b{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {fn: fn, x: 1})).toBe("Choice a");
        expect(template(choices, {fn: fn, x: 10})).toBe("Choice b");
        choices = '\
            {{#choose x function=fn}}\
                {{#choice "a"}}Choice a{{/choice}}\
                {{#choice "b"}}Choice b{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {fn: fn, x: 1})).toBe("Choice a");
        expect(template(choices, {fn: fn, x: 10})).toBe("Choice b");
        choices = '\
            {{#choose x=x function=fn}}\
                {{#choice "a"}}Choice a{{/choice}}\
                {{#choice "b"}}Choice b{{/choice}}\
            {{/choose}}\
        ';
        expect(template(choices, {fn: fn, x: 1})).toBe("Choice a");
        expect(template(choices, {fn: fn, x: 10})).toBe("Choice b");
    });
});

log.info("Described tests");

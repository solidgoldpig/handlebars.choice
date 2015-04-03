# handlebars.choice

    {{#choose x}}
        {{#choice "a"}} A {{/choice}}
        {{#choice "b"}} B {{/choice}}
    {{/choose}}

Content selection helpers providing pluralisation/inflection for [Handlebars](http://handlebarsjs.com)

### Version

1.0.0

### Installation

    npm install handlebars.choice

### Registering the helpers

    var Handlebars = require("handlebars");
    var Choice = require("handlebars.choice");
    Choice.registerHelpers(Handlebars);

### Using the helpers

Strings are treated as straight keywords

    {{#choose x}}
        {{#choice "a"}} A {{/choice}}
        {{#choice "b"}} B {{/choice}}
    {{/choose}
    
    Context
    {x: "a"}           → « A »
    {x: "b"}           → « B »
    {x: "c"}           → « »

All matched choices are output - choices can have multiple keywords

    {{#choose x}}
        {{#choice "a c"}} AC {{/choice}}
        {{#choice "b c"}} BC {{/choice}}
        {{#choice "a d"}} AD {{/choice}}
    {{/choose}
    
    Context
    {x: "a"}           → « AC AD »
    {x: "b"}           → « BC »
    {x: "c"}           → « AC BC »
    {x: "d"}           → « AD »

Numbers are processed as inflection keywords

    {{#choose x}}
        {{#choice "zero other"}} NON-SINGULAR {{/choice}}
        {{#choice "one"}} SINGULAR {{/choice}}
    {{/choose}
    
    Context
    {x: 0}             → « NON-SINGULAR »
    {x: 1}             → « SINGULAR »
    {x: 2}             → « NON-SINGULAR »

Booleans are processed as boolean keywords

    {{#choose x}}
        {{#choice "true"}} TRUE {{/choice}}
        {{#choice "false"}} FALSE {{/choice}}
    {{/choose}}
    
    Context
    {x: true}          → « TRUE »
    {x: false}         → « FALSE »

    
Alternative choosing functions can be passed

    var fn = function (input) {
        return input >= 10;
    };
    
    {{#choose x function=fn}}
        {{#choice "high"}} HIGH {{/choice}}
        {{#choice "low"}} LOW {{/choice}}
    {{/choose}}
    
    Context
    {x: 10}            → « HIGH »
    {x: 9}             → « LOW »

### Additional methods

#### Choice.locale

    Choice.locale([loc]);

Get (or set) Choice’s current locale

#### Choice.registerHelpers

    Choice.registerHelpers(handlebars);

Register Choice helpers with Handlebars

### Tests

To run the tests, cd to the handlebars.choice directory

    npm install && npm test

### Unlicense

handlebars.choice is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to http://unlicense.org
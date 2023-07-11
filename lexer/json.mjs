import * as chevrotain from "chevrotain";
// noinspection JSRemoveUnnecessaryParentheses
export default (function jsonExample() {
    // ----------------- Lexer -----------------
    const createToken = chevrotain.createToken;
    const Lexer = chevrotain.Lexer;

    // In ES6, custom inheritance implementation
    // (such as the one above) can be replaced
    // with a more simple: "class X extends Y"...
    const True = createToken({name: "True", pattern: /true/});
    const False = createToken({name: "False", pattern: /false/});
    const Null = createToken({name: "Null", pattern: /null/});
    const LCurly = createToken({name: "LCurly", pattern: /{/});
    const RCurly = createToken({name: "RCurly", pattern: /}/});
    const LSquare = createToken({name: "LSquare", pattern: /\[/});
    const RSquare = createToken({name: "RSquare", pattern: /]/});
    const Comma = createToken({name: "Comma", pattern: /,/});
    const Colon = createToken({name: "Colon", pattern: /:/});
    const StringLiteral = createToken({
        name: "StringLiteral", pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
    });
    const NumberLiteral = createToken({
        name: "NumberLiteral", pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
    });
    const WhiteSpace = createToken({
        name: "WhiteSpace", pattern: /\s+/,
        group: Lexer.SKIPPED
    });

    const jsonTokens = [WhiteSpace, NumberLiteral, StringLiteral, RCurly, LCurly,
        LSquare, RSquare, Comma, Colon, True, False, Null];

    const JsonLexer = new Lexer(jsonTokens);

    // Labels only affect error messages and Diagrams.
    LCurly.LABEL = "'{'";
    RCurly.LABEL = "'}'";
    LSquare.LABEL = "'['";
    RSquare.LABEL = "']'";
    Comma.LABEL = "','";
    Colon.LABEL = "':'";


    // ----------------- parser -----------------
    const EmbeddedActionsParser = chevrotain.EmbeddedActionsParser;

    class JsonParser extends EmbeddedActionsParser {
        constructor() {
            super(jsonTokens, {recoveryEnabled: true, outputCst: false})

            const $ = this;

            $.RULE("json", () => $.OR([
                {ALT: () => $.SUBRULE($.object)},
                {ALT: () => $.SUBRULE($.array)}
            ]));

            $.RULE("object", () => {
                // uncomment the debugger statement and open dev tools in chrome/firefox
                // to debug the parsing flow.
                // debugger;
                const obj = {};

                $.CONSUME(LCurly);
                $.MANY_SEP({
                    SEP: Comma, DEF: () => {
                        _.assign(obj, $.SUBRULE($.objectItem));
                    }
                });
                $.CONSUME(RCurly);

                return obj;
            });


            $.RULE("objectItem", () => {
                let lit, key, value;
                const obj = {};

                lit = $.CONSUME(StringLiteral)
                $.CONSUME(Colon);
                value = $.SUBRULE($.value);

                // an empty json key is not valid, use "BAD_KEY" instead
                key = lit.isInsertedInRecovery ?
                    "BAD_KEY" : lit.image.substr(1, lit.image.length - 2);
                obj[key] = value;
                return obj;
            });


            $.RULE("array", () => {
                const arr = [];
                $.CONSUME(LSquare);
                $.MANY_SEP({
                    SEP: Comma, DEF: () => {
                        arr.push($.SUBRULE($.value));
                    }
                });
                $.CONSUME(RSquare);

                return arr;
            });
            $.RULE("value", () => $.OR([
                {
                    ALT: () => {
                        const stringLiteral = $.CONSUME(StringLiteral).image;
                        // chop of the quotation marks
                        return stringLiteral.substr(1, stringLiteral.length - 2);
                    }
                },
                {ALT: () => Number($.CONSUME(NumberLiteral).image)},
                {ALT: () => $.SUBRULE($.object)},
                {ALT: () => $.SUBRULE($.array)},
                {
                    ALT: () => {
                        $.CONSUME(True);
                        return true;
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(False);
                        return false;
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(Null);
                        return null;
                    }
                }
            ]));

            // very important to call this after all the rules have been setup.
            // otherwise the parser may not work correctly as it will lack information
            // derived from the self analysis.
            this.performSelfAnalysis();
        }
    }

    // for the playground to work the returned object must contain these fields
    return {
        lexer: JsonLexer,
        parser: JsonParser,
        defaultRule: "json"
    };
}())
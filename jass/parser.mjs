import {CstParser, EOF} from "chevrotain";
import {JassLexer, JassTokenList, JassTokenMap} from "./lexer.mjs";
import ParseRule from "./parse-rule.mjs";

export class JassParser extends CstParser {
    errorlist = [];

    set inputText(text) {
        this.errorlist = [];
        this.input = JassLexer.tokenize(text).tokens;
    }

    constructor() {
        super(JassTokenList, {
            recoveryEnabled: true,
            errorMessageProvider: {
                buildMismatchTokenMessage: options => {
                    console.error('buildMismatchTokenMessage');
                    console.warn(options);
                    this.errorlist.push(options);
                    return null;
                },
                buildNotAllInputParsedMessage: options => {
                    console.error('buildNotAllInputParsedMessage');
                    console.log(options);
                    return null;
                },

                buildNoViableAltMessage: options => {
                    console.error('buildNoViableAltMessage');
                    console.log(options);
                    return null;
                },

                buildEarlyExitMessage: options => {
                    console.error('buildEarlyExitMessag');
                    console.log(options);
                    return null;
                },
            },
        })

        const $ = this;

        $.RULE(ParseRule.jass, () => {
            $.MANY(() => {
                $.SUBRULE($[ParseRule.rootstatement]);
            });
        });

        $.RULE(ParseRule.rootstatement, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.linecomment)},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.SUBRULE($[ParseRule.typedecl])},
                {ALT: () => $.SUBRULE($[ParseRule.nativedecl])},
            ]);
        });

        $.RULE(ParseRule.typedecl, () => {
            $.CONSUME(JassTokenMap.type);
            $.CONSUME(JassTokenMap.identifier);
            $.CONSUME(JassTokenMap.extends);
            $.CONSUME2(JassTokenMap.identifier);
            $.OPTION(() => $.CONSUME(JassTokenMap.linecomment))
            $.SUBRULE($[ParseRule.terminator]);
        });

        $.RULE(ParseRule.terminator, () => {
            $.OR([
                {ALT: () => $.CONSUME(EOF)},
                {ALT: () => $.CONSUME2(JassTokenMap.linebreak)}
            ]);
        });

        $.RULE(ParseRule.nativedecl, () => {
            $.OPTION(() => $.CONSUME(JassTokenMap.constant));
            $.CONSUME(JassTokenMap.native);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($[ParseRule.funcarglist]);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($[ParseRule.funcreturntype]);
            $.OPTION2(() => $.CONSUME(JassTokenMap.linecomment))
            $.SUBRULE($[ParseRule.terminator]);
        });

        $.RULE(ParseRule.funcarglist, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRule.funcarg])
                        $.MANY(() => {
                            $.CONSUME(JassTokenMap.comma)
                            $.SUBRULE2($[ParseRule.funcarg])
                        })
                    }
                },
            ]);
        });

        $.RULE(ParseRule.funcarg, () => {
            $.CONSUME(JassTokenMap.identifier)
            $.CONSUME2(JassTokenMap.identifier)
        });

        $.RULE(ParseRule.funcreturntype, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {ALT: () => $.CONSUME(JassTokenMap.identifier)},
            ])
        });

        this.performSelfAnalysis();
    }
}
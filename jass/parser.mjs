import {CstParser, EOF} from "chevrotain";
import {JassLexer, JassTokenList, JassTokenMap} from "./lexer.mjs";
import ParseRuleName from "./parse-rule-name.mjs";

/** @typedef {('MismatchToken')} JassParserErrorType */

export const JassParserErrorType = {
    MismatchToken: 'MismatchToken',
}

class JassParserError {
    /**
     * @param {JassParserErrorType} type
     * @param {import('chevrotain').IToken} token
     */
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
}

export class JassParser extends CstParser {
    /**@type {JassParserError[]} */
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
                    this.errorlist.push(new JassParserError(JassParserErrorType.MismatchToken, options.actual));
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

        $.RULE(ParseRuleName.jass, () => {
            $.MANY(() => {
                $.SUBRULE($[ParseRuleName.rootstatement]);
            });
        });

        $.RULE(ParseRuleName.rootstatement, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.linecomment)},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.SUBRULE($[ParseRuleName.typedecl])},
                {ALT: () => $.SUBRULE($[ParseRuleName.nativedecl])},
            ]);
        });

        $.RULE(ParseRuleName.typedecl, () => {
            $.CONSUME(JassTokenMap.type);
            $.CONSUME(JassTokenMap.identifier);
            $.CONSUME(JassTokenMap.extends);
            $.CONSUME2(JassTokenMap.identifier);
            $.OPTION(() => $.CONSUME(JassTokenMap.linecomment))
            $.SUBRULE($[ParseRuleName.terminator]);
        });

        $.RULE(ParseRuleName.terminator, () => {
            $.OR([
                {ALT: () => $.CONSUME(EOF)},
                {ALT: () => $.CONSUME2(JassTokenMap.linebreak)}
            ]);
        });

        $.RULE(ParseRuleName.nativedecl, () => {
            $.OPTION(() => $.CONSUME(JassTokenMap.constant));
            $.CONSUME(JassTokenMap.native);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($[ParseRuleName.funcarglist]);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($[ParseRuleName.funcreturntype]);
            $.OPTION2(() => $.CONSUME(JassTokenMap.linecomment))
            $.SUBRULE($[ParseRuleName.terminator]);
        });

        $.RULE(ParseRuleName.funcarglist, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRuleName.funcarg])
                        $.MANY(() => {
                            $.CONSUME(JassTokenMap.comma)
                            $.SUBRULE2($[ParseRuleName.funcarg])
                        })
                    }
                },
            ]);
        });

        $.RULE(ParseRuleName.funcarg, () => {
            $.CONSUME(JassTokenMap.identifier)
            $.CONSUME2(JassTokenMap.identifier)
        });

        $.RULE(ParseRuleName.funcreturntype, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {ALT: () => $.CONSUME(JassTokenMap.identifier)},
            ])
        });

        this.performSelfAnalysis();
    }
}
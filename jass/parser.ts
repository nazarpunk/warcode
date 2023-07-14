import {CstParser} from "chevrotain";
import {JassLexer, JassTokenList, JassTokenMap} from "./lexer";
import {IToken, ParserMethod, TokenType} from "@chevrotain/types";


interface JassParserMismatchToken {
    expected: TokenType;
    actual: IToken;
    previous: IToken;
    ruleName: string;
}

export class JassParserError<T> {
    constructor(options: T) {
        this.options = options;
    }

    options: T;
}


export class JassParser extends CstParser {

    declare jass: ParserMethod<any, any>;
    declare typedecl: ParserMethod<any, any>;
    declare nativedecl: ParserMethod<any, any>;
    declare statement: ParserMethod<any, any>;
    declare funcarg: ParserMethod<any, any>;
    declare funcarglist: ParserMethod<any, any>;
    declare funcreturntype: ParserMethod<any, any>;

    errorlist: JassParserError<JassParserMismatchToken>[] = [];

    set inputText(text: string) {
        this.errorlist = [];
        this.input = JassLexer.tokenize(text).tokens;
    }

    constructor() {
        super(JassTokenList, {
            recoveryEnabled: true,
            errorMessageProvider: {
                buildMismatchTokenMessage: options => {
                    this.errorlist.push(new JassParserError<JassParserMismatchToken>(options));
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

        $.RULE('jass', () => {
            $.MANY(() => {
                $.SUBRULE($.statement);
            });
        });

        $.RULE("statement", () => {
            $.OR([
                {ALT: () => $.SUBRULE($.typedecl)},
                {ALT: () => $.SUBRULE($.nativedecl)},
            ]);
        });

        $.RULE('typedecl', () => {
            $.CONSUME(JassTokenMap.type);
            $.CONSUME(JassTokenMap.identifier);
            $.CONSUME(JassTokenMap.extends);
            $.CONSUME2(JassTokenMap.identifier);
        });

        $.RULE('funcarg', () => {
            $.CONSUME(JassTokenMap.identifier)
            $.CONSUME2(JassTokenMap.identifier)
        });

        $.RULE('funcarglist', () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {
                    ALT: () => {
                        $.SUBRULE($.funcarg)
                        $.MANY(() => {
                            $.CONSUME(JassTokenMap.comma)
                            $.SUBRULE2($.funcarg)
                        })
                    }
                },
            ]);
        });

        $.RULE('funcreturntype', () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {ALT: () => $.CONSUME(JassTokenMap.identifier)},
            ])
        });

        $.RULE('nativedecl', () => {
            $.OPTION(() => $.CONSUME(JassTokenMap.constant));
            $.CONSUME(JassTokenMap.native);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($.funcarglist);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($.funcreturntype);
        });

        this.performSelfAnalysis();
    }
}
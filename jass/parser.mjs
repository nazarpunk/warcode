import {CstParser, EOF} from "chevrotain";
import {JassLexer, JassTokenList, JassTokenMap} from "./lexer.mjs";
import ParseRuleName from "./parse-rule-name.mjs";

/** @typedef {('MismatchToken'|'NoViableAlt')} JassParserErrorType */

export const JassParserErrorType = {
    MismatchToken: 'MismatchToken',
    NoViableAlt: 'NoViableAlt',
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
                    this.errorlist.push(new JassParserError(JassParserErrorType.NoViableAlt, options.previous));
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

        $.RULE(ParseRuleName.jass, () => $.MANY(() => $.SUBRULE($[ParseRuleName.rootstatement])));

        $.RULE(ParseRuleName.rootstatement, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.linecomment)},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.SUBRULE($[ParseRuleName.typedecl])},
                {ALT: () => $.SUBRULE($[ParseRuleName.nativedecl])},
                {ALT: () => $.SUBRULE($[ParseRuleName.funcdecl])},
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
                            $.CONSUME(JassTokenMap.comma);
                            $.SUBRULE2($[ParseRuleName.funcarg]);
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

        $.RULE(ParseRuleName.funcdecl, () => {
            $.CONSUME(JassTokenMap.function);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($[ParseRuleName.funcarglist]);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($[ParseRuleName.funcreturntype]);
            $.CONSUME5(JassTokenMap.linebreak);
            $.MANY1(() => $.SUBRULE($[ParseRuleName.localgroup]));
            $.MANY2(() => $.SUBRULE($[ParseRuleName.statement]));
            $.CONSUME8(JassTokenMap.endfunction);
            $.OPTION2(() => $.CONSUME(JassTokenMap.linecomment))
            $.SUBRULE($[ParseRuleName.terminator]);
        });

        $.RULE(ParseRuleName.localgroup, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.linecomment)},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.SUBRULE($[ParseRuleName.localdecl])},
            ]);
        });

        $.RULE(ParseRuleName.localdecl, () => {
            $.CONSUME(JassTokenMap.local)
            $.SUBRULE($[ParseRuleName.vardecl])
            $.CONSUME2(JassTokenMap.linebreak)
        });

        $.RULE(ParseRuleName.vardecl, () => {
            $.CONSUME(JassTokenMap.identifier)
            $.CONSUME2(JassTokenMap.identifier)
            $.OPTION(() => {
                $.CONSUME3(JassTokenMap.equals)
                $.SUBRULE($[ParseRuleName.expression])
            })
        });

        $.RULE(ParseRuleName.expression, () => {
            $.OR([{
                ALT: () => $.SUBRULE($[ParseRuleName.comparator])
            },])
        });

        $.RULE(ParseRuleName.comparator, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRuleName.addition]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokenMap.equalsequals)},
                                {ALT: () => $.CONSUME2(JassTokenMap.and)},
                                {ALT: () => $.CONSUME2(JassTokenMap.or)},
                                {ALT: () => $.CONSUME3(JassTokenMap.notequals)},
                            ]);
                            $.SUBRULE2($[ParseRuleName.addition]);
                        })
                    }
                },
            ])
        });

        $.RULE(ParseRuleName.addition, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRuleName.multiplication]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokenMap.add)},
                                {ALT: () => $.CONSUME3(JassTokenMap.sub)},
                            ]);
                            $.SUBRULE2($[ParseRuleName.multiplication]);
                        })
                    }
                },
            ])
        });

        $.RULE(ParseRuleName.multiplication, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRuleName.primary])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokenMap.mult)},
                                {ALT: () => $.CONSUME3(JassTokenMap.div)},
                            ]);
                            $.SUBRULE2($[ParseRuleName.primary])
                        })
                    }
                },
            ])
        });

        $.RULE(ParseRuleName.primary, () => {
            $.OR([
                {
                    ALT: () => {
                        $.OPTION(() => $.CONSUME(JassTokenMap.sub));
                        $.CONSUME(JassTokenMap.integer);
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokenMap.not);
                        $.SUBRULE($[ParseRuleName.primary]);
                    }
                },
                {
                    ALT: () => $.SUBRULE($[ParseRuleName.funccall])
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokenMap.lparen)
                        $.SUBRULE2($[ParseRuleName.expression])
                        $.CONSUME(JassTokenMap.rparen)
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME3(JassTokenMap.identifier)
                        $.OPTION3(() => $.SUBRULE($[ParseRuleName.arrayaccess]))
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokenMap.function)
                        $.CONSUME4(JassTokenMap.identifier)
                    }
                },
                {
                    ALT: () => {
                        $.OPTION2(() => $.CONSUME2(JassTokenMap.sub))
                        $.CONSUME3(JassTokenMap.real)
                    }
                },
                {
                    ALT: () => $.CONSUME3(JassTokenMap.idliteral)
                },
                {
                    ALT: () => $.CONSUME3(JassTokenMap.stringliteral)
                }
            ]);
        });

        $.RULE(ParseRuleName.arrayaccess, () => {
            $.CONSUME(JassTokenMap.lsquareparen);
            $.SUBRULE3($[ParseRuleName.expression]);
            $.CONSUME(JassTokenMap.rsquareparen);
        })

        $.RULE(ParseRuleName.funccall, () => {
            $.CONSUME(JassTokenMap.identifier);
            $.CONSUME2(JassTokenMap.lparen);
            $.OPTION(() => {
                $.SUBRULE4($[ParseRuleName.expression]);
                $.MANY(() => {
                    $.CONSUME(JassTokenMap.comma);
                    $.SUBRULE($[ParseRuleName.expression]);
                })
            })
            $.CONSUME3(JassTokenMap.rparen);
        });

        $.RULE(ParseRuleName.statement, () => {
            $.OR4([
                {ALT: () => $.CONSUME(JassTokenMap.linecomment)},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.SUBRULE($[ParseRuleName.callstatement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.setstatement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.loopstatement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.exitwhenstatement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.ifstatement])}
            ]);
        });

        $.RULE(ParseRuleName.callstatement, () => {
            $.CONSUME(JassTokenMap.call)
            $.SUBRULE($[ParseRuleName.funccall])
        });

        $.RULE(ParseRuleName.setstatement, () => {
            $.CONSUME(JassTokenMap.set)
            $.CONSUME(JassTokenMap.identifier)
            $.OPTION3(() => $.SUBRULE($[ParseRuleName.arrayaccess]))
            $.CONSUME(JassTokenMap.equals)
            $.SUBRULE($.expression)
        });

        $.RULE(ParseRuleName.loopstatement, () => {
            $.CONSUME(JassTokenMap.loop);
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]));
            $.CONSUME(JassTokenMap.endloop);
        });

        $.RULE(ParseRuleName.exitwhenstatement, () => {
            $.CONSUME(JassTokenMap.exitwhen);
            $.SUBRULE($[ParseRuleName.expression]);
        });

        $.RULE(ParseRuleName.ifstatement, () => {
            $.CONSUME(JassTokenMap.if)
            $.CONSUME(JassTokenMap.lparen)
            $.SUBRULE9($[ParseRuleName.expression])
            $.CONSUME(JassTokenMap.rparen)
            $.CONSUME(JassTokenMap.then)
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]))
            $.MANY2(() => $.SUBRULE($[ParseRuleName.optionalelseIf]))
            $.OPTION(() => $.SUBRULE($[ParseRuleName.optionalelse]))
            $.CONSUME(JassTokenMap.endif)
        });

        $.RULE(ParseRuleName.optionalelseIf, () => {
            $.CONSUME(JassTokenMap.elseif);
            $.CONSUME2(JassTokenMap.lparen)
            $.SUBRULE3($[ParseRuleName.expression])
            $.CONSUME3(JassTokenMap.rparen)
            $.CONSUME4(JassTokenMap.then)
            $.MANY4(() => $.SUBRULE($[ParseRuleName.statement]))
        });

        $.RULE(ParseRuleName.optionalelse, () => {
            $.CONSUME(JassTokenMap.else)
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]))
        });


        this.performSelfAnalysis();
    }
}
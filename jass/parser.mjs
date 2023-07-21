// noinspection DuplicatedCode

import {CstParser, EOF} from "chevrotain";
import ParseRuleName from "./parse-rule-name.mjs";
import JassLexer from "./lexer/jass-lexer.mjs";
import JassTokenMap from "./lexer/jass-token-map.mjs";
import JassTokenList from "./lexer/jass-token-list.mjs";

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

        //region jass
        $.RULE(ParseRuleName.jass, () => $.MANY(() => $.SUBRULE($[ParseRuleName.root])));
        //endregion

        //region root
        $.RULE(ParseRuleName.root, () => {
            $.OR([
                {ALT: () => $.SUBRULE($[ParseRuleName.type_declare])},
                {ALT: () => $.SUBRULE($[ParseRuleName.native_declare])},
                {ALT: () => $.SUBRULE($[ParseRuleName.function_declare])},
                {ALT: () => $.SUBRULE($[ParseRuleName.globals_declare])},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.CONSUME(JassTokenMap.comment)},
            ]);
        });
        //endregion

        //region type
        $.RULE(ParseRuleName.type_declare, () => {
            $.CONSUME(JassTokenMap.type);
            $.CONSUME(JassTokenMap.identifier);
            $.CONSUME(JassTokenMap.extends);
            $.CONSUME2(JassTokenMap.identifier);
            $.SUBRULE($[ParseRuleName.end]);
        });
        //endregion

        //region native
        $.RULE(ParseRuleName.native_declare, () => {
            $.OPTION(() => $.CONSUME(JassTokenMap.constant));
            $.CONSUME(JassTokenMap.native);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($[ParseRuleName.function_args]);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($[ParseRuleName.function_returns]);
            $.SUBRULE($[ParseRuleName.end]);
        });
        //endregion

        //region function
        $.RULE(ParseRuleName.function_declare, () => {
            $.CONSUME(JassTokenMap.function);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($[ParseRuleName.function_args]);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($[ParseRuleName.function_returns]);
            $.SUBRULE($[ParseRuleName.end]);
            $.MANY1(() => $.SUBRULE($[ParseRuleName.function_locals]));
            $.MANY2(() => $.SUBRULE($[ParseRuleName.statement]));
            $.CONSUME(JassTokenMap.endfunction);
            $.SUBRULE2($[ParseRuleName.end]);
        });
        //endregion

        //region variable
        $.RULE(ParseRuleName.variable_declare, () => {
            $.OPTION(() => $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.constant)},
                {ALT: () => $.CONSUME(JassTokenMap.local)},
            ]));
            $.SUBRULE($[ParseRuleName.typedname]);
            $.OPTION2(() => {
                $.CONSUME(JassTokenMap.assign)
                $.SUBRULE($[ParseRuleName.expression])
            });
            $.SUBRULE($[ParseRuleName.end]);
        });
        //endregion

        //region globals
        $.RULE(ParseRuleName.globals_declare, () => {
            $.CONSUME(JassTokenMap.globals);
            $.SUBRULE($[ParseRuleName.end]);
            $.MANY(() => $.OR([
                {ALT: () => $.SUBRULE($[ParseRuleName.variable_declare])},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.CONSUME(JassTokenMap.comment)},
            ]));
            $.CONSUME3(JassTokenMap.endglobals);
            $.SUBRULE2($[ParseRuleName.end]);
        });
        //endregion

        //region if
        $.RULE(ParseRuleName.if_statement, () => {
            $.CONSUME(JassTokenMap.if)
            $.SUBRULE($[ParseRuleName.expression])
            $.CONSUME(JassTokenMap.then)
            $.SUBRULE($[ParseRuleName.end]);
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]))
            $.MANY2(() => $.SUBRULE($[ParseRuleName.elseif_statement]))
            $.OPTION(() => $.SUBRULE($[ParseRuleName.else_statement]))
            $.CONSUME(JassTokenMap.endif)
            $.SUBRULE2($[ParseRuleName.end]);
        });
        //endregion

        //region elseif
        $.RULE(ParseRuleName.elseif_statement, () => {
            $.CONSUME(JassTokenMap.elseif);
            $.SUBRULE($[ParseRuleName.expression]);
            $.CONSUME(JassTokenMap.then);
            $.SUBRULE($[ParseRuleName.end]);
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]));
        });
        //endregion

        //region else
        $.RULE(ParseRuleName.else_statement, () => {
            $.CONSUME(JassTokenMap.else);
            $.SUBRULE($[ParseRuleName.end]);
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]));
        });
        //endregion

        //region args
        $.RULE(ParseRuleName.function_args, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRuleName.typedname])
                        $.MANY(() => {
                            $.CONSUME(JassTokenMap.comma);
                            $.SUBRULE2($[ParseRuleName.typedname]);
                        })
                    }
                },
            ]);
        });
        //endregion

        //region typedname
        $.RULE(ParseRuleName.typedname, () => {
            $.CONSUME(JassTokenMap.identifier)
            $.OPTION2(() => $.CONSUME(JassTokenMap.array));
            $.CONSUME2(JassTokenMap.identifier)
        });
        //endregion

        $.RULE(ParseRuleName.function_returns, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {ALT: () => $.CONSUME(JassTokenMap.identifier)},
            ]);
        });

        $.RULE(ParseRuleName.function_locals, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.comment)},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.SUBRULE($[ParseRuleName.variable_declare])},
            ]);
        });

        //region expression
        $.RULE(ParseRuleName.expression, () => $.OR([{
            ALT: () => $.SUBRULE($[ParseRuleName.comparator])
        },]));
        //endregion

        //region comparator
        $.RULE(ParseRuleName.comparator, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ParseRuleName.addition]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME(JassTokenMap.and)},
                                {ALT: () => $.CONSUME(JassTokenMap.or)},
                                {ALT: () => $.CONSUME(JassTokenMap.equals)},
                                {ALT: () => $.CONSUME(JassTokenMap.notequals)},
                                {ALT: () => $.CONSUME(JassTokenMap.less)},
                                {ALT: () => $.CONSUME(JassTokenMap.lessorequal)},
                                {ALT: () => $.CONSUME(JassTokenMap.great)},
                                {ALT: () => $.CONSUME(JassTokenMap.greatorequal)},
                            ]);
                            $.SUBRULE2($[ParseRuleName.addition]);
                        })
                    }
                },
            ])
        });
        //endregion

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
                    ALT: () => $.SUBRULE($[ParseRuleName.function_call])
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
                        $.OPTION3(() => $.CONSUME5(JassTokenMap.sub));
                        $.CONSUME3(JassTokenMap.identifier)
                        $.OPTION4(() => $.SUBRULE($[ParseRuleName.arrayaccess]))
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

        $.RULE(ParseRuleName.function_call, () => {
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

        //region statement
        $.RULE(ParseRuleName.statement, () => {
            $.OR4([
                {ALT: () => $.SUBRULE($[ParseRuleName.call_statement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.set_statement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.loop_statement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.exitwhen_statement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.if_statement])},
                {ALT: () => $.SUBRULE($[ParseRuleName.return_statement])},
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.CONSUME(JassTokenMap.comment)},
            ]);
        });
        //endregion

        //region call
        $.RULE(ParseRuleName.call_statement, () => {
            $.CONSUME(JassTokenMap.call)
            $.SUBRULE($[ParseRuleName.function_call])
            $.OPTION(() => $.CONSUME(JassTokenMap.comment));
            $.CONSUME2(JassTokenMap.linebreak);
        });
        //endregion

        //region return
        $.RULE(ParseRuleName.return_statement, () => {
            $.CONSUME(JassTokenMap.return);
            $.OPTION(() => $.SUBRULE($[ParseRuleName.expression]));
            $.OPTION2(() => $.CONSUME(JassTokenMap.comment));
            $.CONSUME2(JassTokenMap.linebreak);
        });
        //endregion

        //region set
        $.RULE(ParseRuleName.set_statement, () => {
            $.CONSUME(JassTokenMap.set)
            $.CONSUME(JassTokenMap.identifier)
            $.OPTION(() => $.SUBRULE($[ParseRuleName.arrayaccess]))
            $.CONSUME(JassTokenMap.assign)
            $.SUBRULE($[ParseRuleName.expression]);
            $.OPTION2(() => $.CONSUME(JassTokenMap.comment));
            $.CONSUME(JassTokenMap.linebreak);
        });
        //endregion

        //region loop
        $.RULE(ParseRuleName.loop_statement, () => {
            $.CONSUME(JassTokenMap.loop);
            $.SUBRULE($[ParseRuleName.end]);
            $.MANY(() => $.SUBRULE($[ParseRuleName.statement]));
            $.CONSUME(JassTokenMap.endloop);
            $.SUBRULE2($[ParseRuleName.end]);
        });
        //endregion

        //region exitwhen
        $.RULE(ParseRuleName.exitwhen_statement, () => {
            $.CONSUME(JassTokenMap.exitwhen);
            $.SUBRULE($[ParseRuleName.expression]);
        });
        //endregion

        //region end
        $.RULE(ParseRuleName.end, () => {
            $.OPTION(() => $.CONSUME(JassTokenMap.comment));
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.linebreak)},
                {ALT: () => $.CONSUME2(EOF)}
            ]);
        });
        //endregion

        this.performSelfAnalysis();
    }
}
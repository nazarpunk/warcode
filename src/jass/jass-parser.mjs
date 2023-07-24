// noinspection DuplicatedCode

import {CstParser, EOF} from "chevrotain";
import Rule from "./jass-parser-rule-name.mjs";
import JassLexer from "./lexer/jass-lexer.mjs";
import Token from "./lexer/jass-token-map.mjs";
import JassTokenList from "./lexer/jass-token-list.mjs";
import ParserError from "../utils/parser-error.mjs";
import ParserErrorType from "../utils/parser-error-type.mjs";

export class JassParser extends CstParser {
    /**@type {import('../utils/parser-error.mjs').default[]} */
    errorlist = [];

    set inputText(text) {
        this.errorlist = [];
        this.input = JassLexer.tokenize(text).tokens;
    }

    constructor(debug = false) {
        super(JassTokenList, {
            recoveryEnabled: true,
            errorMessageProvider: {
                buildMismatchTokenMessage: options => {
                    if (debug) console.error(options);
                    this.errorlist.push(new ParserError(ParserErrorType.MismatchToken, options.actual));
                    return null;
                },
                buildNotAllInputParsedMessage: options => {
                    console.error('buildNotAllInputParsedMessage');
                    console.log(options);
                    return null;
                },
                buildNoViableAltMessage: options => {
                    this.errorlist.push(new ParserError(ParserErrorType.NoViableAlt, options.previous));
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
        $.RULE(Rule.jass, () => $.MANY(() => $.SUBRULE($[Rule.root])));
        //endregion

        //region root
        $.RULE(Rule.root, () => {
            $.OR([
                {ALT: () => $.SUBRULE($[Rule.type_declare])},
                {ALT: () => $.SUBRULE($[Rule.native_declare])},
                {ALT: () => $.SUBRULE($[Rule.function_declare])},
                {ALT: () => $.SUBRULE($[Rule.globals_declare])},
                {ALT: () => $.CONSUME(Token.linebreak)},
                {ALT: () => $.CONSUME(Token.comment)},
            ]);
        });
        //endregion

        //region type
        $.RULE(Rule.type_declare, () => {
            $.CONSUME(Token.type);
            $.CONSUME(Token.identifier);
            $.CONSUME(Token.extends);
            $.CONSUME2(Token.identifier);
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region native
        $.RULE(Rule.native_declare, () => {
            $.OPTION(() => $.CONSUME(Token.constant));
            $.CONSUME(Token.native);
            $.CONSUME2(Token.identifier);
            $.CONSUME3(Token.takes);
            $.SUBRULE($[Rule.function_args]);
            $.CONSUME4(Token.returns);
            $.SUBRULE($[Rule.function_returns]);
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region function
        $.RULE(Rule.function_declare, () => {
            $.CONSUME(Token.function);
            $.CONSUME2(Token.identifier);
            $.CONSUME3(Token.takes);
            $.SUBRULE($[Rule.function_args]);
            $.CONSUME4(Token.returns);
            $.SUBRULE($[Rule.function_returns]);
            $.SUBRULE($[Rule.end]);
            $.MANY1(() => $.SUBRULE($[Rule.function_locals]));
            $.MANY2(() => $.SUBRULE($[Rule.statement]));
            $.CONSUME(Token.endfunction);
            $.SUBRULE2($[Rule.end]);
        });
        //endregion

        //region variable
        $.RULE(Rule.variable_declare, () => {
            $.OPTION(() => $.OR([
                {ALT: () => $.CONSUME(Token.constant)},
                {ALT: () => $.CONSUME(Token.local)},
            ]));
            $.SUBRULE($[Rule.typedname]);
            $.OPTION2(() => {
                $.CONSUME(Token.assign)
                $.SUBRULE($[Rule.expression])
            });
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region globals
        $.RULE(Rule.globals_declare, () => {
            $.CONSUME(Token.globals);
            $.SUBRULE($[Rule.end]);
            $.MANY(() => $.OR([
                {ALT: () => $.SUBRULE($[Rule.variable_declare])},
                {ALT: () => $.CONSUME(Token.linebreak)},
                {ALT: () => $.CONSUME(Token.comment)},
            ]));
            $.CONSUME3(Token.endglobals);
            $.SUBRULE2($[Rule.end]);
        });
        //endregion

        //region if
        $.RULE(Rule.if_statement, () => {
            $.CONSUME(Token.if)
            $.SUBRULE($[Rule.expression])
            $.CONSUME(Token.then)
            $.SUBRULE($[Rule.end]);
            $.MANY(() => $.SUBRULE($[Rule.statement]))
            $.MANY2(() => $.SUBRULE($[Rule.elseif_statement]))
            $.OPTION(() => $.SUBRULE($[Rule.else_statement]))
            $.CONSUME(Token.endif)
            $.SUBRULE2($[Rule.end]);
        });
        //endregion

        //region elseif
        $.RULE(Rule.elseif_statement, () => {
            $.CONSUME(Token.elseif);
            $.SUBRULE($[Rule.expression]);
            $.CONSUME(Token.then);
            $.SUBRULE($[Rule.end]);
            $.MANY(() => $.SUBRULE($[Rule.statement]));
        });
        //endregion

        //region else
        $.RULE(Rule.else_statement, () => {
            $.CONSUME(Token.else);
            $.SUBRULE($[Rule.end]);
            $.MANY(() => $.SUBRULE($[Rule.statement]));
        });
        //endregion

        //region call
        $.RULE(Rule.call_statement, () => {
            $.OPTION(() => $.CONSUME(Token.debug));
            $.CONSUME(Token.call)
            $.SUBRULE($[Rule.function_call])
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region return
        $.RULE(Rule.return_statement, () => {
            $.CONSUME(Token.return);
            $.OPTION(() => $.SUBRULE($[Rule.expression]));
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region set
        $.RULE(Rule.set_statement, () => {
            $.CONSUME(Token.set)
            $.CONSUME(Token.identifier)
            $.OPTION(() => $.SUBRULE($[Rule.arrayaccess]))
            $.CONSUME(Token.assign)
            $.SUBRULE($[Rule.expression]);
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region loop
        $.RULE(Rule.loop_statement, () => {
            $.CONSUME(Token.loop);
            $.SUBRULE($[Rule.end]);
            $.MANY(() => $.SUBRULE($[Rule.statement]));
            $.CONSUME(Token.endloop);
            $.SUBRULE2($[Rule.end]);
        });
        //endregion

        //region exitwhen
        $.RULE(Rule.exitwhen_statement, () => {
            $.CONSUME(Token.exitwhen);
            $.SUBRULE($[Rule.expression]);
            $.SUBRULE($[Rule.end]);
        });
        //endregion

        //region args
        $.RULE(Rule.function_args, () => {
            $.OR([
                {ALT: () => $.CONSUME(Token.nothing)},
                {
                    ALT: () => {
                        $.SUBRULE($[Rule.typedname])
                        $.MANY(() => {
                            $.CONSUME(Token.comma);
                            $.SUBRULE2($[Rule.typedname]);
                        })
                    }
                },
            ]);
        });
        //endregion

        //region typedname
        $.RULE(Rule.typedname, () => {
            $.CONSUME(Token.identifier)
            $.OPTION2(() => $.CONSUME(Token.array));
            $.CONSUME2(Token.identifier)
        });
        //endregion

        $.RULE(Rule.function_returns, () => {
            $.OR([
                {ALT: () => $.CONSUME(Token.nothing)},
                {ALT: () => $.CONSUME(Token.identifier)},
            ]);
        });

        $.RULE(Rule.function_locals, () => {
            $.OR([
                {ALT: () => $.CONSUME(Token.comment)},
                {ALT: () => $.CONSUME(Token.linebreak)},
                {ALT: () => $.SUBRULE($[Rule.variable_declare])},
            ]);
        });

        //region expression
        $.RULE(Rule.expression, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[Rule.addition]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME(Token.and)},
                                {ALT: () => $.CONSUME(Token.or)},
                                {ALT: () => $.CONSUME(Token.equals)},
                                {ALT: () => $.CONSUME(Token.notequals)},
                                {ALT: () => $.CONSUME(Token.less)},
                                {ALT: () => $.CONSUME(Token.lessorequal)},
                                {ALT: () => $.CONSUME(Token.great)},
                                {ALT: () => $.CONSUME(Token.greatorequal)},
                            ]);
                            $.SUBRULE2($[Rule.addition]);
                        })
                    }
                },
            ])
        });
        //endregion

        $.RULE(Rule.addition, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[Rule.multiplication]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(Token.add)},
                                {ALT: () => $.CONSUME3(Token.sub)},
                            ]);
                            $.SUBRULE2($[Rule.multiplication]);
                        })
                    }
                },
            ])
        });

        $.RULE(Rule.multiplication, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[Rule.primary])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(Token.mult)},
                                {ALT: () => $.CONSUME3(Token.div)},
                            ]);
                            $.SUBRULE2($[Rule.primary])
                        })
                    }
                },
            ])
        });

        //region primary
        $.RULE(Rule.primary, () => {
            $.OR([
                {
                    ALT: () => {
                        $.OPTION(() => $.CONSUME(Token.sub));
                        $.CONSUME(Token.integer);
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(Token.not);
                        $.SUBRULE($[Rule.primary]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION5(() => $.CONSUME3(Token.sub));
                        $.SUBRULE($[Rule.function_call]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION6(() => $.CONSUME6(Token.sub));
                        $.CONSUME(Token.lparen)
                        $.SUBRULE2($[Rule.expression])
                        $.CONSUME(Token.rparen)
                    }
                },
                {
                    ALT: () => {
                        $.OPTION3(() => $.CONSUME5(Token.sub));
                        $.CONSUME3(Token.identifier)
                        $.OPTION4(() => $.SUBRULE($[Rule.arrayaccess]))
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(Token.function)
                        $.CONSUME4(Token.identifier)
                    }
                },
                {
                    ALT: () => {
                        $.OPTION2(() => $.CONSUME2(Token.sub))
                        $.CONSUME3(Token.real)
                    }
                },
                {
                    ALT: () => $.CONSUME3(Token.idliteral)
                },
                {
                    ALT: () => $.CONSUME3(Token.stringliteral)
                }
            ]);
        });
        //endregion

        $.RULE(Rule.arrayaccess, () => {
            $.CONSUME(Token.lsquareparen);
            $.SUBRULE3($[Rule.expression]);
            $.CONSUME(Token.rsquareparen);
        })

        $.RULE(Rule.function_call, () => {
            $.CONSUME(Token.identifier);
            $.CONSUME2(Token.lparen);
            $.OPTION(() => {
                $.SUBRULE4($[Rule.expression]);
                $.MANY(() => {
                    $.CONSUME(Token.comma);
                    $.SUBRULE($[Rule.expression]);
                })
            })
            $.CONSUME3(Token.rparen);
        });

        //region statement
        $.RULE(Rule.statement, () => {
            $.OR4([
                {ALT: () => $.SUBRULE($[Rule.call_statement])},
                {ALT: () => $.SUBRULE($[Rule.set_statement])},
                {ALT: () => $.SUBRULE($[Rule.loop_statement])},
                {ALT: () => $.SUBRULE($[Rule.exitwhen_statement])},
                {ALT: () => $.SUBRULE($[Rule.if_statement])},
                {ALT: () => $.SUBRULE($[Rule.return_statement])},
                {ALT: () => $.CONSUME(Token.linebreak)},
                {ALT: () => $.CONSUME(Token.comment)},
            ]);
        });
        //endregion

        //region end
        $.RULE(Rule.end, () => {
            $.OPTION(() => $.CONSUME(Token.comment));
            $.OR([
                {ALT: () => $.CONSUME(Token.linebreak)},
                {ALT: () => $.CONSUME2(EOF)}
            ]);
        });
        //endregion

        this.performSelfAnalysis();
    }
}
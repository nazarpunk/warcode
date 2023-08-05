// noinspection DuplicatedCode

import {CstParser, ParserMethod} from 'chevrotain'
import ZincRule from './zinc-rule'
import ZincTokens from './zinc-tokens'
import ZincTokensList from './zinc-tokens-list'
import {IParserConfig} from '@chevrotain/types'

export default class ZincParser extends CstParser {
    declare [ZincRule.zinc]: ParserMethod<any, any>
    declare [ZincRule.library_declare]: ParserMethod<any, any>
    declare [ZincRule.library_requires]: ParserMethod<any, any>
    declare [ZincRule.library_root]: ParserMethod<any, any>
    declare [ZincRule.library_constant]: ParserMethod<any, any>
    declare [ZincRule.access_scope]: ParserMethod<any, any>
    declare [ZincRule.function_declare]: ParserMethod<any, any>
    declare [ZincRule.function_arg]: ParserMethod<any, any>
    declare [ZincRule.statement]: ParserMethod<any, any>
    declare [ZincRule.expression]: ParserMethod<any, any>
    declare [ZincRule.variable_declare]: ParserMethod<any, any>
    declare [ZincRule.variable_set]: ParserMethod<any, any>
    declare [ZincRule.else_statement]: ParserMethod<any, any>
    declare [ZincRule.while_statement]: ParserMethod<any, any>
    declare [ZincRule.function_call]: ParserMethod<any, any>
    declare [ZincRule.arrayaccess]: ParserMethod<any, any>
    declare [ZincRule.addition]: ParserMethod<any, any>
    declare [ZincRule.multiplication]: ParserMethod<any, any>
    declare [ZincRule.primary]: ParserMethod<any, any>
    declare [ZincRule.primary_div]: ParserMethod<any, any>
    declare [ZincRule.set_statement]: ParserMethod<any, any>
    declare [ZincRule.for_statement]: ParserMethod<any, any>
    declare [ZincRule.if_statement]: ParserMethod<any, any>
    declare [ZincRule.return_statement]: ParserMethod<any, any>

    constructor(config?: IParserConfig) {
        super(ZincTokensList, config)

        const $ = this

        //region jass
        $.RULE(ZincRule.zinc, () => $.MANY(() => $.SUBRULE($[ZincRule.library_declare])))
        //endregion

        //region library_declare
        $.RULE(ZincRule.library_declare, () => {
            $.CONSUME(ZincTokens[ZincRule.library])
            $.CONSUME(ZincTokens[ZincRule.identifier])
            $.OPTION(() => {
                $.CONSUME(ZincTokens[ZincRule.requires])
                $.AT_LEAST_ONE_SEP({
                    SEP: ZincTokens[ZincRule.comma],
                    DEF: () => $.SUBRULE($[ZincRule.library_requires])
                })
            })
            $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
            $.MANY(() => $.SUBRULE($[ZincRule.library_root]))
            $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
        })
        //endregion

        //region library_requires
        $.RULE(ZincRule.library_requires, () => {
            $.OPTION(() => $.CONSUME(ZincTokens[ZincRule.optional]))
            $.CONSUME(ZincTokens[ZincRule.identifier])
        })
        //endregion

        //region library_root
        $.RULE(ZincRule.library_root, () => {
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.library_constant])},
                {ALT: () => $.SUBRULE($[ZincRule.access_scope])}
            ])
        })
        //endregion

        //region zinc_constant
        $.RULE(ZincRule.library_constant, () => {
            $.OPTION(() => $.CONSUME(ZincTokens[ZincRule.constant]))
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.function_declare])},
                {ALT: () => $.SUBRULE($[ZincRule.variable_declare])},
            ])
        })
        //endregion

        $.RULE(ZincRule.access_scope, () => {
            $.OR([
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.public])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.private])},
            ])
            $.OR1([
                {
                    ALT: () => $.SUBRULE($[ZincRule.library_root])
                },
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
                        $.MANY(() => $.SUBRULE2($[ZincRule.library_root]))
                        $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
                    }
                }
            ])
        })

        //region variable_declare
        $.RULE(ZincRule.variable_declare, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier])
            $.AT_LEAST_ONE_SEP({
                SEP: ZincTokens[ZincRule.comma],
                DEF: () => $.SUBRULE($[ZincRule.variable_set])
            })
            $.CONSUME(ZincTokens[ZincRule.semicolon])
        })
        //endregion

        //region variable_set
        $.RULE(ZincRule.variable_set, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier])
            $.OPTION(() => $.SUBRULE($[ZincRule.arrayaccess]))
            $.OPTION1(() => {
                $.CONSUME(ZincTokens[ZincRule.assign])
                $.SUBRULE($[ZincRule.expression])
            })
        })
        //endregion

        //region function_declare
        $.RULE(ZincRule.function_declare, () => {
            $.CONSUME(ZincTokens[ZincRule.function])
            $.OPTION(() => $.CONSUME2(ZincTokens[ZincRule.identifier], {LABEL: ZincRule.identifier_name}))
            $.CONSUME(ZincTokens[ZincRule.lparen])
            $.MANY_SEP({
                SEP: ZincTokens[ZincRule.comma],
                DEF: () => $.SUBRULE2($[ZincRule.function_arg])
            })
            $.CONSUME(ZincTokens[ZincRule.rparen])
            $.OPTION1(() => {
                $.CONSUME(ZincTokens[ZincRule.returns])
                $.CONSUME(ZincTokens[ZincRule.identifier], {LABEL: ZincRule.identifier_returns})
            })
            $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
            $.MANY(() => $.SUBRULE($[ZincRule.variable_declare]))
            $.MANY1(() => $.SUBRULE($[ZincRule.statement]))
            $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
        })
        //endregion

        //region function_args
        $.RULE(ZincRule.function_arg, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier], {LABEL: ZincRule.identifier_type})
            $.CONSUME2(ZincTokens[ZincRule.identifier], {LABEL: ZincRule.identifier_name})
        })
        //endregion

        //region if_statement
        $.RULE(ZincRule.if_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.if])
            $.CONSUME(ZincTokens[ZincRule.lparen])
            $.SUBRULE($[ZincRule.expression])
            $.CONSUME(ZincTokens[ZincRule.rparen])
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.statement])},
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
                        $.MANY(() => $.SUBRULE1($[ZincRule.statement]))
                        $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
                    }
                }
            ])
            $.OPTION(() => $.SUBRULE($[ZincRule.else_statement]))
        })
        //endregion

        //region else_statement
        $.RULE(ZincRule.else_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.else])
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.statement])},
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
                        $.MANY(() => $.SUBRULE1($[ZincRule.statement]))
                        $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
                    }
                }
            ])
        })
        //endregion

        //region while_statement
        $.RULE(ZincRule.while_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.while])
            $.CONSUME(ZincTokens[ZincRule.lparen])
            $.SUBRULE($[ZincRule.expression])
            $.CONSUME(ZincTokens[ZincRule.rparen])
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.statement])},
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
                        $.MANY(() => $.SUBRULE1($[ZincRule.statement]))
                        $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
                    }
                }
            ])
        })
        //endregion

        //region return
        $.RULE(ZincRule.return_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.return])
            $.OPTION(() => $.SUBRULE($[ZincRule.expression]))
            $.CONSUME(ZincTokens[ZincRule.semicolon])
        })
        //endregion

        //region set_statement
        $.RULE(ZincRule.set_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier])
            $.OPTION(() => $.SUBRULE($[ZincRule.arrayaccess]))
            $.OR([
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.assign])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.add_assign])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.sub_assign])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.mult_assign])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.div_assign])}
            ])
            $.SUBRULE($[ZincRule.expression])
            $.CONSUME(ZincTokens[ZincRule.semicolon])
        })
        //endregion

        //region for_statement
        $.RULE(ZincRule.for_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.for])
            $.CONSUME(ZincTokens[ZincRule.lparen])
            $.SUBRULE($[ZincRule.addition])
            $.OR([
                {
                    ALT: () => {
                        $.OR1([
                            {ALT: () => $.CONSUME(ZincTokens[ZincRule.less])},
                            {ALT: () => $.CONSUME(ZincTokens[ZincRule.lessorequal])},
                        ])
                        $.CONSUME(ZincTokens[ZincRule.identifier])
                        $.OR2([
                            {ALT: () => $.CONSUME1(ZincTokens[ZincRule.less])},
                            {ALT: () => $.CONSUME1(ZincTokens[ZincRule.lessorequal])},
                        ])
                    },
                },
                {
                    ALT: () => {
                        $.OR3([
                            {ALT: () => $.CONSUME(ZincTokens[ZincRule.great])},
                            {ALT: () => $.CONSUME(ZincTokens[ZincRule.greatorequal])},
                        ])
                        $.CONSUME1(ZincTokens[ZincRule.identifier])
                        $.OR4([
                            {ALT: () => $.CONSUME1(ZincTokens[ZincRule.great])},
                            {ALT: () => $.CONSUME1(ZincTokens[ZincRule.greatorequal])},
                        ])
                    },
                }
            ])
            $.SUBRULE1($[ZincRule.addition])
            $.CONSUME(ZincTokens[ZincRule.rparen])
            $.OR5([
                {ALT: () => $.SUBRULE($[ZincRule.statement])},
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.lcurlyparen])
                        $.MANY(() => $.SUBRULE1($[ZincRule.statement]))
                        $.CONSUME(ZincTokens[ZincRule.rcurlyparen])
                    }
                }
            ])
        })
        //endregion

        //region statement
        $.RULE(ZincRule.statement, () => {
            $.OR4([
                {ALT: () => $.SUBRULE($[ZincRule.set_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.for_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.if_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.return_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.while_statement])},
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.function_call])
                        $.CONSUME(ZincTokens[ZincRule.semicolon])
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.break])
                        $.CONSUME1(ZincTokens[ZincRule.semicolon])
                    }
                },
            ])
        })
        //endregion

        //region function_call
        $.RULE(ZincRule.function_call, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier])
            $.CONSUME2(ZincTokens[ZincRule.lparen])
            $.MANY_SEP({
                SEP: ZincTokens[ZincRule.comma],
                DEF: () => $.OR([
                    {ALT: () => $.SUBRULE($[ZincRule.function_declare])},
                    {ALT: () => $.SUBRULE($[ZincRule.expression])}
                ])
            })
            $.CONSUME3(ZincTokens[ZincRule.rparen])
        })
        //endregion

        //region arrayaccess
        $.RULE(ZincRule.arrayaccess, () => {
            $.CONSUME(ZincTokens[ZincRule.lsquareparen])
            $.OPTION(() => $.SUBRULE($[ZincRule.addition]))
            $.CONSUME(ZincTokens[ZincRule.rsquareparen])
            $.OPTION1(() => {
                $.CONSUME1(ZincTokens[ZincRule.lsquareparen])
                $.OPTION2(() => $.SUBRULE1($[ZincRule.addition]))
                $.CONSUME1(ZincTokens[ZincRule.rsquareparen])
            })
        })
        //endregion

        //region expression
        $.RULE(ZincRule.expression, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.addition])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.and])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.or])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.equals])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.notequals])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.less])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.lessorequal])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.great])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.greatorequal])},
                            ])
                            $.SUBRULE2($[ZincRule.addition])
                        })
                    }
                },
            ])
        })
        //endregion

        $.RULE(ZincRule.addition, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.multiplication])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(ZincTokens[ZincRule.add])},
                                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.sub])},
                            ])
                            $.SUBRULE2($[ZincRule.multiplication])
                        })
                    }
                },
            ])
        })

        $.RULE(ZincRule.multiplication, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.primary])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(ZincTokens[ZincRule.mult])},
                                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.div])},
                            ])
                            $.SUBRULE2($[ZincRule.primary])
                        })
                    }
                },
            ])
        })

        //region primary
        $.RULE(ZincRule.primary, () => {
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.primary_div])},
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.not])
                        $.SUBRULE($[ZincRule.primary])
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.function])
                        $.CONSUME4(ZincTokens[ZincRule.identifier])
                    }
                },
                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.stringliteral])},
                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.null])},
                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.true])},
                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.false])},
            ])
        })
        //endregion

        $.RULE(ZincRule.primary_div, () => {
            $.OPTION(() => $.CONSUME(ZincTokens[ZincRule.sub]))
            $.OR([
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.integer])},
                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.real])},
                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.rawcode])},
                {ALT: () => $.SUBRULE($[ZincRule.function_call])},
                {
                    ALT: () => {
                        $.CONSUME3(ZincTokens[ZincRule.identifier])
                        $.OPTION4(() => $.SUBRULE($[ZincRule.arrayaccess]))
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.lparen])
                        $.SUBRULE2($[ZincRule.expression])
                        $.CONSUME(ZincTokens[ZincRule.rparen])
                    }
                },
            ])

        })

        this.performSelfAnalysis()
    }
}

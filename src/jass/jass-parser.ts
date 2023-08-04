// noinspection DuplicatedCode

import {CstParser, EOF, ParserMethod} from 'chevrotain'
import JassRule from './jass-rule'
import JassTokens from './jass-tokens'
import JassTokensList from './jass-tokens-list'
import {IParserConfig} from '@chevrotain/types'

export default class JassParser extends CstParser {
    declare [JassRule.jass]: ParserMethod<any, any>
    declare [JassRule.type_declare]: ParserMethod<any, any>
    declare [JassRule.jass_constant]: ParserMethod<any, any>
    declare [JassRule.function_head]: ParserMethod<any, any>
    declare [JassRule.native_declare]: ParserMethod<any, any>
    declare [JassRule.function_declare]: ParserMethod<any, any>
    declare [JassRule.function_arg]: ParserMethod<any, any>
    declare [JassRule.globals_declare]: ParserMethod<any, any>
    declare [JassRule.end]: ParserMethod<any, any>
    declare [JassRule.statement]: ParserMethod<any, any>
    declare [JassRule.expression]: ParserMethod<any, any>
    declare [JassRule.variable_declare]: ParserMethod<any, any>
    declare [JassRule.elseif_statement]: ParserMethod<any, any>
    declare [JassRule.else_statement]: ParserMethod<any, any>
    declare [JassRule.function_call]: ParserMethod<any, any>
    declare [JassRule.arrayaccess]: ParserMethod<any, any>
    declare [JassRule.addition]: ParserMethod<any, any>
    declare [JassRule.multiplication]: ParserMethod<any, any>
    declare [JassRule.primary]: ParserMethod<any, any>
    declare [JassRule.call_statement]: ParserMethod<any, any>
    declare [JassRule.set_statement]: ParserMethod<any, any>
    declare [JassRule.loop_statement]: ParserMethod<any, any>
    declare [JassRule.exitwhen_statement]: ParserMethod<any, any>
    declare [JassRule.if_statement]: ParserMethod<any, any>
    declare [JassRule.return_statement]: ParserMethod<any, any>

    constructor(config?: IParserConfig) {
        super(JassTokensList, config)

        const $ = this

        //region jass
        $.RULE(JassRule.jass, () => $.MANY(() => $.OR([
            {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
            {ALT: () => $.SUBRULE($[JassRule.jass_constant])},
            {ALT: () => $.SUBRULE($[JassRule.globals_declare])},
            {ALT: () => $.SUBRULE($[JassRule.type_declare])},
        ])))
        //endregion

        //region jass_constant
        $.RULE(JassRule.jass_constant, () => {
            $.OPTION(() => $.CONSUME(JassTokens[JassRule.constant]))
            $.OR([
                {ALT: () => $.SUBRULE($[JassRule.function_declare])},
                {ALT: () => $.SUBRULE($[JassRule.native_declare])},
            ])
        })
        //endregion

        //region native_declare
        $.RULE(JassRule.native_declare, () => {
            $.CONSUME(JassTokens[JassRule.native])
            $.SUBRULE($[JassRule.function_head])
        })
        //endregion

        //region function_declare
        $.RULE(JassRule.function_declare, () => {
            $.CONSUME(JassTokens[JassRule.function])
            $.SUBRULE($[JassRule.function_head])
            //$.MANY1(() => $.SUBRULE($[JassRule.local_declare]))
            $.MANY(() => $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
                {
                    ALT: () => {
                        $.CONSUME(JassTokens[JassRule.local])
                        $.SUBRULE($[JassRule.variable_declare])
                    }
                },
            ]))
            $.MANY1(() => $.SUBRULE($[JassRule.statement]))
            $.CONSUME(JassTokens[JassRule.endfunction])
            $.SUBRULE2($[JassRule.end])
        })
        //endregion

        //region function_head
        $.RULE(JassRule.function_head, () => {
            $.CONSUME(JassTokens[JassRule.identifier], {LABEL: JassRule.identifier_name})
            $.CONSUME(JassTokens[JassRule.takes])
            $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.nothing], {LABEL: JassRule.takes_nothing})},
                {
                    ALT: () => {
                        $.AT_LEAST_ONE_SEP({
                            SEP: JassTokens[JassRule.comma],
                            DEF: () => $.SUBRULE($[JassRule.function_arg])
                        })
                    }
                },
            ])
            $.CONSUME(JassTokens[JassRule.returns])
            $.OR1([
                {ALT: () => $.CONSUME1(JassTokens[JassRule.nothing], {LABEL: JassRule.returns_nothing})},
                {ALT: () => $.CONSUME1(JassTokens[JassRule.identifier], {LABEL: JassRule.identifier_returns})},
            ])
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region function_args
        $.RULE(JassRule.function_arg, () => {
            $.CONSUME(JassTokens[JassRule.identifier], {LABEL: JassRule.identifier_type})
            $.CONSUME2(JassTokens[JassRule.identifier], {LABEL: JassRule.identifier_name})
        })
        //endregion

        //region variable_declare
        $.RULE(JassRule.variable_declare, () => {
            $.CONSUME(JassTokens[JassRule.identifier], {LABEL: JassRule.identifier_type})
            $.OPTION(() => $.CONSUME(JassTokens[JassRule.array]))
            $.CONSUME2(JassTokens[JassRule.identifier], {LABEL: JassRule.identifier_name})
            $.OPTION1(() => {
                $.CONSUME(JassTokens[JassRule.assign])
                $.SUBRULE($[JassRule.expression])
            })
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region type_declare
        $.RULE(JassRule.type_declare, () => {
            $.CONSUME(JassTokens[JassRule.type])
            $.CONSUME(JassTokens[JassRule.identifier],{LABEL: JassRule.identifier_name})
            $.CONSUME(JassTokens[JassRule.extends])
            $.CONSUME2(JassTokens[JassRule.identifier],{LABEL: JassRule.identifier_base})
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region globals_declare
        $.RULE(JassRule.globals_declare, () => {
            $.CONSUME(JassTokens[JassRule.globals])
            $.SUBRULE($[JassRule.end])
            $.MANY(() => $.OR([
                {
                    ALT: () => {
                        $.OPTION(() => $.CONSUME(JassTokens[JassRule.constant]))
                        $.SUBRULE($[JassRule.variable_declare])
                    }
                },
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
            ]))
            $.CONSUME3(JassTokens[JassRule.endglobals])
            $.SUBRULE2($[JassRule.end])
        })
        //endregion

        //region if_statement
        $.RULE(JassRule.if_statement, () => {
            $.CONSUME(JassTokens[JassRule.if])
            $.SUBRULE($[JassRule.expression])
            $.CONSUME(JassTokens[JassRule.then])
            $.SUBRULE($[JassRule.end])
            $.MANY(() => $.SUBRULE($[JassRule.statement]))
            $.MANY2(() => $.SUBRULE($[JassRule.elseif_statement]))
            $.OPTION(() => $.SUBRULE($[JassRule.else_statement]))
            $.CONSUME(JassTokens[JassRule.endif])
            $.SUBRULE2($[JassRule.end])
        })
        //endregion

        //region elseif_statement
        $.RULE(JassRule.elseif_statement, () => {
            $.CONSUME(JassTokens[JassRule.elseif])
            $.SUBRULE($[JassRule.expression])
            $.CONSUME(JassTokens[JassRule.then])
            $.SUBRULE($[JassRule.end])
            $.MANY(() => $.SUBRULE($[JassRule.statement]))
        })
        //endregion

        //region else_statement
        $.RULE(JassRule.else_statement, () => {
            $.CONSUME(JassTokens[JassRule.else])
            $.SUBRULE($[JassRule.end])
            $.MANY(() => $.SUBRULE($[JassRule.statement]))
        })
        //endregion

        //region call_statement
        $.RULE(JassRule.call_statement, () => {
            $.OPTION(() => $.CONSUME(JassTokens[JassRule.debug]))
            $.CONSUME(JassTokens[JassRule.call])
            $.SUBRULE($[JassRule.function_call])
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region return_statement
        $.RULE(JassRule.return_statement, () => {
            $.CONSUME(JassTokens[JassRule.return])
            $.OPTION(() => $.SUBRULE($[JassRule.expression]))
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region set_statement
        $.RULE(JassRule.set_statement, () => {
            $.CONSUME(JassTokens[JassRule.set])
            $.CONSUME(JassTokens[JassRule.identifier])
            $.OPTION(() => $.SUBRULE($[JassRule.arrayaccess]))
            $.CONSUME(JassTokens[JassRule.assign])
            $.SUBRULE($[JassRule.expression])
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region loop_statement
        $.RULE(JassRule.loop_statement, () => {
            $.CONSUME(JassTokens[JassRule.loop])
            $.SUBRULE($[JassRule.end])
            $.MANY(() => $.SUBRULE($[JassRule.statement]))
            $.CONSUME(JassTokens[JassRule.endloop])
            $.SUBRULE2($[JassRule.end])
        })
        //endregion

        //region exitwhen_statement
        $.RULE(JassRule.exitwhen_statement, () => {
            $.CONSUME(JassTokens[JassRule.exitwhen])
            $.SUBRULE($[JassRule.expression])
            $.SUBRULE($[JassRule.end])
        })
        //endregion

        //region arrayaccess
        $.RULE(JassRule.arrayaccess, () => {
            $.CONSUME(JassTokens[JassRule.lsquareparen])
            $.SUBRULE($[JassRule.expression])
            $.CONSUME(JassTokens[JassRule.rsquareparen])
        })
        //endregion

        //region function_call
        $.RULE(JassRule.function_call, () => {
            $.CONSUME(JassTokens[JassRule.identifier])
            $.CONSUME2(JassTokens[JassRule.lparen])
            $.MANY_SEP({
                SEP: JassTokens[JassRule.comma],
                DEF: () => $.SUBRULE($[JassRule.expression])
            })
            $.CONSUME3(JassTokens[JassRule.rparen])
        })
        //endregion

        //region statement
        $.RULE(JassRule.statement, () => {
            $.OR4([
                {ALT: () => $.SUBRULE($[JassRule.call_statement])},
                {ALT: () => $.SUBRULE($[JassRule.set_statement])},
                {ALT: () => $.SUBRULE($[JassRule.loop_statement])},
                {ALT: () => $.SUBRULE($[JassRule.exitwhen_statement])},
                {ALT: () => $.SUBRULE($[JassRule.if_statement])},
                {ALT: () => $.SUBRULE($[JassRule.return_statement])},
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
            ])
        })
        //endregion

        //region expression
        $.RULE(JassRule.expression, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[JassRule.addition])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME(JassTokens[JassRule.and])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.or])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.equals])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.notequals])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.less])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.lessorequal])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.great])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.greatorequal])},
                            ])
                            $.SUBRULE2($[JassRule.addition])
                        })
                    }
                },
            ])
        })
        //endregion

        //region addition
        $.RULE(JassRule.addition, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[JassRule.multiplication])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokens[JassRule.add])},
                                {ALT: () => $.CONSUME3(JassTokens[JassRule.sub])},
                            ])
                            $.SUBRULE2($[JassRule.multiplication])
                        })
                    }
                },
            ])
        })
        //endregion

        //region multiplication
        $.RULE(JassRule.multiplication, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[JassRule.primary])
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokens[JassRule.mult])},
                                {ALT: () => $.CONSUME3(JassTokens[JassRule.div])},
                            ])
                            $.SUBRULE2($[JassRule.primary])
                        })
                    }
                },
            ])
        })
        //endregion

        //region primary
        $.RULE(JassRule.primary, () => {
            $.OR([
                {
                    ALT: () => {
                        $.OPTION(() => $.CONSUME(JassTokens[JassRule.sub]))
                        $.CONSUME(JassTokens[JassRule.integer])
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokens[JassRule.not])
                        $.SUBRULE($[JassRule.primary])
                    }
                },
                {
                    ALT: () => {
                        $.OPTION5(() => $.CONSUME3(JassTokens[JassRule.sub]))
                        $.SUBRULE($[JassRule.function_call])
                    }
                },
                {
                    ALT: () => {
                        $.OPTION6(() => $.CONSUME6(JassTokens[JassRule.sub]))
                        $.CONSUME(JassTokens[JassRule.lparen])
                        $.SUBRULE2($[JassRule.expression])
                        $.CONSUME(JassTokens[JassRule.rparen])
                    }
                },
                {
                    ALT: () => {
                        $.OPTION3(() => $.CONSUME5(JassTokens[JassRule.sub]))
                        $.CONSUME3(JassTokens[JassRule.identifier])
                        $.OPTION4(() => $.SUBRULE($[JassRule.arrayaccess]))
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokens[JassRule.function])
                        $.CONSUME4(JassTokens[JassRule.identifier])
                    }
                },
                {
                    ALT: () => {
                        $.OPTION2(() => $.CONSUME2(JassTokens[JassRule.sub]))
                        $.CONSUME3(JassTokens[JassRule.real])
                    }
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.idliteral])
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.stringliteral])
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.null])
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.true])
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.false])
                },
            ])
        })
        //endregion

        //region end
        $.RULE(JassRule.end, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
                {ALT: () => $.CONSUME2(EOF)}
            ])
        })
        //endregion

        this.performSelfAnalysis()
    }
}

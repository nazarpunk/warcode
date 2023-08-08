import {CstParser, ParserMethod} from 'chevrotain'
import WtsRule from './wts-rule'
import WtsTokens from './wts-tokens'
import WtsTokensList from './wts-tokens-list'
import {IParserConfig} from '@chevrotain/types'

export default class WtsParser extends CstParser {

    declare [WtsRule.wts]: ParserMethod<any, any>
    declare [WtsRule.block]: ParserMethod<any, any>

    constructor(config?: IParserConfig) {
        super(WtsTokensList, config)

        const $ = this

        $.RULE(WtsRule.wts, () => $.MANY(() => $.SUBRULE($[WtsRule.block])))

        $.RULE(WtsRule.block, () => {
            $.CONSUME(WtsTokens[WtsRule.string])
            $.CONSUME(WtsTokens.index)
            $.MANY(() => $.OR([
                {ALT: () => $.CONSUME(WtsTokens.comment)},
            ]))
            $.CONSUME(WtsTokens.lparen)
            $.CONSUME(WtsTokens.text)
            $.CONSUME(WtsTokens.rparen)
        })

        this.performSelfAnalysis()
    }
}

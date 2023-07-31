import {CstNode} from 'chevrotain'
import WtsRule from './wts-rule'
import {IToken} from '@chevrotain/types'

export default interface WtsCstNode extends CstNode {
    // node
    [WtsRule.block]?: CstNode[];
    // token
    [WtsRule.index]?: IToken[],
    [WtsRule.string]?: IToken[],
    [WtsRule.lparen]?: IToken[],
    [WtsRule.rparen]?: IToken[],
    [WtsRule.comment]?: IToken[],
}

// noinspection DuplicatedCode

import {
    Diagnostic,
    DiagnosticSeverity,
    DocumentSymbol,
    FoldingRange,
    Range,
    SemanticTokensBuilder,
    SymbolKind,
    TextDocument
} from 'vscode'
import {WtsParser} from './wts-parser'
import TokenLegend from '../semantic/token-legend'
import {IToken} from '@chevrotain/types'
import WtsRule from './wts-rule'
import {i18n} from '../utils/i18n'
import i18next from 'i18next'
import {IVisitor} from '../utils/ext-provider'
import ExtSettings from '../utils/ext-settings'
import {SymbolIToken, VisitNodes, VisitToken, VisitTokens} from '../utils/ext-visitor'
import {CstNode} from 'chevrotain'

const parser = new WtsParser()

const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

interface Block {
    index: IToken | null
}

export class WtsVisitor extends BaseCstVisitor implements IVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    declare document: TextDocument
    declare semantic: SemanticTokensBuilder
    declare diagnostics: Diagnostic[]
    declare symbols: DocumentSymbol[]
    declare foldings: FoldingRange[]
    declare settings: ExtSettings

    #token(ctx: CstNode, rule: WtsRule, type: TokenLegend): IToken | null {
        return VisitToken(this.document, this.semantic, ctx, rule, type)
    }

    #tokens(ctx: CstNode, rule: WtsRule, type: TokenLegend) {
        return VisitTokens(this.document, this.semantic, ctx, rule, type)
    }

    #nodes<T>(ctx: CstNode, rule: WtsRule, param?: any): T[] {
        return VisitNodes(this, ctx, rule, param)
    }

    #symbol(name: string, detail: string, kind: SymbolKind, start: IToken, end?: IToken, selection?: IToken): DocumentSymbol {
        return SymbolIToken(this.document, this.foldings, name, detail, kind, start, end, selection)
    }

    [WtsRule.wts](ctx: CstNode) {
        //console.log(WtsRule.wts, ctx);
        const indexMap: Record<string, IToken[]> = {}

        for (const block of this.#nodes<Block>(ctx, WtsRule.block)) {
            if (block.index) (indexMap[block.index.image] ??= []).push(block.index)
        }

        for (const tokens of Object.values(indexMap)) {
            if (tokens.length < 2) continue
            for (const token of tokens) {
                this.diagnostics.push({
                    message: i18next.t(i18n.stringIndexRedeclareError, {index: token.image}),
                    range: new Range(
                        this.document.positionAt(token.startOffset),
                        this.document.positionAt(token.startOffset + token.image.length)
                    ),
                    severity: DiagnosticSeverity.Warning,
                })
            }
        }

        return null
    }

    [WtsRule.block](ctx: CstNode): Block {
        //console.log(Rule.block, ctx);

        const index = this.#token(ctx, WtsRule.index, TokenLegend.wts_index)
        const string = this.#token(ctx, WtsRule.string, TokenLegend.wts_string)

        this.#token(ctx, WtsRule.lparen, TokenLegend.wts_paren)
        const rparen = this.#token(ctx, WtsRule.rparen, TokenLegend.wts_paren)

        let stringSymbol: DocumentSymbol | undefined

        if (index && string && rparen) {
            stringSymbol = this.#symbol(index.image, string.image, SymbolKind.String, string, rparen, index)
            this.symbols.push(stringSymbol)
        }

        for (const comment of this.#tokens(ctx, WtsRule.comment, TokenLegend.wts_comment)) {
            if (stringSymbol) stringSymbol.children.push(this.#symbol(comment.image.replace(/^\s*\/\/\s*/, ''), '', SymbolKind.String, comment))
        }

        return {
            index: index,
        }
    }

}

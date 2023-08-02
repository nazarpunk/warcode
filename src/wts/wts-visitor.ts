// noinspection DuplicatedCode

import {
    Diagnostic,
    DiagnosticSeverity,
    DocumentSymbol,
    FoldingRange,
    FoldingRangeKind,
    Range,
    SemanticTokensBuilder,
    SymbolKind,
    TextDocument
} from 'vscode'
import {WtsParser} from './wts-parser'
import TokenLegend from '../semantic/token-legend'
import {IToken} from '@chevrotain/types'
import WtsRule from './wts-rule'
import WtsCstNode from './wts-cst-node'
import {i18n} from '../utils/i18n'
import i18next from 'i18next'
import {IVisitor} from '../utils/ext-provider'

const parser = new WtsParser()

const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

export class WtsVisitor extends BaseCstVisitor implements IVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    declare document: TextDocument
    declare builder: SemanticTokensBuilder
    declare diagnostics: Diagnostic[]
    declare symbols: DocumentSymbol[]
    declare foldings: FoldingRange[]

    #mark(token: IToken | undefined, type: number) {
        if (!token || isNaN(token.startOffset)) return
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
    }

    #token(ctx: WtsCstNode, rule: WtsRule, type: TokenLegend): IToken | null {
        const token = ctx[rule]?.[0] as IToken
        if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) return null
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
        return token
    }

    #documentSymbol(name: string, detail: string, kind: SymbolKind, start: IToken, end?: IToken, selection?: IToken): DocumentSymbol {
        let range: Range
        const startPos = this.document.positionAt(start.startOffset)
        selection ??= start
        if (end) {
            const endPos = this.document.positionAt(end!.startOffset + end!.image.length)
            range = new Range(startPos, endPos)
            if (startPos.line !== endPos.line) this.foldings.push(new FoldingRange(startPos.line, endPos.line, FoldingRangeKind.Region))
        } else {
            range = this.document.lineAt(startPos.line).range
        }
        return new DocumentSymbol(name, detail, kind, range, new Range(
            this.document.positionAt(selection.startOffset),
            this.document.positionAt(selection.startOffset + selection.image.length),
        ))
    }

    [WtsRule.wts](ctx: WtsCstNode) {
        //console.log(WtsRule.wts, ctx);
        const blocks = ctx[WtsRule.block]
        const indexMap: Record<string, IToken[]> = {}
        if (blocks) {
            for (const item of blocks) {
                const block = this.visit(item)
                const index: IToken = block.index
                if (index) (indexMap[index.image] ??= []).push(index)
            }
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

    [WtsRule.block](ctx: WtsCstNode) {
        //console.log(Rule.block, ctx);

        const index = this.#token(ctx, WtsRule.index, TokenLegend.wts_index)
        const string = this.#token(ctx, WtsRule.string, TokenLegend.wts_string)

        this.#token(ctx, WtsRule.lparen, TokenLegend.wts_paren)
        const rparen = this.#token(ctx, WtsRule.rparen, TokenLegend.wts_paren)

        let stringSymbol: DocumentSymbol | undefined

        if (index && string && rparen) {
            stringSymbol = this.#documentSymbol(index.image, string.image, SymbolKind.String, string, rparen, index)
            this.symbols.push(stringSymbol)
        }

        const comments = ctx[WtsRule.comment]
        if (comments) for (const comment of comments) {
            this.#mark(comment, TokenLegend.wts_comment)
            if (stringSymbol) stringSymbol.children.push(this.#documentSymbol(comment.image.replace(/^\s*\/\/\s*/, ''), '', SymbolKind.String, comment))
        }

        return {
            index: index,
        }
    }

}

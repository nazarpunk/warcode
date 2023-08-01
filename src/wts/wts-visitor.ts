import {
    Diagnostic,
    DiagnosticSeverity,
    FoldingRange,
    FoldingRangeKind,
    Location,
    Range, SemanticTokensBuilder,
    SymbolInformation,
    SymbolKind, TextDocument
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
    declare symbols: SymbolInformation[]
    declare foldings: FoldingRange[]

    #mark(token: IToken | undefined, type: number) {
        if (!token || isNaN(token.startOffset)) return
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
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
        const index = ctx[WtsRule.index]?.[0]

        const string = ctx[WtsRule.string]?.[0]
        const rparen = ctx[WtsRule.rparen]?.[0]

        if (index && string && rparen) {
            this.#mark(index, TokenLegend.wts_index)
            this.#mark(string, TokenLegend.wts_string)
            this.#mark(rparen, TokenLegend.wts_paren)

            const start = this.document.positionAt(string.startOffset)
            const end = this.document.positionAt(rparen.startOffset + 1)

            this.symbols.push(new SymbolInformation(
                `${string.image} ${index.image}`,
                SymbolKind.String,
                '',
                new Location(this.document.uri, new Range(start, end)
                ),
            ))

            this.foldings.push(new FoldingRange(
                start.line,
                end.line,
                FoldingRangeKind.Region,
            ))
        }
        this.#mark(ctx[WtsRule.lparen]?.[0], TokenLegend.wts_paren)
        ctx[WtsRule.comment]?.map(item => this.#mark(item, TokenLegend.wts_comment))

        return {
            index: index,
        }
    }

}

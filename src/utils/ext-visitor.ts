import {
    DocumentSymbol,
    FoldingRange,
    FoldingRangeKind,
    Range,
    SemanticTokensBuilder,
    SymbolKind,
    TextDocument
} from 'vscode'
import {ICstVisitor, IToken} from '@chevrotain/types'
import TokenLegend from '../semantic/token-legend'
import {CstNode} from 'chevrotain'
import ITokenToRanges from './vscode/i-token-to-ranges'

export const VisitToken = (
    document: TextDocument,
    semantic: SemanticTokensBuilder,
    ctx: CstNode,
    rule: string,
    type?: TokenLegend
): IToken | null => {
    // @ts-ignore
    const token = ctx[rule]?.[0] as IToken | undefined
    if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) return null
    if (type != undefined) {
        for (const range of ITokenToRanges(token, document)) {
            semantic.push(range.start.line, range.start.character, range.end.character - range.start.character, type)
        }
    }
    return token
}

export const VisitTokens = (
    document: TextDocument,
    semantic: SemanticTokensBuilder,
    ctx: CstNode,
    rule: string,
    type?: TokenLegend
): IToken[] => {
    const out: IToken[] = []
    // @ts-ignore
    const tokens = ctx[rule] as IToken[]
    if (!tokens) return []
    for (const token of tokens) {
        if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) continue
        if (type != undefined) {
            for (const range of ITokenToRanges(token, document)) {
                semantic.push(range.start.line, range.start.character, range.end.character - range.start.character, type)
            }
        }
    }

    return out
}

export const VisitNode = (
    visitor: ICstVisitor<any, any>,
    ctx: CstNode,
    rule: string,
    param?: any
) => {
    // @ts-ignore
    const node = ctx[rule]?.[0] as CstNode
    if (!node) return null
    return visitor.visit(node, param)
}

export const VisitNodes = (
    visitor: ICstVisitor<any, any>,
    ctx: CstNode,
    rule: string,
    param?: any
) => {
    // @ts-ignore
    const nodes = ctx[rule] as CstNode[]
    const out = []
    if (!nodes) return []
    for (const node of nodes) out.push(visitor.visit(node, param))
    return out
}

export const SemanticIToken = (
    document: TextDocument,
    semantic: SemanticTokensBuilder,
    token: IToken | null,
    type: TokenLegend
) => {
    if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) return null
    for (const range of ITokenToRanges(token, document)) {
        semantic.push(range.start.line, range.start.character, range.end.character - range.start.character, type)
    }
    return token
}

export const  SymbolIToken = (
    document: TextDocument,
    foldings: FoldingRange[],
    name: string,
    detail: string,
    kind: SymbolKind,
    start: IToken,
    end?: IToken,
    selection?: IToken
): DocumentSymbol => {
    let range: Range
    const startPos = document.positionAt(start.startOffset)
    selection ??= start
    if (end) {
        const endPos = document.positionAt(end!.startOffset + end!.image.length)
        range = new Range(startPos, endPos)
        if (startPos.line !== endPos.line) foldings.push(new FoldingRange(startPos.line, endPos.line, FoldingRangeKind.Region))
    } else {
        range = document.lineAt(startPos.line).range
    }
    return new DocumentSymbol(name, detail, kind, range, new Range(
        document.positionAt(selection.startOffset),
        document.positionAt(selection.startOffset + selection.image.length),
    ))
}

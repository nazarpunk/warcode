import {Range, TextDocument} from 'vscode'
import {IToken} from '@chevrotain/types'

export default (token: IToken, document: TextDocument): Range[] => {
    const list: Range[] = []
    const start = document.positionAt(token.startOffset)
    const end = document.positionAt(token.startOffset + token.image.length)

    if (start.line === end.line) return [new Range(start, end)]

    for (let l = start.line; l <= end.line; l++) {
        const lr = document.lineAt(l).range
        if (l > start.line && l < end.line) {
            list.push(lr)
            continue
        }
        if (l == start.line) {
            list.push(lr.with({start: start}))
            continue
        }

        if (l == end.line) {
            list.push(lr.with({end: end}))
        }
    }

    return list
}

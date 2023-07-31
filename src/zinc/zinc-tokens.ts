import {createToken, ITokenConfig, Lexer, TokenType} from 'chevrotain'
import ZincRule from './zinc-rule'
import {
    CharCode,
    CharCodeBreakList,
    CharCodeDigitList,
    CharCodeLetterList,
    CharCodeWhitespaceBreakList,
} from '../utils/char-code'

const add = (config: ITokenConfig & {
    color?: string
}): TokenType => {
    return createToken(config)
}

const keyword = (k: ZincRule): TokenType => {
    // color: color ??= '#2C7AD6',
    return createToken({
        name: k,
        pattern: new RegExp(`\\b${k}\\b`),
        start_chars_hint: [k.charCodeAt(0)],
        line_breaks: false,
    })
}

const numberColor = '#e760cc'
const operatorColor = '#e7be60'
const parenColor = '#e1d132'

const ZincTokens: Record<Exclude<ZincRule,
    ZincRule.zinc |
    ZincRule.library_declare |
    ZincRule.library_root |
    ZincRule.access_scope |
    ZincRule.variable_declare |
    ZincRule.function_declare |
    ZincRule.function_locals |
    ZincRule.function_returns |
    ZincRule.function_args |
    ZincRule.function_call |
    ZincRule.return_statement |
    ZincRule.if_statement |
    ZincRule.else_statement |
    ZincRule.elseif_statement |
    ZincRule.addition |
    ZincRule.arrayaccess |
    ZincRule.call_statement |
    ZincRule.exitwhen_statement |
    ZincRule.expression |
    ZincRule.typedname |
    ZincRule.loop_statement |
    ZincRule.multiplication |
    ZincRule.primary |
    ZincRule.set_statement |
    ZincRule.statement
>, TokenType> = {
    [ZincRule.whitespace]: add({
        name: ZincRule.whitespace,
        pattern: /\s+/,
        line_breaks: true,
        start_chars_hint: CharCodeWhitespaceBreakList,
        group: Lexer.SKIPPED,
    }),
    [ZincRule.comment]: add({
        name: ZincRule.comment,
        pattern: /\/\/[^\r\n]*/,
        line_breaks: false,
        start_chars_hint: [CharCode.Slash],
        color: '#308030',
        group: 'comments'
    }),
    [ZincRule.linebreak]: add({
        name: ZincRule.linebreak,
        pattern: /\n|\r\n?/,
        label: '\\n',
        start_chars_hint: CharCodeBreakList,
        line_breaks: true,
    }),
    // keyword
    [ZincRule.library]: keyword(ZincRule.library),
    [ZincRule.and]: keyword(ZincRule.and),
    [ZincRule.array]: keyword(ZincRule.array),
    [ZincRule.call]: keyword(ZincRule.call),
    [ZincRule.public]: keyword(ZincRule.public),
    [ZincRule.private]: keyword(ZincRule.private),
    [ZincRule.constant]: keyword(ZincRule.constant),
    [ZincRule.debug]: keyword(ZincRule.debug),
    [ZincRule.else]: keyword(ZincRule.else),
    [ZincRule.elseif]: keyword(ZincRule.elseif),
    [ZincRule.endfunction]: keyword(ZincRule.endfunction),
    [ZincRule.endglobals]: keyword(ZincRule.endglobals),
    [ZincRule.endif]: keyword(ZincRule.endif),
    [ZincRule.endloop]: keyword(ZincRule.endloop),
    [ZincRule.exitwhen]: keyword(ZincRule.exitwhen),
    [ZincRule.extends]: keyword(ZincRule.extends),
    [ZincRule.function]: keyword(ZincRule.function),
    [ZincRule.globals]: keyword(ZincRule.globals),
    [ZincRule.if]: keyword(ZincRule.if),
    [ZincRule.loop]: keyword(ZincRule.loop),
    [ZincRule.not]: keyword(ZincRule.not),
    [ZincRule.nothing]: keyword(ZincRule.nothing),
    [ZincRule.or]: keyword(ZincRule.or),
    [ZincRule.returns]: keyword(ZincRule.returns),
    [ZincRule.return]: keyword(ZincRule.return),
    [ZincRule.set]: keyword(ZincRule.set),
    [ZincRule.takes]: keyword(ZincRule.takes),
    [ZincRule.then]: keyword(ZincRule.then),
    [ZincRule.type]: keyword(ZincRule.type),
    // operator
    [ZincRule.comma]: add({
        name: ZincRule.comma,
        pattern: /,/,
        start_chars_hint: [CharCode.Comma],
        label: ',',
        line_breaks: false,
        color: '#FFFFFF',
    }),
    [ZincRule.equals]: add({
        name: ZincRule.equals,
        pattern: /==/,
        start_chars_hint: [CharCode.Equal],
        line_breaks: false,
        label: '==',
        color: operatorColor,
    }),
    [ZincRule.assign]: add({
        name: ZincRule.assign,
        pattern: /=/,
        start_chars_hint: [CharCode.Equal],
        line_breaks: false,
        label: '=',
        color: operatorColor,
    }),
    [ZincRule.notequals]: add({
        name: ZincRule.notequals,
        pattern: /!=/,
        start_chars_hint: [CharCode.Exclamation],
        line_breaks: false,
        label: '!=',
        color: operatorColor,
    }),
    [ZincRule.lessorequal]: add({
        name: ZincRule.lessorequal,
        pattern: /<=/,
        start_chars_hint: [CharCode.Less],
        line_breaks: false,
        label: '<=',
        color: operatorColor,
    }),
    [ZincRule.less]: add({
        name: ZincRule.less,
        pattern: /</,
        start_chars_hint: [CharCode.Less],
        line_breaks: false,
        label: '<',
        color: operatorColor,
    }),
    [ZincRule.greatorequal]: add({
        name: ZincRule.greatorequal,
        pattern: />=/,
        start_chars_hint: [CharCode.Greater],
        line_breaks: false,
        label: '>=',
        color: operatorColor,
    }),
    [ZincRule.great]: add({
        name: ZincRule.great,
        pattern: />/,
        start_chars_hint: [CharCode.Greater],
        line_breaks: false,
        label: '>',
        color: operatorColor,
    }),
    [ZincRule.add]: add({
        name: ZincRule.add,
        pattern: /\+/,
        start_chars_hint: [CharCode.Plus],
        line_breaks: false,
        label: '+',
        color: operatorColor,
    }),
    [ZincRule.sub]: add({
        name: ZincRule.sub,
        pattern: /-/,
        start_chars_hint: [CharCode.Minus],
        line_breaks: false,
        label: '-',
        color: operatorColor,
    }),
    [ZincRule.mult]: add({
        name: ZincRule.mult,
        pattern: /\*/,
        start_chars_hint: [CharCode.Asterisk],
        line_breaks: false,
        label: '*',
        color: operatorColor,
    }),
    [ZincRule.div]: add({
        name: ZincRule.div,
        pattern: /\//,
        start_chars_hint: [CharCode.Slash],
        line_breaks: false,
        label: '/',
        color: operatorColor,
    }),
    [ZincRule.semicolon]: add({
        name: ZincRule.semicolon,
        pattern: /;/,
        start_chars_hint: [CharCode.Semicolon],
        line_breaks: false,
        label: ';',
        color: operatorColor,
    }),
    [ZincRule.lparen]: add({
        name: ZincRule.lparen,
        pattern: /\(/,
        start_chars_hint: [CharCode.LeftParenthesis],
        line_breaks: false,
        label: '(',
        color: parenColor,
    }),
    [ZincRule.rparen]: add({
        name: ZincRule.rparen,
        pattern: /\)/,
        start_chars_hint: [CharCode.RightParenthesis],
        line_breaks: false,
        label: ')',
        color: parenColor,
    }),
    [ZincRule.lcurlyparen]: add({
        name: ZincRule.lcurlyparen,
        pattern: /\{/,
        start_chars_hint: [CharCode.LeftCurlyBracket],
        line_breaks: false,
        label: '{',
        color: parenColor,
    }),
    [ZincRule.rcurlyparen]: add({
        name: ZincRule.rcurlyparen,
        pattern: /}/,
        start_chars_hint: [CharCode.RightCurlyBracket],
        line_breaks: false,
        label: '}',
        color: parenColor,
    }),
    [ZincRule.lsquareparen]: add({
        name: ZincRule.lsquareparen,
        pattern: /\[/,
        start_chars_hint: [CharCode.LeftSquareBracket],
        line_breaks: false,
        label: '[',
        color: parenColor,
    }),
    [ZincRule.rsquareparen]: add({
        name: ZincRule.rsquareparen,
        pattern: /]/,
        start_chars_hint: [CharCode.RightSquareBracket],
        line_breaks: false,
        label: ']',
        color: parenColor,
    }),
    //
    [ZincRule.idliteral]: add({
        name: ZincRule.idliteral,
        pattern: /'[^']*'/,
        line_breaks: true,
        start_chars_hint: [CharCode.Apostrophe],
        color: numberColor,
    }),
    [ZincRule.stringliteral]: add({
        name: ZincRule.stringliteral,
        pattern: /"[^"\\]*(?:\\.[^"\\]*)*"/,
        start_chars_hint: [CharCode.Quotation],
        line_breaks: true,
        color: '#CE9178',
    }),
    [ZincRule.real]: add({
        name: ZincRule.real,
        pattern: /\d+\.\d*|\.\d+/,
        line_breaks: false,
        start_chars_hint: [CharCode.Dot, ...CharCodeDigitList],
        color: numberColor,
    }),
    [ZincRule.integer]: add({
        name: ZincRule.integer,
        pattern: /\b0x[0-9a-z]+|\$[0-9a-z]+|\d+\b/i,
        start_chars_hint: [CharCode.Dollar, ...CharCodeDigitList],
        line_breaks: false,
        color: numberColor,
    }),
    [ZincRule.identifier]: add({
        name: ZincRule.identifier,
        pattern: /\b[a-zA-Z][a-zA-Z0-9_]*\b/,
        line_breaks: false,
        start_chars_hint: CharCodeLetterList,
    }),
}
export default ZincTokens

import {createToken, ITokenConfig, Lexer, TokenType} from 'chevrotain'
import ZincRule from './zinc-rule'
import {
    CharCode,
    CharCodeDigitList,
    CharCodeLetterList,
    CharCodeWhitespaceBreakList,
} from '../utils/char-code'

export const ZincColors: Record<string, string> = {
    zinc_argument: '#9A9A9A',
    zinc_variable_global: '#DADADA',
    zinc_variable_local: '#9CDCF0',
    zinc_function_user: '#DCDCAA',
    zinc_function_native: '#C586C0',
    zinc_type_name: '#4EC9B0',
}

const add = (config: ITokenConfig & {
    color?: string
}): TokenType => {
    const color = config.color ?? '#ff0026'
    delete config.color
    ZincColors[`zinc_${config.name}`] = color
    return createToken(config)
}

const keyword = (k: ZincRule, color: string = '#2C7AD6'): TokenType => {
    // color: color ??= '#2C7AD6',
    ZincColors[`zinc_${k}`] = color
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
    ZincRule.identifier_name |
    ZincRule.identifier_type |
    ZincRule.identifier_returns |
    ZincRule.zinc |
    ZincRule.library_declare |
    ZincRule.library_requires |
    ZincRule.library_root |
    ZincRule.library_constant |
    ZincRule.access_scope |
    ZincRule.variable_declare |
    ZincRule.variable_set |
    ZincRule.function_declare |
    ZincRule.function_arg |
    ZincRule.function_call |
    ZincRule.return_statement |
    ZincRule.if_statement |
    ZincRule.else_statement |
    ZincRule.addition |
    ZincRule.arrayaccess |
    ZincRule.call_statement |
    ZincRule.expression |
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
    [ZincRule.comment_multiline]: add({
        name: ZincRule.comment_multiline,
        pattern: /\/\*[^]*?\*\//,
        line_breaks: true,
        start_chars_hint: [CharCode.Slash],
        color: '#308030',
        group: 'comments'
    }),
    // keyword
    [ZincRule.library]: keyword(ZincRule.library),
    [ZincRule.and]: keyword(ZincRule.and),
    [ZincRule.public]: keyword(ZincRule.public),
    [ZincRule.private]: keyword(ZincRule.private),
    [ZincRule.constant]: keyword(ZincRule.constant),
    [ZincRule.debug]: keyword(ZincRule.debug),
    [ZincRule.else]: keyword(ZincRule.else),
    [ZincRule.endfunction]: keyword(ZincRule.endfunction),
    [ZincRule.endglobals]: keyword(ZincRule.endglobals),
    [ZincRule.endloop]: keyword(ZincRule.endloop),
    [ZincRule.extends]: keyword(ZincRule.extends),
    [ZincRule.function]: keyword(ZincRule.function),
    [ZincRule.globals]: keyword(ZincRule.globals),
    [ZincRule.if]: keyword(ZincRule.if),
    [ZincRule.loop]: keyword(ZincRule.loop),
    [ZincRule.not]: keyword(ZincRule.not),
    [ZincRule.or]: keyword(ZincRule.or),
    [ZincRule.optional]: keyword(ZincRule.optional),
    [ZincRule.requires]: keyword(ZincRule.requires),
    [ZincRule.return]: keyword(ZincRule.return),
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
    [ZincRule.returns]: add({
        name: ZincRule.returns,
        pattern: /->/,
        start_chars_hint: [CharCode.Minus],
        line_breaks: false,
        label: '->',
        color: operatorColor,
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

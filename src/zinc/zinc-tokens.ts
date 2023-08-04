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

const operator = (k: ZincRule, label: string, color: string = '#e7be60'): TokenType => {
    ZincColors[`zinc_${k}`] = color
    return createToken({
        name: k,
        pattern: new RegExp(`${label.split('').map(c => `\\${c}`).join('')}`),
        start_chars_hint: [label.charCodeAt(0)],
        label: label,
        line_breaks: false,
    })
}

const numberColor = '#e760cc'
const parenColor = '#e1d132'

const ZincTokens: Record<Exclude<ZincRule,
    ZincRule.identifier_name |
    ZincRule.identifier_type |
    ZincRule.identifier_returns |
    ZincRule.zinc |
    ZincRule.break_statement |
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
    ZincRule.for_statement |
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
    [ZincRule.public]: keyword(ZincRule.public),
    [ZincRule.private]: keyword(ZincRule.private),
    [ZincRule.constant]: keyword(ZincRule.constant),
    [ZincRule.debug]: keyword(ZincRule.debug),
    [ZincRule.else]: keyword(ZincRule.else),
    [ZincRule.endfunction]: keyword(ZincRule.endfunction),
    [ZincRule.endglobals]: keyword(ZincRule.endglobals),
    [ZincRule.extends]: keyword(ZincRule.extends),
    [ZincRule.function]: keyword(ZincRule.function),
    [ZincRule.globals]: keyword(ZincRule.globals),
    [ZincRule.if]: keyword(ZincRule.if),
    [ZincRule.for]: keyword(ZincRule.for),
    [ZincRule.break]: keyword(ZincRule.break),
    [ZincRule.requires]: keyword(ZincRule.requires),
    [ZincRule.optional]: keyword(ZincRule.optional),
    [ZincRule.return]: keyword(ZincRule.return),
    [ZincRule.type]: keyword(ZincRule.type),
    [ZincRule.null]: keyword(ZincRule.null),
    [ZincRule.true]: keyword(ZincRule.true),
    [ZincRule.false]: keyword(ZincRule.false),
    // operator
    [ZincRule.comma]: operator(ZincRule.comma, ',', '#FFFFFF'),
    [ZincRule.notequals]: operator(ZincRule.notequals, '!='),
    [ZincRule.not]: operator(ZincRule.not, '!'),
    [ZincRule.or]: operator(ZincRule.or, '||'),
    [ZincRule.and]: operator(ZincRule.and, '&&'),
    [ZincRule.returns]: operator(ZincRule.returns, '->'),
    [ZincRule.equals]: operator(ZincRule.equals, '=='),
    [ZincRule.assign]: operator(ZincRule.assign, '='),
    [ZincRule.lessorequal]: operator(ZincRule.lessorequal, '<='),
    [ZincRule.less]: operator(ZincRule.less, '<'),
    [ZincRule.greatorequal]: operator(ZincRule.greatorequal, '>='),
    [ZincRule.great]: operator(ZincRule.great, '>'),
    [ZincRule.add]: operator(ZincRule.add, '+'),
    [ZincRule.sub]: operator(ZincRule.sub, '-'),
    [ZincRule.mult]: operator(ZincRule.mult, '*'),
    [ZincRule.div]: operator(ZincRule.div, '/'),
    [ZincRule.semicolon]: operator(ZincRule.semicolon, ';'),
    [ZincRule.lparen]: operator(ZincRule.lparen, '(', parenColor),
    [ZincRule.rparen]: operator(ZincRule.rparen, ')', parenColor),
    [ZincRule.lcurlyparen]: operator(ZincRule.lcurlyparen, '{', parenColor),
    [ZincRule.rcurlyparen]: operator(ZincRule.rcurlyparen, '}', parenColor),
    [ZincRule.lsquareparen]: operator(ZincRule.lsquareparen, '[', parenColor),
    [ZincRule.rsquareparen]: operator(ZincRule.rsquareparen, ']', parenColor),
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

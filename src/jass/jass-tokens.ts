import {createToken, ITokenConfig, Lexer, TokenType} from 'chevrotain'
import JassRule from './jass-rule'
import {
    CharCode,
    CharCodeBreakList,
    CharCodeDigitList,
    CharCodeLetterList,
    CharCodeWhitespaceList
} from '../utils/char-code'

export const JassColors: Record<string, string> = {
    jass_argument: '#9A9A9A',
    jass_variable_global: '#DADADA',
    jass_variable_local: '#9CDCF0',
    jass_function_user: '#DCDCAA',
    jass_function_native: '#C586C0',
    jass_type_name: '#4EC9B0',
}

const add = (config: ITokenConfig & {
    color?: string
}): TokenType => {
    const color = config.color ?? '#ff0026'
    delete config.color
    JassColors[`jass_${config.name}`] = color
    return createToken(config)
}

const keyword = (k: JassRule, color: string = '#2C7AD6', pattern?: RegExp): TokenType => {
    JassColors[`jass_${k}`] = color
    return createToken({
        name: k,
        pattern: pattern ?? new RegExp(`\\b${k}\\b`),
        start_chars_hint: [k.charCodeAt(0)],
        line_breaks: false,
    })
}

const operator = (k: JassRule, label: string, color: string = '#e7be60'): TokenType => {
    JassColors[`jass_${k}`] = color
    return createToken({
        name: k,
        pattern: new RegExp(`${label.split('').map(c => `\\${c}`).join('')}`),
        start_chars_hint: [label.charCodeAt(0)],
        label: label,
        line_breaks: false,
    })
}

const numberColor = '#99CEA8'
const parenColor = '#e1d132'

const JassTokens: Record<Exclude<JassRule,
    JassRule.identifier_name |
    JassRule.identifier_base |
    JassRule.identifier_type |
    JassRule.identifier_returns |
    JassRule.takes_nothing |
    JassRule.returns_nothing |
    JassRule.jass |
    JassRule.jass_constant |
    JassRule.type_declare |
    JassRule.globals_declare |
    JassRule.variable_declare |
    JassRule.native_declare |
    JassRule.function_declare |
    JassRule.function_head |
    JassRule.function_arg |
    JassRule.function_call |
    JassRule.return_statement |
    JassRule.if_statement |
    JassRule.else_statement |
    JassRule.elseif_statement |
    JassRule.addition |
    JassRule.call_statement |
    JassRule.exitwhen_statement |
    JassRule.expression |
    JassRule.loop_statement |
    JassRule.multiplication |
    JassRule.primary |
    JassRule.primary_sub |
    JassRule.set_statement |
    JassRule.statement |
    JassRule.end
>, TokenType> = {
    [JassRule.whitespace]: add({
        name: JassRule.whitespace,
        pattern: /[^\S\r\n]+/,
        line_breaks: false,
        start_chars_hint: CharCodeWhitespaceList,
        group: Lexer.SKIPPED,
    }),
    [JassRule.comment]: add({
        name: JassRule.comment,
        pattern: /\/\/[^\r\n]*/,
        line_breaks: false,
        start_chars_hint: [CharCode.Slash],
        color: '#308030',
        group: 'comments'
    }),
    [JassRule.linebreak]: add({
        name: JassRule.linebreak,
        pattern: /\n\r|\r|\n/,
        label: '\\n',
        start_chars_hint: CharCodeBreakList,
        line_breaks: true,
    }),
    // keyword
    [JassRule.and]: keyword(JassRule.and),
    [JassRule.array]: keyword(JassRule.array),
    [JassRule.call]: keyword(JassRule.call),
    [JassRule.constant]: keyword(JassRule.constant),
    [JassRule.debug]: keyword(JassRule.debug),
    [JassRule.else]: keyword(JassRule.else),
    [JassRule.elseif]: keyword(JassRule.elseif),
    [JassRule.endfunction]: keyword(JassRule.endfunction),
    [JassRule.endglobals]: keyword(JassRule.endglobals),
    [JassRule.endif]: keyword(JassRule.endif),
    [JassRule.endloop]: keyword(JassRule.endloop),
    [JassRule.exitwhen]: keyword(JassRule.exitwhen),
    [JassRule.extends]: keyword(JassRule.extends),
    [JassRule.function]: keyword(JassRule.function),
    [JassRule.false]: keyword(JassRule.false),
    [JassRule.globals]: keyword(JassRule.globals),
    [JassRule.if]: keyword(JassRule.if),
    [JassRule.local]: keyword(JassRule.local),
    [JassRule.loop]: keyword(JassRule.loop),
    [JassRule.native]: keyword(JassRule.native),
    [JassRule.nothing]: keyword(JassRule.nothing),
    [JassRule.not]: keyword(JassRule.not),
    [JassRule.null]: keyword(JassRule.null),
    [JassRule.or]: keyword(JassRule.or),
    [JassRule.returns]: keyword(JassRule.returns),
    [JassRule.return]: keyword(JassRule.return),
    [JassRule.set]: keyword(JassRule.set),
    [JassRule.takes]: keyword(JassRule.takes),
    [JassRule.true]: keyword(JassRule.true),
    [JassRule.then]: keyword(JassRule.then, undefined, /then\b/),
    [JassRule.type]: keyword(JassRule.type),
    // operator
    [JassRule.comma]: operator(JassRule.comma, ',', '#FFFFFF'),
    [JassRule.equals]: operator(JassRule.equals, '=='),
    [JassRule.assign]: operator(JassRule.assign, '='),
    [JassRule.notequals]: operator(JassRule.notequals, '!='),
    [JassRule.lessorequal]: operator(JassRule.lessorequal, '<='),
    [JassRule.less]: operator(JassRule.less, '<'),
    [JassRule.greatorequal]: operator(JassRule.greatorequal, '>='),
    [JassRule.great]: operator(JassRule.great, '>'),
    [JassRule.add]: operator(JassRule.add, '+'),
    [JassRule.sub]: operator(JassRule.sub, '-'),
    [JassRule.mult]: operator(JassRule.mult, '*'),
    [JassRule.div]: operator(JassRule.div, '/'),
    [JassRule.lparen]: operator(JassRule.lparen, '(', parenColor),
    [JassRule.rparen]: operator(JassRule.rparen, ')', parenColor),
    [JassRule.lsquareparen]: operator(JassRule.lsquareparen, '[', parenColor),
    [JassRule.rsquareparen]: operator(JassRule.rsquareparen, ']', parenColor),
    //
    [JassRule.rawcode]: add({
        name: JassRule.rawcode,
        pattern: /'[^']*'/,
        line_breaks: true,
        start_chars_hint: [CharCode.Apostrophe],
        color: numberColor,
    }),
    [JassRule.stringliteral]: add({
        name: JassRule.stringliteral,
        pattern: /"[^"\\]*(?:\\.[^"\\]*)*"/,
        start_chars_hint: [CharCode.Quotation],
        line_breaks: true,
        color: '#CE9178',
    }),
    [JassRule.real]: add({
        name: JassRule.real,
        pattern: /\d+\.\d*|\.\d+/,
        line_breaks: false,
        start_chars_hint: [CharCode.Dot, ...CharCodeDigitList],
        color: numberColor,
    }),
    [JassRule.integer]: add({
        name: JassRule.integer,
        pattern: /0x[0-9a-z]+|\$[0-9a-z]+|\d+/i,
        start_chars_hint: [CharCode.Dollar, ...CharCodeDigitList],
        line_breaks: false,
        color: numberColor,
    }),
    [JassRule.identifier]: add({
        name: JassRule.identifier,
        pattern: /\b[a-zA-Z][a-zA-Z0-9_]*\b/,
        line_breaks: false,
        start_chars_hint: CharCodeLetterList,
    }),
}
export default JassTokens

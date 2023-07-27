import {createToken, ITokenConfig, Lexer, TokenType} from "chevrotain";
import JassRule from "./jass-rule";
import {
    CharCode,
    CharCodeBreakList,
    CharCodeDigitList,
    CharCodeLetterList,
    CharCodeWhitespaceList
} from "../utils/char-code";

const add = (config: ITokenConfig & {
    color?: string
}): TokenType => {
    return createToken(config);
};

const keyword = (k: JassRule): TokenType => {
    // color: color ??= '#2C7AD6',
    return createToken({
        name: k,
        pattern: new RegExp(`\\b${k}\\b`),
        start_chars_hint: [k.charCodeAt(0)],
        line_breaks: false,
    });
};

const numberColor = '#e760cc';
const operatorColor = '#e7be60';
const parenColor = '#e1d132';

const JassTokens: Record<Exclude<JassRule,
    JassRule.jass |
    JassRule.root |
    JassRule.type_declare |
    JassRule.globals_declare |
    JassRule.variable_declare |
    JassRule.native_declare |
    JassRule.function_declare |
    JassRule.function_locals |
    JassRule.function_returns |
    JassRule.function_args |
    JassRule.function_call |
    JassRule.return_statement |
    JassRule.if_statement |
    JassRule.else_statement |
    JassRule.elseif_statement |
    JassRule.addition |
    JassRule.arrayaccess |
    JassRule.call_statement |
    JassRule.exitwhen_statement |
    JassRule.expression |
    JassRule.typedname |
    JassRule.loop_statement |
    JassRule.multiplication |
    JassRule.primary |
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
        color: '#308030'
    }),
    [JassRule.linebreak]: add({
        name: JassRule.linebreak,
        pattern: /\n|\r\n?/,
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
    [JassRule.globals]: keyword(JassRule.globals),
    [JassRule.if]: keyword(JassRule.if),
    [JassRule.local]: keyword(JassRule.local),
    [JassRule.loop]: keyword(JassRule.loop),
    [JassRule.native]: keyword(JassRule.native),
    [JassRule.not]: keyword(JassRule.not),
    [JassRule.nothing]: keyword(JassRule.nothing),
    [JassRule.or]: keyword(JassRule.or),
    [JassRule.returns]: keyword(JassRule.returns),
    [JassRule.return]: keyword(JassRule.return),
    [JassRule.set]: keyword(JassRule.set),
    [JassRule.takes]: keyword(JassRule.takes),
    [JassRule.then]: keyword(JassRule.then),
    [JassRule.type]: keyword(JassRule.type),
    // operator
    [JassRule.comma]: add({
        name: JassRule.comma,
        pattern: /,/,
        start_chars_hint: [CharCode.Comma],
        label: ',',
        line_breaks: false,
        color: '#FFFFFF',
    }),
    [JassRule.equals]: add({
        name: JassRule.equals,
        pattern: /==/,
        start_chars_hint: [CharCode.Equal],
        line_breaks: false,
        label: '==',
        color: operatorColor,
    }),
    [JassRule.assign]: add({
        name: JassRule.assign,
        pattern: /=/,
        start_chars_hint: [CharCode.Equal],
        line_breaks: false,
        label: '=',
        color: operatorColor,
    }),
    [JassRule.notequals]: add({
        name: JassRule.notequals,
        pattern: /!=/,
        start_chars_hint: [CharCode.Exclamation],
        line_breaks: false,
        label: '!=',
        color: operatorColor,
    }),
    [JassRule.lessorequal]: add({
        name: JassRule.lessorequal,
        pattern: /<=/,
        start_chars_hint: [CharCode.Less],
        line_breaks: false,
        label: '<=',
        color: operatorColor,
    }),
    [JassRule.less]: add({
        name: JassRule.less,
        pattern: /</,
        start_chars_hint: [CharCode.Less],
        line_breaks: false,
        label: '<',
        color: operatorColor,
    }),
    [JassRule.greatorequal]: add({
        name: JassRule.greatorequal,
        pattern: />=/,
        start_chars_hint: [CharCode.Greater],
        line_breaks: false,
        label: '>=',
        color: operatorColor,
    }),
    [JassRule.great]: add({
        name: JassRule.great,
        pattern: />/,
        start_chars_hint: [CharCode.Greater],
        line_breaks: false,
        label: '>',
        color: operatorColor,
    }),
    [JassRule.add]: add({
        name: JassRule.add,
        pattern: /\+/,
        start_chars_hint: [CharCode.Plus],
        line_breaks: false,
        label: '+',
        color: operatorColor,
    }),
    [JassRule.sub]: add({
        name: JassRule.sub,
        pattern: /-/,
        start_chars_hint: [CharCode.Minus],
        line_breaks: false,
        label: '-',
        color: operatorColor,
    }),
    [JassRule.mult]: add({
        name: JassRule.mult,
        pattern: /\*/,
        start_chars_hint: [CharCode.Asterisk],
        line_breaks: false,
        label: '*',
        color: operatorColor,
    }),
    [JassRule.div]: add({
        name: JassRule.div,
        pattern: /\//,
        start_chars_hint: [CharCode.Slash],
        line_breaks: false,
        label: '/',
        color: operatorColor,
    }),
    [JassRule.lparen]: add({
        name: JassRule.lparen,
        pattern: /\(/,
        start_chars_hint: [CharCode.LeftParenthesis],
        line_breaks: false,
        label: '(',
        color: parenColor,
    }),
    [JassRule.rparen]: add({
        name: JassRule.rparen,
        pattern: /\)/,
        start_chars_hint: [CharCode.RightParenthesis],
        line_breaks: false,
        label: ')',
        color: parenColor,
    }),
    [JassRule.lsquareparen]: add({
        name: JassRule.lsquareparen,
        pattern: /\[/,
        start_chars_hint: [CharCode.LeftSquareBracket],
        line_breaks: false,
        label: '[',
        color: parenColor,
    }),
    [JassRule.rsquareparen]: add({
        name: JassRule.rsquareparen,
        pattern: /]/,
        start_chars_hint: [CharCode.RightSquareBracket],
        line_breaks: false,
        label: ']',
        color: parenColor,
    }),
    //
    [JassRule.idliteral]: add({
        name: JassRule.idliteral,
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
        pattern: /\b0x[0-9a-z]+|\$[0-9a-z]+|\d+\b/i,
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
};
export default JassTokens;

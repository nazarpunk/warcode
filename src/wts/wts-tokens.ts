import WtsRule from "./wts-rule";
import {createToken, Lexer, tokenMatcher, TokenType} from "chevrotain";
import {CustomPatternMatcherReturn, IToken} from "@chevrotain/types";
import {CharCode, CharCodeDigitList, CharCodeWhitespaceBreakList} from "../utils/char-code";

const whitespacePattern = (text: string, startOffset: number, tokens: IToken[]): CustomPatternMatcherReturn | null => {
    if (tokens.length > 0) {
        const lastMatchedToken = tokens[tokens.length - 1];
        if (tokenMatcher(lastMatchedToken, WtsTokens.lparen)) return null;
    }
    let endOffset = startOffset;
    let charCode = text.charCodeAt(endOffset);
    while (CharCodeWhitespaceBreakList.indexOf(charCode) >= 0) {
        endOffset++;
        charCode = text.charCodeAt(endOffset);
    }
    return endOffset === startOffset ? null : [text.substring(startOffset, endOffset)];
};

const WtsTokens: Record<Exclude<WtsRule, WtsRule.wts | WtsRule.block>, TokenType> = {
    [WtsRule.whitespace]: createToken({
        name: WtsRule.whitespace,
        pattern: whitespacePattern,
        line_breaks: true,
        start_chars_hint: CharCodeWhitespaceBreakList,
        group: Lexer.SKIPPED,
    }),
    [WtsRule.string]: createToken({
        name: WtsRule.string,
        pattern: /\bSTRING\b/,
        start_chars_hint: [CharCode.S],
        line_breaks: false,
    }),
    [WtsRule.index]: createToken({
        name: WtsRule.index,
        pattern: /\d+/,
        start_chars_hint: CharCodeDigitList,
        line_breaks: false,
    }),
    [WtsRule.comment]: createToken({
        name: WtsRule.comment,
        pattern: /\/\/[^\r\n]*/,
        start_chars_hint: [CharCode.Slash],
        line_breaks: false,
    }),
    [WtsRule.lparen]: createToken({
        name: WtsRule.lparen,
        pattern: /\{/,
        line_breaks: false,
        start_chars_hint: [CharCode.LeftCurlyBracket],
        label: '{',
    }),
    [WtsRule.rparen]: createToken({
        name: WtsRule.rparen,
        pattern: /}/,
        line_breaks: false,
        start_chars_hint: [CharCode.RightCurlyBracket],
        label: '}',
    }),
    [WtsRule.text]: createToken({
        name: WtsRule.text,
        pattern: /[^}]+/,
        line_breaks: true,
    }),
};

export default WtsTokens;

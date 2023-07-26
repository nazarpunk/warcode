import WtsRule from "./wts-rule";
import {createToken, Lexer, tokenMatcher, TokenType} from "chevrotain";
import {CustomPatternMatcherReturn, IToken} from "@chevrotain/types";
import isCharWhitespace from "../utils/is-char-whitespace";

const whitespacePattern = (text: string, startOffset: number, tokens: IToken[]): CustomPatternMatcherReturn | null => {
    if (tokens.length > 0) {
        const lastMatchedToken = tokens[tokens.length - 1];
        if (tokenMatcher(lastMatchedToken, WtsTokens.lparen)) return null;
    }

    let endOffset = startOffset;
    let charCode = text.charCodeAt(endOffset);

    while (isCharWhitespace(charCode)) {
        endOffset++;
        charCode = text.charCodeAt(endOffset);
    }
    if (endOffset === startOffset) {
        return null;
    } else {
        const matchedString = text.substring(startOffset, endOffset);
        return [matchedString];
    }
};

const WtsTokens: Record<Exclude<WtsRule, WtsRule.wts | WtsRule.block>, TokenType> = {
    [WtsRule.whitespace]: createToken({
        name: WtsRule.whitespace,
        pattern: whitespacePattern,
        line_breaks: true,
        group: Lexer.SKIPPED,
    }),
    [WtsRule.string]: createToken({
        name: WtsRule.string,
        pattern: /\bSTRING\b/,
        start_chars_hint: ['S'],
        line_breaks: false,
    }),
    [WtsRule.index]: createToken({
        name: WtsRule.index,
        pattern: /\d+/,
        line_breaks: false,
    }),
    [WtsRule.comment]: createToken({
        name: WtsRule.comment,
        pattern: /\/\/[^\r\n]*/,
        start_chars_hint: ['/'],
        line_breaks: false,
    }),
    [WtsRule.lparen]: createToken({
        name: WtsRule.lparen,
        pattern: /\{/,
        line_breaks: false,
        start_chars_hint: ['{'],
        label: '{',
    }),
    [WtsRule.rparen]: createToken({
        name: WtsRule.rparen,
        pattern: /}/,
        line_breaks: false,
        start_chars_hint: ['}'],
        label: '}',
    }),
    [WtsRule.text]: createToken({
        name: WtsRule.text,
        pattern: /[^}]+/,
        line_breaks: true,
    }),
}

export default WtsTokens;

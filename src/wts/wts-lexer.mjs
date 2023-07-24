import {createToken, Lexer, tokenMatcher} from "chevrotain";

/*
Space: 32
Tab: 9
Carriage Return: 13
Line Feed: 10
Form Feed: 12
Vertical Tab: 11
*/

const isWhitespace = charCode => charCode === 32 || charCode === 9 || charCode === 13 || charCode === 10 || charCode === 12 || charCode === 11;

function whitespacePattern(text, startOffset, matchedTokens) {
    if (matchedTokens.length > 0) {
        let lastMatchedToken = matchedTokens[matchedTokens.length - 1];
        if (tokenMatcher(lastMatchedToken, WtsTokenMap.lparen)) return null;
    }

    let endOffset = startOffset;
    let charCode = text.charCodeAt(endOffset);

    while (isWhitespace(charCode)) {
        endOffset++;
        charCode = text.charCodeAt(endOffset);
    }
    if (endOffset === startOffset) {
        return null;
    } else {
        let matchedString = text.substring(startOffset, endOffset);
        return [matchedString];
    }
}


export const WtsTokenMap = {
    whitespace: createToken({
        name: 'whitespace',
        //pattern: /\s+/,
        pattern: whitespacePattern,
        line_breaks: true,
        group: Lexer.SKIPPED,
    }),
    string: createToken({
        name: 'string',
        pattern: /\bSTRING\b/,
        start_chars_hint: ['S'],
        line_breaks: false,
    }),
    index: createToken({
        name: 'index',
        pattern: /\d+/,
        line_breaks: false,
    }),
    comment: createToken({
        name: 'comment',
        pattern: /\/\/[^\r\n]*/,
        start_chars_hint: ['/'],
        line_breaks: false,
    }),
    lparen: createToken({
        name: 'lparen',
        pattern: /\{/,
        line_breaks: false,
        start_chars_hint: ['{'],
        label: '{',
    }),
    rparen: createToken({
        name: 'rparen',
        pattern: /}/,
        line_breaks: false,
        start_chars_hint: ['}'],
        label: '}',
    }),
    text: createToken({
        name: 'text',
        pattern: /[^}]+/,
        line_breaks: true,
    }),
}

export const WtsTokenList = [
    WtsTokenMap.whitespace,
    WtsTokenMap.string,
    WtsTokenMap.index,
    WtsTokenMap.comment,
    WtsTokenMap.lparen,
    WtsTokenMap.rparen,
    WtsTokenMap.text,
];

const lexer = new Lexer(WtsTokenList);
for (const error of lexer.lexerDefinitionErrors) console.error(error);

export default lexer;



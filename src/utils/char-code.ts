// https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block)
export const enum CharCode {
    // noinspection JSUnusedGlobalSymbols
    HorizontalTab = 0x9,
    LineFeed = 0xA,
    LineTabulation = 0xB,
    FormFeed = 0xC,
    CarriageReturn = 0xD,
    Space = 0x20,
    Exclamation = 0x21, // !
    Quotation = 0x22, // "
    Dollar = 0x24, // $
    Ampersand = 0x26, // &
    Apostrophe = 0x27, // '
    LeftParenthesis = 0x28, // (
    RightParenthesis = 0x29, // )
    Asterisk = 0x2A, // *
    Plus = 0x2B, // +
    Comma = 0x2C, // ,
    Minus = 0x2D, // -
    Dot = 0x2E, // .
    Slash = 0x2F, // /
    d0 = 0x30, // 0
    d9 = 0x39, // 9
    Semicolon = 0x3B, // ;
    Less = 0x3C, // <
    Equal = 0x3D, // =
    Greater = 0x3E, // >
    A = 0x41, // A
    S = 0x53, // S
    Z = 0x5A, // Z
    LeftSquareBracket = 0x5B, // [
    RightSquareBracket = 0x5D, // ]
    LeftCurlyBracket = 0x7B, // {
    VerticalBar = 0x7C, // |
    RightCurlyBracket = 0x7D, // }
    a = 0x61, // a
    z = 0x7A, // z
    NextLine = 0x85,
}

// https://en.wikipedia.org/wiki/Whitespace_character
export const CharCodeWhitespaceList = [
    CharCode.HorizontalTab,
    CharCode.Space,
]

export const CharCodeWhitespaceBreakList = [
    CharCode.HorizontalTab,
    CharCode.LineFeed,
    CharCode.LineTabulation,
    CharCode.FormFeed,
    CharCode.CarriageReturn,
    CharCode.Space,
    CharCode.NextLine,
]

export const CharCodeBreakList = [
    CharCode.LineFeed,
    CharCode.CarriageReturn,
]

export const CharCodeDigitList: number[] = []
for (let i = CharCode.d0; i <= CharCode.d9; i++) CharCodeDigitList.push(i)

export const CharCodeLetterList: number[] = []
for (let i = CharCode.A; i <= CharCode.Z; i++) CharCodeLetterList.push(i)
for (let i = CharCode.a; i <= CharCode.z; i++) CharCodeLetterList.push(i)

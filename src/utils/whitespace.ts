// https://en.wikipedia.org/wiki/Whitespace_character

const enum code {
    tab = 9, // Tab
    lf = 10, // Line Feed
    vt = 11, // Vertical Tab
    ff = 12, // Form Feed
    cr = 13, // Carriage Return
    space = 32, // Space
}




export default (charCode: number, linebreak = true) =>
    charCode === code.space ||
    charCode === code.tab ||
    linebreak && charCode === code.cr ||
    linebreak && charCode === code.lf ||
    linebreak && charCode === code.ff ||
    charCode === code.vt;
